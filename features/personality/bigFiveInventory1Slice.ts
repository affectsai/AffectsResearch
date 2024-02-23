/* Copyright (C) 2024 Affects AI LLC - All Rights Reserved
 *
 * You may use, distribute and modify this code under the terms of
 * the CC BY-SA-NC 4.0 license.
 *
 * You should have received a copy of the CC BY-SA-NC 4.0 license
 * with this file. If not, please write to info@affects.ai or
 * visit:
 *    https://creativecommons.org/licenses/by-nc-sa/4.0/deed.en
 *
 * This file contains an implementation of the Big Five Inventory
 * from the Handbook of Personality: Theory and Research, 2nd
 * Edition.
 *
 * The Big Five Inventory is (c) Oliver P John of the Berkeley
 * Personality Lab at University of California, Berkeley. It is
 * made available for non-commercial purposes.
 *      https://www.ocf.berkeley.edu/~johnlab/index.htm
 */

import {createSelector, createSlice} from "@reduxjs/toolkit";
import {
  FiveFactoryModel,
  make_ffm_question,
  FiveFactorModelState,
  getSurveySize, SaveSurveyQuestionAction, updateQuestionInSurvey, extractQuestion,
  RATING_MIN_VALUE, RATING_MAX_VALUE
} from './fiveFactoryModel'

const bfi_1_survey: FiveFactoryModel = {
  extraversion: {
    name: "Extraversion",
    questions: [
      make_ffm_question( 1, "Is talkative"),
      make_ffm_question( 6, "Is reserved", true),
      make_ffm_question( 11, "Is full of energy"),
      make_ffm_question( 16, "Generates a lot of enthusiasm"),
      make_ffm_question( 21, "Tends to be quiet", true),
      make_ffm_question( 26, "Has an assertive personality"),
      make_ffm_question( 31, "Is sometimes shy, inhibited", true),
      make_ffm_question( 36, "Is outgoing, sociable"),
    ],
    score: Number.NEGATIVE_INFINITY
  },
  agreeableness: {
    name: "Agreeableness",
    questions: [
      make_ffm_question( 2, "Tends to find fault with others", true),
      make_ffm_question( 7, "Is helpful and unselfish with others"),
      make_ffm_question( 12, "Starts quarrels with others", true),
      make_ffm_question( 17, "Has a forgiving nature"),
      make_ffm_question( 22, "Is generally trusting"),
      make_ffm_question( 27, "Can be cold and aloof", true),
      make_ffm_question( 32, "Is considerate and kind to almost everyone"),
      make_ffm_question( 37, "Is sometimes rude to others", true),
      make_ffm_question( 42, "Likes to cooperate with others"),
    ],
    score: Number.NEGATIVE_INFINITY
  },
  conscientiousness: {
    name: "Conscientiousness",
    questions: [
      make_ffm_question( 3, "Does a thorough job"),
      make_ffm_question( 8, "Can be somewhat careless", true),
      make_ffm_question( 13, "Is a reliable worker"),
      make_ffm_question( 18, "Tends to be disorganized", true),
      make_ffm_question( 23, "Tends to be lazy", true),
      make_ffm_question( 28, "Perseveres until the task in finished"),
      make_ffm_question( 33, "Does things efficiently"),
      make_ffm_question( 38, "Makes plans and follows through with them"),
      make_ffm_question( 43, "Is easily distracted", true)
    ],
    score: Number.NEGATIVE_INFINITY
  },
  negativeEmotionality: {
    name: "Neuroticism",
    questions: [
      make_ffm_question( 4, "Is depressed, blue"),
      make_ffm_question( 9, "Is relaxed, handles stress well", true),
      make_ffm_question( 14, "Can be tense"),
      make_ffm_question( 19, "Worries a lot"),
      make_ffm_question( 24, "Is emotionally stable, not easily upset", true),
      make_ffm_question( 29, "Can be moody"),
      make_ffm_question( 34, "Remains calm in tense situations", true),
      make_ffm_question( 39, "Gets nervous easily"),
    ],
    score: Number.NEGATIVE_INFINITY
  },
  openMindedness: {
    name: "Openness",
    questions: [
      make_ffm_question( 5, "Is original, comes up with new ideas"),
      make_ffm_question( 10, "Is curious about many different things"),
      make_ffm_question( 15, "Is ingenious, a deep thinker"),
      make_ffm_question( 20, "Has an active imagination"),
      make_ffm_question( 25, "Is inventive"),
      make_ffm_question( 30, "Values artistic, aesthetic experiences"),
      make_ffm_question( 35, "Prefers work that is routine", true),
      make_ffm_question( 40, "Likes to reflect, play with ideas"),
      make_ffm_question( 41, "Has few artistic interests", true),
      make_ffm_question( 44, "Is sophisticated in art, music, or literature")
    ],
    score: Number.NEGATIVE_INFINITY
  },
}

const initialState = {
  survey: {...bfi_1_survey},
  currentIndex: 1
} as FiveFactorModelState

const bfi1Slice = createSlice({
  name: 'bfi1',
  initialState,
  reducers: {
    nextQuestion: (state) => {
      if (state.currentIndex < getSurveySize(state.survey))
        state.currentIndex++;
    },
    previousQuestion: (state) => {
      if ( state.currentIndex > 1 )
        state.currentIndex--;
    },
    saveQuestion: (state, action: SaveSurveyQuestionAction) => {
      const newSurvey = {...state.survey}
      updateQuestionInSurvey(newSurvey, action.payload.question)
      state.survey = newSurvey
    },
    resetPersonalityQuiz: (state) => {
      state.survey = {...bfi_1_survey}
      state.currentIndex = 1
    }
  }
})

export const {nextQuestion, previousQuestion, saveQuestion, resetPersonalityQuiz} = bfi1Slice.actions;

export const selectSurvey = (state: { bigfive: FiveFactorModelState }) => state.bigfive.survey

export const selectSurveySize = (state: { bigfive: FiveFactorModelState }) => getSurveySize(state.bigfive.survey)

export const selectCurrentIndex = (state: { bigfive: FiveFactorModelState }) => state.bigfive.currentIndex
export const selectCurrentQuestion = createSelector([selectCurrentIndex, selectSurvey], (index, survey) => {
  return {...extractQuestion(index, survey)}
})

/*
 * Domain score selectors...
 */

export const selectExtraversion = (state: { bigfive: FiveFactorModelState }) => state.bigfive.survey.extraversion
export const selectAgreeableness = (state: { bigfive: FiveFactorModelState }) => state.bigfive.survey.agreeableness
export const selectConscientiousness = (state: { bigfive: FiveFactorModelState }) => state.bigfive.survey.conscientiousness
export const selectNegativeEmotionality = (state: { bigfive: FiveFactorModelState }) => state.bigfive.survey.negativeEmotionality
export const selectOpenMindedness = (state: { bigfive: FiveFactorModelState }) => state.bigfive.survey.openMindedness

export default bfi1Slice.reducer;


