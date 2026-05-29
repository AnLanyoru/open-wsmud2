import { SKILL } from "../../../os/skill/skill.js";
import { FAMILIES } from "../../../os/skill/family.js";

export default class extends SKILL {
    name = "狂风快剑";
    id = "kuangfengkuaijian";
    grade = 3;
    family = FAMILIES.HUASHAN;
    attack_actions = [
    "$N纵身跃起手中$w轻挥，斩向$n后颈",
    "$N手中$w连话三个弧形，向$n的右臂齐肩斩落",
    "$N轻吁一声，刷刷刷刷四剑，向$n胸，腹，腰，肩四处连刺",
    "$N仰天一声清啸，斜行向前，$w横削直击，迅捷无比，击向$n的$l"

];
    dodge_actions = [
    "$n一式<HIY>「巨鹏亮翅」</HIY>，两臂鹏举如翼，在剌剌风声中，从$N头顶横跃而过。",
    "$n一式<HIC>「风送紫霞」</HIC>，如一阵清风，舒缓地闪过了$N的凌厉攻势。",
    "$n一式<HIB>「燕回朝阳」</HIB>，轻盈地一跃，一转眼间便绕到了$N的身后。",
    "$n一式<HIY>「却别苍松」</HIY>，一转身间，向后飘出近一丈远",
    "$n一式<HIM>「旭日初升」</HIM>，全身笔直，拔地而起，在半空中一转，已落到几丈远的地方。",
    "$n一式<HIY>「金雁横空」</HIY>，身体如一只金雁般行云流水地滑出丈余。",
    "$n一式<HIW>「晚月朗星」</HIW>，双脚点地，全身化为一道白影，急速绕着$N打了几转。",
    "$n一式<GRN>「幻眼云湮」</GRN>，身形陡地变得飘忽不定，令$N无法看清。",
    "$n一式<HIM>「苍龙盘岭」</HIM>，宛若一条矫矢苍龙，围着$N急速地盘旋了几圈。"
];
    desc = "华山派的剑宗的立宗剑法，以快闻名";
    can_enables = ["sword", "dodge"];
    learn_condition = {
    max_mp: 3000,
    skill: {
        sword: 300
    }
};
    pfm = {
    duoming:
    {
        name: "夺命连环",
        distime: 20000,
        enable_skill: "sword",
        mp: 20,
        use: function (me, target, lv) {
            if (me.query_temp('kuangfeng')) return me.notify("你的夺命连环还没释放完。");

            me.send_room("<hir>$N一声清啸，手中$W犹如狂风般劈头向$n刺去。</hir>\n", target);
            var isMIss = false;
            for (var i = 0; i < 3; i++) {
                if (!me.do_attack({
                    target: target,
                    gj: me.gj,
                    mz: me.mz,
                    no_append: true
                })) {
                    isMIss = true;
                }
            }
            if (isMIss) {
                me.send_room("<hic>$N一击未能奏效，收招后退</hic>");
            } else {
                me.set_temp("kuangfeng", 1, 5000);
            }
            me.end_attack(target);
        },
        query_desc: function (me, lv) {
            var per = 10 - parseInt(lv / 100);
            if (per < 3) per = 3;
            return "夺命连环三仙剑是剑宗狂风剑法的精髓，瞬间攻出三剑，如果三剑全部命中" + (me.gjsd / 1000) + "秒后会继续触发夺命连环但是命中会降低" + per + "%";
        }
    }
};

    query_enable_prop(lv) {
    return {
        sword: {
            gj: parseInt(lv * 1.5 + 10),
            gjsd: 250,
            mz: parseInt(lv * 1.5 + 10)
        }, dodge: {
            ds: parseInt(lv * 1.4 + 6),
            gjsd: 250
        }
    };
}
    on_attack_over(me, target, par) {
    let kf_count = me.query_temp("kuangfeng");
    if (kf_count) {
        me.send_room("<hir>$N一击奏效，手中快剑如狂风般继续攻来</hir>\n");
        var isMIss = false;

        var per = 10 - parseInt(me.query_skill('kuangfengkuaijian', 0) / 100);
        if (per < 3) per = 3;

        let mz = me.mz;
        mz = parseInt(mz - mz * (kf_count - 1) * per / 100);
        if (mz < 0) mz = 0;

        for (var i = 0; i < 3; i++) {
            if (!me.do_attack({
                target: target,
                gj: me.gj,
                mz: mz,
                no_append: true
            })) {
                isMIss = true;
            }
        }
        if (isMIss) {
            me.send_room("<hic>$N一击未能奏效，收招后退</hic>");
            me.remove_temp("kuangfeng");
        } else {
            me.set_temp("kuangfeng", kf_count + 1, 5000);
        }
        if (par.is_dodge || par.is_parry) me.end_attack(target);
    }
}
}

