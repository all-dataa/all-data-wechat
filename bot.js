const { WechatyBuilder, ScanStatus } = require('wechaty'); // 引入 Wechaty
const QRCode = require('qrcode'); // 用于生成二维码
const qrcodeTerminal = require('qrcode-terminal'); // 用于在终端显示二维码
const express = require('express'); // 用于创建 Web 服务
const fs = require('fs');
const path = require('path');

// 配置
const LOGS_DIR = path.join(__dirname, 'logs'); // 日志文件夹路径
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 单个日志文件大小限制（10MB）
const TARGET_GROUP = 'test-alldata'; // 目标群聊名称

// 初始化日志文件夹
if (!fs.existsSync(LOGS_DIR)) {
    fs.mkdirSync(LOGS_DIR);
}

// 获取当前日志文件路径
function getCurrentLogFile() {
    const files = fs.readdirSync(LOGS_DIR).filter(file => file.endsWith('.json')); // 获取所有 JSON 日志文件
    if (files.length === 0) {
        return path.join(LOGS_DIR, 'log_1.json'); // 如果没有日志文件，创建第一个
    }
    const latestFile = files[files.length - 1]; // 获取最新的日志文件
    const filePath = path.join(LOGS_DIR, latestFile);

    // 检查文件大小
    const stats = fs.statSync(filePath);
    if (stats.size >= MAX_FILE_SIZE) {
        const newFileNumber = parseInt(latestFile.match(/\d+/)[0]) + 1; // 递增文件编号
        return path.join(LOGS_DIR, `log_${newFileNumber}.json`); // 创建新文件
    }
    return filePath; // 返回当前文件
}

// 创建 Wechaty 实例
const bot = WechatyBuilder.build();

// 创建 Express 实例
const app = express();
const PORT = 3000;

let qrcodeUrl = ''; // 用于存储二维码的 Data URL

// 监听扫码事件
bot.on('scan', (qrcode, status) => {
    if (status === ScanStatus.Waiting) {
        // 在终端显示二维码
        qrcodeTerminal.generate(qrcode, { small: true });
        console.log(`请扫描二维码登录: https://wechaty.js.org/qrcode/${encodeURIComponent(qrcode)}`);

        // 将二维码保存为图片文件
        QRCode.toFile('qrcode.png', qrcode, { width: 300 }, (err) => {
            if (err) console.error('保存二维码失败:', err);
            else console.log('二维码已保存为 qrcode.png，请下载并扫描');
        });

        // 生成二维码的 Data URL，用于 Web 服务
        QRCode.toDataURL(qrcode, (err, url) => {
            if (err) console.error('生成二维码 Data URL 失败:', err);
            else {
                qrcodeUrl = url;
                console.log(`请访问 http://<服务器IP>:${PORT} 查看二维码`);
            }
        });
    }
});

// 登录事件
bot.on('login', (user) => {
    console.log(`用户 ${user} 登录成功`);
});

// 登出事件
bot.on('logout', (user) => {
    console.log(`用户 ${user} 已登出`);
});

// 监听消息事件
bot.on('message', async (msg) => {
    // 过滤非文本消息
    const filteredTypes = [
        bot.Message.Type.Image, // 图片
        bot.Message.Type.Emoticon, // 表情包
        bot.Message.Type.Url, // 链接（包括公众号链接）
        bot.Message.Type.Audio, // 语音
        bot.Message.Type.Video, // 视频
    ];
    if (filteredTypes.includes(msg.type())) {
        console.log(`过滤掉一条非文本消息，类型为: ${msg.type()}`);
        return;
    }

    // 检查消息是否来自目标群聊
    const room = msg.room();
    if (room && (await room.topic()) === TARGET_GROUP) {
        // 创建日志对象
        const logEntry = {
            timestamp: new Date().toISOString(), // 时间戳
            sender: msg.talker().name(), // 发送者
            message: msg.text(), // 消息内容
            room: TARGET_GROUP, // 群聊名称
        };

        // 获取当前日志文件路径
        const logFile = getCurrentLogFile();

        // 读取现有日志文件内容
        let logs = [];
        if (fs.existsSync(logFile)) {
            logs = JSON.parse(fs.readFileSync(logFile, 'utf-8'));
        }

        // 追加新日志
        logs.push(logEntry);

        // 将日志写入文件
        fs.writeFileSync(logFile, JSON.stringify(logs, null, 2), 'utf-8');
        console.log('消息已保存:', logEntry);
    }
});

// 创建 HTTP 服务
app.get('/', (req, res) => {
    if (qrcodeUrl) {
        res.send(`<img src="${qrcodeUrl}" alt="二维码"/>`);
    } else {
        res.send('等待二维码生成...');
    }
});

app.listen(PORT, () => {
    console.log(`HTTP 服务已启动，访问 http://<服务器IP>:${PORT}`);
});

// 启动机器人
bot.start()
    .then(() => console.log('Wechaty 机器人已启动'))
    .catch((e) => console.error('启动失败:', e));