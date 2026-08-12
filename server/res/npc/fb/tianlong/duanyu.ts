import { NPC } from '../../../../core/char/npc.js';

export default class extends NPC {
    name = '段誉';
    title = '<hig>大理世子</hig>';
    desc = '段誉坐在蒲团旁，神情焦急，周身穴道似已受制。';
    hp = 100000;
    max_hp = 100000;
    mp = 60000;
    max_mp = 60000;
    no_fight = true;

    constructor() {
        super();
        this.add_action('tianlong_capture', '抓住段誉', function (this: NPC, me) {
            const room = this.environment;
            if (!room) return;
            if (room.fb_query_temp('tianlong_captured', me, false))
                return me.notify('段誉已经被你制住。');
            room.fb_set_temp('tianlong_captured', true, me);
            me.notify('你趁枯荣大师分神之际点住段誉穴道，将他带在身边。');
            if (room.is_here('fb/tianlong/kurong')) return;
            if (room.fb_query_temp('tianlong_reinforcements', me, false)) return;
            room.fb_set_temp('tianlong_reinforcements', true, me);
            const hard = room.fb_query_temp('diff', me, 0) === 1;
            const paths = hard
                ? [
                      'fb/tianlong/benguo',
                      'fb/tianlong/benyin',
                      'fb/tianlong/benkong',
                      'fb/tianlong/benguan',
                      'fb/tianlong/bencan',
                      'fb/tianlong/benchen',
                  ]
                : ['fb/tianlong/benguo', 'fb/tianlong/benyin', 'fb/tianlong/benkong'];
            const scores = hard
                ? [12, 12, 11, 12, 12, 11]
                : [14, 13, 13];
            paths.forEach((path, index) => {
                const npc = NPC.CLONE(path);
                npc.score = scores[index];
                room.item_changed(npc, true);
                npc.do_kill(me);
            });
            me.notify(`${paths.length}位高僧见枯荣大师已败，齐声诵佛，各出一脉剑气向你攻来。`);
        });
    }

    on_kill() {
        return false;
    }
}
