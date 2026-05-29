// ============================================================
// 全局类型声明 — 内联 import() 从JS源码推导真实类型，无需手写 declare class 空壳
// 文件无顶层 import/export，所有声明直接进入全局作用域
// ============================================================

// ============================================================
// 从源码导入的全局类型（替代原来的 declare class 空壳）
// ============================================================

type BASE = import('./base.js').BASE;
type ITEM = import('./item.js').ITEM;
type CHARACTER = import('./char/character.js').CHARACTER;
type USER = import('./char/user.js').USER;
type NPC = import('./char/npc.js').NPC;
type MONSTER = import('./char/monster.js').MONSTER;
type FOLLOWER = import('./char/follower.js').FOLLOWER;
type OBJ = import('./item/obj.js').OBJ;
type EQUIPMENT = import('./item/equipment.js').EQUIPMENT;
type CONTAINER = import('./item/container.js').CONTAINER;
type CORPSE = import('./item/corpse.js').CORPSE;
type MONEY = import('./item/money.js').MONEY;
type ROOM = import('./room/room.js').ROOM;
type AREA = import('./room/area.js').AREA;
type FAMILY_AREA = import('./room/fam_area.js').FAMILY_AREA;
type COMMAND = import('./command.js').COMMAND;
type TASK = import('./task/task.js').TASK;
type USERTASK = import('./task/playertask.js').USERTASK;
type SKILL = import('./skill/skill.js').SKILL;
type PERFORM = import('./skill/skill.js').PERFORM;
type FAMILY = import('./skill/family.js').FAMILY;

// ============================================================
// 全局值声明（运行时注入，无JS模块）
// ============================================================

/** 全局路径配置(运行时注入) */
declare var __PATH: {
    BASE: string; WORLD: string; COMMAND: string; SKILL: string;
    MAP: string; NPC: string; OBJ: string; TASK: string; AREA: string;
    FAMILY: string; EXTENDS: string; DATA: string; DEF_DATA: string; BASE_DATA: string;
    [key: string]: string;
};

/** 全局服务器配置(运行时注入) */
declare var __CONFIG: {
    DB: any;
    init(): Promise<void>;
    WEB_PORT: number; CONNECT_LEVEL: number;
    MD5: string; SESSION_SECRET: string; HEARTBEAT: number;
    DESIV: Buffer | null;
    def_server: { ip: string; port: number; id: number; name: string; istest: boolean };
    [key: string]: any;
};

// ============================================================
// 全局常量（const.js 运行时设置）
// ============================================================

declare const SKILL_TYPES: Record<string, number>;
declare const EQUIP_TYPE: Record<string, number>;
declare const WEAPON_TYPE: Record<string, string[]>;
declare const PROPERTIES: string[];
declare const BASE_SKILLS: Record<string, string>;
declare const FAMILIES: Record<string, FAMILY>;

// ============================================================
// 原生原型扩展（util.js）
// ============================================================

interface Array<T> {
    remove(item: T): boolean;
    contain(item: T): boolean;
    random(): T;
}

interface Function {
    inherits(superCtor: Function): void;
}

/** parseInt也接受number（JS自动转字符串，常见整数截断用法） */
declare function parseInt(s: string | number, radix?: number): number;

interface JSON {
    toObject(str: string): any;
}
