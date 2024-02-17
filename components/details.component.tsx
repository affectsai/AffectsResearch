import React from 'react';
import {
  Text,
  Icon,
  Layout,
  Divider,
  TopNavigation,
  TopNavigationAction,
} from '@ui-kitten/components';
import {
  SafeAreaView,
  ImageProps,
} from 'react-native';
import {styles, DetailsScreenNavigationProp} from './types.tsx';

const BackIcon = (
  props?: Partial<ImageProps>,
): React.ReactElement<ImageProps> => <Icon {...props} name="arrow-back" />;

export function DetailsScreen({
  navigation,
}: DetailsScreenNavigationProp): React.JSX.Element {
  const navigateBack = () => {
    navigation.goBack();
  };

  const BackAction = () => (
    <TopNavigationAction icon={BackIcon} onPress={navigateBack} />
  );

  return (
    <SafeAreaView style={{flex: 1}}>
      <TopNavigation
        title="Affects AI Research"
        alignment="center"
        accessoryLeft={BackAction}
      />
      <Divider />
      <Layout style={styles.container}>
        <Text category="h1">DETAILS</Text>
        <Text>Welcome to UI Kitten Details!</Text>
      </Layout>
    </SafeAreaView>
  );
}
