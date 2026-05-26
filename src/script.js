
import Util from './utils/util.js';
import { Confirm } from './confirm.js';

const MAP_DIR_EXITS = {
    left: ["west", "westup", "westdown"],
    right: ["east", "eastup", "eastdown"],
    up: ["north", "northup", "northdown", 'up'],
    down: ["south", "southup", "southdown", 'down'],
    leftup: ["northwest"],
    leftdown: ["southwest"],
    rightup: ['northeast'],
    rightdown: ['southeast']
};

const SCRIPT = {
    is_running: false,
    run: async function (str) {
        this.is_running = true;
        try {
            let cmds = str.split(';');
            for (let cmd of cmds) {
                await this.run_one(cmd);
            }
        } catch (error) {
            console.log('扩展执行失败：', error);
        }
        this.is_running = false;

    },
    var_reg: /^@(\w+)(?:\(([^)]*)\))?$/,
    run_one: async function (cmd) {
        let paras = cmd.split(' ');
        let action_name = paras[0];
        let action = this.actions.def;
        if (action_name[0] === '#') {
            action_name = action_name.substring(1);
            action = this.actions[action_name] ?? this.actions.def;
        }
        let results = [[]], para = null;

        for (let i = 1; i < paras.length; i++) {
            if (!results.length) break;
            para = paras[i];
            if (para[0] === '@') {
                await this.push_paras(results, para);
            } else {
                results.map(x => x.push(para));
            }
        }
        for (let result of results) {
            await action(result, action_name);
        }

    },
    push_paras: async function (results, para) {
        const match = para.match(this.var_reg);
        if (!match) throw new Error("<cyn>错误的参数格式" + para + "</cyn>");
        const method = match[1];
        const params = match[2] ? match[2].split(',').map(param => param.trim()) : [];
        let value = this.vars[method];
        if (!value) throw new Error("<cyn>无效参数" + para + "</cyn>");
        let vals = await value(...params);
        if (!vals) return results.length = 0;
        if (!Array.isArray(vals)) return results.map(x => x.push(vals));
        if (!vals.length) return results.length = 0;
        let index = results.length;
        for (let i = 1; i < vals.length; i++) {
            for (let j = 0; j < index; j++) {
                results.push([...results[j], vals[i]]);
            }
        }
        for (let j = 0; j < index; j++) {
            results[j].push(vals[0])
        }
    },

    actions: {

        def: function (paras, cmd) {
            if (paras.length)
                SendCommand(cmd + " " + paras.join(" "));
            else
                SendCommand(cmd);
        },
        wait: function (paras) {
            return Util.Sleep(parseInt(paras[0]));
        },
        action: async function (paras) {
            let index = parseInt(paras[0]);
            if (!(index >= 0 && index < 10)) return;
            let cmd = $('.room-commands').children().eq(index).attr('cmd');
            if (cmd) SCRIPT.run(cmd);
        },
        pfm: function (paras) {
            let index = parseInt(paras[0]);
            if (!(index >= 0 && index < 10)) return SendCommand('perform ' + paras[0]);
            let cmd = $('.combat-commands').children().eq(index).attr('pid');
            if (cmd) SCRIPT.run("perform " + cmd);
        }, menu: function (paras) {
            let cmd = paras[0];
            if (cmd) HandlerMenuCommand(cmd);
        }, msg: function (paras) {
            paras.length > 0 && ReceiveMessage(paras.join(""));
        }
    },
    vars: {
        me: function () {
            return Process.player;
        },
        dir: function (t) {
            let dirs = MAP_DIR_EXITS[t];
            if (!dirs) return;
            for (let item of dirs) {
                if (Process.room_exits[item])
                    return item;
            }
        }, npc: function (...paras) {
            let room = Process.cur_room;
            let result = [];
            for (let item of room.items) {
                if (!item) continue;
                if (item.hp > 0 && !item.p) {
                    if (!paras || !paras.length) {
                        result.push(item.id);
                    } else
                        for (let par of paras) {
                            if (item.name.indexOf(par) > -1) {
                                result.push(item.id);
                                break;
                            }
                        }
                }
            }
            return result;
        },
        item: function (...paras) {
            let room = Process.cur_room;
            let result = [];
            for (let item of room.items) {
                if (!item) continue;
                if (!paras || !paras.length) {
                    result.push(item.id);
                } else
                    for (let par of paras) {
                        if (item.name.indexOf(par) > -1) {
                            result.push(item.id);
                            break;
                        }
                    }
            }
            return result;
        }, id: function () {
            let obj = SCRIPT.LAST_OBJ;
            if (obj) return obj.id;
            return "";
        },
        obj: function (par) {
            let obj = SCRIPT.LAST_OBJ;
            if (!par || !obj) return;
            return obj[par];
        },
        pack: function (...paras) {
            let items = Dialog.pack.isShow ? Dialog.pack.items : Dialog.pack2.items;
            if (!items) return;
            let result = [];
            for (let item of items) {
                for (let par of paras) {
                    if (item.name.indexOf(par) > -1) {
                        result.push(item.id);
                        break;
                    }
                }
            }
            return result;
        },
        goods: function (...paras) {
            let items = Dialog.list.selllist;
            if (!items) return;
            let result = [];
            for (let item of items) {
                for (let par of paras) {
                    if (item.name.indexOf(par) > -1) {
                        result.push(item.id);
                        break;
                    }
                }
            }
            return result;
        },
        input: function () {
            const par = { btn_text: "确定", min: 0, max: 0 };
            for (let i = 0; i < arguments.length; i++) {
                let val = arguments[i];
                if (typeof val === 'string') par.btn_text = val;
                else par.max > 0 ? (par.min = val) : (par.max = val);
            }
            par.content = Confirm.get_countelement(par.min || 1,
                par.max || 9999);
            return new Promise((resolve, reject) => {
                par.onOK = resolve;
                par.onCancle = reject;
                Confirm.Show(par);

            });
        }, mat: function (val) {
            let last = SCRIPT.lAST_MATCHES;
            if (!last) return;
            return last[val];
        }, data: function (prop) {
            if (!prop || !SCRIPT.LAST_DATA)
                return;
            return SCRIPT.LAST_DATA[prop];
        }, master: function () {
            return Dialog.master.master;
        }, dc: function () {
            if (Dialog.master.isShow) return "dc " + Dialog.master.master;
            return Dialog.pack2.command_before;
        }
    },
    helper: {
        actions: [
            "#wait 100：等待100毫秒执行",
            "#msg 你好：输出提示消息",
            "#menu score，打开对话框",
            "#action (0-9)，执行动作栏对应位置的操作",
            "#pfm (0-9)，释放对应位置的绝招",
            "持续增加"
        ],
        vars: [
            "@dir(left)：获取当前房间左边方向的出口命令",
            "@npc(小二)：获取当前房间的npc ID，无参数返回所有npc",
            "@item：获取当前房间所有物品ID，参数匹配名称",
            "@id：当前正在操作的道具，技能，NPC等的ID",
            "持续增加"
        ],
        paras: [
            "参数用来判断所在位置的数据属性，比如地图的参数，有name,type,index",
            "name(扬州)：名称里包含扬州二字的地图",
            "index(>3)：索引大于3的地图"
        ]
    },

};
export default SCRIPT;
export { MAP_DIR_EXITS };
