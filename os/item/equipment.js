
require("../util/util.js");
EQUIPMENT = function () {
    this.eq_type = EQUIP_TYPE.WEAPON;
    this.level = 0;
    this.exp = 0;
    this.grade = 0;
    this.count = 1;
    this.combined = false;
    this.showAction = true;
    this.allow_fight = true;
    this.otype = 4;
}
EQUIPMENT.inherits(OBJ);
EQUIPMENT.prototype.is_equipment = true;
EQUIPMENT.prototype.transable = true;
//EQUIPMENT.prototype.eq_msg = "$N装备上$n。";
//EQUIPMENT.prototype.uneq_msg = "$N脱下$n。";
EQUIPMENT.prototype.change_prop = function (me, is_attach) {
    me.change_prop(this.prop, is_attach);
    if (this.st_prop) {
        for (var i = 0; i < this.st_prop.length; i++) {
            me.change_prop(this.st_prop[i].prop, is_attach);
        }
    }
}
EQUIPMENT.prototype.notify_action = function (me, isadd) {
    if (!this.on_use) return;
    isadd = me.equipment[this.eq_type] == this;
    if (isadd)
        me.send("{type:'addAction',id:'" + this.id + "',name:'" + this.name + "',distime:" + (this.distime || 0) + "}");
    else
        me.send("{type:'removeAction',id:'" + this.id + "'}");
}
EQUIPMENT.prototype.check = function (me) {
    if (!this.condition) return true;
    for (var key in this.condition) {
        var val = this.condition[key];
        switch (key) {
            case "skill":
                for (var sk in val) {
                    if (me.query_skill(sk, 0) < val[sk]) {
                        var sk_base = SKILL.get(sk);

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
                var me_val = me[key] || 0;
                me_val = me_val + me.query_prop(key);
                if (!me_val || me_val < val) {

                    return me.notify_fail("你的" + PROPERTIES[key] + "不够" + val + "，无法装备" + this.color_name + "。");;
                }
                break;
        }
    }
    return true;
}
EQUIPMENT.prototype.eq = function (me, notsend) {
    if (this.check(me) == false) {
        return false;
    }
    if (this.on_eq && this.on_eq(me) == false) {
        return false;
    }
    this.change_prop(me, true);
    this.check_group(me, true);
    //me.add_score(this.query_score());
    if (!notsend) {
        if (this.eq_msg)
            me.send_room(this.eq_msg, this);
        else {
            var msg;
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
EQUIPMENT.prototype.uneq = function (me, notsend) {
    this.on_uneq && this.on_uneq(me);
    this.change_prop(me, false);
    this.check_group(me, false);
    //me.add_score(-this.query_score());

    if (!notsend) {
        if (this.uneq_msg)
            me.send_room(this.uneq_msg, this);
        else {
            var msg;
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

EQUIPMENT.prototype.condition_tostring = function (str) {
    if (!this.condition) return;
    for (var key in this.condition) {
        var val = this.condition[key];
        switch (key) {
            case "skill":
                for (var sk in val) {
                    var sk_base = SKILL.get(sk);
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
EQUIPMENT.prototype.parts = ['武器', '衣服', '鞋', '头部', '披风', '戒指', '项链', '饰品', '护腕', '腰带', '暗器'];
EQUIPMENT.prototype.qualities = ["普通", "精良", "高级", "稀有", "绝世", "传说", "神器"];

EQUIPMENT.prototype.get_desc = function (me) {
    var str = [this.color_name];
    str.push("\n");
    str.push(this.parts[this.eq_type]);
    //str.push("\n");
    //str.push(this.query_quality());
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
        for (var i = 0; i < this.st_prop.length; i++) {
            str.push(this.st_prop[i].name);
            str.push("\n");
        }
    }
    if (this.hole_count) {
        for (var i = 0; i < this.hole_count; i++) {
            str.push("◇");
        }
    }
    this.query_group_desc(me, str);
    return str.join("");
}


EQUIPMENT.prototype.query_quality = function () {
    return this.qualities[this.grade];
}
const level_desc = ["", "☆", "★", "★☆", "★★", "★★☆", "★★★",
    "★★★☆", "★★★★", "★★★★☆", "★★★★★", "★★★★★☆", "★★★★★★"];
EQUIPMENT.prototype.level_up = function (lev) {
    var cc = this.query_grade_color();

    this.prop = {};
    this.level = lev;
    this.levelchange_prop();
    this.color_name = "<" + cc + ">" + level_desc[this.level] + this.name + "</" + cc + ">";
    this.json = null;
}


EQUIPMENT.prototype.levelData = [
    0, 10, 20, 40, 70, 110, 160, 220, 290, 370, 460, 560, 670
];
EQUIPMENT.prototype.levelchange_prop = function () {
    if (!(this.level >= 0 && this.level < 13)) return;
    const base_props = this.original_prop ?? Object.getPrototypeOf(this).prop;
    var val = this.levelData[this.level];
    for (var key in base_props) {
        var value = base_props[key];
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
EQUIPMENT.prototype.clear_stone = function () {
    if (!this.st_prop) return;

    this.hole_count += (this.st_prop.length);
    this.st_prop.length = 0;
}
EQUIPMENT.prototype.push_stone = function (stone) {
    if (!stone || !stone.prop) return false;
    if (!this.hole_count) return false;

    if (!this.st_prop) this.st_prop = [];
    this.hole_count--;
    var cc = stone.query_grade_color();
    var str = ["<", cc, ">◆", stone.name, " "];
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
EQUIPMENT.prototype.clone = function (me) {
    var obj = OBJ.CREATE(this.path);
    if (this.temp) {
        obj.temp = {};
        for (var key in this.temp) {
            obj.temp[key] = this.temp[key];
        }
    }
    obj.on_reload && obj.on_reload(me);
    obj.level_up(this.level);
    obj.st_prop = this.st_prop;
    return obj;
}



EQUIPMENT.prototype.save_db = function (str) {
    str.push('["', this.path, '","', this.id, '",', this.level);
    if (this.st_prop && this.st_prop.length) {
        str.push(",[");
        for (var i = 0; i < this.st_prop.length; i++) {
            if (i > 0) str.push(",");
            str.push('"', this.st_prop[i].path, '"');
        }
        str.push("]");
    }
    // else {
    //     str.push(',[]');
    // }
    if (this.is_locked)
        str.push(',1');
    if (this.temp)
        str.push(",", this.format_temp(this.temp));
    str.push("]");
}
EQUIPMENT.prototype.load_db = function (data) {
    //const [path, id, level, sts, locked,temp] = data;
    this.id = data[1];
    if (data[2] > 0) {
        this.level = data[2];
    }
    for (let i = 3; i < data.length; i++) {
        let value = data[i];
        if (value === 1) this.is_locked = true;
        else if (Array.isArray(value)) {
            for (var j = 0; j < value.length; j++) {
                var st_item = OBJ.CREATE(value[j]);
                if (st_item) {
                    this.push_stone(st_item);
                }
            }
        } else if (typeof value === 'object') {
            this.temp = value;
        }
    }

}
EQUIPMENT.prototype.on_load = function (me) {
    this.on_reload && this.on_reload(me);
    if (this.level > 0) {
        this.level_up(this.level);
    }
}

EQUIPMENT.prototype.VALUES = [100, 1000, 2000, 10000, 100000, 1000000, 100000000];
EQUIPMENT.prototype.on_create = function (path, par) {
    this.value = this.VALUES[this.grade];

}

EQUIPMENT.prototype.query_group_desc = function (me, str) {
    if (!this.group_prop || !this.group_name) return;
    var count = 0;
    if (me && me.equipment) {
        for (var i = 0; i < me.equipment.length; i++) {
            if (me.equipment[i] && me.equipment[i].group_name == this.group_name) {
                count++;
            }
        }
    }
    for (var i = 2; i < 8; i++) {
        var prop = this.group_prop(i);
        if (prop) {
            var cc = i <= count ? this.query_grade_color() : "blk";

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

EQUIPMENT.prototype.check_group = function (me, isadd) {
    if (!this.group_prop || !this.group_name) return;
    var count = isadd ? 1 : 0;
    for (var i = 0; i < me.equipment.length; i++) {
        if (me.equipment[i] && me.equipment[i].group_name == this.group_name) {
            count++;
        }
    }
    var prop = this.group_prop(count);
    if (prop) {
        me.change_prop(prop, isadd);
    }

}