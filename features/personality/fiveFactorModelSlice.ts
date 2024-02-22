import {createSelector, createSlice} from "@reduxjs/toolkit";

interface FFMQuestion {
  index: number
  text: string
  response: number
  reverse: boolean
}

interface Factor {
  name: string
  questions: Array<FFMQuestion>
  score: number
}

interface FiveFactoryModel {
  extraversion: Factor
  agreeableness: Factor
  conscientiousness: Factor
  negativeEmotionality: Factor
  openMindedness: Factor
}

const scoreFactor = (factor: Factor) => {
  let factorScore = 0
  if (!factor) return Number.NEGATIVE_INFINITY
  factor.questions.forEach( (question) => {
    if ( !question || !question.response)
      factorScore = Number.NEGATIVE_INFINITY
    else
      factorScore = factorScore + (question.reverse ? (6-question.response) : question.response)
  })
  return factorScore
}

const make_ffm_question = (index: number, text: string, reverse: boolean = false) => {
  return { index: index, text: text, response: Number.NEGATIVE_INFINITY, reverse: reverse } as FFMQuestion
}

const getSurveySize = (model: FiveFactoryModel|undefined) => {
  if (!model)
    return 0

  return model.extraversion.questions.length +
      model.agreeableness.questions.length +
      model.conscientiousness.questions.length +
      model.negativeEmotionality.questions.length +
      model.openMindedness.questions.length
}

const extractQuestion = (index: number, model: FiveFactoryModel|undefined) => {
  const dummy = {
    index: 0, text: '', response: Number.NEGATIVE_INFINITY, reverse: false
  } as FFMQuestion

  if (!model)
    return dummy

  let result = dummy;

  model.extraversion.questions.forEach((q: FFMQuestion) => {
    if (q.index == index) result = q;
  })
  model.agreeableness.questions.forEach((q: FFMQuestion) => {
    if (q.index == index) result = q;
  })
  model.openMindedness.questions.forEach((q: FFMQuestion) => {
    if (q.index == index) result = q;
  })
  model.negativeEmotionality.questions.forEach((q: FFMQuestion) => {
    if (q.index == index) result = q;
  })
  model.conscientiousness.questions.forEach((q: FFMQuestion) => {
    if (q.index == index) result = q;
  })

  return result
}

const updateQuestionInSurvey = (model: FiveFactoryModel|undefined, question: FFMQuestion) => {
  if (!model)
    return
  const answer = question.response < 1 ? 1 : question.response

  model.extraversion.questions.forEach((q: FFMQuestion) => {
    if (q.index == question.index) {
      q.response = answer;
      model.extraversion.score = scoreFactor(model.extraversion)
      return
    }
  })

  model.agreeableness.questions.forEach((q: FFMQuestion) => {
    if (q.index == question.index) {
      q.response = answer;
      model.agreeableness.score = scoreFactor(model.agreeableness)
      return
    }
  })
  model.openMindedness.questions.forEach((q: FFMQuestion) => {
    if (q.index == question.index) {
      q.response = answer;
      model.openMindedness.score = scoreFactor(model.openMindedness)
      return
    }
  })
  model.negativeEmotionality.questions.forEach((q: FFMQuestion) => {
    if (q.index == question.index) {
      q.response = answer;
      model.negativeEmotionality.score = scoreFactor(model.negativeEmotionality)
      return
    }
  })
  model.conscientiousness.questions.forEach((q: FFMQuestion) => {
    if (q.index == question.index) {
      q.response = answer;
      model.conscientiousness.score = scoreFactor(model.conscientiousness)
      return
    }
  })

  return
}


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

interface FiveFactorModelState {
  survey: FiveFactoryModel
  currentIndex: number
}

const initialState = {
  survey: {...bfi_1_survey},
  currentIndex: 1
} as FiveFactorModelState

interface SaveSurveyQuestionAction {
  type: string,
  payload: {
    question: FFMQuestion
  }
}

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
export const selectExtraversionScore = (state: { bigfive: FiveFactorModelState }) => state.bigfive.survey.extraversion.score
export const selectAgreeablenessScore = (state: { bigfive: FiveFactorModelState }) => state.bigfive.survey.agreeableness.score
export const selectConscientiousnessScore = (state: { bigfive: FiveFactorModelState }) => state.bigfive.survey.conscientiousness.score
export const selectNegativeEmotionalityScore = (state: { bigfive: FiveFactorModelState }) => state.bigfive.survey.negativeEmotionality.score
export const selectOpenMindednessScore = (state: { bigfive: FiveFactorModelState }) => state.bigfive.survey.openMindedness.score


export default bfi1Slice.reducer;


