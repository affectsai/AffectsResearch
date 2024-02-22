import React, {useEffect, useState} from 'react';
import {
    Text,
    Icon,
    Layout,
    Divider,
    TopNavigation,
    TopNavigationAction, Card, Button, ProgressBar, TabBar, Tab, TabView,
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
    saveQuestion,
    resetPersonalityQuiz,
} from './bigFiveInventory1Slice'

import {
    selectCurrentQuestion,
    selectExtraversionScore,
    selectAgreeablenessScore,
    selectConscientiousnessScore,
    selectNegativeEmotionalityScore,
    selectOpenMindednessScore,
    selectSurveySize,
    selectCurrentIndex
} from './fiveFactoryModel'
import * as Haptics from 'expo-haptics'

export const makeHeader = (title: string, description: string, currentQuestion: number, totalQuestions: number) => {
    return (props: ViewProps): React.ReactElement => (
        <View {...props}>
        <Text category='p2'>
            Question {currentQuestion} of {totalQuestions}
        </Text>
        <Text style={{marginTop: 5}} category='s1'>
            {title}
            </Text>
            <Text category='p1'>
            {description}
            </Text>
            </View>
    );
}

export type ButtonCallback = (() => void) | undefined;

export const makeFooter = (firstQuestion: boolean, lastQuestion: boolean, nextCallback: ButtonCallback, previousCallback: ButtonCallback) => {
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

export const makeResetFooter = (resetCallback: ButtonCallback) => {
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
