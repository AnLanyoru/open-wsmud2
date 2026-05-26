this.inherits(SKILL);
this.id = "blade";
this.name = "基本刀法";
this.type = SKILL_TYPES.BASE;
this.grade = 0;
this.desc = "刀法类武功的基础功法，坚持锻炼会使你的技巧熟练，增加自身的命中";
this.attack_actions = [
    "$N用$W往$n的$l刺去", "$N用$W往$n的$l砍去", "$N挥动$W,斩向$n的$l"
];
this.set_default(this.id);

this.set_pfm("zhan", {
    name: "斩击",
    distime: 5000,
    mp: 5,
    use: function (me, target, lv) {
        var msg = "<hic>$N看$n露出破绽，挥动$W斩向$n的$l</hic>";
        var gj = 10 + lv;
        me.do_attack({
            target:  target,
            gj:me.gj + gj,
            mz: me.mz,
            attack_msg:msg
        });
        me.end_attack(target);
    },
    query_desc: function (me, lv) {
        var gj = 10 + lv;
        return "强力的一击，对敌人造成基本攻击附加" + gj + "的伤害。";
    }
});
this.query_prop = function (lv) {
    return { mz: lv };
}