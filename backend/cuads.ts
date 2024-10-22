import axios from "axios";
import {CUADS_SERVICE_API} from "./affectsBackend";
import {CUADSDataCollection} from "../features/cuads/cuadsModel";

export const createCUADSDataCollection = async (data: CUADSDataCollection) => {
    const headers = {
        'Content-Type': 'application/json',
    }

    const response = await axios.post(
        CUADS_SERVICE_API,
        {
            dataCollection: data
        },
        {
            headers: headers
        }
    ).catch((reason) => {
        console.log("Error creating CUADS Data Collection Entry: " + JSON.stringify(reason))
    })

    console.log(JSON.stringify(response))
    return response.data
}