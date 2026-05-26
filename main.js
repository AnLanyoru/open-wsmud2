"use strict";

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


const fs = require("fs");
function readdir(path) {
    var files = fs.readdirSync(path);
    for (var i = 0; i < files.length; i++) {
        var sub_path = path + files[i];
        var stat = fs.statSync(sub_path);
        if (stat.isDirectory()) {
            readdir(sub_path + "/");
        } else {
            require(sub_path);
        }
    }
}

globalThis['__CONFIG'] = require('./config');
async function require_os() {

    const path = require('path');
    for (var item in __PATH) {
        __PATH[item] = path.join(__dirname, __PATH[item]);
    }
    readdir(__PATH.BASE);
    await __CONFIG.init();
}
require_os().then(() => {
    WORLD.startup(process.argv[2]);
});


process.on('uncaughtException', (error) => {
    console.error('未捕获的异常:', error);

});
process.on('unhandledRejection', (reason, promise) => {
    console.error('未处理的Promise拒绝:', reason);
});
