// ============================================================
// DATA — 全局数据单例（持久化存储）
// ============================================================

// NOTE: 这些依赖通过 TypeScript 编译到 server/dist/ 后路径等价
import { WORLD } from './world.js';
import { FAMILIES } from './skill/family.js';

// ============================================================
// 全局声明（运行时注入）
// ============================================================

declare var __PATH: Record<string, string>;

// ============================================================
// 内部类型
// ============================================================

/** 排行家族 ID 列表 */
const FAMS_TATAS: string[] = [
    'WUDANG', 'HUASHAN', 'SHAOLIN',
    'EMEI', 'GAIBANG', 'XIAOYAO', 'SHASHOU', 'NONE',
];

// ============================================================
// DATA 单例
// ============================================================

export interface DataObject {
    /** 队伍数据 */
    parties: Map<string, any>;
    /** 拍卖数据 */
    PAIMAI: Map<string, any>;
    /** 运行时临时数据 */
    temp: Record<string, any>;
    /** 活动开始时间戳（世界活动用） */
    act_stime?: number;
    /** 活动结束时间戳（世界活动用） */
    act_etime?: number;
    /** 经验等级倍率表 */
    exps: number[];
    /** 宝石价值表 */
    stone_values: number[];
    /** 书籍价值表 */
    book_values: number[];
    /** 静态属性映射 */
    PROPS: Record<string, any>;
    /** 统计用临时数据存储 */
    temp_data: Record<string, Record<string, { name: string; value: number }>>;

    /** 根据玩家等级获取随机经验 */
    get_exp(me: { random(n: number): number; level: number }): number;
    /** 加载全局数据时的回调 */
    on_load(data: Record<string, any>): void;
    /** 保存全局数据时的回调 */
    on_save(str: string[]): void;
    /** 创建默认排行榜 */
    create_def_tops(): void;
    /** 创建默认装备统计 */
    create_def_eqs(): void;
    /** 创建默认分数统计 */
    create_def_scs(): void;
    /** 重置家族排行 */
    reset_famtops(me: { id: string; remove_temp(name: string): void }, fam: { id: string; name: string }): void;
    /** 保存全局数据到数据库 */
    save(): Promise<void>;
    /** JSON.stringify 替换函数 */
    temp_replacer(_key: string, value: unknown): unknown;
    /** 保存临时数据到字符串数组 */
    save_temp(str: string[]): void;
    /** 从数据库加载全局数据 */
    load(): Promise<void>;
    /** 查询临时数据 */
    query_temp(name: string, def?: unknown, _me?: unknown): unknown;
    /** 设置临时数据 */
    set_temp(name: string, value: unknown, time?: number, _me?: unknown): void;
    /** 移除临时数据 */
    remove_temp(name: string): void;
    /** 累加临时数据 */
    add_temp(name: string, value: number, time?: number, _me?: unknown): number;
    /** 清除统计数据 */
    clear_data(): void;
    /** 添加统计数据 */
    add_data(key: string, user: { id: string; name: string }, val: number): void;
    /** 查询最大值 */
    query_max_data(key: string): { name: string; value: number } | undefined;
    /** 查询最小值 */
    query_min_data(key: string): { name: string; value: number } | undefined;
}

const DATA: DataObject = {
    // ============ 字段 ============

    /** 队伍数据 */
    parties: new Map(),
    /** 拍卖数据 */
    PAIMAI: new Map(),
    /** 运行时临时数据（持久化到 data.js） */
    temp: {},
    /** 经验等级倍率表（按 level 索引） */
    exps: [15, 20, 30, 40, 50, 100, 200, 80, 90, 100, 110, 120, 130],

    /** 宝石价值表（按 grade 索引） */
    stone_values: [1000, 5000, 30000, 150000, 1000000, 10000000],
    /** 书籍价值表（按 grade 索引） */
    book_values: [1, 1000, 5000, 10000, 100000, 500000, 2000000],

    /** 静态属性映射 */
    PROPS: {},

    /** 统计用临时数据存储 */
    temp_data: {},

    // ============ 方法 ============

    /**
     * 根据玩家等级获取随机经验值
     * @param me - 玩家角色
     */
    get_exp(me: { random(n: number): number; level: number }): number {
        return me.random(5) + (this.exps as number[])[me.level];
    },

    /**
     * 全局数据加载回调 — 恢复排行榜、消息、装备统计等
     * @param data - 从 data.js 读取的原始数据
     */
    on_load(data: Record<string, any>): void {
        WORLD.MESSAGE.load(data);
        this.remove_temp('xy_status');
        this.remove_temp('xy_users');
        this.remove_temp('xy_party');
        WORLD.STATS.TOPS = WORLD.STATS.load_tops(data.tops);
        WORLD.STATS.SCORE = data.score ?? new Array(20).fill({ name: '无', score: 0 });
        WORLD.STATS.EQ_STATS = new Array(11);
        data.eq_stats = data.eq_stats ?? [];
        for (let i = 0; i < 11; i++) {
            WORLD.STATS.EQ_STATS[i] = data.eq_stats[i] ?? new Array(10).fill({ score: 0 });
        }
        for (const key of FAMS_TATAS) {
            const tops = data['tops_' + key];
            WORLD.STATS['tops_' + key] = WORLD.STATS.load_tops(
                tops,
                (FAMILIES as Record<string, { name: string }>)[key].name + '弟子',
                key,
            );
        }
        const sc_stats = data.score_stats ?? {};
        WORLD.STATS.SC_STATS = {};
        for (const key of FAMS_TATAS) {
            WORLD.STATS.SC_STATS[key] =
                sc_stats[key] ?? new Array(20).fill({ name: '无', score: 0 });
        }

        console.log('全局数据已加载');
    },

    /**
     * 全局数据保存回调 — 序列化排行榜、消息、装备统计到字符串数组
     * @param str - 输出字符串数组
     */
    on_save(str: string[]): void {
        str.push(',tops:', WORLD.STATS.saveTops(WORLD.STATS.TOPS));

        str.push(',score:', WORLD.STATS.saveScore());

        str.push(',messages:', WORLD.MESSAGE.save());
        str.push(',notices:', WORLD.MESSAGE.saveNotice());

        for (const key of FAMS_TATAS) {
            const tops = WORLD.STATS['tops_' + key];
            if (tops) {
                str.push(',tops_', key, ':', WORLD.STATS.saveTops(tops));
            }
        }
        str.push(',eq_stats:', JSON.stringify(WORLD.STATS.EQ_STATS ?? []));

        str.push(',score_stats:', JSON.stringify(WORLD.STATS.SC_STATS ?? {}));
    },

    /**
     * 为所有门派创建默认排行榜（初始时无数据）
     */
    create_def_tops(): void {
        for (const key of FAMS_TATAS) {
            WORLD.STATS['tops_' + key] = WORLD.STATS.load_tops(
                undefined,
                (FAMILIES as Record<string, { name: string }>)[key].name + '弟子',
            );
        }
    },

    /**
     * 创建默认装备统计结构（11 个部位各 10 个空位）
     */
    create_def_eqs(): void {
        WORLD.STATS.EQ_STATS = new Array(11);
        for (let i = 0; i < 11; i++) {
            WORLD.STATS.EQ_STATS[i] = new Array(10).fill({ score: 0 });
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
    reset_famtops(me: { id: string; remove_temp(name: string): void }, fam: { id: string; name: string }): void {
        me.remove_temp('top_fam_sc');
        me.remove_temp('top_fam');
        const tops = WORLD.STATS['tops_' + fam.id];
        if (tops) {
            for (let i = 0; i < tops.length; i++) {
                const user = tops[i];
                if (user.userid === me.id) {
                    user.userid = null;
                    user.name = fam.name + '弟子';
                    user.title = null;
                    break;
                }
            }
        }
        const scTops = WORLD.STATS.SC_STATS?.[fam.id];
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
        const str: string[] = ['{'];
        this.save_temp(str);
        this.on_save(str);
        str.push('}');
        return WORLD.DB.saveData(str.join(''));
    },

    /**
     * JSON.stringify 替换函数 — 保留带有过期时间的值不变
     */
    temp_replacer(_key: string, value: unknown): unknown {
        if (typeof value === 'object' && value !== null && 'e' in value) {
            // 保留带有过期时间的值不变
        }
        return value;
    },

    /**
     * 序列化临时数据到字符串数组
     * @param str - 输出字符串数组
     */
    save_temp(str: string[]): void {
        str.push('temp:', JSON.stringify(this.temp));
    },

    /**
     * 从数据库加载全局数据
     */
    async load(): Promise<void> {
        const data = await WORLD.DB.readData(__PATH.DATA + 'data.js');
        this.temp = data?.temp ?? {};
        this.on_load(data ?? {});
    },

    /**
     * 查询临时数据（支持带过期时间的值）
     * @param name - 键名
     * @param def - 默认值（键不存在时返回）
     * @param _me - 玩家对象（兼容 ROOM.set_temp 签名）
     */
    query_temp(name: string, def?: unknown, _me?: unknown): unknown {
        if (!this.temp) return def;
        const item = this.temp[name];
        if (item && item.e) {
            if (Date.now() <= item.e) {
                return item.v;
            }
            delete this.temp[name];
            return def;
        }
        return item || def;
    },

    /**
     * 设置临时数据
     * @param name - 键名
     * @param value - 值
     * @param time - 过期时间（ms），不传则永不过期
     * @param _me - 玩家对象（兼容 ROOM.set_temp 签名）
     */
    set_temp(name: string, value: unknown, time?: number, _me?: unknown): void {
        if (!this.temp) this.temp = {};
        if (time) {
            this.temp[name] = {
                v: value,
                e: Date.now() + time,
            };
        } else {
            this.temp[name] = value;
        }
    },

    /**
     * 移除临时数据（设为 null 而非 delete，保留键位用于 JSON 序列化）
     * @param name - 键名
     */
    remove_temp(name: string): void {
        if (!this.temp) return;
        this.temp[name] = null;
    },

    /**
     * 累加临时数据（数值类型）
     * @param name - 键名
     * @param value - 累加值
     * @param time - 过期时间（ms）
     * @param _me - 玩家对象（兼容 ROOM.add_temp 签名）
     * @returns 累加后的值
     */
    add_temp(name: string, value: number, time?: number, _me?: unknown): number {
        if (!this.temp) this.temp = {};
        const old = this.temp[name];
        if (time) {
            if (old && old.e) {
                const expiryTime = Date.now() + time;
                if (old.e < Date.now()) {
                    old.e = expiryTime;
                    old.v = value;
                } else {
                    if (old.e < expiryTime) old.e = expiryTime;
                    old.v += value;
                }
                return old.v;
            } else {
                const v = value + (old || 0);
                this.temp[name] = {
                    v: v,
                    e: Date.now() + time,
                };
                return v;
            }
        } else {
            const v = value + (old || 0);
            this.temp[name] = v;
            return v;
        }
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
