// ============================================================
// 全局类型声明 — 仅保留继承关系和无法ES模块导入的全局量
// 属性和方法请导航到源码 JS 文件查看
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
// 继承层级(空体, 细节见源码 JS)
// ============================================================

declare class BASE {}
declare class ITEM extends BASE {}
declare class CHARACTER extends ITEM {}
declare class USER extends CHARACTER {}
declare class NPC extends CHARACTER {}
declare class MONSTER extends CHARACTER {}
declare class FOLLOWER extends CHARACTER {}

declare class OBJ extends ITEM {}
declare class EQUIPMENT extends OBJ {}
declare class CONTAINER extends OBJ {}
declare class CORPSE extends CONTAINER {}
declare class MONEY extends OBJ {}

declare class ROOM extends ITEM {}
declare class AREA extends BASE {}
declare class FAMILY_AREA extends AREA {}

declare class COMMAND extends BASE {}
declare class TASK extends BASE {}
declare class USERTASK extends BASE {}
declare class SKILL extends BASE {}
declare class PERFORM extends BASE {}
declare class FAMILY extends BASE {}

// ============================================================
// 全局常量(无模块导出)
// ============================================================

declare const SKILL_TYPES: Record<string, number>;
declare const EQUIP_TYPE: Record<string, number>;
declare const WEAPON_TYPE: Record<string, string[]>;
declare const PROPERTIES: string[];
declare const BASE_SKILLS: Record<string, string>;
declare const FAMILIES: Record<string, FAMILY>;

// ============================================================
// 全局单例对象(无模块导出)
// ============================================================

declare const UTIL: {
    create_id(): string;
    begin: number;
    moneyToStr(val: number): string;
    to_c(val: number): string;
    inherits(child: any, parent: any): void;
    weightedChoice<T>(items: T[], weights: number[]): T;
    random(min: number, max: number): number;
    require(str: string): any;
};

declare const WORLD: {
    USERS: USER[]; COMMANDS: Record<string, COMMAND>;
    SKILLS: Record<string, SKILL>; ROOMS: Record<string, ROOM>;
    RUN_ROOMS: ROOM[]; DEFAULT_SKILLS: Record<string, any>;
    AREAS: AREA[]; TASKS: USERTASK[]; SYSTEMTASKS: TASK[];
    USER_EVENTS: any[]; OBJ_STROE: Map<string, any>; NPC_STROE: Map<string, any>;
    HEARTBEATCOUNT: number; RECEIVED: any[]; LOGS: any[];
    SERVERID: number; SERVERS: any[]; CONNECT_COUNT: number;
    DATA: any; USERLOGIN: any; DB: any;
    SocketCount: number; LISTENER: any;
    max_connect_count: number; max_user_count: number;
    MESSAGE: any; STATS: any;
    status: number; heartbeat_interval: number;
    heart_beat_service: any; SERVER: any;
    DEFAULT_COMMAND: COMMAND | null;
    admin_user: number;
    startup(port: string | number): Promise<void>;
    close(): Promise<void>;
    heart_beat(): void;
    sendAll(msg: string): void;
    getUser(id: string): USER | undefined;
    connect(socket: any): void;
    disconnect(socket: any): void;
    request(request: string, socket: any): void;
    save(): void;
    log(user: any, msg: string, detail?: string): void;
};

// ============================================================
// 原生原型扩展(util.js)
// ============================================================

interface Array<T> {
    remove(item: T): boolean;
    contain(item: T): boolean;
    random(): T;
}

interface Function {
    inherits(superCtor: Function): void;
}

interface JSON {
    toObject(str: string): any;
}
