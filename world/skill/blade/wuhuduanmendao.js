this.inherits(SKILL);
this.name = "五虎断门刀";
this.id = "wuhuduanmendao";
this.grade = 1;

this.attack_actions = [
    "$N手中$w斜指，一招「直来直去」，反身一顿，一刀向$n的$l撩去",
    "$N一招「童子挂画」，左右腿虚点，$w一提一收，平刃挥向$n的颈部",
    "$N展身虚步，提腰跃落，一招「推窗望月」，刀锋一卷，拦腰斩向$n",
    "$N一招「力劈华山」，$w大开大阖，自上而下划出一个闪电，直劈向$n",
    "$N手中$w一沉，一招「临溪观鱼」，双手持刃拦腰反切，砍向$n的胸口",
    "$N挥舞$w，使出一招「张弓望的」，上劈下撩，左挡右开，齐齐罩向$n",
    "$N一招「风送轻舟」，左脚跃步落地，$w顺势往前，挟风声劈向$n的$l",
    "$N盘身驻地，一招「川流不息」，挥出一片流光般的刀影，向$n的全身涌去",
    "$N右手后撤，手腕一翻，一招「壮士断腕」，顿时一道白光直斩向$n的手臂",
    "$N高高跃起，一招「人头落地」，手中$w直劈向$n的颈部",
    "$N贴地滑行，一招「断子绝孙」，手中$w直撩去$n的裆部"
];
this.desc = "江湖上挺常见的刀法武功，以招式狠辣出名。茅十八的成名绝技。";
//"\+(\w+)\+"(.+?)"\+NOR\+"
//<$1>$2</$1>
this.can_enables = ["blade"];
this.on_learn = function (me) {
    if (me.max_mp < 10)
        return me.notify_fail("你的内力不够。");
    if (me.query_skill("blade", 1) < 10)
        return me.notify_fail("你的基础不够，无法领会更高深的技巧。");
    return true;
}
this.query_enable_prop = function (lv) {
    return {
        blade: {
            gj: lv
        }
    };
}
this.slots = [
    {
        prop: 'whd_sh_max',
        value: (lv) => 20,
        format: (val) => {
            return '断字诀附加的伤害上限增加20%';
        }
    }
    , {
        prop: "whd_mz",
        value: lv => 100 + Math.floor(lv * lv / 1000),
        format: (val) => {
            return "断字诀的命中增加" + val;
        }
    }
];
this.pfm = {
    chan:
    {
        name: "断字诀",
        distime: 10000,
        enable_skill: "blade",
        weapon_type: WEAPON_TYPE.BLADE,
        mp: 20,
        use: function (me, target, lv) {
            var gj = parseInt(50 + lv / 5);
            let max = 300 + me.str + me.query_prop('whd_sh_max');
            if (gj > max) gj = max;

            gj = gj * me.gj / 100;
            var mz = me.mz + me.query_prop('whd_mz');

            me.send_room("<hiy>$N猛然伏地，使出五虎断门刀断字决，顿时一片白光直向前滚去！</hiy>", target);
            for (var i = 0; i < 3; i++) {
                me.do_attack({
                    target: target,
                    gj: gj,
                    mz: mz,
                    attack_before: "紧跟着"
                });
            }
            me.end_attack(target);
        },
        query_desc: function (me, lv) {

            var gj = parseInt(50 + lv / 5);
            let max = 300 + me.str + me.query_prop('whd_sh_max');
            if (gj > max) gj = max;

            return "欺身伏地，瞬间劈出三刀，每刀造成" + gj + "%自身攻击力的伤害";
        }
    }
};