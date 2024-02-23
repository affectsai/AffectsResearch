/* Copyright (C) 2024 Affects AI LLC - All Rights Reserved
 *
 * You may use, distribute and modify this code under the terms of
 * the CC BY-SA-NC 4.0 license.
 *
 * You should have received a copy of the CC BY-SA-NC 4.0 license
 * with this file. If not, please write to info@affects.ai or
 * visit:
 *    https://creativecommons.org/licenses/by-nc-sa/4.0/deed.en
 */

import {ImageProps} from "react-native";
import React from "react";
import {Icon} from "@ui-kitten/components";

export const HomeIcon = (
    props?: Partial<ImageProps>,
): React.ReactElement<ImageProps> => <Icon {...props} name="home"/>;

export const SurveyIcon = (
    props?: Partial<ImageProps>,
): React.ReactElement<ImageProps> => <Icon {...props} name="list"/>;

export const LegalIcon = (
    props?: Partial<ImageProps>,
): React.ReactElement<ImageProps> => <Icon {...props} name="info"/>;
