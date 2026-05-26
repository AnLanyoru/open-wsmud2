this.inherits(SKILL);
this.name = "蛇岛奇功";
this.id = "shedaoqigong";
this.grade = 2
this.attack_actions = [
    "$N使一招「<HIC>仙鹤梳翎</HIC>」手中$w一提，插向$n的$l",
    "$N使出「<HIY>灵蛇出洞</HIY>」，身形微弓,手中$w倏的向$n的$l戳去",
    "$N身子微曲,左足反踢,乘势转身,使一招「<HIM>贵妃回眸</HIM>」，右手$w已戳向$n$l",
    "$N使一式「<HIY>飞燕回翔</HIY>」，背对着$n,右足一勾,顺势在$w上一点,$w陡然向自己咽喉疾射.接着$N身子往下一缩,$w掠过其咽喉,急奔$n急射而来",
    "$N忽的在地上一个筋斗,使一招「<HIW>小怜横陈</HIW>」,从$n胯下钻过,手中$w直击$n"
];
this.parry_actions = [
    "$n大吼一声，使一招「<HIR>子胥举鼎</HIR>」，反手擒拿$N极泉要穴,使$P这招落空",
    "$n双腿一缩,似欲跪拜,一招「<HIB>鲁达拨柳</HIB>」,$P的劲力登时落空",
    "$n突然一个倒翻筋斗,一招「<HIC>狄青降龙</HIC>」,双腿一分,跨在肩头,双掌直击$N，将$P的力道尽行碰了回去"
];
this.desc = "神龙岛绝技，论威力不在化骨绵掌之下，可做为杖法，招架使用";
//"(\w+)"(.+?)"NOR"
//<$1>$2</$1>
this.learn_condition = {
    max_mp: 300,
    skill: {
        force: 200,
        shenlongxinfa: 200
    }
}
this.can_enables = ["staff", "parry"];
this.query_enable_prop = function (lv) {
    return {

        staff: {
            gj: lv + 10,
            str: Math.round(lv / 6)
        },
        parry: {
            zj: lv + 10,
            mz: lv + 10
        }
    };
}
this.slots = [
    {
        prop: 'sdqg_hxf',
        value: (lv) => 10,
        count: 2,
        format: (val) => {
            return '吼仙法每层附加10%攻击力的伤害';
        },
    },
    {
        prop: 'sdqg_count',
        value: (lv) => 1,
        count: 3,
        format: (val) => {
            return '唱仙法可叠加层数+1';
        },
    },
];

this.pfm = {
    chang:
    {
        name: "唱仙法",
        distime: 3000,
        enable_skill: "parry",
        mp: 10,
        use: function (me, target, lv) {
            var add = parseInt(lv / 10) + 1;
            var time = 5000 + lv * 10;
            if (time > 20000) time = 20000;

            me.send_room("<hir>只听$N口中念念有词，顷刻之间内力大涨！</hir>");
            me.add_status({
                id: "parry",
                name: "唱仙法",
                duration: time,
                prop: {
                    gj: add,
                    fy: add,
                    mz: add,
                    ds: add,
                    zj: add
                },
                override: 1,
                max_count: 10 + me.query_prop('sdqg_count')
            });
        },
        query_desc: function (me, lv) {
            var add = parseInt(lv / 10) + 1;
            var time = 5000 + lv * 10;
            return "蛇岛奇功之唱仙法" + (time / 1000) + "秒增加你的攻击，防御，命中，躲闪，招架" + add + "，可叠加最多10层";
        }
    },
    hou:
    {
        name: "吼仙法",
        distime: 20000,
        enable_skill: "parry",
        mp: 10,
        use: function (me, target, lv) {
            var count = me.query_status("parry");
            if (!count) return me.notify_fail("<hic>你深深地吸一囗气，想吼一嗓子，结果又憋了回去。</hic>");
            let gj = me.gj * me.query_prop('sdqg_hxf') / 100;
            me.do_attack({
                target: target,
                gj: lv * count + gj,
                attack_msg: "<hiy>$N深深地吸一囗气，忽然仰天长啸，高声狂叫：不死神龙，唯我不败！</hiy>",
                damage_msg: "<hir>$n只觉脑中一阵剧痛，金星乱冒，犹如有万条金龙在眼前舞动。</hir>",
                dodge_msg: "<cyn>$n哈哈一笑，飘身跃开，让$N这一吼全然落空。</cyn>",
                no_parry: true
            });
            me.remove_status("parry", true);
            me.end_attack(target);
        },
        query_desc: function (me, lv) {


            return "蛇岛奇功之吼仙法，将你的唱仙法积累的力量一次性释放出去，每层造成" + lv + "伤害，无法招架";
        }
    }
};