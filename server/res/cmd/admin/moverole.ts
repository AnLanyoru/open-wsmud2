import fs from 'fs';
import {COMMAND} from "../../../core/command.js";
import type { USER } from "../../../core/char/user.js";
import {WORLD} from "../../../core/world.js";

export default class extends COMMAND {
    command = "moverole";
    allow_busy = true;
    allow_state = true;
    allow_die = true;
    allow_level = 6;
    regex = /^(\d+)\s(\S+)\s(\d+)$/;

    /**
     * 在账号间转移角色，前提是角色不在线
     * 用法: moverole <源账号ID> <角色名> <目标账号ID>
     */
    enter(me: USER, fromAccountId: string, roleName: string, toAccountId: string) {
        const fromUid = parseInt(fromAccountId);
        const toUid = parseInt(toAccountId);

        if (fromUid === toUid) {
            return me.notify("源账号和目标账号相同，无需转移。");
        }

        this.doTransfer(me, fromUid, roleName, toUid);
    }

    async doTransfer(me: USER, fromUid: number, roleName: string, toUid: number) {
        try {
            // 1. 查找源账号下的角色列表
            const roles = await WORLD.DB.getRoles(fromUid, WORLD.SERVERID);
            if (!roles || !roles.length) {
                return me.notify("源账号(" + fromUid + ")下没有角色。");
            }

            // 2. 按名称匹配角色
            const role = roles.find((r) => r.name === roleName);
            if (!role) {
                return me.notify("源账号(" + fromUid + ")下找不到角色: " + roleName);
            }

            // 3. 检查角色是否在线
            if (WORLD.getUser(role.id)) {
                return me.notify("角色(" + roleName + ")当前在线，请先下线后再转移。");
            }

            // 4. 验证目标账号是否存在
            const targetUser = await WORLD.DB.getUserByID(toUid);
            if (!targetUser) {
                return me.notify("目标账号(" + toUid + ")不存在。");
            }

            // 5. 转移前备份角色完整数据
            const roleData = await WORLD.DB.getRoleData(fromUid, role.id);
            if (roleData) {
                try {
                    const bakDir = __PATH.DATA + 'bak/';
                    const bakPath = bakDir + 'moverole_' + role.id + '_' + Date.now() + '.js';
                    await fs.promises.writeFile(bakPath, JSON.stringify(roleData));
                    WORLD.log(me, "moverole", "备份角色 " + roleName + "(" + role.id + ") 到 " + bakPath);
                } catch (e: any) {
                    console.error("moverole backup error:", e);
                    return me.notify("备份角色数据失败，转移取消: " + (e.message || e));
                }
            }

            // 6. 执行转移
            await WORLD.DB.change_userid(role.id, fromUid, toUid);
            me.notify("角色(" + roleName + ")已成功从账号" + fromUid + "转移到账号" + toUid + "。");
            WORLD.log(me, "moverole", "转移角色 " + roleName + "(" + role.id + ") 从 " + fromUid + " 到 " + toUid);
        } catch (e: any) {
            me.notify("转移失败: " + (e.message || e));
            console.error("moverole error:", e);
        }
    }
}
