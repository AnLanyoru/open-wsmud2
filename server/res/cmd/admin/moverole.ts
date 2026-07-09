import fs from 'fs';
import { COMMAND } from '../../../core/command.js';
import type { USER } from '../../../core/char/user.js';
import { WORLD } from '../../../core/world.js';

export default class extends COMMAND {
    command = 'moverole';
    allow_busy = true;
    allow_state = true;
    allow_die = true;
    allow_level = 6;
    regex = /^(\S+)\s(\S+)\s(\S+)$/;

    /**
     * 在账号间转移角色，前提是角色不在线
     * 用法: moverole <源账号名> <角色名> <目标账号名>
     */
    enter(me: USER, fromAccount: string, roleName: string, toAccount: string) {
        if (fromAccount === toAccount) {
            return me.notify('源账号和目标账号相同，无需转移。');
        }

        this.doTransfer(me, fromAccount, roleName, toAccount);
    }

    async doTransfer(me: USER, fromAccount: string, roleName: string, toAccount: string) {
        try {
            // 1. 查找源账号
            const fromUser = await __CONFIG.DB.getUserBy('name', fromAccount);
            if (!fromUser) {
                return me.notify('源账号(' + fromAccount + ')不存在。');
            }
            const fromUid: number = fromUser.id;

            // 2. 查找目标账号
            const toUser = await __CONFIG.DB.getUserBy('name', toAccount);
            if (!toUser) {
                return me.notify('目标账号(' + toAccount + ')不存在。');
            }
            const toUid: number = toUser.id;

            if (fromUid === toUid) {
                return me.notify('源账号和目标账号相同，无需转移。');
            }

            // 3. 查找源账号下的角色列表
            const roles = await WORLD.DB.getRoles(fromUid, WORLD.SERVERID);
            if (!roles || !roles.length) {
                return me.notify('源账号(' + fromAccount + ')下没有角色。');
            }

            // 4. 按名称匹配角色
            const role = roles.find(r => r.name === roleName);
            if (!role) {
                return me.notify('源账号(' + fromAccount + ')下找不到角色: ' + roleName);
            }

            // 5. 检查角色是否在线
            if (WORLD.getUser(role.id)) {
                return me.notify('角色(' + roleName + ')当前在线，请先下线后再转移。');
            }

            // 6. 转移前备份角色完整数据
            const roleData = await WORLD.DB.getRoleData(fromUid, role.id);
            if (roleData) {
                try {
                    const bakDir = __PATH.DATA + 'bak/';
                    const bakPath = bakDir + 'moverole_' + role.id + '_' + Date.now() + '.js';
                    await fs.promises.writeFile(bakPath, JSON.stringify(roleData));
                    WORLD.log(
                        me,
                        'moverole',
                        '备份角色 ' + roleName + '(' + role.id + ') 到 ' + bakPath,
                    );
                } catch (e: any) {
                    console.error('moverole backup error:', e);
                    return me.notify('备份角色数据失败，转移取消: ' + (e.message || e));
                }
            }

            // 7. 执行转移
            await WORLD.DB.change_userid(role.id, fromUid, toUid);
            me.notify(
                '角色(' +
                    roleName +
                    ')已成功从账号' +
                    fromAccount +
                    '(' +
                    fromUid +
                    ')转移到账号' +
                    toAccount +
                    '(' +
                    toUid +
                    ')。',
            );
            WORLD.log(
                me,
                'moverole',
                '转移角色 ' +
                    roleName +
                    '(' +
                    role.id +
                    ') 从 ' +
                    fromAccount +
                    '(' +
                    fromUid +
                    ') 到 ' +
                    toAccount +
                    '(' +
                    toUid +
                    ')',
            );
        } catch (e: any) {
            me.notify('转移失败: ' + (e.message || e));
            console.error('moverole error:', e);
        }
    }
}
