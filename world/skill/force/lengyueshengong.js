this.inherits(SKILL);
this.name = "冷月神功";
this.id = "lengyueshengong";
this.grade = 1;
this.force_rad = 0.6;
this.desc = "关外胡家的内功心法";
//"(\w+)"(.+?)"NOR"
//<$1>$2</$1>
this.can_enables = ["force"];
this.learn_condition = {
    max_mp:200,
    skill: {
        force: 50
    }
};

this.query_enable_prop = function (lv) {
    return {
        force: {
            max_hp: lv * 5,
            limit_mp: lv * 20,
            desc: "唯一：将你内力的60%转化为气血"
        }
    };
}