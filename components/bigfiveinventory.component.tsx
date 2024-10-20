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
import SliceProvider from "./SliceProvider";
import {bigFiveInventory2Slice} from "../features/personality/bigFiveInventory2Slice";
import {bigFiveInventory1Slice} from "../features/personality/bigFiveInventory1Slice";
import {SAMScreen} from "./cuads_tab.component";

/**
 * Displays a TopTabBar with tabs for the BFI1 and BFI2 personality surveys.
 */
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
                    <SliceProvider slice={bigFiveInventory2Slice}>
                        <BigFiveInventory2Screen/>
                    </SliceProvider>
                </Tab>
                <Tab title='BFI (original)'>
                    <SliceProvider slice={bigFiveInventory1Slice}>
                        <BigFiveInventory1Screen/>
                    </SliceProvider>
                </Tab>
            </TabView>
        </ScrollView>
    );

    return (
            <TopTabBar/>
    );
}
