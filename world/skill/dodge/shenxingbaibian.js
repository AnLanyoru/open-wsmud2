import { SKILL } from "../../../os/skill/skill.js";

export default class extends SKILL {
    name = "神形百变";
    id = "shenxingbaibian";
    grade = 2;
    dodge_actions = [
    "$n一式<HIC>「行云流水」</HIC>，身不倾，脚不移，身体如行云流水般直滑出丈余。",
    "$n一式<BLU>「潜音夜行」</BLU>，忽然一弯腰，全身贴地而行，顿时闪过了$N的凌厉攻势。",
    "$n一式<HIW>「移步换形」</HIW>，足不动，手不抬，一转眼间便绕到了$N的身后。",
    "$n一式<MAG>「分身化影」</MAG>，一转身间，四面八方飘动着无数个$n的身影，令$N手足无措。",
    "$n一式<HIB>「凌波微步」</HIB>，左踏巽，右转乾，身行一晃，便到几丈远的地方。",
    "$n一式<HIM>「更上层楼」</HIM>，身在空中，左脚在右足上一点，从$N头顶腾空而过。",
    "$n一式<HIW>「仙子出水」</HIW>，长袖一拂，全身化为一道白影，幽幽地从$N头顶飘落。",
    "$n一式<HIG>「峰回路转」</HIG>，身体如陀螺般急转，登时一股气流涌出，令$N难以动弹。",
    "$n一式<GRN>「临行秋波」</GRN>，身行倏的从$N的眼前直绕到身后，$N瞪大了两眼，不明所以。",
    "$n一式<HIY>「浪子回头」</HIY>，身行倏的从$N的眼前飘过，长发一甩，潇洒之极。"
];
    desc = "神行百变是铁剑门木桑道长所传下来的轻功绝技，是逃命的高招";
    can_enables = ["dodge"];
    learn_condition = {
    max_mp: 1000,
    dex1: 20,
    int1: 20,
    skill: {
        dodge: 200
    }
};
    slots = [
    {
        prop: 'sxbb_cd',
        value: (lv) => 5000,
        format: (val) => {
            return '神行冷却时间减少5秒';
        },
    },
    {
        prop: 'sxbb_cx',
        value: (lv) => 1000,
        format: (val) => {
            return '神行持续时间增加1秒';
        },
    },
];
    pfm = {
    chan:
    {
        name: "神行",
        distime: 50000,
        enable_skill: "dodge",
        distime_key: 'sxbb_cd',
        mp: 20,
        release_time: 0,
        use: function (me, target, lv) {
            var t = (5000 + lv * 3);
            if (t > 10000) t = 10000;
            t += me.query_prop('sxbb_cx');
            me.send_room("<hic>$N施展神行百变，神光离合，一转身间，四面八方飘动着无数个$n的身影，</hic>", target);
            me.add_status({
                id: "dodge",
                name: "神行",
                desc: "把神行百变轻功运用到极致，使敌人难以捕捉到你的身影",
                duration: t,
                prop: {
                    ds_per: 100
                }
            });
        },
        query_desc: function (me, lv) {
            var t = (5000 + lv * 3) / 1000;
            if (t > 10) t = 10;
            return "把神行百变轻功运用到极致，使敌人难以捕捉到你的身影，" + t + "秒内增加你100%的躲闪";
        }
    }
};

    query_enable_prop(lv) {
    return {
        dodge: {
            ds: Math.round(lv * 1.2 + 20),
            dex: Math.round(lv / 10)
        }
    };
}
}
