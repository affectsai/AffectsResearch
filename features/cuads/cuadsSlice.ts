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

import {createAsyncThunk, createReducer, createSelector, createSlice} from "@reduxjs/toolkit";
import {CUADSDataCollection, CUADSMediaRating, CUADSMediaItem, setMediaRating} from "./cuadsModel";
import {selectCurrentIndex, selectSurvey} from "../personality/bigFiveInventory1Slice";
import {randomUUID} from "expo-crypto";
import {FiveFactoryModel} from "../personality/fiveFactoryModel";
import {AsyncThunkConfig} from "@reduxjs/toolkit/dist/createAsyncThunk";
import {createSurvey} from "../../backend/survey";
import {createCUADSDataCollection} from "../../backend/cuads";

export interface CUADSDataCollectionState {
  currentIndex: number;
  dataCollection: CUADSDataCollection;
}

const dummyMediaRating = {
  mediaItem: {mediaIdentifier: ""},
  valence: -1,
  arousal: -1,
  didWatchFullVideo: false,
  mediaStartTime: new Date(0).toISOString(),
  mediaEndTime: new Date(0).toISOString(),
  mediaPauseCount: 0,
} as CUADSMediaRating

function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array
}

const initialCUADSMediaRatings = [
  {...dummyMediaRating, mediaItem: { mediaIdentifier: "video_30" }} as CUADSMediaRating,
  {...dummyMediaRating, mediaItem: { mediaIdentifier: "video_52" }} as CUADSMediaRating,
  {...dummyMediaRating, mediaItem: { mediaIdentifier: "video_53" }} as CUADSMediaRating,
  {...dummyMediaRating, mediaItem: { mediaIdentifier: "video_55" }} as CUADSMediaRating,
  {...dummyMediaRating, mediaItem: { mediaIdentifier: "video_58" }} as CUADSMediaRating,
  {...dummyMediaRating, mediaItem: { mediaIdentifier: "video_69" }} as CUADSMediaRating,
  {...dummyMediaRating, mediaItem: { mediaIdentifier: "video_73" }} as CUADSMediaRating,
  {...dummyMediaRating, mediaItem: { mediaIdentifier: "video_79" }} as CUADSMediaRating,
  {...dummyMediaRating, mediaItem: { mediaIdentifier: "video_80" }} as CUADSMediaRating,
  {...dummyMediaRating, mediaItem: { mediaIdentifier: "video_90" }} as CUADSMediaRating,
  {...dummyMediaRating, mediaItem: { mediaIdentifier: "video_107" }} as CUADSMediaRating,
  {...dummyMediaRating, mediaItem: { mediaIdentifier: "video_111" }} as CUADSMediaRating,
  {...dummyMediaRating, mediaItem: { mediaIdentifier: "video_138" }} as CUADSMediaRating,
  {...dummyMediaRating, mediaItem: { mediaIdentifier: "video_146" }} as CUADSMediaRating,
  {...dummyMediaRating, mediaItem: { mediaIdentifier: "video_cats_f" }} as CUADSMediaRating,
  {...dummyMediaRating, mediaItem: { mediaIdentifier: "video_dallas_f" }} as CUADSMediaRating,
  {...dummyMediaRating, mediaItem: { mediaIdentifier: "video_detroit_f" }} as CUADSMediaRating,
  {...dummyMediaRating, mediaItem: { mediaIdentifier: "video_earworm_f" }} as CUADSMediaRating,
  {...dummyMediaRating, mediaItem: { mediaIdentifier: "video_funny_f" }} as CUADSMediaRating,
  {...dummyMediaRating, mediaItem: { mediaIdentifier: "video_newyork_f" }} as CUADSMediaRating,
] as Array<CUADSMediaRating>

const createInitialState = () => {
  return {
    currentIndex: 0,
    dataCollection: {
      trialId: randomUUID(),
      beginTimestamp: new Date().toISOString(),
      endTimestamp: new Date(0).toISOString(),
      mediaRatings: shuffleArray([...initialCUADSMediaRatings])
    } as CUADSDataCollection
  } as CUADSDataCollectionState
}

const initialState = createInitialState()

interface SetMediaRatingAction {
  type: string,
  payload: {
    mediaRating: CUADSMediaRating,
  }
}

interface SetParticipantIDAction {
  type: string,
  payload: {
    participantID: string,
  }
}

interface EndCUADSDataCollectionAction {
  type: string,
  payload: {
    timestamp: number,
  }
}

const storeCUADSDataCollectionInBackend = createAsyncThunk(
    `cuads/storeCUADSDataCollectionInBackend`,
    async(data: CUADSDataCollection, thunkAPI: AsyncThunkConfig) => {
      return await createCUADSDataCollection(data)
    }
);

/**
 * identitySlice manages the ParticipantID code...
 */
const cuadsSlice = createSlice({
  name: 'cuads',
  initialState,
  reducers: {
    setParticipantID(state, action: SetParticipantIDAction) {
      state.dataCollection.participantId = action.payload.participantID;
      console.log("Saved participant ID: " + state.dataCollection.participantId)
    },
    saveMediaRating(state, action: SetMediaRatingAction) {
      setMediaRating(state.dataCollection, action.payload.mediaRating)
    },
    incrementCurrentMediaIndex(state) {
      if ( state.currentIndex < (state.dataCollection.mediaRatings.length-1) )
        state.currentIndex = state.currentIndex + 1;
    },
    resetCurrentMediaIndex(state) {
      console.log("Reset media index to 0")
      state.currentIndex = 0;
    },
    initializeNewCUADSStudy: () => createInitialState()
  },
  extraReducers: (builder) => {
    builder.addCase(storeCUADSDataCollectionInBackend.fulfilled, (state, action) => {
      console.log("Saved survey in backend...")
    })
  }
})

export const {setParticipantID, saveMediaRating, incrementCurrentMediaIndex, resetCurrentMediaIndex, initializeNewCUADSStudy} = cuadsSlice.actions;
export {storeCUADSDataCollectionInBackend}

export const selectParticipantID = (state: { cuads: CUADSDataCollectionState }) => state.cuads.dataCollection.participantId;

export const selectCUADSDataCollection = (state: { cuads: CUADSDataCollectionState }) => state.cuads.dataCollection;
export const selectCurrentMediaIndex = (state: { cuads: CUADSDataCollectionState }) => state.cuads.currentIndex
export const selectNumberOfMediaFiles = (state: { cuads: CUADSDataCollectionState }) => state.cuads.dataCollection.mediaRatings.length
export const selectCurrentMediaRating = createSelector([selectCurrentMediaIndex, selectCUADSDataCollection], (index, dataCollection) => {
  return dataCollection.mediaRatings[index];
});

export default cuadsSlice.reducer;


