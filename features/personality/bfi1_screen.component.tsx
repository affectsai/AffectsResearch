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
 * Displays the BFI personality survey from Handbook of Personality:
 * Theory and Research, 2nd Edition.
 *
 * The Big Five Inventory is (c) Oliver P John of the Berkeley
 * Personality Lab at University of California, Berkeley. It is
 * made available for non-commercial purposes.
 *      https://www.ocf.berkeley.edu/~johnlab/index.htm
 */

import React, {useEffect} from 'react';
import {
    Text,
    Layout,
    Card,
} from '@ui-kitten/components';
import {
    Linking,
    View,
    ViewProps,
} from 'react-native';
import {styles} from '../../components/styles';
import {Slider} from 'react-native-awesome-slider';
import {useSharedValue} from "react-native-reanimated";
import {useDispatch, useSelector} from "react-redux";

import {
    selectCurrentQuestion,
    selectSurveySize,
    selectExtraversion,
    selectAgreeableness,
    selectConscientiousness,
    selectNegativeEmotionality,
    selectOpenMindedness, selectSurvey, selectSurveyId, createSurveyInBackend, retrieveSurveyFromBackend, updateSurveyInBackend
} from './bigFiveInventory1Slice'

import {RATING_MIN_VALUE, RATING_MAX_VALUE} from "./fiveFactoryModel";

import * as Haptics from 'expo-haptics'
import {makeCardHeader, makeCardFooter, makeResetFooter, statusBar, ButtonCallback, factorBar} from "./shared";
import {useSliceActions} from "../../components/SliceProvider";
import {AppDispatch} from "../../store";

export function BigFiveInventory1Screen(): React.JSX.Element {
    const dispatch = useDispatch<AppDispatch>();
    const { nextQuestion,
        previousQuestion,
        saveQuestion,
        resetPersonalityQuiz} = useSliceActions()

    const surveySize = useSelector(selectSurveySize)
    const currentQuestion = useSelector(selectCurrentQuestion);
    const survey = useSelector(selectSurvey)
    const surveyId = useSelector(selectSurveyId)

    // Domain Scores
    const extraversion = useSelector(selectExtraversion)
    const agreeableness = useSelector(selectAgreeableness);
    const conscientiousness = useSelector(selectConscientiousness);
    const neuroticism = useSelector(selectNegativeEmotionality);
    const openness = useSelector(selectOpenMindedness);

    const min = useSharedValue(RATING_MIN_VALUE);
    const max = useSharedValue(RATING_MAX_VALUE);
    let progress = useSharedValue(currentQuestion.response)

    /**
     * When the question changes, reset progress.value to the new question's response.
     */
    useEffect(() => {
        progress.value = currentQuestion.response
    }, [currentQuestion])

    useEffect(() => {
        if (surveyId == undefined || surveyId == "0") {
            dispatch(createSurveyInBackend(survey))
        }
    }, [])

    useEffect(() => {
        if (surveyId && surveyId !== "0")
            dispatch(updateSurveyInBackend(survey))
    }, [survey.agreeableness, survey.conscientiousness, survey.extraversion, survey.negativeEmotionality, survey.openMindedness])

    useEffect(() => {
        if (surveyId && surveyId !== "0")
            dispatch(retrieveSurveyFromBackend(surveyId))
    }, [surveyId])

    /**
     * Saves the current question and moves to the previous question in the survey.
     */
    const backButtonCallback: ButtonCallback = () => {
        if (progress.value < RATING_MIN_VALUE)
            progress.value = RATING_MIN_VALUE
        dispatch(saveQuestion({question: {...currentQuestion, response: progress.value}}))
        dispatch(previousQuestion());
    }

    /**
     * Saves the current question and moves to the next question in the survey.
     */
    const nextButtonCallback: ButtonCallback = () => {
        if (progress.value < RATING_MIN_VALUE)
            progress.value = RATING_MIN_VALUE
        dispatch(saveQuestion({question: {...currentQuestion, response: progress.value}}))
        dispatch(nextQuestion());
    }

    const BFI1Screen = () => (
        <Layout style={styles.container}>
            <Card disabled={true}
                  style={styles.card}
                  header={makeCardHeader(`I see myself as someone who...`, currentQuestion.text, currentQuestion.index, surveySize)}
                  footer={makeCardFooter(currentQuestion.index == 1, currentQuestion.index == surveySize, nextButtonCallback, backButtonCallback)}>
                <Slider
                    style={styles.surveySlider}
                    progress={progress}
                    minimumValue={min}
                    maximumValue={max}
                    bubbleMaxWidth={500}
                    bubble={(x) => {
                        let desc = "Strongly Disagree";
                        if (x <= 1.5)
                            desc = "Strongly Disagree";
                        else if (x <= 2.5)
                            desc = "Somewhat disagree";
                        else if (x <= 3.5)
                            desc = "Neither agree nor disagree";
                        else if (x <= 4.5)
                            desc = "Somewhat agree";
                        else
                            desc = "Strongly Agree";
                        let val = Math.round(x);
                        return `${val} - ${desc}`;
                    }}
                    onValueChange={(x) => {
                        progress.value = x
                    }}
                    onSlidingComplete={(x) => {
                        progress.value = x //Math.round(x);
                        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).then(() => {
                        })
                        currentQuestion.response = progress.value
                        dispatch(saveQuestion({question: {...currentQuestion, response: progress.value}}))
                    }}
                    theme={{
                        disableMinTrackTintColor: '#fff',
                        maximumTrackTintColor: '#D4D4D4',
                        minimumTrackTintColor: '#891198',
                        cacheTrackTintColor: '#333',
                        bubbleBackgroundColor: '#891198',
                    }}
                />
                <Layout style={{flexDirection: 'row', marginTop: 10}}>
                    <Text style={{flex: 1, textAlign: 'center'}} category='label'>1</Text>
                    <Text style={{flex: 1, textAlign: 'center'}} category='label'>2</Text>
                    <Text style={{flex: 1, textAlign: 'center'}} category='label'>3</Text>
                    <Text style={{flex: 1, textAlign: 'center'}} category='label'>4</Text>
                    <Text style={{flex: 1, textAlign: 'center'}} category='label'>5</Text>
                </Layout>
                <Layout style={{flexDirection: 'row', marginTop: 10}}>
                    <Text style={{flex: 1, textAlign: 'left'}} category='label'>Strongly Disagree</Text>
                    <Text style={{flex: 1, textAlign: 'right'}} category='label'>Strongly Agree</Text>
                </Layout>
            </Card>
            <Card disabled={true}
                  footer={makeResetFooter(() => {
                      dispatch(resetPersonalityQuiz())
                  })}
                  header={(props: ViewProps): React.ReactElement => (
                      <View {...props}><Text category='h3'>
                          Personality Traits
                      </Text></View>)}
                  style={styles.scoreCard}>
                {factorBar(extraversion, 15)}
                {factorBar(agreeableness)}
                {factorBar(conscientiousness)}
                {factorBar(neuroticism)}
                {factorBar(openness)}
            </Card>
            <Card disabled={true} style={styles.scoreCard}>
                <Layout>
                    <Text category="p2">The Big Five Inventory is implemented here for research purposes only. For more
                        information
                        about the Big Five Inventory, please see:</Text>
                    <Text category="p2" style={{color: 'blue', marginTop: 5}}
                          onPress={() => Linking.openURL('https://www.ocf.berkeley.edu/~johnlab/index.htm')}>
                        Berkeley Personality Lab
                    </Text>
                </Layout>

            </Card>

        </Layout>
    )

    return (
        <BFI1Screen/>
    );
}
