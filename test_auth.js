/**
 * 最小化测试 - 直接测试 WebSocket 认证流程
 */
const http = require('http');
const crypto = require('crypto');
const WebSocket = require('ws');

const WEB_PORT = 8088;
const WS_PORT = 31300;
const USERNAME = 'administrator';
const PASSWORD = '123456';
const DESIV = Buffer.from('2333115543435321', 'utf8');

function httpLogin() {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify({ code: USERNAME, pwd: PASSWORD });
        const options = {
            hostname: '127.0.0.1', port: WEB_PORT,
            path: '/api/user/login', method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(postData) }
        };
        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try {
                    const data = JSON.parse(body);
                    console.log('Login response:', JSON.stringify(data));
                    resolve(data);
                } catch(e) { reject(e); }
            });
        });
        req.on('error', reject);
        req.write(postData);
        req.end();
    });
}

function testDecrypt(key, token) {
    if (key.length >= 16) key = key.substring(0, 16);
    key = Buffer.from(key, 'utf8');
    const decipher = crypto.createDecipheriv('aes-128-cbc', key, DESIV);
    let txt = decipher.update(token, 'base64', 'utf8');
    txt += decipher.final('utf8');
    return txt;
}

async function main() {
    console.log('1. Logging in...');
    const loginData = await httpLogin();

    const sessionKey = loginData.u;
    const token = loginData.p;

    console.log('\n2. Decrypting token...');
    const decrypted = testDecrypt(sessionKey, token);
    console.log('Decrypted:', decrypted);

    const parts = decrypted.split('%');
    console.log('Parts:', parts);
    console.log('ID:', parts[0], 'Name:', parts[1], 'Pwd:', parts[2], 'Time:', parts[3], 'Level:', parts[4]);

    console.log('\n3. Connecting to game server...');
    const ws = new WebSocket(`ws://127.0.0.1:${WS_PORT}`);

    const authMsg = sessionKey + ' ' + token;
    console.log('Auth msg length:', authMsg.length);
    console.log('Auth msg first 60 chars:', authMsg.substring(0, 60));
    console.log('Auth msg parts count when split:', authMsg.split(' ').length);

    ws.on('open', () => {
        console.log('WebSocket connected, sending auth...');
        ws.send(authMsg);
    });

    ws.on('message', (data) => {
        console.log('RECV:', data.toString().substring(0, 300));
    });

    ws.on('error', (err) => {
        console.error('WS Error:', err.message);
    });

    ws.on('close', (code, reason) => {
        console.log('WS Closed:', code, reason ? reason.toString() : '');
        process.exit(0);
    });

    setTimeout(() => { console.log('Timeout'); process.exit(1); }, 10000);
}

main();
