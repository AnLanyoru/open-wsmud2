import { SKILL } from "../../../../core/skill/skill.js";
import type {
  PerformData,
  EnablePropMap,
} from "../../../../core/skill/skill.js";
import type {
  CHARACTER,
  DoAttackPar,
} from "../../../../core/char/character.js";

export default class extends SKILL {
  name = "五毒烟萝步";
  id = "wuduyanluobu";
  grade = 3;
  dodge_actions = [
    "$n足踏烟萝，身形如蛛丝般轻盈一荡，倏地飘出数尺，$N的招式堪堪落空。\n",
    "$n身如毒蛇吐信，腰肢诡异一扭，$N只觉眼前一花，攻势已失目标。\n",
    "$n袍袖轻挥，一缕淡紫毒烟弥漫开来，身形借雾隐去，$N顿时扑了个空。\n",
    "只见$n步法如蝎尾倒钩般诡异一转，整个人已闪至$N身侧，$N收招不及。\n",
    "$n身子忽地一矮，如蜈蚣百足贴地疾行，刹那间已掠出丈外，$N的攻击尽数落空。\n",
    "$n一式「烟萝化影」，身形如蟾蜍跳涧般倏起倏落，$N只见残影幢幢，不知$n真身何在。\n",
  ];
  can_enables = ["dodge"];
  learn_condition = {
    max_mp: 10000,
    skill: {
      dodge: 500,
    },
  };
  slots = [
    {
      prop: "wdylb_ds",
      value: (lv) => 100,
      format: (val) => {
        return "蛛丝缠步判定时的有效等级增加" + val;
      },
    },
    {
      prop: "wdylb_tm",
      value: (lv) => 1000,
      format: (val) => {
        return "蛛丝缠步成功后对方的忙乱时间+1秒";
      },
    },
  ];
  pfm_set: PerformData = {
    snake: {
      name: "蛛丝缠步",
      distime: 30000,
      enable_skill: "dodge",
      mp: 20,
      use: function (me: CHARACTER, target: CHARACTER, lv: number) {
        var time = 2000 + lv * 3;
        if (time > 10000) time = 10000;
        var msg =
          "<HIC>$N脚尖一旋踏碎漫山毒烟，身形如蛛绕藤斜滑而出，步步踏出螺旋轨迹，淡紫气丝随脚步纷飞织网，团团缠向$n！</HIC>\n";

        if (
          me.random(lv / 2) + lv + me.query_prop("wdylb_ds") >
          target.query_skill(target.dodge_skill.id, 0)
        ) {
          msg += "<hiy>$n不由得一阵手足无措，被$N连攻数招！\n</hiy>";
          target.add_status(
            {
              id: "busy",
              is_busy: true,
              duration: time + me.query_prop("wdylb_tm"),
              name: "忙乱",
              downside: true,
            },
            me,
          );
        } else {
          msg +=
            "<hir>可是$n以静制动，紧守门户，丝毫不受$N的影响,$N自己倒累的满头大汗！\n</hir>";
        }
        me.send_room(msg, target);
      },
      query_desc: function (me: CHARACTER, lv: number) {
        var time = 2000 + lv * 4;
        if (time > 10000) time = 10000;
        return "蛛丝缠步，烟萝化影，成功后使敌人忙乱" + time / 1000 + "秒。";
      },
    },
  };

  query_enable_prop(lv: number): EnablePropMap {
    return {
      dodge: {
        ds: parseInt(lv * 1.5) + 130,
        dex: parseInt(lv / 7),
      },
    };
  }
}
