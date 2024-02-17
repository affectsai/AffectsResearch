import React from 'react';
import {
  Button,
  Icon,
  Layout,
  Divider,
  TopNavigation,
} from '@ui-kitten/components';
import {SafeAreaView, ImageProps, StyleSheet} from 'react-native';
import {styles, HomeScreenNavigationProp} from './types.tsx';
import {ThemeContext} from './theme-context.tsx';

const HeartIcon = (
  props?: Partial<ImageProps>,
): React.ReactElement<ImageProps> => <Icon {...props} name="heart" />;

export function HomeScreen({
  navigation,
}: HomeScreenNavigationProp): React.JSX.Element {
  const themeContext = React.useContext(ThemeContext);

  const navigateDetails = () => {
    navigation.navigate('Details');
  };

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
        <Button style={styles.button} onPress={themeContext.toggleTheme}>
          Switch Theme
        </Button>
      </Layout>
    </SafeAreaView>
  );
}
