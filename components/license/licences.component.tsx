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
import { View } from 'react-native';

import Licenses from './Licences'

import Data from './licences.json';
import {styles} from "../styles";

function extractNameFromGithubUrl(url) {
    if (!url) {
        return null;
    }

    const reg =
        /((https?:\/\/)?(www\.)?github\.com\/)?(@|#!\/)?([A-Za-z0-9_]{1,15})(\/([-a-z]{1,20}))?/i;
    const components = reg.exec(url);

    if (components && components.length > 5) {
        return components[5];
    }
    return null;
}

function sortDataByKey(data, key) {
    data.sort(function (a, b) {
        return a[key] > b[key] ? 1 : b[key] > a[key] ? -1 : 0;
    });
    return data;
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

let licenses = Object.keys(Data).map((key) => {
    let { licenses, ...license } = Data[key];

    let parts = key.split("@")
    let name = (parts.length == 2) ? parts[0] : "@"+parts[1]
    let version = (parts.length == 2) ? parts[1] : parts[2]

    const reg =
        /((https?:\/\/)?(www\.)?github\.com\/)?(@|#!\/)?([A-Za-z0-9_]{1,15})(\/([-a-z]{1,20}))?/i;
    let username =
        extractNameFromGithubUrl(license.repository) ||
        extractNameFromGithubUrl(license.licenseUrl);

    let userUrl;
    let image;
    if (username) {
        username = capitalizeFirstLetter(username);
        image = `http://github.com/${username}.png`;
        userUrl = `http://github.com/${username}`;
    }

    return {
        key,
        name,
        image,
        userUrl,
        username,
        licenses: licenses.slice(0, 405),
        version,
        ...license,
    };
});

sortDataByKey(licenses, 'username');

export default function LicenceView() {
    return (
        <View style={styles.licence_container}>
            <Licenses licenses={licenses} />
        </View>
);
}


