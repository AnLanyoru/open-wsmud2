const UTIL = globalThis.UTIL;
const USER = globalThis.USER;


USER.prototype.recount = function () {
    this.max_hp = parseInt(this.con * 5 + (this.max_mp * this.query_force_rad()
        + this.query_prop("max_hp") + this.query_prop("con") * this.con) * (100 + this.query_prop("hp_per")) / 100);

    if (this.hp > this.max_hp) this.hp = this.max_hp;

    this.gjsd = 4000 - this.query_prop("gjsd");
    if (this.gjsd > 500) {
        this.gjsd = parseInt(this.gjsd - (this.gjsd * this.query_prop("gjsd_per") / 100));
        if (this.gjsd < 500) this.gjsd = 500;
    } else {
        this.gjsd = 500;
    }

    this.gj = parseInt(this.str + (this.query_prop("gj") + this.query_prop("str") * this.str / 10) * (100 + this.query_prop("gj_per")) / 100);
    this.fy = parseInt(((this.str + this.con) / 10 + this.query_prop("fy") + this.query_prop("con") * this.con / 10) * (100 + this.query_prop("fy_per")) / 100);
    this.mz = parseInt((this.dex / 2 + this.query_prop("mz")) * (100 + this.query_prop("mz_per")) / 100);
    this.ds = parseInt((this.dex / 2 + this.query_prop("ds") + this.query_prop("dex") * this.dex / 10) * (100 + this.query_prop("ds_per")) / 100);
    if (this.dodge_skill && this.dodge_skill.on_recount_dodge) {
        this.ds += this.dodge_skill.on_recount_dodge(this);
    }
    this.zj = parseInt((this.str / 2 + this.query_prop("zj") + this.query_prop("str") * this.str / 10) * (100 + this.query_prop("zj_per")) / 100);
    if (this.parry_skill && this.parry_skill.on_recount_parry) {
        this.zj += this.parry_skill.on_recount_parry(this);
    }
    this.bj = parseInt(this.dex / 10 + this.query_prop("bj_per"));
    this.diff_sh_per = this.query_prop('diff_sh_per');


    this.diff_fy_per = this.query_prop('diff_fy_per');
}

USER.prototype.level_up = function () {
    if (!this.level) {
        var sk = this.skill_limit();
        this.level = 1;
        this.notify("<hiy>恭喜你提升到了" + this.get_level_desc() + "境界。</hiy>");
        this.add_exp(10000, 10000);
        var now_sk = this.skill_limit();
        this.limit_mp += 1000;
        this.notify("<hiw>你的内力限制增加了1000。</hiw>");
        this.notify("<hiw>你的技能等级限制增加了" + (now_sk - sk) + "。</hiw>");

    } else if (this.level == 1) {
        var sk = this.skill_limit();
        this.level = 2;
        this.notify("<hiy>恭喜你提升到了" + this.get_level_desc() + "境界。</hiy>");
        this.add_exp(100000, 100000);
        var now_sk = this.skill_limit();
        this.limit_mp += 5000;
        this.notify("<hiw>你的最大内力限制增加了5000。</hiw>");
        this.notify("<hiw>你的技能等级限制增加了" + (now_sk - sk) + "。</hiw>");
    } else if (this.level == 2) {
        var sk = this.skill_limit();
        this.level = 3;
        this.notify("<hiy>恭喜你提升到了" + this.get_level_desc() + "境界。</hiy>");
        this.add_exp(200000, 200000);
        var now_sk = this.skill_limit();
        this.limit_mp += 10000;
        this.notify("<hiw>你的最大内力限制增加了10000。</hiw>");
        this.notify("<hiw>你的技能等级限制增加了" + (now_sk - sk) + "。</hiw>");

    } else if (this.level == 3) {
        var sk = this.skill_limit();
        this.level = 4;
        this.notify("<hiy>恭喜你提升到了" + this.get_level_desc() + "境界。</hiy>");
        this.add_exp(500000, 500000);
        var now_sk = this.skill_limit();
        this.limit_mp += 20000;
        this.notify("<hiw>你的最大内力限制增加了20000。</hiw>");
        this.notify("<hiw>你的技能等级限制增加了" + (now_sk - sk) + "。</hiw>");
    } else if (this.level == 4) {
        var sk = this.skill_limit();
        this.level = 5;
        this.notify("<hiy>恭喜你提升到了" + this.get_level_desc() + "境界。</hiy>");
        this.add_exp(1000000, 1000000);
        var now_sk = this.skill_limit();
        this.limit_mp += 50000;
        this.notify("<hiw>你的最大内力限制增加了50000。</hiw>");
        this.notify("<hiw>你的技能等级限制增加了" + (now_sk - sk) + "。</hiw>");
    } else if (this.level == 5) {
        var sk = this.skill_limit();
        this.level = 6;
        this.notify("<hiy>恭喜你提升到了" + this.get_level_desc() + "境界。</hiy>");
        this.add_exp(2000000, 2000000);
        this.limit_mp += 500000;
        this.add_temp("fenpei", 1);
        this.notify("<hiw>你的最大内力限制增加了500000。</hiw>");
        this.notify("<hiw>你的先天属性增加了1点。</hiw>");
    }
    this.color_name = null;
    this.environment.item_changed(this, true);
    this.send(`{type:"levelup",level:${this.level}}`);
}
USER.prototype.is_team = function (p) {
    if (!p || !p.team) return;
    return this.team == p.team;
}

USER.prototype.query_teamid = function () {
    if (this.team) return this.team.id;
    return this.id;
}

USER.prototype.can_trans = function () {
    if (!this.environment) return true;
    if (this.environment.is_fb()) return this.notify_fail("你现在正在副本区域。");
    if (this.environment.parent.on_leave(this) == false) return false;
    return true;
}

USER.prototype.enable_area = function () {

    let area = this.environment.parent;
    if (!(area.jd_index >= 0)) return;
    if (!this.query_bool('fb2', area.jd_index)) {
        this.set_bool('fb2', area.jd_index, true);
        this.send('<him>你解锁新地图【' + area.name + '】。</him>');
        this.send(`{type:"dialog",dialog:"jh",unlock2:${this.query_temp('fb2', 0)}}`);
    }

}
USER.prototype.isenable_area = function (fb) {
    if (!fb) return false;
    if (typeof fb === 'number') {
        return this.query_bool('fb2', fb);
    }
    if (!(fb.jd_index >= 0)) return false;
    return this.query_bool('fb2', fb.jd_index);
}
USER.prototype.query_bool = function (key, index) {
    let step = parseInt(index / 32);
    if (step > 0) key = key.toString() + step.toString();
    let num = this.query_temp(key, 0);
    if (!num) return false;
    let bit = index % 32;
    return (num & (1 << bit)) !== 0;
}
USER.prototype.set_bool = function (key, index, value, time) {
    let step = parseInt(index / 32);
    if (step > 0) key = key.toString() + step.toString();
    let num = this.query_temp(key, 0);
    let bit = index % 32;
    if (value)
        this.set_temp(key, num | (1 << bit), time);
    else
        this.set_temp(key, num & ~(1 << bit), time);
}
USER.prototype.clear_bool = function (key, count) {
    let num = this.query_temp(key, 0);
    if (!num) return;
    for (let i = 0; i < count; i++) {
        if ((num & (1 << i)) !== 0) {
            return;
        }
    }
    this.remove_temp(key);
}


USER.prototype.expend_jingli = function (val) {
    if (val > 0 && this.query_jingli() >= val) {
        var expend = this.query_temp("ex_jl", 0);
        if (expend >= 200) {
            var add = this.query_temp("ad_jl", 0);
            if (add < val) return false;
            this.add_temp("ad_jl", -val);

        } else {
            if (expend + val > 200) {
                this.set_temp("ex_jl", 200, UTIL.diff_time());
                val = val - (200 - expend);
                this.add_temp("ad_jl", -val);
            } else {
                this.add_temp("ex_jl", val, UTIL.diff_time());
            }
        }
        return true;
    }
    return false;
}
USER.prototype.create_for = function (id) {
    if (!this.custom_skills) return false;
    return this.custom_skills.indexOf(id) > -1;
}
USER.prototype.query_age = function () {
    var dt = Date.now() - this.reg_time * 60000;

    return 14 + dt / 86400000 / 12 - this.query_prop("age") - this.query_temp("age", 0);
}
FOLLOWER.prototype.remove_obj = USER.prototype.remove_obj;
FOLLOWER.prototype.recount = USER.prototype.recount;
FOLLOWER.prototype.items_changed = USER.prototype.items_changed;
FOLLOWER.prototype.send_commands = USER.prototype.send_commands;
export default function() {}
