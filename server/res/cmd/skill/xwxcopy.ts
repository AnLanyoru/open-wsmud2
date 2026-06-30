import {COMMAND} from "../../../core/command.js";
import {SKILL} from "../../../core/skill/skill.js";
import type { USER } from "../../../core/char/user.js";

export default class extends COMMAND {
    command = "xwxcopy";
    regex = /^(\w+)$/;
    allow_fight = true;

    /**
     * 将无相模仿的绝招保存到指定装备部位
     * @param me - 执行命令的角色
     * @param bodyPart - 装备部位（如 sword, unarmed）
     */
    enter(me: USER, bodyPart: string) {
        const data: string = me.query_temp('copy_pfm', String(''));
        if (!data) return false;

        const str: string[] = data.split("/");
        const spSkill = SKILL.get(str[0]);
        if (!spSkill) return me.notify("模仿数据异常，请重新模仿。");

        const pfm = spSkill.get_pfm(str[1]);
        if (!pfm) return me.notify("模仿数据异常，请重新模仿。");

        if (pfm.enable_skill !== bodyPart) return false;

        const baseSkill = me.skills.get(bodyPart);
        if (!baseSkill) return me.notify("你还不会这个绝招对应的基本技能。");

        me.set_temp("cp2_pfm_" + bodyPart, data);
        me.remove_temp('copy_pfm');
        me.notify("你的【无我】绝招更新了。");
    }
}
