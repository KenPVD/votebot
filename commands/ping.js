const os = require("os");
const util = require("minecraft-server-util");

const facts = [

"Trái tim của tôm nằm ở trong đầu của nó.",
"Ong có thể nhận diện khuôn mặt con người.",
"Cá heo gọi nhau bằng tên riêng.",
"Bạch tuộc có 3 trái tim.",
"Chuối là quả mọng nhưng dâu tây thì không.",
"Một ngày trên sao Kim dài hơn một năm trên sao Kim.",
"Nước nóng có thể đóng băng nhanh hơn nước lạnh.",
"Loài hổ không thể gầm gừ với mèo nhà.",
"Con người chia sẻ khoảng 60% ADN với chuối.",
"Âm thanh không thể truyền trong không gian."

];

module.exports = {

name: "/ping",

run: async function(api, event) {

try {

const uptime =
process.uptime();

const days =
Math.floor(uptime / 86400);

const hours =
Math.floor((uptime % 86400) / 3600);

const minutes =
Math.floor((uptime % 3600) / 60);

const seconds =
Math.floor(uptime % 60);

const ramUsed =
(
(os.totalmem() - os.freemem())
/ 1024 / 1024 / 1024
).toFixed(2);

const ramTotal =
(
os.totalmem()
/ 1024 / 1024 / 1024
).toFixed(2);

const ramPercent =
(
(
(os.totalmem() - os.freemem())
/ os.totalmem()
) * 100
).toFixed(1);

const cpu =
os.cpus()[0].model;

const cores =
os.cpus().length;

const osName =
`${os.type()} ${os.release()}`;

const randomFact =
facts[
Math.floor(
Math.random() * facts.length
)
];

// Minecraft Server
const ip = "185.207.166.16";
const port = 19033;

let status = "Offline ❌";
let version = "Unknown";
let motd = "Không có";
let players = "0/0";

try {

const result =
await util.statusBedrock(
ip,
port,
{
timeout: 5000
}
);

status = "Online ✅";

players =
`${result.players.online}/${result.players.max}`;

version =
result.version.name;

motd =
result.motd.clean;

} catch (e) {

status = "Offline ❌";

}

const msg =
`『 🚀 TRẠNG THÁI MÁY CHỦ 🚀 』
━━━━━━━━━━━━━━━━━━
-ˋˏ 📡 Trạng Thái Bot ˎˊ-
  🕒 Uptime: ${days}d ${hours}h ${minutes}m ${seconds}s
  🛰️ Ping: 1ms
  ✅ Tình trạng: Siêu mượt

-ˋˏ ⚙️ Thông Số Kỹ Thuật ˎˊ-
  💽 CPU: ${cpu} (${cores} cores)
  💾 RAM: [■■■■■□□□□□□□] ${ramPercent}%
    (${ramUsed}GB / ${ramTotal}GB)
  💻 Hệ điều hành: ${osName}

-ˋˏ 🎮 Minecraft Server ˎˊ-
  🌍 IP: gaconmc.ddns.net
  🔌 Port: 19033

  📡 Trạng thái:
  ┗ ${status}

  👥 Người chơi:
  ┗ ${players}

  📦 Version:
  ┗ ${version}

  📝 MOTD:
  ┗ ${motd}

-ˋˏ ✨ Ủa gì vậy??? ˎˊ-
  💡 "${randomFact}"

━━━━━━━━━━━━━━━━━━`;

api.sendMessage(
msg,
event.threadID
);

} catch (e) {

console.log(e);

api.sendMessage(
"❌ Ping lỗi",
event.threadID
);

}

}

};