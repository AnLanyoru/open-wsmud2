import { SKILL } from "../../../../core/skill/skill.js";
import type {
  PerformData,
  EnablePropMap,
} from "../../../../core/skill/skill.js";
import type {
  CHARACTER,
  CharacterStatus,
} from "../../../../core/char/character.js";

// ============================================================
// 葵花神功 — 公共绝世神功（轻功/内功双修）
// ============================================================

export default class extends SKILL {
  name = "葵花神功";
  id = "kuihuashengong";
  grade = 5;
  force_rad = 0.7;

  desc = "欲练神功，必先自宫，据说由前朝一位大太监所创，狠辣诡异。";
  can_enables = ["dodge", "force"];

  dodge_actions = [
    "$n身形如鬼魅般一飘，$N眼前一花，招式已失了准头。\n",
    "只见$n衣袂翻飞，身形化作一缕青烟，$N的攻势透影而过，尽数落空。\n",
    "$n不闪不避，身形却如镜花水月般飘忽不定，$N一击落空，心中骇然。\n",
  ];

  slots = [
    {
      prop: "khsg_gm",
      value: (_lv: number) => 2000,
      format: (val: number) => "鬼魅持续时间增加" + toSec(val) + "秒",
    },
  ];

  query_enable_prop(lv: number): EnablePropMap {
    return {
      force: {
        gj: lv * 2 + 100,
        mz: Math.floor(lv * 1.4) + 110,
        limit_mp: lv * 280,
        desc: "唯一：将你内力的70%转化为气血",
      },
      dodge: {
        ds: lv * 2 + 12,
        dex: Math.floor(lv * 0.2),
      },
    };
  }

  pfm_set: PerformData = {
    gui: {
      name: "鬼魅",
      distime: 30000,
      enable_skill: "dodge",
      mp: 20,
      release_time: 0,
      allow_busy: true,
      use: function (me: CHARACTER, target: CHARACTER, lv: number): void {
        const baseDuration = guimei_duration(lv);
        const extraDuration = me.query_prop("khsg_gm");
        const duration = baseDuration + extraDuration;

        // 清除自身所有负面状态
        me.clear_downside(true);

        me.send_room(
          "<hio>$N身形如鬼似魅，飘忽不定，刹那间化作一缕青烟，诸般束缚尽皆挣脱！</hio>",
          target,
        );

        me.add_status({
          id: "dodge",
          name: "鬼魅",
          duration: duration,
          ig_control: true,
          desc: "如鬼魅般飘忽不定，无视控制技能",
          finish_msg: "$N鬼魅般的身形缓缓凝实，不再飘忽难测。",
        });

        me.end_attack(target);
      },
      query_desc: function (_me: CHARACTER, lv: number): string {
        const duration = toSec(guimei_duration(lv));
        return (
          "如鬼魅般使敌人难以捕捉，飘忽不定，使用后清除自身的负面状态，在" +
          duration +
          "秒内无视控制技能，（忙乱可用）"
        );
      },
    },
  };
}

// ============================================================
// 葵花神功 — 公共计算函数
// ============================================================

/** 鬼魅持续时间（毫秒）：(floor(lv/100)+3) * 1000 */
function guimei_duration(lv: number): number {
  return (Math.floor(lv / 100) + 3) * 1000;
}
