/* Copyright (C) 2024 Affects AI LLC - All Rights Reserved
 *
 * You may use, distribute and modify this code under the terms of
 * the CC BY-NC-SA 4.0 license.
 *
 * You should have received a copy of the CC BY-NC-SA 4.0 license
 * with this file. If not, please write to info@affects.ai or
 * visit:
 *    https://creativecommons.org/licenses/by-nc-sa/4.0/deed.en
 *
 * This file contains an implementation of the Big Five Inventory
 * from the Handbook of Personality: Theory and Research, 4th
 * Edition.
 *
 * The Big Five Inventory is (c) Oliver P John of the Berkeley
 * Personality Lab at University of California, Berkeley. It is
 * made available for non-commercial purposes.
 *      https://www.ocf.berkeley.edu/~johnlab/index.htm
 */

import {createAsyncThunk, createSelector, createSlice} from "@reduxjs/toolkit";
import {
  FiveFactoryModel,
  FiveFactorModelState,
  SaveSurveyQuestionAction,
  make_ffm_question,
  getSurveySize,
  updateQuestionInSurvey,
  extractQuestion,
  getFacet, RATING_MAX_VALUE, RATING_MIN_VALUE
} from './fiveFactoryModel'
import {createSurvey, getSurvey, saveSurvey} from "../../backend/survey"
import {randomUUID} from "expo-crypto";
import {AsyncThunkConfig} from "@reduxjs/toolkit/dist/createAsyncThunk";

export const createFiveFactorModelSlice = ({ path, initialState, reducers, extraReducers}) =>
{
  initialState = {
    ...initialState
  }

  const updateSurveyInBackend = createAsyncThunk(
      `${path}/updateSurveyInBackend`,
      async(survey: FiveFactoryModel, {getState}) => {
        return await saveSurvey(getState().bigfive2._id, survey)
      }
  );

  const retrieveSurveyFromBackend = createAsyncThunk(
      `${path}/retrieveSurveyFromBackend`,
      async(surveyId: string, thunkAPI: AsyncThunkConfig) => {
        return await getSurvey(surveyId)
      }
  );

  const createSurveyInBackend = createAsyncThunk(
      `${path}/createSurveyInBackend`,
      async(survey: FiveFactoryModel, thunkAPI: AsyncThunkConfig) => {
        return await createSurvey(survey)
      }
  );

  return createSlice({
    name: path,
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
        state.survey = {...bfi_2_survey}
        state.currentIndex = 1
      },
      ...reducers,
    },
    extraReducers: (builder) => {
      // Add reducers for additional action types here, and handle loading state as needed
      builder.addCase(updateSurveyInBackend.fulfilled, (state, action) => {
        // Add user to the state array
        console.log('Saved survey...')
      }).addCase(createSurveyInBackend.fulfilled, (state, action) => {
        state._id = action.payload._id
        console.log("NEW ID: " + state._id)
      }).addCase(retrieveSurveyFromBackend.fulfilled, (state, action) => {
        // Add user to the state array
        console.log('Retrieved survey...' )
        state._id = action.payload._id
        state.survey = JSON.parse(action.payload.survey)
      })
    }
  })
}

// const initialState = {
//   _id: "0",
//   survey: {...bfi_2_survey},
//   currentIndex: 1
// } as FiveFactorModelState


//
//
// export const selectSurveyId = (state: { bigfive2: FiveFactorModelState }) => state.bigfive2._id
// export const selectSurvey = (state: { bigfive2: FiveFactorModelState }) => state.bigfive2.survey
// export const selectSurveySize = (state: { bigfive2: FiveFactorModelState }) => getSurveySize(state.bigfive2.survey)
// export const selectCurrentIndex = (state: { bigfive2: FiveFactorModelState }) => state.bigfive2.currentIndex
// export const selectCurrentQuestion = createSelector([selectCurrentIndex, selectSurvey], (index, survey) => {
//   return {...extractQuestion(index, survey)}
// })
//
// /*
//  * DOMAIN SCORE SELECTORS
//  */
//
// export const selectExtraversion = (state: { bigfive2: FiveFactorModelState }) => state.bigfive2.survey.extraversion
// export const selectAgreeableness = (state: { bigfive2: FiveFactorModelState }) => state.bigfive2.survey.agreeableness
// export const selectConscientiousness = (state: { bigfive2: FiveFactorModelState }) => state.bigfive2.survey.conscientiousness
// export const selectNegativeEmotionality = (state: { bigfive2: FiveFactorModelState }) => state.bigfive2.survey.negativeEmotionality
// export const selectOpenMindedness = (state: { bigfive2: FiveFactorModelState }) => state.bigfive2.survey.openMindedness
//
// /*
//  * FACET SCORE SELECTORS
//  *
//  * Note -- I checked ... all facet factored use the same scoring (normal or reverse) as they do in the domain categories ...
//  *         so let's just extract the questions from their domains by question number to reuse them.
//  *
//  *         If a future version mixes normal- and reverse- scoring for any one question, we'll need to revisit this
//  *         implementation... but for now, it feels an awful lot like OPJ wanted this to be easy to do :).
//  */
// export const selectSociability = createSelector([selectSurvey], (survey) => getFacet("Sociability", [1,16,31,46], survey))
// export const selectAssertiveness = createSelector([selectSurvey], (survey) => getFacet("Assertiveness", [6,21,36,51], survey))
// export const selectEnergyLevel = createSelector([selectSurvey], (survey) => getFacet("Energy Level", [11,26,41,56], survey))
// export const selectCompassion = createSelector([selectSurvey], (survey) => getFacet("Compassion", [2,17,32,47], survey))
// export const selectRespectfulness = createSelector([selectSurvey], (survey) => getFacet("Respectfulness", [7,22,37,52], survey))
// export const selectTrust = createSelector([selectSurvey], (survey) => getFacet("Trust", [12,27,42,57], survey))
// export const selectOrganization = createSelector([selectSurvey], (survey) => getFacet("Organization", [3,18,33,48], survey))
// export const selectProductiveness = createSelector([selectSurvey], (survey) => getFacet("Productiveness", [8,23,38,53], survey))
// export const selectResponsibility = createSelector([selectSurvey], (survey) => getFacet("Responsibility", [13,28,43,48], survey))
// export const selectAnxiety = createSelector([selectSurvey], (survey) => getFacet("Anxiety", [4,19,34,49], survey))
// export const selectDepression = createSelector([selectSurvey], (survey) => getFacet("Depression", [9,24,39,54], survey))
// export const selectEmotionalVolatility = createSelector([selectSurvey], (survey) => getFacet("Emotional Volatility", [14,29,44,59], survey))
// export const selectIntellectualCuriosity = createSelector([selectSurvey], (survey) => getFacet("Intellectual Curiosity", [10,25,40,55], survey))
// export const selectAestheticSensitivity = createSelector([selectSurvey], (survey) => getFacet("Aesthetic Sensitivity", [5,20,35,50], survey))
// export const selectCreativeImagination = createSelector([selectSurvey], (survey) => getFacet("Creative Imagination", [15,30,45,60], survey))
//
// export const {nextQuestion, previousQuestion, saveQuestion, resetPersonalityQuiz} = bfi2Slice.actions;
//
// export default bfi2Slice.reducer;
//

