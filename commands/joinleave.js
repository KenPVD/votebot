module.exports = {

name: "joinleave",

run: async function(api, event) {

// Người vào nhóm
if (
event.logMessageType ===
"log:subscribe"
) {

const users =
event.logMessageData
.addedParticipants;

for (const user of users) {

api.sendMessage(
`  🎉 CHÀO MỪNG 🎉
✨ Xin chào ${user.fullName}!
📥 Bạn vừa tham gia nhóm 😄

🌍 Server Minecraft:
gaconmc.ddns.net:19033

💬 Trang giới thiệu máy chủ:
https://gaconmc.netlify.app/

🥳 Đừng phạm luật nhaaa...🥀`,
event.threadID
);

}

}

// Người rời nhóm
if (
event.logMessageType ===
"log:unsubscribe"
) {

const leftID =
event.logMessageData
.leftParticipantFbId;

// Bot bị kick
if (
leftID ==
api.getCurrentUserID()
) return;

api.sendMessage(
`😢 Có người vừa logout khỏi nhóm 🥀

🆔 https://www.facebook.com/profile.php?id=${leftID}

💔 Xin vĩnh biệt bro...`,
event.threadID
);

}

}

};