import React, {useEffect, useState} from 'react';
import {
    Layout, Tab, TabView, Text,
} from '@ui-kitten/components';
import {styles} from './types';
import {Image, Linking, ScrollView, StyleSheet} from "react-native";
import {useDispatch} from "react-redux";
import {resetID} from "../features/identification/idSlice";
import {logout} from "../features/authentication/authenticationSlice";
import images from './images'
import LicenceView from "./license/licences.component";
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

export function LegalScreen(): React.JSX.Element {
    const dispatch = useDispatch();
    const [currentTab, setCurrentTab] = useState(0)
    const shouldLoadComponent = (index: number): boolean => index === currentTab;
    const tabBarHeight = useBottomTabBarHeight();
    function ThisAppLegal(): React.JSX.Element {
        return (
            <ScrollView>
                <Layout style={styles.textContainer}>
                    <Text category="h3">License</Text>

                    <Text style={{textAlign: 'justify', marginTop: 10}}>
                        <Text category='p1'>This application, AffectResearch, (hereafter, "app") is written and
                            distributed by </Text>
                        <Text status='info' style={{marginTop: 5}}
                              onPress={() => Linking.openURL('https://affects.ai')}>Affects AI LLC </Text>
                        <Text category="p1">("Affects AI").</Text>
                    </Text>
                    <Image style={{alignSelf: 'center', width: "90%", resizeMode: 'contain', margin: 0, padding: 0}}
                           source={images.licence}/>
                    <Text style={{textAlign: 'justify'}}>
                        <Text>This app is free for non-commercial use under </Text>
                        <Text status='info' style={{marginTop: 5}}
                              onPress={() => Linking.openURL('https://creativecommons.org/licenses/by-nc-sa/4.0/deed.en')}> CC
                            BY-NC-SA 4.0. </Text>
                        <Text>You are free to reuse, modify, and redistribute for non-commercial purposes with
                            attribution to Affects AI LLC.</Text>
                    </Text>
                    <Text style={{textAlign: 'justify', marginTop: 10}}>This app DOES NOT provide medical or treatment
                        advice, is not a professional service, and the information obtained
                        through the app is intended only for educational and research purposes.</Text>

                    <Text style={{marginTop: 10}} category="h3">Privacy</Text>
                    <Text style={{textAlign: 'justify', marginTop: 10}} category='p1'>
                        Affects AI does not collect or retain any identifiable information about you, or your mobile
                        device. We do collect certain
                        anonymous usage data for research and development purposes, including device type and operating
                        system. All data collected will be associated with a unique,
                        randomly generated identification code, which you can view on the Home screen. This
                        identification code was either generated the first time the app
                        was launched on your device, or assigned to you by a research assistant during a sponsored
                        research project. It may be changed by you at any time. If
                        you change your identification code, you are permanently disassociating yourself from any data
                        collected under that code, which may have unintended
                        consequences. Please continue reading the rest of this section to be sure you understand the
                        consequences before you change it.
                    </Text>

                    <Text style={{textAlign: 'justify', marginTop: 10}}>
                        <Text category='p1'>If you would like us to delete your information, you may do so at any time
                            by e-mailing your request and unique identification code to </Text>
                        <Text status='info' style={{marginTop: 5}}
                              onPress={() => Linking.openURL('mailto:info@affects.ai')}>info@affects.ai</Text>
                    </Text>

                    <Text style={{textAlign: 'justify', marginTop: 10}}>
                        Since we do not collect any identifying information about you, or your device, you MUST provide
                        the unique identification code from
                        the home screen in order for us to process your request. We are unable to retrieve your
                        identification code for you. This includes your current code, as
                        well as any prior codes. Once you change your unique identification code, any data recorded
                        using the prior code is permanently and irrevocably disassociated from you, and we
                        will have no way to identify or delete that data from our system.
                    </Text>

                    <Text style={{textAlign: 'justify', marginTop: 10}}>
                        <Text>To generate a new unique ID </Text>
                        <Text status='info' style={{marginTop: 5}}
                              onPress={() => {
                                  dispatch(logout());
                                  dispatch(resetID());
                              }}>
                            click here.
                        </Text>
                    </Text>

                    <Text style={{marginTop: 10}} category="h3">About the Big Five Inventory</Text>
                    <Text style={{textAlign: 'justify', marginTop: 10}}>
                        <Text category='p1'>The Big Five Inventory (BFI) &copy; Oliver P. John, of the </Text>
                        <Text status='info' style={{marginTop: 5}}
                              onPress={() => Linking.openURL('https://www.ocf.berkeley.edu/~johnlab/index.htm')}>
                            Berkeley Personality Lab
                        </Text>
                        <Text> at the University of California, Berkeley. It is available for non-commercial purposes
                            only.</Text>
                    </Text>

                    <Text style={{marginTop: 10}} category="h3">Montserrat Font</Text>
                    <Text style={{textAlign: 'justify', marginTop: 10}}>
                        <Text category='p1'>This app embeds the Montserrat font, &copy; 2011 The Montserrat Project
                            Authors: </Text>
                        <Text status='info'
                              onPress={() => Linking.openURL('https://github.com/JulietaUla/Montserrat')}>github.com/JulietaUla/Montserrat</Text>
                    </Text>
                    <Text style={{textAlign: 'justify', marginTop: 10}}>
                        <Text>This Font Software is licensed under the SIL Open Font License, Version 1.1.
                            This license is available with a FAQ at: </Text>
                        <Text status='info'
                              onPress={() => Linking.openURL('https://openfontlicense.org/')}>https://openfontlicense.org//OFL</Text>
                    </Text>
                </Layout>
            </ScrollView>
        );
    }

    const measure = () => {
        if (tabBar) {
            this.tabBar.measureInWindow(this.props.setTabMeasurement);
        }
    }

    return (
        <TabView
            // shouldLoadComponent={shouldLoadComponent}
            selectedIndex={currentTab}
            onSelect={index => setCurrentTab(index)}
        >
            <Tab title='Affects AI'>
                <ThisAppLegal/>
            </Tab>
            <Tab title='Dependencies'>
                <Layout
                    style={StyleSheet.flatten([styles.licenceContainer, {paddingBottom: 5+tabBarHeight} ])}>
                    <Layout style={{margin: 10}}>
                        <Text style={{marginTop: 10}} category="h3">On the shoulders of Giants</Text>
                        <Text style={{textAlign: 'justify', marginTop: 10}} category='p1'>
                            Building an app is very much like assembling a puzzle. The pieces of our puzzle
                            come from the work of so many others, each of whom distribute their work freely under
                            a variety of open source licenses. Below is a list of all of our puzzle pieces, their authors (if known) and the license under which their piece is distributed.
                        </Text>
                    </Layout>
                    <LicenceView />

                </Layout>
            </Tab>
        </TabView>
    )
}
