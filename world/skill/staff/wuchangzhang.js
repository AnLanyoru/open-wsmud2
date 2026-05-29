import { SKILL } from "../../../os/skill/skill.js";
import { WEAPON_TYPE } from "../../../os/const.js";

export default class extends SKILL {
    name = "无常杖";
    id = "wuchangzhang";
    grade = 2;
    attack_actions = [
    "$N微一躬身，一招<HIG>「庸人自扰」</HIG>，$w带着刺耳的吱吱声，擦地扫向$n的脚踝",
    "$N一招<HIM>「想入非非」</HIM>，右手托住杖端，左掌居中一击，令其凭惯性倒向$n的肩头",
    "$N一招<HIR>「六神不安」</HIR>，举起$w乒乒乓乓地满地乱敲，让$n左闪右避，狼狈不堪",
    "$N一招<HIY>「面无人色」</HIY>，举起$w，呆呆地盯了一会，突然猛地一杖打向$n的$l",
    "$N将$w顶住自己的胸膛，一端指向$n，一招<HIB>「心惊肉跳」</HIB>，大声叫喊着冲向$n",
    "$N一招<HIC>「行尸走肉」</HIC>，全身僵直，蹦跳着持杖前行，冷不防举杖拦腰向$n劈去",
    "$N面带戚色，一招<HIM>「饮恨吞声」</HIM>，趁$n说话间，一杖向$n张大的嘴巴捅了过去",
    "$N一招<HIW>「力不从心」</HIW>，假意将$w摔落地上，待$n行来，一脚勾起，击向$n的$l",
    "$N伏地装死，一招<HIG>「穷途没路」</HIG>，一个翻滚，身下$w往横里打出，挥向$n的裆部",
    "$N一招<HIR>「呆若木鸡」</HIR>，身不动，脚不移，$w却直飞半空，不偏不倚地砸向$n的$l",
    "$N高举$w，一招<HIG>「人鬼殊途」</HIG>，身形如鬼魅般飘出，对准$n的天灵盖一杖打下",
    "$N一招<HIB>「我入地狱」</HIB>，单腿独立，$w舞成千百根相似，根根砸向$n全身各处要害"
];
    desc = "少林寺七十二绝技之无常杖";
    learn_condition = {
    max_mp: 3000,
    skill: {
        staff: 200
    }
};
    can_enables = ["staff", "parry"];
    slots = [
    {
        prop: 'wcz_gcd',
        value: (lv) => 2000,
        format: (val) => {
            return '无常五化绝招释放时间减少2秒';
        },
    }
];
    pfm = {
    chang:
    {
        name: "无常五化",
        distime: 6000,
        enable_skill: "staff",
        weapon_type: WEAPON_TYPE.STAFF,
        releasetime_key: 'wcz_gcd',
        mp: 20,
        release_time: 10000,
        use: function (me, target, lv) {
            me.send_room("<hiy>$N将手中的$W一荡，化作无数杖影扫向$n</hiy>", target);
            var count = 5;
            for (var i = 0; i < count; i++) {
                me.do_attack({
                    target: target,
                    gj: me.gj,
                    mz: me.mz,
                    attack_before: "紧跟着"
                });
            }
            me.end_attack(target);
        },
        query_desc: function (me, lv) {


            return "无常杖之无常五化，瞬间出招5次，收招较慢。";
        }
    }
};

    query_enable_prop(lv) {
    return {
        staff: {
            gj: lv + 10,
            str: Math.round(lv / 6)
        },
        parry: {
            zj: lv + 5,
            fy: lv + 10
        }
    };
}
}

