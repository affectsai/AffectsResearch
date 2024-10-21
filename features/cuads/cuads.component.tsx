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
import {Card, Divider, Layout, Text, useStyleSheet} from '@ui-kitten/components';

import {homeScreenStyles, styles} from '../../components/styles';

import {makeCardFooter, makeCardHeader} from "../personality/shared";
import {AffectiveSlider} from "../../components/AffectiveSlider";
import {Dimensions, View} from "react-native";
import VideoPlayer from 'expo-video-player'
import {AVPlaybackStatus, ResizeMode, Video} from "expo-av";
import media from "../../components/media";
import { setStatusBarHidden } from 'expo-status-bar'
import * as ScreenOrientation from 'expo-screen-orientation'
import {useNavigation, useNavigationContainerRef} from "@react-navigation/native";

export function CuadsComponent(): React.JSX.Element {
    const [viewWidth, setViewWidth] = useState(0);
    const [viewHeight, setViewHeight] = useState(0);

    const isPlaying = useRef(false);
    const [inFullscreen2, setInFullscreen2] = useState(false)

    const videoPlayerRef: MutableRefObject<Video> = useRef<Video>(null) as MutableRefObject<Video>
    const navigation = useNavigation();

    const styles = useStyleSheet(homeScreenStyles);


    useEffect(()=>{

    },[])

    const exitFullScreen = async () => {
        setInFullscreen2(!inFullscreen2)
        if ( videoPlayerRef.current ) {
            setStatusBarHidden(false, 'fade')
            setInFullscreen2(false)
            await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.DEFAULT)
            await videoPlayerRef.current.setStatusAsync({ shouldPlay: false }).then((status)=>{console.log("Set shouldPlay: false")})
        }
    }

    const enterFullScreen = async () => {
        console.log("Enter full screen")
        if ( videoPlayerRef.current ) {
            setStatusBarHidden(true, 'fade')
            setInFullscreen2(true)
            await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_LEFT)
            await videoPlayerRef.current.setStatusAsync({ shouldPlay: true, positionMillis: 0 }).then((status)=>{console.log("Set shouldPlay: true")})
        }
    }

    const VideoElement = ({}) => {
        return <VideoPlayer
                videoProps={{
                    shouldPlay: false,
                    resizeMode: ResizeMode.CONTAIN,
                    source: media.video_107,
                    ref: videoPlayerRef,
                }}
                slider={{
                    visible: false
                }}
                fullscreen={{
                    inFullscreen: inFullscreen2,
                    enterFullscreen: enterFullScreen,
                    exitFullscreen: exitFullScreen,
                }}
                playbackCallback={async (playbackStatus: AVPlaybackStatus) => {
                    if (playbackStatus.didJustFinish) {
                        await exitFullScreen()
                        isPlaying.current = false;
                    }

                    if ( playbackStatus.isPlaying && ! inFullscreen2 ) {
                        await enterFullScreen();
                    }
                }}
                style={{
                    videoBackgroundColor: 'black',
                    width: inFullscreen2 ? (Dimensions.get('screen').height) : 340,
                    height: inFullscreen2 ? (Dimensions.get('screen').width-20)  : 212,
                }}
            />

    }


    const descriptiveText = () => {
        return (
            <Text category='p1'>Please rate the picture using
                    <Text category='p1' style={{fontWeight: 'bold'}}> BOTH sliders </Text>
                (their order of appearance will change randomly).
                    <Text category='p1' style={{fontWeight: 'bold'}}> Don't think too much</Text> about it, just
                    <Text category='p1' style={{fontWeight: 'bold'}}> rate how you feel</Text> when watching it.
            </Text>

        )
    }


    const SAMScreenCard = () => (
        <Layout style={styles.container}>
            <Layout styles={styles.formContainer}>
            <Card disabled={true}
                  style={styles.card}
                  header={makeCardHeader(`Watch and rate the video`, descriptiveText(), 1, 3)}
                  footer={makeCardFooter(false, false, ()=>{}, ()=>{navigation.goBack()})}>
                <View style={{marginTop: 10, marginBottom: 20, width: "100%"}}
                      onLayout={(event) => {
                          const {height, width} = event.nativeEvent.layout
                          setViewWidth(Math.floor(width))
                          setViewHeight(Math.floor(height))
                          console.log(`${viewWidth}X${viewHeight}`)
                      }}
                >
                    <VideoElement/>
                    {/*<Video paused={true} poster={images.happy} playInBackground={false} fullscreenAutorotate={true} fullscreenOrientation='landscape' style={{width: "100%", aspectRatio: 1.6}} resizeMode='contain' source={media.video_107} ref={videoRef} controls={true} resizeMode={'cover'}/>*/}
                </View>
                <Divider />
                <AffectiveSlider/>
            </Card>
        </Layout></Layout>
    )

    return inFullscreen2?<VideoElement/>:<SAMScreenCard/>
}
