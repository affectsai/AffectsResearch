import React, {useEffect, useState} from 'react';
import {
    Tab,
    TabView,
} from '@ui-kitten/components';
import {
    ScrollView
} from 'react-native';

import { BigFiveInventory1Screen } from "../features/personality/bfi1_screen.component"

import {BigFiveInventory2Screen} from "../features/personality/bfi2_screen.component";


export function BigFiveInventoryScreen(): React.JSX.Element {
    const shouldLoadComponent = (index: number): boolean => index === currentTab;
    const [currentTab, setCurrentTab] = useState(0)
    const TopTabBar = () => (
        <ScrollView>
            <TabView
                shouldLoadComponent={shouldLoadComponent}
                selectedIndex={currentTab}
                onSelect={index => setCurrentTab(index)}
            >
                <Tab title='BFI'>
                    <BigFiveInventory2Screen/>
                </Tab>
                <Tab title='BFI (original)'>
                    <BigFiveInventory1Screen/>
                </Tab>
            </TabView>
        </ScrollView>


    );

    return (
            <TopTabBar/>
    );
}
