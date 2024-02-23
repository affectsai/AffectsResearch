/**
 * Copyright (C) 2024 Affects AI LLC - All Rights Reserved
 *
 * You may use, distribute and modify this code under the terms of
 * the CC BY-SA-NC 4.0 license.
 *
 * You should have received a copy of the CC BY-SA-NC 4.0 license
 * with this file. If not, please write to info@affects.ai or
 * visit:
 *    https://creativecommons.org/licenses/by-nc-sa/4.0/deed.en
 *
 * This source based on the article "Licenses: The Best Part of Your App"
 * by Evan Bacon:
 *      https://blog.expo.dev/licenses-the-best-part-of-your-app-29e7285b544f
 */

import React from 'react';
import { Text, View, FlatList, StyleSheet } from 'react-native';
import LicensesListItem from './LicenceListItem';

export default function Licenses({ licenses }) {
    // @ts-ignore
    const renderItem = React.useCallback(
        ({ item }) => <LicensesListItem {...item} />,
        []
    );

    return (
        <FlatList
            style={styles.list}
            keyExtractor={({ key }) => key}
            data={licenses}
            renderItem={renderItem}
        />
    );
}

const styles = StyleSheet.create({
    list: {
        flex: 1,
    },
});
