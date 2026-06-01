import { SKILL } from "../../../core/skill/skill.js";

export default class extends SKILL {
    name = "云龙剑";
    id = "yunlongjian";
    grade = 2;
    attack_actions = [
    "$N使一式<GRN>「悠悠顺自然」</GRN>，手中$w嗡嗡微振，幻成一条白光刺向$n的$l",
    "$N错步上前，使出<HIC>「来去若梦行」</HIC>，剑意若有若无，$w淡淡地向$n的$l挥去",
    "$N一式<HIB>「志当存高远」</HIB>，纵身飘开数尺，运发剑气，手中$w遥摇指向$n的$l",
    "$N纵身轻轻跃起，一式<HIW>「表里俱澄澈」</HIW>，剑光如水，一泻千里，洒向$n全身",
    "$N手中$w中宫直进，一式<BLU>「随风潜入夜」</BLU>，无声无息地对准$n的$l刺出一剑",
    "$N手中$w一沉，一式<HIG>「润物细无声」</HIG>，无声无息地滑向$n的$l",
    "$N手中$w斜指苍天，剑芒吞吐，一式<HIY>「云龙听梵音」</HIY>，对准$n的$l斜斜击出",
    "$N左指凌空虚点，右手$w逼出丈许雪亮剑芒，一式<RED>「万里一点红」</RED>刺向$n的咽喉",
    "$N合掌跌坐，一式<MAG>「我心化云龙」</MAG>，$w自怀中跃出，如疾电般射向$n的胸口",
    "$N呼的一声拔地而起，一式<HIY>「日月与同辉」</HIY>，$w幻出万道光影，将$n团团围住",
    "$N随风轻轻飘落，一式<GRN>「清风知我意」</GRN>，手中$w平指，缓缓拍向$n脸颊"

];
    desc = "天地会看家本领，其特殊攻击法威力奇大，堪称武林一绝。学习需要云龙心法支持。";
    can_enables = ["sword"];
    learn_condition = {
    max_mp: 1000,
    skill: {
        sword: 200
    }
};
    slots = [
    {
        prop: "ylj_sh",
        value: lv => 30 + lv / 100,
        count: 2,
        format: (val) => {
            return "云龙三现的伤害增加" + val + "%";
        }
    }, {
        prop: "ylj_mz",
        value: lv => 30 + lv / 100,
        count: 2,
        format: (val) => {
            return "云龙三现增加命中" + val + "%";
        }
    }
];
    pfm_set = {
    wu:
    {
        name: "云龙三现",
        distime: 10000,
        enable_skill: "sword",
        mp: 20,
        check: function (me, lv) {
            if (lv < 30) return false;
            return true;
        },
        use: function (me, target, lv) {
            var per = 50 + parseInt(lv / 10);
            var mz = 100 + parseInt(per / 3);
            if (mz > 150) mz = 150;

            per += me.query_prop('ylj_sh');
            mz += me.query_prop('ylj_mz');

            me.send_room("<hir>$N长笑一声，随手一抖，$W竟嗡嗡作响，宛若龙吟一般。\n突然间剑光一闪，旁人只听“哧哧”几声轻响， $N已在一瞬间向$n刺了三剑，快的异乎寻常！</hir>", target);
            for (var i = 0; i < 3; i++) {
                me.do_attack({
                    target: target,
                    gj: me.gj * per / 100,
                    mz: me.mz * mz / 100,
                    attack_before: "紧跟着"
                });
            }
            me.end_attack(target);
        },
        query_desc: function (me, lv) {
            var per = 50 + parseInt(lv / 10);
            var mz = parseInt(per / 3);
            if (mz > 150) mz = 150;
            per += me.query_prop('ylj_sh');
            mz += me.query_prop('ylj_mz');

            return "快速出剑攻击敌人出其不意，配合云龙心法如龙吟般声响减少敌人躲闪几率，每次攻击增加命中" + mz + "%，对敌人造成自身攻击力" + per + "%的伤害。";
        }
    }
};

    query_enable_prop(lv) {
    return {
        sword: {
            gj: parseInt(lv * 1.1 + 10),
            mz: lv
        }
    };
}
}
