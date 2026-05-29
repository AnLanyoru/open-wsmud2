import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

globalThis['__PATH'] = {
    BASE: "./os/",
    WORLD: "./world/",
    COMMAND: "./world/cmd/",
    SKILL: "./world/skill/",
    MAP: "./world/map/",
    NPC: "./world/npc/",
    OBJ: "./world/obj/",
    TASK: "./world/task/",
    AREA: "./world/area/",
    FAMILY: "./world/family/",
    EXTENDS: "./world/extends/",
    DATA: "./data/",
    DEF_DATA: "./data/def/"
};

require('dotenv').config();

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

globalThis['__CONFIG'] = require('./config.js');

for (const item in __PATH) {
    __PATH[item] = path.join(__dirname, __PATH[item]);
}

await readdir(__PATH.BASE);
await __CONFIG.init();
await WORLD.startup(process.argv[2]);

process.on('uncaughtException', (error) => {
    console.error('未捕获的异常:', error);
});
process.on('unhandledRejection', (reason, promise) => {
    console.error('未处理的Promise拒绝:', reason);
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
