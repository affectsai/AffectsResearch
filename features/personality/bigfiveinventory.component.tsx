import React, {useEffect, useState} from 'react';
import {
    Text,
    Icon,
    Layout,
    Divider,
    TopNavigation,
    TopNavigationAction, Card, Button, ProgressBar,
} from '@ui-kitten/components';
import {
    Linking,
    SafeAreaView, ScrollView, View, ViewProps,
} from 'react-native';
import {styles} from '../../components/types';
import {Slider} from 'react-native-awesome-slider';
import {useDerivedValue, useSharedValue} from "react-native-reanimated";
import {useDispatch, useSelector} from "react-redux";
import {
    nextQuestion,
    previousQuestion,
    selectQuizAnswers,
    selectCurrentQuestion,
    selectCurrentResponse,
    surveyQuestions,
    selectExtraversionScore,
    selectAgreeablenessScore,
    selectConscientiousnessScore, selectNeuroticismScore, selectOpennessScore, saveAnswer, resetPersonalityQuiz
} from "./personalityQuizSlice";
import * as Haptics from 'expo-haptics'
import {current} from "@reduxjs/toolkit";

const makeHeader = (title: string, description: string, currentQuestion: number, totalQuestions: number) => {
    return (props: ViewProps): React.ReactElement => (
        <View {...props}>
            <Text category='p2'>
                Question {currentQuestion} of {totalQuestions}
            </Text>
            <Text style={{marginTop: 5}} category='s1'>
                {title}
            </Text>
            <Text category='s2' >
                {description}
            </Text>
        </View>
    );
}


type ButtonCallback = (() => void) | undefined;

const makeFooter = (firstQuestion: boolean, lastQuestion: boolean, nextCallback: ButtonCallback, previousCallback: ButtonCallback) => {
    return (props: ViewProps): React.ReactElement => (
        <Layout style={{alignContent: 'flex-end'}}>
            <View
                {...props}
                // eslint-disable-next-line react/prop-types
                style={[props.style, styles.footerContainer]}
            >
                <Button
                    style={styles.footerControl}
                    disabled={firstQuestion}
                    size='small'
                    status='basic'
                    onPress={previousCallback}
                >
                    GO BACK
                </Button>
                <Button
                    style={styles.footerControl}
                    disabled={lastQuestion}
                    size='small'
                    onPress={nextCallback}
                >
                    NEXT QUESTION
                </Button>
            </View>
        </Layout>

    );
}

const makeResetFooter = (resetCallback: ButtonCallback) => {
    return (props: ViewProps): React.ReactElement => (
        <View
            {...props}
            // eslint-disable-next-line react/prop-types
            style={[props.style, styles.footerContainer]}
        >
            <Button
                status='danger'
                style={styles.footerControl}
                size='small'
                onPress={resetCallback}
            >
                RESET ANSWERS
            </Button>
        </View>
    );
}


export function BigFiveInventoryScreen(): React.JSX.Element {
    const dispatch = useDispatch();
    const currentQuestion = useSelector(selectCurrentQuestion);
    const currentAnswers = useSelector(selectQuizAnswers);
    const currentResponse = useSelector(selectCurrentResponse);

    const extraversionScore = useSelector(selectExtraversionScore)
    const agreeablenessScore = useSelector(selectAgreeablenessScore);
    const conscientiousnessScore = useSelector(selectConscientiousnessScore);
    const neuroticismScore = useSelector(selectNeuroticismScore);
    const opennessScore = useSelector(selectOpennessScore);

    const defaultRating: number = 5;
    const min = useSharedValue(0);
    const max = useSharedValue(10);
    let progress = useSharedValue(currentResponse)

    const [extraversion, setExtraversion] = useState(extraversionScore)
    const [agreeableness, setAgreeableness] = useState(agreeablenessScore)
    const [conscientiousness, setConscientiousness] = useState(conscientiousnessScore)
    const [neuroticism, setNeuroticism] = useState(neuroticismScore)
    const [openness, setOpenness] = useState(opennessScore)
    const [chosenValue, setChosenValue] = useState(currentResponse);


    useEffect(() => {
        setChosenValue(currentResponse );
    }, [currentQuestion, currentAnswers, currentResponse])

    useEffect(() => {
        setExtraversion(extraversionScore);
        setAgreeableness(agreeablenessScore);
        setOpenness(opennessScore);
        setNeuroticism(neuroticismScore);
        setConscientiousness(conscientiousnessScore);
        progress.value = chosenValue;
    }, [chosenValue])

    useEffect(() => {
        console.log(surveyQuestions.get(currentQuestion+1))
    }, [progress])


    const backButtonCallback: ButtonCallback = () => {
        console.log(`Saving value ${progress.value} for question ${currentQuestion}`);
        dispatch(previousQuestion({questionNumber: currentQuestion, responseValue: progress.value}));
    }

    const nextButtonCallback: ButtonCallback = () => {
        console.log(`Saving value ${progress.value} for question ${currentQuestion}`);
        dispatch(nextQuestion({questionNumber: currentQuestion, responseValue: progress.value}));
    }

    const statusBar = (value: number, label: string, topMargin: number = 20) => {
        return ( <>
                <Layout style={{flexDirection: 'row', marginTop: topMargin}}>
                    <Text style={{flex: 1}} status={value < 0 ? 'danger' : 'info'}>{label}:</Text>
                    <Text style={{flex: 1, textAlign: 'right'}} status={value < 0 ? 'danger' : 'info'}>{value < 0 ? 'pending...' : `${value.toFixed(0)}%`}</Text>
                </Layout>
            <ProgressBar style={{marginTop: 5}} progress={value/100} />
            </>
        );
    }


    return (
        <ScrollView style={{flex: 1}} contentContainerStyle={{ flexGrow: 1 }}>
            <Layout style={styles.container}>
                    <Text category="h3">Big Five Inventory</Text>
                    <Card disabled={true}
                        style={styles.card}
                        header={makeHeader(`I see myself as someone who...`, surveyQuestions.get(currentQuestion+1), currentQuestion, surveyQuestions.size)}
                        footer={makeFooter(currentQuestion==0, currentQuestion==surveyQuestions.size-1,nextButtonCallback, backButtonCallback)}>
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
                                setChosenValue(progress.value);
                                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).then(()=>{})
                                dispatch(saveAnswer({questionNumber: currentQuestion, responseValue: progress.value}))
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
                            <Text style={{flex:1, textAlign: 'center'}} category='label'>0</Text>
                            <Text style={{flex:1, textAlign: 'center'}} category='label'>1</Text>
                            <Text style={{flex:1, textAlign: 'center'}} category='label'>2</Text>
                            <Text style={{flex:1, textAlign: 'center'}} category='label'>3</Text>
                            <Text style={{flex:1, textAlign: 'center'}} category='label'>4</Text>
                            <Text style={{flex:1, textAlign: 'center'}} category='label'>5</Text>
                            <Text style={{flex:1, textAlign: 'center'}} category='label'>6</Text>
                            <Text style={{flex:1, textAlign: 'center'}} category='label'>7</Text>
                            <Text style={{flex:1, textAlign: 'center'}} category='label'>8</Text>
                            <Text style={{flex:1, textAlign: 'center'}} category='label'>9</Text>
                            <Text style={{flex:1, textAlign: 'center'}} category='label'>10</Text>
                        </Layout>
                        <Layout style={{flexDirection: 'row', marginTop: 10}}>
                            <Text style={{flex:1, textAlign: 'left'}} category='label'>Strongly Disagree</Text>
                            <Text style={{flex:1, textAlign: 'right'}} category='label'>Strongly Agree</Text>
                        </Layout>


                    </Card>
                    <Card disabled={true}
                        footer={makeResetFooter(()=>{
                            dispatch(resetPersonalityQuiz())
                        })}
                        header={(props: ViewProps): React.ReactElement => (
                            <View {...props}><Text category='h3'>
                            Personality Traits
                            </Text></View>)}
                        style={styles.scoreCard}>
                        {statusBar(extraversion, "Extraversion", 15)}
                        {statusBar(agreeableness, "Agreeableness")}
                        {statusBar(conscientiousness, "Conscientiousness")}
                        {statusBar(neuroticism, "Neuroticism")}
                        {statusBar(openness, "Openness")}
                    </Card>
                <Card disabled={true} style={styles.scoreCard}>
                    <Layout >
                        <Text category="p2">The Big Five Inventory is implemented here for research purposes only. For more information
                            about the Big Five Inventory, please see:</Text>
                        <Text category="p2" style={{color: 'blue', marginTop: 5}}
                            onPress={() => Linking.openURL('https://www.ocf.berkeley.edu/~johnlab/index.htm')}>
                            Berkeley Personality Lab
                        </Text>
                    </Layout>

                </Card>

                </Layout>
        </ScrollView>
    );
}
