this.inherits(SKILL);
this.name = "密宗大手印";
this.id = "dashouyin";
this.grade = 1;

this.attack_actions = [
    "$N使出一招<HIC>「莲花合掌印」</HIC>，双掌合十，直直撞向$n的前胸",
    "$N使出一招<HIW>「合掌观音印」</HIW>，飞身跃起，双手如勾，抓向$n的$l",
    "$N使出一招<HIY>「准提佛母印」</HIY>，运力于指，直取$n的$l",
    "$N使出一招<HIR>「红阎婆罗印」</HIR>，怒吼一声，一掌当头拍向$n的$l",
    "$N使出一招<HIG>「药师佛根本印」</HIG>，猛冲向前，掌如游龙般攻向$n",
    "$N使出一招<HIM>「威德金刚印」</HIM>，伏身疾进，双掌自下扫向$n的$l",
    "$N使出一招<HIB>「上乐金刚印」</HIB>，飞身横跃，双掌前后击出，抓向$n的咽喉",
    "$N使出一招<HIW>「六臂智慧印」</HIW>，顿时劲气弥漫，天空中出现无数掌影打向$n的$l"
];
this.desc = "密宗大手印，需要密宗心法支持。";
//"(\w+)"(.+?)"NOR"
//<$1>$2</$1>
this.can_enables = ["unarmed"];
this.learn_condition = {
    max_mp: 500,
    skill: {
        unarmed: 50
    }
};
this.query_enable_prop = function (lv) {
    return {
        unarmed: {
            gj: lv * 1 + 20
        }
    };
}

this.slots = [
    {
        prop: 'dsy_sh1',
        value: (lv) => 1,
        count: 2,
        format: (val) => {
            return '金刚印每10级密宗大手印附加1%攻击力伤害';
        },
    },
    {
        prop: 'dsy_sh2',
        value: (lv) => 1,
        count: 2,
        format: (val) => {
            return '金刚印每10级密宗心法附加1%攻击力伤害';
        },
    },
];
this.pfm = {
    zhen:
    {
        name: "金刚印",
        distime: 16000,
        enable_skill: "unarmed",
        weapon_type: WEAPON_TYPE.UNARMED,
        mp: 20,
        use: function (me, target, lv) {
            var lv2 = me.query_skill("mizongxinfa", 0);
            var gj = lv + lv2;
            let per = me.query_prop('dsy_sh1');
            if (per > 0) {
                if (per > 2) per = 2;
                gj = gj + me.gj * lv * per / 1000;
            }
            per = me.query_prop('dsy_sh2');
            if (per > 0) {
                if (per > 2) per = 2;
                gj = gj + me.gj * lv2 * per / 1000;
            }

            me.do_attack({
                target: target,
                gj: me.gj + gj,
                mz: me.mz,
                attack_msg: "<HIY>面容庄重，单手携着劲风朝$n猛然拍出，正是密宗绝学「金刚印」</hiy>",
                damage_msg: "<HIR>结果$p招架不及，被$P这一下打得七窍生烟，吐血连连。</hir>",
                miss_msg: "<cyn>可是$p不慌不忙，一闪身躲开了$P的金刚印。</cyn>",
                parry_msg: "<cyn>可是$p不慌不忙，巧妙的架开了$P的金刚印。</cyn>",
                no_weapon: true
            });
            me.end_attack(target);
        },
        query_desc: function (me, lv) {
            var gj = lv + me.query_skill("mizongxinfa", 0);
            return "默运密宗心法，双手结印，对敌人造成自身攻击力附加" + gj + "(密宗大手印等级+密宗心法等级)的伤害。";
        }
    }
};