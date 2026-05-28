module.exports = {

name: "ip",

run: async function(api, event) {

api.sendMessage(
`╔════════════════╗
   🌍 GÀ CON MC 🌍
╚════════════════╝

📩 Trang giới thiệu máy chủ:
https://gaconmc.netlify.app/

🪑 PC:
gaconmc.ddns.net:19033

🥹 PE:
gaconmc.ddns.net
19033 🍞

━━━━━━━━━━━━━━━━━━
🌐 Discord:
https://discord.com/invite/C7WkvjH3AB`,
String(event.threadID)
);

}

};