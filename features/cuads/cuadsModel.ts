
export interface CUADSMediaItem {
    mediaIdentifier: string;
}

export interface CUADSMediaRating {
    mediaItem: CUADSMediaItem;
    valence: number;
    arousal: number;
    didWatchFullVideo: boolean;
    mediaStartTime: string;
    mediaEndTime: string;
    mediaPauseCount: number;
}

export interface CUADSDataCollection {
    trialId: string;
    beginTimestamp: string;
    endTimestamp: string;
    mediaRatings: Array<CUADSMediaRating>
}

export const setMediaRating = ( dataCollection: CUADSDataCollection, mediaRating: CUADSMediaRating ) => {
    let dataCollectionMediaRating =
        dataCollection.mediaRatings.find(
            rating => rating.mediaItem.mediaIdentifier == mediaRating.mediaItem.mediaIdentifier )

    if ( dataCollectionMediaRating === undefined ) {
        dataCollection.mediaRatings.push({...mediaRating})
    } else {
        dataCollectionMediaRating.valence = mediaRating.valence;
        dataCollectionMediaRating.arousal = mediaRating.arousal;
        dataCollectionMediaRating.didWatchFullVideo = mediaRating.didWatchFullVideo;
        dataCollectionMediaRating.mediaStartTime = mediaRating.mediaStartTime;
        dataCollectionMediaRating.mediaEndTime = mediaRating.mediaEndTime;
        dataCollectionMediaRating.mediaPauseCount = mediaRating.mediaPauseCount;
    }

    return
}

export const getMediaRating = ( dataCollection: CUADSDataCollection, mediaIdentifier: string)=> {
    return dataCollection.mediaRatings.find( rating => rating.mediaItem.mediaIdentifier == mediaIdentifier );
}