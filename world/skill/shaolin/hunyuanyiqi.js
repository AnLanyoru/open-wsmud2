this.inherits(SKILL);
this.name = "混元一气";
this.id = "hunyuanyiqi";
this.grade = 1;
this.force_rad = 0.55;
this.desc = "少林寺的内功心法";
this.family = FAMILIES.SHAOLIN;
//"(\w+)"(.+?)"NOR"
//<$1>$2</$1>
this.can_enables = ["force"];
this.learn_condition = {
    skill: {
        force: 50
    }
};

this.query_enable_prop = function (lv) {
    return {
        force: {
            max_hp: lv ,
            fy: lv + 5,
            limit_mp: lv * 20,
            desc: "唯一：将你内力的55%转化为气血"
        }
    };
}