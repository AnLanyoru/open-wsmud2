import { COMMAND } from "../../../core/command.js";
import { CHARACTER } from "../../../core/char/character.js";
import { WORLD } from "../../../core/world.js";
import { FOLLOWER } from "../../../core/char/follower.js";

export default class extends COMMAND {
    command = "rel";
    allow_busy = true;
    allow_state = true;
    allow_die = true;
    regex = /^(\w+)?(?:\s+(\w+))?$/;

    /**
     * @param {CHARACTER} me - 执行命令的角色
     */
    enter(me, type, cmd) {
    if (type === 'marry') {
        return me.send('解除夫妻关系，需要到扬州城的衙门找户部主簿办理。');
    }
    else if (type === 'st') {
        if (me.query_temp('tudi'))
            return me.send('你的徒弟成长为宗师后自动解除关系，或者去扬州衙门办理强制解除。');
        if (me.query_temp('shifu'))
            return me.send('你成长为宗师后自动解除关系，或者去扬州衙门办理强制解除。');
        return me.send('你没有师父或徒弟，不用解除。');

    } else {
        let target = FOLLOWER.GET(me, { id: type });
        if (!target) return me.send('你没有这个随从。');
        if (cmd === 'stop') {
            if (!target.state) return me.send(target.name + "没有正在进行的工作。");
            target.set_state(null);
            return WORLD.COMMANDS.relation.enter(me);
        }
        if (target.state) return me.send(target.name + "正在" + target.state.title + "。");
        let home = me.query_temp('home');
        if (!home) return me.send('你还没购买住宅。');
        if (home !== 2) return me.send('你的住宅没有随从工作的地方。');
        if (target.environment && target.environment.is_fb()) {
            return me.send(target.name + "正在副本中。");
        }

        if (cmd === 'diaoyu' || cmd === 'caiyao' || cmd === 'wk') {

            let room = me.query_home('home/huayuan');
            if (!room) return me.send('你还没购买带有花园的住宅。');
            //target.set_listener(me, me);
            if (target.hp <= 0) target.hp = 1;
            if (target.environment !== room) {
                target.moveto(room);
            }
            if (cmd === 'diaoyu') {
                var wea = target.query_weapon();
                if (!wea ||
                    !wea.path.startsWith("sp/tool/diao")) {
                    return me.notify(target.name + "没有装备钓竿不可以钓鱼(进入住宅选择目标随从-背包-装备钓鱼竿)。");
                }

                var er = query_er(target);
                if (!er) return me.notify(target.name + "身上没有鱼饵，可以去扬州城的杂货店购买钓竿和鱼饵。");
            } else if (cmd === 'wk') {
                if (target.query_skill('guanshanjue', 0) < 100) {
                    return me.notify(target.name + '的观山诀等级太低，无法在小花园挖矿。');
                }
                var wea = target.query_weapon();
                if (!wea ||
                    !wea.path.startsWith("sp/tool/chu")) {
                    return me.notify(target.name + "没有装备铁镐无法挖矿(进入住宅选择目标随从-背包-装备铁镐)。");
                }
            }


            target.do_command(cmd);
            // me.do_command('dc', target.id + " " + cmd);
            // target.set_listener(me, null);
            return WORLD.COMMANDS.relation.enter(me);
        } else {
            return me.send('你要让' + target.name + "做什么？");
        }
    }
}
}

function query_er(me) {
    for (var i = 0; i < me.items.length; i++) {
        if (me.items[i].path.startsWith("sp/tool/er#")) {
            return me.items[i];
        }
    }
}
