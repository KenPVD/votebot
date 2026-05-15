const admin = require("firebase-admin");
const { exec } = require("child_process");

const serviceAccount =
require("./firebase.json");

admin.initializeApp({
    credential:
    admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

let cache = {};

setInterval(async () => {

    const snap =
    await db.collection("votes").get();

    snap.forEach(docu => {

        const data = docu.data();

        const player =
        data.minecraft || docu.id;

        const count =
        data.count || 0;

        const reward =
        data.reward || 1000;

        if (cache[player] !== count) {

            cache[player] = count;

            console.log(
                `[VOTE] ${player} +${reward}`
            );

            exec(
                 `mcrcon.exe -H 192.168.100.109 -P 25575 -p 123456 "money give ${player} ${reward}"`
            );

        }

    });

}, 5000);