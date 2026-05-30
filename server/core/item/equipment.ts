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

/** Stored gem entry */
export interface StoneEntry {
    id: string;
    path: string;
    name: string;
    prop: Record<string, number>;
    grade: number;
}

export class EQUIPMENT extends OBJ {

    constructor() {
        super();
    }

    // ============ Equipment flags ============

    /** Whether this is equipment */
    is_equipment: boolean = true;
    /** Whether tradable */
    transable: boolean = true;
    /** Equipment slot type (WEAPON / CLOTH / etc.) */
    eq_type: number = EQUIP_TYPE.WEAPON;

    // ============ Equipment stats ============

    /** Enhancement level */
    level: number = 0;
    /** Equipment exp */
    exp: number = 0;
    /** Grade (0-6) */
    grade: number = 0;
    /** Item count (always 1 for equipment) */
    count: number = 1;
    /** Not stackable */
    combined: boolean = false;
    /** Show action button */
    showAction: boolean = true;
    /** Allow use during combat */
    allow_fight: boolean = true;
    /** Object type identifier */
    otype: number = 4;

    // ============ Attached properties ============

    /** Base equipment score */
    score: number = 0;
    /** Attached properties (enhancement) */
    prop: Record<string, number> | null = null;
    /** Socketed gem properties */
    st_prop: StoneEntry[] | null = null;
    /** Number of gem sockets */
    hole_count: number = 0;
    /** Equip conditions ({skill, str, gender, etc.}) */
    condition: Record<string, any> | null = null;
    /** Set group name */
    group_name: string | null = null;
    /** Weapon type (sword / blade / staff / etc.) */
    weapon_type: string = "";
    /** Original properties (for enhancement calculation) */
    original_prop: Record<string, any> | null = null;
    /** Color-tagged display name */
    color_name: string = "";

    /** Custom equip message */
    eq_msg: string | null = null;
    /** Custom unequip message */
    uneq_msg: string | null = null;

    // ============ Callbacks ============

    /** Group property calculator — overridden by subclasses */
    group_prop?: (count: number) => Record<string, number> | undefined | void;
    /** Equip callback — return false to block */
    on_eq?: ((me: CHARACTER) => boolean | void);
    /** Unequip callback */
    on_uneq?: ((me: CHARACTER) => void);

    /**
     * Apply/remove equipment attached properties
     * @param me - target character
     * @param is_attach - true = attach, false = remove
     */
    change_prop(me: CHARACTER, is_attach: boolean): void {
        me.change_prop(this.prop, is_attach);
        if (this.st_prop) {
            for (let i = 0; i < this.st_prop.length; i++) {
                me.change_prop(this.st_prop[i].prop, is_attach);
            }
        }
    }

    /**
     * Notify client about action button change (based on equip state)
     */
    notify_action(me: CHARACTER, isadd: boolean): void {
        if (!this.on_use) return;
        isadd = (me as Record<string, any>).equipment?.[this.eq_type] === this;
        if (isadd)
            me.send("{type:'addAction',id:'" + this.id + "',name:'" + this.name + "',distime:" + (this.distime || 0) + "}");
        else
            me.send("{type:'removeAction',id:'" + this.id + "'}");
    }

    /**
     * Check equip conditions
     * @returns true if all conditions pass
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
                            return me.notify_fail("你的" + sk_base.color_name + "等级不够" + val[sk] + "，无法装备" + this.color_name + "。");
                        }
                    }
                    break;
                case "str1":
                case "con1":
                case "dex1":
                case "int1":
                    if ((me as Record<string, any>)[key.replace("1", "")] < val) {
                        return me.notify_fail("你的先天" + (PROPERTIES as Record<string, string>)[key] + "不够" + val + "，无法装备" + this.color_name + "。");
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
     * Equip onto a character
     * @param me - target user
     * @param notsend - skip room messages
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
     * Unequip from a character
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
     * Text description of equip conditions
     */
    condition_tostring(str: string[]): void {
        if (!this.condition) return;
        for (const key in this.condition) {
            const val = (this.condition as Record<string, any>)[key];
            switch (key) {
                case "skill":
                    for (const sk in val) {
                        const sk_base = SKILL.get(sk);
                        str.push(sk_base.name + "要求：" + val[sk] + "级");
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

    /** Slot names indexed by eq_type */
    parts: string[] = ['武器', '衣服', '鞋', '头部', '披风', '戒指', '项链', '饰品', '护腕', '腰带', '暗器'];
    /** Quality names indexed by grade */
    qualities: string[] = ["普通", "精良", "高级", "稀有", "绝世", "传说", "神器"];

    /**
     * Full equipment description
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
     * Query quality name
     */
    query_quality(): string {
        return this.qualities[this.grade] ?? "普通";
    }

    /**
     * Level up (enhancement)
     */
    level_up(lev: number): void {
        const cc = this.query_grade_color();
        this.prop = {};
        this.level = lev;
        this.levelchange_prop();
        this.color_name = "<" + cc + ">" + (level_desc[this.level] ?? '') + this.name + "</" + cc + ">";
        this.json = null;
    }

    /** Enhancement level threshold data */
    levelData: number[] = [
        0, 10, 20, 40, 70, 110, 160, 220, 290, 370, 460, 560, 670
    ];

    /**
     * Recalculate properties based on enhancement level
     */
    levelchange_prop(): void {
        if (!(this.level >= 0 && this.level < 13)) return;
        const base_props: Record<string, any> = this.original_prop ?? Object.getPrototypeOf(this).prop ?? {};
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
     * Clear all socketed gems
     */
    clear_stone(): void {
        if (!this.st_prop) return;
        this.hole_count += this.st_prop.length;
        this.st_prop.length = 0;
    }

    /**
     * Socket a gem into this equipment
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
     * Clone equipment (preserve enhancement and gems)
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
     * Serialize equipment for database
     */
    save_db(str: string[]): void {
        str.push('["', this.path ?? '', '","', this.id, '",', this.level);
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
     * Restore equipment from database record
     */
    load_db(data: any[]): void {
        this.id = data[1];
        if (data[2] > 0) {
            this.level = data[2];
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
     * Post-load callback — reapply enhancement
     */
    on_load(me: CHARACTER): void {
        if (this.on_reload) this.on_reload(me);
        if (this.level > 0) {
            this.level_up(this.level);
        }
    }

    /** Equipment values by grade */
    VALUES: number[] = [100, 1000, 2000, 10000, 100000, 1000000, 100000000];

    /**
     * Create callback — set value by grade
     */
    on_create(path: string, par?: string): void {
        this.value = this.VALUES[this.grade] ?? 0;
    }

    /**
     * Query set bonus description
     */
    query_group_desc(me: CHARACTER, str: string[]): void {
        if (!this.group_prop || !this.group_name) return;
        let count = 0;
        if (me && (me as Record<string, any>).equipment) {
            const equip: any[] = (me as Record<string, any>).equipment;
            for (let i = 0; i < equip.length; i++) {
                if (equip[i] && equip[i].group_name === this.group_name) {
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
     * Check and update set bonus effects
     * @param me - character
     * @param isadd - true = equip, false = unequip
     */
    check_group(me: CHARACTER, isadd: boolean): void {
        if (!this.group_prop || !this.group_name) return;
        let count = isadd ? 1 : 0;
        const equip: any[] = (me as Record<string, any>).equipment ?? [];
        for (let i = 0; i < equip.length; i++) {
            if (equip[i] && equip[i].group_name === this.group_name) {
                count++;
            }
        }
        const prop = this.group_prop(count);
        if (prop) {
            me.change_prop(prop, isadd);
        }
    }

    // ============ Score calculation ============

    /**
     * Calculate equipment score
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
