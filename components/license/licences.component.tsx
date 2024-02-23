/**
 *
 * Ok, so if you want to make a license page, download this lib: https://www.npmjs.com/package/npm-license-crawler
 * I did it globally: `npm i npm-license-crawler -g`
 *
 * ## There are two main styles
 *
 * ### Overwhelmingly long to avoid really crediting people: (not judging, you do you)
 *
 * `npm-license-crawler --dependencies --json licenses.json`
 *
 * ### And a concise clean list of direct packages:
 *
 * `npm-license-crawler --onlyDirectDependencies --json licenses.json`
 *
 * Then use something like this React component to display that json! :D
 *
 * Special thanks to @_wodin_ on Twitter for helping update the component.
 */

import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Constants from 'expo-constants';

import Licenses from './Licences'

import Data from './licences.json';
import {styles} from "../types";

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


