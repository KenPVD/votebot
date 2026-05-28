const { Client, Intents } = require("discord.js");

module.exports = function(api) {

const client = new Client({

intents: [
Intents.FLAGS.GUILDS,
Intents.FLAGS.GUILD_MESSAGES
]

});

client.once("ready", () => {

console.log(
`Discord online: ${client.user.tag}`
);

});

client.on("messageCreate", (message) => {

if (message.author.bot) return;

// Chỉ nhận phòng này
if (
message.channel.id !==
"1509552440498716712"
) return;

console.log(
"[DISCORD]",
message.content
);

const text =
message.content;

try {

const groups = [
"1010263868194263",
"811747201484160"
];

for (const id of groups) {

api.sendMessage(
`💬 Discord
👤 ${message.member.displayName}
🆔 ${message.author.username}

📝 ${text}`,
id
);

}

console.log(
"Đã gửi Messenger 😄"
);

} catch (e) {

console.log(e);

}

});

client.login(
"MTQ1NDU3NjkxNjM3NTAxMTQyMA.GJR-3u.vjzhHQsC7OUDGiduvSlXsjMxj5__e-pyGV1Y-k"
);

};