import { COMMAND } from "../../../core/command.js";
import { CHARACTER } from "../../../core/char/character.js";

export default class extends COMMAND {
    command = "look,l";
    allow_busy = true;
    allow_state = true;
    regex = /^(\w+?)?(?:\sof\s(\w+))?$/;

    /**
     * @param {CHARACTER} player - 执行命令的角色
     */
    enter(player, objid, from) {
    if (!objid) {

        //player.notify(parent.items_to_json());
        //return parent.send_exits(player);
        return;
    }
    if (from) {
        let parent = player.find_obj(from, player.environment);
        if (!parent) return player.notify("你要看谁的装备？");
        var eq = parseInt(objid);
        if (!(eq >= 0 && eq < 11)) return player.notify("你要看什么？");
        if (parent.query_setting("hide_equip")) {
            return player.send("看样子" + parent.call3() + "不想让别人看自己的装备。");
        }
        var item = parent.equipment[eq];
        if (!item) return player.notify(parent.name + "没有装备你要看的东西。");

        player.notify(item.get_desc(parent));
        if (parent != player)
            player.send_room("$N正盯着$n的" + item.color_name + "看，不知道在打什么主意。", parent, true);

    } else {
        let parent = player.environment;
        if (!parent) return;
        let obj = parent.find_obj(objid);
        if (!obj) {
            return player.notify("你要看什么？");
        }
        if (obj.query_desc) {
            player.notify(obj.query_desc(player));
            if (obj != player)
                player.send_room(look_str.random(), obj, true);
            if (obj.hp > 0) {
                this.obs(player, obj);
            }
        }
        if (player.is_player && !obj.is_player) {
            obj.on_look && obj.on_look(player);
        }
    }

    //if (from) {
    //    parent = parent.find_obj(from);
    //    if (!parent) {
    //        return player.notify("你要看什么？");
    //    }
    //}

    //this.exec(player,obj);
}
    obs(me, target) {
    let obs = me.query_prop('obs');
    if (!obs || target.is_player || !target.attack_skill) return;
    if (me.query_temp('obs')) return;
    let sk_level = target.query_skill(target.attack_skill.id);

    if (me.random(obs) + obs > sk_level) {
        let index = me.random(PROPS1.length);
        let prop = PROPS1[index];
        let val = target[prop];
        let diff = 1;
        let desc = '该有';
        if (sk_level > obs) {

            let oper = (sk_level - obs) / obs;
            let diff = Math.random() * oper * (me.random(2) === 1 ? -0.5 : 0.5);
            val = val + Math.floor(val * diff);
            // diff = 10;
            // if (oper > 0.2) diff *= 10;
            // if (oper > 0.4) diff *= 10;
            // if (oper > 0.6) diff *= 10;
            // if (oper > 0.8) diff *= 10;
            // if (diff > val) {
            //     diff = Math.pow(10, Math.floor(Math.log10(val)));
            // }
            desc = diff > 0 ? "不上" : "不下";
        }
        val = Math.floor(val / diff) * diff;
        me.send('你以观气术探向' + target.name + "，其" + PROPS2[index] + "之数" + desc + val + "。");


    } else {
        me.send('你以观气术探向' + target.name + "，却见其气场凝练如山，毫无所获。");
    }
    me.set_temp('obs', 1, 10000);
}
}

var look_str = ["$N正盯着$n看，不知道在打什么主意。", "$N笑眯眯的看着$n，不知道在想些什么。"];
const PROPS1 = ['hp', 'mp', 'gj', 'fy', 'mz', 'ds', 'zj'];
const PROPS2 = ['气血', '内力', '攻击', '防御', '命中', '躲闪', '招架'];
