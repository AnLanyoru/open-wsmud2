import { SKILL, PERFORM } from "../../../core/skill/skill.js";
import { SKILL_TYPES } from "../../../core/const.js";
import { FAMILIES } from "../../../core/skill/family.js";
import type { PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
  name = "逐浪步";
  id = "zhulangbu";
  grade = 2;
  family = FAMILIES.WULANG;
  desc = "无浪门独门轻功，以观潮汐、仿浪态而成，步法如海浪起伏无定";
  can_enables = ["dodge"];

  dodge_actions = [
    "却见$n足下如踏浪尖，身形随波起伏，一招「逐浪随波」轻巧地避过了$N这一击。\n",
    "$n步法忽左忽右，仿若浪涌礁石般难以捉摸，使出一招「潮汐无定」，$N的攻势顿时落空。\n",
    "只见$n身形一矮，如退潮般倏然后撤，一招「落潮归海」已飘出丈外，躲开了$N的凌厉一击。\n",
    "$n双足交替点地，步法如涨潮般连绵不绝，一式「浪涌千层」让$N的攻击尽数擦身而过。\n",
    "但见$n身随步转，宛如浪花飞溅般向旁一闪，一招「惊涛拍岸」已然避过$N的杀招。\n",
    "$n脚尖轻点，身形如海面浮萍般飘忽不定，一式「浮萍逐浪」令$N的攻击失了准头。\n",
    "可是$n身形一晃，竟如浪中游鱼般滑不留手，一招「鱼跃潮头」将$N的攻势尽数化解。\n",
    "$n不待$N招式用老，步法如暗流涌动般悄然移位，一式「暗流潜涌」早已避开。\n",
  ];

  query_enable_prop(lv: number): EnablePropMap {
    return {
      dodge: {
        ds: Math.floor(lv * 1.1) + 200,
        dex: Math.floor(lv * 0.1) + 10,
      },
    };
  }

  pfm_set: PerformData = {
    nong: {
      name: "弄潮",
      distime: 35000,
      enable_skill: "dodge",
      mp: 20,
      release_time: 0,
      use: function (me: CHARACTER, target: CHARACTER, lv: number): void {
        const hasUp = !!me.query_status("chaoxi_up");
        const hasDown = !!me.query_status("chaoxi_down");

        if (!hasUp && !hasDown) {
          me.notify("你需要在潮汐诀的潮起或潮落效果期间才能使用弄潮。");
          return;
        }

        const layers = me.query_temp("chaoxi_layers", 0);
        if (layers <= 0) {
          me.notify("潮汐层数不足，无法施展弄潮。");
          return;
        }

        const duration = query_nong_duration(lv);
        const perBonus = query_nong_per(lv);

        if (hasUp) {
          const totalMz = perBonus * layers;
          me.send_room(
            "<hic>$N脚踏逐浪步，身形随潮汐起伏不定，借弄潮之势将攻势催至巅峰！</hic>",
            target,
          );
          me.add_status({
            id: "nongchao",
            name: "弄潮",
            desc: `弄潮之势`,
            duration: duration,
            prop: {
              mz: totalMz,
            },
            finish_msg: "$N的弄潮之势如落潮般渐归平静，命中恢复如常。",
          });
        } else {
          const totalDs = perBonus * layers;
          me.send_room(
            "<hic>$N脚踏逐浪步，身形随潮汐起伏不定，借弄潮之势将步法催至化境！</hic>",
            target,
          );
          me.add_status({
            id: "nongchao",
            name: "弄潮",
            desc: `弄潮之势`,
            duration: duration,
            prop: {
              ds: totalDs,
            },
            finish_msg: "$N的弄潮之势如落潮般渐归平静，躲闪恢复如常。",
          });
        }
      },
      query_desc: function (me: CHARACTER, lv: number): string {
        const duration = query_nong_duration(lv) / 1000;
        const per = query_nong_per(lv);
        return `在潮汐诀起效期间，${duration}秒内附加每层收益：潮起期间增加自身${per}命中，潮落期间增加自身${per}躲闪。`;
      },
    },
  };
}

/** 弄潮 — 持续时间（毫秒） */
function query_nong_duration(lv: number): number {
  return Math.min(30, 10 + Math.floor(lv / 100)) * 1000;
}

/** 弄潮 — 每层命中/躲闪加成 */
function query_nong_per(lv: number): number {
  return Math.floor(lv * 0.5) + 10;
}
