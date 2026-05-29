import { SKILL } from "../../../os/skill/skill.js";

export default function() {
    const FAMILIES = globalThis.FAMILIES;
this.inherits(SKILL);
this.name = "踏雪寻梅";
this.id = "taxuexunmei";
this.grade = 3;
this.family = FAMILIES.SHASHOU;

this.dodge_actions = [
    "$n一式「华发寻春喜见梅」，身子掣忽一转，$N只觉的眼前一花，失去了目标。",
    "$n一式「一株临路雪倍堆」，双脚点地，身子突然拔高了丈许，缓缓飘落在$N身后。",
    "$n一式「凤城南陌他年忆」，身行一晃，顿时无数条身影一下子出现在$N的面前。",
    "$n一式「香杳难随驿使来」，飘然向后一退，躲开$N的凌厉攻势。"
];
this.desc = "踏雪寻梅是杀手楼一种特别厉害的上乘轻功，即使穿着铁鞋踩在雪上，也不会留下一点脚印。";
//"(\w+)"(.+?)"NOR"
//<$1>$2</$1>
this.can_enables = ["dodge"];
this.learn_condition = {
    max_mp: 1000,
    skill: {
        dodge: 200
    }
};
this.query_enable_prop = function (lv) {
    return {
        dodge: {
            ds: parseInt(lv * 1.4) + 200,
            mz: parseInt(lv * 1.4) + 200
        }
    };
}

this.pfm = {
    power:
        {
            name: "无痕",
            distime: 45000,
            enable_skill: "dodge",
            mp: 30,
            release_time: 0,
            no_auto: true,
            use: function (me, target, lv) {
                var gj = 3000 + lv*5;
                if (gj > 10000) gj = 10000;
                me.send_room("<hiw>$N身体急转，化为一道白光，虚幻不定的出现在$N的周围\n</hiw>", target);
                me.add_status({
                    id: "dodge",
                    name: "无痕",
                    desc: "你无法被控制",
                    duration: gj,
                    ig_control: gj
                });
            },
            query_desc: function (me, lv) {
                var gj = 3 + parseInt(lv / 200);
                if (gj > 10) gj = 10;
                return gj+"秒内免疫控制";
            }
        }
};
}
