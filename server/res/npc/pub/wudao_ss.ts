import { NPC } from '../../../core/char/npc.js';
import type { CHARACTER, DoAttackPar } from '../../../core/char/character.js';
import type { CharacterStatus } from '../../../core/char/character.js';
import type { USER } from '../../../core/char/user.js';
import type { ROOM } from '../../../core/room/room.js';
import { WORLD } from '../../../core/world.js';
import { OBJ } from '../../../core/item/obj.js';

const HP = 100_000_000;
const TRIAL_STATUS = 'wd_ss';
const OWNER = 'wd_ss_owner';
const TYPE = 'wd_ss_type';
const ROUND = 'wd_ss_round';
const DEFENSE_OK = 'wd_ss_defense_ok';
const HIT_OK = 'wd_ss_hit_ok';
const DAMAGE_OK = 'wd_ss_damage_ok';
const DONE = 'wd_ss_done';

const REWARDS = ['ds', 'mz', 'fy', 'gj'] as const;
const NAMES = ['青龙', '白虎', '玄武', '朱雀'];

function ownerOf(room: ROOM): USER | undefined {
    const id = room.query_temp<string>(OWNER, '');
    if (!id) return;
    const item = room.find_obj_byid(room.items, id);
    return item?.check_player() ? (item as USER) : WORLD.getUser(id);
}

function adjustProp(npc: WudaoTrialBeast, key: string, target: number): void {
    npc.add_prop(key, target - npc.query_prop(key));
}

function calibratePanel(npc: WudaoTrialBeast, target: number): void {
    const percentage: Record<string, string> = {
        gj: 'gj_per',
        mz: 'mz_per',
        zj: 'zj_per',
        ds: 'ds_per',
        fy: 'fy_per',
    };
    for (const key of Object.keys(percentage)) {
        for (let i = 0; i < 3 && Number((npc as any)[key]) !== target; i++) {
            const multiplier = Math.max((100 + npc.query_prop(percentage[key])) / 100, 0.01);
            npc.add_prop(key, (target - Number((npc as any)[key])) / multiplier);
            npc.recount();
        }
    }
}

/** 四方试炼神兽。type: 0 青龙、1 白虎、2 玄武、3 朱雀。 */
export default class WudaoTrialBeast extends NPC {
    name = '神兽';
    desc = '武道塔顶部四方试炼的守护神兽。';
    gender = 1;
    age = 1000;
    no_refresh = true;
    auto_pfm = false;
    trial_type = 0;
    trial_owner = '';

    constructor() {
        super();
        this.skill_map(
            ['force', 5000],
            ['unarmed', 5000],
            ['dodge', 5000],
            ['parry', 5000],
        );
    }

    init_from(player: USER, type: number): void {
        this.trial_type = type;
        this.trial_owner = player.id;
        this.name = NAMES[type] + '神兽';
        this.title = '<hio>' + NAMES[type] + '</hio>';
        this.hp = this.max_hp = HP;
        this.mp = this.max_mp = HP;
        this.recount();
        calibratePanel(this, 100_000);
        this.hp = this.max_hp = HP;
        if (type === 3) adjustProp(this, 'gj', 10_000);
        this.recount();
        this.hp = this.max_hp = HP;
    }

    /** 试炼神兽不进入普通 NPC 死亡流程。 */
    die(_killer?: CHARACTER): false {
        this.hp = this.max_hp = HP;
        this.notify_hp();
        return false;
    }

    add_hp(value: number): number {
        const result = super.add_hp(value);
        if (value < 0 && this.hp <= 0) {
            this.hp = this.max_hp = HP;
            this.notify_hp();
        }
        return result;
    }

    add_status(buff: CharacterStatus, from?: CHARACTER): boolean | undefined {
        if (buff.downside) return false;
        return super.add_status(buff, from);
    }

    resolve_attack_avoidance(target: CHARACTER, _par: DoAttackPar) {
        if (this.trial_type !== 1 || target.id !== this.trial_owner) return;
        const round = Math.max(1, Number(target.query_temp(ROUND, 1)));
        const threshold = Math.ceil((420_000 * round) / 49);
        const dodged = target.ds >= threshold;
        return { is_dodged: dodged, is_parried: !dodged && target.zj >= threshold };
    }

    resolve_defense_avoidance(attacker: CHARACTER, _par: DoAttackPar) {
        if (this.trial_type !== 0 || attacker.id !== this.trial_owner) return;
        const round = Math.max(1, Number(attacker.query_temp(ROUND, 1)));
        const threshold = 10_000 * round;
        if (attacker.mz >= threshold) return { is_dodged: false, is_parried: false };
        return { is_dodged: true, is_parried: false };
    }

    do_attack(par: DoAttackPar): number {
        const damage = super.do_attack(par);
        const target = par.target;
        if (
            this.trial_type === 1 &&
            target?.id === this.trial_owner &&
            (par.is_dodged || par.is_parried)
        ) {
            target.set_temp(DEFENSE_OK, true);
        }
        return damage;
    }

    on_attack_result(attacker: CHARACTER, par: DoAttackPar, damage: number): void {
        if (!attacker.is_player || attacker.id !== this.trial_owner) return;
        if (this.trial_type === 0 && !par.is_dodged && !par.is_parried) {
            attacker.set_temp(HIT_OK, true);
        } else if (this.trial_type === 2 && damage > 0) {
            attacker.set_temp(DAMAGE_OK, true);
        }
    }

    auto_attack(): void {
        // 朱雀的攻击严格由房间心跳驱动六连击。
        if (this.trial_type === 3) return;
        super.auto_attack();
    }

    set_round(round: number): void {
        if (this.trial_type === 2) adjustProp(this, 'diff_sh', 100_000 * round);
        if (this.trial_type === 3) {
            adjustProp(this, 'diff_fy_per2', 2 * round);
            const attack = Math.max(1, Math.floor(Math.floor((50_000_000 * round) / 49) / 6));
            const multiplier = Math.max((100 + this.query_prop('gj_per')) / 100, 0.01);
            this.add_prop('gj', (attack - this.gj) / multiplier);
        }
        this.recount();
    }

    perform_round(player: USER, round: number): void {
        if (this.trial_type !== 3 || this.environment !== player.environment || player.hp <= 0)
            return;
        const total = Math.floor((50_000_000 * round) / 49);
        const each = Math.floor(total / 6);
        for (let i = 0; i < 6 && player.hp > 0; i++) {
            const segment = i === 5 ? total - each * 5 : each;
            this.do_attack({
                target: player,
                gj: segment,
                mz: 0,
                no_weapon: true,
                no_dodge: true,
                no_parry: true,
                no_power: true,
                no_append: true,
            });
        }
        if (player.hp <= 0) player.die(this);
    }
}

export function enter_wudao_trial(room: ROOM, player: USER, type: number): void {
    if (room.query_temp(OWNER)) return;
    const npc = NPC.CLONE('pub/wudao_ss') as WudaoTrialBeast | null;
    if (!npc) return player.notify('试炼神兽尚未准备好，请稍后再试。');
    player.remove_status(TRIAL_STATUS);
    player.remove_temp(ROUND);
    player.remove_temp(TYPE);
    player.remove_temp(DEFENSE_OK);
    player.remove_temp(HIT_OK);
    player.remove_temp(DAMAGE_OK);
    player.set_temp(TYPE, type);
    room.set_temp(OWNER, player.id);
    room.set_temp(DONE, false);
    npc.init_from(player, type);
    room.item_changed(npc, true);
    npc.do_kill(player);
}

function reward_round(player: USER, type: number, round: number): void {
    const key = 'wd_ss_best_' + type;
    const best = Number(player.query_temp(key, 0));
    if (round <= best) return;
    const path = 'st/p#' + REWARDS[type];
    const item = OBJ.CREATE(path);
    if (!item) return;
    if (!player.add_obj(item)) return;
    // 不设置过期时间，最高息数随角色永久保存，同一息数终身只发一次。
    player.set_temp(key, round);
    player.notify('<hig>你首次到达第' + round + '息，获得' + item.unit_name(1) + '。</hig>');
}

function set_trial_status(player: USER, round: number): void {
    player.add_status({
        id: TRIAL_STATUS,
        name: round + '息',
        desc: '试炼正在逐息增强，绝招冷却增加' + round + '%，疗伤效果降低' + round + '%。',
        duration: 5000,
        override: 2,
        prop: { distime_per: -round, recover_per: -round },
    });
}

export function finish_wudao_trial(room: ROOM, player?: USER, _failed = false): void {
    if (room.query_temp(DONE, false)) return;
    room.set_temp(DONE, true);
    const round = player ? Number(player.query_temp(ROUND, 0)) : 0;
    // round 表示正在进行的操作窗口；上一息才是已经完整通过的成绩。
    const completed = Math.max(0, round - 1);
    const type = player ? Number(player.query_temp(TYPE, -1)) : -1;
    if (player && type >= 0 && completed > 0) {
        reward_round(player, type, completed);
        const worldBest = Number(WORLD.DATA.query_temp('wd_ss' + type, 0));
        if (completed > worldBest) {
            WORLD.DATA.set_temp('wd_ss' + type, completed);
            WORLD.DATA.set_temp('wd_ss' + type + '_n', player.name);
        }
    }
    if (player) {
        player.remove_status(TRIAL_STATUS);
        for (const key of [TYPE, ROUND, DEFENSE_OK, HIT_OK, DAMAGE_OK]) player.remove_temp(key);
        player.end_fight();
    }
    const npc = room.find_obj_bypath('pub/wudao_ss') as WudaoTrialBeast | undefined;
    if (npc) {
        npc.end_fight();
        npc.destroy();
    }
    room.remove_temp(OWNER);
}

export function wudao_trial_heartbeat(room: ROOM, _dt: number): void {
    const player = ownerOf(room);
    if (!player || player.environment !== room) {
        if (room.query_temp(OWNER)) finish_wudao_trial(room, player);
        return;
    }
    if (player.hp <= 0) return finish_wudao_trial(room, player);
    if (room.query_temp(DONE, false)) return;
    const type = Number(player.query_temp(TYPE, -1));
    if (type < 0) return finish_wudao_trial(room, player);
    const oldRound = Number(player.query_temp(ROUND, 0));
    const required = type === 0 ? HIT_OK : type === 1 ? DEFENSE_OK : type === 2 ? DAMAGE_OK : '';
    if (oldRound > 0 && required && !player.query_temp(required, false)) {
        const npc = room.find_obj_bypath('pub/wudao_ss') as WudaoTrialBeast | undefined;
        finish_wudao_trial(room, player, true);
        if (player.hp > 0) player.die(npc);
        return;
    }
    if (required) player.remove_temp(required);
    const round = oldRound + 1;
    player.set_temp(ROUND, round);
    set_trial_status(player, round);
    reward_round(player, type, round);
    const npc = room.find_obj_bypath('pub/wudao_ss') as WudaoTrialBeast | undefined;
    if (!npc) return finish_wudao_trial(room, player);
    npc.set_round(round);
    if (type === 3) npc.perform_round(player, round);
}

export function cleanup_wudao_trial(room: ROOM, player: USER): void {
    if (room.query_temp(OWNER) === player.id) finish_wudao_trial(room, player);
}
