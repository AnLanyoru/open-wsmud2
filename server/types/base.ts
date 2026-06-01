// ============================================================
// 基础类型定义 — 用于整个框架的泛型和工具类型
// ============================================================

/** temp 存储的值包装: v=value, e=expiry timestamp (可选) */
export interface TempValue<T = unknown> {
  v: T;
  e?: number;
}

/** temp 存储的完整类型 */
export type TempStore = Record<string, TempValue>;

/** 事件处理器: {func, time} 元组 */
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
  new (...args: any[]): T;
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

/** 动作定义 (用于 ITEM.add_action) */
export interface ActionDef<TThis = unknown> {
  name: string | null;
  action: (this: TThis, ...args: any[]) => unknown;
  /** 允许战斗中使用的命令 */
  allow_fight?: boolean;
  /** 允许死亡状态使用的命令 */
  allow_die?: boolean;
  /** 允许昏迷状态使用的命令 */
  allow_faint?: boolean;
  /** 允许忙乱状态使用的命令 */
  allow_busy?: boolean;
  /** 允许特殊状态使用的命令 */
  allow_state?: boolean;
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
