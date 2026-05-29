/**
 * 热补丁入口 — WORLD 顶层方法
 * ============================================================
 * 此文件由 BASE.PRELOAD 在 os/ 模块全部加载后执行，可安全使用静态 ES import。
 *
 * WORLD.connect() 和 WORLD.loadLocalData() 在此实现，
 * 避免 os/world.js 直接 import user.js 造成循环依赖:
 *   character.js → OBJ → world.js → USER → character.js
 *
 * 热补丁示例:
 *   WORLD.on_startup = function () { /* ... * / };
 *   WORLD.check_connect = function (socket) { return true; };
 */
import { WORLD } from "../../os/world.js";
import { USER } from "../../os/char/user.js";
import db from "../../os/util/data.js";

// 覆盖 os/world.js 中的空壳实现
WORLD.connect = function (socket) {
    if (WORLD.status < 0)
        return socket.end();
    if (!WORLD.check_connect(socket))
        return socket.end();

    socket.user = new USER();

    socket.user.socket = socket;
    socket.user.wait_input = WORLD.USERLOGIN.check_session.bind(WORLD.USERLOGIN);

    socket.setTimeout(60000);
};

WORLD.loadLocalData = function () {
    const data = db.getLocalRoles();
    if (!data || !data.length) return;
    console.log("加载上次未保存的本地用户%d", data.length);
    for (let i = 0; i < data.length; i++) {
        const user = new USER();
        user.loadData(data[i]);
        WORLD.USERS.push(user);
    }
    db.deleteLocalRoles();
};

export default function() {}
