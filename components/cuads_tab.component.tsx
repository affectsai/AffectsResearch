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

import React, {MutableRefObject, useEffect, useRef, useState} from 'react';
import {Button, Card, Divider, Layout, Text, useStyleSheet} from '@ui-kitten/components';

import {homeScreenStyles, styles} from './styles';

import {ButtonCallback, makeCardFooter, makeCardHeader} from "../features/personality/shared";
import {AffectiveSlider} from "./AffectiveSlider";
import {Dimensions, ScrollView, View, ViewProps} from "react-native";
import VideoPlayer from 'expo-video-player'
import {AVPlaybackStatus, ResizeMode, Video} from "expo-av";
import media from "../features/cuads/cuads_media";
import { setStatusBarHidden } from 'expo-status-bar'
import * as ScreenOrientation from 'expo-screen-orientation'
import {useNavigation, useNavigationContainerRef} from "@react-navigation/native";
import {useSharedValue} from "react-native-reanimated";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../store";
import {initializeNewCUADSStudy, resetCurrentMediaIndex} from "../features/cuads/cuadsSlice";

export function SAMScreen(): React.JSX.Element {
    const dispatch = useDispatch<AppDispatch>();
    const [viewWidth, setViewWidth] = useState(0);
    const [viewHeight, setViewHeight] = useState(0);

    const [isPlaying, setIsPlaying] = useState(false);
    const [inFullscreen, setInFullscreen] = useState(false)

    const videoPlayerRef: MutableRefObject<Video> = useRef<Video>(null)
    const navigation = useNavigation();

    const styles = useStyleSheet(homeScreenStyles);
    const valence = useSharedValue(50);
    const arousal = useSharedValue(50);

    const exitFullScreen = async () => {
        if ( videoPlayerRef.current ) {
            setStatusBarHidden(false, 'fade')
            setInFullscreen(false)
            await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.DEFAULT)
            await videoPlayerRef.current.setStatusAsync({ shouldPlay: false }).then((status)=>{console.log("Set shouldPlay: false")})
        }
    }

    const enterFullScreen = async () => {
        if ( videoPlayerRef.current ) {
            setStatusBarHidden(true, 'fade')
            setInFullscreen(true)
            await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_LEFT)
            await videoPlayerRef.current.setStatusAsync({ shouldPlay: true, positionMillis: 0 }).then((status)=>{console.log("Set shouldPlay: true")})
        }
    }

    const VideoElement = ({}) => {
        return <VideoPlayer
                videoProps={{
                    shouldPlay: false,
                    resizeMode: ResizeMode.CONTAIN,
                    source: media.video_demo,
                    ref: videoPlayerRef
                }}
                fullscreen={{
                    inFullscreen: inFullscreen,
                    enterFullscreen: enterFullScreen,
                    exitFullscreen: exitFullScreen,
                }}
                playbackCallback={async (playbackStatus: AVPlaybackStatus) => {
                    if (playbackStatus.didJustFinish) {
                        await exitFullScreen()
                        return
                    }

                    // If we start playing and aren't in full screen, go to full screen.
                    if ( playbackStatus.isPlaying && ! inFullscreen ) {
                        await enterFullScreen();
                    }
                }}
                slider={{
                    visible: false
                }}
                style={{
                    videoBackgroundColor: 'black',
                    width: inFullscreen ? (Dimensions.get('screen').height) : 340,
                    height: inFullscreen ? (Dimensions.get('screen').width-100)  : 212,
                }}
            />

    }

    const makeCuadsHeader = (title: string) => {
        return (props: ViewProps): React.ReactElement => (
            <View {...props}>
                <Text style={{marginTop: 5}} category='s1'>
                    {title}
                </Text>
                <Text category='p1'>Please read the instructions carefully before you begin.</Text>
            </View>
        );
    }

    const makeCuadsFooter = () => {
        return (props: ViewProps): React.ReactElement => (
            <Layout style={{alignContent: 'flex-end'}}>
                <View
                    {...props}
                    // eslint-disable-next-line react/prop-types
                    style={[props.style, styles.footerContainer]}
                >
                    <Button
                        style={styles.footerControl}
                        size='small'
                        status='basic'
                        onPress={()=>{
                            console.log("YAY")
                            dispatch(initializeNewCUADSStudy())
                            navigation.push('CUADS')
                        }}
                    >
                        BEGIN
                    </Button>
                </View>
            </Layout>

        );
    }

    const SAMScreenCard = () => (
        <Layout style={styles.container}>
            <ScrollView styles={styles.formContainer}>
            <Card disabled={true}
                  style={styles.card}
                  header={makeCuadsHeader(`CUADS Data Collection`)}
                  footer={makeCuadsFooter()}>

                <View style={{width: "100%"}}
                      onLayout={(event) => {
                          const {height, width} = event.nativeEvent.layout
                          setViewWidth(Math.floor(width))
                          setViewHeight(Math.floor(height))
                          console.log(`${viewWidth}X${viewHeight}`)
                      }}
                >
                    <Text category='s2'>Getting Started</Text>
                    <Text category='p2' style={{paddingTop: 3}}>A research assistant should have already reviewed the informed consent statement
                        with you, started the ECG, GSR and PPG sensors, and logged you in to this application with your unique
                        participant identification code. If you are not certain these steps have already happened, please take
                        moment to check in the research assistant before you begin.</Text>
                    <Text category='p2' style={{paddingTop: 3}}>Please get comfortable in your seat and plan to spend just under an hour watching
                    and rating videos. Remember, you may take a break at any time, but please try to remain seated and still during each presentation.</Text>
                    <Divider />
                    <Text category='s2' style={{paddingTop: 10}}>Video Clips</Text>
                    <Text category='p2' style={{paddingTop: 3}}>
                        You will be shown a series of short video clips, each 2 minutes or less. Most of them are from major
                        Hollywood movies you, and some were viral internet videos. It is likely that you have already seen at least some of these clips, that is okay.
                    </Text>
                    <Text category='p2' style={{paddingTop: 3}}>
                        The movie player will automatically switch to full screen when you press play, and switch back
                        when the video ends. Each video begins with a 10-second display of a fixation cross, before the
                        video begins.
                    </Text>
                    <Text category='p2' style={{paddingTop: 3, paddingBottom: 10}}>
                            An example is shown below, go ahead and play it now to see how it works!</Text>
                    <VideoElement/>
                    <Text category='p2' style={{paddingTop: 3, paddingBottom: 10}}>
                        Please note that this demo video has now sound, but the videos you watch during the trial do.
                    </Text>
                    <Divider />
                    <Text category='s2' style={{paddingTop: 10}}>Self Assessment</Text>
                    <Text category='p2' style={{paddingTop: 3}}>
                        After each clip, you'll rate your level of pleasure and arousal.</Text>
                    <Text category='p2' style={{paddingTop: 3}}>
                        For this study, <Text category='p2' style={{fontWeight: 'bold'}}>pleasure</Text> is rated from <Text category='p2' style={{fontStyle: 'italic'}}>unhappy</Text> to <Text category='p2' style={{fontStyle: 'italic'}}>happy.</Text>, or more simply, whether the emotion you are experiencing is a negative (unhappy) or positive (happy) feeling.
                        <Text category='p2' style={{fontWeight: 'bold'}}> Arousal</Text> is rated from <Text category='p2' style={{fontStyle: 'italic'}}>low</Text> to <Text category='p2' style={{fontStyle: 'italic'}}>high</Text>. Think of it as the level of energy associated with the feeling you are experiencing. For example, a sense of calm would be a low-arousal feeling, and excitement would be a high-arousal feeling.
                    </Text>
                    <Text category='p2' style={{paddingTop: 3}}>
                        To do this, you'll use two sliders, as shown below. Sometimes the sliders will appear with pleasure first, and other times with arousal first.
                    </Text>
                    <Text category='p2' style={{paddingTop: 3, paddingBottom: 10}}>
                        Go ahead and move these sliders around to assess how you're feeling right now!
                    </Text>
                    <Divider />
                    <AffectiveSlider arousal={arousal} valence={valence}/>
                    <Divider />
                    <Text category='s2' style={{paddingTop: 10}}>Are You Ready?</Text>
                    <Text category='p2' style={{paddingTop: 3}}>
                        Whenever you are ready, click "BEGIN" below.
                    </Text>
                </View>
            </Card>
        </ScrollView></Layout>
    )

    return inFullscreen?<VideoElement/>:<SAMScreenCard/>
}
