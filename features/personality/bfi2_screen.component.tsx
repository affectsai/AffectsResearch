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
import {styles} from '../../components/types';
import {Slider} from 'react-native-awesome-slider';
import {useDerivedValue, useSharedValue} from "react-native-reanimated";
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
    selectSurveySize,
    selectSociabilityScore,
    selectCurrentIndex,
    selectAssertivenessScore,
    selectEnergyLevelScore,
    selectCompassionScore,
    selectRespectfulnessScore,
    selectTrustScore,
    selectOrganizationScore,
    selectProductivenessScore,
    selectResponsibilityScore,
    selectAnxietyScore,
    selectDepressionScore,
    selectEmotionalVolatilityScore,
    selectIntellectualCuriosityScore, selectAestheticSensitivityScore, selectCreativeImaginationScore
} from './bigFiveInventory2Slice'


import * as Haptics from 'expo-haptics'
import {makeHeader, makeFooter, makeResetFooter, ButtonCallback} from "./shared";

export function BigFiveInventory2Screen(): React.JSX.Element {
    const dispatch = useDispatch();
    const surveySize = useSelector(selectSurveySize)
    const currentQuestion = useSelector(selectCurrentQuestion);
    const extraversionScore = useSelector(selectExtraversionScore)
    const agreeablenessScore = useSelector(selectAgreeablenessScore);
    const conscientiousnessScore = useSelector(selectConscientiousnessScore);
    const neuroticismScore = useSelector(selectNegativeEmotionalityScore);
    const opennessScore = useSelector(selectOpenMindednessScore);
    const SociabilityScore = useSelector(selectSociabilityScore)
    const AssertivenessScore = useSelector(selectAssertivenessScore)
    const EnergyLevelScore = useSelector(selectEnergyLevelScore)
    const CompassionScore = useSelector(selectCompassionScore)
    const RespectfulnessScore = useSelector(selectRespectfulnessScore)
    const TrustScore = useSelector(selectTrustScore)
    const OrganizationScore = useSelector(selectOrganizationScore)
    const ProductivenessScore = useSelector(selectProductivenessScore)
    const ResponsibilityScore = useSelector(selectResponsibilityScore)
    const AnxietyScore = useSelector(selectAnxietyScore)
    const DepressionScore = useSelector(selectDepressionScore)
    const EmotionalVolatilityScore = useSelector(selectEmotionalVolatilityScore)
    const IntellectualCuriosityScore = useSelector(selectIntellectualCuriosityScore)
    const AestheticSensitivityScore = useSelector(selectAestheticSensitivityScore)
    const CreativeImaginationScore = useSelector(selectCreativeImaginationScore)
    const [sliderValue, setSliderValue] = useState(currentQuestion.response);

    const min = useSharedValue(1);
    const max = useSharedValue(5);
    let progress = useSharedValue(currentQuestion.response)


    useEffect(() => {
        progress.value = sliderValue;
    }, [sliderValue])

    useEffect(() => {
        progress.value = currentQuestion.response
    }, [currentQuestion])

    const backButtonCallback: ButtonCallback = () => {
        if (progress.value < 0)
            progress.value = 1
        console.log(`Saving value ${progress.value} for question ${currentQuestion.text}`);
        dispatch(saveQuestion({question: {...currentQuestion, response: progress.value}}))
        dispatch(previousQuestion());
    }

    const nextButtonCallback: ButtonCallback = () => {
        if (progress.value < 0)
            progress.value = 1
        console.log(`Saving value ${progress.value} for question ${currentQuestion.text}`);
        dispatch(saveQuestion({question: {...currentQuestion, response: progress.value}}))
        dispatch(nextQuestion());
    }

    const statusBar = (value: number, label: string, topMargin: number = 20) => {

        const valueNotOK = value == null || Number.isNaN(value) ||value < 0 || value == Number.POSITIVE_INFINITY
        if (valueNotOK)
            value = Number.NEGATIVE_INFINITY

        console.log(`${value} -- ${valueNotOK}`)
        return (
            <>
                <Layout style={{flexDirection: 'row', marginTop: topMargin}}>
                    <Text style={{flex: 2}} status={valueNotOK ? 'danger' : 'info'}>{label}:</Text>
                    <Text style={{flex: 1, textAlign: 'right'}}
                          status={valueNotOK ? 'danger' : 'info'}>{ valueNotOK ? 'pending...' : `${value.toFixed(0)}%`}</Text>
                </Layout>
                <ProgressBar style={{marginTop: 5}} progress={value/100}/>
            </>
        );
    }

    const BFI2Screen = () => (
        <Layout style={styles.container}>
            <Card disabled={true}
                  style={styles.card}
                  header={makeHeader(`I see myself as someone who...`, currentQuestion.text, currentQuestion.index, surveySize)}
                  footer={makeFooter(currentQuestion.index == 1, currentQuestion.index == surveySize, nextButtonCallback, backButtonCallback)}>
                <Slider
                    style={styles.surveySlider}
                    progress={progress}
                    minimumValue={min}
                    maximumValue={max}
                    bubbleMaxWidth={500}
                    bubble={(x) => {
                        let desc = "Strongly Disagree";
                        let val = Math.round(x);
                        if (val <= 1)
                            desc = "Strongly Disagree";
                        else if (val <= 3)
                            desc = "Somewhat disagree";
                        else if (val <= 6)
                            desc = "Neither agree nor disagree";
                        else if (val <= 8)
                            desc = "Somewhat agree";
                        else if (val <= 10)
                            desc = "Strongly Agree";

                        return `${val} - ${desc}`;
                    }}
                    onValueChange={(x) => {
                        progress.value = x
                    }}
                    onSlidingComplete={(x) => {
                        progress.value = Math.round(x);
                        setSliderValue(progress.value);
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
                {statusBar(extraversionScore, "Extraversion", 0)}
                {statusBar(agreeablenessScore, "Agreeableness")}
                {statusBar(conscientiousnessScore, "Conscientiousness")}
                {statusBar(neuroticismScore, "Negative Emotionality")}
                {statusBar(opennessScore, "Open Mindedness")}
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
                {statusBar(SociabilityScore, "Sociability", 0)}
                {statusBar(AssertivenessScore, "Assertiveness")}
                {statusBar(EnergyLevelScore, "EnergyLevel")}
                {statusBar(CompassionScore, "Compassion")}
                {statusBar(RespectfulnessScore, "Respectfulness")}
                {statusBar(TrustScore, "Trust")}
                {statusBar(OrganizationScore, "Organization")}
                {statusBar(ProductivenessScore, "Productiveness")}
                {statusBar(ResponsibilityScore, "Responsibility")}
                {statusBar(AnxietyScore, "Anxiety")}
                {statusBar(DepressionScore, "Depression")}
                {statusBar(EmotionalVolatilityScore, "Emotional Volatility")}
                {statusBar(IntellectualCuriosityScore, "Intellectual Curiosity")}
                {statusBar(AestheticSensitivityScore, "Aesthetic Sensitivity")}
                {statusBar(CreativeImaginationScore, "Creative Imagination")}
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
