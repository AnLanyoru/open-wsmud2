import Util from './utils/util.js';
import {Confirm} from './confirm.js';

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
            const par = {btn_text: "确定", min: 0, max: 0};
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
            "#wait 100：等待100毫秒后继续执行",
            "#msg 你好：在消息区输出提示文本",
            "#menu score：打开指定对话框（如 score、pack）",
            "#action 0：执行动作栏第1个按钮（编号范围0-9）",
            "#pfm 0：释放绝招栏第1个绝招（编号范围0-9）",
            "普通命令可直接填写，例如：look、go north；多条命令用分号分隔"
        ],
        vars: [
            "@me：当前角色ID",
            "@dir(left)：获取指定方向的出口命令（left/right/up/down 等）",
            "@npc(小二)：获取名称包含“小二”的NPC ID；不填名称时返回全部NPC",
            "@item(尸体)：获取名称包含“尸体”的房间物体ID；不填名称时返回全部物体",
            "@pack(药)：获取背包中名称包含“药”的物品ID",
            "@goods(铁)：获取出售列表中名称包含“铁”的物品ID",
            "@id：当前正在处理的道具、技能或NPC ID",
            "@obj(name)：读取当前对象属性，例如 @obj(name)",
            "@input(输入数量,10,1)：弹窗获取输入值（按钮文字、最大值、最小值）",
            "@mat(1)：获取最近一次文本正则匹配的第1个捕获组",
            "@data(hp)：读取最近一次事件数据的 hp 属性",
            "@master：当前师父/随从对象；@dc：生成断开连接命令"
        ],
        paras: [
            "条件用于匹配地图、技能、物品等对象属性；格式为 属性(值)，多个条件需同时满足",
            "name(扬州)：匹配名称中包含“扬州”的对象",
            "index(>3)：匹配索引大于3的对象",
            "level(>=100)、type(=weapon)、name(!=木剑)：支持 >=、<=、>、<、=、!=",
            "文本类条件填写正则表达式，例如：^你获得了(.+)$；可用 @mat(1) 读取捕获内容",
            "命令中的变量使用 @变量 或 @变量(参数)，例如 get @npc(小二)"
        ]
    },

};
export default SCRIPT;
export {MAP_DIR_EXITS};
