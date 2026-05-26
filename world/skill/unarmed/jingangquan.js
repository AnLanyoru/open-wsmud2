this.inherits(SKILL);
this.name = "大力金刚拳";
this.id = "jingangquan";
this.grade = 2;

this.family = FAMILIES.SHAOLIN;
this.attack_actions = [
    "$N盘膝而坐，二手合十，一式<HIC>「莲花座」</HIC>，双拳蓄势而发，击向$n的$l",
    "$N一式<HIR>「烈火锥」</HIR>，双掌轮流下击，拳势如焰，吡啪爆响",
    "$N腾空飞起，一式<HIG>「八方雨」</HIG>，双手双腿齐出，令$n无可躲藏",
    "$N双掌虚含，掌缘下沉，一式<HIM>「掌心雷」</HIM>，缓缓向$n推出",
    "$N一臂前伸，一臂后指，一式<HIB>「五指山」</HIB>，攻向$n的身前身后",
    "$N一式<HIW>「观音渡」</HIW>，两手十指虚点$n的全身三十六道要穴",
    "$N两目内视，双手内笼，一式<HIY>「天龙唱」</HIY>，四面八方响起震人心魄的龙吟",
    "$N似笑非笑，双拳无形无定，一式「如来笑」，骤然击向$n的前胸"
];
this.desc = "少林寺七十二绝技之大力金刚拳";
//"(\w+)"(.+?)"NOR"
//<$1>$2</$1>
this.can_enables = ["unarmed","parry"];
this.learn_condition = {
    max_mp: 1000,
    skill: {
        unarmed: 140
    }
};
this.query_enable_prop = function (lv) {
    return {
        unarmed: {
            gj: lv * 1 + 20,
            str:parseInt(lv/8)+1
        },
        parry: {
            zj: parseInt(lv * 1.2) + 20,
            fy: lv + 4
        }
    };
}
this.pfm = {
    zhen:
    {
        name: "怒目金刚",
        distime: 30000,
        enable_skill: "unarmed",
        weapon_type: WEAPON_TYPE.UNARMED,
        mp: 20,
        use: function (me, target, lv) {
            var gj = lv * 10 + 10000;

            me.add_status({
                id: "unarmed",
                name: "金刚",
                start_msg: "<hiy>$N大喝一声，全身肌肉鼓起，犹如怒目金刚，臂力陡然增加！</hiy>",
                desc: "大力金刚拳之怒目金刚，增加你的臂力",
                duration: gj,
                prop: {
                    str: parseInt(lv / 10 + 5)
                }
            });
        },
        query_desc: function (me, lv) {
            var gj = (lv * 10 + 10000)/1000;
            var dex = parseInt(lv / 10 + 5);
            return "大力金刚拳之怒目金刚，在"+gj+"秒内增加你"+dex+"臂力。";
        }
    }
};