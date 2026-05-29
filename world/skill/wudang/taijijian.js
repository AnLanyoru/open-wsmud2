import { SKILL } from "../../../os/skill/skill.js";

export default function() {
    const FAMILIES = globalThis.FAMILIES; const WEAPON_TYPE = globalThis.WEAPON_TYPE;
this.inherits(SKILL);
this.name = "太极剑法";
this.id = "taijijian";
this.grade = 4;
this.first_title = "太极传人";
this.family = FAMILIES.WUDANG;
this.attack_actions = [
    "$N虚步提腰，一招「<HIM>蜻蜓点水</HIM>」，手中$w轻轻颤动，一剑剑点向$n的$l",
    "$N向前跨上一步，左手剑诀，右手$w使出一式「<YEL>指南针</YEL>」直刺$n的$l",
    "$N身形往右一挫，左手剑诀，右手$w使出一式「<WHT>大魁星</WHT>」刺向$n的$l",
    "$N双膝下沉，右手$w使出一式「<BLU>探海式</BLU>」，由下而上疾刺$n的$l",
    "$N一招「<HIW>燕子掠波</HIW>」，$w自上而下划出一个大弧，平平地向$n的$l挥去",
    "$N上身往左侧一拧，一招「<BLK>乌龙摆尾</BLK>」，右手$w反手向$n的$l挥去",
    "$N一招「<RED>右</RED>拦扫」，一招「<RED>左</RED>拦扫」，剑锋平指，一气呵成横扫$n的$l",
    "$N左腿提膝，手中$w斜指，一招「<HIC>宿鸟投林</HIC>」刺向$n的$l",
    "$N一招「<CYN>青龙出水</CYN>」，$w自下而上划出一个大弧，平平地挥向$n的$l",
    "$N使出「<RED>三</RED>环套<HIW>月</HIW>」，$w划出三个圆圈，剑锋直出，绵绵不断划向$n的$l",
    "$N一招「<MAG>风卷荷叶</MAG>」，$w轻灵地划出几个圆弧，迅速地向$n的$l挥去",
    "$N一招「<YEL>虎抱头</YEL>」，$w划出一个左低右高的大弧，斜斜地斩向$n的$l",
    "$N使出「<HIR>狮子摇头</HIR>」，$w由右向左划出一个大８字，将$n圈在其中",
    "$N左脚踏实，右脚虚点，一招「<HIW>仙人指路</HIW>」，右手$w带着一团剑花，逼向$n的$l",
    "$N轻轻跃起，一招「<CYN>野马跳涧</CYN>」，$w在半空中化为一圈银芒，落向$n的$l",
    "$N两腿前箭后弓，一招「<HIR>射雁式</HIR>」，右手$w直刺$n的$l",
    "$N一招「<WHT>小魁星</WHT>」，身形往左一挫，左手剑诀，右手$w平平地向$n的$l挥去",
    "$N猱身扑上，一招「<HIW>白猿献果</HIW>」，手中$w斜斜地向$n的$l挥去",
    "$N一招「<RED>迎风掸尘</RED>」，$w看似随意地一挥，$n却陡觉一股劲气迎面袭来。",
    "$N一招「<YEL>顺水推舟</YEL>」，$w自上而下划出一个大弧，平平地向$n的$l挥去。",
    "$N一招「<WHT>流星赶月</WHT>」，$w疾刺$n的$l",
    "$N突然盘蹲下身来，一招「<BLU>海底捞月</BLU>」，$w自下而上地向$n的$l挥去",
    "$N一招「<HIG>挑帘式</HIG>」，$w自下而上徐徐划出一个大弧，平平地向$n的$l挥去",
    "$N一招「<YEL>黄蜂入洞</YEL>」，$w自上而下划出一个大弧，平平地向$n的$l挥去",
    "$N一招「<WHT>大鹏展翅</WHT>」，身形跃起，右手$w刺向$n的$l",
    "$N一招「<BLK>车轮剑</BLK>」，$w化作一片银盘，平平地向$n的$l卷去",
    "$N左脚轻点地面，身形往前一扑，一招「<BLU>天马行空</BLU>」，$w向$n的$l挥去",
    "$N一招「<WHT>风扫梅花</WHT>」，身体跃在半空，手中$w扫向$n的$l",
    "$N一招「<HIC>却步抽剑</HIC>」，左脚跃步落地，$w回抽，反手勾向$n的$l",
    "$N右腿半屈般蹲，一招「<WHT>如封似闭</WHT>」，剑尖虚指，转身撩向$n的$l",

    "$N回身拧腰，右手虚抱，一招「<HIY>拨云瞻日</HIY>」，$w中宫直进，刺向$n的$l"

];
this.desc = "由武当祖师张三丰所创，武当派不传之秘，太极三绝技之一";
//"\+(\w+)\+"(.+?)"\+NOR\+"
//<$1>$2</$1>
this.learn_condition = {
    max_mp: 8900,
    skill: {
        sword: 300,
        taijishengong: 300
    }
};
this.can_enables = ["sword"];
this.query_prop = function (lv) {
    return {
        int: 10 + parseInt(lv / 10),
        zj_per: parseInt(lv / 300) + 5
    };
}
this.query_enable_prop = function (lv) {
    return {
        sword: {
            gj: 20 + parseInt(lv * 1.3),
            mz: 20 + parseInt(lv * 1.2),
            zj: 20 + parseInt(lv * 0.8),
            desc: "攻击命中后会使敌方忙乱2秒，冷却10秒"
        }
    };
}
//当一次攻击结束后
this.on_attack_over = function (me, target, par) {
    if (!par.is_dodge && !par.is_parry) {
        if (!me.query_temp("sk/taijijian/sword")) {
            me.send_room("<cyn>$n一招失势被$N的剑招所乱！</cyn>", target);
            target.add_status({
                id: "busy",
                is_busy: true,
                name: "忙乱",
                desc: "你处于忙乱状态，无法攻击，招架",
                duration: 2000,
                downside: true

            });
            me.set_temp("sk/taijijian/sword", 1, 10000);
        }
    }
}
this.pfm = {
    chan:
    {
        name: "缠字诀",
        distime: 20000,
        enable_skill: "sword",
        weapon_type: WEAPON_TYPE.SWORD,
        release_time: 0,
        mp: 10,
        use: function (me, target, lv) {
            var time = lv * 10 + 3000;
            if (time > 15000) time = 15000;
            me.send_room("<mag>$N使出太极剑【缠字决】，$n一时之间手忙脚乱，无法攻击</mag>", target);
            target.add_status({
                id: "busy",
                name: "忙乱",
                duration: time,
                downside: true,
                is_busy: true
            }, me);
        },
        query_desc: function (me, lv) {
            var time = lv * 10 + 3000;
            if (time > 15000) time = 15000;

            return "以连绵不绝的攻势迷惑敌人，使之无法脱身，" + (time / 1000) + "秒内处于忙乱状态。";
        }
    },
    lian:
    {
        name: "连字诀",
        distime: 15000,
        enable_skill: "sword",
        weapon_type: WEAPON_TYPE.SWORD,
        mp: 10,
        use: function (me, target, lv) {
            var per = parseInt(lv / 10) + 110;
            if (per > 200) per = 200;
            me.send_room("<mag>$N使出太极剑【连字决】，身法突然加快</mag>", target);

            for (var i = 0; i < 7; i++) {
                me.do_attack({
                    target: target,
                    gj: me.gj,
                    mz: me.mz * per / 100,
                    attack_before: "紧跟着"
                });
            }
            me.end_attack(target);
        },
        query_desc: function (me, lv) {
            var count = parseInt(lv / 10) + 10;
            if (count > 100) count = 100;
            return "快速出剑，瞬间对敌人快速攻击7次，攻击中命中增加" + count + "%";
        }
    },
    sui:
    {
        name: "随字决",
        distime: 20000,
        enable_skill: "sword",
        weapon_type: WEAPON_TYPE.SWORD,
        mp: 10,
        release_time: 1000,
        use: function (me, target, lv) {
            var time = 3000 + lv * 10;
            var gj = 100 + parseInt(lv / 5);
            var per = 10 + parseInt(lv / 200);
            if (me.do_attack({
                target: target,
                gj: me.gj * gj / 100,
                mz: me.mz,
                attack_msg: "<him>$N快速挥动$W，四周真气涌动化为数个大小太极，向$n刺去</him>",
                damage_msg: "<hir>只见$n被剑气击中，真气紊乱，感觉眼前的景物似幻似真，几乎要站立不住</hir>"
            })) {
                target.add_status({
                    id: "sui",
                    name: "太极",
                    downside: true,
                    desc: "你的命中和躲闪降低了",
                    duration: time,
                    prop: {
                        mz_per: -per,
                        ds_per: -per
                    },
                    finish_msg: "<cyn>$N从太极剑的影响中恢复过来。</cyn>",
                }, me);
                me.end_attack(target);
            }

        },
        query_desc: function (me, lv) {
            var time = 3000 + lv * 10;
            var gj = 100 + parseInt(lv / 5);
            var per = 10 + parseInt(lv / 200);
            return "造成" + gj + "%攻击力的伤害，命中后使对方在" + (time / 1000) + "秒内降低" + per + "%命中和躲闪";
        }
    }
};
}
