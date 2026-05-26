this.inherits(SKILL);
this.name = "独孤九剑";
this.id = "dugujiujian";
this.grade = 4;
this.first_title = "九剑传人";
this.family = FAMILIES.HUASHAN;
this.attack_actions = [
    "但见$N挺身而上，$w一旋，一招仿佛泰山剑法的「<HIC>来鹤清泉</HIC>」直刺$n的$l！",
    "$N奇诡地向$n挥出「<RED>泉鸣芙蓉</RED>」、「<YEL>鹤翔紫盖</YEL>」、「<BLU>石廪书声</BLU>」、「<MAG>天柱云气</MAG>」及「<YEL>雁回祝融</YEL>」衡山五神剑！",
    "$N剑随身转，续而刺出十九剑，竟然是华山「<MAG>玉女十九剑</MAG>」，但奇的是这十九剑便如一招，手法之快，直是匪夷所思！",
    "$N剑势忽缓而不疏，剑意有余而不尽，化恒山剑法为一剑，向$n慢慢推去！",
    "$N剑意突焕气象森严，便似千军万马奔驰而来，长枪大戟，黄沙千里，尽括嵩山剑势击向$n的$l！",
    "却见$N身随剑走，左边一拐，右边一弯，剑招也是越转越加狠辣，竟化「<HIG>泰山十八盘</HIG>」为一剑攻向$n！",
    "$N剑招突变，使出衡山的「<HIC>一剑落九雁</HIC>」，削向$n的$l，怎知剑到中途，突然转向，大出$n意料之外！",
    "$N吐气开声，一招似是「<WHT>独劈华山</WHT>」，手中$w向下斩落，直劈向$n的$l！",
    "$N手中$w越转越快，使的居然是衡山的「<MAG>百变千幻云雾十三式</MAG>」，剑式有如云卷雾涌，旁观者不由得目为之眩！",
    "$N含笑抱剑，气势庄严，$w轻挥，尽融「达摩剑」为一式，闲舒地刺向$n！",
    "$N举起$w运使「太极剑」剑意，划出大大小小无数个圆圈，无穷无尽源源不绝地缠向$n！",
    "$N神声凝重，$w上劈下切左右横扫，挟雷霆万钧之势逼往$n，「伏摩剑」的剑意表露无遗！",
    "却见$N突然虚步提腰，使出酷似武当「<BLU>蜻蜓点水</BLU>」的一招！",
    "$N运剑如风，剑光霍霍中反攻$n的$l，尝试逼$n自守，剑招似是伏魔剑的「<RED>龙吞式</RED>」。",
    "$N突然运剑如狂，一手关外的「<YEL>乱披风剑法</YEL>」，猛然向$n周身乱刺乱削！",
    "$N突然一剑点向$n的$l，虽一剑却暗藏无数后着，$n手足无措，不知如何是好！",
    "$N剑挟刀势，大开大阖地乱砍一通，但招招皆击在$n攻势的破绽，迫得$n不得不守！",
    "$N反手横剑刺向$n的$l，这似有招似无招的一剑，威力竟然奇大，$n难以看清剑招来势！",
    "$N举剑狂挥，迅速无比地点向$n的$l，却令人看不出其所用是什么招式。",
    "$N随手一剑指向$n，落点正是$n的破绽所在，端的是神妙无伦，不可思议！",
    "$N脸上突现笑容，似乎已看破$n的武功招式，胸有成竹地一剑刺向$n的$l！",
    "$N将$w随手一摆，但见$n自己向$w撞将上来，神剑之威，实人所难测！"

];
this.parry_actions = [
    "$n以攻为守，以进为退，凝神运气向$P猛攻快打地挥出方位大异的泰山「<MAG>快活三</MAG>」三剑。",
    "$n剑法突变，剑势伸缩不定，奔腾矫夭，逆使嵩山剑法的「<YEL>天外玉龙</YEL>」企图迫使$P变招。",
    "$n突然使出青城派松风剑法的「<RED>鸿飞冥冥</RED>」，可是方位却有所偏差，长剑对着$P一绞，企图突破$P的攻势！",
    "只见$n不退反进，身如飘风，诡异地一式「<HIW>天柱云气</HIW>」，动向无定不可捉摸地挡住了$P的进攻。",
    "$n不退反进，使出恒山剑招「<HIR>绵里藏针</HIR>」，森森剑气充溢四周！架开了$P的这招",
    "$n不闪不避，举剑闪电般使出「<BLU>叠翠浮青</BLU>」反削$P的$l。",
    "却见$n踏前一步，剑式斜指$N的右臂，想要使$N闪身而退。",
    "$n突然一剑点向$P的$l，虽一剑却暗藏无数后着，$P手足无措，慌忙撤手回防！",
    "$n挺剑一招象是「<HIW>白云出岫</HIW>」回刺$P的$l，企图将$P的攻势化解。"
];
this.desc = "为独孤求败所创，以无招胜有招的宗旨胜破天下武功。";

this.attack_actions2 = [
    "<hiw>但见$N手中$w破空长吟，平平一剑刺向$n，毫无招式可言</hiw>",
    "<hiw>$N揉身欺近，轻描淡写间随意刺出一剑，简单之极，无招无式</hiw>",
    "<hiw>$N身法飘逸，神态怡然，剑意藏于胸中，手中$w随意挥洒而出，独孤九剑已到了收发自如的境界</hiw>",
    "<hiw>$N满场游走，东刺一剑，西刺一剑，令$n莫明其妙，分不出$N剑法的虚实！</hiw>",
    "<hiw>$N抱剑旋身，转到$n身后，杂乱无章地向$n刺出一剑，不知使的是什么剑法！</hiw>"
];
this.query_attack_action = function (me) {
    if (me.query_temp("weapon")) {
        return this.attack_actions2.random();
    }
    return this.attack_actions.random();
}
//"\s?\+\s?(\w+)\s?\+\s?"(.+?)"\s?\+\s?NOR\s?\+\s?"
//<$1>$2</$1>
this.can_enables = ["sword", "parry"];
this.learn_condition = {
    max_mp: 10000,
    skill: {
        sword: 400
    }
};

this.query_prop = function (lv) {
    return {
        add_sh_per: 5 + parseInt(lv / 300)
    };
}
this.query_enable_prop = function (lv) {
    return {
        sword: {
            gj: lv * 2 + 10,
            gjsd: 200,
            bj_per: parseInt(lv / 500) + 2,
            mz: lv + 10
        },
        parry: {
            zj: lv * 2 + 10,
            fy: lv,
            desc: "招架敌人招式后立刻反击敌人"
        }
    };
}
this.parry_msg2 = [
    "<hir>$N趁机向前一剑刺向$n的$l，端的是神妙无伦，不可思议</hir>",
    "<hir>$n见招式被破，一时慌乱被$N趁虚欺上随手一剑刺向$p</hir>",
    "<hir>$N以攻为守，以进为退，挺剑一招象是「白云出岫」回刺$p的$l</hir>"
];
this.on_parry_over = function (me, target, par) {
    if (par.is_parry) {
        if (!me.query_temp("sk_dugu_parry")) {
            me.do_attack({
                target: target,
                attack_msg: this.parry_msg2.random(),
                gj: me.gj / 3 + me.random(me.gj / 3),
                mz: me.mz
            });
            me.end_attack(target);
            me.set_temp("sk_dugu_parry", 1, 7000);
        }
    }
}
this.pfm = {
    wu:
    {
        name: "无招",
        distime: 20000,
        enable_skill: "sword",
        mp: 20,
        release_time: 0,
        use: function (me, target, lv) {
            var time = lv * 10 + 5000;
            if (time > 15000) time = 15000;
            me.send_room("<him>$N凝神聚气，挥洒手中兵器，进入无招无我，剑心通明境界！\n</him>", target);
            me.add_status({
                id: "weapon",
                name: "无招",
                duration: time,
                prop: {
                    gjsd_per: 100,
                    gj: lv,
                    mz: lv
                }
            });
            me.set_temp("weapon", 1, time);
            me.reauto_attack();

        },
        query_desc: function (me, lv) {

            var time = lv * 10 + 5000;
            if (time > 15000) time = 15000;
            return "独孤九剑之无招胜有招，" + (time / 1000) + "秒内你的招式无迹可寻使敌人难以破解，出招速度加快到极限，增加" + lv + "攻击，" + lv + "命中。";
        }
    }, pojian:
    {
        name: "破字诀",
        distime: 10000,
        enable_skill: "parry",
        mp: 20,
        use: function (me, target, lv) {
            var weap = target.query_weapon();
            if (!weap || weap.weapon_type === WEAPON_TYPE.NONE) return me.notify("对方没有兵刃，你不用担心。");
            me.send_room("<HIC>$N举剑画弧，默潜独孤九剑之「破字诀」, 绵绵剑意，漫天铺地袭向$n</HIC>", target);

            if (lv * 2 + me.random(me.mz) > target.ds && (!target.attack_skill || target.attack_skill.id !== 'dugujiujian4')) {
                me.send_room("<hir>$n顿时觉得眼前一花，手腕一麻，手中$i脱手而出！\n</hir>", target);
                target.unequip(weap, true, 12000);
            } else {
                me.send_room("<cyn>可是$n看破了$N的剑路，抽身后退，使$N的「破字诀」没有起到作用。\n</cyn>", target);
            }
        },
        query_desc: function (me, lv) {

            return "独孤九剑之破字诀，卸下对方兵刃，技能等级越高成功率越高。";
        }
    }, poqi:
    {
        name: "破气诀",
        distime: 30000,
        enable_skill: "sword",
        mp: 20,
        use: function (me, target, lv) {
            var sh = me.do_attack({
                target: target,
                attack_msg: "<hib>$N施出独孤九剑「破气式」，手中$W中攻直进，遥指$n的气海要穴。</hib>",
                miss_msg: "<CYN>可$n深知$N这招的厉害，当即向后横移数尺，躲闪开来。</CYN>",
                no_parry: true,
                damaga_msg: "<hir>$n被$N一剑划过气门，登感一阵锥心的刺痛，全身真气源源而泻！</hir>"
            });
            if (sh) {
                target.add_mp(-lv * 10);
                var time = 3000 + lv * 5;
                if (time > 10000) time = 10000;
                target.add_status({
                    id: "busy",
                    is_busy: true,
                    name: "忙乱",
                    downside: true,
                    desc: "你处于忙乱状态，无法攻击，招架",
                    duration: time
                }, me);
            }
            me.end_attack(target);
        },
        query_desc: function (me, lv) {
            var time = 3000 + lv * 5;
            if (time > 10000) time = 10000;
            return "独孤九剑之破气式，精准攻击敌方气海要穴，无法招架，命中后减少敌人" + (lv * 10) + "的内力，并使敌人忙乱" + (time / 1000) + "秒。";
        }
    }
};