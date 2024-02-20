import {createSlice, createSelector} from "@reduxjs/toolkit";

interface PersonalityQuizState {
  currentQuestion: number;
  currentAnswers: (number)[];
  // surveyQuestions: Map<number,string>;
}

interface SaveQuizAnswerAction {
  type: string,
  payload: {
    questionNumber: number,
    responseValue: number,
  }
}

export const surveyQuestions = new Map<number,string>([
  [1, "Is talkative"],
  [2, "Tends to find fault with other"],
  [3, "Does a thorough job"],
  [4, "Is depressed, blue"],
  [5, "Is original, comes up with new ideas"],
  [6, "Is reserved"],
  [7, "Is helpful and unselfish with others"],
  [8, "Can be somewhat careless"],
  [9, "Is relaxed, handles stress well"],
  [10, "Is curious about many different things"],
  [11, "Is full of energy"],
  [12, "Starts quarrels with others"],
  [13, "Is a reliable worker"],
  [14, "Can be tense"],
  [15, "Is ingenious, a deep thinker"],
  [16, "Generates a lot of enthusiasm"],
  [17, "Has a forgiving nature"],
  [18, "Tends to be disorganized"],
  [19, "Worries a lot"],
  [20, "Has an active imagination"],
  [21, "Tends to be quiet"],
  [22, "Is generally trusting"],
  [23, "Tends to be lazy"],
  [24, "Is emotionally stable, not easily upset"],
  [25, "Is inventive"],
  [26, "Has an assertive personality"],
  [27, "Can be cold and aloof"],
  [28, "Perseveres until the task in finished"],
  [29, "Can be moody"],
  [30, "Values artistic, aesthetic experiences"],
  [31, "Is sometimes shy, inhibited"],
  [32, "Is considerate and kind to almost everyone"],
  [33, "Does things efficiently"],
  [34, "Remains calm in tense situations"],
  [35, "Prefers work that is routine"],
  [36, "Is outgoing, sociable"],
  [37, "Is sometimes rude to others"],
  [38, "Makes plans and follows through with them"],
  [39, "Gets nervous easily"],
  [40, "Likes to reflect, play with ideas"],
  [41, "Has few artistic interests"],
  [42, "Likes to cooperate with others"],
  [43, "Is easily distracted"],
  [44, "Is sophisticated in art, music, or literature"]
]);

const initialState = {
  currentQuestion: 0,
  currentAnswers: Array(surveyQuestions.size).fill(-1),
} as PersonalityQuizState

const personalityQuizSlice = createSlice({
  name: 'bigfive',
  initialState,
  reducers: {
    nextQuestion: (state, action: SaveQuizAnswerAction) => {
      const newAnswers = state.currentAnswers.slice();
      newAnswers[action.payload.questionNumber] = action.payload.responseValue
      state.currentAnswers = newAnswers;

      if (state.currentQuestion+1 < surveyQuestions.size)
        state.currentQuestion++;
    },
    previousQuestion: (state, action: SaveQuizAnswerAction) => {
      const newAnswers = state.currentAnswers.slice();
      newAnswers[action.payload.questionNumber] = action.payload.responseValue
      state.currentAnswers = newAnswers;

      if ( state.currentQuestion > 0 )
        state.currentQuestion--;
    },
    saveAnswer: (state, action: SaveQuizAnswerAction) => {
      const newAnswers = state.currentAnswers.slice();
      newAnswers[action.payload.questionNumber] = action.payload.responseValue
      state.currentAnswers = newAnswers;
    },
    resetPersonalityQuiz: (state) => {
      state.currentQuestion = 0;
      state.currentAnswers = Array(surveyQuestions.size).fill(-1);
    }
  }
})

export const {nextQuestion, previousQuestion, saveAnswer, resetPersonalityQuiz} = personalityQuizSlice.actions;

/**
 * Gets the current answers to the survey questions.
 *
 * @param state
 */
export const selectQuizAnswers = (state: { bigfive: PersonalityQuizState }) => state.bigfive.currentAnswers;

/**
 * Gets the index of the current survey questions
 *
 * @param state
 */
export const selectCurrentQuestion = (state: { bigfive: PersonalityQuizState }) => state.bigfive.currentQuestion;

export const selectCurrentResponse = (state: { bigfive: PersonalityQuizState }) => state.bigfive.currentAnswers[state.bigfive.currentQuestion];

const scaleScore = (x: number) => (x/10*4+1);
const reverseScaleScore = (x: number) => {return 6 - scaleScore(x)};
const score = ( x:number, reverse: boolean = false) => {
  if ( x < 0 ) return Number.NEGATIVE_INFINITY;
  return reverse?reverseScaleScore(x):scaleScore(x);
}

let _extraversionScore: number = 5;
let _agreeablenessScore: number = 5;
let _opennessScore: number = 5;
let _conscientiousnessScore: number = 5;
let _neuroticismScore: number = 5;

const selectAnswer1 = (state: { bigfive: { currentAnswers: number[]; }; }) => state.bigfive.currentAnswers[0];
const selectAnswer2 = (state: { bigfive: { currentAnswers: number[]; }; }) => state.bigfive.currentAnswers[1];
const selectAnswer3 = (state: { bigfive: { currentAnswers: number[]; }; }) => state.bigfive.currentAnswers[2];
const selectAnswer4 = (state: { bigfive: { currentAnswers: number[]; }; }) => state.bigfive.currentAnswers[3];
const selectAnswer5 = (state: { bigfive: { currentAnswers: number[]; }; }) => state.bigfive.currentAnswers[4];
const selectAnswer6 = (state: { bigfive: { currentAnswers: number[]; }; }) => state.bigfive.currentAnswers[5];
const selectAnswer7 = (state: { bigfive: { currentAnswers: number[]; }; }) => state.bigfive.currentAnswers[6];
const selectAnswer8 = (state: { bigfive: { currentAnswers: number[]; }; }) => state.bigfive.currentAnswers[7];
const selectAnswer9 = (state: { bigfive: { currentAnswers: number[]; }; }) => state.bigfive.currentAnswers[8];
const selectAnswer10 = (state: { bigfive: { currentAnswers: number[]; }; }) => state.bigfive.currentAnswers[9];
const selectAnswer11 = (state: { bigfive: { currentAnswers: number[]; }; }) => state.bigfive.currentAnswers[10];
const selectAnswer12 = (state: { bigfive: { currentAnswers: number[]; }; }) => state.bigfive.currentAnswers[11];
const selectAnswer13 = (state: { bigfive: { currentAnswers: number[]; }; }) => state.bigfive.currentAnswers[12];
const selectAnswer14 = (state: { bigfive: { currentAnswers: number[]; }; }) => state.bigfive.currentAnswers[13];
const selectAnswer15 = (state: { bigfive: { currentAnswers: number[]; }; }) => state.bigfive.currentAnswers[14];
const selectAnswer16 = (state: { bigfive: { currentAnswers: number[]; }; }) => state.bigfive.currentAnswers[15];
const selectAnswer17 = (state: { bigfive: { currentAnswers: number[]; }; }) => state.bigfive.currentAnswers[16];
const selectAnswer18 = (state: { bigfive: { currentAnswers: number[]; }; }) => state.bigfive.currentAnswers[17];
const selectAnswer19 = (state: { bigfive: { currentAnswers: number[]; }; }) => state.bigfive.currentAnswers[18];
const selectAnswer20 = (state: { bigfive: { currentAnswers: number[]; }; }) => state.bigfive.currentAnswers[19];
const selectAnswer21 = (state: { bigfive: { currentAnswers: number[]; }; }) => state.bigfive.currentAnswers[20];
const selectAnswer22 = (state: { bigfive: { currentAnswers: number[]; }; }) => state.bigfive.currentAnswers[21];
const selectAnswer23 = (state: { bigfive: { currentAnswers: number[]; }; }) => state.bigfive.currentAnswers[22];
const selectAnswer24 = (state: { bigfive: { currentAnswers: number[]; }; }) => state.bigfive.currentAnswers[23];
const selectAnswer25 = (state: { bigfive: { currentAnswers: number[]; }; }) => state.bigfive.currentAnswers[24];
const selectAnswer26 = (state: { bigfive: { currentAnswers: number[]; }; }) => state.bigfive.currentAnswers[25];
const selectAnswer27 = (state: { bigfive: { currentAnswers: number[]; }; }) => state.bigfive.currentAnswers[26];
const selectAnswer28 = (state: { bigfive: { currentAnswers: number[]; }; }) => state.bigfive.currentAnswers[27];
const selectAnswer29 = (state: { bigfive: { currentAnswers: number[]; }; }) => state.bigfive.currentAnswers[28];
const selectAnswer30 = (state: { bigfive: { currentAnswers: number[]; }; }) => state.bigfive.currentAnswers[29];
const selectAnswer31 = (state: { bigfive: { currentAnswers: number[]; }; }) => state.bigfive.currentAnswers[30];
const selectAnswer32 = (state: { bigfive: { currentAnswers: number[]; }; }) => state.bigfive.currentAnswers[31];
const selectAnswer33 = (state: { bigfive: { currentAnswers: number[]; }; }) => state.bigfive.currentAnswers[32];
const selectAnswer34 = (state: { bigfive: { currentAnswers: number[]; }; }) => state.bigfive.currentAnswers[33];
const selectAnswer35 = (state: { bigfive: { currentAnswers: number[]; }; }) => state.bigfive.currentAnswers[34];
const selectAnswer36 = (state: { bigfive: { currentAnswers: number[]; }; }) => state.bigfive.currentAnswers[35];
const selectAnswer37 = (state: { bigfive: { currentAnswers: number[]; }; }) => state.bigfive.currentAnswers[36];
const selectAnswer38 = (state: { bigfive: { currentAnswers: number[]; }; }) => state.bigfive.currentAnswers[37];
const selectAnswer39 = (state: { bigfive: { currentAnswers: number[]; }; }) => state.bigfive.currentAnswers[38];
const selectAnswer40 = (state: { bigfive: { currentAnswers: number[]; }; }) => state.bigfive.currentAnswers[39];
const selectAnswer41 = (state: { bigfive: { currentAnswers: number[]; }; }) => state.bigfive.currentAnswers[40];
const selectAnswer42 = (state: { bigfive: { currentAnswers: number[]; }; }) => state.bigfive.currentAnswers[41];
const selectAnswer43 = (state: { bigfive: { currentAnswers: number[]; }; }) => state.bigfive.currentAnswers[42];
const selectAnswer44 = (state: { bigfive: { currentAnswers: number[]; }; }) => state.bigfive.currentAnswers[43];

const calculatePercentScore = (numScores: numbers, rawScore: number) => {
  const maxScore = numScores * 5;
  const minScore = numScores * 1;
  const scoreRange = maxScore - minScore;
  return (rawScore - minScore) / scoreRange * 100;
}

export const selectExtraversionScore = createSelector(
    [selectAnswer1, selectAnswer6, selectAnswer11, selectAnswer16, selectAnswer21, selectAnswer26, selectAnswer31, selectAnswer36],
    (answer1, answer6, answer11, answer16, answer21, answer26, answer31, answer36) => {
  return score(answer1) +
      score(answer6, true) +
      score(answer11) +
      score(answer16) +
      score(answer21, true) +
      score(answer26) +
      score(answer31, true) +
      score(answer36);
})

export const selectAgreeablenessScore = createSelector(
    [selectAnswer2, selectAnswer7, selectAnswer12, selectAnswer17, selectAnswer22, selectAnswer27, selectAnswer32, selectAnswer37, selectAnswer42],
    (answer2, answer7, answer12, answer17, answer22, answer27, answer32, answer37, answer42) => {
      return score(answer2, true) +
          score(answer7, false ) +
          score(answer12, true) +
          score(answer17, false) +
          score(answer22, false) +
          score(answer27, true) +
          score(answer32, false) +
          score(answer37, true) +
          score(answer42, false);
    })

export const selectConscientiousnessScore = (state: { bigfive: PersonalityQuizState }) => {
  const rawScore =
      score(state.bigfive.currentAnswers[2], false) +
      score(state.bigfive.currentAnswers[7], true ) +
      score(state.bigfive.currentAnswers[12], false) +
      score(state.bigfive.currentAnswers[17], true) +
      score(state.bigfive.currentAnswers[22], true) +
      score(state.bigfive.currentAnswers[27], false) +
      score(state.bigfive.currentAnswers[32], false) +
      score(state.bigfive.currentAnswers[37], false) +
      score(state.bigfive.currentAnswers[42], true);

  _conscientiousnessScore = calculatePercentScore(9, rawScore);
  return _conscientiousnessScore;
}
export const selectNeuroticismScore = (state: { bigfive: PersonalityQuizState }) => {
  const rawScore =
      score(state.bigfive.currentAnswers[3], false) +
      score(state.bigfive.currentAnswers[8], true ) +
      score(state.bigfive.currentAnswers[13], false) +
      score(state.bigfive.currentAnswers[18], false) +
      score(state.bigfive.currentAnswers[23], true) +
      score(state.bigfive.currentAnswers[28], false) +
      score(state.bigfive.currentAnswers[33], true) +
      score(state.bigfive.currentAnswers[38], false)

  _neuroticismScore = calculatePercentScore(9, rawScore);
  return _neuroticismScore;
}
export const selectOpennessScore = (state: { bigfive: PersonalityQuizState }) => {
  const rawScore =
      score(state.bigfive.currentAnswers[4], false) +
      score(state.bigfive.currentAnswers[9], false ) +
      score(state.bigfive.currentAnswers[14], false) +
      score(state.bigfive.currentAnswers[19], false) +
      score(state.bigfive.currentAnswers[24], false) +
      score(state.bigfive.currentAnswers[29], false) +
      score(state.bigfive.currentAnswers[34], true) +
      score(state.bigfive.currentAnswers[39], false) +
      score(state.bigfive.currentAnswers[40], true) +
      score(state.bigfive.currentAnswers[43], false);

  _opennessScore = calculatePercentScore(9, rawScore);
  return _opennessScore;
}

export default personalityQuizSlice.reducer;


