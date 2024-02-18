import {createSlice} from "@reduxjs/toolkit";

interface PersonalityQuizState {
  currentQuestion: number;
  currentAnswers: (number|undefined)[];
}

interface SaveQuizAnswerAction {
  type: string,
  payload: {
    questionNumber: number,
    responseValue: number,
  }
}

const initialState = {
  currentQuestion: 0,
  currentAnswers: [1]
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
export const selectQuizAnswers = (state: { bigfive: PersonalityQuizState }) => state.bigfive.currentAnswers;
export const selectCurrentQuestion = (state: { bigfive: PersonalityQuizState }) => state.bigfive.currentQuestion;

export const selectCurrentResponse = (state: { bigfive: PersonalityQuizState }) => state.bigfive.currentAnswers[state.bigfive.currentQuestion];
export default personalityQuizSlice.reducer;


