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
 * This file contains common methods for defining and implementing
 * the personality surveys based on the Five Factor Model, or
 * Big Five Inventory.
 *
 * Big Five Inventory is (c) Oliver P John of the Berkeley
 * Personality Lab at University of California, Berkeley. It is
 * made available for non-commercial purposes.
 *      https://www.ocf.berkeley.edu/~johnlab/index.htm
 */

export const RATING_MIN_VALUE = 0.5
export const RATING_MAX_VALUE = 5.5

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

    const min = factor.questions.length * RATING_MIN_VALUE
    const max = factor.questions.length * RATING_MAX_VALUE

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
    let answer = question.response
    if ( answer < RATING_MIN_VALUE ) answer = RATING_MIN_VALUE;
    if ( answer > RATING_MAX_VALUE ) answer = RATING_MAX_VALUE;

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

export const extractMultipleQuestion = (list: Array<number>, survey: FiveFactoryModel) => {
    const q_list: FFMQuestion[] = []
    list.forEach((idx) => q_list.push(extractQuestion(idx, survey)));

    return q_list
}

/**
 * Extracts a temporary Factor using the question numbers provided in list: Array<number>, scores it and returns
 * the result. This is useful for Facet Scores that are subsets of the Domain Scores.
 *
 * @param list
 * @param survey
 */
export const getFacetScore = (list: Array<number>, survey: FiveFactoryModel) => {
    const temp = getFacet('', list, survey);
    return temp.score
}

export const getFacet = (name: string, list: Array<number>, survey: FiveFactoryModel) => {
    const temp: Factor = {
        name: name,
        score: Number.NEGATIVE_INFINITY,
        questions: extractMultipleQuestion(list, survey)
    }

    temp.score = scoreFactor(temp)
    return temp;
}
