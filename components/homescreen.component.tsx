import React, {ReactElement} from 'react';
import {
  Button,
  Icon,
  Layout,
useStyleSheet, Text, IconElement, Input, StyleService
} from '@ui-kitten/components';
import {
  SafeAreaView,
  ImageProps,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  View,
  ImageStyle,
  TouchableWithoutFeedback
} from 'react-native';

import {useDispatch, useSelector} from "react-redux";

import * as WebBrowser from 'expo-web-browser';


import {
  logout,
  selectAuthToken,
  storeToken,
  storeTokenActionPayload
} from "../features/authentication/authenticationSlice";

import {clearID, selectIdentity, setID} from "../features/identification/idSlice";

const HeartIcon = (
    props?: Partial<ImageProps>,
): React.ReactElement<ImageProps> => <Icon {...props} name="heart" />;

const GoogleIcon = (
    props?: Partial<ImageProps>,
): React.ReactElement<ImageProps> => <Icon {...props} name="google" />;

export function HomeScreen(): React.JSX.Element {
  const authToken = useSelector(selectAuthToken);
  const identity = useSelector(selectIdentity);

  const dispatch = useDispatch();
  const [needAccount, setNeedAccount] = React.useState(true);
  const [editableParticipantID, setEditableParticipantID] = React.useState(false);
  const [participantID, setParticipantID] = React.useState<string>(identity);
  const [password, setPassword] = React.useState<string>();



  const styles = useStyleSheet(themedStyles);
  const PersonIcon = (style: ImageStyle): IconElement => (
      <Icon {...style} name='person' />
  );

  return (
      <Layout style={styles.container}>
        <Layout style={styles.headerContainer}>
          <Text
              category='h1'
              status='control'>
            Affects Research
          </Text>
          <Text
              style={styles.signInLabel}
              category='s1'
              status='control'>
            Let's get started
          </Text>
        </Layout>
        <Layout
            style={styles.formContainer}
            level='1'>
          <KeyboardAvoidingView>
          <Text style={{marginLeft: 3}} category="p1">Particpant ID:</Text>
          <Input
              disabled={!editableParticipantID}
              placeholder='participant id'
              accessoryRight={PersonIcon}
              value={participantID}
              onEndEditing={(value)=> {
                setEditableParticipantID(false);
                dispatch(setID({identity: participantID}));
              }}
              onChangeText={(value)=>setParticipantID(value)}
          />
          {/*<Input*/}
          {/*    style={styles.passwordInput}*/}
          {/*    disabled={true}*/}
          {/*    placeholder={needAccount?'new password':'password'}*/}
          {/*    accessoryRight={renderPasswordIcon}*/}
          {/*    value={''}*/}
          {/*    secureTextEntry={!passwordVisible}*/}
          {/*    onChangeText={()=>alert('change pw')}*/}
          {/*/>*/}
          {/*<View style={styles.forgotPasswordContainer}>*/}
          {/*  <Button*/}
          {/*      style={styles.forgotPasswordButton}*/}
          {/*      appearance='ghost'*/}
          {/*      status='basic'*/}
          {/*      onPress={()=>setNeedAccount(!needAccount)}>*/}
          {/*    {needAccount?'Already Registered?':'Need an account?'}*/}
          {/*  </Button>*/}
          {/*</View>*/}
          </KeyboardAvoidingView>


          <View style={styles.messageContainer}>
            <Text category="h6">What is my Participant ID?</Text>
            <Text style={{marginTop: 5}} category="p2">This is a globally unique, random identifier that we use instead of usernames, emails, or other identifiers. It can not be
            used to identify you in any way.</Text>
            <Text style={{marginTop: 5}} category="p2">
              <Text category="p2">If you were given a participant ID code as part of a sponsored research project, </Text>
              <Text status='info' category="p2" onPress={()=>{dispatch(clearID()); setEditableParticipantID(true)}}>click here</Text>
              <Text category='p2'> to enter it above.</Text>
            </Text>

          </View>
          {/*<Button*/}
          {/*    style={styles.signInButton}*/}
          {/*    size='giant'>*/}
          {/*  {needAccount?'REGISTER':'SIGN IN'}*/}
          {/*</Button>*/}
        </Layout>
      </Layout>
  );
}

const themedStyles = StyleService.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'background-basic-color-1',
  },
  headerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 216,
    backgroundColor: 'color-primary-default',
  },
  formContainer: {
    flex: 1,
    paddingTop: 32,
    paddingHorizontal: 16,
  },
  messageContainer: {
    paddingTop: 32,
    paddingHorizontal: 16,
  },
  signInLabel: {
    marginTop: 16,
  },
  signInButton: {
    marginHorizontal: 16,
    marginTop: 50
  },
  signUpButton: {
    marginVertical: 12,
    marginHorizontal: 16,
  },
  forgotPasswordContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  passwordInput: {
    marginTop: 16,
  },
  forgotPasswordButton: {
    paddingHorizontal: 0,
  },
});
