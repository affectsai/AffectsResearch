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
    selectCurrentResponse
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



type ButtonCallback = (() => void)|undefined;

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
    const currentResponse = useSelector(selectCurrentResponse)
    const [x, setX] = useState(currentResponse||1);
    const [chosenValue, setChosenValue] = useState(currentResponse||1);

    const min = useSharedValue(1);
    const max = useSharedValue(10);
    let progress = useSharedValue(currentResponse||1)

  const navigateBack = () => {
    navigation.goBack();
  };

  const surveyQuestions = [
      "Is talkative",
      "Tends to find fault with other",
      "Does a thorough job",
      "Is depressed, blue",
      "Is original, comes up with new ideas",
      "Is reserved",
      "Is helpful and unselfish with others",
      "Can be somewhat careless",
      "Is relaxed, handles stress well",
      "Is curious about many different things",
      "Is full of energy",
      "Starts quarrels with others",
      "Is a reliable worker",
      "Can be tense",
      "Is ingenious, a deep thinker",
      "Generates a lot of enthusiasm",
      "Has a forgiving nature",
      "Tends to be disorganized",
      "Worries a lot",
      "Has an active imagination",
      "Tends to be quiet",
      "Is generally trusting",
      "Tends to be lazy",
      "Is emotionally stable, not easily upset",
      "Is inventive",
      "Has an assertive personality",
      "Can be cold and aloof",
      "Perseveres until the task in finished",
      "Can be moody",
      "Values artistic, aesthetic experiences",
      "Is sometimes shy, inhibited",
      "Is considerate and kind to almost everyone",
      "Does things efficiently",
      "Remains calm in tense situations",
      "Prefers work that is routine",
      "Is outgoing, sociable",
      "Is sometimes rude to others",
      "Makes plans and follows through with them",
      "Gets nervous easily",
      "Likes to reflect, play with ideas",
      "Has few artistic interests",
      "Likes to cooperate with others",
      "Is easily distracted",
      "Is sophisticated in art, music, or literature"
  ]

    useEffect(() => {
        console.log(currentAnswers);
        console.log(currentQuestion);
        console.log(currentResponse);
        setChosenValue(currentResponse||1);
    }, [currentQuestion,currentAnswers,currentResponse])

    useEffect(() => {
        console.log(`Chosen Value: ${chosenValue}`);
        progress.value = chosenValue;
    }, [chosenValue])

    useEffect(() => {
        console.log(`Progress: ${progress.value}`);
    }, [progress])

  const BackAction = () => (
    <TopNavigationAction icon={BackIcon} onPress={navigateBack} />
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
      <Divider />
      <Layout style={styles.container}>
        <Text category="h1">Big Five Inventory</Text>
          <Card
              style={styles.card}
              header={makeHeader('I see myself as someone who...', surveyQuestions[currentQuestion])}
              footer={makeFooter(nextButtonCallback, backButtonCallback)}>
              <Slider
                  style={styles.container}
                  progress={progress}
                  minimumValue={min}
                  maximumValue={max}
                  bubble={(x)=>{return Math.round(x).toString();}}
                  onValueChange={(x)=>{progress.value=x}}
                  onSlidingComplete={(x)=>{setChosenValue(Math.round(x));}}
              />
          </Card>

      </Layout>
    </SafeAreaView>
  );
}
