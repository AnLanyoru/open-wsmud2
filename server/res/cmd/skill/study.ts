import { COMMAND } from "../../../core/command.js";
import { CHARACTER } from "../../../core/char/character.js";
import { WORLD } from "../../../core/world.js";
import { SKILL } from "../../../core/skill/skill.js";
import { SKILL_TYPES } from "../../../core/const.js";

export default class extends COMMAND {
    command = "study";
    allow_fight = false;

    /**
     * @param {CHARACTER} me - 执行命令的角色
     */
    enter(me, bookid) {
    if (!bookid) return me.notify("你要学习什么技能？");

    if (bookid.length < 4) return this.study_from_books(me, bookid);

    var target = me.find_obj(bookid);
    if (!target) return me.notify("你身上没有这本书。");
    if (!target.path.startsWith('book/book') && !target.path.startsWith('book/chao')
        && !target.is('sp/new/ksforce')
        && !target.is('sp/new/ksunarmed') && !target.is('book/zc'))
        return me.notify("你不能从" + target.color_name + "里学到任何东西。");

    if (!target.skill) return me.notify("你不能从" + target.color_name + "里学到任何东西。");

    var skill = SKILL.get(target.skill);
    if (!skill) return me.notify("没有这个技能。");


    this.study_skill(me, skill, target);

}
    study_from_books(me, bindex) {
    let books = me.books;
    if (me.master) {
        let user = WORLD.getUser(me.master);
        if (!user) return me.send('你没有书架。');
        books = user.books;
    }
    if (!books) return me.send('你要学哪个武功？');
    let index = parseInt(bindex);
    if (!(index >= 0 && index < books.length))
        return me.send('你要学哪个武功？');
    var skill = SKILL.get(books[index]);
    if (!skill) return me.notify("书架上没有这个武功秘籍。");
    var target = { color_name: skill.color_name, max_level: 100, };
    this.study_skill(me, skill, target);
}
    study_skill(me, skill, target) {
    if (skill.is_custom && !me.create_for(skill.id)) return me.notify('这是别人自创的武功，目前无法学习。');

    if (!checkSkillCount(me, skill.id)) return;
    if (!me.skills) me.skills = {};


    if (me.skills[skill.id + "2"]) return me.notify("你已经学会了的" + skill.color_name + "的进阶武功，不用再学习了。");

    // if (skill.do_learn && skill.do_learn(me, lv) == false) return false;

    if (me.query_skill(skill.id) === 0 && skill.do_learn(me) == false) return;

    if (check_skill(me, target, skill) == false) return;

    if (me.query_prop(skill.id)) return me.notify("你不能装备增加" + skill.color_name + "等级的道具读书。");
    me.notify("<hic>你开始认真研读" + target.color_name + "。</hic>");

    me.set_state({
        id: "study",
        title: "读书",
        target: target,
        skill_base: skill,
        stime: Date.now(),
        on_enter: do_learn,
        no_move: "读书要专心，不要乱跑。",
        desc: "[\"你对" + skill.color_name + "似乎有些心得。\"]",
        on_stop: function (me, isauto) {
            if (isauto) {
                if (me.query_setting('auto_work')) {
                    return WORLD.check_user_next(me);
                }
            }
        },
    });
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
function check_skill(me, book, skill) {
    var lv = me.query_skill(skill.id, 0);
    if (book.max_level <= lv)
        return me.notify_fail("这本书上的内容对你来说太浅了。");

    if (skill.type != SKILL_TYPES.KNOWLEDGE) {
        var max_lv = me.skill_limit();
        if (lv >= max_lv) {
            return me.notify_fail("也许是缺乏实战经验，你无法理解" + book.color_name + "上面的内容。");

        }
        var ens = skill.can_enables;
        if (ens && ens.length) {
            for (var i = 0; i < ens.length; i++) {
                if (lv >= me.query_skill(ens[i], 0)) {
                    me.notify("也许是基本功火候未到，你对" + book.color_name + "上面的内容无法理解。");
                    return false;
                }
            }
        }
    }

    // this.on_study = function (me, skill, lv) {
    //     return true;
    // }
    // if (book.on_study && book.on_study(me, skill, lv) == false) {
    //     return false;
    // }
    return true;
}
function do_learn(me) {

    if (check_skill(me, this.target, this.skill_base) == false) return false;

    var exp = parseInt((me.int + me.query_prop("int")) * (100 + me.query_prop("study_per")) / 100) * 2;
    if (!(exp > 0)) exp = me.int;

    this.skill_base.add_exp(me, exp);
    var lv = me.query_skill(this.skill_base.id, 0);
    if (this.target.max_level <= lv) {
        me.set_skill(this.skill_base.id, this.target.max_level);
        var one_score = this.skill_base.query_one_score(me);


        me.add_score(one_score * (this.target.max_level - lv));
        me.send('{type:"dialog",dialog:"skills",id:"' + this.skill_base.id + '",level:' + this.target.max_level + ',exp:0}');
    }
}
