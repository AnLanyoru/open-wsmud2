this.inherits(SKILL);
this.name = "华山心法";
this.id = "huashanxinfa";
this.grade = 1;
this.force_rad = 0.5;
this.desc = "华山派的入门心法";
this.family = FAMILIES.HUASHAN;
//"(\w+)"(.+?)"NOR"
//<$1>$2</$1>
this.can_enables = ["force"];
this.query_enable_prop = function (lv) {
    return {
        force: {
            max_hp: lv,
            limit_mp: lv * 10,
            desc: "唯一：将你内力的50%转化为气血"
        }
    };
}
this.learn_condition = {
    skill: {
        force: 50
    }
};