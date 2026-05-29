import { SKILL } from "../../../os/skill/skill.js";

export default function() {
    const SKILL_TYPES = globalThis.SKILL_TYPES; const WEAPON_TYPE = globalThis.WEAPON_TYPE;
this.inherits(SKILL);
this.id = "sword";
this.name = "基本剑法";
this.grade = 0;
this.type = SKILL_TYPES.BASE;
this.attack_actions = [
"$N用$W往$n的$l刺去", "$N用$W往$n的$l砍去", "$N挥动$W,斩向$n的$l"
];
this.set_default(this.id);
this.desc = "剑法类技能的基础功法，磨练你的技巧，坚持锻炼会增加你自身的命中";
this.set_pfm("lian", {
    name: "连击",
    distime: 5,
    mp: 5,
    weapon_type: WEAPON_TYPE.SWORD,
    use: function (me, target, lv) {
        var msg = "<hig>$N加快速度，手中的$W快速向$n刺去</hig>";
        me.send_room(msg, target);
        me.do_attack({
            target: target,
            gj: me.gj,
            mz: me.mz
        });
        me.do_attack({
            target: target,
            gj: me.gj,
            mz: me.mz
        });
        me.end_attack(target);
    }, query_desc: function (me, lv) {
        return "快速对敌人攻击两次";
    }
});
this.query_prop = function (lv) {
    return { mz: lv };
}
}
