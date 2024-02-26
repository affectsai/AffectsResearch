import {FiveFactoryModel} from "../features/personality/fiveFactoryModel";
import axios from "axios";
import {SURVEY_SERVICE_API} from "./affectsBackend";

export const saveSurvey = async (surveyId: string, data: FiveFactoryModel) => {
    const headers = {
        'Content-Type': 'application/json',
    }

    let result = undefined;

    try {
        result = await axios.patch(
            `${SURVEY_SERVICE_API}/${surveyId}`,
            {survey: JSON.stringify(data)},
            {
                headers: headers
            }
        );
        result = result.data
    } catch (reason) {
        console.log("Error saving survey: " + reason + ". Trying to create instead.")
        try {
            result = await createSurvey(data)
        } catch (err2) {
            console.log("Couldn't create it either: " + err2)
        }
    }


    return result;
}

export const createSurvey = async (survey: FiveFactoryModel) => {
    const headers = {
        'Content-Type': 'application/json',
    }

    const response = await axios.post(
        SURVEY_SERVICE_API,
        {
            survey: JSON.stringify(survey)
        },
        {
            headers: headers
        }
    ).catch((reason) => {
        console.log("Error creating survey: " + reason)
    })

    return response.data
}

export const getSurvey = async (surveyId: string) => {
    const headers = {
        'Content-Type': 'application/json',
    }

    const response = await axios.get(`${SURVEY_SERVICE_API}/${surveyId}`);
    return response.data
}


