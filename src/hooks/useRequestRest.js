import { useState, useEffect } from "react";
import axios from "axios";

export const REQUEST_STATUS = {
    LOADING: "loading",
    SUCCESS: "success",
    FAILURE: "failure",

}

const restUrl = "api/speakers";

function useRequestRest() {
    const [data, setData] = useState([]);
    const [requestStatus, setRequestStatus] = useState(REQUEST_STATUS.LOADING);
    const [error, setError] = useState("");

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    useEffect(() => {
        async function delayFunc() {
            try {
                const result = await axios.get(restUrl);
                setRequestStatus(REQUEST_STATUS.SUCCESS);
                setData(result.data);
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
                await axios.put(`${restUrl}/${record.id}`, record);
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
                await axios.post(`${restUrl}/99999`, record);
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
                await axios.delete(`${restUrl}/${record.id}`, record);
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

export default useRequestRest;