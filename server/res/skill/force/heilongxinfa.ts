import { SKILL } from "../../../core/skill/skill.js";

export default class extends SKILL {
    name = "黑龙心法";
    id = "heilongxinfa";
    grade = 1;
    force_rad = 0.65;
    desc = "黑龙会的内功心法，入会便能修炼";
    can_enables = ["force"];
    learn_condition = {
    skill: {
        force: 30
    }
};
    slots = [
    {
        prop: 'hl_fy',
        value: (lv) => lv,
        format: (val) => {
            return '黑龙护体受到伤害减少' + val + '点';
        },
    },
    {
        prop: 'hl_sh',
        value: (lv) => lv,
        format: (val) => {
            return '黑龙护体被命中时对目标造成' + val + '点伤害';
        },
    },
];
    pfm = {
    power:
    {
        name: "黑龙护体",
        distime: 30000,
        enable_skill: "force",
        mp: 20,
        release_time: 0,
        use_type: 2,
        use: function (me, target, lv) {

            me.send_room("<hic>$N喉间发出一声低沉吼叫，内息如墨自丹田翻涌而上游走全身！！</hic>");

            const time = 10000 + lv * 10;
            const prop = {
                fy: lv,
            };
            const is_fy = me.query_prop('hl_fy');
            const is_sh = me.query_prop('hl_sh');

            if (is_fy) {
                prop.diff_sh = is_fy;
            }
            if (is_sh > 0) {
                me.set_temp('sk_heilong', is_sh, time);
            }

            me.add_status({
                id: "force",
                name: "黑龙护体",
                desc: "运用黑龙护体，提升自身防御力",
                prop: prop,
                duration: time,
                finish_msg: "$N的黑龙护体运行完毕，将内力收回丹田。"
            });
        },
        query_desc: function (me, lv) {
            var time = (10000 + lv * 10) / 1000;
            var gj = lv;
            return "提升全身潜力，在" + time + "秒内，提升自身防御力" + gj + "点。";
        }
    }
};

    query_enable_prop(lv) {
    return {
        force: {
            fy: lv,
            limit_mp: lv * 10,
            desc: "唯一：将你内力的65%转化为气血"
        }
    };
}
    on_force_parry(me, target) {
    let sh = me.query_temp('sk_heilong');
    if (sh > 0) {
        me.send_combat(
            '<blk>$n被$N的黑龙护体反弹了' + sh + '点伤害！！</blk>\n',
            target
        );
        target.damage2(sh, me);
        me.end_attack(target);
    }
    return 0;
}
}
