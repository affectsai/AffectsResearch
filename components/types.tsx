import { StackScreenProps } from "@react-navigation/stack";
import {ImageProps, StyleSheet} from "react-native";
import React from "react";
import {Icon} from "@ui-kitten/components";

export type RootStackParamList = {
  Home: undefined;
  Details: undefined;
  BigFive: undefined;
  SelfAssessment: undefined;
};

export type HomeScreenNavigationProp = StackScreenProps<
  RootStackParamList,
  'Home'
>;

export type DetailsScreenNavigationProp = StackScreenProps<
  RootStackParamList,
  'Details'
>;

export type BigFiveScreenNavigationProp = StackScreenProps<
    RootStackParamList,
    'BigFive'
>;

export type SelfAssessmentBottomTabNavigationPageNavigationProp = StackScreenProps<
    RootStackParamList,
    'SelfAssessment'
>;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    textAlign: 'center',
  },
  button: {
    marginVertical: 16,
  },
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  card: {
    margin: 20,
    width: "95%",
    justifyContent: 'center',
    minHeight: 250
  },
  scoreCard: {
    flex: 1,
    width: "95%",
    marginBottom: 20,
    justifyContent: 'center',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignContent: 'flex-end',
  },
  footerControl: {
    marginHorizontal: 2,
  },
  surveySlider: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#ffffff",
  },
});

export const BackIcon = (
    props?: Partial<ImageProps>,
): React.ReactElement<ImageProps> => <Icon {...props} name="arrow-back" />;
