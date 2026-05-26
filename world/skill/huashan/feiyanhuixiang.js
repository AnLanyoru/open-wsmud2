this.inherits(SKILL);
this.name = "飞燕回翔";
this.id = "feiyanhuixiang";
this.grade = 1;

this.family = FAMILIES.HUASHAN;
this.dodge_actions = [
     "但是$n身形飘忽，轻轻一纵，一招「乳燕投林」，举重若轻的避开这一击。",
    "$n身随意转，一式「雪花飞舞」，倏地往一旁飘开数尺，避过了这一招。",
    "可是$n侧身一让，使出「柳絮轻飘」，$N这一招扑了个空。",
    "却见$n足不点地，一招「腾云驾雾」，身形滴溜溜一转，往旁闪开数尺，躲了开去。",
    "$n左脚一点右脚背，身形往上一拔，一招「一鹤冲天」，轻轻巧巧地避开了这一招。"
];
this.desc = "华山派轻功身法，招式如飞燕般灵动不可捉摸。";
//"(\w+)"(.+?)"NOR"
//<$1>$2</$1>
this.can_enables = ["dodge"];
this.learn_condition = {
    max_mp: 500,
    skill: {
        dodge: 60
    }
};
this.query_enable_prop = function (lv) {
    return {
        dodge: {
            ds: lv + 5
        }
    };
}