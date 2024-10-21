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

import {homeScreenStyles, styles} from '../../components/styles';

import {ButtonCallback, makeCardFooter, makeCardHeader} from "../personality/shared";
import {AffectiveSlider} from "../../components/AffectiveSlider";
import {Dimensions, View, ViewProps} from "react-native";
import VideoPlayer from 'expo-video-player'
import {AVPlaybackStatus, ResizeMode, Video} from "expo-av";
import media from "../../components/media";
import { setStatusBarHidden } from 'expo-status-bar'
import * as ScreenOrientation from 'expo-screen-orientation'
import {useNavigation, useNavigationContainerRef} from "@react-navigation/native";
import {useSharedValue} from "react-native-reanimated";
import {useDispatch, useSelector} from "react-redux";
import {
    incrementCurrentMediaIndex, resetCurrentMediaIndex, selectCUADSDataCollection,
    selectCurrentMediaIndex,
    selectCurrentMediaRating, selectNumberOfMediaFiles
} from "./cuadsSlice";
import {AppDispatch} from "../../store";

export function CuadsComponent(): React.JSX.Element {
    const navigation = useNavigation();
    const styles = useStyleSheet(homeScreenStyles);
    const dispatch = useDispatch<AppDispatch>();

    const [viewWidth, setViewWidth] = useState(0);
    const [viewHeight, setViewHeight] = useState(0);
    const [inFullscreen, setInFullscreen] = useState(false)

    const isPlaying = useRef(false);

    const videoPlayerRef: MutableRefObject<Video> = useRef<Video>(null) as MutableRefObject<Video>

    const currentIndex = useSelector(selectCurrentMediaIndex)
    const totalMediaCount = useSelector(selectNumberOfMediaFiles)
    const currentMediaRating = useSelector(selectCurrentMediaRating)
    const currentDataCollection = useSelector(selectCUADSDataCollection)

    const valence = useSharedValue(50);
    const arousal = useSharedValue(50);
    const didPlayFullVideo = useRef(false);
    const mediaStartTime = useRef(0);
    const mediaEndTime = useRef(0);
    const mediaNumPauses = useRef(0);

    useEffect(()=>{
        dispatch(resetCurrentMediaIndex())

        console.log( "Current index: " + currentIndex )
        console.log( "Current media file: " + JSON.stringify(currentMediaRating))
    },[])

    useEffect(()=>{
        valence.value = 50
        arousal.value = 50
        mediaStartTime.current = 0
        mediaEndTime.current = 0
        didPlayFullVideo.current = false
        mediaNumPauses.current = 0
    }, [currentMediaRating])


    const exitFullScreen = async () => {
        setInFullscreen(!inFullscreen)
        if ( videoPlayerRef.current ) {
            setStatusBarHidden(false, 'fade')
            setInFullscreen(false)
            await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.DEFAULT)
            await videoPlayerRef.current.setStatusAsync({ shouldPlay: false }).then((status)=>{console.log("Set shouldPlay: false")})
        }
    }

    const enterFullScreen = async () => {
        console.log("Enter full screen")
        if ( videoPlayerRef.current ) {
            setStatusBarHidden(true, 'fade')
            setInFullscreen(true)
            await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_LEFT)
            await videoPlayerRef.current.setStatusAsync({ shouldPlay: true, positionMillis: 0 }).then((status)=>{console.log("Set shouldPlay: true")})
        }
    }

    const VideoElement = ({}) => {
        if ( !currentMediaRating )
            return <></>

        return <VideoPlayer
                videoProps={{
                    shouldPlay: false,
                    resizeMode: ResizeMode.CONTAIN,
                    source: media[currentMediaRating.mediaItem.mediaIdentifier], //media.video_107,
                    ref: videoPlayerRef,
                }}
                slider={{
                    visible: false
                }}
                fullscreen={{
                    inFullscreen: inFullscreen,
                    enterFullscreen: enterFullScreen,
                    exitFullscreen: exitFullScreen,
                }}
                playbackCallback={async (playbackStatus: AVPlaybackStatus) => {
                    if (playbackStatus.didJustFinish) {
                        await exitFullScreen()
                        didPlayFullVideo.current = true;
                        isPlaying.current = false;
                    }

                    if ( !isPlaying.current && playbackStatus.isPlaying ) {
                        if ( mediaStartTime.current == 0 )
                            mediaStartTime.current = Date.now()

                        console.log("Did begin playing at " + mediaStartTime);
                        isPlaying.current=true;
                    } else if ( isPlaying.current && ! playbackStatus.isPlaying ) {
                        if ( inFullscreen )
                            console.log("Did pause");
                        else
                            console.log( "Did stop");

                        isPlaying.current = false;
                    }

                    if ( playbackStatus.isPlaying && ! inFullscreen ) {
                        await enterFullScreen();
                    }
                }}
                style={{
                    videoBackgroundColor: 'black',
                    width: inFullscreen ? (Dimensions.get('screen').height) : 340,
                    height: inFullscreen ? (Dimensions.get('screen').width-20)  : 212,
                }}
            />
    }

    const makeCuadsCardHeader = () => {
        const currentQuestion = currentIndex + 1;
        const totalQuestions = currentDataCollection.mediaRatings.length

        return (props: ViewProps): React.ReactElement => (
            <View {...props}>
                <Text category='s1'>
                    Presentation {currentQuestion} of {totalQuestions}
                </Text>
                <Text category='p1'>After watching the video, rate your feelings using
                    <Text category='p1' style={{fontWeight: 'bold'}}> BOTH sliders </Text>
                    (their order of appearance will change randomly).
                    <Text category='p1' style={{fontWeight: 'bold'}}> Don't think too much</Text> about it, just
                    <Text category='p1' style={{fontWeight: 'bold'}}> rate how you feel</Text> when watching it.
                </Text>
            </View>
        );
    }

    const makeCuadsCardFooter = (nextCallback: ButtonCallback, previousCallback: ButtonCallback) => {
        const firstQuestion = currentIndex == 0
        const lastQuestion = currentIndex >= (totalMediaCount-1)

        const finalCallback = () => {
            if ( nextCallback )
                nextCallback();
            dispatch(resetCurrentMediaIndex());
            navigation.goBack();
        }

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
                        onPress={previousCallback}
                    >
                        STOP STUDY
                    </Button>
                    <Button
                        style={styles.footerControl}
                        size='small'
                        onPress={lastQuestion?finalCallback:nextCallback}
                    >
                        {lastQuestion?"ALL DONE":"NEXT VIDEO"}
                    </Button>
                </View>
            </Layout>
        );
    }

    const storeResponses = () => {
        dispatch(incrementCurrentMediaIndex())
    }

    const SAMScreenCard = () => (
        <Layout style={styles.container}>
            <Layout styles={styles.formContainer}>
            <Card disabled={true}
                  style={styles.card}
                  header={makeCuadsCardHeader()}
                  footer={makeCuadsCardFooter(storeResponses, ()=>{navigation.goBack()})}>
                <View style={{marginTop: 10, marginBottom: 20, width: "100%"}}
                      onLayout={(event) => {
                          const {height, width} = event.nativeEvent.layout
                          setViewWidth(Math.floor(width))
                          setViewHeight(Math.floor(height))
                      }}
                >
                    <VideoElement/>
                    {/*<Video paused={true} poster={images.happy} playInBackground={false} fullscreenAutorotate={true} fullscreenOrientation='landscape' style={{width: "100%", aspectRatio: 1.6}} resizeMode='contain' source={media.video_107} ref={videoRef} controls={true} resizeMode={'cover'}/>*/}
                </View>
                <Divider />
                <AffectiveSlider valence={valence} arousal={arousal}/>
            </Card>
        </Layout></Layout>
    )

    return inFullscreen?<VideoElement/>:<SAMScreenCard/>
}
