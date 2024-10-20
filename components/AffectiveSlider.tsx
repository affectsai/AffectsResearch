import React, {useState} from "react";
import {Slider} from "react-native-awesome-slider";
import {styles} from "./styles";
import {SharedValue, useSharedValue} from "react-native-reanimated";
import {Falsy, Image, ImageSourcePropType, RecursiveArray, RegisteredStyle, View, ViewStyle} from "react-native";
import Svg, {Defs, LinearGradient, Path, Stop} from "react-native-svg";
import images from "./images";
import {Divider, Text} from "@ui-kitten/components";

interface IntensityQueueProps {
    style?: any; // Allow any style prop
    height: number;
}

interface IntensitySliderProps {
    style?: any; // Allow any style prop
    lowImage: ImageSourcePropType;
    highImage: ImageSourcePropType;
    value: SharedValue<number>;
}

export function AffectiveSlider(): React.JSX.Element {
    const [viewWidth, setViewWidth] = useState(0);

    const min = useSharedValue(0)
    const max = useSharedValue(100)
    const mid = useSharedValue(50)
    const step = 1
    const sliderHeight = 5

    let valence = useSharedValue(50)
    let arousal = useSharedValue(50)

    const IntensityQueue = ({style, height}: IntensityQueueProps) => {
        const intensityQueueHeight = height
        const intensityQueueWidth = viewWidth

        return (
            <Svg style={[style]} width={intensityQueueWidth} height={intensityQueueHeight}>
                <Defs>
                    <LinearGradient id="darkToLight" x1="0" y1="0" x2="1" y2="0">
                        <Stop offset={0} stopColor="black" />
                        <Stop offset={0.25} stopColor="darkgrey"/>
                        <Stop offset={1} stopColor="lightgrey" />
                    </LinearGradient>
                    <LinearGradient id="lightToDark" x1="0" y1="0" x2="1" y2="0">
                        <Stop offset="0" stopColor="lightgrey" />
                        <Stop offset={0.75} stopColor="darkgrey"/>
                        <Stop offset="1" stopColor="black" />
                    </LinearGradient>
                </Defs>

                <Path d={`M 0 0 L ${intensityQueueWidth/2} ${intensityQueueHeight / 2} L 0 ${intensityQueueHeight} Z`}
                      fill="url(#darkToLight)"/>
                <Path d={`M ${intensityQueueWidth/2} ${intensityQueueHeight / 2} L ${intensityQueueWidth} 0 L ${intensityQueueWidth} ${intensityQueueHeight} Z`}
                      fill="url(#lightToDark)"/>
            </Svg>
        );
    };

    const IntensitySlider = ({style, lowImage, highImage, value}: IntensitySliderProps) => (
        <View style={[style, { flexDirection: 'row', width: "100%"}]}>
            <Image style={{ flex: 1, resizeMode: "center", height: '100%', width: "100%", padding: 0}}
                   source={lowImage}/>

            <View
                style={{ flex: 6, flexDirection: 'column'}}
                onLayout={(event) => {
                    const {width} = event.nativeEvent.layout
                    setViewWidth(width)
                }}
            >
                <Slider style={{flex: 1}}
                    progress={value}
                    minimumValue={min}
                    maximumValue={max}
                    bubbleMaxWidth={0}
                    renderBubble={()=>(<></>)}
                    snapToStep={false}
                    step={step}
                    sliderHeight={sliderHeight}
                    thumbWidth={Math.ceil(sliderHeight*1.1*3)}

                    theme={{
                        disableMinTrackTintColor: '#fff',
                        maximumTrackTintColor: '#aaaaaa',
                        minimumTrackTintColor: '#666666',
                        cacheTrackTintColor: '#333',
                        bubbleBackgroundColor: '#000000',
                    }}
                />
                <IntensityQueue style={{flex: 1, marginTop: 10}} height={10}/>
            </View>

            <Image style={{ flex: 1, resizeMode: "center", height: '100%', width: "100%", padding: 0}}
                   source={highImage}/>
        </View>
    )

    return (
        <View >

            <Text style={{marginBottom: 5}} category='p1'>
                Move the slider to rate your level of pleasure
            </Text>
            <IntensitySlider value={valence} style={{marginTop: 10, marginBottom: 20}} lowImage={images.unhappy} highImage={images.happy}/>
            <Divider />

            <Text style={{marginBottom: 5, marginTop: 20}} category='p1'>
                Move the slider to rate your level of arousal
            </Text>
            <IntensitySlider value={arousal} style={{marginTop: 20, marginBottom: 10}}lowImage={images.sleepy} highImage={images.awake}/>
        </View>
    )
}