// ============================================================
// 全局类型声明 — 使 JSDoc @type 跨文件可解析
// 无运行时开销，仅服务于 IDE 类型提示
// ============================================================

/** 全局路径配置 */
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

/** 全局服务器配置 */
declare var __CONFIG: {
    DB: any;
    init(): Promise<void>;
    WEB_PORT: number;
    CONNECT_LEVEL: number;
    MD5: string;
    SESSION_SECRET: string;
    HEARTBEAT: number;
    DESIV: Buffer | null;
    def_server: {
        ip: string;
        port: number;
        id: number;
        name: string;
        istest: boolean;
    };
    [key: string]: any;
};

// ============================================================
// 核心游戏类 (按继承层次排列)
// ============================================================

/** ITEM — 所有物件的基类 */
declare class ITEM {
    path: string;
    id: string;
    uid: string;
    name: string;
    max_item_count: number;
    money: number;
    items: ITEM[] | null;
    actions: Record<string, { name: string; action: Function }> | null;
    json: string | null;

    heart_beat(dt: number): void;
    init(): void;
    create(file: string, ctor?: string): void;
    destroy(): void;
    refresh(): void;
    is_hidden(): boolean;
    long_name(): string;
    add_action(cmd: string, name: string, func: Function): any;
    remove_action(name: string | string[], func?: Function): void;
    exec(cmdName: string, pars: any[]): boolean;
    item_count(): number;
    is_full(val?: number): boolean;
    find_obj(id: string): ITEM | null;
    find_obj_bypath(path: string, parent?: ITEM): ITEM | undefined;
    find_obj_byid(items: ITEM[], oid: string): ITEM | undefined;
    each_item(func: (item: ITEM) => boolean | void, parent?: ITEM): void;
    is(obj: ITEM | string | null): boolean;
    remove_item_byid(obj: string, count?: number): ITEM | null;
    remove_item(obj: ITEM, count?: number): ITEM | null;
    move_item_to(obj: ITEM, count: number, target: ITEM): ITEM | undefined;
    push_item(moved_obj: ITEM): ITEM | undefined;
    create_id(): void;
    create_uid(): string;
    query_create_time(): Date | undefined;
    format_temp(temp: Record<string, any>, timeout?: number): string;
}

// ============================================================
// 技能/门派相关
// ============================================================

/** SKILL_TYPES 枚举 */
declare const SKILL_TYPES: Record<string, number>;
/** EQUIP_TYPE 枚举 */
declare const EQUIP_TYPE: Record<string, number>;
/** WEAPON_TYPE 枚举 */
declare const WEAPON_TYPE: Record<string, string[]>;
/** PROPERTIES 属性名常量 */
declare const PROPERTIES: string[];
/** BASE_SKILLS 基础技能ID常量 */
declare const BASE_SKILLS: Record<string, string>;

/** FAMILY 门派类 */
declare class FAMILY {
    titles: string[];
    npcs: NPC[];
    battle_family: string | null;
    battle_score: number;
    battle_gift: number;
    can_battle: boolean;
    area: AREA | null;
    name: string;
    id: string;
    skills: any[];
    skills0: any[];
    skills2: any[];
    skills3: any[];
    skills4: any[];
    skill_levels: any[][];
    tops: Record<string, { name: string; score: number }>;

    set_titles(...titles: string[]): void;
    query_temp(name: string, val?: number, temp?: number): number;
    set_temp(name: string, val: any, expire?: number): void;
    remove_temp(name: string): void;
    add_temp(name: string, val: number): void;
}

declare const FAMILIES: Record<string, FAMILY>;

/** SKILL 技能类 */
declare class SKILL {
    id: string;
    name: string;
    type: number;
    grade: number;
    score: number;
    pfm: Record<string, PERFORM>;
    attack_actions: string[];
    dodge_actions: string[];
    enable: string;
    weapon_type: string;
    weapon: any;
    family: FAMILY;
    can_enables: string[];

    query_attack_action(me: CHARACTER, target: CHARACTER): string;
    query_dodge_action(me: CHARACTER): string;
    attach_prop(me: CHARACTER, skillData: any): void;
    query_score(level: number, me: CHARACTER): number;
    static get(id: string): SKILL | undefined;
}

/** PERFORM 绝招类 */
declare class PERFORM {
    name: string;
    query_name(): string;
}

// ============================================================
// CHARACTER 及其子类
// ============================================================

/** CHARACTER 生物基类 */
declare class CHARACTER extends ITEM {
    // 核心
    name: string;
    title: string;
    color_name: string;
    gender: number;
    age: number;
    level: number;
    desc: string;
    // 战斗属性
    hp: number;
    max_hp: number;
    mp: number;
    max_mp: number;
    str: number;
    con: number;
    dex: number;
    int: number;
    per: number;
    exp: number;
    pot: number;
    score: number;
    // 身份
    is_player: boolean;
    user_level: number;
    // 环境
    environment: ROOM | null;
    state: any;
    wait_input: Function | null;
    no_message: boolean;
    // 装备/技能
    skills: Record<string, { level: number; exp: number; enable_skill: number }> | null;
    status: any[] | null;
    equipment: EQUIPMENT[] | null;
    prop: Record<string, number> | null;
    temp: Record<string, any> | null;
    combat_props: [string, number][] | null;
    // 战斗
    fight_type: number;
    enemy: CHARACTER[] | null;
    attack_skill: SKILL | null;
    noweapon_skill: SKILL | null;
    dodge_skill: SKILL | null;
    parry_skill: SKILL | null;
    force_skill: SKILL | null;
    auto_skills: any[] | null;
    attack_part: any;
    is_busy: number;
    is_faint: number;
    ig_control: number;
    is_miss: number;
    is_rash: number;
    is_shadow: number;
    attack_handler: any;
    auto_pfm: boolean;
    // 社交
    follow_target: CHARACTER | null;
    follow_targets: CHARACTER[] | null;
    team: any[] | null;
    family: FAMILY;
    release_time: number;
    drop_list: any[] | null;
    // 回调
    on_create: ((path: string, par?: string) => void) | null;
    on_clone: (() => void) | null;
    on_die: (() => void) | null;
    on_relive: (() => void) | null;
    on_heart_beat: ((dt: number) => void) | null;
    on_died: (() => void) | null;

    send(msg?: string): void;
    notify(msg?: string): void;
    notify_fail(text?: string): boolean;
    send_commands(): void;
    is_living(): boolean;
    is_in(path: string): boolean;
    is_here(obj: CHARACTER): boolean;
    find_obj(oid: string, parent?: ITEM): ITEM | undefined;
    send_message(msg: string, include_me?: boolean): void;
    send_combat(text: string, target: CHARACTER): void;
    send_room(text: string, target?: CHARACTER, excludeself?: boolean): void;
    query_setting(name: string): boolean | number;
    command(req: string): void;
    do_command(cmdName: string, str?: string): void;
    check_command(cmd: COMMAND): boolean;
    add_exp(exp?: number, pot?: number, money?: number): void;
    add_money(val: number): void;
    create(path: string, par?: string): void;
    clone(): void;
    init(): void;
    check_groupeq(): void;
    do_item_action(item: ITEM, cmd: string, pars: any[]): boolean;

    // mixin 方法 (writable 桩)
    query_temp(name: string, val?: number, temp?: number): number;
    change_prop(name: string, val: number, append?: boolean): void;
    query_skill(id: string): { level: number; exp: number; enable_skill: number } | null;
    init_skill(): void;
    recount(): void;
    call3(): string;
    weapon_name(): string;
    throwing_name(): string;

    // mixin 方法 (实际注入到 prototype)
    query_prop(name: string): number;
    add_prop(name: string, val: number, append?: boolean): void;
    clear_prop(): void;
    set_temp(name: string, val: any, expire?: number): void;
    remove_temp(name: string): void;
    add_temp(name: string, val: number): void;
    moveto(room: string | ROOM): void;
    do_follow(target: CHARACTER): void;
    clear_follow(): void;
    clear_status(): void;
    is_fighting(): boolean;
    add_hp(val: number, notify?: boolean): void;
    add_mp(val: number, notify?: boolean): void;
    query_enemy(): CHARACTER | null;
    end_fight(): void;
    begin_attack(target: CHARACTER, fight_type?: number): void;
    get_level_desc(): string;
    query_age(): number;
    query_commands(): string;
}

/** USER 玩家类 */
declare class USER extends CHARACTER {
    id: string;
    userid: number;
    socket: any;
    ip_address: string | null;
    password: string;
    loginTime: number;
    serverid: number;
    request_count: number;
    max_store_count: number;
    cash_money: number;
    follower: any[] | null;
    eq_group: number;
    eq_groups: any[] | null;
    stores: OBJ[] | null;
    books: string[] | null;
    settings: Record<string, any> | null;
    sk_groups: any[] | null;
    titles: any[] | null;
    quit_room: string | null;
    no_fight: boolean;
    record_damage: boolean;
    no_combatmsg: boolean;
    commands_json: any;
    login_message: string | null;
    disconnect_time: number;

    do_login(): void;
    relogin(user: USER): void;
    disconnect(): void;
    loadData(data: any): void;
    getData(): any;
    set_state(state: any): void;
    get_state(): any;
    add_obj(path: string): OBJ | undefined;
    remove_obj(obj: OBJ, count?: number): OBJ | null;
    query_weapon(): EQUIPMENT | undefined;
    query_equipment(type: number): EQUIPMENT | undefined;
    go_home(): void;
    save(): void;
    die(): void;
    check_state(): boolean;
    query_title(): string;
    add_title(title: string, type?: string): void;
    set_setting(name: string, value: any): void;
    query_home(): string;
    send_loginmessage(): void;
    items_changed(): void;
    clear_distime(): void;
    add_combat_prop(name: string, val: number, append?: boolean): void;
    clear_combat_prop(): void;
    add_cash(val: number): void;
    query_cash(): number;
    can_follow(): boolean;
    add_follower(follower: FOLLOWER): void;
}

/** NPC 非玩家角色类 */
declare class NPC extends CHARACTER {
    chat_msg: string[] | null;
    chat_chance: number;
    sell_list: OBJ[] | null;
    die_room: string | null;
    no_refresh: boolean;
    master: string | null;
    question: string | null;
    no_fight: boolean;
    on_master: ((me: USER) => CHARACTER | void) | null;
    on_checkskill: ((me: USER, skill: string) => boolean | void) | null;
    on_pfm: ((me: CHARACTER, target: CHARACTER) => void) | null;

    set_chat_msg(items: string[], chance?: number): void;
    set_goods(items: any[]): void;
    die(): void;
    relive(): void;
    query_commands(): string;
    do_say(msg?: string): void;
}

/** MONSTER 怪物类 */
declare class MONSTER extends CHARACTER {
    can_speek: boolean;
}

/** FOLLOWER 随从类 */
declare class FOLLOWER extends CHARACTER {
    master: string | null;
    master_name: string | null;
    listener: USER | null;
    master_json: any;
    settings: Record<string, number>;
    on_makelove: ((me: USER) => void) | null;
    on_master_enter: ((me: USER) => void) | null;
}

// ============================================================
// 物件体系
// ============================================================

/** OBJ 普通物品类 */
declare class OBJ extends ITEM {
    unit: string;
    count: number;
    combined: boolean;
    grade: number;
    otype: number;
    transable: boolean;
    color_name: string;
    desc: string;
    value: number;
    is_money: boolean;
    is_equipment: boolean;
    showAction: boolean;
    distime: number;
    combine_count: number;
    is_locked: boolean;
    on_use: ((me: CHARACTER) => void) | null;
    on_study: ((me: CHARACTER) => void) | null;
    on_open: ((me: CHARACTER) => void) | null;
    on_init: ((me: CHARACTER) => void) | null;
    on_load: (me: CHARACTER) => void;
    on_reload: ((me: CHARACTER) => void) | null;
    on_create: ((path: string, par?: string) => void) | null;
    on_drop: ((me: CHARACTER) => void) | null;

    init(me?: CHARACTER): void;
    combine(obj: OBJ): OBJ;
    uncombine(count: number): OBJ | null;
    static CREATE(path: string): OBJ;
}

/** EQUIPMENT 装备类 */
declare class EQUIPMENT extends OBJ {
    parts: string[];
    qualities: string[];
    VALUES: number[];
    levelData: number[];
    eq_type: number;
    allow_fight: boolean;
    prop: Record<string, number> | null;
    st_prop: { prop: Record<string, number> }[] | null;
    hole_count: number;
    condition: any;
    group_prop: Function | null;
    group_name: string | null;
    weapon_type: string;
    original_prop: any;
    on_eq: ((me: CHARACTER) => void) | null;
    on_uneq: ((me: CHARACTER) => void) | null;
    eq_msg: string | null;
    uneq_msg: string | null;

    change_prop(me: CHARACTER, is_attach: boolean): void;
    level_up(): void;
    levelchange_prop(): void;
    push_stone(stone: OBJ): void;
    clear_stone(): void;
}

/** CONTAINER 容器类 */
declare class CONTAINER extends OBJ {
    is_container: boolean;
    is_open: boolean;
}

/** CORPSE 尸体类 */
declare class CORPSE extends CONTAINER {
    no_alloc: boolean;
    owner_name: string | null;
}

/** MONEY 货币类 */
declare class MONEY extends OBJ {
    is_cash: boolean;
}

// ============================================================
// 房间与区域
// ============================================================

/** ROOM 房间类 */
declare class ROOM extends ITEM {
    long_name: string;
    desc: string;
    area: string;
    exits: Record<string, string> | null;
    room_exits_json: string | null;
    hidden_items: Record<string, string> | null;
    commands_json: string | null;
    parent: AREA | null;
    is_copy_room: boolean;
    is_shadow: boolean;
    no_shadow: boolean;
    create_time: number;
    copy_rooms: Record<string, ROOM> | null;
    shadow_rooms: ROOM[] | null;
    public_rooms: ROOM[] | null;
    owner: string | null;
    temp: Record<string, any> | null;
    can_diaoyu: boolean;
    on_leave: ((obj: CHARACTER, dir: string) => boolean | void) | null;
    on_before_enter: ((obj: CHARACTER) => void) | null;
    on_enter: ((obj: CHARACTER) => void) | null;
    on_heart_beat: ((dt: number) => void) | null;
    on_login: ((user: USER) => void) | null;
    on_create: ((path: string, par?: string) => void) | null;
    on_set_difficulty: ((isdiff: boolean) => void) | null;

    do_leave(obj: ITEM, dir: string, leave_msg: string): boolean | undefined;
    do_enter(obj: ITEM, isshow: boolean, in_msg: string): void;
    to_json(): string;
    send_exits(obj: CHARACTER): void;
    item_changed(obj: ITEM, isadd: boolean, msg?: string, dir?: string): boolean | undefined;
    get_path(): string;
    create(path: string, par?: string): void;
    query_commands(): string;
    add_exit(dir: string, to: string): void;
    remove_exit(dir: string): void;
    set_item(name: string, path: string, desc?: string): void;
}

/** AREA 区域类 */
declare class AREA {
    name: string;
    id: string;
    desc: string;
    is_area: boolean;
    is_show: boolean;
    rooms: ROOM[];
    map: any[];
    first: string | null;
    is_copy: boolean;
    is_multi: boolean;
    expend: number;
    index: number;
    exp: number;
    pot: number;
    not_fb: boolean;
    recover_room: string | null;
    drop_list: any[] | null;
    diff_drop_list: any[] | null;
    drop_npcs0: any[] | null;
    drop_npcs1: any[] | null;
    family: string | null;
    is_public: boolean;
    json: any;
    room_path: string | null;
    fb_index: number;
    actions: Record<string, { name: string; action: Function }> | null;
    drop_items: any[] | null;
    on_login: ((user: USER) => void) | null;
    on_leave: ((me: USER) => boolean) | null;
    on_enter: ((me: USER) => void) | null;
    on_enterd: ((me: USER) => void) | null;

    create(path: string): void;
    on_leaved(me: USER): void;
    static Get(id: string): AREA | undefined;
}

/** FAMILY_AREA 门派区域类 */
declare class FAMILY_AREA extends AREA { }

// ============================================================
// 命令
// ============================================================

/** BASE 所有类的根基类 */
declare class BASE {
    set(pars?: Partial<this> & { [key: string]: any }): void;
    inherits(child: any, parent: any): void;
    random(max: number): number;
    call_out(fn: Function, delay: number): void;
    create_uid(): string;
}

/** COMMAND 命令基类 */
declare class COMMAND extends BASE {
    command: string;
    regex: RegExp | null;
    exec: Function | null;
    allow_fight: boolean;
    allow_die: boolean;
    allow_faint: boolean;
    allow_state: boolean;
    allow_busy: boolean;
    allow_level: number;
    allow_login: boolean;

    enter(me: CHARACTER | null, arg?: string, _par2?: any, _par3?: any): boolean | void;
    for_item(item: Function, name?: string): void;
    create(fname: string): void;
    update(): void;
    static DO(cmd: string, par1?: any, par2?: any, par3?: any): void;
}

// ============================================================
// 任务
// ============================================================

/** TASK 系统任务 */
declare class TASK {
    id: string;
    path: string;
    startup(oldtask?: TASK): void;
    stop(): void;
    create(): void;
}

/** USERTASK 玩家任务 */
declare class USERTASK {
    id: string;
    path: string;
    on_create: (() => void) | null;
    query_title(): string | undefined;
    start(player?: USER): any;
    query_desc(): string | undefined;
    query_state(): number;
    create(path: string): void;
    static RUN(id: string, player: USER): any;
    static GET(id: string): USERTASK | undefined;
}

// ============================================================
// UTIL / WORLD / BASE 等全局对象
// ============================================================

/** UTIL 工具集 */
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

/** WORLD 全局游戏世界对象 */
declare const WORLD: {
    USERS: USER[];
    COMMANDS: Record<string, COMMAND>;
    SKILLS: Record<string, SKILL>;
    ROOMS: Record<string, ROOM>;
    RUN_ROOMS: ROOM[];
    DEFAULT_SKILLS: Record<string, any>;
    AREAS: AREA[];
    TASKS: USERTASK[];
    SYSTEMTASKS: TASK[];
    USER_EVENTS: any[];
    OBJ_STROE: Map<string, any>;
    NPC_STROE: Map<string, any>;
    HEARTBEATCOUNT: number;
    RECEIVED: any[];
    LOGS: any[];
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
    MESSAGE: any;
    STATS: any;
    status: number;
    heartbeat_interval: number;
    heart_beat_service: any;
    SERVER: any;
    DEFAULT_COMMAND: COMMAND | null;

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
    admin_user: number;
};
