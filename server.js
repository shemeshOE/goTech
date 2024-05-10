import Fastify from 'fastify';
import { getFollowupQuestions, getQuestionnaire, insertResults } from './db-functions.js';

const getQuestionsAndOptions = (preprocessedQuestions) => {
  const questions = preprocessedQuestions.map((q) => {
    const question = q.dataValues;
    question.options = question.options.map((o) => o.dataValues);
    return question;
  });
  return questions;
};

const fastify = Fastify({
  logger: true,
});

fastify.addSchema({
  $id: 'option',
  type: 'object',
  properties: {
    text: { type: 'string' },
    followupQuestions: { type: 'array', items: { $ref: 'question' } },
    hasFreeText: { type: 'boolean' },
  },
});

fastify.addSchema({
  $id: 'question',
  type: 'object',
  properties: {
    title: { type: 'string' },
    options: { type: 'array', items: { $ref: 'option' } },
    isFreeText: { type: 'boolean' },
    isRequired: { type: 'boolean' },
  },
});

fastify.addSchema({
  $id: 'result',
  type: 'object',
  properties: {
    questionid: { type: 'integer' },
    chosenoptionid: { type: 'integer' },
    freetextresult: { type: 'string' },
  },
  anyOf: [{ required: ['chosenoptionid'] }, { required: ['freetextresult'] }],
  required: ['questionid'],
});

fastify.route({
  method: 'GET',
  url: '/questionnaire',
  schema: {
    querystring: {
      id: { type: 'integer' },
    },
  },
  handler: function (request, reply) {
    getQuestionnaire(request.query.id).then((res) => {
      const questions = getQuestionsAndOptions(res.dataValues.questions);
      const questionnaire = { id: res.dataValues.id, name: res.dataValues.name, questions };
      reply.send(questionnaire);
    });
  },
});

fastify.route({
  method: 'GET',
  url: '/followups',
  schema: {
    querystring: {
      optionId: { type: 'integer' },
    },
  },
  handler: function (request, reply) {
    getFollowupQuestions(request.query.optionId).then((res) => {
      const questions = getQuestionsAndOptions(res);
      reply.send(questions);
    });
  },
});

fastify.route({
  method: 'POST',
  url: '/submitQuestionnaire',
  schema: {
    body: {
      questionnaireid: { type: 'integer' },
      username: { type: 'string' },
      results: { type: 'array', items: { $ref: 'result' } },
    },
    required: ['questionnaireid', 'results', 'username'],
  },
  handler: function (request, reply) {
    insertResults(request.body)
      .then(() => {
        reply.code(200).send();
      })
      .catch((err) => {
        reply.send(err.message);
      });
  },
});

// Run the server!
try {
  await fastify.listen({ port: 3000 });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
