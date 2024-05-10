CREATE TABLE questionnaires(
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(255)
);

CREATE TABLE questions(
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title VARCHAR(255),
    questionnaireId INTEGER,
    isFreeText BOOLEAN,
    isRequired BOOLEAN,
    followupOf INTEGER,
    FOREIGN KEY(questionnaireId) REFERENCES questionnaires(id) ON DELETE CASCADE
);

CREATE TABLE options(
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    text VARCHAR(255),
    questionId INTEGER,
    hasFreeText BOOLEAN,
    FOREIGN KEY(questionId) REFERENCES questions(id) ON DELETE CASCADE
);

ALTER TABLE questions
ADD FOREIGN KEY(followupOf) REFERENCES options(id) ON DELETE CASCADE;

CREATE TABLE results(
    username VARCHAR(255),
    questionId INTEGER,
    chosenOptionId INTEGER,
    freeTextResult VARCHAR(255),
    PRIMARY KEY(username, questionId),
    FOREIGN KEY(questionId) REFERENCES questions(id) ON DELETE CASCADE,
    FOREIGN KEY(chosenOptionId) REFERENCES options(id) ON DELETE CASCADE
);



INSERT INTO questionnaires(name) VALUES('Holy grail questionnaire');

INSERT INTO questions(title, questionnaireid, isfreetext, isrequired) VALUES('What is your name?',1, TRUE, TRUE);
INSERT INTO questions(title, questionnaireid, isfreetext, isrequired) VALUES('What is your quest?',1, TRUE, TRUE);
INSERT INTO questions(title, questionnaireid, isfreetext, isrequired) VALUES('What is your favourite colour?',1, TRUE, FALSE);
INSERT INTO questions(title, questionnaireid, isfreetext, isrequired) VALUES('What is the air speed velocity of an unladen swallow?',1, FALSE, TRUE);

INSERT INTO options(text, questionid, hasfreetext) VALUES('I don''t know',4, FALSE);
INSERT INTO options(text, questionid, hasfreetext) VALUES('What do you mean?',4, FALSE);

INSERT INTO questions(title, questionnaireid, isfreetext, isrequired, followupof) VALUES('An African or a European swallow?',1, FALSE, TRUE, 2);

INSERT INTO options(text, questionid, hasfreetext) VALUES('Huh? I... I don''t know that. Auuuuuuuugh!',5, FALSE);





INSERT INTO questionnaires(name) VALUES('Pokemon questionnaire');

INSERT INTO questions(title, questionnaireid, isfreetext, isrequired) VALUES('Are you a boy or a girl?',2, False, TRUE);
INSERT INTO questions(title, questionnaireid, isfreetext, isrequired) VALUES('What is your name?',2, TRUE, TRUE);
INSERT INTO questions(title, questionnaireid, isfreetext, isrequired) VALUES('Which pokemon would you like as your starter?',2, FALSE, TRUE);

INSERT INTO options(text, questionid, hasfreetext) VALUES('Boy',6, FALSE);
INSERT INTO options(text, questionid, hasfreetext) VALUES('Girl',6, FALSE);
INSERT INTO options(text, questionid, hasfreetext) VALUES('Bulbasaur',8, FALSE);
INSERT INTO options(text, questionid, hasfreetext) VALUES('Charmander',8, FALSE);
INSERT INTO options(text, questionid, hasfreetext) VALUES('Squirtle',8, FALSE);
INSERT INTO options(text, questionid, hasfreetext) VALUES('Pikachu',8, FALSE);
INSERT INTO options(text, questionid, hasfreetext) VALUES('Other',8, TRUE);