/**
 * 极简全局类型桩 — 仅声明类名及继承关系，供 JSDoc 类型引用解析。
 * 不含方法和属性，因此 IDE 跳转(F12)仍会定位到 .js 源文件实现。
 */

declare class BASE { [key: string]: any }
declare class ITEM extends BASE { [key: string]: any }
declare class CHARACTER extends ITEM { [key: string]: any }
declare class USER extends CHARACTER { [key: string]: any }
declare class NPC extends CHARACTER { [key: string]: any }
declare class MONSTER extends CHARACTER { [key: string]: any }
declare class FOLLOWER extends CHARACTER { [key: string]: any }
declare class OBJ extends ITEM { [key: string]: any }
declare class EQUIPMENT extends OBJ { [key: string]: any }
declare class CONTAINER extends OBJ { [key: string]: any }
declare class CORPSE extends CONTAINER { [key: string]: any }
declare class MONEY extends OBJ { [key: string]: any }
declare class ROOM extends ITEM { [key: string]: any }
declare class AREA extends BASE { [key: string]: any }
declare class FAMILY_AREA extends AREA { [key: string]: any }
declare class SKILL extends BASE { [key: string]: any }
declare class PERFORM extends BASE { [key: string]: any }
declare class FAMILY extends BASE { [key: string]: any }
declare class COMMAND extends BASE { [key: string]: any }
declare class TASK extends BASE { [key: string]: any }
declare class USERTASK extends BASE { [key: string]: any }
declare class EVENTS extends BASE { [key: string]: any }

declare var WORLD: {
    USERS: USER[];
    COMMANDS: { [key: string]: COMMAND };
    SKILLS: { [key: string]: SKILL };
    ROOMS: { [key: string]: ROOM };
    RUN_ROOMS: ROOM[];
    DEFAULT_SKILLS: { [key: string]: SKILL };
    AREAS: AREA[];
    TASKS: USERTASK[];
    SYSTEMTASKS: TASK[];
    USER_EVENTS: Array<{ id: string }>;
    OBJ_STROE: Map<string, OBJ>;
    NPC_STROE: Map<string, NPC>;
    HEARTBEATCOUNT: number;
    RECEIVED: Array<{ time: number; cmd: string; user: string }>;
    LOGS: Array<{ time: number; cmd: string; user: string; msg: string }>;
    SERVERID: number;
    SERVERS: any[];
    CONNECT_COUNT: number;
    DATA: any;
    USERLOGIN: any;
    DB: any;
    SocketCount: number;
    LISTENER: any;
    max_connect_count: number;
    max_user_count: number;
    MESSAGE: { stores: Map<any, any>; NOTICES: any[] };
    STATS: { TOPS: any[]; EXP: any[]; SCORE: any[]; WEAPON: any[] };
    status: number;
    heart_beat_service: any;
    SERVER: any;
    DEFAULT_COMMAND: COMMAND;
    SocketIn(): void;
    connect(socket: any): void;
    check_connect(socket: any): boolean;
    before_login(user: USER): boolean;
    disconnect(socket: any): void;
    request(request: string, socket: any): void;
    saveRequest(): void;
    startup(port?: number): Promise<void>;
    sendAll(msg: string): void;
    getUser(id: string | number): USER | undefined;
    find_user(name: string): USER | undefined;
    on_user_login(user: USER): void;
    on_user_cross_login(user: USER): void;
    on_startup(): void;
    on_user_quit(user: USER): void;
    on_user_relogin(user: USER): void;
    on_heart_beat(dt: number): void;
    heart_beat(): void;
    login_out(user: USER): void;
    send(text: string): void;
    log(user: USER | null, cmd: string, msg: string): void;
    saveLog(): void;
    is_server(user: USER): boolean;
    save(): Promise<boolean>;
    writeHeapSnapshot(): void;
    loadLocalData(): void;
    on_cross_response(id: string, sid: string): void;
    can_cross(id: string): boolean;
    on_user_die(me: CHARACTER, killer: CHARACTER, corpse: CORPSE): void;
    on_resource_loaded(): void;
    auto_get?(killer: CHARACTER, corpse: CORPSE, victim: CHARACTER): void;
    [key: string]: any;
};

// 原型扩展 (os/util/util.js)
interface Array<T> {
    remove(item: any): boolean | undefined;
    contain(item: any): boolean;
    random(index?: number): T;
}

interface Function {
    inherits(superCtor: Function): void;
}

interface JSON {
    toObject(str: string): any;
}
