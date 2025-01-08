
# All Data WeChat
- [2025-01-08] 由网友指出，wechaty 走的协议容易被微信警告，网络协议的方式仍然走不通，感兴趣的可以考虑用模拟 IPAD 登陆的方式 或者 通过 COW (chatgpt-on-wechat:https://github.com/zhayujie/chatgpt-on-wechat)
- [2025-01-08] 感兴趣深入研究的，可以通过 wechaty 社区找到Juzi BOT，puppet_padplus 提供 token 避免被警告封号

![Node.js](https://img.shields.io/badge/Node.js-v16+-green)
![Wechaty](https://img.shields.io/badge/Wechaty-v1.0+-blue)
![License](https://img.shields.io/badge/License-MIT-orange)

**All Data WeChat** 是一个基于 [Wechaty](https://wechaty.js.org/) 的微信机器人项目，用于实时监控指定微信群聊的聊天记录，并将消息保存为结构化 JSON 文件。支持过滤非文本消息（如图片、表情包、链接等），并按文件大小分割日志。

---

## 功能特性

- **实时监控群聊**：监控指定微信群聊的聊天记录。
- **过滤非文本消息**：自动过滤图片、表情包、公众号链接、语音、视频等非文本消息。
- **结构化日志**：将聊天记录保存为 JSON 格式，包含时间戳、发送者、消息内容等字段。
- **日志分割**：当日志文件达到指定大小（默认 10MB）时，自动创建新文件。
- **二维码登录**：支持终端显示二维码、保存二维码图片、通过 Web 服务访问二维码。

---

## 快速开始

### 环境要求

- Node.js 16 或更高版本
- npm 或 yarn

### 安装依赖

1. 克隆项目：
   ```bash
   git clone https://github.com/bbbfishhh/all-data-wechat.git
   cd all-data-wechat
   ```

2. 安装依赖：
   ```bash
   npm install
   ```

### 配置

1. 修改 `bot.js` 中的配置：
   - `TARGET_GROUP`：目标群聊名称。
   - `MAX_FILE_SIZE`：单个日志文件大小限制（默认 10MB）。

2. 运行项目：
   ```bash
   node bot.js
   ```

3. 根据提示操作：
   - 在终端扫描二维码。
   - 或者访问 `http://<服务器IP>:3000` 查看二维码。
   - 或者下载 `qrcode.png` 文件扫描。

---

## 日志格式

日志文件保存在 `logs` 文件夹中，文件名为 `log_1.json`、`log_2.json`，依次递增。每条日志格式如下：

```json
{
  "timestamp": "2023-10-01T12:34:56.789Z",
  "sender": "用户A",
  "message": "你好，这是一个测试消息。",
  "room": "测试群聊"
}
```

---

## 过滤消息类型

以下类型的消息会被自动过滤：
- 图片（`Message.Type.Image`）
- 表情包（`Message.Type.Emoticon`）
- 链接（`Message.Type.Url`，包括公众号链接）
- 语音（`Message.Type.Audio`）
- 视频（`Message.Type.Video`）

---

## 项目结构

```
all-data-wechat/
├── logs/                  # 日志文件夹
├── node_modules/          # 依赖文件夹
├── bot.js                 # 主程序
├── qrcode.png             # 二维码图片
├── package.json           # 项目配置文件
├── package-lock.json      # 依赖锁文件
└── README.md              # 项目说明文件
```

---

## 扩展与维护

### 添加新功能

1. **扩展日志字段**：
   - 修改 `logEntry` 对象，添加新的字段。

2. **支持更多消息类型**：
   - 修改 `filteredTypes` 数组，添加或删除需要过滤的消息类型。

3. **按时间分割日志**：
   - 修改 `getCurrentLogFile` 函数，支持按日期创建日志文件。

### 部署到服务器

1. 使用 `pm2` 管理进程：
   ```bash
   npm install -g pm2
   pm2 start bot.js --name "all-data-wechat"
   ```

2. 配置防火墙：
   - 开放 `3000` 端口，允许外部访问二维码 Web 服务。

---

## 许可证

本项目基于 [MIT 许可证](LICENSE) 开源。

---

## 致谢

- [Wechaty](https://wechaty.js.org/)：微信机器人框架。
- [qrcode-terminal](https://github.com/gtanner/qrcode-terminal)：终端二维码生成工具。
- [express](https://expressjs.com/)：Web 服务框架。

---

## 反馈与贡献

如有任何问题或建议，请提交 [Issue](https://github.com/bbbfishhh/all-data-wechat/issues) 或 [Pull Request](https://github.com/bbbfishhh/all-data-wechat/pulls)。

---

## 作者

- **bbbfishhh**
- Email: yuconnects@163.com
- GitHub: [bbbfishhh](https://github.com/bbbfishhh)
