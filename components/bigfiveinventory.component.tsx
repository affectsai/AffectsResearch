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

const makeFooter = (nextCallback: ButtonCallback, previousCallback: ButtonCallback) => {
    return (props: ViewProps): React.ReactElement => (
        <View
            {...props}
            // eslint-disable-next-line react/prop-types
            style={[props.style, styles.footerContainer]}
        >
            <Button
                style={styles.footerControl}
                size='small'
                status='basic'
                onPress={previousCallback}
            >
                GO BACK
            </Button>
            <Button
                style={styles.footerControl}
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
                    footer={makeFooter(nextButtonCallback, backButtonCallback)}>
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
                    style={styles.scoreCard}>
                    <Text category='h4'>Extraversion: {extraversion.toFixed(0)}%</Text>
                    <ProgressBar progress={extraversion/100}/>
                    <Text category='h4' style={{marginTop: 20}}>Agreeableness: {agreeableness.toFixed(0)}%</Text>
                    <ProgressBar  progress={agreeableness/100}/>
                    <Text category='h4' style={{marginTop: 20}}>Conscientiousness {conscientiousness.toFixed(0)}%</Text>
                    <ProgressBar  progress={conscientiousness/100}/>
                    <Text category='h4' style={{marginTop: 20}}>Neuroticism {neuroticism.toFixed(0)}%</Text>
                    <ProgressBar  progress={neuroticism/100}/>
                    <Text category='h4' style={{marginTop: 20}}>Openness {openness.toFixed(0)}%</Text>
                    <ProgressBar  progress={openness/100}/>
                </Card>
            </Layout>
        </SafeAreaView>
    );
}
