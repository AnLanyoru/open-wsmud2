import { OBJ } from "../../../os/item/obj.js";

export default class extends OBJ {
    unit = "颗";
    name = "丹药";
    value = 1920000;
    combined = true;
    action_msg = "吃";
    distime = 60000;
    allow_fight = true;
    distype = "marry";
    allow_die = true;
    transable = true;

    on_use(me) {
    if (this.level === 2) {
        if (me.hp > 0)
            return me.notify_fail('这颗丹药在你死亡的时候才会起作用。');
        else {
            me.clear_status();
            me.hp = me.max_hp;
            me.mp = me.max_mp;
            me.notify('{type:"die",relive:true}');
            if (me.force_skill.on_relive) {
                me.force_skill.on_relive(me);
            }
            me.moveto(me.environment, null);
            return me.send_room('<mag>$N吞下一颗' + this.color_name + '，重新获得了新生。</mag>');
        }
    }
    if (me.hp <= 0) return me.notify_fail("你现在是灵魂状态，不能那么做。");

    if (this.level === 0) {
        me.send_room('<hic>$N吞下一颗' + this.color_name + "，重新获得了力量。</hic>");
        return me.clear_distime();
    } else if (this.level === 1) {
        me.add_status({
            id: "syf",
            name: "灵悟",
            prop: {
                int: 1000
            },
            no_clear: true,
            duration: 3600000,
            count: 1,
            override: 1,
            max_count: 10,
            desc: "你的悟性提高了，持续一小时",
        });
        me.send_room('<hig>$N吞下一颗' + this.color_name + "，顿时心明如镜，经脉通畅，悟性大增。<hig>");
    } else if (this.level === 3) {

        if (me.clear_downside(true) > 0) {
            return me.send_room('<hiw>$N吞下一颗' + this.color_name + "，驱离了身上所有的不适。</hiw>");
        }
        return me.notify_fail('你现在没有负面状态可以驱除。');
    } else if (this.level === 4) {
        me.send_room('<hiy>$N吞下一颗' + this.color_name + "，龙气环绕，坚不可摧。</hiy>");
        me.add_status({
            id: "drug",
            name: "龙魂",
            desc: "增加你的免伤",
            no_clear: true,
            duration: 6000,
            prop: {
                diff_sh_per2: 1080
            }
        });
    }
}
    on_create(path, par) {
    var lv = 0;
    if (par) {
        lv = parseInt(par.substr(1));
        if (!(lv > 0)) lv = 0;
    }
    this.grade = 6;
    this.name = names[lv];
    this.desc = descs[lv];
    this.level = lv;
    if (lv === 1) {
        this.distime = 0;
    }
}
}

const names = ['回天丹', '灵悟丹', '还魂丹', '驱魔丹', '龙魂丹'];
const descs = ['服用后后刷新你的所有技能冷却', '服用后一小时内增加1000悟性，可叠加', '死亡后使用可以原地复活',
    "服用后驱散你的负面状态", "服用后6秒内你将免疫绝大部分伤害"];
