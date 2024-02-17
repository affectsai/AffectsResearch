/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {StyleSheet, ImageProps} from 'react-native';

import * as eva from '@eva-design/eva';
import {
  ApplicationProvider,
  Button,
  Icon,
  IconRegistry,
  Layout,
  Text,
} from '@ui-kitten/components';
import {EvaIconsPack} from '@ui-kitten/eva-icons';

/*
 * Branding...
 */
import {default as theme} from './affectsai-theme.json'; // <-- Import app theme
import {default as mapping} from './affectsai-theme-mapping.json'; // <-- Import app mapping

/**
 * Use any valid `name` property from eva icons (e.g `github`, or `heart-outline`)
 * https://akveo.github.io/eva-icons
 */
const HeartIcon = (
  props?: Partial<ImageProps>,
): React.ReactElement<ImageProps> => <Icon {...props} name="heart" />;

function HomeScreen(): React.JSX.Element {
  return (
    <Layout style={styles.container}>
      <Text category="h1">Welcome to UI Kitten</Text>
      <Text>Welcome to UI Kitten</Text>
      <Button style={styles.likeButton} accessoryLeft={HeartIcon}>
        LIKE
      </Button>
    </Layout>
  );
}

function App(): React.JSX.Element {
  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider
        {...eva}
        theme={{...eva.light, ...theme}}
        customMapping={mapping}>
        <HomeScreen />
      </ApplicationProvider>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    textAlign: 'center',
  },
  likeButton: {
    marginVertical: 16,
  },
});

export default App;
