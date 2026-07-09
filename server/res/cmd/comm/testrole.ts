import { COMMAND } from "../../../core/command.js";
import { WORLD } from "../../../core/world.js";
import { UTIL } from "../../../core/util/util.js";
import { EQUIP_TYPE, WEAPON_TYPE, BASE_SKILLS } from "../../../core/const.js";
import type { USER } from "../../../core/char/user.js";
import { SkillsMap } from "../../../core/char/skills_map.js";

/**
 * testrole — 负载测试专用建角命令
 *
 * 用法: testrole [门派编号] [武器类型] [名字]
 *   门派编号: 1=武当 2=少林 3=华山 4=丐帮 5=峨眉 6=逍遥 7=杀手 8=六扇 9=五狼
 *   武器类型: sword blade staff club whip unarmed(默认sword)
 *   名字: 2-5个汉字(默认"测试侠N")
 *
 * 创建角色后自动获得:
 *   - 武帝等级(level=5), 大量经验
 *   - 紫/红技能全套(内功/轻功/招架/武器技能)
 *   - 门派技能
 *   - 全身高级装备(lv5-6)
 */
export default class TestRoleCommand extends COMMAND {
  command = "testrole";
  allow_login = true;

  // 门派映射
  static FAMILY_MAP: Record<string, string> = {
    "1": "wudang",
    "2": "shaolin",
    "3": "huashan",
    "4": "gaibang",
    "5": "emei",
    "6": "xiaoyao",
    "7": "shashou",
    "8": "liushan",
    "9": "wulang",
  };

  // 门派编号 → 门派路径
  static FAMILY_PATH: Record<string, string> = {
    "1": "wudang",
    "2": "shaolin",
    "3": "huashan",
    "4": "gaibang",
    "5": "emei",
    "6": "xiaoyao",
    "7": "shashou",
    "8": "liushan",
    "9": "wulang",
  };

  // 高级技能搭配(紫grade5/红grade6)
  static SKILL_SETS: Record<string, Record<string, [string, string[]]>> = {
    // [技能ID, 启用到的基本技能]
    force: {
      "5": ["bahuanggong", ["force"]],
      "6": ["changshengjue", ["force"]],
    },
    dodge: {
      "5": ["kuihuashengong", ["dodge"]],
      "6": ["kuihuashengong", ["dodge"]], // 轻功没有红技能，用紫的
    },
    parry: {
      "5": ["douzhuanxingyi", ["parry"]],
      "6": ["douzhuanxingyi", ["parry"]], // 招架没有红技能
    },
    sword: {
      "5": ["yujianshu", ["sword"]],
      "6": ["fuyujianfa", ["sword"]],
    },
    blade: {
      "5": ["xuedao", ["blade"]],
      "6": ["xiuluodao", ["blade"]],
    },
    unarmed: {
      "5": ["anranxiaohun", ["unarmed"]],
      "6": ["tianmoce", ["unarmed"]],
    },
    staff: {
      "5": ["fumozhang", ["staff"]],
      "6": ["fumozhang", ["staff"]], // 杖法没有红技能
    },
    club: {
      "5": ["fumozhang", ["club"]], // 用杖法代替
      "6": ["fumozhang", ["club"]],
    },
    whip: {
      "5": ["kuihuashengong", ["whip"]], // 鞭法缺高级，用轻功代
      "6": ["kuihuashengong", ["whip"]],
    },
    throwing: {
      "5": ["qiankunyizhi", ["throwing"]],
      "6": ["qiankunyizhi", ["throwing"]],
    },
  };

  // 门派技能列表(取前几个作为门派基础)
  static FAMILY_SKILLS: Record<string, string[]> = {
    wudang: ["taijishengong", "tiyunzong", "taijijian"],
    shaolin: ["yijinjing", "shaolinshenfa", "damojian"],
    huashan: ["zixiashengong", "feiyanhuixiang", "dugujiujian"],
    gaibang: ["huntianqigong", "feiyanzoubi", "xianglongzhang"],
    emei: ["emeixinxfa", "zhutianbu", "jiuyinbaiguzhao"],
    xiaoyao: ["beimingshengong", "lingboweibu", "liuyangzhang"],
    shashou: ["shashengjue", "taxuexunmei", "chuanxinzhang"],
    liushan: ["tiangangzhengqi", "qianlizhuifeng", "feilongshou"],
    wulang: ["chaoxijue", "zhulangbu", "taigonggunfa"],
  };

  // 高级装备路径(按装备槽位)
  static EQUIP_SETS: Record<string, [number, string][]> = {
    sword: [
      [EQUIP_TYPE.WEAPON, "eq/lv6/xuanyuanjian"],
      [EQUIP_TYPE.CLOTH, "eq/lv6/jinlanjiasha"],
      [EQUIP_TYPE.SHOES, "eq/lv6/nvwashi"],
      [EQUIP_TYPE.HEAD, "eq/lv6/xiantiantaijitu"],
      [EQUIP_TYPE.RING, "eq/lv6/qibaozhihuan"],
      [EQUIP_TYPE.NECKLACE, "eq/lv6/kongtongyin"],
      [EQUIP_TYPE.JEWELS, "eq/lv6/xuanji"],
    ],
    blade: [
      [EQUIP_TYPE.WEAPON, "eq/lv6/yingdao"],
      [EQUIP_TYPE.CLOTH, "eq/lv6/jinlanjiasha"],
      [EQUIP_TYPE.SHOES, "eq/lv6/nvwashi"],
      [EQUIP_TYPE.HEAD, "eq/lv6/xiantiantaijitu"],
      [EQUIP_TYPE.RING, "eq/lv6/qibaozhihuan"],
      [EQUIP_TYPE.NECKLACE, "eq/lv6/kongtongyin"],
      [EQUIP_TYPE.JEWELS, "eq/lv6/xuanji"],
    ],
    unarmed: [
      [EQUIP_TYPE.WEAPON, "eq/lv5/tulongdao"], // 空手用武器也行
      [EQUIP_TYPE.CLOTH, "eq/lv6/jinlanjiasha"],
      [EQUIP_TYPE.SHOES, "eq/lv6/nvwashi"],
      [EQUIP_TYPE.HEAD, "eq/lv6/xiantiantaijitu"],
      [EQUIP_TYPE.RING, "eq/lv6/qibaozhihuan"],
      [EQUIP_TYPE.NECKLACE, "eq/lv6/kongtongyin"],
      [EQUIP_TYPE.JEWELS, "eq/lv6/xuanji"],
    ],
    staff: [
      [EQUIP_TYPE.WEAPON, "eq/lv5/jingangfumozhang"],
      [EQUIP_TYPE.CLOTH, "eq/lv6/jinlanjiasha"],
      [EQUIP_TYPE.SHOES, "eq/lv6/nvwashi"],
      [EQUIP_TYPE.HEAD, "eq/lv6/xiantiantaijitu"],
      [EQUIP_TYPE.RING, "eq/lv6/qibaozhihuan"],
      [EQUIP_TYPE.NECKLACE, "eq/lv6/kongtongyin"],
      [EQUIP_TYPE.JEWELS, "eq/lv6/xuanji"],
    ],
    _default: [
      [EQUIP_TYPE.WEAPON, "eq/lv6/xuanyuanjian"],
      [EQUIP_TYPE.CLOTH, "eq/lv6/jinlanjiasha"],
      [EQUIP_TYPE.SHOES, "eq/lv6/nvwashi"],
      [EQUIP_TYPE.HEAD, "eq/lv6/xiantiantaijitu"],
      [EQUIP_TYPE.RING, "eq/lv6/qibaozhihuan"],
      [EQUIP_TYPE.NECKLACE, "eq/lv6/kongtongyin"],
      [EQUIP_TYPE.JEWELS, "eq/lv6/xuanji"],
    ],
  };

  // 角色计数器(用于默认名字)
  static counter = 0;

  enter(me: USER, par: string) {
    // 已有角色不能重复创建
    if (me.id)
      return me.send('{"type":"regist","result":"你已经有一个角色了"}');

    const parts = par.split(" ").filter(Boolean);
    const familyKey = parts[0] || "3"; // 默认华山
    const weaponType = parts[1] || "sword";
    const customName = parts[2] || "";

    const cls = this.constructor as typeof TestRoleCommand;

    // 验证门派
    const familyId = cls.FAMILY_MAP[familyKey];
    if (!familyId) {
      return me.send(
        '{"type":"regist","result":"门派编号1-9: 1武当 2少林 3华山 4丐帮 5峨眉 6逍遥 7杀手 8六扇 9五狼"}',
      );
    }

    // 生成名字
    let name: string;
    if (customName) {
      if (!name_reg.test(customName)) {
        return me.send('{"type":"regist","result":"名字需要2-5个汉字"}');
      }
      name = customName;
    } else {
      cls.counter++;
      name = "测试侠" + cls.counter;
    }

    // 检查名字唯一
    if (WORLD.find_user(name)) {
      cls.counter++;
      name = "测试侠" + cls.counter;
    }

    // 检查账号
    me.ip_address = me.socket?.remoteAddress ?? "";
    if (!me.ip_address)
      return me.send('{"type":"regist","result":"无法获取IP"}');
    if (!WORLD.USERLOGIN.check_user(me, me.userid)) return;

    const userData = WORLD.DB.getUserByID(me.userid);
    if (!userData) return me.send('{"type":"regist","result":"账号信息错误"}');
    if (userData.pwd !== me.password)
      return me.send("{type:'loginerror',msg:'密码失效，请重新登录'}");

    // 创建角色基础数据
    me.name = name;
    me.id = UTIL.create_id();
    me.gender = 1; // 男
    me.level = 5; // 武帝
    me.exp = 2000000; // 大量经验
    me.pot = 100000;
    me.str = 30;
    me.con = 20;
    me.dex = 20;
    me.int = 10;
    me.per = 25;
    me.kar = 25;
    me.limit_mp = 0;
    me.max_mp = 100;
    me.money = 10000000; // 1000万金
    me.reg_time = parseInt(String(Date.now() / 60000));
    me.set_temp("new", 1);
    me.set_temp("sr", 1);
    me.set_temp("hy_ct", 50);
    me.set_setting("ban_pk", 1);
    me.eq_groups = [];
    me.sk_groups = [];

    // 技能初始化
    me.skills = new SkillsMap();

    // 基本技能(高等级)
    const baseSkillLevel = 800;
    me.skill_map(
      ["force", baseSkillLevel],
      ["dodge", baseSkillLevel],
      ["parry", baseSkillLevel],
      ["sword", weaponType === "sword" ? baseSkillLevel : 300],
      ["blade", weaponType === "blade" ? baseSkillLevel : 300],
      ["unarmed", weaponType === "unarmed" ? baseSkillLevel : 300],
      ["staff", weaponType === "staff" ? baseSkillLevel : 300],
      ["club", weaponType === "club" ? baseSkillLevel : 300],
      ["whip", weaponType === "whip" ? baseSkillLevel : 300],
      ["throwing", weaponType === "throwing" ? baseSkillLevel : 300],
    );

    // 高级技能(紫/红)
    const skillLevel = 600;
    const grade = Math.random() < 0.5 ? "6" : "5"; // 随机紫或红

    // 内功
    const forceSkill = cls.SKILL_SETS.force[grade];
    me.skill_map([forceSkill[0], skillLevel, forceSkill[1]]);

    // 轻功
    const dodgeSkill = cls.SKILL_SETS.dodge[grade];
    me.skill_map([dodgeSkill[0], skillLevel, dodgeSkill[1]]);

    // 招架
    const parrySkill = cls.SKILL_SETS.parry[grade];
    me.skill_map([parrySkill[0], skillLevel, parrySkill[1]]);

    // 武器技能
    const weaponSkillSet = cls.SKILL_SETS[weaponType] || cls.SKILL_SETS.sword;
    const weaponSkill = weaponSkillSet[grade];
    if (weaponSkill) {
      me.skill_map([weaponSkill[0], skillLevel, weaponSkill[1]]);
    }

    // 门派技能
    const familySkills = cls.FAMILY_SKILLS[familyId] || [];
    for (let i = 0; i < Math.min(3, familySkills.length); i++) {
      me.skill_map([familySkills[i], skillLevel]);
    }

    // 初始化属性
    me.recount();
    me.hp = me.max_hp;
    me.mp = me.max_mp;

    // 装备
    const equipSet = cls.EQUIP_SETS[weaponType] || cls.EQUIP_SETS._default;
    const equipArgs: [string, number, 1][] = [];
    for (const [_slot, path] of equipSet) {
      equipArgs.push([path, 1, 1]);
    }
    // 加上新手衣服
    equipArgs.push(["eq/lv0/cloth", 1, 0]);
    me.set_objects(...equipArgs);

    // 保存到数据库
    this.save2db(me, familyId);
  }

  async save2db(me: USER, familyId: string) {
    try {
      let roleData = me.getData();
      roleData.server = WORLD.SERVERID;
      // 设置门派
      roleData.family = familyId;

      let suc = await WORLD.DB.addRole(roleData);
      if (suc) {
        WORLD.USERS.push(me);
        me.wait_input = undefined;
        me.do_login();
        me.send(
          "<hio>测试角色创建成功！等级:武帝, 技能:紫红全套, 装备:神器全套</hio>",
        );
      } else {
        return me.send('{"type":"regist","result":"创建角色失败"}');
      }
    } catch (err: any) {
      if (err.errno == 1062) {
        me.id = "";
        return me.send('{"type":"regist","result":"角色名称重复，请重新输入"}');
      } else {
        console.log("测试角色创建失败", err);
        return me.send('{"type":"regist","result":"创建角色失败"}');
      }
    }
  }
}

var name_reg = /^[\u4E00-\u9FA5]{2,5}$/;
