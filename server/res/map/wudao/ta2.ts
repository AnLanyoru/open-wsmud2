import { ROOM } from '../../../core/room/room.js';
import { WORLD } from '../../../core/world.js';
import { UTIL } from '../../../core/util/util.js';
import { NPC } from '../../../core/char/npc.js';
import { USER } from '../../../core/char/user.js';
import { COMMAND } from '../../../core/command.js';
import type { CHARACTER } from '../../../core/char/character.js';
import { OBJ } from '../../../core/item/obj.js';
import { wudao_fragment } from './ta.js';

const WUDAO_TITLES: readonly string[] = [
    '武道塔守护者',
    '武道镇守者',
    '武道传承者',
    '武道统领者',
    '武道领主',
    '武道塔主',
];
const WUDAO_TITLE_TYPE = 'wudao_tower';
const ORANGE_GEMS = ['st/st_red#4', 'st/st_blu#4', 'st/st_gre#4', 'st/st_yel#4'];

export default class extends ROOM {
    name = '武道塔';
    desc =
        '这里是武道塔的内部，塔身已经石迹斑驳，但是仍然耸立挺拔。四周都是坚固的石壁，不知道什么原因留下一些横七竖八的刀刻剑痕，你想细看却觉得眼睛被刺得发疼。';
    exits = { up: 'wudao/up', out: 'wudao/ding' };
    max_item_count = 1;
    is_shadow = true;

    on_before_enter(me: CHARACTER) {
        const level = Number(me.query_temp('wd_level', 0)) + 1;
        this.name = level === 100 ? '第一百层' : '上' + UTIL.to_c(level - 100) + '层';
        if (level < 100 || level > 105) return;
        me.clear_combat_prop();
        me.clear_status();
        if (me.is_enable_skill('changshengjue', 'force')) {
            // 百层以上禁用长生诀“不灭”：无时限 temp 标记使其永久视为已经触发。
            me.set_temp('csj_bm', 1);
        }
        const npc = NPC.CLONE('pub/wudao_boss');

        const room = this;
        npc.die = function (this: NPC, killer?: CHARACTER) {
            if (!killer) return;
            killer.notify('<hig>恭喜你战胜了' + this.long_name() + '。</hig>');
            const count = killer.add_temp('wd_level', 1) as number;

            room.on_reward(killer, count);
            const max = WORLD.DATA.query_temp('wudao_max', 0) as number;
            if (count > max) {
                WORLD.DATA.set_temp('wudao_max', count);
                WORLD.DATA.set_temp('wudao_max_user', killer.name);
                COMMAND.DO('rumor', '听说' + killer.name + '战胜了' + this.long_name() + '。');
                if (killer.environment && killer.environment.parent) {
                    killer.environment.parent.notify_update();
                }
            }
            if (killer.environment) {
                killer.environment.item_changed(this, false, '$N离开了。');
            }
        };
        npc.init_from(me, level);

        npc.environment = this;
        this.items.length = 0;
        this.items.push(npc);
        this.refresh();
    }

    on_enter(me: CHARACTER) {
        const room = this;
        me.die = function (this: CHARACTER, killer?: CHARACTER) {
            if (this.on_die && killer && this.on_die(killer) == false) {
                this.hp = 1;
                return false;
            }
            this.hp = this.max_hp;
            this.mp = this.max_mp;
            const rm_npc = this.environment!.find_by_path('pub/wudao_boss');
            rm_npc && rm_npc.destroy();
            this.moveto('wudao/ding');
            this.notify('<hir>你的挑战失败了。</hir>');
        };
        const npc = this.find_by_path('pub/wudao_boss') as NPC | undefined;
        if (npc && !npc.is_player) {
            me.do_kill(npc);
            if ('use_entry_performs' in npc) {
                (npc as NPC & { use_entry_performs: (target: CHARACTER) => void }).use_entry_performs(me);
            }
        }
    }

    on_reward(me: CHARACTER, lv: number) {
        if (lv < 100 || lv > 105) return;
        const potential = (lv - 99) * 1_000_000;
        me.add_exp(undefined, potential);

        const items = [
            { obj: 'st/yuanjing', count: 1 },
            wudao_fragment(6),
            { obj: ORANGE_GEMS, count: 1 },
        ];
        for (const created of OBJ.create_by_odds(items)) {
            const item = me.add_obj(created);
            if (item) me.send('你获得了' + item.unit_name(created.count) + '。');
        }

        const title = '<hio>' + WUDAO_TITLES[lv - 100] + '</hio>';
        me.add_title?.(title, WUDAO_TITLE_TYPE);
        me.notify('你获得了称号【' + title + '】。');
    }

    on_leave(me: CHARACTER, dir: string) {
        const npc = this.find_by_path('pub/wudao_boss');
        if (dir == 'up') {
            if (npc) {
                return me.notify_fail(npc.name + '对你说道：打败我，你就可以上去。');
            }
            if (this.items.length > 1) {
                let npcs: CHARACTER[] = [];
                for (let item of this.items) {
                    if (!item.check_player() && item.check_character()) {
                        npcs.push(item);
                    }
                }
                for (let item of npcs) {
                    if ('do_kill' in item) {
                        item.destroy();
                    }
                }
            }
            if ((me.query_temp('wd_level', 0) as number) >= 105) {
                me.moveto('wudao/ding');
            } else {
                me.moveto('wudao/ta2');
            }

            return false;
        } else {
            if (npc) this.items.remove(npc);
            me.die = USER.prototype.die;
        }
    }
}
