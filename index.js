process.on("uncaughtException", (err) => {
    console.log("UNCAUGHT ERROR:");
    console.log(err);
});

process.on("unhandledRejection", (err) => {
    console.log("UNHANDLED:");
    console.log(err);
});

const fca = require("ws3-fca");
const fs = require("fs");
const axios = require("axios");

// Load commands
const commands = {};

function loadCommands() {

    const files = fs
        .readdirSync("./commands")
        .filter(file => file.endsWith(".js"));

    for (const key in commands) {
        delete commands[key];
    }

    for (const file of files) {

        delete require.cache[
            require.resolve(`./commands/${file}`)
        ];

        const command = require(`./commands/${file}`);

        if (
            !command.name ||
            typeof command.run !== "function"
        ) {
            console.log(`Command lỗi: ${file}`);
            continue;
        }

        commands[command.name.toLowerCase()] = command;
    }

}

loadCommands();

// Đọc appstate
const appState = JSON.parse(
    fs.readFileSync("appstate.json", "utf8")
);

console.log("Đang login...");

// Login
fca.login(
    {
        appState,
        forceLogin: true
    },

    (err, api) => {

        if (err) {
            console.log("LOGIN ERROR:");
            return console.log(err);
        }

        console.log("BOT ONLINE 😄");

        // Discord bridge
        try {
            require("./discord")(api);
        } catch (e) {
            console.log("Discord bridge lỗi:");
            console.log(e);
        }

        api.setOptions({
            selfListen: false,
            listenEvents: true,
            updatePresence: false,
            forceLogin: true,
            autoMarkRead: true
        });

        api.listenMqtt(async (err, event) => {

            try {

                if (err) {
                    console.log("MQTT ERROR:");
                    return console.log(err);
                }

                if (!event) return;

                // Bot vào nhóm
                if (
                    event.logMessageType === "log:subscribe"
                ) {

                    const addedUsers =
                        event.logMessageData.addedParticipants;

                    for (const user of addedUsers) {

                        if (
                            user.userFbId ==
                            api.getCurrentUserID()
                        ) {

                            setTimeout(() => {

                                api.sendMessage(
                                    `╔════════════════╗
   🎉 Bot Server GCMC 🎉
╚════════════════╝

✨ Xin chào mọi người!
🤖 Bot đã vào nhóm thành công.

📡 Hệ thống:
┗ Online & hoạt động ổn định

💬 Gõ /ping để kiểm tra
máy chủ Server GaConMC

🚀 Chúc mọi người chơi vui vẻ!`,
                                    event.threadID
                                );

                            }, 3000);

                        }

                    }

                }

                if (!event.body) return;

                console.log(
                    "THREAD:",
                    event.threadID
                );

                console.log(
                    "Tin nhắn:",
                    event.body
                );

                axios.post(
                    "https://discord.com/api/webhooks/1509611646224437379/PlDgBIOZb1mAf7iZ_xLT2uFxXOHo2uxQRWEHjyswn-9HSMjRVacq5Rqr7nSk12112TUF",
                    {
                        content:
                            `
                            📩 Messenger
👤 https://www.facebook.com/profile.php?id=${event.senderID}

💬 ${event.body}`
                    }
                ).catch(() => { });

                const msg =
                    event.body.toLowerCase();

                const args =
                    event.body.trim().split(" ");

                const cmd =
                    args[0].trim().toLowerCase();

                // Reload
                if (cmd === "/reload") {

                    try {

                        loadCommands();

                        api.sendMessage(
                            "✅ Reload thành công",
                            event.threadID
                        );

                    } catch (e) {

                        console.log(e);

                        api.sendMessage(
                            "❌ Reload lỗi",
                            event.threadID
                        );

                    }

                    return;
                }

                // Command
                if (commands[cmd]) {

                    try {

                        await commands[cmd].run(
                            api,
                            event,
                            args
                        );

                    } catch (e) {

                        console.log(
                            `Lỗi command ${cmd}:`
                        );

                        console.log(e);

                    }

                    return;
                }

                // Auto detect
                for (const key in commands) {

                    if (
                        msg.includes(key) &&
                        cmd !== key
                    ) {

                        try {

                            await commands[key].run(
                                api,
                                event,
                                args
                            );

                        } catch (e) {

                            console.log(e);

                        }

                        return;

                    }

                }

            } catch (e) {

                console.log(
                    "Lỗi listenMqtt:"
                );

                console.log(e);

            }

        });

    });