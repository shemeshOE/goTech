import { Option, Question, Questionnaire, Result } from './models.js';

export const getQuestionnaire = (id) => {
  return Questionnaire.findByPk(id, {
    include: [
      {
        model: Question,
        where: { followupof: null },
        include: [
          {
            model: Option,
          },
        ],
      },
    ],
  });
};

export const getFollowupQuestions = (optionId) => {
  return Question.findAll({
    where: { followupof: optionId },
    include: [
      {
        model: Option,
      },
    ],
  });
};

export const insertResults = async (questionnaireResults) => {
  const { questionnaireid, results, username } = questionnaireResults;
  const questionnaire = await Questionnaire.findByPk(questionnaireid);
  if (!questionnaire) {
    throw new Error('questionnaire not found');
  }
  const requiredQuestions = await Question.findAll({
    where: {
      questionnaireid: questionnaire.id,
      followupof: null,
      isrequired: true,
    },
  });

  for (var result of results) {
    const question = await Question.findByPk(result.questionid);
    const option = await Option.findByPk(result.chosenoptionid);
    if (!question) {
      throw new Error(`question ${result.questionid} not found`);
    }
    if (question.questionnaireid !== questionnaireid) {
      throw new Error(`question ${result.questionid} is not in the questionnaire`);
    }
    if (result.chosenoptionid && !option) {
      throw new Error(`option ${result.chosenoptionid} not found`);
    }
    if (result.chosenoptionid && option.questionid !== result.questionid) {
      throw new Error(`option ${result.chosenoptionid} not in question ${result.questionid}`);
    }
    if (result.freetextresult && !result.chosenoptionid && !question.isfreetext) {
      throw new Error(`question ${result.questionid} is not a free text question`);
    }
    if (!result.freetextresult && question.isfreetext) {
      throw new Error(`question ${result.questionid} is a free text question`);
    }
    if (result.freetextresult && result.chosenoptionid && !option.hasfreetext) {
      throw new Error(`option ${result.chosenoptionid} does not have a free text field`);
    }
    if (!result.freetextresult && result.chosenoptionid && option.hasfreetext) {
      throw new Error(`option ${result.chosenoptionid} needs to have free text as well`);
    }
    if (result.chosenoptionid) {
      const requiredFollowups = await Question.findAll({
        where: {
          followupof: result.chosenoptionid,
          isrequired: true,
        },
      });
      requiredQuestions.push(...requiredFollowups);
    }
  }

  if (!requiredQuestions.every((rq) => results.some((r) => rq.id === r.questionid))) {
    throw new Error(`required questions are missing answers`);
  }

  await Result.bulkCreate(
    results.map((r) => {
      return { ...r, username };
    })
  );
};
