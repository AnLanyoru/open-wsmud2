this.inherits(SKILL);
this.name = "碧波神功";
this.id = "biboshengong";
this.grade = 2;
this.force_rad = 0.7;
this.desc = "桃花岛的内功心法";
//"(\w+)"(.+?)"NOR"
//<$1>$2</$1>
this.can_enables = ["force"];
this.query_enable_prop = function (lv) {
    return {
        force: {
            max_hp: lv * 5,
            mz:lv,
            fy:lv,
            limit_mp: lv * 60,
            desc: "唯一：将你内力的70%转化为气血"
        }
    };
}
this.learn_condition = {
    max_mp: 2000,
    skill: {
        force: 200
    }
};