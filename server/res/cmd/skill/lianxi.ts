import { COMMAND } from "../../../core/command.js";
import { CHARACTER } from "../../../core/char/character.js";
import { WORLD } from "../../../core/world.js";
import { SKILL } from "../../../core/skill/skill.js";
import { SKILL_TYPES } from "../../../core/const.js";

export default class extends COMMAND {
    command = "lianxi";
    allow_fight = false;
    regex = /^(\w+)(?:\s+(\d+))?$/;
    allow_state = true;

    /**
     * @param {CHARACTER} me - 执行命令的角色
     */
    enter(me, skid, par) {
    if (!me.skills) return;
    if (!(me.pot > 0)) return me.send('你的潜能不足。');
    if (me.state && me.state.id !== 'lianxi')
        return me.send('你正在' + me.state.title + "。");
    var skill = me.skills[skid];
    if (!skill) return me.notify("你不会这个技能。");

    var skill_base = SKILL.get(skid);
    if (!skill_base) return me.notify("没有这个技能。");

    if (skill_base.on_practice && skill_base.on_practice(me) === false) return;
    if (skill_base.on_learn && skill_base.on_learn(me) === false) return;
    if (skill_base.type == SKILL_TYPES.KNOWLEDGE) {
        return me.notify(skill_base.color_name + "只能通过学习增加熟练度。");
    }
    var min_level = (skill_base.lianxi_level || 100);
    if (skill.level < min_level) {
        return me.notify("你的" + skill_base.query_color_name(me) + "等级不够" + min_level + "，无法练习。");
    }

    if (me.query_prop(skid)) return me.notify("你不能装备增加" + skill_base.color_name + "等级的道具练习。");

    var max = me.skill_limit();
    if (par) {
        max = Math.min(par, max);
        if (!(max > 0)) return me.send('错误的等级设置');
        if (max <= me.query_skill(skid))
            return me.notify("你的" + skill_base.query_color_name(me) + "已经练习到" + max + "级了。");
    }
    if (me.state) {
        if (me.state.skill_base === skill_base)
            return me.send('你正在练习' + skill_base.query_color_name(me) + "。");
        for (let i = 0; i < me.state.queues.length; i++) {
            if (me.state.queues[i].skid == skid) {
                me.state.queues.splice(i, 1);
                break;
            }
        }
        me.state.queues.push({
            skid: skid,
            max_level: max
        });
        return me.send('已将' + skill_base.query_color_name(me) + "加入练习队列。");
    }
    if (!check_skill(me, skill_base, false)) return;

    me.notify("<hic>你开始练习" + skill_base.query_color_name(me) + "。</hic>");
    me.set_state({
        id: "lianxi",
        title: "练习技能",
        max_level: max,
        skill_base: skill_base,
        queues: [],
        sum_pot: 0,
        stime: Date.now(),
        on_enter: do_learn,
        desc: "[\"你对" + skill_base.query_color_name(me) + "似乎有些心得。\"]",
        on_stop: function (me, isauto) {
            if (isauto) {
                return to_next(me);
            }
        },
        on_check: on_check
    });
}
}

interface LianxiState {
    max_level: number;
    skill_base: import("../../../core/skill/skill.js").SKILL;
    queues: { skid: string; max_level: number }[];
    sum_pot: number;
}
function on_check(this: LianxiState, me: CHARACTER) {
    let max_level = this.max_level;
    let speed = count_speed(me);


    let skill = this.skill_base;
    let pot = skill.query_needexp(max_level, me) -
        skill.query_needexp(me.query_skill(skill.id, 0), me);
    let str = ['你正在练习', skill.query_color_name(me), '到', max_level, '级，当前练习速度', speed];
    for (let item of this.queues) {
        skill = SKILL.get(item.skid);
        if (!skill) continue;
        str.push('\n准备练习', skill.query_color_name(me), '到', item.max_level, '级');
        pot += (skill.query_needexp(item.max_level, me) -
            skill.query_needexp(me.query_skill(skill.id, 0), me));

    }
    str.push('\n<hic>预计耗时');

    if (pot < me.pot) {
        format_timespan(Math.floor(pot / speed) * 5, str);
        str.push('练习完成');

    } else {
        format_timespan(Math.floor(me.pot / speed) * 5, str);
        pot = me.pot;
        str.push('潜能不足中断');
    }
    str.push('，已消耗', this.sum_pot, '/', Math.floor(pot), '潜能。');
    str.push('</hic>\n点击练习其他武功可添加到队列。');
    me.send(str.join(""));
}
function format_timespan(time, str) {
    if (time < 60) return str.push('少于1分钟');
    if (time > 86400) {
        str.push(Math.floor(time / 86400), '天');
        time = time % 86400;
    }
    if (time > 3600) {
        str.push(Math.floor(time / 3600), '小时');
        time = time % 3600;
    }
    str.push(Math.floor(time / 60), '分钟');
}
function to_next(me) {
    let state = me.state;
    if (state.queues.length > 0) {
        let item = state.queues.shift();
        var skill_base = SKILL.get(item.skid);
        if (!skill_base) return me.notify("没有这个技能。");
        state.max_level = item.max_level;
        state.skill_base = skill_base;
        me.send('你开始练习' + skill_base.query_color_name(me) + "。");
        state.desc = "[\"你对" + skill_base.query_color_name(me) + "似乎有些心得。\"]";

        me.send(`{type:"state",state:"你正在${state.title}",desc:${state.desc}}`);
        return false;
    }
    if (me.query_setting('auto_work')) {
        return WORLD.check_user_next(me);
    }
}
function check_skill(me, skill, limit = true) {

    var lv = me.query_skill(skill.id, 0);
    if (limit && me.state && me.state.max_level && lv >= me.state.max_level) {
        return me.notify_fail("你的"
            + skill.query_color_name(me) + "已经练习到" + me.state.max_level + "级了。");
    }
    var max_lv = me.skill_limit();

    if (!(lv < max_lv)) {
        return me.notify_fail("也许是缺乏实战经验，你觉得你的" + skill.query_color_name(me) + "已经到了瓶颈了。");

    }
    var ens = skill.can_enables;
    if (ens && ens.length) {
        for (var i = 0; i < ens.length; i++) {
            if (lv >= me.query_skill(ens[i], 0)) {
                me.notify("你的基本功火候未到，必须先打好基础才能继续提高。");
                return false;
            }
        }
    }
    if (skill.do_practice && skill.do_practice(me, lv) == false) {
        return false;
    }
    return true;
}
function do_learn(this: LianxiState, me: CHARACTER) {
    if (me.pot > 0) {

        if (!check_skill(me, this.skill_base)) return false;
        var exp = count_speed(me);
        if (exp > me.pot) exp = me.pot;
        me.pot -= exp;
        this.sum_pot += exp;
        return this.skill_base.add_exp(me, parseInt(exp));
    }
    return me.notify_fail("你的潜能不够，无法继续练习下去了。");

}
function count_speed(me) {
    let pot = parseInt((me.int + me.query_prop("int")) * (100 + me.query_prop("lianxi_per")
        + me.family.query_temp('lianxi_per', 0)
        + WORLD.DATA.query_temp("lianxi_per", 0) + me.int) / 100);


    return pot;
}
