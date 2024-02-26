/* Copyright (C) 2024 Affects AI LLC - All Rights Reserved
 *
 * You may use, distribute and modify this code under the terms of
 * the CC BY-NC-SA 4.0 license.
 *
 * You should have received a copy of the CC BY-NC-SA 4.0 license
 * with this file. If not, please write to info@affects.ai or
 * visit:
 *    https://creativecommons.org/licenses/by-nc-sa/4.0/deed.en
 */

import React, {useEffect} from 'react';
import {
  Icon,
  Layout,
useStyleSheet, Text, IconElement, Input, StyleService
} from '@ui-kitten/components';
import {
  ImageProps,
  KeyboardAvoidingView,
  View,
  ImageStyle,
} from 'react-native';
import {useDispatch, useSelector} from "react-redux";
import {
  selectAuthToken,
} from "../features/authentication/authenticationSlice";
import {clearID, selectIdentity, setID} from "../features/identification/idSlice";
import {homeScreenStyles} from './styles'

/**
 * ParticipantIDScreen displays the current Participant ID, and allows users to set their ID
 * if they were assigned one as part of a study.
 */
export function ParticipantIDScreen(): React.JSX.Element {
  const authToken = useSelector(selectAuthToken);
  let identity = useSelector(selectIdentity);
  const dispatch = useDispatch();

  const [editableParticipantID, setEditableParticipantID] = React.useState(false);
  const [participantID, setParticipantID] = React.useState<string>(identity);

  useEffect(() => {
    setParticipantID(identity)
  },[identity])

  const styles = useStyleSheet(homeScreenStyles);
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
              onEndEditing={(event)=> {
                setEditableParticipantID(false);
                setParticipantID(event.nativeEvent.text);
                dispatch(setID({participantId: event.nativeEvent.text}));
              }}
              onChangeText={(value)=>setParticipantID(value)}
          />

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
        </Layout>
      </Layout>
  );
}


