// ============================================================
// 全局类型声明 — 原型扩展 + 运行时全局变量
// ============================================================

// --- 数组原型扩展 (来自 util.ts) ---
interface Array<T> {
  remove(item: T): boolean;
  contain(item: T): boolean;
  random(): T;
}

// --- JSON 扩展 ---
interface JSON {
  toObject(str: string): any;
}

// --- 运行时全局变量 ---
declare var __PATH: {
  BASE: string;
  WORLD: string;
  COMMAND: string;
  SKILL: string;
  MAP: string;
  NPC: string;
  OBJ: string;
  TASK: string;
  AREA: string;
  FAMILY: string;
  EXTENDS: string;
  DATA: string;
  DEF_DATA: string;
  BASE_DATA: string;
  [key: string]: string;
};

declare var __CONFIG: {
  DB: any;
  init(): Promise<void>;
  WEB_PORT: number;
  CONNECT_LEVEL: number;
  MD5: string;
  SESSION_SECRET: string;
  HEARTBEAT: number;
  DESIV: Buffer | null;
  def_server: { ip: string; port: number; id: number; name: string; istest: boolean };
  [key: string]: any;
};

declare var WORLD: any;
declare var ROOM: any;
declare var FAMILIES: any;
