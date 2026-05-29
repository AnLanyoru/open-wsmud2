/**
 * FAMILY 门派基类
 */
import { BASE } from "../base.js";
import { WORLD } from "../world.js";
import { UTIL } from "../util/util.js";
import { CHARACTER } from "../char/character.js";
import { NPC } from "../char/npc.js";
import { ROOM } from "../room/room.js";
import { EVENTS } from "../task/events.js";
import { COMMAND } from "../command.js";

/** @type {Object<string, FAMILY>} 所有门派注册表 */
export const FAMILIES = {};

export class FAMILY extends BASE {

    // ============ 核心属性 ============

    /** @type {string[]} 门派称谓列表 */
    titles = [];
    /** @type {NPC[]} 门派NPC列表 */
    npcs = [];
    /** @type {string|null} 敌对门派 */
    battle_family = null;
    /** @type {number} 门派战积分 */
    battle_score = 0;
    /** @type {number} 门派战奖励 */
    battle_gift = 0;
    /** @type {boolean} 是否可门派战 */
    can_battle = false;

    constructor() {
        super();
    }

    /**
     * 设置门派称谓
     * @param {...string} arguments - 称谓列表
     */
    set_titles() {
        for (let i = 0; i < arguments.length; i++) {
            this.titles.push(arguments[i]);
        }
    }

    /**
     * 创建回调 - 注册到FAMILIES
     * @param {string} path
     */
    create(path) {
        FAMILIES[this.id] = this;

    }

    /**
     * 更新回调
     * @param {string} path
     */
    update(path) {
        FAMILIES[this.id] = this;
    }

    /**
     * 查询指定等级的称谓
     * @param {number} level
     * @returns {string}
     */
    query_title(level) {
        return this.titles[level];
    }


    /** @type {function} 临时数据查询(复用CHARACTER) */
    query_temp = CHARACTER.prototype.query_temp;
    /** @type {function} */
    set_temp = CHARACTER.prototype.set_temp;
    /** @type {function} */
    remove_temp = CHARACTER.prototype.remove_temp;
    /** @type {function} */
    add_temp = CHARACTER.prototype.add_temp;

    /**
     * 向门派所有在线成员发送消息
     * @param {string} str
     */
    send(str) {
        for (let i = 0; i < WORLD.USERS.length; i++) {
            if (WORLD.USERS[i].family == this) {
                WORLD.USERS[i].send(str);
            }
        }
    }

    /**
     * 是否与指定门派交战
     * @param {FAMILY} fam
     * @returns {boolean}
     */
    is_battle(fam) {
        return this.battle_family == fam.id;
    }

    /**
     * 增加门派积分
     * @param {CHARACTER} me
     * @param {number} sc
     */
    add_score(me, sc) {
        this.battle_score += sc;
    }



    /**
     * 向门派频道发送消息
     * @param {string} str
     */
    static addSendFamToCharacter() {
        CHARACTER.prototype.send_fam = function (str) {
            this.family.send(str);
        };
    }

    /**
     * 创建门派随机名字
     * @returns {string}
     */
    create_name() {
        return UTIL.random_name(this.gender);
    }

    /**
     * 随机查询指定品级的技能
     * @param {number} grade - 品级
     * @returns {SKILL}
     */
    query_skill(grade) {
        if (!this.skill_levels) {
            this.skill_levels = [];
            for (let i = 0; i < this.skills.length; i++) {
                if (!this.skill_levels[this.skills[i].grade]) {
                    this.skill_levels[this.skills[i].grade] = [];
                }
                this.skill_levels[this.skills[i].grade].push(this.skills[i]);
            }
        }
        if (grade >= this.skill_levels.length) grade = this.skill_levels.length - 1;
        return this.skill_levels[grade].random();
    }

    /**
     * 查询指定品级的所有技能
     * @param {number} grade
     * @returns {SKILL[]}
     */
    query_skills(grade) {
        if (!this.skill_levels) {
            this.skill_levels = [];
            for (let i = 0; i < this.skills.length; i++) {
                if (!this.skill_levels[this.skills[i].grade]) {
                    this.skill_levels[this.skills[i].grade] = [];
                }
                this.skill_levels[this.skills[i].grade].push(this.skills[i]);
            }
        }
        if (grade >= this.skill_levels.length) grade = this.skill_levels.length - 1;
        return this.skill_levels[grade];
    }

    /**
     * 增加门派贡献
     * @param {CHARACTER} me
     * @param {number} count
     */
    add_gongji(me, count) {
        if (!count) return;
        me.add_temp("gongji", count);
        if (count < 0) return;
        if (!this.tops) this.tops = {};
        const old = this.tops[me.id];
        if (!old) this.tops[me.id] = { name: me.name, score: count };
        else {
            old.score += count;
        }
    }

    // ============ 门派方法(由extends合并) ============

    /** 初始化门派NPC */
    init() {
        if (!this.def_npcs) return;
        for (let item of this.def_npcs) {
            let rm = ROOM.Get(item[1]);
            if (!rm) throw new Error('房间' + item[1] + "不存在");
            let npc = NPC.CLONE(item[0]);
            if (!npc) throw new Error('npc ' + item[0] + "不存在");
            rm.items.push(npc);
            rm.max_item_count = 100;
            npc.environment = rm;
            if (npc.is(this.boss_path) && !this.boss) {
                this.boss = npc;
            }
            npc.on_died = this.on_npc_die;
            npc.relive = this.on_famnpc_relive;
        }
    }

    /** @param {string} path */
    update_npc(path) {
        for (let item of this.def_npcs) {
            let spath = item[0];
            if (spath.startsWith(path)) {
                let rm = ROOM.Get(item[1]);
                if (!rm) continue;
                let npc = rm.find_obj_bypath(spath);
                npc.destroy();
                npc = NPC.CREATE(spath, rm);
                if (npc.is(this.boss_path)) {
                    this.boss = npc;
                }
                npc.on_died = this.on_npc_die;
                npc.relive = this.on_famnpc_relive;
            }
        }
    }

    /** 门派NPC复活回调 */
    on_famnpc_relive() {
        if (!this.die_room) return;
        this.die_room.item_changed(this, true);
        this.die_room = null;

        if (this.equipment && this.items[0] && !this.equipment[0]) {
            this.equip(this.items[0]);
        }
    }

    /** 门派NPC死亡回调(这里的this是被击杀的NPC) */
    on_npc_die(me) {
        var fam = FAMILIES[this.family.id];
        if (!me) return;
        var fam2 = FAMILIES[me.family.id];
        if (fam == fam2) {
            me.notify("<cyn>你残害同门，门派功绩减少。</cyn>");
            me.add_temp("gongji", -1);
            return;
        }
        if (!fam || !fam2 || fam == FAMILIES.NONE || fam2 == FAMILIES.NONE) return;

        me.add_temp("killer_" + fam.id, 1, 600000);
        me.notify("<red>你击杀了" + fam.name + "的弟子，对方门派在10分钟内可以对你发出追杀令。</red>");
        if (fam.battle_family || fam2.battle_family) {
            return;
        }
        fam.check_battle(this, me);
    }

    /** @param {NPC} npc @param {CHARACTER} killer @param {FAMILY} [target] */
    check_battle(npc, killer, target) {
        var to_fam = killer ? killer.family : target;
        if (!to_fam || !to_fam.can_battle || !this.can_battle) return;

        if (this.battle_family || to_fam.battle_family) return;
        if (this.query_temp("battle") ||
            to_fam.query_temp("battle")
            || !this.boss || !to_fam.boss) return;
        this.battle_family = to_fam.id;
        to_fam.battle_family = this.id;
        if (killer) {
            if (npc !== this.boss) {
                this.on_kill(npc, killer);
            } else if (this.first_npc) {
                this.first_npc
                    .do_command("chat",
                        killer.family.name + "欺人太甚，门下弟子" + killer.name + "击杀我派" +
                        npc.name + "，" + this.name + "众弟子听令，对" + killer.family.name + "弟子格杀勿论！");
            }
            to_fam.on_battle(this);
        }

        this.begin_attack(to_fam);
        to_fam.begin_attack(this);
        npc.send_fam("<hiy>\n你的门派和" + to_fam.name + "的战斗开始了，请回门派防守或者进攻对方门派。\n战斗时间30分钟，结束条件是对方或己方掌门被击杀。</hiy>");
        to_fam.send("<hiy>\n你的门派和" + this.name + "的战斗开始了，请回门派防守或者进攻对方门派。\n战斗时间30分钟，结束条件是对方或己方掌门被击杀。</hiy>");
    }

    /** @param {FAMILY} fam */
    begin_attack(fam) {
        this.battle_score = 0;
        this.set_temp("battle", 1, 3600000);
        this.call_out(this.battle_over, 30 * 60000, "timeout");

        this.area.rooms[0].create_copy(this.id, 0);

        this.area.notify_update();

        this.create_guards();
        this.create_npcs();

        EVENTS.add(this.create_event());
    }

    /** @returns {Object} */
    create_event() {
        let target_fam = FAMILIES[this.battle_family];
        return {
            id: this.id + "_bat",
            name: "门派战争",
            desc: "你的门派正在和" + target_fam.name + "发生战争，击杀对方弟子会获得丰厚奖励。",
            time: Date.now() + 30 * 60000,
            grade: 2,
            command: "进入战场",
            check: (me) => me.family === this,
            on_command: function (me) {
                me.do_command('goto', 'fam3');
            }
        }
    }

    /** @param {ROOM} rm @returns {ROOM} */
    get_room(rm) {
        return rm.query_copy(this.id);
    }

    /** 创建门派守卫NPC */
    create_guards() {
        if (!this.boss_guard) return;

        var boss_room = this.get_room(ROOM.Get(this.boss_guard[0]));
        var npc = NPC.CLONE("pub/menpai");
        npc.init_from(this, 5);
        npc.name = this.boss.name;
        npc.desc = this.boss.desc;
        npc.title = "<ora>" + this.boss.title + "</ora>";

        npc.age = this.boss.age;
        npc.gender = this.boss.gender;
        this.npcs.push(npc);
        boss_room.item_changed(npc, true);

        this.battle_boss = npc;
        for (var i = 0; i < this.boss_guard.length; i++) {
            for (var j = 0; j < 2; j++) {
                npc = NPC.CLONE("pub/menpai");
                npc.init_from(this, i == 0 ? 4 : 3);
                var rm = this.get_room(ROOM.Get(this.boss_guard[i]));

                this.npcs.push(npc);
                rm.item_changed(npc, true);
            }
        }
    }

    /** @param {NPC} npc */
    remove_npcs(npc) {
        this.npcs.remove(npc);
        if (this.battle_boss) {
            this.battle_boss.remove_status("boss");
        }
    }

    /** @param {number} level @returns {NPC} */
    create_npc(level) {
        var npc = NPC.CLONE("pub/menpai");
        npc.init_from(this, level);
        return npc;
    }

    /** 持续创建门派NPC */
    create_npcs() {
        if (this.npcs.length < 27) {
            let count = 27 - this.npcs.length;
            for (let i = 0; i < count; i++) {
                let lv = i > 15 ? 2 : (i < 8 ? 0 : 1);
                let rm = this.get_room(this.area.rooms.random());
                let npc = this.create_npc(lv);
                this.npcs.push(npc);
                rm.item_changed(npc, true);
            }
            if (this.battle_boss) {
                this.battle_boss.add_status({
                    id: "boss",
                    name: "号令",
                    prop: {
                        hp_per: 30,
                        fy_per: 30,
                        ds_per: 30,
                        mz_per: 30
                    },
                    no_clear: true,
                    override: 1,
                    count: count,
                    max_count: 100,
                    duration: 0,
                    desc: "当你的门派还有NPC存活时，增加你的属性"
                });
            }
        }
        this.create_handler = this.call_out(this.create_npcs, 200000);
    }

    /** @param {string} suc_type */
    battle_over(suc_type) {
        if (!this.battle_family) return;
        var fam = FAMILIES[this.battle_family];
        if (!fam) return;
        this.battle_family = null;
        if (this.create_handler) clearTimeout(this.create_handler);
        for (var i = 0; i < this.npcs.length; i++) {
            if (this.npcs[i].hp > 0) {
                this.npcs[i].send_room("$N急匆匆的走掉了。");
                this.npcs[i].destroy();
            }
        }
        this.npcs.length = 0;
        if (suc_type == "suc") {
            COMMAND.DO("sys", "" + this.name + "和" + fam.name + "的战斗结束了，" + this.name + "获得了最终胜利，接下来的一小时" + this.name + "所有弟子练功效率提高50%。");

            this.add_battle_status(50);
            EVENTS.add(this.finish_event(50, fam));
        } else if (suc_type == "die") {
            this.send("<hir>由于你的门派掌门被击杀，和" + fam.name + "的战斗失败了。</hir>");
        } else if (suc_type == "fail") {
            this.send("<hir>由于你的门派掌门被击杀，和" + fam.name + "的战斗失败了。</hir>");
        } else {
            if (this.battle_score > fam.battle_score) {
                this.send("<hiy>和" + fam.name + "的战斗结束了，你的门派占得优势，接下来的一小时" + this.name + "所有弟子练功效率提高20%。</hiy>");
                this.add_battle_status(20);
                EVENTS.add(this.finish_event(20, fam));
            } else {
                this.send("<hiy>和" + fam.name + "的战斗结束了，你的门派没有取得优势。</hiy>");
                EVENTS.add(this.finish_event(0, fam));
            }
        }
        if (FAMILIES.SHASHOU.query_temp('ss_target') === this.id) {
            let sc = 0;
            if (suc_type === 'suc') sc = 0;
            else if (suc_type === 'fail') sc = 50;
            else sc = this.battle_score > fam.battle_score ? 0 : 20;
            EVENTS.remove(FAMILIES.SHASHOU.id + "_bat");
            EVENTS.add(FAMILIES.SHASHOU.finish_event(sc, this));
            FAMILIES.SHASHOU.remove_temp('ss_target');
            if (sc > 0) {
                FAMILIES.SHASHOU.add_battle_status(sc);
                FAMILIES.SHASHOU.send("<hiy>和"
                    + this.name + "的战斗结束了，你的门派占得优势，接下来的一小时所有弟子练功效率提高" + sc + "%。</hiy>");
            } else {
                FAMILIES.SHASHOU.send("<hiy>和"
                    + this.name + "的战斗结束了，你的门派没有取得优势。</hiy>");
            }
        }
        if (this.battle_boss)
            this.battle_boss.destroy();
        this.battle_boss = null;
        this.area.notify_update();
        this.call_out(this.clear_room, 300000);
        EVENTS.remove(this.id + "_bat");
    }

    /** 清理门派战场副本房间 */
    clear_room() {
        const rm = this.area.rooms[0];
        rm.clear_by_area(rm.parent, this.id);
    }

    /** @param {number} suc @param {FAMILY} target_fam @returns {Object} */
    finish_event(suc, target_fam) {
        let msg = suc > 0 ? "你的门派占得优势，所有弟子获得鼓舞，练功效率+" +
            suc + "%。" : "你的门派没有取得优势。";
        return {
            id: this.id + "_settle",
            name: "门派战争",
            desc: "你的门派和" + target_fam.name + "战斗结束了，" + msg,
            time: this.temp["battle"].e,
            grade: 2,
            command: "领取战利品",
            check: (me) => me.family === this,
            on_command: (me) => {
                this.battle_settle(me)
            }
        }
    }

    /** @param {number} t */
    add_battle_status(t) {
        this.battle_gift = t;
        this.add_temp("lianxi_per", t, 3600000);
        this.add_temp("study_per", t, 3600000);
        this.add_temp("dazuo_per", t, 3600000);
    }

    /** @param {USER} me */
    on_login(me) {
        if (this.first_npc && me.id == this.first_npc.userid) {
            if (!this.is_init_first)
                this.init_dadizi(this.first_npc, me);
            this.send('{type:"msg",ch:"fam",content:"' + this.first_npc.title + me.name + '上线了。",uid:0,name:"",fam:"' + this.name + '"}');
        }
    }

    /** @param {string} id @param {string} name */
    set_dadizi(id, name) {
        this.tops = {};

        if (this.boss)
            this.boss.do_command("fam", '本门弟子' + name + '表现突出，提升为' + this.top_name + '。');

        this.is_init_first = false;
        WORLD.DATA.set_temp(this.id + "_top", id);
        WORLD.DATA.set_temp(this.id + "_top_name", name);
        if (this.first_npc) {
            if (this.first_npc.environment.is_shadow) {
                var rm = ROOM.Get(this.first_npc.environment.path);
                var npc = rm.find_obj_bypath('pub/dadizi#' + this.id);
                if (npc) {
                    this.first_npc = npc;
                } else {
                    this.first_npc = null;
                    return;
                }
            }
            this.init_dadizi(this.first_npc, WORLD.getUser(id));
            this.area.notify_update();
        }
    }

    /** @param {NPC} npc @param {USER} [me] */
    init_dadizi(npc, me) {
        this.first_npc = npc;
        npc.name = WORLD.DATA.query_temp(this.id + "_top_name") || this.top_name;
        npc.title = this.top_name;
        npc.userid = WORLD.DATA.query_temp(this.id + "_top");
        if (!me) return;
        npc.level = me.level;
        var copy_prop = ["str", "con", "dex", "int", "gender", "max_mp", "exp", "pot", "kar", "per"
            , "name", "skills", "hp", "max_hp", "mp"];
        for (var i = 0; i < copy_prop.length; i++) {
            npc[copy_prop[i]] = me[copy_prop[i]];
        }
        npc.equipment = [];
        if (me.equipment) {
            var eqs = me.equipment;
            for (var i = 0; i < eqs.length; i++) {
                if (!eqs[i]) continue;
                var obj = eqs[i].clone(me);
                npc.equipment[obj.eq_type] = obj;
            }
        }
        npc.max_hp = npc.hp = npc.max_hp * 2;
        npc.age = me.query_age();
        npc.clear_prop();
        npc.init();
        npc.recount();
        npc.auto_skills = null;
        npc.environment && npc.environment.item_changed(npc, true);
        this.is_init_first = true;
        this.first_npc_exp = npc.exp;
    }

    /** @param {CHARACTER} me @param {string} msg */
    send_channel(me, msg) {
        var msg = '{type:"msg",ch:"fam",content:"' + msg + '",fam:"' + this.name + '", name:"' + (me ? me.name : "门派管理") + '" }';
        this.send(msg);
    }

    /** @param {USER} me @returns {string} */
    query_task_title(me) {
        let level = me.query_temp('sm_level', 0);
        return me.family.name + TITLES[level];
    }

    /** @param {number} level @returns {string} */
    query_job_title(level) {
        return TITLES[level];
    }

    // ============ 静态方法(由extends合并) ============

    /** @param {string} path */
    static UPDATE_NPC(path) {
        for (let key in FAMILIES) {
            let fam = FAMILIES[key];
            if (!fam.def_npcs) continue;
            fam.update_npc(path);
        }
    }

    /** @returns {string} */
    static SAVE() {
        var obj = {};
        for (var key in FAMILIES) {
            var fam = FAMILIES[key];
            if (fam.tops) {
                obj[key + "_tops"] = fam.tops;
            }
            obj.temp = fam.temp;
        }
        return JSON.stringify(obj);
    }

    /** @param {string} str */
    static LOAD(str) {
        var obj = JSON.toObject(str);
        if (!obj) return;
        for (var key in FAMILIES) {
            var fam = FAMILIES[key];
            if (obj[key + "_tops"]) {
                fam.tops = obj[key + "_tops"];
            }
            fam.temp = obj.temp;
        }
    }
}

const TITLES = ['入门弟子', '弟子', '执事', '护法', '长老', '供奉'];


