import { COMMAND } from "../../../os/command.js";
import { CHARACTER } from "../../../os/char/character.js";
import { WORLD } from "../../../os/world.js";
import { SKILL } from "../../../os/skill/skill.js";
import { SKILL_TYPES } from "../../../os/const.js";

export default class extends COMMAND {
    command = "xue";
    allow_state = true;
    allow_fight = false;
    regex = /^(?:(\d+)\s)?(\w+)\s+from\s+(.+?)$/;

    /**
     * @param {CHARACTER} me - 执行命令的角色
     */
    enter(me, par, sk, target) {
    if (!sk) return me.notify("你要学习什么技能？");
    target = me.find_obj(target, me.environment);
    if (!target) return me.notify("你要跟谁学习技能？");

    if (!me.skills) me.skills = {};
    var skill_base = SKILL.get(sk);
    if (!skill_base) return me.notify("没有这个技能。");
    if (skill_base.grade !== skill_base.query_grade(me)
        && skill_base.type !== SKILL_TYPES.KNOWLEDGE)
        return me.notify('你的' + skill_base.query_color_name(me) + "已经进阶，不能再通过学习提升等级了。");
    if (target.is_player) {
        if (!me.master ||
            me.master !== target.id
            || skill_base.type !== SKILL_TYPES.BASE) {
            return me.notify(me.name + "不能向" + target.name + "请教" + skill_base.color_name + "！");
        }
    } else {
        if (target.on_teach) {
            if (target.on_teach(me, sk) === false) return;
        } else {
            if (target.master == me.id) {
                if (target.on_master_learn && target.on_master_learn(me, sk) == false) return;

            } else {
                if (!target.is(me.query_temp("master")))
                    return me.notify(target.name + "对你说道：请教？这怎么敢当！");
            }
        }
    }
    if (BAN_SKILLS[sk]) return me.send(skill_base.color_name + '不能通过学习升级。');

    if (!target.skills[sk]) return me.notify(target.name + "不会这个技能。");

    if (target.skills[sk].disable) return me.notify("这个技能暂时不能学习，请联系管理员处理。");



    if (me.skills[sk + "2"]) return me.notify("你已经学会了的" + skill_base.color_name + "的进阶武功，不用再学习了。");
    const skill_level = me.query_skill(sk, 0);
    if (skill_level === 0 && skill_base.do_learn(me) == false) return;

    if (check_skill(me, skill_base, target, false) == false) {
        return;
    }
    if (target.is(me.query_temp("master"))) {
        if (skill_base.grade > 3 && skill_level === 0) {
            if (me.query_temp('sm_level', 0) < 2 && me.query_temp("gongji", 0) < 5000) {
                return me.notify(target.name + "对你说道：你对本门的贡献还不够，还需要多加努力。");
            }
        }
    }
    if (!checkSkillCount(me, sk)) return;
    var max = skill_base.type === SKILL_TYPES.KNOWLEDGE ? 0 : me.skill_limit();
    if (par) {
        max = parseInt(par);
        if (!(max > 0)) return me.send('错误的等级设置');
        if (max <= skill_level)
            return me.notify("你的" + skill_base.query_color_name(me) + "已经学习到" + max + "级了。");
    }
    if (me.state) {
        if (me.state.id !== 'learn')
            return me.notify('你正在' + me.state.title + "。");
        if (me.state.skill_base.id === sk)
            return me.send('你正在学习' + skill_base.query_color_name(me) + "。");
        for (let i = 0; i < me.state.queues.length; i++) {
            if (me.state.queues[i].skid == sk) {
                me.state.queues.splice(i, 1);
                break;
            }
        }
        me.state.queues.push({
            skid: sk,
            max_level: max
        });
        return me.send('已将' + skill_base.query_color_name(me) + "加入学习队列。");
    }
    me.notify("<hic>你开始向" + target.name + "请教有关「" + skill_base.name + "」的疑问。</hic>");
    me.set_state({
        id: "learn",
        title: "学习" + skill_base.name,
        target: target,
        max_level: max,
        skill_base: skill_base,
        queues: [],
        on_enter: do_learn,
        no_move: "你在听师父讲解，还是不要乱走的好。",
        desc: "[\"你听了" + target.name + "的指导，似乎有些心得。\"]",
        on_stop: function (me, isauto) {
            if (isauto) {
                return to_next(me);
            }
        },
        on_check: on_check
    });

}
}

const BAN_SKILLS = {
    linshuijing: true,
    guanshanjue: true
};
function on_check(me) {


    let speed = count_speed(me);

    let skill = this.skill_base;
    let target_lv = Math.min(me.skill_limit(), this.target.query_skill(skill.id, 0));
    if (skill.type === SKILL_TYPES.KNOWLEDGE)
        target_lv = this.target.query_skill(skill.id, 0);
    let max_level = this.max_level || target_lv;
    let pot = skill.query_needexp(max_level, me) -
        skill.query_needexp(me.query_skill(skill.id, 0), me);
    let str = ['你正在学习', skill.query_color_name(me), '，当前学习速度', speed];

    for (let item of this.queues) {
        skill = SKILL.get(item.skid);
        let maxlv = item.max_level || target_lv;
        str.push('\n准备学习', skill.query_color_name(me), '到', maxlv, '级');
        pot += (skill.query_needexp(maxlv, me) -
            skill.query_needexp(me.query_skill(skill.id, 0), me));

    }
    str.push('\n<hic>预计耗时');
    if (pot < me.pot) {
        format_timespan(Math.floor(pot / speed) * 5, str);
    } else {
        format_timespan(Math.floor(me.pot / speed) * 5, str);
        str.push('，潜能不足。');
    }
    str.push('</hic>\n点击学习其他武功可添加到学习队列。');
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
        me.notify("<hic>你开始向" + state.target.name
            + "请教有关「" + skill_base.name + "」的疑问。</hic>");

        return false;
    }
    if (me.query_setting('auto_work')) {
        return WORLD.check_user_next(me);
    }
}
function checkSkillCount(me, sk) {
    var count = 0;
    for (var skid in me.skills) {
        if (skid == sk) return true;
        var skill_base = SKILL.get(skid);
        if (skill_base && skill_base.type == SKILL_TYPES.SKILL) {

            count++;
        }
    }
    if (count >= 50) return me.notify_fail('你的技能数量已经达到上限(基础武功和知识类武功外的其他技能不能超过50个)。');
    return true;
}
function check_skill(me, skill, master, limit = true) {

    var lv = me.query_skill(skill.id, 0);
    if (lv >= master.query_skill(skill.id, 0)) {
        me.notify("这项技能你的程度已经不输你师父了。");
        return false;
    }
    if (limit && me.state && me.state.max_level && lv >= me.state.max_level) {
        return me.notify_fail("你的" + skill.color_name + "学习完毕。");
    }
    if (skill.type != SKILL_TYPES.KNOWLEDGE) {
        var max_lv = me.skill_limit();
        if (lv >= max_lv) {
            return me.notify_fail("也许是缺乏实战经验，你对" + master.name + "的讲解总是无法领会。");

        }
        var ens = skill.can_enables;
        if (ens && ens.length) {
            for (var i = 0; i < ens.length; i++) {
                if (lv >= me.query_skill(ens[i], 0)) {
                    me.notify("也许是基本功火候未到，你对" + master.name + "的讲解总是无法领会。");
                    return false;
                }
            }
        }
    }
    // if (skill.do_learn(me, lv) == false) {
    //     return false;
    // }
    return true;
}
function do_learn(me) {
    var master = this.target;
    if (!me.is_here(master) || !master.is_living()) {
        return false;
    }
    if (me.pot <= 0) {
        me.notify("你的潜能不够，无法继续学习下去了。");
        return false;
    }
    var skill = me.skills[this.skill_base.id];
    var lv = 0;
    if (skill) {
        lv = skill.level;
    }
    if (lv >= master.query_skill(this.skill_base.id, 0)) {
        me.notify("这项技能你的程度已经不输你师父了。");
        return false;
    }
    if (check_skill(me, this.skill_base, master) == false) {
        return false;
    }

    var exp = count_speed(me);
    if (lv < 300) {
        exp = exp * 5;
        if (this.skill_base.type == SKILL_TYPES.KNOWLEDGE) {
            exp = exp * 2;
        }
    } else {
        if (this.skill_base.type == SKILL_TYPES.KNOWLEDGE) {
            exp = exp * 10;
        }
    }
    if (master.do_teach) {
        return master.do_teach(me, this.skill_base, lv);
    }

    if (exp > me.pot)
        exp = me.pot;

    if (this.skill_base.type === SKILL_TYPES.KNOWLEDGE) {
        let diff = me.query_prop('haoranqi');
        let diff_pot = exp;
        if (diff > 0) {
            diff_pot = parseInt(exp - exp * diff / 100);
        }
        me.pot -= diff_pot;
    } else {
        me.pot -= exp;
    }
    this.skill_base.add_exp(me, exp);

}
function count_speed(me) {
    let pot = parseInt((me.int + me.query_prop("int")) *
        (100 + me.query_prop("study_per") + me.family.query_temp('study_per', 0)
            + WORLD.DATA.query_temp("study_per", 0) + me.int) / 100) * 3;

    return pot;
}
