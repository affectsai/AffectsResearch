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
    Image,
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
    selectAgreeableness,
    selectConscientiousness,
    selectNegativeEmotionality,
    selectOpenMindedness,
    selectSurvey,
    createSurveyInBackend, retrieveSurveyFromBackend, selectSurveyId, updateSurveyInBackend
} from './bigFiveInventory2Slice'
import {RATING_MAX_VALUE, RATING_MIN_VALUE} from "./fiveFactoryModel";

import * as Haptics from 'expo-haptics'
import {makeCardHeader, makeCardFooter, makeResetFooter, statusBar, ButtonCallback, factorBar} from "./shared";
import {AppDispatch} from "../../store";
import {useSliceActions} from "../../components/SliceProvider";
import images from "../../components/images";

export function SAMScreen(): React.JSX.Element {

    /*
     * There's probably a better way to handle this... feels like too many state variables.
     * But I'm rushed for time right now so it's what we're going live with.
     */



    // Slider Control
    const min = useSharedValue(1);
    const max = useSharedValue(10);
    let progress = useSharedValue(6)




    const SAMScreenCard = () => (
        <Layout style={styles.container}>
            <Card disabled={true}
                  style={styles.card}
                  header={makeCardHeader(`Valence`, '', 1, 3)}
                  footer={makeCardFooter(false, false, ()=>{}, ()=>{})}>
                <Image style={{alignSelf: 'center', resizeMode: "contain", height: "50%", padding: 20, marginBottom: 50}}
                       source={images.sammy1}/>
                <Slider
                    style={styles.surveySlider}
                    progress={progress}
                    minimumValue={min}
                    maximumValue={max}
                    bubbleMaxWidth={500}
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
                    <Text style={{flex: 1, textAlign: 'center'}} category='label'></Text>
                    <Text style={{flex: 1, textAlign: 'center'}} category='label'></Text>
                    <Text style={{flex: 1, textAlign: 'center'}} category='label'></Text>
                    <Text style={{flex: 1, textAlign: 'center'}} category='label'>10</Text>
                </Layout>
                <Layout style={{flexDirection: 'row', marginTop: 10}}>
                    <Text style={{flex: 1, textAlign: 'left'}} category='label'>Very Negative</Text>
                    <Text style={{flex: 1, textAlign: 'right'}} category='label'>Very Positive</Text>
                </Layout>
            </Card>
        </Layout>
    )

    return (
        <SAMScreenCard/>
    );
}
