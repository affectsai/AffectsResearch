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
 * This file contains several components shared across different
 * implementations of the personality survey.
 */

import React, {useEffect, useState} from 'react';
import {
    Text,
    Layout,
    Button, ProgressBar
} from '@ui-kitten/components';
import {
    View,
    ViewProps,
} from 'react-native';
import {styles} from '../../components/styles';
import {Factor} from "./fiveFactoryModel";

export type ButtonCallback = (() => void) | undefined;

export const makeCardHeader = (title: string, description: string, currentQuestion: number, totalQuestions: number) => {
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

export const makeCardFooter = (firstQuestion: boolean, lastQuestion: boolean, nextCallback: ButtonCallback, previousCallback: ButtonCallback) => {
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

export const statusBar = (value: number, label: string, topMargin: number = 20) => {
    // valueNotOK is unnecessarily complicated, and was the result of bad state initialization on first-launch.
    // But the app is stable and it doesn't hurt, so it's staying this way for now. We'll probably clean
    // this up in the future.
    const valueNotOK = value == null || Number.isNaN(value) || value < 0 || value == Number.POSITIVE_INFINITY
    if (valueNotOK)
        value = Number.NEGATIVE_INFINITY

    return (
        <>
            <Layout style={{flexDirection: 'row', marginTop: topMargin}}>
                <Text style={{flex: 2}} status={value < 0 ? 'danger' : 'info'}>{label}:</Text>
                <Text style={{flex: 1, textAlign: 'right'}}
                      status={value < 0 ? 'danger' : 'info'}>{value == null || value < 0 ? 'pending...' : `${value.toFixed(0)}%`}</Text>
            </Layout>
            <ProgressBar style={{marginTop: 5}} progress={value / 100}/>
        </>
    );
}

export const factorBar = (factor: Factor, topMargin: number = 20) => {
    let value = factor.score
    const label = factor.name

    // valueNotOK is unnecessarily complicated, and was the result of bad state initialization on first-launch.
    // But the app is stable and it doesn't hurt, so it's staying this way for now. We'll probably clean
    // this up in the future.
    const valueNotOK = value == null || Number.isNaN(value) || value < 0 || value == Number.POSITIVE_INFINITY
    if (valueNotOK)
        value = Number.NEGATIVE_INFINITY

    return (
        <>
            <Layout style={{flexDirection: 'row', marginTop: topMargin}}>
                <Text style={{flex: 2}} status={value < 0 ? 'danger' : 'info'}>{label}:</Text>
                <Text style={{flex: 1, textAlign: 'right'}}
                      status={value < 0 ? 'danger' : 'info'}>{value == null || value < 0 ? 'pending...' : `${value.toFixed(0)}%`}</Text>
            </Layout>
            <ProgressBar style={{marginTop: 5}} progress={value / 100}/>
        </>
    );
}
