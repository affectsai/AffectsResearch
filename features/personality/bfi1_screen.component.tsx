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
    nextQuestion,
    previousQuestion,
    saveQuestion,
    resetPersonalityQuiz,
    selectCurrentQuestion,
    selectExtraversionScore,
    selectAgreeablenessScore,
    selectConscientiousnessScore,
    selectNegativeEmotionalityScore,
    selectOpenMindednessScore,
    selectSurveySize
} from './bigFiveInventory1Slice'

import * as Haptics from 'expo-haptics'
import {makeCardHeader, makeCardFooter, makeResetFooter, statusBar, ButtonCallback} from "./shared";


export function BigFiveInventory1Screen(): React.JSX.Element {
    const dispatch = useDispatch();
    const surveySize = useSelector(selectSurveySize)
    const currentQuestion = useSelector(selectCurrentQuestion);

    // Domain Scores
    const extraversionScore = useSelector(selectExtraversionScore)
    const agreeablenessScore = useSelector(selectAgreeablenessScore);
    const conscientiousnessScore = useSelector(selectConscientiousnessScore);
    const neuroticismScore = useSelector(selectNegativeEmotionalityScore);
    const opennessScore = useSelector(selectOpenMindednessScore);

    const min = useSharedValue(0.5);
    const max = useSharedValue(5.5);
    let progress = useSharedValue(currentQuestion.response)

    useEffect(() => {
        progress.value = currentQuestion.response
    }, [currentQuestion])

    /**
     * Saves the current question and moves to the previous question in the survey.
     */
    const backButtonCallback: ButtonCallback = () => {
        if (progress.value < 0)
            progress.value = 1
        dispatch(saveQuestion({question: {...currentQuestion, response: progress.value}}))
        dispatch(previousQuestion());
    }

    /**
     * Saves the current question and moves to the next question in the survey.
     */
    const nextButtonCallback: ButtonCallback = () => {
        if (progress.value < 0)
            progress.value = 1
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
                        progress.value = Math.round(x);
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
                {statusBar(extraversionScore, "Extraversion", 15)}
                {statusBar(agreeablenessScore, "Agreeableness")}
                {statusBar(conscientiousnessScore, "Conscientiousness")}
                {statusBar(neuroticismScore, "Neuroticism")}
                {statusBar(opennessScore, "Openness")}
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
