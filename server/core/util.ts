// ============================================================
// UTIL 工具集 - 通用工具方法 + 原型扩展
// ============================================================

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

import util from 'util';
import JSON5 from 'json5';
import { PROPERTIES } from './const.js';

// 懒加载 SKILL 避免循环依赖
let _SKILL: typeof import('./skill/skill.js').SKILL | null = null;
import('./skill/skill.js').then(m => { _SKILL = m.SKILL; });

// ============================================================
// 原型扩展 (副作用)
// ============================================================

/** Function.prototype.inherits — 原型继承工具 */
(Function.prototype as any).inherits = function (superCtor: Function): void {
  util.inherits(this as any, superCtor);
};

/** Array.prototype.remove — 移除第一个匹配元素 */
(Array.prototype as any).remove = function <T>(item: T): boolean {
  for (let i = 0; i < this.length; i++) {
    if (this[i] == item) {
      this.splice(i, 1);
      return true;
    }
  }
  return false;
};

/** Array.prototype.contain — 是否包含元素 */
(Array.prototype as any).contain = function <T>(item: T): boolean {
  for (let i = 0; i < this.length; i++) {
    if (this[i] === item) {
      return true;
    }
  }
  return false;
};

/** Array.prototype.random — 随机获取数组元素 */
(Array.prototype as any).random = function <T>(limit?: number): T {
  limit = limit || this.length;
  return this[Math.floor(Math.random() * this.length)] as T;
};

/** JSON.toObject — 使用 JSON5 解析（支持尾逗号等） */
(JSON as any).toObject = function (str: string): any {
  return JSON5.parse(str);
};

// ============================================================
// UTIL 单例
// ============================================================

export const UTIL = {
  /** 空函数占位 */
  empty(): void {},

  /**
   * require 模块加载包装
   * @param str - 模块名
   */
  require(str: string): any {
    return require(str);
  },

  /** 是否礼包期间（始终 false） */
  is_gift(): boolean {
    return false;
  },

  /**
   * 基于玩家 ID 和时间的加权随机
   * @param me - 玩家（需含 id）
   * @param max - 最大值（取模）
   * @param rate - 时间分片间隔（ms），默认 86400000（一天）
   */
  wrandom(me: { id: string }, max: number, rate: number = 86400000): number {
    let key = parseInt(me.id[0]!, 36);
    if (!(key >= 0)) key = 1;
    let time = Math.floor(Date.now() / rate) + key;
    return time % max;
  },

  /**
   * 货币数值转中文显示
   * @param value - 货币值（1=铜板, 100=白银, 10000=黄金）
   */
  moneyToStr(value: number): string {
    if (!value) return "";
    const str: string[] = [];
    if (value >= 10000) {
      str.push(Math.floor(value / 10000) + "两<hiy>黄金</hiy>");
      value = value % 10000;
    }
    if (value > 100) {
      str.push(Math.floor(value / 100) + "两<wht>白银</wht>");
      value = value % 100;
    }
    if (value > 0) {
      str.push(value + "个<yel>铜板</yel>");
    }
    return str.join("");
  },

  /**
   * 毫秒转中文时间跨度
   * @param time - 毫秒数
   */
  timeSpan(time: number): string {
    const str: (string | number)[] = [];
    if (time > 86400000) {
      str.push(Math.floor(time / 86400000), '天');
      time = time % 86400000;
    }
    if (time > 3600000) {
      str.push(Math.floor(time / 3600000), '小时');
      time = time % 3600000;
    }
    if (time > 60000) {
      str.push(Math.floor(time / 60000), '分钟');
      time = time % 60000;
    }
    str.push(Math.floor(time / 1000), '秒');
    return str.join("");
  },

  /** 中文数字字符 */
  C_STR: "零一二三四五六七八九" as string,
  /** 中文数位（十百千万亿） */
  C_STR2: ["", "十", "百", "千", "万", "亿"] as string[],
  /** 中文大数位（万/亿） */
  C_STR3: ["", "万", "亿"] as string[],

  /**
   * 数字转中文
   * @param num - 数字
   */
  to_c(num: number): string {
    if (!num) return "";
    let str = "";
    let count = 0;
    let add = 0; // 0=0, 1=数, 2=百十千, 3=万亿
    while (num) {
      let d = num % 10;
      if (count) {
        if (count % 4 == 0 && add != 3) {
          str = (UTIL.C_STR3[count / 4] ?? "") + str;
          add = 3;
        } else if (d && add != 2) {
          str = (UTIL.C_STR2[count % 4] ?? "") + str;
          add = 2;
        }
      }
      if (d) {
        if (d != 1 || num > 10 || count % 4 != 1)
          str = (UTIL.C_STR[d] ?? "") + str;
        add = 1;
      } else if (add == 1) {
        str = (UTIL.C_STR[d] ?? "") + str;
        add = 0;
      }
      num = Math.floor(num / 10);
      count++;
    }
    return str;
  },

  /**
   * HTML 实体编码（转义 < 和 >）
   * @param str - 原始字符串
   */
  htmlEncode(str: string): string {
    if (!str) return str;
    return str.replace(/>/g, "&gt;").replace(/</g, "&lt;");
  },

  /**
   * 属性映射格式化为可读字符串
   * @param prop - 属性映射
   * @param sp - 分隔符（默认换行）
   * @param count - 倍率（默认 1）
   */
  prop_toString(prop: Record<string, any> | null, sp?: string, count?: number): string {
    if (!prop) return "";
    const str: string[] = [];
    count = count || 1;
    for (let item in prop) {
      const val = prop[item] as number;
      switch (item) {
        case "desc": case "desc1": case "desc2": case "desc3": case "desc4": case "desc5":
          str.push(prop[item] as string);
          break;
        case "releasetime": case "distime":
          val > 0
            ? str.push(PROPERTIES[item] + "：-" + (val * count / 1000) + "秒")
            : str.push(PROPERTIES[item] + "：+" + (-val * count / 1000) + "秒");
          break;
        case "diff_busy": case "busy": case "gjsd": case "diff_downside":
          val > 0
            ? str.push(PROPERTIES[item] + "：+" + (val * count / 1000) + "秒")
            : str.push(PROPERTIES[item] + "：" + (val * count / 1000) + "秒");
          break;
        case "expend_mp_per": case "distime_per": case "releasetime_per":
          val > 0
            ? str.push(PROPERTIES[item] + "：-" + (val * count) + "%")
            : str.push(PROPERTIES[item] + "：+" + (val * -count) + "%");
          break;
        case "lianxi_per": case "dazuo_per": case "study_per": case "add_sh_per":
        case "add_bjsh_per": case "busy_per": case "gjsd_per": case "bj_per":
        case "zj_per": case "ds_per": case "fy_per": case "diff_sh_per":
        case "diff_sh_per2": case "diff_fy_per": case "diff_fy_per2": case "diff_busy_per":
        case "mz_per": case "gj_per": case "diff_bj": case "hp_per":
        case "money_per": case "diff_downside_per": case "recover_per":
          val > 0
            ? str.push(PROPERTIES[item] + "：+" + (val * count) + "%")
            : str.push(PROPERTIES[item] + "：" + (val * count) + "%");
          break;
        case "skill": {
          let skills = prop[item] as Record<string, number>;
          for (let sk in skills) {
            let sk_base = _SKILL && (_SKILL as any).get(sk);
            if (sk_base) str.push(sk_base.name + "：+" + skills[sk] + "级");
          }
          break;
        }
        case "age":
          val > 0
            ? str.push(PROPERTIES[item] + "：-" + val * count + "岁")
            : str.push(PROPERTIES[item] + "：+" + (-val) * count + "岁");
          break;
        case "expend_mp":
          val > 0
            ? str.push(PROPERTIES[item] + "：-" + val * count)
            : str.push(PROPERTIES[item] + "：+" + (-val) * count);
          break;
        default: {
          let p = PROPERTIES[item];
          if (p) {
            val > 0
              ? str.push(PROPERTIES[item] + "：+" + val * count)
              : str.push(PROPERTIES[item] + "：" + val * count);
          } else {
            p = _SKILL && (_SKILL as any).SLOTS[item];
            if (p) {
              str.push((p as any).format(val * count));
            }
          }
          break;
        }
      }
    }
    return str.join(sp || "\n");
  },

  /**
   * 计算到下一个指定小时的毫秒数
   * @param next_hour - 目标小时（默认 5）
   */
  diff_time(next_hour?: number): number {
    next_hour = next_hour ?? 5;
    let dt = new Date();
    let hour = dt.getHours();
    let day = dt.getDate();
    if (hour >= next_hour) day = day + 1;
    dt = new Date(dt.getFullYear(), dt.getMonth(), day, next_hour);
    return dt.getTime() - Date.now();
  },

  /**
   * 计算到下周指定小时的毫秒数
   * @param next_hour - 目标小时（默认 5）
   */
  diff_week_time(next_hour?: number): number {
    next_hour = next_hour ?? 5;
    const date = new Date();
    let week = date.getDay();
    week = week == 0 ? 1 : 8 - week;
    if (week == 7 && date.getHours() < next_hour) {
      week = 0;
    }
    const next_date = new Date(date.getFullYear(), date.getMonth(), date.getDate() + week, next_hour);
    return next_date.getTime() - Date.now();
  },

  /**
   * 计算到下月 1 日指定小时的毫秒数
   * @param next_hour - 目标小时（默认 5）
   */
  diff_month_time(next_hour?: number): number {
    next_hour = next_hour ?? 5;
    let date = new Date();
    if (date.getDate() > 1 || date.getHours() >= next_hour) {
      date = new Date(date.setMonth(date.getMonth() + 1, 1));
    }
    const next_date = new Date(date.getFullYear(), date.getMonth(), 1, next_hour);
    return next_date.getTime() - Date.now();
  },

  /** 日志缓冲 */
  logs: [] as Array<{ dt: () => number; content: string }>,

  /**
   * 添加日志到缓冲
   * @param msg - 日志内容
   */
  log(msg: string): void {
    this.logs.push({ dt: Date.now, content: msg });
  },

  /** 保存日志缓冲到文件 */
  saveLog(): void {
    if (!this.logs.length) return;
    const fs = require("fs") as typeof import('fs');
    const dt = new Date();
    const path = (globalThis as any).__PATH.DATA + "log/";
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
    }
    const file = path + (dt.getMonth() + 1) + "-" + dt.getDate() + "-" + dt.getHours() + ".log";
    fs.writeFileSync(path, JSON.stringify(this.logs));
  },

  /** ID 可用字符集（36 进制） */
  idstr: "0123456789abcdefghijklmnopqrstuvwxwz" as string,
  /** 基准时间戳（用于缩短 ID 长度） */
  begin: 1490276099978 as number,

  /**
   * 生成唯一对象 ID（时间戳 + 随机字符）
   */
  create_id(): string {
    const str: string[] = [];
    for (let i = 0; i < 4; i++) {
      str.push(this.idstr[Math.floor(Math.random() * this.idstr.length)]!);
    }
    str.push(Math.floor((Date.now() - this.begin) / 1000).toString(16));
    return str.join("");
  },

  /**
   * 生成随机中文名字
   * @param s - 性别（0=女 非0=男）
   * @param t - 名字字数（1 或 2，默认随机）
   */
  random_name(s: number, t?: number): string {
    t = t ?? (Math.floor(Math.random() * 2) + 1);
    const str: string[] = [];
    if (t == 2) {
      let key = Math.floor(Math.random() * this.name0.length);
      if (key % 2 == 1) key -= 1;
      str.push(this.name0[key++]!);
      str.push(this.name0[key]!);
    } else {
      str.push(this.name1[Math.floor(Math.random() * this.name1.length)]!);
    }
    if (s == 0) {
      str.push(this.name2[Math.floor(Math.random() * this.name2.length)]!);
    } else {
      str.push(this.name3[Math.floor(Math.random() * this.name3.length)]!);
    }
    if (Math.floor(Math.random() * 4) > 1) {
      if (s == 0) {
        str.push(this.name2[Math.floor(Math.random() * this.name2.length)]!);
      } else {
        str.push(this.name3[Math.floor(Math.random() * this.name3.length)]!);
      }
    }
    return str.join("");
  },

  /** 复姓字库 */
  name0: "万俟司马上官欧阳夏侯诸葛闻人东方赫连皇甫尉迟公羊澹台公冶宗政濮阳淳于单于太叔申屠公孙仲孙轩辕令狐锺离宇文长孙慕容鲜于闾丘司徒司空丌官司寇子车颛孙端木巫马公西乐正公良拓拔夹谷谷梁梁丘左丘东门西门",
  /** 单姓字库 */
  name1: "赵钱孙李周吴郑王冯陈楮卫蒋沈韩杨朱秦尤许何吕施张孔曹严华金魏陶姜戚谢邹喻柏水窦章云苏潘葛奚范彭郎",
  /** 男名字库 */
  name2: "世舜丞主产仁仇仓仕仞任伋众伸佐佺侃侪促俟信俣修倝倡倧偿储僖僧僳儒俊伟列则刚创前剑助劭势勘参叔吏嗣士壮孺守宽宾宋宗宙宣实宰尊峙峻崇崈川州巡帅庚战才承拯操斋昌晁暠曹曾珺玮珹琒琛琩琮琸瑎玚璟璥瑜生畴矗矢石磊砂碫示社祖祚祥禅稹穆竣竦综缜绪舱舷船蚩襦轼辑轩子杰榜碧葆莱蒲天乐东钢铎铖铠铸铿锋镇键镰馗旭骏骢骥驹驾骄诚诤赐慕端征坚建弓强彦御悍擎攀旷昂晷健冀凯劻啸柴木林森朴骞寒函高魁魏鲛鲲鹰丕乒候冕勰备宪宾密封山峰弼彪彭旁日明昪昴胜汉涵汗浩涛淏清澜浦澉澎澔瀚瀛灏沧虚豪豹辅辈迈邶合部阔雄霆震韩俯颁颇频颔风飒飙飚马亮仑仝代儋利力劼勒卓哲喆展帝弛弢弩彰征律德志忠思振挺掣旲旻昊昮晋晟晸朕朗段殿泰滕炅炜煜煊炎选玄勇君稼黎利贤谊金鑫辉墨欧有友闻问",
  /** 女名字库 */
  name3: "筠柔竹霭凝晓欢霄枫芸菲寒伊亚宜姬舒影荔技思丽秀娟英华慧巧美娜静淑惠珠翠雅芝玉萍红娥玲芬芳燕彩春菊勤珍贞莉兰凤洁梅琳素云莲真环雪荣妹霞香月莺媛艳瑞凡佳嘉琼桂娣叶璧璐娅琦晶妍茜秋珊莎锦黛青倩婷姣婉娴瑾颖露瑶怡婵雁蓓纨仪荷丹蓉眉君琴蕊薇菁梦岚苑婕馨瑗琰韵融园艺咏卿聪澜纯毓悦昭冰爽琬茗羽希宁欣飘育滢馥",

  /**
   * 获取公历日期对应的农历日期
   * @param date - 公历日期（默认当前时间）
   */
  getLunar(date?: Date): { year: number; month: number; day: number; isLeap: boolean } {
    date = date || new Date();
    const lunarInfo = [
      0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2,
      0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977,
      0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970,
      0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950,
      0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557,
      0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5b0, 0x14573, 0x052b0, 0x0a9a8, 0x0e950, 0x06aa0,
      0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0,
      0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b6a0, 0x195a6,
      0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570,
      0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x05ac0, 0x0ab60, 0x096d5, 0x092e0,
      0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5,
      0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930,
      0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530,
      0x05aa0, 0x076a3, 0x096d0, 0x04bd7, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45,
      0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0,
      0x14b63,
    ];

    function lYearDays(y: number): number {
      let i: number, sum = 348;
      for (i = 0x8000; i > 0x8; i >>= 1) sum += (lunarInfo[y - 1900]! & i) ? 1 : 0;
      return sum + leapDays(y);
    }

    function leapDays(y: number): number {
      if (leapMonth(y)) return (lunarInfo[y - 1900]! & 0x10000) ? 30 : 29;
      else return 0;
    }

    function leapMonth(y: number): number {
      return lunarInfo[y - 1900]! & 0xf;
    }

    function monthDays(y: number, m: number): number {
      return (lunarInfo[y - 1900]! & (0x10000 >> m)) ? 30 : 29;
    }

    class Lunar {
      year: number;
      month: number;
      day: number;
      isLeap: boolean;
      constructor(y: number, m: number, d: number) {
        let i: number, leap = 0, temp = 0;
        let offset = (Date.UTC(y, m, d) - Date.UTC(1900, 0, 31)) / 86400000;
        for (i = 1900; i < 2050 && offset > 0; i++) {
          temp = lYearDays(i);
          offset -= temp;
        }
        if (offset < 0) { offset += temp; i--; }
        this.year = i;
        leap = leapMonth(i);
        this.isLeap = false;
        for (i = 1; i < 13 && offset > 0; i++) {
          if (leap > 0 && i == (leap + 1) && this.isLeap == false) {
            --i; this.isLeap = true; temp = leapDays(this.year);
          } else {
            temp = monthDays(this.year, i);
          }
          if (this.isLeap == true && i == (leap + 1)) this.isLeap = false;
          offset -= temp;
        }
        if (offset == 0 && leap > 0 && i == leap + 1) {
          if (this.isLeap) { this.isLeap = false; } else { this.isLeap = true; --i; }
        }
        if (offset < 0) { offset += temp; --i; }
        this.month = i;
        this.day = offset + 1;
      }
    }

    return new Lunar(date.getFullYear(), date.getMonth(), date.getDate());
  },

  /**
   * 判断当前是否为农历十五（带缓存，有效期到下次整点）
   * @param dt - 参考时间（默认当前）
   */
  async isLunar15(dt?: Date): Promise<boolean> {
    const { WORLD } = await import('./world.js');
    let issuc = WORLD.DATA.query_temp('lunar15', 0) as number;
    if (issuc === 0) {
      let now = dt || new Date();
      let hour = now.getHours();
      let lunar = UTIL.getLunar(now);
      if ((lunar.day === 14 && hour >= 5) || lunar.day === 15
        || (lunar.day === 16 && hour < 5)) {
        WORLD.DATA.set_temp('lunar15', 1, UTIL.diff_time());
        issuc = 1;
      } else {
        WORLD.DATA.set_temp('lunar15', -1, UTIL.diff_time());
        issuc = -1;
      }
    }
    return issuc > 0;
  },

  /**
   * 从数组中均匀随机选取一个元素
   * @param arr - 候选数组
   */
  choice<T>(arr: T[]): T {
    if (!Array.isArray(arr) || arr.length === 0) {
      throw new Error('候选数组不能为空');
    }
    const idx = Math.floor(Math.random() * arr.length);
    return arr[idx]!;
  },

  /**
   * 加权随机选取（使用前缀和 + 二分查找）
   * @param items - 候选数组
   * @param weights - 权重数组
   */
  weightedChoice<T>(items: T[], weights: number[]): T {
    if (!Array.isArray(items) || !Array.isArray(weights)) {
      throw new Error('items 和 weights 必须为数组');
    }
    if (items.length !== weights.length) {
      throw new Error('元素数组与权重数组长度必须一致');
    }
    if (items.length === 0) {
      throw new Error('候选数组不能为空');
    }

    const prefixSum: number[] = [];
    let total = 0;
    for (const w of weights) {
      if (typeof w !== 'number' || w < 0) {
        throw new Error('权重必须为非负数字');
      }
      total += w;
      prefixSum.push(total);
    }

    if (total === 0) return items[0]!;

    const roll = Math.random() * total;

    let left = 0;
    let right = prefixSum.length - 1;
    while (left < right) {
      const mid = (left + right) >> 1;
      if ((prefixSum[mid] as number) > roll) {
        right = mid;
      } else {
        left = mid + 1;
      }
    }

    return items[left]!;
  },
};
