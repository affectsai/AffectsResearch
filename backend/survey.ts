import {FiveFactoryModel} from "../features/personality/fiveFactoryModel";
import axios from "axios";
import {SURVEY_SERVICE_API} from "./affectsBackend";

export const saveSurvey = async (surveyId: string, data: FiveFactoryModel) => {
    const headers = {
        'Content-Type': 'application/json',
    }

    let result = false;

    await axios.patch(
        `${SURVEY_SERVICE_API}/${surveyId}`,
        {survey: JSON.stringify(data)},
        {
            headers: headers
        }
    ).then((response) => {
        result = true;
    }).catch((reason) => {
        console.log("Error saving survey: " + reason)
    })

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


