import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import path from 'path';
import session from 'express-session';
import pinoHttp from 'pino-http';
import http from 'http';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __CONFIG = (await import('./config.js')).default;
globalThis['__CONFIG'] = __CONFIG;

const UserAPI = (await import('./api/user.js')).default;
const GameAPI = (await import('./api/game.js')).default;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const HOST = __CONFIG.WEB_HOST;
const PORT = __CONFIG.WEB_PORT;
const APIS = {
    user: UserAPI,
    game: GameAPI,
};
const API_METHODS = {
    user: new Set(['login', 'regist', 'validimage', 'getphone', 'bindphone', 'resetpwd', 'changepassword']),
    game: new Set(['servers', 'reload', 'add_server', 'save_server', 'delete_server', 'search_role']),
};
const GET_API_METHODS = new Set(['validimage', 'getphone', 'servers']);


app.use(express.static(path.join(__dirname, 'www'), {fallthrough: true}));

app.disable('x-powered-by');
app.use(cookieParser());
app.use(bodyParser.json());
app.use(session({
    secret: __CONFIG.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        httpOnly: false,
        maxAge: 1000 * 60 * 30,
        sameSite: 'lax',
        path: '/',
    }
}));

app.use(bodyParser.urlencoded({extended: true}));

app.use(pinoHttp({
    level: 'info',
    transport: {
        target: 'pino-roll', // 直接使用 pino-roll 作为传输目标
        options: {
            file: './log/access.log',
            frequency: 'daily',
            mkdir: true,
            history: '7d',
        },
    },
}));

app.all('/api/:className/:methodName', async (req, res) => {
    const {className, methodName} = req.params;
    try {
        const ClassModule = APIS[className];
        if (!ClassModule || !API_METHODS[className]?.has(methodName))
            return res.status(404).json({error: 'Method not found'});
        const expectedMethod = GET_API_METHODS.has(methodName) ? 'GET' : 'POST';
        if (req.method !== expectedMethod)
            return res.status(405).set('Allow', expectedMethod).json({error: 'Method not allowed'});
        const instance = new ClassModule(req, res);
        if (typeof instance[methodName] !== 'function') {
            return res.status(404).json({error: 'Method not found'});
        }
        const params = {...req.query, ...req.body};

        const result = await instance[methodName](params);

        res.json(result);
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({error: 'Internal server error'});
    }
});
const server = http.createServer(app);


// 启动服务器
await __CONFIG.init();
server.listen(PORT, HOST, () => {
    console.log(`Server running on http://${HOST}:${PORT}`);
    console.log(`Static files served from ${path.join(__dirname, 'www')}`);
});

process.on('uncaughtException', (error) => {
    console.error('未捕获的异常:', error);

});
process.on('unhandledRejection', (reason, promise) => {
    console.error('未处理的Promise拒绝:', reason);
});
