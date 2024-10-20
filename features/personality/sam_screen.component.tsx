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

import React, {useEffect, useRef, useState} from 'react';
import {
    Layout,
    Card,
    Text, Divider
} from '@ui-kitten/components';

import {styles} from '../../components/styles';

import {makeCardHeader, makeCardFooter, makeResetFooter, statusBar, ButtonCallback, factorBar} from "./shared";
import {AffectiveSlider} from "../../components/AffectiveSlider";
import {View} from "react-native";
import Video, {VideoRef} from "react-native-video";
import media from "../../components/media";
import images from "../../components/images";

export function SAMScreen(): React.JSX.Element {
    const [videoWidth, setVideoWidth] = useState(0);
    const [videoHeight, setVideoHeight] = useState(0);

    const videoRef = useRef<VideoRef>(null)
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
            <Card disabled={true}
                  style={styles.card}
                  header={makeCardHeader(`Watch and rate the video`, descriptiveText(), 1, 3)}
                  footer={makeCardFooter(false, false, ()=>{}, ()=>{})}>
                <View style={{marginTop: 10, marginBottom: 20}}
                      onLayout={(event) => {
                          const {width} = event.nativeEvent.layout
                          setVideoWidth(Math.floor(width))
                          setVideoHeight(Math.floor(width*0.625))
                          console.log(`${videoWidth}X${videoHeight}`)
                      }}
                >
                    <Video paused={true} poster={images.happy} playInBackground={false} style={{width: "100%", aspectRatio: 1.6}} resizeMode='contain' source={media.video_107} ref={videoRef} controls={true} resizeMode={'cover'}/>
                </View>
                <Divider />
                <AffectiveSlider/>
            </Card>
        </Layout>
    )

    return (
        <SAMScreenCard/>
    );
}
