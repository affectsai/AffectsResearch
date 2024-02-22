import {createSelector} from "@reduxjs/toolkit";

export interface FiveFactorModelState {
    survey: FiveFactoryModel
    currentIndex: number
}
export interface SaveSurveyQuestionAction {
    type: string,
    payload: {
        question: FFMQuestion
    }
}
export interface FFMQuestion {
    index: number
    text: string
    response: number
    reverse: boolean
}

export interface Factor {
    name: string
    questions: Array<FFMQuestion>
    score: number
}

export interface FiveFactoryModel {
    extraversion: Factor
    agreeableness: Factor
    conscientiousness: Factor
    negativeEmotionality: Factor
    openMindedness: Factor
}

export const scoreFactor = (factor: Factor) => {
    let factorScore = 0
    if (!factor) return Number.NEGATIVE_INFINITY
    factor.questions.forEach( (question) => {
        if ( !question || !question.response)
            factorScore = Number.NEGATIVE_INFINITY
        else
            factorScore = factorScore + (question.reverse ? (6-question.response) : question.response)
    })

    const min = factor.questions.length * 1
    const max = factor.questions.length * 5

    return 100*(factorScore-min)/(max-min)
}

export const make_ffm_question = (index: number, text: string, reverse: boolean = false) => {
    return { index: index, text: text, response: Number.NEGATIVE_INFINITY, reverse: reverse } as FFMQuestion
}

export const getSurveySize = (model: FiveFactoryModel|undefined) => {
    if (!model)
        return 0

    return model.extraversion.questions.length +
        model.agreeableness.questions.length +
        model.conscientiousness.questions.length +
        model.negativeEmotionality.questions.length +
        model.openMindedness.questions.length
}

export const extractQuestion = (index: number, model: FiveFactoryModel|undefined) => {
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

export const updateQuestionInSurvey = (model: FiveFactoryModel|undefined, question: FFMQuestion) => {
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
