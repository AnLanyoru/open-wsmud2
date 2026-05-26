this.inherits(SKILL);
this.name = "杀手心法";
this.id = "shashouxinfa";
this.grade = 1;
this.force_rad = 0.55;
this.desc = "杀手楼的入门心法";
this.family = FAMILIES.SHASHOU;
//"(\w+)"(.+?)"NOR"
//<$1>$2</$1>
this.can_enables = ["force"];
this.query_enable_prop = function (lv) {
    return {
        force: {
            gj: 1 + lv,
            limit_mp: lv * 10,
            desc: "唯一：将你内力的55%转化为气血"
        }
    };
}
this.learn_condition = {
    skill: {
        force: 50
    }
};