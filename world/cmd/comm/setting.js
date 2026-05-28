this.inherits(COMMAND);
this.command = "setting";
this.allow_busy = true;
this.allow_state = true;
this.allow_die = true;
this.regex = /^(?:(\w+)?\s+(.+))?$/;
this.enter = function (me, key, value) {
    if (!me.is_player) return;
    if (!key) {
        var str = ['{type:"setting",items:{'];

        if (me.setting) {
            str.push(JSON.stringify(me.setting));
        }
        str.push("}}");
        me.notify(str.join(""));
    } else {
        if (key === 'psxk' || key === 'fullscreen') return;

        let setting_item = setting_keys[key];
        if (!setting_item) return me.notify("无效设定项。");



        if (setting_item.type === 'String') {
            if (value && setting_item.length && value.length > setting_item.length) {
                return me.notify("设定值太长。");
            }
            if (value === 'none') value = "";
            else if (setting_item.def && setting_item.def === value)
                value = "";

        } else if (setting_item.type === 'Boolean') {
            value = value || 0;
            value = parseInt(value);
            if (value !== 0 && value !== 1) return me.notify("无效设定值。");

        }
        if (setting_item.on_setting) {
            if (setting_item.on_setting(me, value) === false) return;
        }



        if (key == "no_message") {
            me.no_message = (value == 1) ? true : false;
        }
        me.set_setting(key, value);

        if (setting_item.desc) {
            if (setting_item.type === 'String') {
                if (value && value !== '0') {
                    me.notify("<hic>已设置" + setting_item.desc + "</hic>");
                } else {
                    me.notify("<cyn>已取消" + setting_item.desc + "</cyn>");
                }
            } else if (setting_item.type === 'Boolean') {
                if (value) {
                    me.notify("<hic>已开启" + setting_item.desc + "</hic>");
                } else {
                    me.notify("<cyn>已关闭" + setting_item.desc + "</cyn>");
                }

            }

        }


        //var parent = me.environment;
        //if (!parent) return;
        //switch (key) {
        //    case "exits_map":
        //        parent.send_exits(me);
        //        break;
        //}
    }
}
this.clear = function (me) {
    let str = [];
    for (let user of WORLD.USERS) {
        if (!user.settings) continue;
        for (let key in user.settings) {
            if (!setting_keys[key]) {
                str.push(user.name, key, '\n');
                delete user.settings[key];
            }
        }
    }
    if (me) me.send(str.join(''));
}
const setting_keys = {
    'hide_roomdesc': {
        type: "Boolean",
        desc: "隐藏房间描述"
    }, 'exits_dir': {
        type: "Boolean",
        desc: "出口描述使用方向描述"
    },
    'show_command': {
        type: "Boolean",
        desc: "列出NPC或道具的可用命令"

    },
    'show_roomitem': {
        type: "Boolean",
        desc: "在命令栏列出房间内的可用物品"

    }, 'item_firstme': {
        type: "Boolean",
        desc: "列出NPC自己始终显示在房间物品第一列"

    },
    'keep_msg': {
        type: "Boolean", 
        desc: "切换房间时不清空上房间信息"

    }, 'off_move': {
        type: "Boolean",
        desc: "不显示玩家进出房间描述"
    },
    'off_plist': {
        type: "Boolean",
        desc: "隐藏玩家列表"

    }, 'no_spmsg': {
        type: "Boolean",
        desc: "聊天信息不分开显示"

    },
    'auto_sortitem': {
        type: "Boolean",
        desc: "按品质自动排列背包和技能"

    }, 'no_message': {
        type: "Boolean",
        desc: " 不显示其他玩家或NPC的房间消息"

    },
    'auto_showcombat': {
        type: "Boolean",
        desc: "战斗时自动打开战斗面板"

    }, 'auto_hideroom': {
        type: "Boolean",
        desc: "战斗时自动隐藏房间信息"

    },
    'no_combatmsg': {
        type: "Boolean",
        desc: "不显示其他玩家的战斗信息"

    }, 'no_mcmsg': {
        type: "Boolean",
        desc: "不显示自己的普通战斗信息"

    },
    'combat_wrap': {
        type: "Boolean",
        desc: "技能栏允许换行"

    },
    'action_wrap': {
        type: "Boolean",
        desc: "动作栏允许换行"

    },

    'show_hpnum': {
        type: "Boolean",
        desc: "显示血量为数字"

    },
    'off_hp': {
        type: "Boolean",
        desc: "关闭血条显示"

    }, 'show_damage': {
        type: "Boolean",
        desc: "显示伤害统计"

    }, 'show_sa': {
        type: "Boolean",
        desc: "显示快捷动作"

    },
    'font': {
        type: "String",
        length: 10,
        desc: "字体"
    },
    'combat_size': {
        type: "String",
        length: 10,
        desc: "操作栏大小",
        def: "1em"
    },
    'dialog_size': {
        type: "String",
        length: 10,
        desc: "窗口大小",
        def: "1em"
    },
    'menu_size': {
        type: "String",
        length: 10,
        desc: "菜单栏大小",
        def: "1em"
    },
    'fontsize': {
        type: "String",
        length: 10,
        desc: "字体大小",
        def: "0.875rem"

    }, 'fontcolor': {
        type: "String",
        length: 20,
        desc: "正常字体颜色",
        def: "#008000"

    }, 'backcolor': {
        type: "String",
        length: 20,
        desc: "背景颜色"

    }, 'hide_equip': {
        type: "Boolean",
        desc: "隐藏自己的装备"
    }, 
    'show_send': {
        type: "Boolean",
        desc: "显示发送的指令"
    },
    'off_fight': {
        type: "Boolean",
        desc: "不接受比试"

    }, 'ban_pk': {
        type: "Boolean",
        desc: "",
        on_setting: function (me, value) {
            if (value == 1) {
                if (me.query_setting("ban_pk")) return false;
                //  if (me.level >= 3) return me.notify("你已经是宗师，不再需要保护了。");
                if (me.query_temp("pk")) {
                    return me.notify_fail("<hir>你最近7天内关闭过PK保护或击杀过其他玩家，需要一段时间后才可以再次打开保护。</hir>");
                }
                me.notify("你已开启PK保护，不可主动击杀玩家，不可被玩家主动击杀。");
                me.set_temp("pk", 1, 24 * 3600000 * 7);

            } else {
                if (!me.query_setting("ban_pk")) return false;
                me.notify("你已关闭PK保护。");
            }
        }

    }, 'no_master': {
        type: "Boolean",
        desc: "不接受玩家拜师"

    }, 'no_team': {
        type: "Boolean",
        desc: "不接受玩家组队邀请"

    },
    'off_chat': {
        type: "Boolean",
        desc: "屏蔽公共频道"

    }, 'off_fam': {
        type: "Boolean",
        desc: "屏蔽门派频道"

    },
    'off_es': {
        type: "Boolean",
        desc: "屏蔽全区频道"

    }, 'off_pty': {
        type: "Boolean",
        desc: "屏蔽帮派频道"

    },
    'auto_get': {
        type: "Boolean",
        desc: "击杀NPC后自动拾取战利品"

    }, 'auto_pfm': {
        type: "String",
        length: 300,
        desc: "击杀玩家或NPC时自动出招"

    },
    'show_cus': {
        type: "Boolean",
        desc: "允许其他玩家查看自己的自创武功"

    },
    'auto_pfm2': {
        type: "String",
        length: 300,
        desc: "被玩家击杀时自动反击"

    }, 'auto_work': {
        type: "String",
        length: 400,
        desc: "",
        on_setting: function (me, value) {

            if (!value || value === '0')
                return me.notify('<cyn>已关闭学习，练习，打坐中断后的自动操作</hic>');
            if (value === '1') {
                return me.notify('<hic>已设置学习，练习，打坐中断后，自动去挖矿</hic>');
            }
            return me.notify('<hic>已设置学习，练习，打坐中断后的自动操作</hic>');
        }

    }
};