this.inherits(SKILL);
this.name = "武当剑法";
this.id = "wudangjianfa";
this.grade = 1;

this.family = FAMILIES.WUDANG;
this.attack_actions = [
    "$N身体左转，左手剑指，两腿屈膝，右前臂内旋，剑尖前端一寸处短促抖腕发力，一招<HIB>「飞燕入林」</HIB>，手中$w轻轻颤动，一剑自上而下扎向$n的$l",
    "$N身形不动，右前臂外旋，剑刃上崩，立马左腿左弓步，一招<HIG>「青龙吐水」</HIG>，手中$w向前下反刺，一剑指向$n的$l",
    "$N左脚向前一步，蹬地跳起，身体腾空疾速左转，右手$w先向前刺，随转体变向，使出一式<MAG>「凤凰挚窝」</MAG>，剑光如匹练般泄向$n的$l",
    "$N碎步急进，提剑沿剑身方向疾速上崩，一招<HIW>「白蛇吐信」</HIW>直取$n的$l",
    "$N平剑斜洗，臂圆剑直，双脚交替弧形迈进，右手$w使出一式<HIC>「玉女穿梭」</HIC>，剑锋往来运转如梭，连绵不绝刺向$n的$l",
    "$N屈腕抬臂，剑由前向后上方抽带，挺起中平剑奋勇向前，右手$w使出一式<HIY>「仙人指路」</HIY>刺向$n的$l",
    "$N左撤步，抱剑当胸，挥剑做圆环形，正反搅动，右手$w一式<HIG>「怀中抱月」</HIG>，剑意圆润，刺向$n的$l",
    "$N侧身退步，左手剑指划转，腰部一扭，上体后仰，右手$w一记<HIM>「反身朝阳」</HIM>自下上撩指向$n的$l"

];
this.desc = "武当派的入门剑法";
//<$1>$2</$1>
//<$1>$2</$1>
this.can_enables = ["sword"];
this.learn_condition = {
    max_mp: 900,
    skill: {
        sword: 50
    }
};
this.query_enable_prop = function (lv) {
    return {
        sword: {
            gj: parseInt(lv + 10)
        }
    };
}
this.pfm = {
    san:
    {
        name: "三环套月",
        distime: 10000,
        enable_skill: "sword",
        mp: 10,
        use: function (me, target, lv) {
            var per = 70 + parseInt(lv / 10);
            me.send_room("<hiw>凝神聚气，手中$W回转，划出一个闪亮的剑圈，套向$n而去。</hiw>", target);
            for (var i = 0; i < 3; i++) {
                me.do_attack({
                    target: target,
                    gj: me.gj * per/100,
                    mz: me.mz ,
                    attack_before: "紧跟着"
                });
            }
            me.end_attack(target);

        },
        query_desc: function (me, lv) {
            var per = 70 + parseInt(lv /10);
           
            return "连环三剑，如柔丝缠身，连绵不绝，每剑对敌人造成" + per + "%的伤害。";
        }
    }
};