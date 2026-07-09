// ============================================================
// DATA — 全局数据单例（持久化存储）
// ============================================================

// NOTE: 这些依赖通过 TypeScript 编译到 server/dist/ 后路径等价
import { WORLD } from "./world.js";
import { FAMILIES } from "./skill/family.js";
import type { StatsTopEntry, WeaponRankEntry } from "./world.js";
import type { USER } from "./char/user.js";
import type { FOLLOWER } from "./char/follower.js";

// ============================================================
// 全局声明（运行时注入）
// ============================================================

declare var __PATH: Record<string, string>;

// ============================================================
// 内部类型
// ============================================================

/** 排行家族 ID 列表 */
const FAMS_TATAS: string[] = [
  "WUDANG",
  "HUASHAN",
  "SHAOLIN",
  "EMEI",
  "GAIBANG",
  "XIAOYAO",
  "SHASHOU",
  "NONE",
];

// ============================================================
// DATA 单例
// ============================================================

const DATA = {
  // ============ 字段 ============

  /** 队伍数据 */
  parties: new Map(),
  /** 拍卖数据 */
  PAIMAI: new Map(),
  /** 临时数据值存储 */
  _temp_values: new Map<string, any>(),
  /** 临时数据过期时间存储 */
  _temp_expiry: new Map<string, number>(),
  /** 运行时临时数据兼容访问器 */
  get temp(): Record<string, any> {
    const obj: Record<string, any> = {};
    const expiry = this._temp_expiry;
    for (const [k, v] of this._temp_values) {
      const e = expiry.get(k);
      obj[k] = e !== undefined ? { v, e } : v;
    }
    return obj;
  },
  set temp(data: Record<string, any> | null | undefined) {
    this._temp_values.clear();
    this._temp_expiry.clear();
    if (!data) return;
    for (const key of Object.keys(data)) {
      const val = data[key];
      if (val === null || val === undefined) continue;
      if (typeof val === "object" && "e" in val && "v" in val) {
        this._temp_values.set(key, val.v);
        this._temp_expiry.set(key, val.e);
      } else {
        this._temp_values.set(key, val);
      }
    }
  },
  /** 经验等级倍率表（按 level 索引） */
  exps: [10, 20, 30, 40, 50, 100, 200, 80, 90, 100, 110, 120, 130],

  /** 宝石价值表（按 grade 索引） */
  stone_values: [1000, 5000, 30000, 150000, 1000000, 10000000],
  /** 书籍价值表（按 grade 索引） */
  book_values: [1, 1000, 5000, 10000, 100000, 500000, 2000000],

  /** 活动开始时间 unix timestamp */
  act_stime: 0,
  /** 活动结束时间 unix timestamp */
  act_etime: 0,

  /** 静态属性映射 */
  PROPS: {},

  /** 统计用临时数据存储 */
  temp_data: {},

  // ============ 方法 ============

  /**
   * 根据玩家等级获取随机经验值
   * @param me - 玩家角色
   */
  get_exp(me: USER | FOLLOWER): number {
    return me.random(5) + this.exps[me.level];
  },

  /**
   * 全局数据加载回调 — 恢复排行榜、消息、装备统计等
   * @param data - 从 data.js 读取的原始数据
   */
  on_load(data: Record<string, any>): void {
    WORLD.MESSAGE.load(data);
    this.remove_temp("xy_status");
    this.remove_temp("xy_users");
    this.remove_temp("xy_party");
    WORLD.STATS.TOPS = WORLD.STATS.load_tops(data.tops);
    WORLD.STATS.SCORE =
      data.score ?? new Array(20).fill({ name: "无", score: 0 });
    WORLD.STATS.EQ_STATS = new Array(11);
    data.eq_stats = data.eq_stats ?? [];
    for (let i = 0; i < 11; i++) {
      WORLD.STATS.EQ_STATS[i] =
        data.eq_stats[i] ?? new Array(10).fill({ score: 0 } as WeaponRankEntry);
    }
    for (const key of FAMS_TATAS) {
      const tops = data["tops_" + key];
      const fam = FAMILIES[key];
      WORLD.STATS["tops_" + key] = WORLD.STATS.load_tops(
        tops,
        fam.name + "弟子",
        key,
      );
    }
    const sc_stats = data.score_stats ?? {};
    WORLD.STATS.SC_STATS = {};
    for (const key of FAMS_TATAS) {
      WORLD.STATS.SC_STATS[key] =
        sc_stats[key] ?? new Array(20).fill({ name: "无", score: 0 });
    }

    console.log("全局数据已加载");
  },

  /**
   * 全局数据保存回调 — 序列化排行榜、消息、装备统计到字符串数组
   * @param str - 输出字符串数组
   */
  on_save(str: string[]): void {
    str.push(",tops:", WORLD.STATS.saveTops(WORLD.STATS.TOPS));

    str.push(",score:", WORLD.STATS.saveScore());

    str.push(",messages:", WORLD.MESSAGE.save());
    str.push(",notices:", WORLD.MESSAGE.saveNotice());

    for (const key of FAMS_TATAS) {
      const tops = WORLD.STATS["tops_" + key];
      if (tops && Array.isArray(tops)) {
        str.push(
          ",tops_",
          key,
          ":",
          WORLD.STATS.saveTops(tops as StatsTopEntry[]),
        );
      }
    }
    str.push(",eq_stats:", JSON.stringify(WORLD.STATS.EQ_STATS ?? []));

    str.push(",score_stats:", JSON.stringify(WORLD.STATS.SC_STATS ?? {}));
  },

  /**
   * 为所有门派创建默认排行榜（初始时无数据）
   */
  create_def_tops(): void {
    for (const key of FAMS_TATAS) {
      const fam = FAMILIES[key];
      WORLD.STATS["tops_" + key] = WORLD.STATS.load_tops(
        undefined,
        fam.name + "弟子",
      );
    }
  },

  /**
   * 创建默认装备统计结构（11 个部位各 10 个空位）
   */
  create_def_eqs(): void {
    WORLD.STATS.EQ_STATS = new Array(11);
    for (let i = 0; i < 11; i++) {
      WORLD.STATS.EQ_STATS[i] = new Array(10).fill({
        score: 0,
      } as WeaponRankEntry);
    }
    WORLD.STATS.EQ_STATS[0] = WORLD.STATS.WEAPON;
  },

  /**
   * 创建默认分数统计结构（各门派 20 个空位）
   */
  create_def_scs(): void {
    WORLD.STATS.SC_STATS = {};
    for (const key of FAMS_TATAS) {
      WORLD.STATS.SC_STATS[key] = new Array(20).fill({ score: 0 });
    }
  },

  /**
   * 重置指定门派的排行榜（玩家退出门派时调用）
   * @param me - 玩家角色
   * @param fam - 门派对象
   */
  reset_famtops(
    me: { id: string; remove_temp(name: string): void },
    fam: { id: string; name: string },
  ): void {
    me.remove_temp("top_fam_sc");
    me.remove_temp("top_fam");
    const tops = WORLD.STATS["tops_" + fam.id] as StatsTopEntry[] | undefined;
    if (tops) {
      for (let i = 0; i < tops.length; i++) {
        const user = tops[i];
        if (user.userid === me.id) {
          user.userid = undefined;
          user.name = fam.name + "弟子";
          user.title = undefined;
          break;
        }
      }
    }
    const scTops = WORLD.STATS.SC_STATS[fam.id];
    if (scTops) {
      for (let i = 0; i < scTops.length; i++) {
        if (scTops[i].id === me.id) {
          scTops.splice(i, 1);
          break;
        }
      }
    }
  },

  /**
   * 保存全局数据到数据库（含临时数据和排行榜等）
   */
  async save(): Promise<void> {
    const str: string[] = ["{"];
    this.save_temp(str);
    this.on_save(str);
    str.push("}");
    return WORLD.DB.saveData(str.join(""));
  },

  /**
   * JSON.stringify 替换函数 — 保留带有过期时间的值不变
   * @deprecated 未使用 — save_temp 调用 JSON.stringify 时从未传入此 replacer
   */
  temp_replacer(_key: string, value: unknown): unknown {
    if (typeof value === "object" && value !== null && "e" in value) {
      // 保留带有过期时间的值不变
    }
    return value;
  },

  /**
   * 序列化临时数据到字符串数组
   * @param str - 输出字符串数组
   */
  save_temp(str: string[]): void {
    str.push("temp:", JSON.stringify(this.temp));
  },

  /**
   * 从数据库加载全局数据
   */
  async load(): Promise<void> {
    const data = await WORLD.DB.readData();
    this.temp = data?.temp ?? {};
    this.on_load(data ?? {});
  },

  /**
   * 查询临时数据（支持带过期时间的值）
   * @param name - 键名
   * @param def - 默认值（键不存在时返回）
   * @param _me - 玩家对象（兼容 ROOM.set_temp 签名）
   */
  query_temp<T>(name: string, def?: T): T {
    if (def === undefined) def = 0 as T;
    const val = this._temp_values.get(name);
    if (val === undefined) return def;
    const expiry = this._temp_expiry.get(name);
    if (expiry === undefined) return val as T;
    if (Date.now() <= expiry) return val as T;
    this._temp_values.delete(name);
    this._temp_expiry.delete(name);
    return def;
  },

  /**
   * 设置临时数据
   * @param name - 键名
   * @param value - 值
   * @param time - 过期时间（ms），不传则永不过期
   * @param _me - 玩家对象（兼容 ROOM.set_temp 签名）
   */
  set_temp(name: string, value: unknown, time?: number): void {
    this._temp_values.set(name, value);
    if (time) {
      this._temp_expiry.set(name, Date.now() + time);
    } else {
      this._temp_expiry.delete(name);
    }
  },

  /**
   * 移除临时数据
   * @param name - 键名
   */
  remove_temp(name: string): void {
    this._temp_values.delete(name);
    this._temp_expiry.delete(name);
  },

  /**
   * 累加临时数据（数值类型）
   * @param name - 键名
   * @param value - 累加值
   * @param time - 过期时间（ms）
   * @param _me - 玩家对象（兼容 ROOM.add_temp 签名）
   * @returns 累加后的值
   */
  add_temp(name: string, value: number, time?: number): number {
    const oldVal = this._temp_values.get(name);
    const oldExpiry = this._temp_expiry.get(name);
    const now = Date.now();
    const baseVal =
      typeof oldVal === "number" && !oldExpiry
        ? oldVal
        : oldExpiry && oldExpiry > now
          ? oldVal
          : 0;
    const v = value + baseVal;
    if (time) {
      const newExpiry = now + time;
      const finalExpiry =
        oldExpiry && oldExpiry > now && oldExpiry > newExpiry
          ? oldExpiry
          : newExpiry;
      this._temp_values.set(name, v);
      this._temp_expiry.set(name, finalExpiry);
    } else {
      this.set_temp(name, v);
    }
    return v;
  },

  /**
   * 查询临时数据过期时间戳
   */
  query_temp_expiry(name: string): number | undefined {
    return this._temp_expiry.get(name);
  },

  /**
   * 清除所有统计数据
   */
  clear_data(): void {
    this.temp_data = {};
  },

  /**
   * 添加统计数据（按用户汇总）
   * @param key - 统计键
   * @param user - 玩家
   * @param val - 增加值
   */
  add_data(key: string, user: { id: string; name: string }, val: number): void {
    if (!val) return;
    let data = this.temp_data[key];
    if (!data) data = this.temp_data[key] = {};
    let userData = data[user.id];
    if (!userData) userData = data[user.id] = { name: user.name, value: 0 };
    userData.value += val;
  },

  /**
   * 查询统计数据中值最大的条目
   * @param key - 统计键
   */
  query_max_data(key: string): { name: string; value: number } | undefined {
    const data = this.temp_data[key];
    if (!data) return undefined;
    let best: { name: string; value: number } | null = null;
    for (const k in data) {
      const item = data[k];
      if (!best) best = item;
      else if (item.value > best.value) best = item;
    }
    return best ?? undefined;
  },

  /**
   * 查询统计数据中值最小的条目
   * @param key - 统计键
   */
  query_min_data(key: string): { name: string; value: number } | undefined {
    const data = this.temp_data[key];
    if (!data) return undefined;
    let best: { name: string; value: number } | null = null;
    for (const k in data) {
      const item = data[k];
      if (!best) best = item;
      else if (item.value < best.value) best = item;
    }
    return best ?? undefined;
  },
};

export default DATA;
