import React, {useEffect, useState} from 'react';
import {
    Text,
    Icon,
    Layout,
    Divider,
    TopNavigation,
    TopNavigationAction, Card, Button,
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
    selectCurrentResponse, surveyQuestions
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

    const defaultRating: number = 5;
    const min = useSharedValue(0);
    const max = useSharedValue(10);
    let progress = useSharedValue(currentResponse || defaultRating)
    const [chosenValue, setChosenValue] = useState(currentResponse || defaultRating);

    const navigateBack = () => {
        navigation.goBack();
    };

    useEffect(() => {
        console.log(currentAnswers);
        console.log(currentQuestion);
        console.log(currentResponse);
        setChosenValue(currentResponse || defaultRating);
    }, [currentQuestion, currentAnswers, currentResponse])

    useEffect(() => {
        console.log(`Chosen Value: ${chosenValue}`);
        progress.value = chosenValue;
    }, [chosenValue])

    useEffect(() => {
        console.log(`Progress: ${progress.value}`);
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
                        style={styles.container}
                        progress={progress}
                        minimumValue={min}
                        maximumValue={max}
                        bubble={(x) => {
                            return Math.round(x).toString();
                        }}
                        onValueChange={(x) => {
                            progress.value = x
                        }}
                        onSlidingComplete={(x) => {
                            setChosenValue(Math.round(x));
                        }}
                    />
                </Card>

            </Layout>
        </SafeAreaView>
    );
}
