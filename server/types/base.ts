// ============================================================
// 基础类型定义 — 用于整个框架的泛型和工具类型
// ============================================================

import type { USER } from "../core/char/user";

/** temp 存储的值包装: v=value, e=expiry timestamp (可选) */
export interface TempValue<T = any> {
    v: T;
    e?: number;
}

/** temp 存储的完整类型 */
export type TempStore = Record<string, TempValue>;

/** 事件处理器: {func, time} 二元组，优先级由所在桶决定 */
export interface EventHandler<TThis = unknown> {
    func: (this: TThis) => boolean | void;
    time: number;
}

/** 事件映射 */
export type EventMap<TThis = unknown> = Record<string, EventHandler<TThis>[]>;

/** 可序列化的基础类型 */
export type JSONPrimitive = string | number | boolean | null;
export type JSONValue = JSONPrimitive | JSONValue[] | { [key: string]: JSONValue };

/** 构造函数类型 */
export interface Constructor<T = unknown> {
    new(...args: any[]): T;
}

/** 抽象构造器参数 */
export type CtorParams = string | undefined;

/** 基础回调签名: 无参数无返回值 */
export type VoidCallback<TThis = unknown> = (this: TThis) => void;

/** 资源文件路径: "dir/subdir/filename" 或 "dir/subdir/filename#param" */
export type ResourcePath = `${string}/${string}` | `${string}/${string}#${string}`;

/** PATH_REG 匹配结果 */
export interface PathMatch {
    0: string;
    1: string;
    2?: string;
    index: number;
    input: string;
    groups?: Record<string, string>;
}

/** ITEM 的 JSON 缓存接口 */
export interface JSONCache {
    json: string | null;
}

/** 命令权限控制字段名 */
export type CommandAccess = 'allow_die' | 'allow_faint' | 'allow_state' | 'allow_fight' | 'allow_busy';

/** 命令权限控制标志（可选布尔值） */
export type CommandAccessFlags = Partial<Record<CommandAccess, boolean>>;

/** 动作定义 (用于 ITEM.add_action) */
export interface ActionDef<TThis = unknown> extends CommandAccessFlags {
    /** 指令名称 */
    name: string | null;
    /** 执行函数 */
    action?: (this: TThis, me: USER, ...args: string[]) => any;
    /** 允许执行的用户等级 */
    allow_level?: number;
}

/** 动作映射 */
export type ActionMap<TThis = unknown> = Record<string, ActionDef<TThis>> | null;

/** uid 生成器返回的 ID */
export type UID = string;

/** 毫秒时间戳 */
export type Timestamp = number;

/** 资源文件 default export 类型 */
export type ResourceExport = Constructor | ((this: any) => void);

// ============================================================
// 可恢复记录 (WORLD.add_recover_obj)
// ============================================================

/** 可恢复记录 — 遗忘技能 (type=3) */
export interface RecoverSkill {
    /** 技能 ID */
    id: string;
    /** 技能显示名（含颜色） */
    name: string;
    /** 提升等级次数 */
    up_count: number;
    /** 技能附加属性列表 */
    addin: number[];
    /** 遗忘时的技能等级 */
    level: number;
    /** 转化的潜能点数 */
    pot: number;
}

/** 可恢复记录 — 商店回购 (type=12) */
export interface RecoverShop {
    /** 物品 ID */
    id: string;
    /** 物品显示名 */
    name: string;
    /** 回购数量 */
    count: number;
    /** 回购单价 */
    value: number;
    /** 限购 key（null 表示不限购） */
    limit_key?: string | null;
    /** 最大持有 key */
    max_key?: string;
    /** 是否可回购换金 */
    rcash?: boolean;
    /** 物品资源路径 */
    path: string;
    /** 商店物品类型 */
    mtype?: number;
}

/** 可恢复记录条目 — 按 type 区分的联合类型 */
export type RecoverEntry =
    | ({ type: 3; time: number } & RecoverSkill)
    | ({ type: 12; time: number } & RecoverShop)
    | { type: number; time: number; id: string; path: string; name: string; count: number; value: number; extra?: number };
