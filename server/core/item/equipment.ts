/**
 * EQUIPMENT 装备类 — 继承自OBJ
 *
 * Callbacks / overrides:
 * - group_prop(count)            套装属性计算函数，由子类覆写
 * - on_eq(me)                    装备时回调，返回false阻止装备
 * - on_uneq(me)                  卸下时回调
 */
import { OBJ } from './obj.js';
import { UTIL } from '../util.js';
import { EQUIP_TYPE, PROPERTIES } from '../const.js';
import { SKILL } from '../skill/skill.js';
import type { CHARACTER } from '../char/character.js';
import type { USER } from '../char/user.js';

/** Enhancement level icon strings */
const level_desc: string[] = ["", "☆", "★", "★☆", "★★", "★★☆", "★★★",
    "★★★☆", "★★★★", "★★★★☆", "★★★★★", "★★★★★☆", "★★★★★★"];

/** 镶嵌宝石条目 */
export interface StoneEntry {
    /** 宝石 ID */
    id: string;
    /** 宝石模板路径 */
    path: string;
    /** 宝石显示名称（含颜色和属性描述） */
    name: string;
    /** 宝石属性加成 */
    prop: Record<string, number>;
    /** 宝石品级 */
    grade: number;
}

export class EQUIPMENT extends OBJ {

    constructor() {
        super();
    }

    // ============ 装备标志 ============

    /** 是否为装备 */
    is_equipment: boolean = true;
    /** 是否可交易 */
    transable: boolean = true;
    /** 装备槽位类型（WEAPON/CLOTH 等） */
    eq_type: number = EQUIP_TYPE.WEAPON;

    // ============ 装备数值 ============

    /** 强化等级 */
    level: number = 0;
    /** 装备经验值 */
    exp: number = 0;
    /** 品级（0-6） */
    grade: number = 0;
    /** 物品数量（装备始终为 1） */
    count: number = 1;
    /** 不可堆叠 */
    combined: boolean = false;
    /** 显示快捷操作按钮 */
    showAction: boolean = true;
    /** 允许战斗中操作 */
    allow_fight: boolean = true;
    /** 物件类型标识 */
    otype: number = 4;

    // ============ 附加属性 ============

    /** 基础装备评分（按品级 * 100 计算） */
    score: number = 0;
    /** 附加属性（强化加成，由 levelchange_prop 动态计算） */
    prop: Record<string, any> | null = null;
    /** 镶嵌宝石属性列表 */
    st_prop: StoneEntry[] | null = null;
    /** 剩余宝石孔数 */
    hole_count: number = 0;
    /** 装备条件（skill 技能要求、str/con/dex/int 属性要求、gender 性别要求等） */
    condition: Record<string, any> | null = null;
    /** 套装组名（同组名装备可触发套装效果） */
    group_name: string | null = null;
    /** 武器类型（sword/blade/staff/throwing 等，由 WEAPON_TYPE 常量映射） */
    weapon_type: string = "";
    /** 原始属性（资源文件定义的初始 prop，用于强化计算基准） */
    original_prop: Record<string, any> | null = null;
    /** 带颜色标签的显示名称（含强化前缀如 ★☆） */
    color_name: string = "";

    /** 自定义装备消息（替代默认装备广播） */
    eq_msg: string | null = null;
    /** 自定义卸下消息（替代默认卸下广播） */
    uneq_msg: string | null = null;

    // ============ 回调函数（由资源文件覆写） ============

    /** 套装属性计算 — 触发时机：get_desc()/check_group() 查询套装效果时；传入已装备同套装件数 */
    group_prop?: (count: number) => Record<string, number> | undefined | void;
    /** 装备时回调 — 触发时机：eq() 开头，条件检查通过后、属性加成应用前；返回 false 阻止装备 */
    on_eq?: ((me: CHARACTER) => boolean | void);
    /** 卸下时回调 — 触发时机：uneq() 开头，属性移除之前 */
    on_uneq?: ((me: CHARACTER) => void);
    /** 防具防御回调 — 触发时机：damage() 中计算伤害减免时；返回减免后伤害 */
    on_defense?: (me: CHARACTER, from: CHARACTER, sh: number) => number;

    /**
     * 应用/移除装备附加属性
     * @param me - 目标角色
     * @param is_attach - true 附加，false 移除
     */
    change_prop(me: CHARACTER, is_attach: boolean): void {
        if (this.prop) me.change_prop(this.prop, is_attach);
        if (this.st_prop) {
            for (let i = 0; i < this.st_prop.length; i++) {
                me.change_prop(this.st_prop[i].prop, is_attach);
            }
        }
    }

    /**
     * 通知客户端快捷按钮变更（基于装备状态）
     * @param me - 目标角色
     * @param isadd - true 添加按钮，false 移除按钮
     */
    notify_action(me: CHARACTER, isadd: boolean): void {
        if (!this.on_use) return;
        isadd = me.equipment?.[this.eq_type] === this;
        if (isadd)
            me.send("{type:'addAction',id:'" + this.id + "',name:'" + this.name + "',distime:" + (this.distime || 0) + "}");
        else
            me.send("{type:'removeAction',id:'" + this.id + "'}");
    }

    /**
     * 检查装备条件
     * @param me - 目标角色
     * @returns true 表示所有条件满足
     */
    check(me: CHARACTER): boolean {
        if (!this.condition) return true;
        for (const key in this.condition) {
            const val = (this.condition as Record<string, any>)[key];
            switch (key) {
                case "skill":
                    for (const sk in val) {
                        if (me.query_skill(sk, 0) < val[sk]) {
                            const sk_base = SKILL.get(sk);
                            return me.notify_fail("你的" + (sk_base ? sk_base.color_name : sk) + "等级不够" + val[sk] + "，无法装备" + this.color_name + "。");
                        }
                    }
                    break;
                case "str1":
                case "con1":
                case "dex1":
                case "int1":
                    if ((me as Record<string, any>)[key.replace("1", "")] < val) {
                        return me.notify_fail("你的先天" + (PROPERTIES as Record<string, string>)[key] || key + "不够" + val + "，无法装备" + this.color_name + "。");
                    }
                    break;
                case "str":
                case "con":
                case "dex":
                case "int":
                    if ((me as Record<string, any>)[key] + me.query_prop(key) < val) {
                        return me.notify_fail("你的" + (PROPERTIES as Record<string, string>)[key] + "不够" + val + "，无法装备" + this.color_name + "。");
                    }
                    break;
                case "gender":
                    if (me.gender != val) return me.notify_fail("你不是" + (val == 1 ? "男性" : "女性") + "，无法装备" + this.color_name + "。");
                    break;
                case "desc":
                    break;
                default:
                    let me_val: number = (me as Record<string, any>)[key] || 0;
                    me_val = me_val + me.query_prop(key);
                    if (!me_val || me_val < val) {
                        return me.notify_fail("你的" + (PROPERTIES as Record<string, string>)[key] + "不够" + val + "，无法装备" + this.color_name + "。");
                    }
                    break;
            }
        }
        return true;
    }

    /**
     * 装备到角色身上
     * @param me - 目标玩家
     * @param notsend - 是否跳过房间广播消息
     */
    eq(me: USER, notsend?: boolean): boolean | undefined {
        if (this.check(me) === false) {
            return false;
        }
        if (this.on_eq && this.on_eq(me) === false) {
            return false;
        }
        this.change_prop(me, true);
        this.check_group(me, true);
        if (!notsend) {
            if (this.eq_msg)
                me.send_room(this.eq_msg, this);
            else {
                let msg: string;
                switch (this.eq_type) {
                    case EQUIP_TYPE.WEAPON:
                        msg = "$N抽出一" + this.unit + this.color_name + "拿在手上。";
                        break;
                    case EQUIP_TYPE.CLOTH:
                    case EQUIP_TYPE.SHOES:
                    case EQUIP_TYPE.WAIST: // reserved pants slot
                        msg = "$N穿上一" + this.unit + this.color_name + "。";
                        break;
                    case EQUIP_TYPE.RING:
                        msg = "$N拿出一" + this.unit + this.color_name + "戴在手上。";
                        break;
                    case EQUIP_TYPE.NECKLACE:
                    case EQUIP_TYPE.JEWELS:
                    case EQUIP_TYPE.WRIST:
                        msg = "$N戴上一" + this.unit + this.color_name + "。";
                        break;
                    default:
                        msg = "$N装备上一" + this.unit + this.color_name + "。";
                        break;
                }
                me.send_room(msg, this);
            }
        }
        me.send('{type:"dialog",dialog:"pack",id:"' + this.id + '",eq:' + this.eq_type + '}');
        return undefined;
    }

    /**
     * 从角色身上卸下装备
     * @param me - 目标角色
     * @param notsend - 是否跳过房间广播消息
     */
    uneq(me: CHARACTER, notsend?: boolean): void {
        if (this.on_uneq) this.on_uneq(me);
        this.change_prop(me, false);
        this.check_group(me, false);

        if (!notsend) {
            if (this.uneq_msg)
                me.send_room(this.uneq_msg, this);
            else {
                let msg: string;
                switch (this.eq_type) {
                    case EQUIP_TYPE.WEAPON:
                        msg = "$N收回手中的" + this.color_name + "。";
                        break;
                    case EQUIP_TYPE.CLOTH:
                    case EQUIP_TYPE.SHOES:
                    case EQUIP_TYPE.WAIST:
                    case EQUIP_TYPE.WRIST:
                        msg = "$N将" + this.color_name + "脱了下来。";
                        break;
                    case EQUIP_TYPE.RING:
                    case EQUIP_TYPE.NECKLACE:
                    case EQUIP_TYPE.JEWELS:
                        msg = "$N将" + this.color_name + "取了下来。";
                        break;
                    default:
                        msg = "$N脱下一" + this.unit + this.color_name + "。";
                        break;
                }
                me.send_room(msg, this);
            }
        }
        me.send('{type:"dialog",dialog:"pack",id:"' + this.id + '",uneq:' + this.eq_type + '}');
    }

    /**
     * 装备条件文本描述
     * @param str - 输出字符串数组
     */
    condition_tostring(str: string[]): void {
        if (!this.condition) return;
        for (const key in this.condition) {
            const val = (this.condition as Record<string, any>)[key];
            switch (key) {
                case "skill":
                    for (const sk in val) {
                        const sk_base = SKILL.get(sk);
                        str.push((sk_base ? sk_base.name : sk) + "要求：" + val[sk] + "级");
                    }
                    break;
                case "desc":
                    str.push(val);
                    break;
                case "gender":
                    str.push("性别要求：" + (val == 1 ? "男" : "女"));
                    break;
                default:
                    str.push((PROPERTIES as Record<string, string>)[key] + "要求：" + val);
                    break;
            }
            str.push("\n");
        }
    }

    /** 装备部位名称（按 EQUIP_TYPE 索引: 0=武器 1=衣服 … 10=暗器） */
    parts: string[] = ['武器', '衣服', '鞋', '头部', '披风', '戒指', '项链', '饰品', '护腕', '腰带', '暗器'];
    /** 品质名称（按 grade 品级索引: 0=普通 … 6=神器） */
    qualities: string[] = ["普通", "精良", "高级", "稀有", "绝世", "传说", "神器"];

    /**
     * 完整装备描述
     * @param me - 查看的角色
     */
    get_desc(me: CHARACTER): string {
        const str: string[] = [this.color_name];
        str.push("\n");
        str.push(this.parts[this.eq_type] ?? '未知部位');
        str.push("\n");
        this.condition_tostring(str);

        if (this.desc) str.push(this.desc);
        str.push("\n");
        if (this.prop) {
            str.push("<");
            str.push(this.query_grade_color());
            str.push(">");
            str.push(UTIL.prop_toString(this.prop));
            str.push("</");
            str.push(this.query_grade_color());
            str.push(">\n");
        }
        if (this.st_prop) {
            for (let i = 0; i < this.st_prop.length; i++) {
                str.push(this.st_prop[i].name);
                str.push("\n");
            }
        }
        if (this.hole_count) {
            for (let i = 0; i < this.hole_count; i++) {
                str.push("◇");
            }
        }
        this.query_group_desc(me, str);
        return str.join("");
    }

    /**
     * 查询品质名称
     */
    query_quality(): string {
        return this.qualities[this.grade] ?? "普通";
    }

    /**
     * 强化升级
     * @param lev - 目标强化等级
     */
    level_up(lev: number): void {
        const cc = this.query_grade_color();
        this.prop = {};
        this.level = lev;
        this.levelchange_prop();
        this.color_name = "<" + cc + ">" + (level_desc[this.level] ?? '') + this.name + "</" + cc + ">";
        this.json = null;
    }

    /** 强化等级阈值数据（levelData[level] = 该等级所需累计强化经验，共 0-12 级） */
    levelData: number[] = [
        0, 10, 20, 40, 70, 110, 160, 220, 290, 370, 460, 560, 670
    ];

    /**
     * 根据强化等级重新计算属性
     */
    levelchange_prop(): void {
        if (!(this.level >= 0 && this.level < 13)) return;
        const base_props: Record<string, any> = (this.original_prop ?? (Object.getPrototypeOf(this) as any).prop ?? {});
        const val = this.levelData[this.level];
        for (const key in base_props) {
            const value = base_props[key];
            switch (key) {
                case "desc":
                case "str1":
                case "con1":
                case "dex1":
                case "int1":
                case "per":
                case "kar":
                case "skill":
                    this.prop![key] = value;
                    break;

                case "fy_per":
                case "zj_per":
                case "mz_per":
                case "hp_per":
                case "ds_per":
                case "gj_per":
                case "diff_busy":
                case "busy_per":
                case "caiyao1":
                case "diaoyu1":
                case "kuang1":
                case "lianyao1":
                case "diff_sh":
                case "expend_mp":
                    this.prop![key] = value + parseInt(String(value * val / 1000), 10);
                    break;

                case "diff_downside_per":
                case "gjsd":
                case "releasetime":
                case "distime":
                case "diff_downside":
                case "distime_per":
                case "releasetime_per":
                case "gjsd_per":
                case "bj_per":
                case "diff_bj":
                case "add_bjsh_per":
                case "add_sh_per":
                case "diff_busy_per":
                case "diff_sh_per":
                case "diff_fy_per":
                case "expend_mp_per":
                case "busy":
                    this.prop![key] = value;
                    break;

                default:
                    if ((PROPERTIES as Record<string, string>)[key])
                        this.prop![key] = value + parseInt(String(value * val / 100), 10);
                    else
                        this.prop![key] = value;
                    break;
            }
        }
    }

    /**
     * 清除所有已镶嵌宝石
     */
    clear_stone(): void {
        if (!this.st_prop) return;
        this.hole_count += this.st_prop.length;
        this.st_prop.length = 0;
    }

    /**
     * 镶嵌宝石到此装备
     * @param stone - 宝石物品
     */
    push_stone(stone: OBJ): boolean | undefined {
        if (!stone || !stone.prop) return false;
        if (!this.hole_count) return false;

        if (!this.st_prop) this.st_prop = [];
        this.hole_count--;
        const cc = stone.query_grade_color();
        const str: string[] = ["<", cc, ">◆", stone.name, " "];
        str.push(UTIL.prop_toString(stone.prop as Record<string, number>, " "));
        str.push("</");
        str.push(cc);
        str.push(">");

        this.json = null;
        this.st_prop.push({
            id: stone.id,
            path: stone.path!,
            name: str.join(""),
            prop: stone.prop as Record<string, number>,
            grade: stone.grade
        });
        return undefined;
    }

    /**
     * 克隆装备（保留强化等级和宝石）
     * @param me - 可选，用于触发 on_reload 回调
     */
    clone(me?: CHARACTER): EQUIPMENT {
        const obj = OBJ.CREATE(this.path!) as EQUIPMENT;
        if (this.temp) {
            obj.temp = Object.assign({}, this.temp);
        }
        if (me && obj.on_reload) obj.on_reload(me);
        obj.level_up(this.level);
        obj.st_prop = this.st_prop;
        return obj;
    }

    /**
     * 序列化装备数据用于数据库存储
     * @param str - 输出字符串数组
     */
    save_db(str: string[]): void {
        str.push('["', this.path ?? '', '","', this.id, '",', String(this.level));
        if (this.st_prop && this.st_prop.length) {
            str.push(",[");
            for (let i = 0; i < this.st_prop.length; i++) {
                if (i > 0) str.push(",");
                str.push('"', this.st_prop[i].path, '"');
            }
            str.push("]");
        }
        if (this.is_locked)
            str.push(',1');
        if (this.temp)
            str.push(",", this.format_temp(this.temp));
        str.push("]");
    }

    /**
     * 从数据库记录恢复装备
     * @param data - 数据库记录数组
     */
    load_db(data: unknown[]): void {
        this.id = data[1] as string;
        if ((data[2] as number) > 0) {
            this.level = data[2] as number;
        }
        for (let i = 3; i < data.length; i++) {
            const value = data[i];
            if (value === 1) this.is_locked = true;
            else if (Array.isArray(value)) {
                for (let j = 0; j < value.length; j++) {
                    const st_item = OBJ.CREATE(value[j]);
                    if (st_item) {
                        this.push_stone(st_item);
                    }
                }
            } else if (typeof value === 'object') {
                this.temp = value;
            }
        }
    }

    /**
     * 加载后回调 — 重新应用强化等级
     * @param me - 目标角色
     */
    on_load(me: CHARACTER): void {
        if (this.on_reload) this.on_reload(me);
        if (this.level > 0) {
            this.level_up(this.level);
        }
    }

    /** 各品级装备基础价值（按 grade 索引: 0=100 … 6=1 亿） */
    VALUES: number[] = [100, 1000, 2000, 10000, 100000, 1000000, 100000000];

    /**
     * 创建回调 — 根据品级设置售价
     * @param path - 资源路径
     * @param par - 构造参数
     */
    on_create(path: string, par?: string): void {
        this.value = this.VALUES[this.grade] ?? 0;
    }

    /**
     * 查询套装加成描述
     * @param me - 目标角色
     * @param str - 输出字符串数组
     */
    query_group_desc(me: CHARACTER, str: string[]): void {
        if (!this.group_prop || !this.group_name) return;
        let count = 0;
        if (me && me.equipment) {
            const equip: (EQUIPMENT | null)[] = me.equipment;
            for (let i = 0; i < equip.length; i++) {
                const eq = equip[i];
                if (eq && eq.group_name === this.group_name) {
                    count++;
                }
            }
        }
        for (let i = 2; i < 8; i++) {
            const prop = this.group_prop(i);
            if (prop) {
                const cc = i <= count ? this.query_grade_color() : "blk";
                str.push("<");
                str.push(cc);
                str.push(">");
                str.push("\n");
                str.push(UTIL.to_c(i));
                str.push("件套：");
                str.push(UTIL.prop_toString(prop, " "));
                str.push("</");
                str.push(cc);
                str.push(">");
            }
        }
    }

    /**
     * 检查并更新套装效果
     * @param me - 目标角色
     * @param isadd - true 装备中，false 卸下中
     */
    check_group(me: CHARACTER, isadd: boolean): void {
        if (!this.group_prop || !this.group_name) return;
        let count = isadd ? 1 : 0;
        const equip: (EQUIPMENT | null)[] = me.equipment ?? [];
        for (let i = 0; i < equip.length; i++) {
            const eq = equip[i];
            if (eq && eq.group_name === this.group_name) {
                count++;
            }
        }
        const prop = this.group_prop(count);
        if (prop) {
            me.change_prop(prop, isadd);
        }
    }

    // ============ 评分计算 ============

    /**
     * 计算装备评分
     */
    query_score(): number {
        if (this.grade) {
            let sc = this.score;
            if (!sc) sc = this.grade * 100;
            sc += this.level * this.grade * 10;
            if (this.st_prop) {
                for (let i = 0; i < this.st_prop.length; i++) {
                    sc += this.st_prop[i].grade * 10;
                }
            }
            return sc;
        }
        return 0;
    }
}
