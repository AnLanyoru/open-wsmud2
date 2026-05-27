/**
 * 全局类型声明 — 为 world/ 目录下的内容文件提供类型推断和代码补全
 *
 * world/ 中的文件通过 BASE.CREATE → BASE.NEW → func.apply(obj) 流程执行，
 * 内容脚本内通过 this.inherits(ROOM/NPC/...) 动态继承 os/ 中定义的类。
 *
 * 所有类通过全局赋值 (CLASSNAME = class CLASSNAME ...) 暴露到 globalThis，
 * 运行时在 sloppy mode 下自动成为全局变量。
 */

// ============================================================
// 基础工具类型
// ============================================================

/** 具有原型和可选 __initInstance 的构造函数（兼容 ES6 class 和旧式 function） */
interface Constructor {
    prototype: object;
    __initInstance?(obj: object): void;
    apply(thisArg: object, args?: any[]): void;
}

/** 通过 this.set({}) 或 this.inherits() 可能获得的混合属性 */
interface BaseProps {
    /** 名称 */
    name?: string;
    /** 描述 */
    desc?: string;
    /** 称号 */
    title?: string;
    /** 性别 */
    gender?: number;
    /** 年龄 */
    age?: number;
    /** 容貌 */
    per?: number;
    /** 臂力 */
    str?: number;
    /** 根骨 */
    con?: number;
    /** 身法 */
    dex?: number;
    /** 悟性 */
    int?: number;
    /** 福缘 */
    kar?: number;
    /** 最大气血 */
    max_hp?: number;
    /** 最大内力 */
    max_mp?: number;
    /** 内力上限 */
    limit_mp?: number;
    /** 等级 */
    level?: number;
    /** 经验 */
    exp?: number;
    /** 潜能 */
    pot?: number;
    /** 金钱 */
    money?: number;
    /** 所属门派 */
    family?: FAMILY;
    /** 门派等级 */
    family_level?: number;
    /** 动态属性加成 */
    prop?: { [key: string]: number | { [sk: string]: number } };
    /** 资源路径 */
    path?: string;
    /** 颜色名称（缓存） */
    color_name?: string;
    /** 技能数据 */
    skills?: { [id: string]: SkillData };
    /** 临时键值存储（含过期机制 {v, e}） */
    temp?: { [key: string]: any };
    /** 状态效果列表 */
    status?: StatusItem[];
    /** 装备槽（按 EQUIP_TYPE 索引） */
    equipment?: (EQUIPMENT | null)[];
    /** 背包物品 */
    items?: OBJ[];
    /** 是否允许在战斗中执行 */
    allow_fight?: boolean;
    /** 绝招是否自动释放 */
    auto_pfm?: boolean;
    [key: string]: any;
}

/** 单个技能的数据结构 */
interface SkillData {
    /** 技能等级 */
    level: number;
    /** 技能经验 */
    exp: number;
    /** 当前启用的特殊技能 ID */
    enable_skill?: string;
    /** 进阶属性索引 */
    addin?: number[];
    /** 引用路径 */
    ref?: string;
    [baseSkill: string]: any;
}

/** 状态效果（Buff/Debuff） */
interface StatusItem {
    /** 状态 ID */
    id: string;
    /** 状态名称 */
    name: string;
    /** 持续时间（秒） */
    duration: number;
    /** 叠加模式：0=不可叠加 1=叠加层数 2=刷新时间 */
    override: number;
    /** 当前叠加层数 */
    count: number;
    /** 最大叠加层数 */
    max_count: number;
    /** 状态开始时间 */
    start_time: number;
    /** 定时触发回调 */
    on_interval?: (me: CHARACTER, count: number) => boolean | void;
    /** 是否忙碌状态 */
    is_busy?: boolean;
    /** 是否昏迷状态 */
    is_faint?: boolean;
    /** 是否闪避状态 */
    is_miss?: boolean;
    /** 是否鲁莽状态 */
    is_rash?: boolean;
    /** 是否残影状态 */
    is_shadow?: boolean;
    /** 是否仅战斗内生效 */
    only_combat?: boolean;
    /** 负面状态类型标识 */
    downside?: any;
    /** 是否禁止清除 */
    no_clear?: boolean;
    /** 是否禁止叠加 */
    no_diff?: boolean;
    /** 状态附加的属性效果 */
    prop?: { [key: string]: number };
    /** 状态开始时消息 */
    start_msg?: string;
    /** 状态结束时消息 */
    finish_msg?: string;
    /** 定时器句柄 */
    handler?: number;
    /** 无视控制标记 */
    ig_control?: number;
    /** 状态附加时回调 */
    on_attach?: (me: CHARACTER) => void;
    /** 状态到期时回调 */
    on_expire?: (me: CHARACTER) => void;
    /** 持续时间计数 */
    duration_count?: number;
    /** 叠加层数计数 */
    over_count?: number;
}

// ============================================================
// 核心基类 BASE
// ============================================================

declare class BASE {
    /** 资源路径 */
    path: string;
    /** 对象 ID */
    id: string;
    /** 唯一标识符 */
    uid: string;
    /** 事件覆盖注册表 */
    _events: { [name: string]: Array<{ func: Function; time: number }> | null };

    // 静态成员
    /** 已加载资源缓存 */
    static ITEMS: { [fkey: string]: Function };
    /** 文件路径解析正则：路径/#参数 */
    static PATH_REG: RegExp;
    /** 初始化实例属性（供 inherits 使用） */
    static __initInstance(obj: object): void;
    /** 根据文件路径创建对象 */
    static CREATE(path: string, fname: string): BASE | undefined;
    /** 克隆占位 */
    static CLONE(fname: string): void;
    /** 实例化对象 */
    static NEW(fname: string, func: Function, par?: string): BASE;
    /** 热更新资源文件 */
    static UPDATE(path: string, fname: string): void;

    // 实例方法

    /** 批量设置属性 */
    set(pars: { [key: string]: any }): void;

    /**
     * 动态继承 — 设置原型链为父类 prototype，并调用 __initInstance（或 apply）初始化实例属性。
     * 调用后 this 的类型将收窄为包含父类实例类型的交叉类型。
     */
    inherits<T extends Constructor>(ctor: T): asserts this is this & T['prototype'];

    /** 对象创建回调 */
    create(fname: string, ctor?: string): void;

    /** 对象更新回调 */
    update(fname: string, par?: string): void;

    /** 延时调用 */
    call_out(func: (...args: any[]) => any, time: number, arg1?: any, arg2?: any): number;

    /** 间隔调用（func 返回 false 或 count 耗尽时终止） */
    call_interval(func: (index: number) => boolean | void, time: number, count: number, end_func?: () => void): number;

    /** 生成唯一标识符 */
    create_uid(): string;

    /** 生成 0 ~ num-1 之间的随机整数 */
    random(num: number): number;

    /** 添加方法覆盖事件（定时或永久） */
    add_event(fname: string, func: (...args: any[]) => any, time?: number): void;

    /** 移除方法覆盖事件 */
    remove_event(name: string, func: Function): void;

    /** 触发事件链 */
    fire_event(name: string): boolean | undefined;
}

// ============================================================
// ITEM — 所有物件的基类
// ============================================================

declare class ITEM extends BASE {
    /** 名称 */
    name: string;
    /** 描述 */
    desc: string;
    /** 所处环境（房间） */
    environment: ROOM | null;
    /** 子物品列表 */
    items: ITEM[];
    /** 可交互命令 */
    actions: { [cmd: string]: { name: string; action: (...args: any[]) => any } };
    /** 最大携带物品数 */
    max_item_count: number;
    /** JSON 缓存 */
    json: string | null;
    /** 是否玩家 */
    is_player?: boolean;
    /** 当前气血 */
    hp: number;
    /** 当前内力 */
    mp: number;
    /** 最大气血 */
    max_hp: number;
    /** 最大内力 */
    max_mp: number;
    /** 战斗类型（0=和平 1=比试 2=生死） */
    fight_type: number;
    /** 是否禁止战斗 */
    no_fight?: boolean;
    /** 技能检查回调（如拜师条件验证） */
    on_checkskill?: (me: CHARACTER) => boolean;
    /** 确认师父身份回调 */
    on_master?: (me: CHARACTER) => boolean;
    /** 出售物品列表 */
    sell_list?: OBJ[];
    /** 师父 ID */
    master?: string;
    /** 物品类型标签（用于分类筛选） */
    item_types?: string;
    /** 是否禁止发送消息 */
    no_message?: boolean;

    static __initInstance(obj: object): void;

    /** 心跳处理（每帧调用） */
    heart_beat(dt: number): void;
    /** 初始化 */
    init(): void;
    /** 添加可交互命令 */
    add_action(cmd: string, name: string, func: (...args: any[]) => any): { name: string; action: Function };
    /** 移除可交互命令 */
    remove_action(name: string | string[]): void;
    /** 执行命令 */
    exec(cmdName: string, pars: any[]): boolean;
    /** 查询当前携带物品数量 */
    item_count(): number;
    /** 判断是否已满 */
    is_full(val?: number): boolean;
    /** 根据 ID 查找子物品 */
    find_obj(id: string): ITEM | null;
    /** 根据路径查找子物品 */
    find_obj_bypath(path: string, parent?: ITEM): ITEM | undefined;
    /** 遍历子物品 */
    each_item(func: (item: ITEM) => boolean | void, parent?: ITEM): void;
    /** 判断是否等于某物品（按路径匹配） */
    is(obj: ITEM | string | null): boolean;
    /** 根据 ID 移除物品（支持拆分） */
    remove_item_byid(obj: string, count?: number): ITEM | null;
    /** 移除物品（支持拆分） */
    remove_item(obj: ITEM, count?: number): ITEM | null;
    /** 移动物品到目标容器 */
    move_item_to(obj: ITEM, count: number, target: ITEM): ITEM | undefined;
    /** 接收物品并入容器 */
    push_item(moved_obj: ITEM): ITEM | undefined;
    /** 创建新 ID */
    create_id(): void;
    /** 刷新 JSON 缓存 */
    refresh(): void;
    /** 是否隐藏 */
    is_hidden(): boolean;
    /** 根据创建 ID 反查创建时间 */
    query_create_time(): Date | undefined;
    /** 在数组中根据 ID 查找物品 */
    find_obj_byid(items: ITEM[], oid: string): ITEM | undefined;
    /** 获取完整显示名称 */
    long_name(): string;
    /** 销毁对象 */
    destroy(msg?: string): void;
    /** 格式化临时数据为 JSON 片段 */
    format_temp(temp: { [key: string]: any }, timeout?: number): string;

    // 事件回调
    /** 对象创建完成回调 */
    on_create?: (path: string, par?: string) => void;
    /** 心跳回调 */
    on_heart_beat?: (dt: number) => void;
    /** 物件进入回调 */
    on_enter?: (obj: ITEM) => void;
    /** 物件离开回调（返回 true 阻止离开） */
    on_leave?: (obj: ITEM, dir?: string) => boolean | void;
    /** 初始化回调 */
    on_init?: (me: CHARACTER) => void;
    /** 使用回调 */
    on_use?: (me: CHARACTER) => boolean | void;
    /** 学习/研读回调 */
    on_study?: (me: CHARACTER) => boolean | void;
    /** 打开回调 */
    on_open?: (me: CHARACTER) => boolean | void;
    /** 死亡回调 */
    on_die?: (killer: CHARACTER) => boolean | void;
}

// ============================================================
// CHARACTER — 生物基类
// ============================================================

declare class CHARACTER extends ITEM {
    /** 臂力（影响攻击力） */
    str: number;
    /** 根骨（影响气血成长和防御） */
    con: number;
    /** 身法（影响躲闪和攻击速度） */
    dex: number;
    /** 悟性（影响技能学习效率） */
    int: number;
    /** 容貌 */
    per?: number;
    /** 性别 */
    gender: number;
    /** 金钱 */
    money: number;
    /** 经验 */
    exp: number;
    /** 潜能 */
    pot: number;
    /** 积分 */
    score: number;
    /** 等级 */
    level: number;
    /** 用户等级（VIP 等级） */
    user_level?: number;
    /** 所属门派 */
    family: FAMILY;
    /** 当前攻击技能 */
    attack_skill: SKILL;
    /** 当前闪避技能 */
    dodge_skill: SKILL;
    /** 当前招架技能 */
    parry_skill: SKILL;
    /** 当前内功技能 */
    force_skill: SKILL;
    /** 当前空手技能 */
    noweapon_skill: SKILL;
    /** 敌人列表 */
    enemy: CHARACTER[];
    /** 攻击定时器句柄 */
    attack_handler: number | null;
    /** 绝招释放时间 */
    release_time: number;
    /** 攻击速度 */
    gjsd: number;
    /** 命中 */
    mz: number;
    /** 躲闪 */
    ds: number;
    /** 自动释放技能列表 */
    auto_skills?: Array<{ type: string; pfm: PERFORM; release_time: number; ban_use?: boolean }>;
    /** 是否昏迷 */
    is_faint?: boolean;
    /** 是否忙碌 */
    is_busy?: boolean;
    /** 是否闪避中 */
    is_miss?: boolean;
    /** 是否鲁莽状态 */
    is_rash?: boolean;
    /** 是否残影状态 */
    is_shadow?: boolean;
    /** 玩家状态（如打坐、修炼、挖矿等） */
    state?: {
        /** 状态标题 */ title: string; /** 状态速率 */ rate: number; /** 是否允许战斗中 */ allow_fight?: boolean;
        /** 心跳计数 */ heat_count: number; /** 开始时间 */ start_time: number; /** 状态描述 */ desc?: string;
        /** 是否禁止停止 */ no_stop?: boolean; /** 状态下可用命令 */ commands?: string;
        /** 进入状态回调 */ on_enter?: (me: CHARACTER, dt: number) => boolean | void;
        /** 停止状态回调 */ on_stop?: (me: CHARACTER, isauto?: boolean) => boolean | void;
    };
    /** 跟随目标 */
    follow_target?: CHARACTER | null;
    /** 被跟随者列表 */
    follow_targets?: CHARACTER[];
    /** 队伍成员 */
    team?: CHARACTER[];
    /** 攻击部位信息 */
    attack_part?: { name: string; hert: number; crit: number };
    /** 伤害记录（按玩家 ID 累计） */
    damages?: { [playerId: string]: number };
    /** 是否记录伤害 */
    record_damage?: boolean;
    /** 动态属性加成 */
    prop?: { [key: string]: number };
    /** 战斗临时属性 */
    combat_props?: Array<[string, number]>;
    /** 无视控制标记 */
    ig_control?: number;
    /** 装备组（套装方案） */
    eq_groups?: string[][];
    /** 技能组 */
    sk_groups?: Array<string[] | null>;
    /** 已读书籍列表 */
    books?: string[];
    /** 商店物品列表 */
    stores?: OBJ[];

    static __initInstance(obj: object): void;
    /** 各等级经验上限表 */
    static EXP_LIMIT: number[];

    /** 发送消息（无视状态） */
    send(text?: string): void;
    /** 通知消息（考虑状态） */
    notify(text?: string): void;
    /** 发送操作失败通知 */
    notify_fail(text?: string): boolean;
    /** 是否存活 */
    is_living(): boolean;
    /** 是否在指定路径的房间 */
    is_in(path: string): boolean;
    /** 是否和目标在同一房间 */
    is_here(obj: CHARACTER): boolean;
    /** 发送房间消息（多视角占位符替换） */
    send_room(text: string, target?: CHARACTER, excludeself?: boolean): void;
    /** 发送战斗消息 */
    send_combat(text: string, target?: CHARACTER): void;
    /** 向房间内所有人发送消息 */
    send_message(msg: string, include_me?: boolean): void;
    /** 查询用户设置值 */
    query_setting(name: string): number;
    /** 第三人称代词（他/她/它） */
    call3(): string;
    /** 解析并执行命令字符串 */
    command(req: string): void;
    /** 开始比试 */
    do_fight(target: CHARACTER): void;
    /** 开始击杀 */
    do_kill(target: CHARACTER): void;
    /** 添加敌人 */
    add_enemy(target: CHARACTER): void;
    /** 通知房间内玩家 HP/MP 变化 */
    notify_hp(type?: string, val?: number): void;
    /** 增/减气血 */
    add_hp(v: number): number;
    /** 增/减内力 */
    add_mp(v: number): number | undefined;
    /** 是否在战斗中 */
    is_fighting(p?: CHARACTER): boolean;
    /** 结束战斗 */
    end_fight(): boolean | undefined;
    /** 查询当前有效敌人 */
    query_enemy(): CHARACTER | undefined;
    /** 是否可攻击 */
    can_attack(): boolean;
    /** 结束对某目标的一轮攻击 */
    end_attack(target: CHARACTER): boolean | undefined;
    /** 随机查询攻击部位 */
    query_part(): { name: string; hert: number; crit: number };
    /** 恢复满血满蓝 */
    full(): void;
    /** 清除绝招冷却 */
    clear_distime(pfmid?: string): void;
    /** 执行攻击动作 */
    do_attacks(par: any): void;
    /** 移动到房间 */
    moveto(rm: ROOM | string, leave_msg?: string, in_msg?: string, dir?: string): boolean | undefined;
    /** 跟随/取消跟随 */
    do_follow(target: CHARACTER | null): void;
    /** 清除所有跟随关系 */
    clear_follow(): void;
    /** 通知跟随者一起移动 */
    notify_follower(dir: string): void;
    /** 尝试逃跑 */
    do_escape(): boolean;
    /** 退出队伍 */
    team_out(msg: string): void;
    /** 装备物品 */
    equip(obj: EQUIPMENT): boolean | undefined;
    /** 卸下装备 */
    unequip(obj: EQUIPMENT, notsend?: boolean, recover_time?: number): boolean | undefined;
    /** 武器变更处理 */
    weapon_changed(iseq: boolean): void;
    /** 添加物品到背包 */
    add_obj(obj: OBJ | string, count?: number): OBJ | undefined;
    /** 从背包移除物品 */
    remove_obj(obj: OBJ | string, count?: number): OBJ | undefined;
    /** 获取当前武器 */
    query_weapon(): EQUIPMENT | undefined;
    /** 获取当前武器类型 */
    query_weapon_type(): string;
    /** 获取武器名称 */
    weapon_name(): string;
    /** 获取暗器名称 */
    throwing_name(): string;
    /** 获取指定类型装备 */
    get_equipment(type: number): EQUIPMENT | undefined;
    /** 设置掉落列表 */
    set_drop(...args: any[]): void;
    /** 查询掉落物品 */
    query_drop(): OBJ[] | undefined;
    /** 设置初始佩戴物品 */
    set_objects(...args: Array<[string, number, boolean?]>): void;
    /** 创建角色（模板注册到 WORLD.NPC_STROE） */
    create(path: string, par?: string): void;
    /** 克隆实例到场景 */
    clone(): void;
    /** 初始化战斗技能 */
    init_skill(): void;
    /** 查询技能等级（含属性加成） */
    query_skill(name: string, def?: number): number;
    /** 设置技能等级 */
    set_skill(skid: string, level: number): void;
    /** 移除技能 */
    remove_skill(skillid: string): boolean | undefined;
    /** 查询当前技能等级上限 */
    skill_limit(): number;
    /** 批量设置技能 */
    skill_map(...args: Array<[string, number, (string | string[])?]>): void;
    /** 装备/卸下特殊技能 */
    enable_skill(base: string, skill: string | null): boolean;
    /** 查询当前使用的技能 */
    query_used_skill(skname: string): SKILL;
    /** 查询技能引用的绝招 */
    query_ref_skill(skill: any): PERFORM | undefined;
    /** 是否装备了某技能到指定基本技能 */
    is_enable_skill(skid: string, type: string): boolean | undefined;
    /** 增加属性加值 */
    add_prop(p: string, v: number): void;
    /** 清除所有属性加值 */
    clear_prop(): void;
    /** 查询属性加值 */
    query_prop(name: string): number;
    /** 批量变更属性（isadd=true 增加，false 减少） */
    change_prop(prop: { [key: string]: number | any }, isadd: boolean): void;
    /** 增加内力上限 */
    add_maxmp(count: number): void;
    /** 查询临时数据 */
    query_temp<T = any>(name: string, def?: T): T;
    /** 设置临时数据 */
    set_temp(name: string, value: any, time?: number): void;
    /** 移除临时数据 */
    remove_temp(name: string): void;
    /** 累加临时数据 */
    add_temp(name: string, value: number, time?: number): number;
    /** 增加副本分数 */
    add_fbscore(v: number, max?: number): void;
    /** 查询副本分数 */
    query_fbscore(v?: any): number;
    /** 增加积分 */
    add_score(val: number): void;
    /** 添加战斗临时属性 */
    add_combat_prop(name: string, val: number): void;
    /** 清除战斗临时属性并重新计算 */
    clear_combat_prop(): void;
    /** 添加状态效果 */
    add_status(buff: StatusItem, from?: CHARACTER): boolean | undefined;
    /** 移除状态效果 */
    remove_status(sid: string, isall?: boolean): void;
    /** 清除指定类型的负面状态 */
    clear_downside(type: any): number | undefined;
    /** 清除战斗结束后的临时状态 */
    clear_combat_status(): void;
    /** 清除所有状态 */
    clear_status(): void;
    /** 查询指定状态的叠加层数 */
    query_status(sid: string): number;
    /** 死亡处理 */
    die(killer?: CHARACTER): boolean | undefined;
    /** 获取等级描述（含颜色） */
    get_level_desc(): string;
    /** 获取等级颜色 */
    get_level_color(): string;
    /** 查询称号 */
    query_title(type?: string): string | null;
    /** 查询年龄 */
    query_age(): number;
    /** 门派称谓（如"大师兄"） */
    call(isbad?: boolean): string;
    /** 自称（如"小弟"） */
    callme(isbad?: boolean): string;
    /** 同门师兄弟姐妹称谓 */
    fam_call(target: CHARACTER): string;
    /** 是否同队伍/同门派 */
    is_team(p: CHARACTER): boolean;
    /** 向队伍发送消息 */
    send_team(msg: string, nome?: boolean): void;
    /** 查询队伍 ID */
    query_teamid(): string | null;
    /** 查询状态 JSON */
    query_status(): string;
    /** 查询外观描述 */
    query_desc(me?: CHARACTER, eqcmd?: string): string;
    /** 格式化装备显示 */
    format_equipments(call3: string, str: string[], eqcmd?: string): void;
    /** 增加经验/潜能/金钱 */
    add_exp(exp?: number, pot?: number, money?: number): void;
    /** 增加金钱 */
    add_money(val: number): boolean | void;
    /** 查询内功加成比例 */
    query_force_rad(): number;
    /** 向门派频道发送消息 */
    send_fam(str: string): void;
    /** 重新计算所有属性 */
    recount(): void;
    /** 初始化技能后回调 */
    on_skillchanged?(): void;

    // 回调钩子
    /** 等待用户输入回调 */
    wait_input?: (me: CHARACTER, req: string) => void;
    /** 克隆完成回调 */
    on_clone?: () => void;
    /** 被杀回调 */
    on_died?: (killer?: CHARACTER, corpse?: CORPSE) => void;
    /** 逃跑回调（返回 true 阻止逃跑） */
    on_escape?: (me: CHARACTER) => boolean;
    /** 战斗结束回调 */
    on_fight_over?: (target: CHARACTER, won: boolean) => void;
    /** 师父检查学习条件回调 */
    on_master_learn?: (me: CHARACTER, skillId: string) => boolean | void;
    /** 师父看到玩家进入回调 */
    on_master_enter?: (me: CHARACTER) => void;
    /** 双修回调 */
    on_makelove?: (me: CHARACTER) => void;
    /** 玩家加入队伍回调 */
    on_teamin?: (me: CHARACTER) => void;
    /** 玩家离开队伍回调 */
    on_teamout?: (me: CHARACTER) => void;
    /** 师父离开房间回调（返回 true 阻止离开） */
    on_master_leave?: (me: CHARACTER, nextrm: ROOM) => boolean;
    /** 物件进入前回调 */
    on_before_enter?: (obj: ITEM) => void;
    /** 重载回调 */
    on_reload?: (me: CHARACTER) => void;
}

// ============================================================
// USER — 玩家类
// ============================================================

declare class USER extends CHARACTER {
    /** WebSocket 连接 */
    socket: any;
    /** 标记为玩家 */
    is_player: true;
    /** 密码哈希 */
    password: string;
    /** 登录时间戳 */
    loginTime: number;
    /** 用户设置 */
    settings: { [key: string]: number };
    /** 请求计数（用于频率限制） */
    request_count: number;
    /** 断线时间 */
    disconnect_time?: number;
    /** 元宝数量 */
    cash_money: number;
    /** 随从数据 */
    follower?: Array<{ id: string; path: string }> | null;
    /** 退出后所在房间路径 */
    quit_room?: string;
    /** 登录欢迎消息 */
    login_message: string | null;
    /** 命令按钮 JSON 缓存 */
    commands_json: string | null;
    /** 称号列表 */
    titles?: Array<{ title: string; type: string; use: boolean }>;
    /** 当前装备方案索引 */
    eq_group: number;
    /** 最大仓库容量 */
    max_store_count: number;
    /** IP 地址信息 */
    id_address?: any;

    static __initInstance(obj: object): void;

    /** 发送登录初始化消息 */
    send_loginmessage(): void;
    /** 重新连线（顶号） */
    relogin(newUser: USER): void;
    /** 获取 IP 地址 */
    ip(): string;
    /** 退出游戏 */
    quit(): void;
    /** 断线处理 */
    disconnect(isreplace?: boolean): void;
    /** 从数据库记录加载用户数据 */
    loadData(role: { id: string; name: string; level: number; data: string; user_level: number }): void;
    /** 读取物品数组 */
    read_items(items: Array<Array<any>>): OBJ[];
    /** 读取称号数据 */
    read_titles(titles: Array<[string, string, number]>): void;
    /** 执行登录初始化流程 */
    do_login(): void;
    /** 获取玩家存档数据 */
    getData(): { id: string; userid: any; name: string; level: number; title: string; data: string };
    /** 保存玩家数据到数据库 */
    save(): void;
    /** 检查并同步玩家状态到客户端 */
    check_state(): void;
    /** 查询操作命令 JSON */
    query_commands(player?: USER): string;
    /** 发送警告消息 */
    send_warn(content: string, cmds: string[], time?: number): void;
    /** 发送命令按钮列表 */
    send_commands(...args: string[]): void;
    /** 设置用户配置项 */
    set_setting(name: string, value: string | number): void;
    /** 玩家心跳处理 */
    heart_beat(dt: number): void;
    /** 设置玩家状态（如打坐、修炼等） */
    set_state(state: any, isauto?: boolean): void;
    /** 获取状态文本描述 */
    get_state(): string;
    /** 通知客户端物品变更 */
    items_changed(item: OBJ, drop_count?: number): void;
    /** 添加物品到背包 */
    add_obj(obj: OBJ | string, count?: number): OBJ | undefined;
    /** 从背包移除物品 */
    remove_obj(obj: OBJ | string, count?: number): OBJ | undefined;
    /** 查询家园房间 */
    query_home(rm_name?: string): ROOM | null;
    /** 回到家园 */
    go_home(): void;
    /** 增加元宝 */
    add_cash(count: number, desc: string): void;
    /** 查询元宝数量 */
    query_cash(is_cash?: boolean): number;
    /** 是否可以跟随此 NPC */
    can_follow(npc: NPC): boolean;
    /** 添加随从 */
    add_follower(npc: NPC): boolean;
    /** 清除家园和随从 */
    clear_home(clear_follower?: boolean): void;
    /** 增加积分 */
    add_score(val: number): void;
    /** 是否有 Socket 连接 */
    is_connect(): boolean;
    /** 是否已进入游戏世界 */
    in_world(): boolean;
    /** 添加称号 */
    add_title(title: string, type: string): void;
    /** 初始化用户任务 */
    init_tasks(): void;
    /** 查询精力值 */
    query_jingli(): number;
    /** 查询当前等级的精力上限 */
    query_jclimit(): number;
}

// ============================================================
// NPC — 非玩家角色
// ============================================================

declare class NPC extends CHARACTER {
    /** 绝招是否自动释放 */
    auto_pfm: boolean;
    /** 闲聊消息列表 */
    chat_msg?: string[];
    /** 确认师父身份回调 */
    on_master?: (me: CHARACTER) => boolean;
    /** 是否禁止刷新 */
    no_refresh?: boolean;
    /** 询问话题 */
    question?: { [topic: string]: any };
    /** 死亡后所在房间 */
    die_room?: ROOM;

    static __initInstance(obj: object): void;

    /** 设置闲聊消息 */
    set_chat_msg(items: string[], chance?: number): void;
    /** 随机发送闲聊 */
    do_chat_msg(): void;
    /** 格式化装备显示 */
    format_equipments(call3: string, str: string[], eqcmd?: string): void;
    /** 设置出售物品列表 */
    set_goods(...args: string[]): void;
    /** 查询操作命令 JSON */
    query_commands(player?: USER): string;
    /** 构建详细命令 JSON */
    query_commands_json(player: USER, isyb: boolean): string;
    /** 更新交互命令 */
    update_action(acts: { [cmd: string]: { name: string; action: Function } }): void;
    /** NPC 死亡处理 */
    die(killer?: CHARACTER): boolean | undefined;
    /** NPC 复活刷新 */
    relive(): void;
    /** 销毁 NPC */
    destroy(msg?: string): void;
    /** NPC 心跳 */
    heart_beat(dt: number): void;

    /** 创建 NPC 实例到场景 */
    static CREATE(path: string, env: ROOM | CHARACTER, oncreate?: (npc: NPC) => void, count?: number): NPC;
    /** 克隆 NPC */
    static CLONE(path: string): NPC;
    /** 获取 NPC 模板 */
    static GET(path: string): NPC;
}

// ============================================================
// MONSTER — 怪物类
// ============================================================

declare class MONSTER extends CHARACTER {
    /** 是否能说话 */
    can_speek: boolean;

    static __initInstance(obj: object): void;

    /** 初始化技能（默认撕咬/闪避/招架/内功） */
    init_skill(): void;
    /** 查询描述 JSON */
    query_desc(me?: USER): string;
    /** 查询操作命令 JSON */
    query_commands(player?: USER): string;
    /** 第三人称代词（它） */
    call3(): string;
    /** 销毁怪物 */
    destroy(msg?: string): void;
    /** 怪物死亡处理 */
    die(killer?: CHARACTER): boolean | undefined;
    /** 随机查询攻击部位 */
    query_part(): { name: string; hert: number; crit: number };
    /** 怪物心跳 */
    heart_beat(dt: number): void;
}

// ============================================================
// FOLLOWER — 随从类
// ============================================================

declare class FOLLOWER extends CHARACTER {
    /** 主人 ID */
    master: string | null;
    /** 主人名称 */
    master_name: string | null;
    /** 消息监听者（用于人称翻译） */
    listener?: USER | null;
    /** 主人存档 JSON 缓存 */
    master_json: string | null;

    static __initInstance(obj: object): void;

    /** 查询随从设置 */
    query_setting(name: string): number;
    /** 设置随从配置 */
    set_setting(name: string, value: string | number): void;
    /** 发送消息（代人翻译人称） */
    send(text: string): void;
    /** 通知失败 */
    notify_fail(text: string): boolean;
    /** 通知消息 */
    notify(text: string): void;
    /** 设置消息监听者 */
    set_listener(me: CHARACTER, target: USER): void;
    /** 保存随从数据 */
    save(me: USER): string;
    /** 随从死亡 */
    die(killer?: CHARACTER): boolean | undefined;
    /** 随从心跳 */
    heart_beat(dt: number): void;
    /** 设置随从状态 */
    set_state(state: any, isauto?: boolean): void;
    /** 查询主人专用命令 JSON */
    query_mastercommands(): string;
    /** 查询命令列表（区分主人/他人） */
    query_commands(player?: USER): string;
    /** 回应询问 */
    on_ask(me: USER, par: string): void;
    /** 加入队伍回调 */
    on_teamin(me: USER): void;
    /** 离开队伍回调 */
    on_teamout(me: USER): void;
    /** 完整显示名称 */
    long_name(): string;
    /** 进入房间回调 */
    on_enter(me: CHARACTER): void;
    /** 主人离开回调 */
    on_master_leave(me: CHARACTER, nextrm: ROOM): boolean;

    /** 随从全局存储 */
    static STORES: Map<string, FOLLOWER>;
    /** 清除所有随从 */
    static CLEAR(me: USER): void;
    /** 重置随从 */
    static RESET(me: USER): void;
    /** 从用户数据初始化随从 */
    static INIT_FROM_USER(me: USER, datas: Array<{ id: string; path: string }>): void;
    /** 初始化单个随从 */
    static INIT(me: USER, par: { path: string; id: string }): FOLLOWER | undefined;
    /** 替换随从信息 */
    static REPLACE(me: USER, old: FOLLOWER, npc: NPC): void;
    /** 获取随从 */
    static GET(me: USER, par: { id: string }): FOLLOWER | undefined;
    /** 创建随从 */
    static CREATE(me: USER, par: { path: string; id: string }, callback: (npc: FOLLOWER) => void): void;
    /** 保存所有随从数据 */
    static SAVE(me: USER): string;
}

// ============================================================
// ROOM — 房间类
// ============================================================

declare class ROOM extends ITEM {
    /** 所属区域 */
    parent: AREA | null;
    /** 出口映射（方向 → 房间路径） */
    exits?: { [dir: string]: string };
    /** 完整显示名称 */
    long_name: string;
    /** 是否禁止战斗 */
    no_fight?: boolean;
    /** 是否禁止存档 */
    no_save?: boolean;
    /** 是否禁止投影 */
    no_shadow?: boolean;
    /** 是否副本房间 */
    is_copy_room?: boolean;
    /** 是否投影房间 */
    is_shadow?: boolean;
    /** 房间所有者 ID */
    owner?: string;
    /** 副本房间集合 */
    copy_rooms?: { [id: string]: ROOM };
    /** 投影房间列表 */
    shadow_rooms?: ROOM[];
    /** 隐藏物品列表 */
    hidden_items?: any[];
    /** 出口 JSON 缓存 */
    room_exits_json: string | null;
    /** 命令 JSON 缓存 */
    commands_json: string | null;
    /** 创建时间戳 */
    create_time?: number;

    static __initInstance(obj: object): void;

    /** 玩家/物件离开房间 */
    do_leave(obj: ITEM, dir: string, leave_msg?: string): boolean | undefined;
    /** 玩家/物件进入房间 */
    do_enter(obj: ITEM, isshow?: boolean, in_msg?: string): void;
    /** 房间内容物变更 */
    item_changed(obj: ITEM, isin: boolean, changed_msg?: string, dir?: string): boolean | undefined;
    /** 生成物件 JSON 消息 */
    item_json(item: ITEM, isin: boolean): string;
    /** 生成所有物件列表 JSON */
    items_to_json(): string;
    /** 设置房间 NPC */
    set_npc(...args: Array<string | [string, number]>): void;
    /** 设置房间物品 */
    set_obj(...args: Array<string | [string, number]>): void;
    /** 设置隐藏物品 */
    set_item(id: string, name: string, desc: string, commands: Array<[string, string, Function]>): any;
    /** 查找物件（含隐藏物品） */
    find_obj(oid: string): ITEM | any;
    /** 根据路径查找物件 */
    find_by_path(path: string): ITEM | undefined;
    /** 是否包含指定路径的物件 */
    is_here(path: string): boolean;
    /** 向房间内所有玩家发送消息 */
    notify(msg: string): void;
    /** 查询指定方向是否存在出口 */
    query_exits(dir: string): boolean;
    /** 添加出口 */
    add_exit(dir: string, rm: string): void;
    /** 移除出口 */
    remove_exit(dir: string): void;
    /** 出口变更后通知所有玩家 */
    exits_changed(): void;
    /** 向玩家发送出口信息 */
    send_exits(player: USER): void;
    /** 生成出口 JSON */
    exitsto_roomjson(): string;
    /** 生成房间 JSON */
    to_json(): string;
    /** 查询命令列表 JSON */
    query_commands(): string;
    /** 刷新房间数据 */
    refresh(obj?: any): void;
    /** 获取房间完整路径 */
    get_path(): string;
    /** 查询复活房间路径 */
    query_recover_room(): string;
    /** 房间创建回调 */
    create(file: string): void;
    /** 初始化基础房间模板 */
    initBaseRoom(file: string): void;
    /** 热更新房间 */
    update(file: string): void;
    /** 替换房间 */
    replaceRoom(oldroom: ROOM, newRoom: ROOM): void;
    /** 销毁房间 */
    destroy(): void;
    /** 房间心跳 */
    heart_beat(dt: number): void;
    /** 是否副本房间 */
    is_copy(): boolean;
    /** 是否副本区域房间 */
    is_fb(): boolean;
    /** 是否入口房间 */
    is_enter(): boolean;
    /** 查询副本入口房间 */
    query_fb_first(id: string): ROOM | undefined;
    /** 查询副本房间 */
    query_copy(id: string): ROOM | undefined;
    /** 根据用户查找对应副本 */
    query_copy2(user: USER): ROOM;
    /** 清除副本区域 */
    clear_copy(me: USER): void;
    /** 为用户创建副本 */
    create_copy2(me: USER, diff_type?: number): ROOM | undefined;
    /** 创建副本房间 */
    create_copy(id: string, diff_type: number): ROOM | undefined;
    /** 按区域递归创建副本 */
    create_by_area(area: AREA, id: string, diff_type: number): void;
    /** 创建房间投影 */
    create_shadow(): ROOM | undefined;
    /** 按区域递归清除副本 */
    clear_by_area(area: AREA, id: string): void;
    /** 设置副本难度 */
    set_difficulty(type: number): void;
    /** 向房间内所有玩家发送消息 */
    send(msg: string): void;
    /** 查找房间中第一个玩家 */
    find_me(): USER | undefined;
    /** 查询房间（考虑副本） */
    query(id: string): ROOM | null;
    /** 查询副本房间的临时数据 */
    query_temp(me: USER, name: string, def?: any): any;
    /** 设置副本房间的临时数据 */
    set_temp(me: USER, name: string, value: any, time?: number): void;
    /** 累加副本房间的临时数据 */
    add_temp(me: USER, name: string, value: number, time?: number): number;

    // 回调钩子
    /** 物件离开回调 */
    on_leave?: (obj: ITEM, dir: string) => boolean | void;
    /** 物件进入前回调 */
    on_before_enter?: (obj: ITEM) => void;
    /** 物件进入回调 */
    on_enter?: (obj: ITEM) => void;
    /** 房间创建完成回调 */
    on_create?: () => void;
    /** 心跳回调 */
    on_heart_beat?: (dt: number) => void;
    /** 重新登录回调 */
    on_relogin?: (user: USER) => void;
    /** 设置难度回调 */
    on_set_difficulty?: (type: number) => void;

    /** 根据路径获取房间 */
    static Get(path: string): ROOM | undefined;
    /** 随机获取一个房间 */
    static RANDOM(): ROOM;
}

// ============================================================
// AREA — 区域类
// ============================================================

declare class AREA extends BASE {
    /** 房间列表 */
    rooms: ROOM[];
    /** 小地图数据 */
    map: string[];
    /** 区域名称 */
    name: string;
    /** 是否顶层区域 */
    is_area: boolean;
    /** 入口房间路径 */
    first: string | null;
    /** 是否在小地图显示 */
    is_show: boolean;
    /** 是否副本区域 */
    is_copy: boolean;
    /** 是否禁止副本 */
    not_fb?: boolean;
    /** 副本消耗 */
    expend: number;
    /** 经验奖励基数 */
    exp: number;
    /** 潜能奖励基数 */
    pot: number;
    /** 副本难度索引 */
    fb_index?: number;
    /** 区域 ID */
    id?: string;
    /** 房间文件路径 */
    room_path?: string;
    /** 所属门派 */
    family?: string;
    /** 复活房间路径 */
    recover_room?: string;
    /** 区域描述 */
    desc?: string;
    /** 掉落列表 */
    drop_list?: any[];
    /** 困难难度掉落列表 */
    diff_drop_list?: any[];
    /** 掉落 NPC 列表（普通） */
    drop_npcs0?: string[];
    /** 掉落 NPC 列表（困难） */
    drop_npcs1?: string[];
    /** 掉落物品配置 */
    drop_items?: any;
    /** 区域命令配置 */
    actions?: any;
    /** 子区域 */
    areas?: AREA[];

    static __initInstance(obj: object): void;

    /** 区域创建回调 */
    create(path: string): void;
    /** 区域热更新 */
    update(path: string): void;
    /** 玩家离开区域回调 */
    on_leaved(me: USER): void;
    /** 玩家离开前回调（返回 true 阻止离开） */
    on_leave(me: USER): boolean;
    /** 玩家进入后回调 */
    on_enterd(me: USER): void;
    /** 玩家进入前回调（返回 true 阻止进入） */
    on_enter(me: USER): boolean;
    /** 查找子区域 */
    find_area(path: string): void;
    /** 查询通关记录 */
    is_record(diff: number): any;
    /** 查询区域经验奖励 */
    query_exp(): number;
    /** 查询区域描述 */
    query_desc(): string;
    /** 清除缓存 */
    clear(): void;
    /** 查询掉落列表 */
    query_drops(isdiff?: boolean): any[];
    /** 查询 NPC 掉落 */
    query_npc_drops(npcs: string[], items: any[]): void;
    /** 查询困难模式掉落 */
    query_diff_drops(isdiff?: boolean): any[];
    /** 查询掉落物品 */
    query_drop_items(): any;
    /** 查询区域命令 */
    query_actions(): any;
    /** 副本所有者查询回调 */
    query_owner?(user: USER): string | undefined;

    /** 根据 ID 获取区域 */
    static Get(id: string): AREA | undefined;
}

// ============================================================
// FAMILY_AREA — 门派区域类
// ============================================================

declare class FAMILY_AREA extends AREA {
    static __initInstance(obj: object): void;
}

// ============================================================
// SKILL — 技能类
// ============================================================

declare class SKILL extends BASE {
    /** 技能 ID */
    id: string;
    /** 技能名称 */
    name: string;
    /** 技能类型（0=基本 1=特殊 2=知识） */
    type: number;
    /** 技能品级 */
    grade: number;
    /** 技能积分 */
    score: number;
    /** 带颜色的技能名称 */
    color_name: string;
    /** 技能描述 */
    desc?: string;
    /** 所属门派 */
    family?: FAMILY;
    /** 可装备到的基本技能列表 */
    can_enables?: string[];
    /** 学习条件 */
    learn_condition?: { [key: string]: any };
    /** 学习条件文本描述 */
    learn_condition_string?: string;
    /** 绝招集合 */
    pfm?: { [name: string]: PERFORM };
    /** 进阶槽位 */
    slots?: any;
    /** 是否源技能 */
    source_skill?: boolean;
    /** 是否绝学 */
    is_ultimate?: boolean;
    /** 是否隐藏技能 */
    is_hidden?: boolean;
    /** 攻击动作描述列表 */
    attack_actions?: string[];
    /** 闪避动作描述列表 */
    dodge_actions?: string[];
    /** 招架动作描述列表 */
    parry_actions?: string[];
    /** 武器 vs 武器招架描述 */
    weapon_vs_weapon_actions?: string[];
    /** 武器 vs 空手招架描述 */
    weapon_vs_unarmed_actions?: string[];
    /** 空手 vs 武器招架描述 */
    unarmed_vs_weapon_actions?: string[];
    /** 内功系数 */
    force_rad?: number;

    static __initInstance(obj: object): void;

    /** 查询攻击动作描述 */
    query_attack_action(me: CHARACTER, target: CHARACTER): string;
    /** 查询闪避动作描述 */
    query_dodge_action(): string;
    /** 查询招架动作描述 */
    query_parry_action(me: CHARACTER, target: CHARACTER, w2?: EQUIPMENT): string;
    /** 查询升级所需经验 */
    level_exp(lv: number, me: CHARACTER): number;
    /** 查询从 100 级到指定等级总需经验 */
    query_needexp(level: number, me: CHARACTER): number;
    /** 设置为默认技能 */
    set_default(type: string): void;
    /** 移除技能附加属性 */
    release_prop(me: CHARACTER, lv: number): void;
    /** 附加技能属性 */
    attach_prop(me: CHARACTER, lv: number): void;
    /** 查询技能品级 */
    query_grade(me: CHARACTER): number;
    /** 查询带颜色的技能名 */
    query_color_name(me: CHARACTER): string;
    /** 激活技能 */
    enable(me: CHARACTER, type: string): boolean;
    /** 取消激活技能 */
    disenable(me: CHARACTER, type: string): void;
    /** 检查并执行学习条件 */
    do_learn(me: CHARACTER): boolean | undefined;
    /** 学习条件转字符串 */
    condition_tostring(me: CHARACTER): string;
    /** 技能 JSON 序列化 */
    item_to_json(str: string[], skill_item: SkillData, me: CHARACTER): void;
    /** 增加技能经验 */
    add_exp(me: CHARACTER, exp: number): boolean | undefined;
    /** 查询技能总积分 */
    query_score(lv: number, me: CHARACTER): number;
    /** 查询每级积分 */
    query_one_score(me: CHARACTER): number;
    /** 技能进阶 */
    grade_up(me: CHARACTER, target_skill: SKILL): boolean;
    /** 获取绝招定义 */
    get_pfm(name: string): PERFORM | undefined;
    /** 设置绝招 */
    set_pfm(name: string, obj: PERFORM): void;
    /** 查询技能完整描述 */
    query_desc(me: CHARACTER, lv: number): string;
    /** 按品级和基本技能类型存储 */
    store(): void;
    /** 技能创建回调 */
    create(fname: string): void;
    /** 技能注册/更新 */
    update(fname: string): void;
    /** 查询进阶属性 */
    query_addin_prop(me: CHARACTER, lv: number): { [key: string]: number } | null;
    /** 检查技能是否已装备 */
    is_enable(me: CHARACTER): boolean;
    /** 检查技能是否装备到指定基本技能 */
    is_enable2(me: CHARACTER, baseskill: string): boolean;
    /** 查询进阶属性槽位 */
    query_slot(index: number): any;
    /** 查询绝招描述 */
    query_pfm_desc(me: CHARACTER, p_item: PERFORM, str: string[], lv: number, pname?: string): void;
    /** 查询装备属性（子类重写） */
    query_enable_prop(lv: number, me?: CHARACTER): { [type: string]: { [key: string]: number } } | undefined;
    /** 查询基础属性（子类重写） */
    query_prop(lv: number, me?: CHARACTER): { [key: string]: number } | undefined;

    /** 技能引用绝招冷却时间 */
    static REF_CD: number;
    /** 技能进阶槽位定义 */
    static SLOTS: { [key: string]: any };

    /** 战斗开始回调 */
    on_beginfight?(me: CHARACTER, target: CHARACTER): void;
    /** 攻击结束回调 */
    on_end_attack?(me: CHARACTER, target: CHARACTER): void;
    /** 敌人死亡回调 */
    on_enemy_die?(killer: CHARACTER, victim: CHARACTER): void;
    /** 学习技能回调 */
    on_learn?(me: CHARACTER): boolean | void;
    /** 激活技能回调 */
    on_enable?(me: CHARACTER, type: string): boolean | void;
    /** 取消激活回调 */
    on_disenable?(me: CHARACTER, type: string): void;
    /** 移除技能回调 */
    on_remove?(me: CHARACTER): void;

    /** 根据 ID 获取技能 */
    static get(id: string): SKILL | undefined;
}

// ============================================================
// PERFORM — 绝招类
// ============================================================

declare class PERFORM extends BASE {
    /** 绝招名称 */
    name: string;
    /** 绝招 ID */
    id?: string;
    /** 绝招父 ID */
    pid?: string;
    /** 所需技能 ID */
    enable_skill?: string;
    /** 是否是武器绝招 */
    is_weapon?: boolean;
    /** 冷却时间（秒） */
    distime?: number;
    /** 使用条件检查 */
    check?: (me: CHARACTER, lv: number, baseType?: string) => boolean;
    /** 使用条件文本描述 */
    use_condition?: string;

    static __initInstance(obj: object): void;

    /** 查询绝招名称 */
    query_name(me: CHARACTER, baseType?: string): string;
    /** 查询内力消耗 */
    query_mp?(me: CHARACTER, lv: number): number;
    /** 查询释放时间 */
    query_releasetime?(me: CHARACTER, lv: number): number;
    /** 查询冷却时间 */
    query_distime?(me: CHARACTER, lv?: number, pname?: string): number;
    /** 查询绝招描述 */
    query_desc?(me: CHARACTER, lv: number): string;
    /** 改变冷却时间 */
    change_distime(me: CHARACTER, id: string, add_time?: number): void;
}

// ============================================================
// FAMILY — 门派类
// ============================================================

declare class FAMILY extends BASE {
    /** 门派 ID */
    id: string;
    /** 门派名称 */
    name: string;
    /** 称谓列表 */
    titles: string[];
    /** NPC 列表 */
    npcs: string[];
    /** 交战门派 ID */
    battle_family: string | null;
    /** 门派战积分 */
    battle_score: number;
    /** 门派战奖励 */
    battle_gift: number;
    /** 是否可参与门派战 */
    can_battle: boolean;
    /** 门派区域 */
    area?: AREA;
    /** 性别限制 */
    gender?: number;
    /** 技能列表（按品级排序） */
    skills?: SKILL[];
    /** 0 品技能 */
    skills0?: SKILL[];
    /** 2 品技能 */
    skills2?: SKILL[];
    /** 3 品技能 */
    skills3?: SKILL[];
    /** 4 品技能 */
    skills4?: SKILL[];
    /** 按品级分组的技能 */
    skill_levels?: SKILL[][];
    /** 贡献排名 */
    tops?: { [userId: string]: { name: string; score: number } };

    static __initInstance(obj: object): void;

    /** 设置门派称谓 */
    set_titles(...args: string[]): void;
    /** 门派创建回调 */
    create(path: string): void;
    /** 门派更新回调 */
    update(path: string): void;
    /** 查询指定等级的称谓 */
    query_title(level: number): string;
    /** 查询门派临时数据 */
    query_temp<T = any>(name: string, def?: T): T;
    /** 设置门派临时数据 */
    set_temp(name: string, value: any, time?: number): void;
    /** 移除门派临时数据 */
    remove_temp(name: string): void;
    /** 累加门派临时数据 */
    add_temp(name: string, value: number, time?: number): number;
    /** 向门派所有在线成员发送消息 */
    send(str: string): void;
    /** 是否与指定门派交战 */
    is_battle(fam: FAMILY): boolean;
    /** 增加门派积分 */
    add_score(me: CHARACTER, sc: number): void;
    /** 创建门派随机名字 */
    create_name(): string;
    /** 随机查询指定品级的技能 */
    query_skill(grade: number): SKILL;
    /** 查询指定品级的所有技能 */
    query_skills(grade: number): SKILL[];
    /** 增加门派贡献 */
    add_gongji(me: CHARACTER, count: number): void;
    /** 称谓回调 */
    call?(me: CHARACTER, isbad?: boolean): string;
    /** 自称回调 */
    call_me?(me: CHARACTER): string;
    /** 登录回调 */
    on_login?(me: USER): void;
}

/** 全局门派注册表：NONE=无门派 MONSTER=怪物门派 */
declare var FAMILIES: { NONE: FAMILY; MONSTER: FAMILY; [id: string]: FAMILY };

// ============================================================
// COMMAND — 命令基类
// ============================================================

interface COMMAND extends BASE {
    /** 命令字符串（逗号分割表示别名） */
    command?: string;
    /** 是否允许在战斗中执行 */
    allow_fight: boolean;
    /** 允许执行的最低等级 */
    allow_level: number;
    /** 是否允许死亡时执行 */
    allow_die?: boolean;
    /** 是否允许昏迷时执行 */
    allow_faint?: boolean;
    /** 是否允许在状态中执行（如打坐、修炼） */
    allow_state?: boolean;
    /** 是否允许忙碌时执行 */
    allow_busy?: boolean;
    /** 参数正则 */
    regex?: RegExp;
    /** 命令执行函数 */
    exec?: (...args: any[]) => any;

    /** 将命令绑定到目标类的原型上 */
    for_item(item: Function, name?: string): void;
    /** 命令创建回调 */
    create(fname: string): void;
    /** 命令更新回调 */
    update(): void;
    /** 命令入口函数 */
    enter?(...args: any[]): boolean | void;
}

declare var COMMAND: {
    new (): COMMAND;
    prototype: COMMAND;
    __initInstance(obj: object): void;
    /** 执行指定命令 */
    DO(cmd: string, par1?: any, par2?: any, par3?: any): void;
};

// ============================================================
// OBJ — 物品基类
// ============================================================

declare class OBJ extends ITEM {
    /** 量词单位（如"把""件""颗"） */
    unit: string;
    /** 堆叠数量 */
    count: number;
    /** 是否可堆叠 */
    combined: boolean;
    /** 品级 */
    grade: number;
    /** 物品类型 */
    otype: number;
    /** 价值 */
    value: number;
    /** 是否可交易 */
    transable: boolean;
    /** 是否是装备 */
    is_equipment?: boolean;
    /** 是否是货币 */
    is_money?: boolean;
    /** 使用冷却时间（秒） */
    distime?: number;
    /** 是否显示动作按钮 */
    showAction?: boolean;
    /** 是否锁定（不可移动） */
    is_locked?: boolean;
    /** 合并数量上限 */
    combine_count?: number;
    /** 使用回调 */
    on_use?: (me: CHARACTER) => boolean | void;
    /** 学习/研读回调 */
    on_study?: (me: CHARACTER) => boolean | void;
    /** 打开回调 */
    on_open?: (me: CHARACTER) => boolean | void;

    static __initInstance(obj: object): void;

    /** 初始回调 */
    init(me?: CHARACTER): void;
    /** 完整名称（含数量） */
    long_name(): string;
    /** 带数量的单位名称 */
    unit_name(count?: number): string;
    /** 物品 JSON 序列化 */
    item_to_json(): string;
    /** 查询操作命令 JSON */
    query_commands(me?: USER): string;
    /** 查询描述 JSON */
    query_desc(me?: USER): string;
    /** 获取描述文本 */
    get_desc(me?: CHARACTER): string;
    /** 拆分堆叠物品 */
    uncombine(spcount: number): OBJ;
    /** 克隆物品 */
    clone(): OBJ;
    /** 合并临时属性 */
    combineTemp(target: { [key: string]: number }, source: { [key: string]: number }): { [key: string]: number };
    /** 合并堆叠物品 */
    combine(obj: OBJ): void;
    /** 物品存档序列化 */
    save_db(str: string[]): void;
    /** 从数据库记录恢复物品 */
    load_db(data: any[]): void;
    /** 物品加载后回调 */
    on_load(me: CHARACTER): void;
    /** 克隆后回调 */
    on_clone(): void;
    /** 物品创建回调 */
    create(path: string, par?: string): void;
    /** 物品更新回调 */
    update(path: string, par?: string): void;
    /** 查询品级颜色 */
    query_grade_color(): string;
    /** 通知客户端物品动作按钮变更 */
    notify_action(me: USER, isadd: boolean): void;

    /** 创建物品 */
    static CREATE(otype: string, count?: number): OBJ;
    /** 克隆物品到目标容器 */
    static clone_to(otype: string, to: ITEM, count?: number): OBJ | undefined;
    /** 按概率创建物品列表 */
    static create_by_odds(args: Array<{ odds?: number; obj?: string; fall_obj?: string; count?: number; min?: number; max?: number; min_count?: any }>): OBJ[];
}

// ============================================================
// EQUIPMENT — 装备类
// ============================================================

declare class EQUIPMENT extends OBJ {
    /** 装备部位类型 */
    eq_type: number;
    /** 强化等级 */
    level: number;
    /** 强化经验 */
    exp: number;
    /** 标记为装备 */
    is_equipment: true;
    /** 装备附加属性 */
    prop?: { [key: string]: number };
    /** 原始属性（强化前） */
    original_prop?: { [key: string]: number };
    /** 镶嵌宝石列表 */
    st_prop?: Array<{ id: string; path: string; name: string; prop: { [key: string]: number }; grade: number }>;
    /** 剩余孔位 */
    hole_count?: number;
    /** 装备条件 */
    condition?: { [key: string]: any };
    /** 套装名 */
    group_name?: string;
    /** 套装效果查询 */
    group_prop?: (count: number) => { [key: string]: number } | undefined;
    /** 武器类型 */
    weapon_type?: string;
    /** 自定义装备消息 */
    eq_msg?: string;
    /** 自定义卸下消息 */
    uneq_msg?: string;
    /** 是否快捷装备 */
    is_shortcut?: boolean;

    static __initInstance(obj: object): void;

    /** 变更装备附加属性（is_attach=true 附加，false 移除） */
    change_prop(me: CHARACTER, is_attach: boolean): void;
    /** 通知客户端装备动作按钮变更 */
    notify_action(me: CHARACTER, isadd: boolean): void;
    /** 检查装备条件 */
    check(me: CHARACTER): boolean;
    /** 装备到角色 */
    eq(me: CHARACTER, notsend?: boolean): boolean | undefined;
    /** 卸下装备 */
    uneq(me: CHARACTER, notsend?: boolean): void;
    /** 装备条件文本描述 */
    condition_tostring(str: string[]): void;
    /** 获取装备完整描述 */
    get_desc(me: CHARACTER): string;
    /** 查询品质名称 */
    query_quality(): string;
    /** 装备强化升级 */
    level_up(lev: number): void;
    /** 强化等级参数表 */
    levelData: number[];
    /** 根据强化等级重新计算属性 */
    levelchange_prop(): void;
    /** 清除所有镶嵌宝石 */
    clear_stone(): void;
    /** 镶嵌宝石 */
    push_stone(stone: OBJ): boolean | undefined;
    /** 克隆装备 */
    clone(me?: CHARACTER): EQUIPMENT;
    /** 装备存档序列化 */
    save_db(str: string[]): void;
    /** 从数据库加载装备 */
    load_db(data: any[]): void;
    /** 装备加载后回调 */
    on_load(me: CHARACTER): void;
    /** 装备创建回调 */
    on_create(path: string, par?: string): void;
    /** 查询套装描述 */
    query_group_desc(me: CHARACTER, str: string[]): void;
    /** 检查并更新套装效果 */
    check_group(me: CHARACTER, isadd: boolean): void;

    /** 装备部位名称映射 */
    parts: string[];
    /** 品质名称列表 */
    qualities: string[];
    /** 各品级装备价值表 */
    VALUES: number[];

    /** 装备时回调 */
    on_eq?: (me: CHARACTER) => boolean | void;
    /** 卸下时回调 */
    on_uneq?: (me: CHARACTER) => void;
    /** 重载时回调 */
    on_reload?: (me: CHARACTER) => void;
}

// ============================================================
// CONTAINER — 容器类
// ============================================================

declare class CONTAINER extends OBJ {
    /** 标记为容器 */
    is_container: true;
    /** 物品拾取钩子（返回 true 阻止拾取） */
    on_getitem?: (player: USER, item: OBJ) => boolean;

    static __initInstance(obj: object): void;

    /** 禁止直接拾取容器 */
    on_get(player?: USER): boolean;
    /** 设置初始内容物 */
    set_items(...args: Array<string | [string, number]>): void;
    /** 查询内容物 */
    query_items(me?: USER): OBJ[];
    /** 获取描述文本 */
    get_desc(me: USER): string;
    /** 清空内容物 */
    clear_items(me: USER, noget?: OBJ[]): void;
    /** 查询描述 JSON */
    query_desc(me: USER): string;

    /** 创建容器 */
    static CREATE(name: string, desc: string, lv: number, odds: any[]): CONTAINER;
}

// ============================================================
// CORPSE — 尸体类
// ============================================================

declare class CORPSE extends CONTAINER {
    /** 尸体来源 ID */
    fromid?: string;
    /** 是否禁止分配 */
    no_alloc: boolean;
    /** 不掉落物品列表 */
    no_drops?: string[];

    static __initInstance(obj: object): void;

    /** 禁止直接拾取尸体 */
    on_get(player?: USER): boolean;
    /** 初始化尸体 */
    init(player: CHARACTER, iskeep?: boolean): void;
    /** 查询尸体内容物 */
    query_items(player?: USER): OBJ[];
    /** 清空尸体物品 */
    clear_items(me: USER, noget?: OBJ[]): void;
    /** 检查拾取权限 */
    check_get(player: USER, item: OBJ): boolean;
    /** 尸体消失 */
    disappear(): void;
    /** 查询描述 JSON */
    query_desc(me: USER): string;
}

// ============================================================
// MONEY — 货币类
// ============================================================

declare class MONEY extends OBJ {
    /** 是否为元宝 */
    is_cash: boolean;
    /** 标记为货币 */
    is_money: true;
    /** 标记为可交易 */
    transable: true;

    static __initInstance(obj: object): void;

    /** 创建时根据类型设置颜色 */
    create(): void;
}

// ============================================================
// TASK / USERTASK — 任务系统
// ============================================================

declare class TASK extends BASE {
    /** 任务 ID */
    id?: string;

    static __initInstance(obj: object): void;

    /** 任务创建回调 */
    create(): void;
    /** 热更新 */
    update(path: string): void;
    /** 任务启动 */
    startup(oldtask?: TASK): void;
    /** 任务停止 */
    stop(): void;

    /** 根据 ID 获取全局任务 */
    static GET(id: string): TASK | undefined;
}

declare class USERTASK extends BASE {
    /** 任务 ID */
    id?: string;

    static __initInstance(obj: object): void;

    /** 任务创建回调 */
    create(path: string): void;
    /** 热更新 */
    update(path: string): void;
    /** 查询任务标题 */
    query_title(): string | undefined;
    /** 开始任务 */
    start(player?: USER): any;
    /** 查询任务描述 */
    query_desc(): string | undefined;
    /** 查询任务状态 */
    query_state(): number;

    /** 任务创建完成回调 */
    on_create?(): void;
    /** 任务开始回调 */
    on_start?(player: USER): void;

    /** 运行用户任务 */
    static RUN(id: string, player: USER): any;
    /** 根据 ID 获取用户任务 */
    static GET(id: string): USERTASK | undefined;
}

// ============================================================
// EVENTS — 活动事件管理
// ============================================================

declare class EVENTS extends BASE {
    /** 活动动作类型列表 */
    static ACTIONS: string[];

    /** 添加/更新活动 */
    static add(item: { id: string; check: (user: USER) => boolean }): void;
    /** 通知所有符合条件的玩家 */
    static notify(item: { id: string; check: (user: USER) => boolean }, act: number): void;
    /** 移除活动 */
    static remove(id: string): any[] | undefined;
}

// ============================================================
// 全局对象 WORLD
// ============================================================

declare var WORLD: {
    /** 在线玩家列表 */
    USERS: USER[];
    /** 命令注册表 */
    COMMANDS: { [name: string]: COMMAND };
    /** 技能注册表 */
    SKILLS: { [id: string]: SKILL };
    /** 房间注册表 */
    ROOMS: { [path: string]: ROOM };
    /** 运行中的房间列表 */
    RUN_ROOMS: ROOM[];
    /** 默认技能配置 */
    DEFAULT_SKILLS: { [type: string]: SKILL };
    /** 默认命令 */
    DEFAULT_COMMAND?: COMMAND;
    /** 区域列表 */
    AREAS: AREA[];
    /** 用户任务列表 */
    TASKS: USERTASK[];
    /** 系统任务列表 */
    SYSTEMTASKS: TASK[];
    /** 用户事件列表 */
    USER_EVENTS: any[];
    /** 物品模板存储 */
    OBJ_STROE: Map<string, OBJ>;
    /** NPC 模板存储 */
    NPC_STROE: Map<string, NPC>;
    /** 心跳计数 */
    HEARTBEATCOUNT: number;
    /** 服务器 ID */
    SERVERID: number;
    /** 全局数据缓存 */
    DATA: any;
    /** 数据库连接 */
    DB: any;
    /** 操作日志 */
    LOGS: Array<{ time: number; cmd: string; user: string; msg: string }>;
    /** 请求记录 */
    RECEIVED: Array<{ time: number; cmd: string; user: string }>;
    /** 全局状态 */
    STATUS: any;
    /** 用户事件队列 */
    USERS_EVENTS: any[];
    /** 消息配置 */
    MESSAGE: any;
    /** 统计数据 */
    STATS: any;
    /** 服务器状态码 */
    status: number;

    /** 向所有在线玩家发送消息 */
    sendAll(msg: string): void;
    /** 根据 ID 或序号获取用户 */
    getUser(id: string | number): USER | undefined;
    /** 根据名称查找用户 */
    find_user(name: string): USER | undefined;
    /** 记录操作日志 */
    log(user: USER | null, cmd: string, msg: string): void;
    /** 保存全部数据 */
    save(): Promise<boolean>;
    /** 自动拾取回调 */
    auto_get?(killer: CHARACTER, corpse: CORPSE, victim: CHARACTER): void;
    /** 玩家死亡全局处理 */
    on_user_die(me: CHARACTER, killer: CHARACTER, corpse?: CORPSE): void;

    [key: string]: any;
};

// ============================================================
// 常量声明
// ============================================================

/** 技能类型：BASE=基本 SKILL=特殊 KNOWLEDGE=知识 */
declare var SKILL_TYPES: { readonly BASE: 0; readonly SKILL: 1; readonly KNOWLEDGE: 2 };
/** 基本技能 ID：FORCE=内功 DODGE=闪避 PARRY=招架 BITE=撕咬 */
declare var BASE_SKILLS: { readonly FORCE: "force"; readonly DODGE: "dodge"; readonly PARRY: "parry"; readonly BITE: "bite" };
/** 装备部位类型 */
declare var EQUIP_TYPE: {
    /** 武器 */ readonly WEAPON: 0; /** 衣服 */ readonly CLOTH: 1; /** 鞋子 */ readonly SHOES: 2;
    /** 头盔 */ readonly HEAD: 3; /** 披风 */ readonly CAPE: 4; /** 戒指 */ readonly RING: 5;
    /** 项链 */ readonly NECKLACE: 6; /** 饰品 */ readonly JEWELS: 7; /** 护腕 */ readonly WRIST: 8;
    /** 腰带 */ readonly WAIST: 9; /** 暗器 */ readonly THROWING: 10;
};
/** 武器类型 */
declare var WEAPON_TYPE: {
    /** 空手 */ readonly NONE: "unarmed"; /** 剑 */ readonly SWORD: "sword"; /** 刀 */ readonly BLADE: "blade";
    /** 杖 */ readonly STAFF: "staff"; /** 棍 */ readonly CLUB: "club"; /** 鞭 */ readonly WHIP: "whip"; /** 暗器 */ readonly THROWING: "throwing";
};
/** 属性名称映射表（如 str→"臂力"、gjsd→"攻击速度" 等） */
declare var PROPERTIES: { readonly [key: string]: string };

/**
 * 全局工具对象 — 提供通用工具方法
 */
declare var UTIL: {
    /** 清空工具缓存 */
    empty(): void;
    /** 加载模块 */
    require(str: string): any;
    /** 是否在礼物时间内 */
    is_gift(): boolean;
    /** 加权随机 */
    wrandom(me: CHARACTER, max: number, rate?: number): number;
    /** 金钱数值转中文 */
    moneyToStr(value: number): string;
    /** 时间跨度格式化 */
    timeSpan(time: number): string;
    /** 中文数字字符集 */
    C_STR: string;
    /** 中文数字（个十百千万） */
    C_STR2: string[];
    /** 中文数字（大写） */
    C_STR3: string[];
    /** 数字转中文 */
    to_c(num: number): string;
    /** HTML 编码 */
    htmlEncode(str: string): string;
    /** 属性对象转字符串 */
    prop_toString(prop: { [key: string]: any }, sp?: string, count?: number): string;
    /** 距下个小时的剩余毫秒数 */
    diff_time(next_hour?: number): number;
    /** 距下周某小时的剩余毫秒数 */
    diff_week_time(next_hour?: number): number;
    /** 距下月某小时的剩余毫秒数 */
    diff_month_time(next_hour?: number): number;
    /** 工具日志 */
    logs: Array<{ dt: () => number; content: string }>;
    /** 记录工具日志 */
    log(msg: string): void;
    /** 保存工具日志到文件 */
    saveLog(): void;
    /** ID 字符集 */
    idstr: string;
    /** ID 起始序号 */
    begin: number;
    /** 生成唯一 ID */
    create_id(): string;
    /** 随机生成名字 */
    random_name(s: number, t?: number): string;
    /** 姓氏字符集 */
    name0: string;
    /** 名字字符集（男） */
    name1: string;
    /** 名字字符集（女） */
    name2: string;
    /** 名字字符集（通用） */
    name3: string;
    /** 获取农历日期 */
    getLunar(date?: Date): { year: number; month: number; day: number; isLeap: boolean };
    /** 是否农历十五 */
    isLunar15(dt?: Date): boolean;
};

// ============================================================
// 框架魔改 — 内置原型扩展
// ============================================================

/** 服务器端 os/util/util.js 原型扩展 */
interface Array<T> {
    /** 移除数组中第一个匹配元素（== 宽松相等），成功返回 true */
    remove(item: any): boolean | undefined;
    /** 判断数组是否包含指定元素（=== 严格相等） */
    contain(item: any): boolean;
    /** 随机返回数组中的一个元素 */
    random(index?: number): T;
}

/** 客户端 src/utils/util.js 原型扩展（PascalCase 命名） */
interface Array<T> {
    /** 移除第一个匹配元素（==），返回自身以支持链式调用 */
    Remove(o: any): T[];
    /** 通过谓词函数移除所有匹配项 */
    RemoveAt(func: (item: T) => boolean): void;
    /** 判断数组是否包含指定元素（== 宽松相等） */
    Has(o: any): boolean;
    /** 映射数组，过滤掉结果为假值的项（不同于原生 map） */
    Map<R>(fn: (item: T) => R): R[];
    /** 通过谓词查找第一个匹配元素，未找到返回 null */
    First(fn: (item: T) => boolean): T | null;
    /** 通过谓词过滤数组（同原生 filter） */
    Where(fn: (item: T) => boolean): T[];
}

interface Date {
    /** 增加/减少天数，返回自身以支持链式调用 */
    AddDays(d: number): Date;
    /** 增加/减少月数，返回自身以支持链式调用 */
    AddMonths(m: number): Date;
    /** 增加/减少年数，返回自身以支持链式调用 */
    AddYears(y: number): Date;
    /** 格式化为 YYYY-MM-DD 字符串 */
    ToDateString(): string;
}

interface Function {
    /** 基于 Node.js util.inherits 的原型继承语法糖 */
    inherits(superCtor: Function): void;
}

interface JSON {
    /** 使用 JSON5 将字符串解析为对象（支持宽松语法） */
    toObject(str: string): any;
}

/** 全局配置对象 */
declare var __CONFIG: any;
/** 全局路径配置 */
declare var __PATH: any;
