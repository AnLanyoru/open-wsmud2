/**
 * EQUIPMENT 装备类 - 继承自OBJ
 */
require("../util/util.js");

EQUIPMENT = class EQUIPMENT extends OBJ {

    static __initInstance(obj) {
        obj.eq_type = EQUIP_TYPE.WEAPON;
        obj.level = 0;
        obj.exp = 0;
        obj.grade = 0;
        obj.count = 1;
        obj.combined = false;
        obj.showAction = true;
        obj.allow_fight = true;
        obj.otype = 4;
        obj.is_equipment = true;
        obj.transable = true;
        obj.VALUES = [100, 1000, 2000, 10000, 100000, 1000000, 100000000];
    }

    constructor() {
        super();
        EQUIPMENT.__initInstance(this);
    }

    is_equipment = true;
    transable = true;

    /**
     * 变更装备附加属性
     * @param {CHARACTER} me
     * @param {boolean} is_attach - true附加 false移除
     */
    change_prop(me, is_attach) {
        me.change_prop(this.prop, is_attach);
        if (this.st_prop) {
            for (let i = 0; i < this.st_prop.length; i++) {
                me.change_prop(this.st_prop[i].prop, is_attach);
            }
        }
    }

    /**
     * 通知客户端装备动作按钮变更
     * @param {CHARACTER} me
     * @param {boolean} isadd
     */
    notify_action(me, isadd) {
        if (!this.on_use) return;
        isadd = me.equipment[this.eq_type] == this;
        if (isadd)
            me.send("{type:'addAction',id:'" + this.id + "',name:'" + this.name + "',distime:" + (this.distime || 0) + "}");
        else
            me.send("{type:'removeAction',id:'" + this.id + "'}");
    }

    /**
     * 检查装备条件
     * @param {CHARACTER} me
     * @returns {boolean}
     */
    check(me) {
        if (!this.condition) return true;
        for (let key in this.condition) {
            const val = this.condition[key];
            switch (key) {
                case "skill":
                    for (let sk in val) {
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
                    if (me[key.replace("1", "")] < val) {
                        return me.notify_fail("你的先天" + PROPERTIES[key] + "不够" + val + "，无法装备" + this.color_name + "。");;
                    }
                    break;
                case "str":
                case "con":
                case "dex":
                case "int":
                    if (me[key] + me.query_prop(key) < val) {
                        return me.notify_fail("你的" + PROPERTIES[key] + "不够" + val + "，无法装备" + this.color_name + "。");;
                    }
                    break;
                case "gender":
                    if (me.gender != val) return me.notify_fail("你不是" + (val == 1 ? "男性" : "女性") + "，无法装备" + this.color_name + "。");
                    break;
                case "desc":
                    break;
                default:
                    let me_val = me[key] || 0;
                    me_val = me_val + me.query_prop(key);
                    if (!me_val || me_val < val) {

                        return me.notify_fail("你的" + PROPERTIES[key] + "不够" + val + "，无法装备" + this.color_name + "。");;
                    }
                    break;
            }
        }
        return true;
    }

    /**
     * 装备到角色
     * @param {CHARACTER} me
     * @param {boolean} [notsend]
     * @returns {boolean|undefined}
     */
    eq(me, notsend) {
        if (this.check(me) == false) {
            return false;
        }
        if (this.on_eq && this.on_eq(me) == false) {
            return false;
        }
        this.change_prop(me, true);
        this.check_group(me, true);
        if (!notsend) {
            if (this.eq_msg)
                me.send_room(this.eq_msg, this);
            else {
                let msg;
                switch (this.eq_type) {
                    case EQUIP_TYPE.WEAPON:
                        msg = "$N抽出一" + this.unit + this.color_name + "拿在手上。";
                        break;
                    case EQUIP_TYPE.CLOTH:
                    case EQUIP_TYPE.SHOES:
                    case EQUIP_TYPE.PANTS:
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
    }

    /**
     * 卸下装备
     * @param {CHARACTER} me
     * @param {boolean} [notsend]
     */
    uneq(me, notsend) {
        this.on_uneq && this.on_uneq(me);
        this.change_prop(me, false);
        this.check_group(me, false);

        if (!notsend) {
            if (this.uneq_msg)
                me.send_room(this.uneq_msg, this);
            else {
                let msg;
                switch (this.eq_type) {
                    case EQUIP_TYPE.WEAPON:
                        msg = "$N收回手中的" + this.color_name + "。";
                        break;
                    case EQUIP_TYPE.CLOTH:
                    case EQUIP_TYPE.SHOES:
                    case EQUIP_TYPE.PANTS:
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
     * @param {string[]} str - 输出数组
     */
    condition_tostring(str) {
        if (!this.condition) return;
        for (let key in this.condition) {
            const val = this.condition[key];
            switch (key) {
                case "skill":
                    for (let sk in val) {
                        const sk_base = SKILL.get(sk);
                        str.push(sk_base.name + "要求：" + val[sk] + "级");
                    }
                    break;
                case "desc":
                    str.push(desc);
                    break;
                case "gender":
                    str.push("性别要求：" + (val == 1 ? "男" : "女"));
                    break;
                default:
                    str.push(PROPERTIES[key] + "要求：" + val);
                    break;
            }
            str.push("\n");
        }
    }

    /** @type {string[]} 装备部位名称 */
    parts = ['武器', '衣服', '鞋', '头部', '披风', '戒指', '项链', '饰品', '护腕', '腰带', '暗器'];
    /** @type {string[]} 品质名称 */
    qualities = ["普通", "精良", "高级", "稀有", "绝世", "传说", "神器"];

    /**
     * 获取装备完整描述
     * @param {CHARACTER} me
     * @returns {string}
     */
    get_desc(me) {
        const str = [this.color_name];
        str.push("\n");
        str.push(this.parts[this.eq_type]);
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
     * @returns {string}
     */
    query_quality() {
        return this.qualities[this.grade];
    }

    /**
     * 装备强化升级
     * @param {number} lev - 强化目标等级
     */
    level_up(lev) {
        const cc = this.query_grade_color();

        this.prop = {};
        this.level = lev;
        this.levelchange_prop();
        this.color_name = "<" + cc + ">" + level_desc[this.level] + this.name + "</" + cc + ">";
        this.json = null;
    }


    /** @type {number[]} 强化等级参数 */
    levelData = [
        0, 10, 20, 40, 70, 110, 160, 220, 290, 370, 460, 560, 670
    ];

    /** 根据强化等级重新计算属性 */
    levelchange_prop() {
        if (!(this.level >= 0 && this.level < 13)) return;
        const base_props = this.original_prop ?? Object.getPrototypeOf(this).prop;
        const val = this.levelData[this.level];
        for (let key in base_props) {
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
                    this.prop[key] = value;
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
                    this.prop[key] = value + parseInt(value * val / 1000);
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
                    this.prop[key] = value;
                    break;
                default:
                    if (PROPERTIES[key])
                        this.prop[key] = value + parseInt(value * val / 100);
                    else
                        this.prop[key] = value;
                    break;
            }
        }
    }

    /** 清除所有镶嵌宝石 */
    clear_stone() {
        if (!this.st_prop) return;

        this.hole_count += (this.st_prop.length);
        this.st_prop.length = 0;
    }

    /**
     * 镶嵌宝石
     * @param {OBJ} stone - 宝石物品
     * @returns {boolean|undefined}
     */
    push_stone(stone) {
        if (!stone || !stone.prop) return false;
        if (!this.hole_count) return false;

        if (!this.st_prop) this.st_prop = [];
        this.hole_count--;
        const cc = stone.query_grade_color();
        const str = ["<", cc, ">◆", stone.name, " "];
        str.push(UTIL.prop_toString(stone.prop, " "));
        str.push("</");
        str.push(cc);
        str.push(">");

        this.json = null;
        this.st_prop.push({
            id: stone.id,
            path: stone.path,
            name: str.join(""),
            prop: stone.prop,
            grade: stone.grade
        });
    }

    /**
     * 克隆装备(保留强化和宝石)
     * @param {CHARACTER} me
     * @returns {EQUIPMENT}
     */
    clone(me) {
        const obj = OBJ.CREATE(this.path);
        if (this.temp) {
            obj.temp = {};
            for (let key in this.temp) {
                obj.temp[key] = this.temp[key];
            }
        }
        obj.on_reload && obj.on_reload(me);
        obj.level_up(this.level);
        obj.st_prop = this.st_prop;
        return obj;
    }




    /**
     * 装备存档序列化
     * @param {string[]} str
     */
    save_db(str) {
        str.push('["', this.path, '","', this.id, '",', this.level);
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
     * 从数据库加载装备
     * @param {Array<*>} data
     */
    load_db(data) {
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
     * 装备加载后回调
     * @param {CHARACTER} me
     */
    on_load(me) {
        this.on_reload && this.on_reload(me);
        if (this.level > 0) {
            this.level_up(this.level);
        }
    }

    /** @type {number[]} 各品级装备价值 */
    VALUES = [100, 1000, 2000, 10000, 100000, 1000000, 100000000];

    /**
     * 装备创建回调
     * @param {string} path
     * @param {string} [par]
     */
    on_create(path, par) {
        this.value = this.VALUES[this.grade];

    }

    /**
     * 查询套装描述
     * @param {CHARACTER} me
     * @param {string[]} str
     */
    query_group_desc(me, str) {
        if (!this.group_prop || !this.group_name) return;
        let count = 0;
        if (me && me.equipment) {
            for (let i = 0; i < me.equipment.length; i++) {
                if (me.equipment[i] && me.equipment[i].group_name == this.group_name) {
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
     * @param {CHARACTER} me
     * @param {boolean} isadd - true装备 false卸下
     */
    check_group(me, isadd) {
        if (!this.group_prop || !this.group_name) return;
        let count = isadd ? 1 : 0;
        for (let i = 0; i < me.equipment.length; i++) {
            if (me.equipment[i] && me.equipment[i].group_name == this.group_name) {
                count++;
            }
        }
        const prop = this.group_prop(count);
        if (prop) {
            me.change_prop(prop, isadd);
        }

    }
}

/** @type {string[]} 强化等级图标 */
const level_desc = ["", "☆", "★", "★☆", "★★", "★★☆", "★★★",
    "★★★☆", "★★★★", "★★★★☆", "★★★★★", "★★★★★☆", "★★★★★★"];
