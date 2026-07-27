import { NPC } from '../../../../core/char/npc.js';

export default class extends NPC {
    name = '枯荣大师';
    title = '<hiy>天龙寺高僧</hiy>';
    desc = '枯荣大师半枯半荣，端坐蒲团之上，深厚禅功隐而不发。';
    hp = 190000;
    max_hp = 190000;
    mp = 70000;
    max_mp = 70000;
    score = 30;
    pfm_rate = 1;

    constructor() {
        super();
        this.skill_map(['force', 1200], ['dodge', 1150], ['parry', 1200], ['unarmed', 1220]);
    }

    on_died(killer) {
        if (!killer || !this.die_room) return;
        if (!this.die_room.fb_query_temp('tianlong_captured', killer, false)) {
            killer.notify('枯荣大师倒下，段誉仍留在蒲团之后，你还需将他制住。');
            return;
        }
        if (this.die_room.fb_query_temp('tianlong_reinforcements', killer, false)) return;
        this.die_room.fb_set_temp('tianlong_reinforcements', true, killer);
        const paths = this.die_room.query_temp('tianlong_hard')
            ? ['fb/tianlong/benguo', 'fb/tianlong/benyin', 'fb/tianlong/benkong', 'fb/tianlong/benguan', 'fb/tianlong/bencan', 'fb/tianlong/benchen']
            : ['fb/tianlong/benguo', 'fb/tianlong/benyin', 'fb/tianlong/benkong'];
        const scores = this.die_room.query_temp('tianlong_hard') ? [12, 12, 11, 12, 12, 11] : [14, 13, 13];
        paths.forEach((path, index) => {
            const npc = NPC.CLONE(path);
            npc.score = scores[index];
            this.die_room?.item_changed(npc, true);
            npc.do_kill(killer);
        });
        killer.notify(`${paths.length}位高僧齐声诵佛，各出一脉剑气向你攻来。`);
    }
}
