import { StackScreenProps } from "@react-navigation/stack";
import { StyleSheet } from "react-native";

export type RootStackParamList = {
  Home: undefined;
  Details: undefined;
};

export type HomeScreenNavigationProp = StackScreenProps<
  RootStackParamList,
  'Home'
>;

export type DetailsScreenNavigationProp = StackScreenProps<
  RootStackParamList,
  'Details'
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
});
