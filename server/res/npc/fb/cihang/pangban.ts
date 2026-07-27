import { NPC } from '../../../../core/char/npc.js';

export default class extends NPC {
    name = '庞斑';
    desc = '庞斑黑袍迎风而立，双眸仿佛能吞噬光线，天魔气场随着呼吸笼罩整座孤岛。';
    title = '<hir>魔师</hir>';
    gender = 1;
    age = 48;
    hp = 950000;
    max_hp = 950000;
    mp = 360000;
    max_mp = 360000;
    pfm_rate = 1;

    constructor() {
        super();
        this.skill_map(['force', 1800], ['dodge', 1750], ['parry', 1800], ['unarmed', 1850]);
    }

    on_enter(me) {
        if (me.is_player && this.environment?.fb_query_temp('cihang_lang_passed', me, false) && !this.fight_type) this.do_kill(me);
    }

    on_die(killer) {
        if (!killer || !this.environment) return;
        const lives = this.environment.fb_query_temp('cihang_pang_lives', killer, 3) - 1;
        this.environment.fb_set_temp('cihang_pang_lives', lives, killer);
        if (lives > 0) {
            this.hp = this.max_hp;
            this.mp = this.max_mp;
            killer.notify(`庞斑以天魔秘法再起，尚余${lives}条命。`);
            return false;
        }
    }

    on_died(killer) {
        if (!killer || !this.die_room) return;
        this.die_room.fb_set_temp('cihang_pangban', true, killer);
        if (!this.die_room.fb_query_temp('cihang_pangban_score', killer, false)) {
            this.die_room.fb_set_temp('cihang_pangban_score', true, killer);
            killer.add_fbscore(50, 100);
        }
        killer.notify('庞斑三条命尽，天魔气场轰然消散。你可回帝塔峰，经桃源小径进入石窟领悟。');
    }
}
