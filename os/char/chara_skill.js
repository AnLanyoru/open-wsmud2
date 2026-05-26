
require("./character.js");
CHARACTER.prototype.query_skill = function (name, def) {
    if (!this.skills || !this.skills[name]) return def || 0;
    return this.skills[name].level + this.query_prop(name);
}
CHARACTER.prototype.skill_map = function () {
    //给NPC初始化技能用的，不做任何判断
    this.skills = this.skills || {};
    for (var i = 0; i < arguments.length; i++) {
        var item = arguments[i];
        if (!item) continue;
        var skill_base = SKILL.get(item[0]);
        if (!skill_base) {
            console.log(item[0] + " not exits")
            continue;
        }
        var skill = {
            level: item[1] || 1,
            exp: 0
        };
        this.skills[skill_base.id] = skill;
        if (item[2]) {
            var enables = item[2];
            if (typeof enables == "string") enables = [enables];
            for (var j = 0; j < enables.length; j++) {

                skill[enables[j]] = true;
                this.skills[enables[j]].enable_skill = item[0];
            }
        }
    }
}
CHARACTER.prototype.remove_skill = function (skillid) {
    var skill = this.skills[skillid];
    if (!skill) return;
    var baseskill = SKILL.get(skillid);
    if (!baseskill) return false;

    if (baseskill.type == SKILL_TYPES.BASE) {
        if (skill.enable_skill) {
            var old_skill = SKILL.get(skill.enable_skill);
            if (!old_skill || !this.skills[skill.enable_skill]) {
                return false;
            }
            old_skill.disenable(this, skillid);
            this.skills[skill.enable_skill][skillid] = false;
        }
    } else {
        for (var key in this.skills) {
            if (this.skills[key].enable_skill == skillid) {

                this.skills[key].enable_skill = null;
            }
        }
    }
    baseskill.release_prop(this, this.query_skill(skillid));
    delete this.skills[skillid];
    this.init_skill();
    this.recount();
    this.add_score(-baseskill.query_score(skill.level, this));
    baseskill.on_remove && baseskill.on_remove(this);
    return true;
}
//增加技能
CHARACTER.prototype.set_skill = function (skid, level) {
    if (!this.skills) this.skills = {};
    var item = this.skills[skid];
    var skill_base = SKILL.get(skid);
    if (!skill_base) return;
    if (!item) {
        item = {
            //id: skid,
            level: level,
            exp: 0
        };
        this.skills[skid] = item;
        skill_base.attach_prop(this, level);
    } else {
        skill_base.release_prop(this, this.query_skill(skid));
        item.level = level;
        skill_base.attach_prop(this, this.query_skill(skid));
    }
    this.init_skill();
    this.recount();
}
CHARACTER.prototype.skill_limit = function () {
    if (this.exp < 100) return 10;
    switch (this.level) {
        case 1: return Math.round(Math.pow(this.exp * 20, 1 / 3));
        case 2: return Math.round(Math.pow(this.exp * 30, 1 / 3));
        case 3: return Math.round(Math.pow(this.exp * 40, 1 / 3));
        case 4: return Math.round(Math.pow(this.exp * 50, 1 / 3));
        case 5: return Math.round(Math.pow(this.exp * 60, 1 / 3));
        case 6: return Math.round(Math.pow(this.exp * 60, 1 / 3));
        default:
            return Math.round(Math.pow(this.exp * 10, 1 / 3));
    }
}

CHARACTER.prototype.query_ref_skill = function (skill) {
    if (!skill || !skill.ref) return;
    var refs = skill.ref.split("/");
    var sp_skill = SKILL.get(refs[0]);
    if (sp_skill) {
        return sp_skill.get_pfm(refs[1]);
    }
}
//判断某个技能是否装备到某个基本技能上
CHARACTER.prototype.is_enable_skill = function (skid, type) {
    if (!this.skills) return;
    var item = this.skills[skid];
    if (!item) return;
    return item[type];
}
//装备技能到基本技能
CHARACTER.prototype.enable_skill = function (base, skill) {
    if (!this.skills) return;
    var baseskill = this.skills[base];
    if (!baseskill) return;
    if (baseskill.enable_skill) {
        var old_skill = this.skills[baseskill.enable_skill];
        if (!old_skill) return;
        old_skill[base] = false;

        old_skill = SKILL.get(baseskill.enable_skill);
        if (old_skill) {
            old_skill.disenable(this, base);
        }
    }
    if (skill) {
        var sp_skill = this.skills[skill];

        if (baseskill && sp_skill) {
            var sp_skill_base = SKILL.get(skill);
            if (!sp_skill_base || sp_skill_base.enable(this, base) !== true)
                return false;
            baseskill.enable_skill = skill;
            sp_skill[base] = true;
        }
    } else {
        baseskill.enable_skill = null;
    }
    this.init_skill();
    this.recount();

    return true;
}
//初始化人物使用的技能
CHARACTER.prototype.init_skill = function () {
    this.attack_skill = this.query_used_skill(this.query_weapon_type());
    this.noweapon_skill = this.query_used_skill(WEAPON_TYPE.NONE);
    this.dodge_skill = this.query_used_skill(BASE_SKILLS.DODGE);
    this.parry_skill = this.query_used_skill(BASE_SKILLS.PARRY);
    this.force_skill = this.query_used_skill(BASE_SKILLS.FORCE);
    this.on_skillchanged && this.on_skillchanged();
    this.auto_skills = null;
}

CHARACTER.prototype.query_used_skill = function (skname) {
    if (!this.skills) {
        return WORLD.DEFAULT_SKILLS[skname];
    }
    var skill = this.skills[skname];
    if (skill) {

        var skill_base = SKILL.get(skill.enable_skill || skname);
        if (!skill_base) skill.enable_skill = null;
        else return skill_base;
    }
    return WORLD.DEFAULT_SKILLS[skname];
}
CHARACTER.prototype.query_status = function (sid) {
    if (!this.status) return 0;
    for (var i = 0; i < this.status.length; i++) {
        if (this.status[i].id == sid) {
            return this.status[i].count;
        }
    }
    return 0;
}
CHARACTER.prototype.add_status = function (buff, from) {
    if (this.hp <= 0) return false;
    if (!this.status) this.status = [];
    var sid = buff.id;
    buff.override = buff.override || 0;
    buff.count = buff.count || 1;
    buff.max_count = buff.max_count || 10;

    buff.start_time = Date.now();
    if (buff.on_interval) {
        buff.over_count = buff.over_count || 0;
    }
    if (this.ig_control && !buff.no_diff) {
        if (buff.is_busy || buff.is_faint || buff.is_miss || buff.is_rash) {
            return false;
        }
    }
    if (buff.downside && buff.duration && !buff.no_diff) {
        //buff.duration = buff.duration - this.query_prop("diff_downside");
        buff.duration = Math.round(buff.duration * (100 - this.query_prop("diff_downside_per")) / 100);
        if (buff.duration <= 0) {
            return false;
        }
    }
    if (buff.is_busy && !buff.no_diff) {
        if (from) {
            buff.duration = buff.duration + from.query_prop("busy");
            buff.duration = buff.duration * (100 + from.query_prop("busy_per")) / 100;
        }
        buff.duration = buff.duration - this.query_prop("diff_busy");
        buff.duration = Math.round(buff.duration * (100 - this.query_prop("diff_busy_per")) / 100);
        if (buff.duration <= 0) {
            return false;
        }
    }
    for (var i = 0; i < this.status.length; i++) {

        if (this.status[i].id == sid) {
            var item = this.status[i];
            if (item.override != buff.override) return false;
            if (item.override == 0) {
                //0不覆盖 1叠加 2覆盖替换

                return false;
            }
            if (item.override == 1) {
                if (item.max_count <= item.count) {
                    return false;
                }
                item.count += buff.count;
                clearTimeout(item.handler);
                if (item.duration)
                    item.handler = this.call_out(this.remove_status, item.duration, sid);
                this.change_buff(item, true, buff.count);
                item.start_time = buff.start_time;
                this.status_changed(item, "refresh");
            } else {

                item.handler && clearTimeout(item.handler);
                this.change_buff(item, false, item.count);//覆盖先移除 后添加 重新计时
                this.status_changed(item, "remove");
                if (buff.duration)
                    item.handler = this.call_out(this.remove_status, buff.duration, sid);
                this.status[i] = buff;
                buff.start_time = buff.start_time;
                this.change_buff(buff, true, buff.count);
                this.status_changed(buff, "add");
            }
            return;
        }
    }
    if (buff.duration)
        buff.handler = this.call_out(this.remove_status, buff.duration, sid);
    this.status.push(buff);

    this.change_buff(buff, true, buff.count);
    this.status_changed(buff, "add");
}

CHARACTER.prototype.clear_downside = function (type) {
    if (!this.status) return;
    var removed = "0";
    var count = 0;
    for (var i = 0; i < this.status.length; i++) {
        var item = this.status[i];
        if ((item.downside || false) == type && !item.no_clear) {

            this.change_buff(item, false, item.count);
            item.handler && clearTimeout(item.handler);
            this.status.splice(i, 1);
            i--;
            removed += ',"' + item.id + '"';
            count++;
        }
    }
    if (removed.length == 1 || !this.environment) return;
    var items = this.environment.items;
    var msg = '{type:"status",id:"' + this.id + '",sid:[' + removed + '],action:"remove"}';
    for (var i = 0; i < items.length; i++) {
        var player = items[i];
        if (player.is_player) {
            player.send(msg);
        }
    }
    return count;

}


CHARACTER.prototype.clear_combat_status = function () {
    if (!this.status || !this.status.length) return;
    var removed = "0";
    for (var i = this.status.length - 1; i >= 0; i--) {
        var item = this.status[i];
        if (item.only_combat) {
            this.change_buff(item, false, item.count);
            item.handler && clearTimeout(item.handler);
            this.status.splice(i, 1);
            removed += ',"' + item.id + '"';
        }
    }
    if (removed.length == 1 || !this.environment) return;
    var items = this.environment.items;
    var msg = '{type:"status",id:"' + this.id + '",sid:[' + removed + '],action:"remove"}';
    for (var i = 0; i < items.length; i++) {
        var player = items[i];
        if (player.is_player) {
            player.send(msg);
        }
    }
}
CHARACTER.prototype.remvoe_statuses = function (func) {
    if (!this.status || !this.status.length) return;
    var removed = "0";
    for (var i = this.status.length - 1; i >= 0; i--) {
        var item = this.status[i];
        if (func(item)) {
            this.change_buff(item, false, item.count);
            item.handler && clearTimeout(item.handler);
            this.status.splice(i, 1);
            removed += ',"' + item.id + '"';
        }
    }
    if (removed.length == 1 || !this.environment) return;
    var items = this.environment.items;
    var msg = '{type:"status",id:"' + this.id + '",sid:[' + removed + '],action:"remove"}';
    for (var i = 0; i < items.length; i++) {
        var player = items[i];
        if (player.is_player) {
            player.send(msg);
        }
    }
}
CHARACTER.prototype.clear_status = function () {
    if (!this.status || !this.status.length) return;
    for (var i = 0; i < this.status.length; i++) {
        var item = this.status[i];
        this.change_buff(item, false, item.count);
        item.handler && clearTimeout(item.handler);
    }
    this.status.length = 0;
    if (!this.environment) return;
    var msg = '{type:"status",id:"' + this.id + '",action:"clear"}';
    var items = this.environment.items;
    for (var i = 0; i < items.length; i++) {
        var player = items[i];
        if (player.is_player) {
            player.send(msg);
        }
    }
}
CHARACTER.prototype.change_buff = function (buff, isadd, buff_count) {
    if (isadd) {
        if (buff.prop) {
            for (var i = 0; i < buff_count; i++) {
                this.change_prop(buff.prop, true);
            }
            this.recount();
        }
        if (buff.on_attach) buff.on_attach(this);
        if (buff.ig_control) this.ig_control = buff.duration;

        if (buff.start_msg) {
            this.send_room(buff.start_msg);
        }
        if (buff.is_busy) this.is_busy = buff.duration;
        if (buff.is_miss) this.is_miss = buff.duration;
        if (buff.is_rash) this.is_rash = buff.duration;
        if (buff.is_shadow) this.is_shadow = buff.duration;
        if (buff.is_faint) {
            this.is_faint = buff.duration;
        }
    } else {
        if (buff.prop) {
            for (var i = 0; i < buff_count; i++) {
                this.change_prop(buff.prop, false);
            }
            this.recount();
        }
        if (buff.on_expire) buff.on_expire(this);
        if (buff.is_busy) this.is_busy = 0;
        if (buff.is_miss) this.is_miss = 0;
        if (buff.is_rash) this.is_rash = 0;
        if (buff.ig_control) this.ig_control = 0;
        if (buff.is_shadow) this.is_shadow = 0;
        if (buff.is_faint) {
            this.is_faint = 0;
        }
        if (this.hp > 0 && buff.finish_msg) {
            this.send_room(buff.finish_msg);
        }
        this.remove_temp(buff.id);
    }

}
CHARACTER.prototype.appdend_status = function (str) {
    if (!this.status) return;
    var now = Date.now();
    str.push(",status:[");
    for (var i = 0; i < this.status.length; i++) {
        if (i > 0) str.push(",");
        var item = this.status[i];
        str.push('{sid:"');
        str.push(item.id);
        str.push('",name:"');
        str.push(item.name);
        str.push('",duration:');
        if (item.on_interval) {
            str.push(item.duration * item.duration_count);
        } else {
            str.push(item.duration);
        }
        str.push(',overtime:');
        str.push(now - item.start_time);
        if (item.override === 1) {
            str.push(',"count":');
            str.push(item.count);
        }
        if (item.downside) {
            str.push(',downside:');
            str.push(true);
        }
        str.push('}');
    }
    str.push("]");
}
CHARACTER.prototype.notify_status = function () {
    if (!this.status) return;
    var str = ['{type:"status",id:\"'];
    str.push(this.id);
    str.push("\",action:'load',items:[");
    var now = Date.now();
    for (var i = 0; i < this.status.length; i++) {
        if (i > 0) str.push(",");
        var item = this.status[i];
        str.push('{sid:"');
        str.push(item.id);
        str.push('",name:"');
        str.push(item.name);
        str.push('",duration:');
        if (item.on_interval) {
            str.push(item.duration * item.duration_count);
        } else {
            str.push(item.duration);
        }

        str.push(',overtime:');
        str.push(now - item.start_time);
        if (item.override === 1) {
            str.push(',"count":');
            str.push(item.count);
        }
        if (item.downside) {
            str.push(',downside:');
            str.push(true);
        }
        str.push('}');
    }
    str.push("]}");
    this.send(str.join(""));
}
CHARACTER.prototype.status_changed = function (item, type) {
    var str = [];
    str.push('{type:"status","action":"');
    str.push(type);
    str.push('",id:"');
    str.push(this.id);
    str.push('",sid:"');
    str.push(item.id);
    str.push('"');
    if (type === "add") {
        str.push(',"name":"');
        str.push(item.name);
        str.push('","duration":');
        if (item.on_interval) {
            str.push(item.duration * item.duration_count);
        } else {
            str.push(item.duration);

        }
        if (item.override === 1) {
            str.push(',"count":');
            str.push(item.count);
        }
        if (item.downside) {
            str.push(',downside:');
            str.push(true);
        }
    } else if (type === "refresh") {
        str.push(',count:');
        str.push(item.count);
    }
    str.push('}');
    if (!this.environment) return;
    var msg = str.join("");
    var items = this.environment.items;
    for (var i = 0; i < items.length; i++) {
        var player = items[i];
        if (player.is_player) {
            player.send(msg);
        }
    }
}
CHARACTER.prototype.remove_status = function (sid, isall) {
    if (!this.status) return;
    for (var i = this.status.length - 1; i >= 0; i--) {
        if (this.status[i].id === sid) {
            var item = this.status[i];
            if (item.handler) clearTimeout(item.handler);
            item.handler = null;


            if (item.on_interval && !isall) {
                item.over_count++;
                if (item.on_interval) {
                    if (item.on_interval(this, item.over_count) === false) {
                        item.duration_count = item.duration_count || 2;
                        item.over_count = item.duration_count;
                    }
                }
                if (item.duration_count === 0 || (item.duration_count > 1 && item.duration_count > item.over_count)) {
                    if (item.duration)
                        item.handler = this.call_out(this.remove_status, item.duration, sid);
                    // item.start_time = Date.now();
                    return;
                }
            }

            this.change_buff(item, false, 1);

            if (item.override === 1) {
                item.count--;
                if (item.count === 0 || isall) {

                    this.change_buff(item, false, item.count);

                    this.status_changed(item, "remove");
                    this._splice_status(i, item);
                } else {
                    if (item.duration)
                        item.handler = this.call_out(this.remove_status, item.duration, sid);
                    item.start_time = Date.now();
                    this.status_changed(item, "refresh");
                }
            } else {
                //覆盖和不覆盖的都直接移除
                this.status_changed(item, "remove");
                this._splice_status(i, item);
            }

            return;
        }
    }
}
CHARACTER.prototype._splice_status = function (index, item) {
    if (this.status[index] === item) {
        return this.status.splice(index, 1);
    }
    for (var i = 0; i < this.status.length; i++) {
        if (this.status[i] === item) {
            return this.status.splice(i, 1);
        }
    }
}

