import { NPC } from '../../../core/char/npc.js';
import type { CHARACTER } from '../../../core/char/character.js';
import type { USER } from '../../../core/char/user.js';

export default class extends NPC {
    name = '武道塔主';
    title = '<hiy>武道塔主</hiy>';
    desc = '他镇守武道塔顶，知晓四方神兽试炼与自制装备词条材料的奥秘。';
    gender = 1;
    age = 80;
    hp = 56_000_000;
    max_hp = 56_000_000;
    mp = 56_000_000;
    max_mp = 56_000_000;
    no_refresh = true;
    no_fight = true;

    constructor() {
        super();
        this.set_ask('四方试炼', function (me: CHARACTER) {
            const record = (type: number) => {
                const round = Number(me.query_temp('wd_ss_best_' + type, 0));
                return round > 0 ? '你当前记录为' + round + '息' : '你当前还未挑战';
            };
            me.notify(
                '<hig>一息为五秒。四方试炼会逐息增强，同时延长你的绝招冷却并削弱疗伤效果。\n' +
                    '白虎考验招架与躲闪，每息至少成功防守一次；' + record(1) + '。\n' +
                    '朱雀考验防御与生存，每息施展破防渐强的六连击；' + record(3) + '。\n' +
                    '青龙考验命中，每息至少命中一次；' + record(0) + '。\n' +
                    '玄武考验单次攻击，每息至少突破一次固定免伤；' + record(2) + '。\n' +
                    '未完成当息条件，或被神兽击杀，试炼都会结束。</hig>',
            );
        });
        this.set_ask('词条兑换', function (this: NPC, me: CHARACTER) {
            if (me.check_player()) me.do_command('wdexchange', this.id);
        });
    }

    on_kill(killer: CHARACTER): false {
        killer.notify('武道塔主负手而立，没有与你动手的意思。');
        return false;
    }

    on_before_fight(me: USER): false {
        me.notify('武道塔主不接受比试。');
        return false;
    }
}
