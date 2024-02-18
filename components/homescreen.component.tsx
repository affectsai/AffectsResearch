import React from 'react';
import {
  Button,
  Icon,
  Layout,
  Divider,
  TopNavigation,
} from '@ui-kitten/components';
import {SafeAreaView, ImageProps, StyleSheet, StatusBar} from 'react-native';
import {styles, HomeScreenNavigationProp} from './types.tsx';
import {useDispatch} from "react-redux";

const HeartIcon = (
  props?: Partial<ImageProps>,
): React.ReactElement<ImageProps> => <Icon {...props} name="heart" />;

export function HomeScreen({
  navigation,
}: HomeScreenNavigationProp): React.JSX.Element {
  const navigateDetails = () => {
    navigation.navigate('Details');
  };

  const dispatch = useDispatch();

  const toggleTheme = () => {
    dispatch({type: 'TOGGLE_THEME'})
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <TopNavigation title="MyApp" alignment="center" />
      <Divider />
      <Layout style={styles.container}>
        <Button
          style={styles.button}
          onPress={navigateDetails}
          accessoryLeft={HeartIcon}>
          Open Details
        </Button>
        <Button style={styles.button} onPress={toggleTheme}>
          Switch Theme
        </Button>
      </Layout>
    </SafeAreaView>
  );
}
