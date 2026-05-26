
this.inherits(SKILL);
this.id = "dodge";
this.name = "基本轻功";
this.grade = 0;
this.desc = "轻功的基础功法，坚持锻炼会身轻如燕。每10级增加1点后天身法";
this.type = SKILL_TYPES.BASE;
this.dodge_actions = ["但是和$p$l偏了几寸。",
        "但是被$p机灵地躲开了。",
        "但是$n身子一侧，闪了开去。",
        "但是被$p及时避开。",
        "但是$n已有准备，不慌不忙的躲开。"];

this.set_default(this.id);
this.query_prop = lv => ({ dex: parseInt(lv / 10) });