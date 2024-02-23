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
 * Theory and Research, 4th Edition.
 *
 * The Big Five Inventory is (c) Oliver P John of the Berkeley
 * Personality Lab at University of California, Berkeley. It is
 * made available for non-commercial purposes.
 *      https://www.ocf.berkeley.edu/~johnlab/index.htm
 */

import React, {useEffect, useState} from 'react';
import {
    Text,
    Layout,
    Card,
    ProgressBar
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
    selectSurveySize,
    selectSociability,
    selectAssertiveness,
    selectEnergyLevel,
    selectCompassion,
    selectRespectfulness,
    selectTrust,
    selectOrganization,
    selectProductiveness,
    selectResponsibility,
    selectAnxiety,
    selectDepression,
    selectEmotionalVolatility,
    selectIntellectualCuriosity,
    selectAestheticSensitivity,
    selectCreativeImagination,
    selectExtraversion,
    selectAgreeableness, selectConscientiousness, selectNegativeEmotionality, selectOpenMindedness
} from './bigFiveInventory2Slice'
import {RATING_MAX_VALUE, RATING_MIN_VALUE} from "./fiveFactoryModel";

import * as Haptics from 'expo-haptics'
import {makeCardHeader, makeCardFooter, makeResetFooter, statusBar, ButtonCallback, factorBar} from "./shared";

export function BigFiveInventory2Screen(): React.JSX.Element {
    const dispatch = useDispatch();

    /*
     * There's probably a better way to handle this... feels like too many state variables.
     * But I'm rushed for time right now so it's what we're going live with.
     */

    const surveySize = useSelector(selectSurveySize)
    const currentQuestion = useSelector(selectCurrentQuestion);

    // Facet Scores
    const extraversion = useSelector(selectExtraversion)
    const agreeableness = useSelector(selectAgreeableness)
    const conscientiousness = useSelector(selectConscientiousness)
    const neuroticism = useSelector(selectNegativeEmotionality)
    const openness = useSelector(selectOpenMindedness)
    const Sociability = useSelector(selectSociability)
    const Assertiveness = useSelector(selectAssertiveness)
    const EnergyLevel = useSelector(selectEnergyLevel)
    const Compassion = useSelector(selectCompassion)
    const Respectfulness = useSelector(selectRespectfulness)
    const Trust = useSelector(selectTrust)
    const Organization = useSelector(selectOrganization)
    const Productiveness = useSelector(selectProductiveness)
    const Responsibility = useSelector(selectResponsibility)
    const Anxiety = useSelector(selectAnxiety)
    const Depression = useSelector(selectDepression)
    const EmotionalVolatility = useSelector(selectEmotionalVolatility)
    const IntellectualCuriosity = useSelector(selectIntellectualCuriosity)
    const AestheticSensitivity = useSelector(selectAestheticSensitivity)
    const CreativeImagination = useSelector(selectCreativeImagination)


    // Slider Control
    const min = useSharedValue(RATING_MIN_VALUE);
    const max = useSharedValue(RATING_MAX_VALUE);
    let progress = useSharedValue(currentQuestion.response)

    /**
     * When the question changes, reset progress.value to the new question's response.
     */
    useEffect(() => {
        progress.value = currentQuestion.response
    }, [currentQuestion])

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

    const BFI2Screen = () => (
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
                  header={(props: ViewProps): React.ReactElement => (
                      <View {...props}><Text category='h3'>
                          Domain Scales
                      </Text></View>)}
                  style={styles.scoreCard}>
                {factorBar(extraversion, 0)}
                {factorBar(agreeableness)}
                {factorBar(conscientiousness)}
                {factorBar(neuroticism)}
                {factorBar(openness)}
            </Card>
            <Card disabled={true}
                  footer={makeResetFooter(() => {
                      dispatch(resetPersonalityQuiz())
                  })}
                  header={(props: ViewProps): React.ReactElement => (
                      <View {...props}><Text category='h3'>
                          Facet Scales
                      </Text></View>)}
                  style={styles.scoreCard}>
                {factorBar(Sociability,0)}
                {factorBar(Assertiveness)}
                {factorBar(EnergyLevel)}
                {factorBar(Compassion)}
                {factorBar(Respectfulness)}
                {factorBar(Trust)}
                {factorBar(Organization)}
                {factorBar(Productiveness)}
                {factorBar(Responsibility)}
                {factorBar(Anxiety)}
                {factorBar(Depression)}
                {factorBar(EmotionalVolatility)}
                {factorBar(IntellectualCuriosity)}
                {factorBar(AestheticSensitivity)}
                {factorBar(CreativeImagination)}
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
        <BFI2Screen/>
    );
}
