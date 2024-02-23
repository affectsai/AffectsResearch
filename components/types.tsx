import { StackScreenProps } from "@react-navigation/stack";
import {ImageProps, StyleSheet} from "react-native";
import React from "react";
import {Icon} from "@ui-kitten/components";
import {BottomTabScreenProps} from "@react-navigation/bottom-tabs";
import Constants from "expo-constants";
import {Navigation} from 'react-native-navigation';

export const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'left',
    alignItems: 'left',
    padding: 10
  },
  licenceContainer: {
    flex: 1,
  },
  licence_container: {
    flex: 1,
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
