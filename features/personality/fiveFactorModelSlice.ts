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

export const createFiveFactorModelSlice = ({ name, initialState, reducers}) =>
{
  initialState = {
    ...initialState
  }

  const updateSurveyInBackend = createAsyncThunk(
      `${name}/updateSurveyInBackend`,
      async(survey: FiveFactoryModel, {getState}) => {
        return await saveSurvey(getState().bigfive2._id, survey)
      }
  );

  const retrieveSurveyFromBackend = createAsyncThunk(
      `${name}/retrieveSurveyFromBackend`,
      async(surveyId: string, thunkAPI: AsyncThunkConfig) => {
        return await getSurvey(surveyId)
      }
  );

  const createSurveyInBackend = createAsyncThunk(
      `${name}/createSurveyInBackend`,
      async(survey: FiveFactoryModel, thunkAPI: AsyncThunkConfig) => {
        return await createSurvey(survey)
      }
  );

  const slice = createSlice({
    name: name,
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
        state._id = initialState._id
        state.survey = {...initialState.survey}
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

  return {slice, createSurveyInBackend, retrieveSurveyFromBackend, updateSurveyInBackend}
}

