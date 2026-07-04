import {SKILL} from "../../../../core/skill/skill.js";
import type { EnablePropMap } from "../../../../core/skill/skill.js";

// ============================================================
// 摘星功 — 星宿派高级轻功
// ============================================================

export default class extends SKILL {
    name = "摘星功";
    id = "zhaixinggong";
    grade = 2;

    desc = "星宿派的轻功身法，步法诡异阴柔，飘飘然有出尘之姿，练至深处可凌虚摘星。";
    can_enables = ["dodge"];
    dodge_actions = [
        "$n阴笑一声，身形如鬼魅般飘忽不定，脚下无声无息地滑开数尺。",
        "只见$n袍袖一拂，身形陡然拔起，如大蝙蝠般凌空翻转，轻轻巧巧地落在了丈外。",
        "$n足不点地，整个人如一片枯叶般随风飘荡，$N的攻势尽数落空。",
        "$n手腕轻翻，身形借势一转，竟如毒蛇般从$N的招式间隙间滑了出去。",
        "却见$n身形微晃，整个人仿佛化作一缕青烟，倏忽间已在数尺之外。",
        "$n脚尖在地上轻轻一点，身形如纸鸢般向后飘飞，姿态说不出的诡异阴森。",
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            dodge: {
                ds: 100 + Math.floor(lv * 17 / 10),
                dex: 10 + Math.floor(lv / 4),
            },
        };
    }
}
