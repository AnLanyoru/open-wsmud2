/**
 * CHARACTER 装备系统扩展
 */
require("./character.js");

/**
 * 设置初始佩戴物品
 * @param {...[string, number, boolean]} arguments - [物品路径, 数量, 是否装备]
 */
CHARACTER.prototype.set_objects = function () {
    if (!arguments.length) return;
    if (!this.items) this.items = [];
    for (var i = 0; i < arguments.length; i++) {
        var item = arguments[i];
        var obj = OBJ.CREATE(item[0], item[1]);
        if (!obj) continue;
        if (item[2] && obj.is_equipment) {
            if (!this.equipment) this.equipment = []
            this.equipment[obj.eq_type] = obj;
        } else {
            this.items.push(obj);
        }
    }

}

/**
 * 卸下装备
 * @param {EQUIPMENT} obj - 装备对象
 * @param {boolean} [notsend] - 是否不发送消息
 * @param {number} [recover_time=0] - 冷却时间
 * @returns {boolean|undefined}
 */
CHARACTER.prototype.unequip = function (obj, notsend, recover_time = 0) {
    if (!obj || !obj.is_equipment || !this.equipment) return;
    if (obj.uneq(this, notsend) == false) {
        return false;
    }
    if (obj != this.equipment[obj.eq_type]) return;
    if (!this.items) this.items = [];
    this.items.push(obj);
    this.equipment[obj.eq_type] = null;
    if (obj.eq_type == EQUIP_TYPE.WEAPON) {
        this.remove_status('weapon', true);
        if (obj.is_shortcut) {
            this.send("{type:'addAction',id:'" + obj.id + "',name:'" + obj.name + "'}");
        }
    }

    if (obj.eq_type === EQUIP_TYPE.WEAPON)
        this.weapon_changed(false);
    this.recount();
    if (recover_time > 0 && this.is_player) {
        this.set_temp('eq_wea', obj.id, 60000);
    }
}




/**
 * 装备物品
 * @param {EQUIPMENT} obj - 装备对象
 * @returns {boolean|undefined}
 */
CHARACTER.prototype.equip = function (obj) {
    if (!obj || !obj.is_equipment) return;
    if (!this.equipment) this.equipment = []
    var equiped = this.equipment[obj.eq_type];
    if (equiped == obj) {
        return;
    }
    if (equiped) {
        equiped.uneq(this);
        this.equipment[equiped.eq_type] = null;
        this.items.push(equiped);
        if (equiped.eq_type == EQUIP_TYPE.WEAPON) {
            this.remove_status('weapon', true);
        }
        if (equiped.on_use) {
            equiped.notify_action(this, false);
        }
        if (equiped.is_shortcut) {
            this.send("{type:'addAction',id:'" + equiped.id + "',name:'" + equiped.name + "'}");
        }
    }
    if (obj.eq(this) == false) {
        if (equiped) {
            if (obj.eq_type === EQUIP_TYPE.WEAPON)
                this.weapon_changed(false);
            this.recount();
        }
        return false;
    }
    this.items.remove(obj);
    this.equipment[obj.eq_type] = obj;
    if (obj.eq_type === EQUIP_TYPE.WEAPON)
        this.weapon_changed(true);
    this.recount();
    if (obj.is_shortcut) {
        this.send("{type:'removeAction',id:'" + obj.id + "'}");
    }
    if (obj.eq_type == EQUIP_TYPE.WEAPON) {
        if (this.fight_type) {
            this.release_time = 3000 + Date.now();
            this.send('{type:"dispfm",rtime:3000}');
        }
        if (this.query_temp('jxtm')) {
            this.remove_status('force');
        }
    }
}

/** @type {Object<string, boolean>} 需要武器的技能类型 */
const WEAPON_TYPES = {
    "sword": true,
    "blade": true,
    "staff": true,
    "club": true,
    "whip": true
}

/**
 * 武器变更处理
 * @param {boolean} iseq - 是否装备武器
 */
CHARACTER.prototype.weapon_changed = function (iseq) {
    this.attack_skill = this.query_used_skill(this.query_weapon_type());
    this.on_skillchanged && this.on_skillchanged();
    if (!this.auto_skills) return;

    for (let item of this.auto_skills) {
        if (WEAPON_TYPES[item.type]) {
            item.ban_use = !iseq;
        }
    }
}

/**
 * 添加物品
 * @param {OBJ|string} obj
 * @param {number} [count]
 * @returns {OBJ|undefined}
 */
CHARACTER.prototype.add_obj = function (obj, count) {
    if (!obj) return;
    if (typeof obj == "string") {
        obj = OBJ.clone_to(obj, this, count);
        if (!obj) return;
    } else {
        obj = this.push_item(obj);
    }
    return obj;
}

/**
 * 移除物品
 * @param {OBJ|string} obj
 * @param {number} [count]
 * @returns {OBJ|undefined}
 */
CHARACTER.prototype.remove_obj = function (obj, count) {
    if (typeof obj == "string") {
        obj = this.find_obj(obj);
    }
    if (!obj) return;
    count = count || obj.count || 1;
    this.remove_item(obj, count);
    return obj;
}

/**
 * 获取当前武器
 * @returns {EQUIPMENT|undefined}
 */
CHARACTER.prototype.query_weapon = function () {
    if (this.equipment) {
        return this.equipment[EQUIP_TYPE.WEAPON];
    }
}

/**
 * 获取当前武器类型
 * @returns {string}
 */
CHARACTER.prototype.query_weapon_type = function () {
    if (this.equipment) {
        var eq = this.equipment[EQUIP_TYPE.WEAPON];
        if (eq) return eq.weapon_type;
    }
    return WEAPON_TYPE.NONE;
}

/**
 * 获取武器名称
 * @returns {string}
 */
CHARACTER.prototype.weapon_name = function () {
    if (this.equipment && this.equipment[EQUIP_TYPE.WEAPON]) {
        return this.equipment[EQUIP_TYPE.WEAPON].color_name;
    }
    return "";
}

/**
 * 获取暗器名称
 * @returns {string}
 */
CHARACTER.prototype.throwing_name = function () {
    if (this.equipment && this.equipment[EQUIP_TYPE.THROWING]) {
        return this.equipment[EQUIP_TYPE.THROWING].color_name;
    }
    return "";
}

/**
 * 是否有暗器可用
 * @returns {boolean}
 */
CHARACTER.prototype.can_throwing = function () {
    if (this.equipment) {
        var th = this.equipment[EQUIP_TYPE.THROWING];
        if (!th) return false;
        return true;
    }
    return false;
}

/**
 * 获取指定类型装备
 * @param {number} type - 装备类型 (EQUIP_TYPE)
 * @returns {EQUIPMENT|undefined}
 */
CHARACTER.prototype.get_equipment = function (type) {
    return this.equipment && this.equipment[type];
}

/**
 * 设置掉落列表
 * @param {...*} arguments - 掉落定义
 */
CHARACTER.prototype.set_drop = function () {
    this.drop_list = this.drop_list || [];
    for (var i = 0; i < arguments.length; i++) {
        this.drop_list.push(arguments[i]);
    }
}

/**
 * 查询掉落物品
 * @returns {OBJ[]|undefined}
 */
CHARACTER.prototype.query_drop = function () {
    if (!this.drop_list) return;
    return OBJ.create_by_odds(this.drop_list);

}
