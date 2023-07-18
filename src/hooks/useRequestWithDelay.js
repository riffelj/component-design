import { useState, useEffect } from "react";

export const REQUEST_STATUS = {
    LOADING: "loading",
    SUCCESS: "success",
    FAILURE: "failure",

}

function useRequestWithDelay(delayTime = 1000, initialData = []) {
    const [data, setData] = useState(initialData);
    const [requestStatus, setRequestStatus] = useState(REQUEST_STATUS.LOADING);
    const [error, setError] = useState("");

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    useEffect(() => {
        async function delayFunc() {
            try {
                await delay(delayTime);
                // throw "Had Error." // test error handling
                setData(data);
                setRequestStatus(REQUEST_STATUS.SUCCESS);
            } catch (e) {
                setRequestStatus(REQUEST_STATUS.FAILURE);
                setError(e);
            }
        }
        delayFunc();
    },
        []  // use an empty array here so it only runs the first time the component renders 
    );

    function updateRecord(record, doneCallback) {
        const originalRecords = [...data];
        const newRecords = data.map(function (rec) {
            return rec.id === record.id ? record : rec;
        });

        async function delayFunction() {
            try {
                setData(newRecords);
                await delay(delayTime);
                if (doneCallback) {
                    doneCallback();
                }
            } catch (error) {
                console.log("error thrown inside delayFunction", error);
                if (doneCallback) {
                    doneCallback();
                }
                setData(originalRecords);
            }
        }
        delayFunction();
    }

    function insertRecord(record, doneCallback) {
        const originalRecords = [...data];
        const newRecords = [record, ...data];

        async function delayFunction() {
            try {
                setData(newRecords);
                await delay(delayTime);
                if (doneCallback) {
                    doneCallback();
                }
            } catch (error) {
                console.log("error thrown inside delayFunction", error);
                if (doneCallback) {
                    doneCallback();
                }
                setData(originalRecords);
            }
        }
        delayFunction();
    }

    function deleteRecord(record, doneCallback) {
        const originalRecords = [...data];
        const newRecords = data.filter(rec => rec.id != record.id);

        async function delayFunction() {
            try {
                setData(newRecords);
                await delay(delayTime);
                if (doneCallback) {
                    doneCallback();
                }
            } catch (error) {
                console.log("error thrown inside delayFunction", error);
                if (doneCallback) {
                    doneCallback();
                }
                setData(originalRecords);
            }
        }
        delayFunction();
    }

    /*function onFavoriteToggle(id) {
        const speakersRecPrevious = speakersData.find(rec => rec.id === id);
        const speakerRecUpdated = {
            ...speakersRecPrevious,
            favorite: !speakersRecPrevious.favorite
        };
        const speakersDataNew = speakersData.map(rec => rec.id === id ? speakerRecUpdated : rec);
        setSpeakersData(speakersDataNew);
    }*/

    return { data, requestStatus, error, updateRecord, insertRecord, deleteRecord };
}

export default useRequestWithDelay;