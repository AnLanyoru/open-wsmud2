this.inherits(SKILL);
this.id = "unarmed";
this.name = "基本拳脚";
this.type = SKILL_TYPES.BASE;
this.grade = 0;
this.desc = "拳脚类武功的基础功法，坚持锻炼必成大器。每10级会增加1点后天臂力";
this.attack_actions = [
"$N挥拳攻击$n的$l", "$N往$n的$l一抓", "$N往$n的$l狠狠地踢了一脚",
"$N提起拳头往$n的$l捶去", "$N对准$n的$l用力挥出一拳"
];
this.set_default(this.id);

this.set_pfm("zhong", {
    name: "重击",
    distime: 5000,
    mp: 5,
    release_time:0,
    use: function(me, target, lv) {
        var msg = "<hig>$N看准时机，双拳蓄力对准$n的$l用力砸去</hig>";
        var gj = 10 + lv; 
        me.do_attack({
            target: target,
            gj: me.gj + gj,
            mz: me.mz,
            attack_msg:msg,
            no_weapon:true
        });
        me.end_attack(target);
    },
    query_desc: function (me, lv) {
        var gj = 10 + lv;
        return "强力的一击，对敌人造成基本攻击附加" + gj + "的伤害。";
    }
});
this.query_prop = lv => ({ str: parseInt(lv / 10) });