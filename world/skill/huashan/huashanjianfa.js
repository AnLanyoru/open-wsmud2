this.inherits(SKILL);
this.name = "华山剑法";
this.id = "huashanjianfa";
this.grade = 1;
this.is_public=true;
this.family = FAMILIES.HUASHAN;
this.attack_actions = [
    "$N一招「白云出岫」，手中$w点向$n的$l",
    "$N使出「有凤来仪」，$w闪烁不定，刺向$n的$l",
    "$N一招「天绅倒悬」，$w自上而下划出一个大弧，向$n劈砍下去",
    "$N向前跨上一步，手中$w使出「白虹贯日」直刺$n的$l",
    "$N手中的$w一晃，使出「苍松迎客」直刺$n的$l"

];
this.desc = "华山派的基础剑法";
//<$1>$2</$1>
//<$1>$2</$1>
this.can_enables = ["sword"];
this.learn_condition = {
    max_mp: 1000,
    skill: {
        sword: 50
    }
};

this.query_enable_prop = function(lv) {
    return {
        sword: {
            gj: lv + 10
        }
    };
}
this.pfm = {
    jiang:
    {
        name: "剑掌五连环",
        distime: 10000,
        enable_skill: "sword",
        mp: 20,
        release_time:10000,
        use: function(me, target, lv) {
            me.send_room("<CYN>$N使出华山派绝技「剑掌五连环」，身法陡然加快！</CYN>", target);
            var count = 5;
            for (var i = 0; i < count; i++) {
                me.do_attack({
                    target: target,
                    gj: me.gj,
                    mz: me.mz,
                    attack_before: "紧跟着"
                });
            }
            me.end_attack(target);
        },
        query_desc: function(me, lv) {
         
            return "华山剑法之剑掌五连环，瞬间出招5次，收招较慢。";
        }
    }
};