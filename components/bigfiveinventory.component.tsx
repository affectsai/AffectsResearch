import React, {useEffect, useState} from 'react';
import {
    Text,
    Icon,
    Layout,
    Divider,
    TopNavigation,
    TopNavigationAction, Card, Button, ProgressBar, CircularProgressBar,
} from '@ui-kitten/components';
import {
    GestureResponderEvent,
    SafeAreaView, ScrollView, View, ViewProps,
} from 'react-native';
import {styles, BigFiveScreenNavigationProp, BackIcon} from './types';
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
    selectConscientiousnessScore, selectNeuroticismScore, selectOpennessScore
} from "../features/personality/personalityQuizSlice";

const makeHeader = (title: string, description: string) => {
    return (props: ViewProps): React.ReactElement => (
        <View {...props}>
            <Text category='h6'>
                {title}
            </Text>
            <Text category='s1'>
                {description}
            </Text>
        </View>
    );
}


type ButtonCallback = (() => void) | undefined;

const makeFooter = (firstQuestion: boolean, lastQuestion: boolean, nextCallback: ButtonCallback, previousCallback: ButtonCallback) => {
    return (props: ViewProps): React.ReactElement => (
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
    );
}


export function BigFiveInventoryScreen({
                                           navigation,
                                       }: BigFiveScreenNavigationProp): React.JSX.Element {
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

    const navigateBack = () => {
        navigation.goBack();
    };

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

    const BackAction = () => (
        <TopNavigationAction icon={BackIcon} onPress={navigateBack}/>
    );

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
            <Text style={{marginTop: topMargin}} status={value < 0 ? 'danger' : 'success'}>{label}: {value < 0 ? 'pending...' : `${value.toFixed(0)}%`}</Text>
            <ProgressBar progress={value/100}/>
            </>
        );
    }


    return (
        <SafeAreaView style={{flex: 1, height: "100%"}}>
            <TopNavigation
                title="Personality Survey"
                alignment="center"
                accessoryLeft={BackAction}
            />
            <Divider/>
            <Layout style={styles.container}>
                <Text category="h1">Big Five Inventory</Text>
                <Card
                    style={styles.card}
                    header={makeHeader('I see myself as someone who...', surveyQuestions.get(currentQuestion+1))}
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
                            setChosenValue(Math.round(x));
                        }}
                    />
                </Card>
                <Card
                    header={(props: ViewProps): React.ReactElement => (
                        <View {...props}><Text category='h3'>
                        Personality Traits
                        </Text></View>)}
                    style={styles.scoreCard}>
                    {statusBar(extraversion, "Extraversion", 5)}
                    {statusBar(agreeableness, "Agreeableness")}
                    {statusBar(conscientiousness, "Conscientiousness")}
                    {statusBar(neuroticism, "Neuroticism")}
                    {statusBar(openness, "Openness")}
                </Card>
            </Layout>
        </SafeAreaView>
    );
}
