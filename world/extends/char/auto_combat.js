CHARACTER.prototype.reauto_attack = function () {
    if (!this.auto_pfm && this.fight_type) {
        if (this.attack_handler) clearTimeout(this.attack_handler);
        this.auto_attack();
    }
}
CHARACTER.prototype.auto_attack = function () {
    var target = this.query_enemy();
    if (this.hp <= 0) {
        if (this.fight_type && target) {
            return target.end_attack(this);
        }
        return this.end_fight();
    }
    if (!target) {
        return this.end_fight();
    }

    if (this.is_faint) {
        this.attack_handler = this.call_out(this.auto_attack, this.is_faint);
        return;
    }
    if (this.release_time) {
        var diff_time = this.release_time - Date.now();
        if (diff_time > 0) {
            this.attack_handler = this.call_out(this.auto_attack, diff_time);
            return;
        }
        this.release_time = 0;
    }
    var sh = 0;

    if (this.is_busy) {
        if (this.auto_pfm && this.busy_pfm) {
            if (!this.check_pfms(target)) {
                //  this.send_room(guard_msg.random(), target);
            }
        } else {
            // this.send_room(guard_msg.random(), target);
            this.attack_handler = this.call_out(this.auto_attack, this.is_busy);
            return;
        }
    } else {
        if (!this.auto_pfm || !this.check_pfms(target)) {
            if (target.fight_type) {
                //如果没有自动PFM 就普通攻击 
                sh = this.do_attack({
                    target: target,
                    gj: this.gj,
                    mz: this.mz
                });
            }
        }
    }
    if (!sh || this.end_attack(target, sh)) {
        this.attack_handler = this.call_out(this.auto_attack, this.gjsd);
    }
}



CHARACTER.prototype.use_pfm = function (target, pfm, level, sktype) {
    if (!pfm) return false;
    var isrelease = false;
    if (this.query_prop('no_pfm')) {

        this.send_room("<red>$N释放技能" + pfm.name + "，但是没有产生任何效果。</red>\n");

        this.remove_status('bikou');
        isrelease = true;
    } else if (target && target.parry_skill && target.parry_skill.on_parry_pfm) {
        isrelease = target.parry_skill.on_parry_pfm(target, this, pfm, level);
    } else {
        isrelease = pfm.use(this, target, level, sktype) !== false;
    }
    if (isrelease !== false) {
        this.add_mp(-pfm.query_mp(this, level) || 0);

        this.set_temp("used_pfm", pfm.id, 20000);
        return true;
    }
    return false;
}
CHARACTER.prototype.check_pfms = function (target) {
    if (!this.auto_skills) this.init_pfms();
    if (!this.auto_skills) return false;
    this.attack_count = this.attack_count || this.pfm_rate || 3;

    if (this.random(this.attack_count) !== 0) {
        this.attack_count--;
        return false;
    }
    var now = Date.now();
    var canuser = [];
    for (var i = 0; i < this.auto_skills.length; i++) {
        var item = this.auto_skills[i];
        if (item.ban_use) {
            continue;
        }
        if (this.is_busy && !item.pfm.allow_busy) {
            continue;
        }
        if (item.release_time) {
            if (item.release_time > now) {
                continue;
            }
            item.release_time = 0;
        }
        if (item.pfm.query_mp(this, item.level) <= this.mp)
            canuser.push(item);
    }
    if (!canuser.length) return false;

    var skill = canuser.random();
    if (!skill) return false;
    if (this.use_pfm(target, skill.pfm, skill.level, skill.type)) {

        var rtime = skill.pfm.query_releasetime(this, skill.levelvel);

        if (rtime > 0)
            this.release_time = rtime + now;
        else {
            this.release_time = 0;
            rtime = 0;
        }

        skill.release_time = now +
            skill.pfm.query_distime(this, skill.level, skill.is_ref) + rtime;

        return this.release_time > 0 || target.hp <= 0;
    }
    return false;
}
CHARACTER.prototype.init_pfms = function () {
    this.auto_skills = [];
    if (!this.skills) return;
    var bases = ["", "force", "unarmed", "dodge", "parry", "bite", "throwing"];
    var weapon = this.query_weapon_type();
    if (weapon !== WEAPON_TYPE.NONE) bases[0] = weapon;
    if (this.is_player && !this.throwing_name()) {
        bases[6] = "";
    }
    for (var base of bases) {
        if (!base) continue;
        var base_skill = this.skills[base];
        if (!base_skill) continue;

        var sp_skill = SKILL.get(base_skill.enable_skill || base);

        var level = base_skill.enable_skill ?
            this.query_skill(base_skill.enable_skill)
            : this.query_skill(base);
        if (sp_skill && sp_skill.pfm) {
            for (var p in sp_skill.pfm) {
                this.add_auto_pfm(sp_skill.pfm[p], base, level, false);
            }
        }
        if (base_skill.enable_skill) {
            var ref_pfm = this.query_ref_skill(this.skills[base_skill.enable_skill]);
            if (ref_pfm) {
                this.add_auto_pfm(ref_pfm, base, level / 2, true);
            }
        }
    }
}
CHARACTER.prototype.add_auto_pfm = function (pfmitem, baseSkill, level, is_ref) {
    if (pfmitem.no_auto) return;
    if (pfmitem.enable_skill && pfmitem.enable_skill !== baseSkill) return;
    if (pfmitem.check && pfmitem.check(this, level, baseSkill) === false) return;

    if (pfmitem.allow_busy) this.busy_pfm = true;
    this.auto_skills.push({
        pfm: pfmitem,
        level: level,
        id: baseSkill + "/" + pfmitem.pid,
        type: baseSkill,
        is_ref: is_ref
    });
}
CHARACTER.prototype.set_releasetime = function (rtime) {
    let release_time = Date.now() + rtime;
    if (this.is_player) {
        this.notify('{type:"dispfm",id:"all",rtime:'
            + rtime + ',distime:0}');
    } else {
        if (!this.auto_skills) this.init_pfms();
    }
    this.release_time = release_time;
    if (!this.auto_skills) return;
    for (let askill of this.auto_skills) {
        if (!askill.release_time || askill.release_time < release_time) {
            askill.release_time = release_time;
        }
    }
}