import { COMMAND } from "../../../core/command.js";
import { CHARACTER } from "../../../core/char/character.js";
import { WORLD } from "../../../core/world.js";
import { UTIL } from "../../../core/util/util.js";
import { NPC } from "../../../core/char/npc.js";

export default class extends COMMAND {
    command = "score";
    allow_busy = true;
    allow_state = true;
    allow_die = true;
    props = ["hp", "mp", "max_hp", "max_mp", "str", "con",
    "dex", "int", "kar", "gj", "fy", "mz", "zj", "exp", "pot"];

    /**
     * @param {CHARACTER} me - 执行命令的角色
     */
    enter(me, arg) {
    var target = me;
    if (arg) {
        if (arg === "title") {
            let str = ['{"type":"dialog","dialog":"score"'];
            str.push(',titles:[');
            if (me.titles) {
                for (var i = 0; i < me.titles.length; i++) {
                    var item = me.titles[i];
                    if (i > 0) str.push(",");
                    str.push("{title:\"");
                    str.push(item.title);
                    str.push("\"");
                    if (item.use) {
                        str.push(",use:true");
                    }

                    str.push("}");

                }
            }
            str.push("]}");
            return me.send(str.join(""));
        }
        target = me.find_obj(arg, me.environment);
        if (!target && me.user_level > 1) {
            target = WORLD.getUser(arg);
        }
        if (!target) {
            return me.notify("你要查看谁的属性。");
        }
        if (target.master != me.id && me.user_level < 4) {
            return me.notify("你要查看谁的属性。");
        }
    }
    let str = ['{"type":"dialog","dialog":"score"'];
    str.push(',id:"');
    str.push(target.id);
    str.push('","name":"');
    str.push(target.long_name());
    str.push('","id":"');
    str.push(target.id);
    str.push('","age":"');
    var age = target.query_age();
    if (age < 10) age = 10;

    var int_age = parseInt(age);
    str.push(UTIL.to_c(int_age));
    str.push('岁');

    let month = parseInt((age - int_age) * 12);
    if (month) {
        str.push(UTIL.to_c(month));
        str.push('个月');
    }
    str.push('","family":"');
    str.push(target.family.name);
    str.push('",master:\"');
    str.push(target.master ? target.master : "无");
    str.push('",gender:\"');
    str.push(target.gender == 1 ? "男" : "女");
    str.push('",level:\"');
    str.push(this.get_level_desc(target));
    str.push('"');
    target.pot = parseInt(target.pot);
    target.hp = parseInt(target.hp);
    target.mp = parseInt(target.mp);

    for (var i = 0; i < this.props.length; i++) {
        str.push(',"');
        str.push(this.props[i]);
        str.push('":');
        str.push(target[this.props[i]] || 0);
    }
    //if (target.dodge_skill.on_score) {

    //    str.push(',ds:', target.dodge_skill.on_score(target));

    //} else {
    //}

    str.push(',ds:', target.ds);
    str.push(',per:');
    str.push(target.query_prop("per") + target.per);
    str.push(',str_add:');
    str.push(target.query_prop("str"));
    str.push(',con_add:');
    str.push(target.query_prop("con"));
    str.push(',dex_add:');
    str.push(target.query_prop("dex"));
    str.push(',int_add:');
    str.push(target.query_prop("int"));
    var limit_mp = target.limit_mp + target.query_prop("limit_mp");
    str.push(',limit_mp:');
    str.push(limit_mp);
    if (target.query_jingli) {

        str.push(',jingli:"', String(target.query_temp('ad_jl', 0) ?? 0), '/', String(target.query_jclimit?.() ?? 0), "<hig>(+", String(200 - (target.query_temp('ex_jl', 0) ?? 0)), ')</hig>"');
    } else {
        str.push(',jingli:0');
    }
    str.push(',gjsd:');
    str.push(String(target.gjsd / 1000));
    str.push(',bj:"');
    str.push(target.bj);
    str.push('%",');
    str.push('master:"');
    str.push(MASTER_NAME(target));
    str.push('",family:"');
    str.push(target.family.name);
    str.push('",gongji:');
    str.push(target.query_temp("gongji") || 0);
    str.push('}');
    me.send(str.join(""));
}
    get_level_desc(me) {
    if (!me.level) return level_descs[me.level];
    var cc = level_color[me.level];
    if (me.level === 6) {
        return "<" + cc + ">" + level6_descs[me.query_temp('lv6', 0)] + "</" + cc + ">";
    }
    return "<" + cc + ">" + level_descs[me.level] + "</" + cc + ">";

}
}

const MASTER_NAMES = {};
const MASTER_NAME = function (me) {
    let path = me.query_temp('master');
    if (!path) return '无';
    if (MASTER_NAMES[path])
        return MASTER_NAMES[path];
    let obj = NPC.GET(path);
    MASTER_NAMES[path] = obj.name;
    return obj.name
}
const level_descs = ["普通百姓", "武士", "武师", "宗师", "武圣", "武帝", "武神"];
const level_color = ["", "wht", "hig", "hiy", "hiz", "hio", "ord"];
const level6_descs = ["武神", '剑神', '刀皇', '兵主', '战神'];
