/**
 * MONSTER 怪物类
 */

import "../util/util.js";
import { CHARACTER } from "./character.js";
import { FAMILIES } from "../skill/family.js";
import { BASE_SKILLS } from "../const.js";
import { CORPSE } from "../item/corpse.js";
import { WORLD } from "../world.js";

export class MONSTER extends CHARACTER {

    /**
     * @param {MONSTER} obj - 要初始化的怪物实例
     */

    // ============ 核心属性 ============

    /** @type {boolean} 是否能说话 */
    can_speek = false;
    /** @type {boolean} 是否自动释放绝招 */
    auto_pfm = true;
    /** @type {string} 怪物名称 */
    name;
    /** @type {number} 怪物等级 */
    level = 0;
    /** @type {string} 怪物描述 */
    desc;

    // ============ 功能属性 ============

    /** @type {string|null} 死亡后重生房间路径 */
    die_room = null;
    /** @type {Array|null} 命令JSON缓存 */
    json = null;
    /** @type {number} 击杀奖励积分 */
    score = 0;

    constructor() {
        super();
    }

    can_speek = false;

    /** 初始化技能为撕咬/闪避/招架/内功 */
    init_skill() {
        this.attack_skill = this.query_used_skill(BASE_SKILLS.BITE);
        this.dodge_skill = this.query_used_skill(BASE_SKILLS.DODGE);
        this.parry_skill = this.query_used_skill(BASE_SKILLS.PARRY);
        this.force_skill = this.query_used_skill(BASE_SKILLS.FORCE);
        this.noweapon_skill = this.attack_skill;
    }

    /**
     * 查询描述(JSON)
     * @param {USER} me - 观察者
     * @returns {string}
     */
    query_desc(me) {
        return this.query_commands(me);
    }

    /**
     * 查询操作命令
     * @param {USER} player - 观察者
     * @returns {string} JSON字符串
     */
    query_commands(player) {

        if (this.json) return this.json;
        const json = {};
        json.type = "item";
        json.desc = this.name + "\n" + this.desc;
        json.id = this.id;
        json.commands = [];
        json.commands.push({
            cmd: "kill " + this.id,
            name: "击杀"
        });
        if (this.actions) {
            for (let cmd in this.actions) {
                if (!this.actions[cmd].name) continue;
                json.commands.push({
                    cmd: cmd + " " + this.id,
                    name: this.actions[cmd].name
                });
            }
        }
        this.json = JSON.stringify(json)
        return this.json;
    }

    /**
     * 第三人称代称
     * @returns {string}
     */
    call3() {
        return "它";
    }

    /**
     * 销毁怪物
     * @param {string} [msg]
     */
    destroy(msg) {
        if (this.environment) {
            this.environment.item_changed(this, false, msg);
        }
    }

    /**
     * 怪物死亡
     * @param {CHARACTER} killer - 击杀者
     * @returns {boolean|undefined}
     */
    die(killer) {

        if (!this.environment) return;
        if (this.on_die && this.on_die(killer) === false) {
            this.hp = 1;
            return false;
        }
        this.hp = 0;
        this.clear_status();
        this.send_message(this.name + "惨嚎一声，死了！");
        const corpse = new CORPSE();
        const isinfb = this.environment.is_fb();
        corpse.init(this, isinfb);
        this.die_room = this.environment;
        this.environment.item_changed(corpse, true);
        this.environment.item_changed(this, false);
        if (isinfb && this.score && killer) {
            killer.add_fbscore(this.score);
        }
        this.on_died && this.on_died(killer, corpse);
        WORLD.auto_get(killer, corpse, this);
        if (killer && killer.attack_skill && killer.attack_skill.on_enemy_die) {
            killer.attack_skill.on_enemy_die(killer, this);
        }
    }

    /**
     * 随机查询攻击部位
     * @returns {{name: string, hert: number, crit: number}}
     */
    query_part() {
        return MONSTER_PARTS.random();
    }

    /**
     * 怪物心跳
     * @param {number} dt
     */
    heart_beat(dt) {
        if (!this.fight_type && this.hp > 0) {
            if (this.hp < this.max_hp) {
                this.add_hp(parseInt(this.max_hp / 2));
            }
            if (this.mp < this.max_mp) {
                this.add_mp(parseInt(this.max_mp / 2));
            }
            if (this.chat_msg) {
                const r = this.random(10);
                if (r > 5)
                    this.send_message(this.chat_msg.random());
            }


        }

    }
}

/**
 * 怪物攻击部位定义
 * @type {Array<{name: string, hert: number, crit: number}>}
 */
const MONSTER_PARTS = [
    { name: "左爪", hert: 0.8, crit: 0 },
    { name: "右爪", hert: 0.8, crit: 0 },
    { name: "后腿", hert: 0.85, crit: 0 },
    { name: "小腹", hert: 0.91, crit: 3 },
    { name: "胸前", hert: 0.95, crit: 4 },
    { name: "背部", hert: 0.97, crit: 4 },
    { name: "头部", hert: 1.2, crit: 10 },
    { name: "颈部", hert: 1.1, crit: 5 },
    { name: "前肢", hert: 0.85, crit: 1 },
    { name: "腰间", hert: 0.99, crit: 5 },
];

globalThis.MONSTER = MONSTER;
