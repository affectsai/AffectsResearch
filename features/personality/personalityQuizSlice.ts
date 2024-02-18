import {createSlice} from "@reduxjs/toolkit";
import * as eva from "@eva-design/eva";

interface PersonalityQuizState {
  currentQuestion: number;
  currentAnswers: (number|undefined)[];
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
  currentAnswers: [1],
} as PersonalityQuizState

const personalityQuizSlice = createSlice({
  name: 'bigfive',
  initialState,
  reducers: {
    nextQuestion: (state, action: SaveQuizAnswerAction) => {
      console.log(`In reducer nextQuestion => storing question number ${action.payload.questionNumber} response ${action.payload.responseValue}`)
      const newAnswers = state.currentAnswers.slice();
      newAnswers[action.payload.questionNumber] = action.payload.responseValue
      state.currentAnswers = newAnswers;
      if (state.currentQuestion+1 < surveyQuestions.size)
        state.currentQuestion++;
    },
    previousQuestion: (state, action: SaveQuizAnswerAction) => {
      console.log(`In reducer previousQuestion => storing question number ${action.payload.questionNumber} response ${action.payload.responseValue}`)
      const newAnswers = state.currentAnswers.slice();
      newAnswers[action.payload.questionNumber] = action.payload.responseValue
      state.currentAnswers = newAnswers;
      if ( state.currentQuestion > 0 )
        state.currentQuestion--;
    }
  }
})

export const {nextQuestion, previousQuestion} = personalityQuizSlice.actions;

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
export default personalityQuizSlice.reducer;


