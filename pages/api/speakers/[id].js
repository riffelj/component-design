import path from "path";
import fs from "fs";

const { promisify } = require("util");
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const delay = (ms) => new Promise((resolve) => { setTimeout(resolve, ms) });

export default async function handler(req, res) {

    const method = req?.method;
    const id = parseInt(req?.query.id);
    const recordFromBody = req?.body;
    const jsonFile = path.resolve("./", "db.json");

    switch (method) {
        case "POST":
            await postMethod();
            break;
        case "PUT":
            await putMethod();
            break;
        case "DELETE":
            await deleteMethod();
            break;
        default:
            res.status(501).send(`Method ${method} not implemented`);
    }

    async function putMethod() {
        try {
            const readFileData = await readFile(jsonFile);
            await delay(1000);
            const speakers = JSON.parse(readFileData).speakers;
            if (speakers) {
                const newSpeakersArray = speakers.map(rec => rec.id == id ? recordFromBody : rec);
                writeFile(jsonFile, JSON.stringify({ speakers: newSpeakersArray }, null, 2));
                res.setHeader("Content-Type", "application/json");
                res.status(200).send(JSON.stringify(recordFromBody, null, 2));
                console.log(`PUT /api/speakers/${id} status: 200`);
            } else {
                res.status(404).send("ERROR: Request failed with status code 404");
            }
        } catch (e) {
            res.status(500).send(`PUT /api/speakers/${id} status: 500 unexpected error`);
            console.log(`PUT /api/speakers/${id} status: 200`, e);
        }
    }

    async function postMethod() {
        try {
            const readFileData = await readFile(jsonFile);
            await delay(1000);
            const speakers = JSON.parse(readFileData).speakers;
            if (speakers) {
                const idNew = speakers.reduce((accumulator, currentValue) => {
                    const idCurrent = parseInt(currentValue.id);
                    return idCurrent > accumulator ? idCurrent : accumulator;
                }, 0) + 1;

                const newSpeakerRec = { ...recordFromBody, id: idNew.toString() };

                const newSpeakersArray = [newSpeakerRec, ...speakers];
                writeFile(jsonFile, JSON.stringify({ speakers: newSpeakersArray }, null, 2));
                res.setHeader("Content-Type", "application/json");
                res.status(200).send(JSON.stringify(newSpeakerRec, null, 2));
                console.log(`POST /api/speakers/${id} status: 200`);
            } else {
                res.status(404).send("ERROR: Request failed with status code 404");
            }
        } catch (e) {
            res.status(500).send(`POST /api/speakers/${id} status: 500 unexpected error`);
            console.log(`POST /api/speakers/${id} status: 200`, e);
        }
    }

    async function deleteMethod() {
        try {
            const readFileData = await readFile(jsonFile);
            await delay(1000);
            const speakers = JSON.parse(readFileData).speakers;
            if (speakers) {
                const newSpeakersArray = speakers.filter(rec => rec.id != id);
                const deletedRecord = JSON.stringify(speakers.find(rec => rec.id == id));
                writeFile(jsonFile, JSON.stringify({ speakers: newSpeakersArray }, null, 2));
                res.setHeader("Content-Type", "application/json");
                res.status(200).send(JSON.stringify(deletedRecord, null, 2));
                console.log(`DELETE /api/speakers/${id} status: 200`);
            } else {
                res.status(404).send("ERROR: Request failed with status code 404");
            }
        } catch (e) {
            res.status(500).send(`DELETE /api/speakers/${id} status: 500 unexpected error`);
            console.log(`DELETE /api/speakers/${id} status: 200`, e);
        }
    }
}