import { EQUIPMENT } from "../../../../core/item/equipment.js";
import { PfmFlag, EQUIP_TYPE } from "../../../../core/const.js";
import type { CHARACTER } from "../../../../core/char/character.js";
import { PfmFlagType } from "../../../../types/events.js";
import type { PERFORM } from "../../../../core/skill/skill.js";
import type { PropMap } from "../../../../types/props.js";

export default class extends EQUIPMENT {
    unit = "方";
    name = "崆峒印";
    desc = "东海氐人国世代守护的上古神器；印身雕刻五方天帝，玉龙盘绕其上";
    value = 5000000;
    grade = 6;
    eq_type = EQUIP_TYPE.JEWELS;
    distime = 600000;
    prop: PropMap = {
        gj_per: 10,
        mz_per: 10,
        str: 300,
        diff_fy_per: 10,
        desc: "激活后可以镇压敌人的下个绝招60秒，无法抵抗，冷却时间600秒"
    };

    on_use(me: CHARACTER): boolean {
        const target = me.query_enemy();
        if (!target) {
            me.notify("你现在没有战斗目标，无法使用崆峒印。");
            return false;
        }
        if (target.hp <= 0) {
            me.notify("目标已经死亡，无法使用崆峒印。");
            return false;
        }

        me.send_room("<hiw>$N指尖灵光一引，怀中崆峒印腾空而起，玉龙缠绕印身盘旋轰鸣，印面五方天帝神像尽数苏醒，金辉如烈日炸开，万古人皇威压铺天盖地压向$n的周身经脉！</hiw>\n", target);
        target.notify("<hiw>" + me.name + "祭出崆峒印，你顿感周身经脉被一股强大的力量镇压，全身真气沉重无匹！</hiw>");

        target.add_status({
            id: "kongtong",
            name: "镇压",
            desc: "你被崆峒印镇压，无法释放绝招",
            duration: 60000,
            downside: false,
            on_pfm: this.on_pfm
        }, me);

        return true;
    };
    on_pfm(me: CHARACTER, _tg: CHARACTER, pfm: PERFORM, _lv: number, _sk: string): PfmFlagType {
        let flag = 0
        const pfm_name = pfm.query_name()
        me.send_room("<hiw>$N欲施展"+ pfm_name +"，却感全身经脉如有石塞，经脉逆流，反致"+ pfm_name + "再难施展！</hiw>");
        const key = "dt/" + pfm.origin_skill + "/" + pfm.pid;
        me.set_temp(key, 60000, 60000)
        flag |= PfmFlag.NO_USE
        flag |= PfmFlag.EXPEND_STATU
        return flag
    };
}
