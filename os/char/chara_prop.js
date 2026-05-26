
require("./character.js");
CHARACTER.prototype.add_prop = function (p, v) {
    if (!p) return;
    if (!this.prop) {
        this.prop = {};
    }
    var v1 = this.prop[p] || 0;

    this.prop[p] = v1 + v;
}
CHARACTER.prototype.clear_prop = function () {
    this.prop = {};
}
CHARACTER.prototype.query_prop = function (name) {
    if (this.prop)
        return this.prop[name] || 0;
    return 0;
}
CHARACTER.prototype.query_force_rad = function () {
    if (this.force_skill && this.force_skill.force_rad)
        return this.force_skill.force_rad || 0.1;
    return 0.1;
}
CHARACTER.prototype.add_maxmp = function (count) {
    this.max_mp += count;
    this.recount();
    this.notify("<hig>你增加了" + count + "点内力。</hig>");
}
CHARACTER.prototype.query_temp = function (name, def) {
    if (!this.temp) return def;
    var item = this.temp[name];
    if (item && item.e) {
        if (Date.now() <= item.e) {
            return item.v;
        }
        this.temp[name] = null;
        return def;
    }
    return item ?? def;
}
CHARACTER.prototype.set_temp = function (name, value, time) {
    if (!this.temp) this.temp = {};
    if (time) {
        this.temp[name] = {
            v: value,
            e: Date.now() + time
        };
    } else {
        this.temp[name] = value;
    }
}
CHARACTER.prototype.remove_temp = function (name) {
    if (!this.temp) return;
    this.temp[name] = null;
}

CHARACTER.prototype.add_temp = function (name, value, time) {
    let val = this.query_temp(name, 0) + value;
    this.set_temp(name, val, time);
    return val;
}

CHARACTER.prototype.change_prop = function (prop, isadd) {
    if (!prop) return;
    for (var item in prop) {
        switch (item) {
            case "desc":
                break;
            case "skill":
                var sks = prop[item];
                for (var sk in sks) {
                    var lv = this.query_skill(sk, 0);
                    if (!lv) {
                        this.add_prop(sk, isadd ? sks[sk] : -sks[sk]);
                        continue;
                    }
                    var sk_base = SKILL.get(sk);
                    if (!sk_base) continue;
                    sk_base.release_prop(this, lv);

                    this.add_prop(sk, isadd ? sks[sk] : -sks[sk]);

                    lv = this.query_skill(sk, 0);

                    sk_base.attach_prop(this, lv);
                    if (this.is_player) {
                        this.notify('{type:"dialog",dialog:"skills",id:"' + sk + '",level:' + lv + '}');
                    }

                }
                break;
            default:
                this.add_prop(item, isadd ? prop[item] : -prop[item]);
                break;
        }
    }
}
CHARACTER.prototype.add_fbscore = function (v, max) {
    var fb = this.environment.query_fb_first(this.query_teamid());
    if (!fb) return;
    fb.score = (fb.score || 0) + v;
    if (max > 0 && fb.score > max) fb.score = max;
}
CHARACTER.prototype.query_fbscore = function (v) {
    var first_room = this.environment.query_fb_first(this.query_teamid());
    if (!first_room) return 0;
    return first_room.score || 0;
}

CHARACTER.prototype.add_score = function (val) {

}

CHARACTER.prototype.add_combat_prop = function (name, val) {
    this.add_prop(name, val);
    if (!this.combat_props) this.combat_props = [];
    this.combat_props.push([name, val]);
    if (name === 'max_hp') {
        this.max_hp += val;
    }
}


CHARACTER.prototype.clear_combat_prop = function (name, val) {
    if (this.combat_props) {
        for (let i = 0; i < this.combat_props.length; i++) {
            this.add_prop(this.combat_props[i][0], -this.combat_props[i][1]);
            if (this.combat_props[i][0] === 'max_hp') {
                this.max_hp -= this.combat_props[i][1];
                this.notify_hp();
            }
        }
        this.combat_props = null;
        this.recount();
    }
}