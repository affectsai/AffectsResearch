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

import {createSelector} from "@reduxjs/toolkit";
import {
  FiveFactoryModel,
  FiveFactorModelState,
  make_ffm_question,
  getSurveySize,
  extractQuestion,
  getFacet,
} from './fiveFactoryModel'

import {createFiveFactorModelSlice} from "./fiveFactorModelSlice";
import {memoize} from "proxy-memoize";

const bfi_2_survey: FiveFactoryModel = {
  name: "BFI2",
  extraversion: {
    name: "Extraversion",
    questions: [
      make_ffm_question( 1, "Is outgoing, sociable"),
      make_ffm_question( 6, "Has an assertive personality"),
      make_ffm_question( 11, "Rarely feels excited or eager", true),
      make_ffm_question( 16, "Tends to be quiet", true),
      make_ffm_question( 21, "Is dominant, acts as a leader"),
      make_ffm_question( 26, "Has an assertive personality", true),
      make_ffm_question( 31, "Is sometimes shy, introverted", true),
      make_ffm_question( 36, "Finds it hard to influence people", true),
      make_ffm_question( 41, "Is full of energy"),
      make_ffm_question( 46, "Is talkative"),
      make_ffm_question( 51, "Prefers to have others take charge", true),
      make_ffm_question( 56, "Shows a lot of enthusiasm"),
    ],
    score: Number.NEGATIVE_INFINITY
  },
  agreeableness: {
    name: "Agreeableness",
    questions: [
      make_ffm_question( 2, "Is compassionate, has a soft heart"),
      make_ffm_question( 7, "Is respectful, treats others with respect"),
      make_ffm_question( 12, "Tends to find fault with others", true),
      make_ffm_question( 17, "Feels little sympathy for others", true),
      make_ffm_question( 22, "Starts arguments with others", true),
      make_ffm_question( 27, "Has a forgiving nature"),
      make_ffm_question( 32, "Is helpful and unselfish with others"),
      make_ffm_question( 37, "Is sometimes rude to others", true),
      make_ffm_question( 42, "Is suspicious of others' intentions", true),
      make_ffm_question( 47, "Can be cold and uncaring", true),
      make_ffm_question( 52, "Is polite, courteous to others"),
      make_ffm_question( 57, "Assumes the best about people"),
    ],
    score: Number.NEGATIVE_INFINITY
  },
  conscientiousness: {
    name: "Conscientiousness",
    questions: [
      make_ffm_question( 3, "Tends to be disorganized", true),
      make_ffm_question( 8, "Tends to be lazy", true),
      make_ffm_question( 13, "Is dependable, steady"),
      make_ffm_question( 18, "Is systematic, likes to keep things in order"),
      make_ffm_question( 23, "Has difficulty getting started on tasks", true),
      make_ffm_question( 28, "Can be somewhat careless", true),
      make_ffm_question( 33, "Keeps things neat and tidy"),
      make_ffm_question( 38, "Is efficient, gets things done"),
      make_ffm_question( 43, "Is reliable, can always be counted on"),
      make_ffm_question( 48, "Leaves a mess, doesn't clean up", true),
      make_ffm_question( 53, "Is persistent, works until the task is finished"),
      make_ffm_question( 58, "Sometimes behaves irresponsibly", true),

    ],
    score: Number.NEGATIVE_INFINITY
  },
  negativeEmotionality: {
    name: "Negative Emotionality",
    questions: [
      make_ffm_question( 4, "Is relaxed, handles stress well", true),
      make_ffm_question( 9, "Stays optimistic after experiencing a setback", true),
      make_ffm_question( 14, "Is moody, has up and down mood swings"),
      make_ffm_question( 19, "Can be tense"),
      make_ffm_question( 24, "Feels secure, comfortable with self", true),
      make_ffm_question( 29, "Is emotionally stable, not easily upset", true),
      make_ffm_question( 34, "Worries a lot"),
      make_ffm_question( 39, "Often feels sad"),
      make_ffm_question( 44, "Keeps their emotions under control", true),
      make_ffm_question( 49, "Rarely feels anxious or afraid", true),
      make_ffm_question( 54, "Tends to feel depressed, blue"),
      make_ffm_question( 59, "Is temperamental, gets emotional easily"),
    ],
    score: Number.NEGATIVE_INFINITY
  },
  openMindedness: {
    name: "Openness",
    questions: [
      make_ffm_question( 5, "Has few artistic interests", true),
      make_ffm_question( 10, "Is curious about many different things"),
      make_ffm_question( 15, "Is inventive, finds clever ways to do things"),
      make_ffm_question( 20, "Is fascinated by art, music or literature"),
      make_ffm_question( 25, "Avoids intellectual, philosophical discussions", true),
      make_ffm_question( 30, "Has little creativity", true),
      make_ffm_question( 35, "Values art and beauty"),
      make_ffm_question( 40, "Is complex, a deep thinker"),
      make_ffm_question( 45, "Has difficulty imagining things", true),
      make_ffm_question( 50, "Thinks poetry and plays are boring", true),
      make_ffm_question( 55, "Has little interest in abstract ideas", true),
      make_ffm_question( 60, "Is original, comes up with new ideas"),
    ],
    score: Number.NEGATIVE_INFINITY
  },
}


const initialState = {
  _id: "0",
  survey: {...bfi_2_survey},
  currentIndex: 1
} as FiveFactorModelState


export const {slice, createSurveyInBackend, retrieveSurveyFromBackend, updateSurveyInBackend} = createFiveFactorModelSlice({
  name: 'bfi2',
  initialState: initialState,
  reducers: {}
})
export  const bigFiveInventory2Slice = slice

export const selectSurveyId = (state: { bigfive2: FiveFactorModelState }) => state.bigfive2._id
export const selectSurvey = (state: { bigfive2: FiveFactorModelState }) => state.bigfive2.survey
export const selectSurveySize = (state: { bigfive2: FiveFactorModelState }) => getSurveySize(state.bigfive2.survey)
export const selectCurrentIndex = (state: { bigfive2: FiveFactorModelState }) => state.bigfive2.currentIndex
export const selectCurrentQuestion = memoize((state: { bigfive2: FiveFactorModelState }) => {
  return {...extractQuestion(state.bigfive2.currentIndex, state.bigfive2.survey)}
})

/*
 * DOMAIN SCORE SELECTORS
 */

export const selectExtraversion = (state: { bigfive2: FiveFactorModelState }) => state.bigfive2.survey.extraversion
export const selectAgreeableness = (state: { bigfive2: FiveFactorModelState }) => state.bigfive2.survey.agreeableness
export const selectConscientiousness = (state: { bigfive2: FiveFactorModelState }) => state.bigfive2.survey.conscientiousness
export const selectNegativeEmotionality = (state: { bigfive2: FiveFactorModelState }) => state.bigfive2.survey.negativeEmotionality
export const selectOpenMindedness = (state: { bigfive2: FiveFactorModelState }) => state.bigfive2.survey.openMindedness

/*
 * FACET SCORE SELECTORS
 *
 * Note -- I checked ... all facet factored use the same scoring (normal or reverse) as they do in the domain categories ...
 *         so let's just extract the questions from their domains by question number to reuse them.
 *
 *         If a future version mixes normal- and reverse- scoring for any one question, we'll need to revisit this
 *         implementation... but for now, it feels an awful lot like OPJ wanted this to be easy to do :).
 */
export const selectSociability = memoize((state: { bigfive2: FiveFactorModelState }) => getFacet("Sociability", [1,16,31,46], state.bigfive2.survey))
export const selectAssertiveness = memoize((state: { bigfive2: FiveFactorModelState }) => getFacet("Assertiveness", [6,21,36,51], state.bigfive2.survey))
export const selectEnergyLevel = memoize((state: { bigfive2: FiveFactorModelState }) => getFacet("Energy Level", [11,26,41,56], state.bigfive2.survey))
export const selectCompassion = memoize((state: { bigfive2: FiveFactorModelState }) => getFacet("Compassion", [2,17,32,47], state.bigfive2.survey))
export const selectRespectfulness = memoize((state: { bigfive2: FiveFactorModelState }) => getFacet("Respectfulness", [7,22,37,52], state.bigfive2.survey))
export const selectTrust = memoize((state: { bigfive2: FiveFactorModelState }) => getFacet("Trust", [12,27,42,57], state.bigfive2.survey))
export const selectOrganization = memoize((state: { bigfive2: FiveFactorModelState }) => getFacet("Organization", [3,18,33,48], state.bigfive2.survey))
export const selectProductiveness = memoize((state: { bigfive2: FiveFactorModelState }) => getFacet("Productiveness", [8,23,38,53], state.bigfive2.survey))
export const selectResponsibility = memoize((state: { bigfive2: FiveFactorModelState }) => getFacet("Responsibility", [13,28,43,48], state.bigfive2.survey))
export const selectAnxiety = memoize((state: { bigfive2: FiveFactorModelState }) => getFacet("Anxiety", [4,19,34,49], state.bigfive2.survey))
export const selectDepression = memoize((state: { bigfive2: FiveFactorModelState }) => getFacet("Depression", [9,24,39,54], state.bigfive2.survey))
export const selectEmotionalVolatility = memoize((state: { bigfive2: FiveFactorModelState }) => getFacet("Emotional Volatility", [14,29,44,59], state.bigfive2.survey))
export const selectIntellectualCuriosity = memoize((state: { bigfive2: FiveFactorModelState }) => getFacet("Intellectual Curiosity", [10,25,40,55], state.bigfive2.survey))
export const selectAestheticSensitivity = memoize((state: { bigfive2: FiveFactorModelState }) => getFacet("Aesthetic Sensitivity", [5,20,35,50], state.bigfive2.survey))
export const selectCreativeImagination = memoize((state: { bigfive2: FiveFactorModelState }) => getFacet("Creative Imagination", [15,30,45,60], state.bigfive2.survey))
