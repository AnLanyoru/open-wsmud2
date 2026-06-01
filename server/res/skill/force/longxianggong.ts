import { SKILL } from "../../../core/skill/skill.js";

export default class extends SKILL {
    name = "龙象般若功";
    id = "longxianggong";
    grade = 5;
    force_rad = 0.9;
    desc = "密宗至高无上的护法神功，外功掌力强悍凶猛，抗击打能力强，内力亦刚亦柔";
    attack_actions = [
    "$N单掌一抖，运聚龙象般若功功力，呼啸着向$n的$l处拍去",
    "$N右拳横移，左掌运起龙象般若功的劲力，猛地拍向$n的$l",
    "$N吐气扬声，双拳同时运满龙象般若功功力，朝$n$l处贯去",
    "$N运足龙象般若功，双拳平推，顿时一股凌厉的罡劲直袭$n"
];
    can_enables = ["force"];
    learn_condition = {
    max_mp: 50000,
    skill: {
        force: 300
    }
};
    slots = [

    {
        prop: "lxg_lt",
        value: lv => 20 + Math.min(60, lv / 200),
        format: (val) => {
            return "龙吞势同时增加" + val + "%忽视防御";
        }
    }, {
        prop: "lxg_xq",
        value: lv => 20 + Math.min(60, lv / 200),
        format: (val) => {
            return "龙吞势同时增加" + val + "%伤害减免";
        }
    }
];
    pfm_set = {
    power:
    {
        name: "龙吞势",
        distime: 60000,
        enable_skill: "force",
        mp: 20,
        release_time: 0,
        use_type: 2,
        use: function (me, target, lv) {
            var gj = 50 + parseInt(lv / 100);
            var time = 10000 + lv * 10;
            if (time > 15000) time = 15000;
            me.send_room("<hir>$N大喝一声，全身骨骼节节暴响，一股迅猛的罡气向四周扩散开来！</hir>", target);
            let prop = {
                gj_per: gj
            };
            let per = me.query_prop('lxg_lt');
            if (per > 0) prop['diff_fy_per2'] = per;
            me.add_status({
                id: 'force',
                name: "龙吞势",
                desc: "增加你的攻击",
                duration: time,
                prop: prop,
                finish_msg: "$N的龙吞势运行完毕，将内力收回丹田。"
            });
            me.remove_temp("xqs");
        },
        query_desc: function (me, lv) {
            var gj = 50 + parseInt(lv / 100);
            var time = 10000 + lv * 10;
            if (time > 15000) time = 15000;
            return "使用龙像般若功的龙吞势提升战力，" + (time / 1000) + "秒内增加你" + gj + "%的攻击";
        }
    },
    shield:
    {
        name: "象驱势",
        distime: 60000,
        enable_skill: "force",
        mp: 20,
        release_time: 0,
        use_type: 2,
        use: function (me, target, lv) {
            var gj = 50 + parseInt(lv / 100);
            if (gj > 80) gj = 80;
            var time = 10000 + lv * 10;
            if (time > 15000) time = 15000;
            me.send_room("<hiy>$N大喝一声，运起十象之力，霎时金波流转，罡气笼罩全身！</hiy>", target);
            let prop = {
                fy_per: gj
            };
            let per = me.query_prop('lxg_xq');
            if (per > 0) prop['diff_sh_per2'] = per;
            me.add_status({
                id: "force",
                name: "象驱势",
                desc: "增加你的防御，和吸收伤害",
                duration: time,
                prop: prop,
                on_attach: p => p.set_temp('xqs', gj, time),
                on_expire: function (p) {
                    p.remove_temp('xqs');
                },
                finish_msg: "$N的象驱势运行完毕，将内力收回丹田。"
            });

        },
        query_desc: function (me, lv) {
            var gj = 50 + parseInt(lv / 100);
            if (gj > 80) gj = 80;
            var time = 10000 + lv * 10;
            if (time > 15000) time = 15000;
            return "使用龙像般若功的象驱势提升战力，" + (time / 1000) + "秒内增加你" + gj + "%的防御，被命中后吸收" + (gj) + "%的伤害恢复自身气血，";
        }
    }
};

    query_enable_prop(lv) {
    return {
        force: {
            gj: parseInt(lv * 1.9) + 10,
            fy: parseInt(lv * 1.9) + 10,
            hp_per: 10 + parseInt(lv / 300),
            limit_mp: lv * 198,
            desc: "唯一：将你内力的90%转化为气血"
        },
    };
}
    on_force_parry(me, target, sh) {
    var lv = me.query_temp("xqs");
    if (lv) {
        var hp = me.do_recover(lv * sh / 100);
        if (hp) {
            me.send_room("<hiy>$N全身罡气流转，似乎更加精神奕奕。</hiy>");
            return hp;
        }
    }
    return 0;
}
}
