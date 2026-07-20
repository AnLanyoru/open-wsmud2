import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __CONFIG = (await import('./config.js')).default;
globalThis['__CONFIG'] = __CONFIG;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

globalThis['__PATH'] = {
    BASE: "./core/",
    WORLD: "./res/",
    COMMAND: "./res/cmd/",
    SKILL: "./res/skill/",
    MAP: "./res/map/",
    NPC: "./res/npc/",
    OBJ: "./res/obj/",
    TASK: "./res/task/",
    AREA: "./res/area/",
    FAMILY: "./res/family/",
    EXTENDS: "./res/extends/",
    DATA: "./data/",
    DEF_DATA: "./data/def/"
};

async function readdir(basePath) {
    const files = fs.readdirSync(basePath);
    // 确保依赖文件优先加载：character.js 在 mixins 之前，family.js 在 skill.js 之前
    files.sort((a, b) => {
        if (a === 'character.js') return -1;
        if (b === 'character.js') return 1;
        if (a === 'family.js') return -1;
        if (b === 'family.js') return 1;
        return a.localeCompare(b);
    });
    for (const file of files) {
        const subPath = path.join(basePath, file);
        const stat = fs.statSync(subPath);
        if (stat.isDirectory()) {
            await readdir(subPath + '/');
        } else if (file.endsWith('.js')) {
            await import(pathToFileURL(subPath).href);
        }
    }
}

for (const item in __PATH) {
    __PATH[item] = path.join(__dirname, __PATH[item]);
}

try {
    await readdir(__PATH.BASE);
    const { WORLD } = await import('./core/world.js');
    await __CONFIG.init();
    await WORLD.startup(process.argv[2]);
} catch (e) {
    console.error('========== 启动失败 ==========');
    console.error(e && e.stack ? e.stack : e);
    console.error('==============================');
    process.exit(1);
}

process.on('uncaughtException', (error) => {
    console.error('未捕获的异常:', error && error.stack ? error.stack : error);
});
process.on('unhandledRejection', (reason, promise) => {
    console.error('未处理的Promise拒绝:', reason && reason.stack ? reason.stack : reason);
});

let isShuttingDown = false;
process.on('SIGINT', async () => {
    if (isShuttingDown) return;
    isShuttingDown = true;
    console.log('收到SIGINT信号，正在保存数据...');
    await WORLD.close();
    process.exit(0);
});
process.on('SIGTERM', async () => {
    if (isShuttingDown) return;
    isShuttingDown = true;
    console.log('收到SIGTERM信号，正在保存数据...');
    await WORLD.close();
    process.exit(0);
});
