import { SKILL } from "../../../core/skill/skill.js";

export default class extends SKILL {
    name = "八卦棍法";
    id = "baguagun";
    grade = 2;
    attack_actions = [
    "$N脚踏八卦方位，盘身驻地，一招「削耳撩腮」，手中$w由上至下向$n扫去",
    "$N脚踏八卦方位，反转棍尖，一招「反身劈山」，手中$w竟然用反身刺向$n的胸前",
    "$N一提气，劲贯$w“嗡嗡”做响，一招「上歪门」，自上而下直插$n的头顶",
    "$N一招「上势抱棍」，$w大开大阖，自上而下划出一个大弧，笔直劈向$n",
    "$N蓦的使一招「八卦八阵」，顿时无数棍影从四面八方涌向$n全身",
    "$N腾空而起，如山棍影，疾疾压向$n",
    "$N身形一转，手中$w往后一拖，就在这将退未退之际，一招「峰回路转」，向$n当头砸下"

];
    desc = "温府的一套棍法";
    can_enables = ["club"];
    learn_condition = {
    max_mp: 800,
    skill: {
        club: 250
    }
};
    slots = [
    {
        prop: 'bgg_mz',
        value: (lv) => 10,
        count: 2,
        format: (val) => {
            return '八卦八打每棍命中增加10%';
        },
    },
    {
        prop: 'bgg_gj',
        value: (lv) => 10 + parseInt(lv / 100),
        count: 3,
        format: (val) => {
            return '八卦八打附加的伤害提高' + val + "%";
        },
    },
    {
        prop: 'bgg_cd',
        value: (lv) => 5000,
        count: 3,
        format: (val) => {
            return '八卦八打冷却减少5秒';
        },
    },
];
    pfm_set = {
    wu:
    {
        name: "八卦八打",
        distime: 20000,
        enable_skill: "club",
        distime_key: 'bgg_cd',
        mp: 20,
        use: function (me, target, lv) {
            var p = 1 + Math.round((lv / 100));
            if (p > 8) p = 8;
            me.send_room("<hir>$N脚下踏着先天八卦的图式，身随意转，手随心动，顿时无数棍影从四面八方涌向$n</hir>\n", target);
            const mz_per = me.query_prop('bgg_mz');
            let mz = me.mz;
            let gj = me.gj + me.gj * me.query_prop('bgg_gj') / 100;

            mz = mz + mz * mz_per / 100;
            for (var i = 0; i < p; i++) {
                me.do_attack({
                    target: target,
                    gj: gj,
                    mz: mz
                });
            }

            me.end_attack(target);
        },
        query_desc: function (me, lv) {
            var p = 1 + Math.round((lv / 100));
            if (p > 8) p = 8;
            return "瞬间对敌人攻击" + p + "次";
        }
    }
};

    query_enable_prop(lv) {
    return {
        club: {
            gj: parseInt(lv * 1.2) + 20,
            mz: parseInt(lv * 1.2) + 20
        }
    };
}
}
