/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {StyleSheet} from 'react-native';

import * as eva from '@eva-design/eva';
import {ApplicationProvider, Layout, Text} from '@ui-kitten/components';


type SectionProps = PropsWithChildren<{
  title: string;
}>;

function HomeScreen(): React.JSX.Element {
  return (
    <Layout style={styles.sectionTitle}>
      <Text category="h1">HELLO</Text>
    </Layout>
  );
}

function App(): React.JSX.Element {
  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <HomeScreen />
    </ApplicationProvider>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
