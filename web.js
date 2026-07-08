import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import path from 'path';
import session from 'express-session';
import pinoHttp from 'pino-http';
import http from 'http';
import { fileURLToPath, pathToFileURL } from 'url';
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
const API_PATHS = ['./api/user.js', './api/game.js'];
const APIS = {
    user: UserAPI,
    game: GameAPI,
};


app.use(express.static(path.join(__dirname, 'www'), {fallthrough: true}));

// templates-data.json 不在 www/（避免被 vite build 清空），从项目根目录 serve
app.get('/templates-data.json', (_req, res) => {
    res.sendFile(path.join(__dirname, 'templates-data.json'), {fallthrough: true}, (err) => {
        if (err) res.status(404).end();
    });
});


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
        // sameSite: 'none'
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
        if (!ClassModule)
            return res.status(404).json({error: 'Method not found'});
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
app.all('/sse/:className/:methodName', async (req, res) => {
    const {className, methodName} = req.params;
    try {
        const ClassModule = APIS[className];
        if (!ClassModule)
            return res.status(404).json({error: 'Method not found'});
        const instance = new ClassModule(req, res);
        if (typeof instance[methodName] !== 'function') {
            return res.status(404).json({error: 'Method not found'});
        }
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.flushHeaders();
        const handler = await instance[methodName]({...req.query, ...req.body});
        if (!res.writableEnded) {
            if (handler && handler.end) {
                const closeHandler = () => {
                    handler.end();
                };
                res.on('close', closeHandler);
            } else {
                res.end();
            }
        }
    } catch (error) {
        console.error('API Error:', error);
        if (!res.headersSent) {
            res.status(500).json({error: 'Internal server error'});
        }
    }
});


async function reload_api(req, res) {
    try {
        for (let modulePath of API_PATHS) {
            const resolvedPath = path.resolve(modulePath);
            const url = pathToFileURL(resolvedPath).href;
            const mod = await import(`${url}?update=${Date.now()}`);
            APIS[modulePath.replace('./api/', "").replace('.js', "")] = mod.default;
        }
        res.json({msg: 'api reload'});
    } catch (error) {
        console.log(error);
        res.status(500).json({error: 'Internal server error'});
    }
}

app.use("/reload", reload_api);

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
