import { MONSTER } from "../../../../os/char/monster.js";
import { WORLD } from "../../../../os/world.js";
import { UTIL } from "../../../../os/util/util.js";
import { EVENTS } from "../../../../os/task/events.js";
import { COMMAND } from "../../../../os/command.js";

export default class extends MONSTER {
    name = "黑龙";
    desc = "它被玄铁锁链捆在盘龙柱上，鳞甲黯淡，挣扎时锁链摩擦作响，发出低哑悲鸣";
    gender = 0;
    age = 200;
    per = 20;
    mp = 500000;
    max_mp = 500000;
    hp = 55000;
    max_hp = 5000000;
    score = 29;
    prop = {
    gj: 4900,
    mz: 4900,
    ds: 1900,
    fy: 4900,
    zj: 1900
};
    is_free = false;
    fight_time = 0;

    constructor() {
        super();
        this.set_drop({
            obj: "st/xuanjing",
            min: 1,
            max: 10
        }, {
            obj: ['eq/lv2/lm_jian', 'sp/bj/zhu', 'book/bc#qinlong'],
            odds: 300
        });
        this.skill_map(
            ["dodge", 380],
            ["parry", 380],
            ["force", 380],
            ["bite", 380],
            ["heilong", 380, ["bite", "dodge", "parry"]]);
        this.add_action('free', '放了它', function (me) {
            me.send(this.name + '挣扎双翼连接的锁链哗啦作响：狡猾的人类，又想骗我什么？这根柱子灵纹封印，单靠蛮力无法破坏。');

        });
    }

    on_create() {
    this.hp = 55000;
}
    on_kill(me) {
    if (this.is_free) return false;
    if (!this.fight_type) {
        this.environment.set_temp(me, 'kill_hl', 1);
        me.send(this.name + "轻蔑道：找死！\n");
        this.do_kill(me);
    }
}
    heart_beat(dt) {
    if (this.fight_type > 0) {
        this.fight_time++;
        if (this.fight_time > 60) {
            this.destroy("\n<yel>" + this.name + "身躯腾空而起，随即遁入深潭。</yel>");
        }
    } else {
        this.mp = this.max_mp;
        this.hp = this.is_free ? 5000000 : 55000;
    }
}
    on_enter(me) {
    let room = this.environment;
    if (room.query_temp(me, 'kill_hl')) {
        this.do_kill(me);
    } else {
        me.send(this.name + '虚弱的抬起脑袋看着你：人类，你想做什么？');
        me.send_commands('kill ' + this.id, '击杀它', 'free ' + this.id, '放了它');
    }
}
    on_free(me) {
    this.is_free = true;
    this.send_room('$N猛地昂起头颅，修长的龙身顺着石柱盘旋，玄铁锁链在龙爪的撕扯接连崩裂。');

    me.add_fbscore(100);
    this.call_out(this.to_next, 3000, me);

}
    to_next(me) {
    this.full();
    this.send_room('$N身躯如墨色闪电般绷直，借反冲之力腾空而起，修长的身躯在空中蜿蜒盘旋，低沉的龙吟响彻锁龙井。');

    this.call_out(this.to_next2, 3000, me);
}
    to_next2(me) {
    if (!this.is_here(me))
        return this.destroy(this.name + '飞走了。');
    this.send_room('$N悬在半空低头审视着$n，最终什么也没说，庞大身躯骤然腾空，转瞬间便消失在锁龙井深处。', me);
    this.send_room('布满裂痕的柱体在巨力撕扯下迸出蛛网般的碎纹，"咔嚓" 声中裂成无数碎石裂片，混着玄铁锁链的残片砸落满地，扬起的烟尘里再无半分龙脉气息。', me);
    this.destroy();

    let items = me.team || [me];
    let index = me.environment.parent.fb_index;
    const eqs = ['eq/lv2/lm_cloth',
        'eq/lv2/lm_tou',
        'eq/lv2/lm_shoes',
        'eq/lv2/lm_pifeng',
        'eq/lv2/lm_pei'];
    for (let item of items) {
        if (item.environment !== me.environment)
            continue;
        if (!item.is_player) continue;
        if (!item.query_temp('fb_sao' + index, 0)) {
            item.notify("你释放了被锁禁的黑龙，获得称号【黑龙使】。");
            item.add_title('黑龙使', 'lm');
            item.notify("<hic>单人(普通)模式扫荡解锁。</hic>");
            item.set_temp("fb_sao" + index, 1);
            let obj = item.add_obj(eqs.random());
            if (obj) {
                item.send('你从碎裂的锁龙柱下找到' + obj.unit_name(1) + "。");
            }
        }
    }

    if (!WORLD.DATA.query_temp('longmai')) {
        WORLD.DATA.set_temp('longmai', 1, UTIL.diff_time(20));
        WORLD.DATA.set_temp("study_per", 50, 3600000 * 2);
        COMMAND.DO("rumor",
            "听说" + me.name + "解锁了龙脉，所有人的学习效率增加了。");
        EVENTS.add({
            id: "longmai",
            name: "龙脉解锁",
            desc: me.name + '解锁了龙脉，接下来的两小时所有人的学习效率+50%。',
            time: Date.now() + 3600000 * 2,
            grade: 1
        });
    }
}
}

