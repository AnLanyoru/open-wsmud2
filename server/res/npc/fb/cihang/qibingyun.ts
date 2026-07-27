import { NPC } from '../../../../core/char/npc.js';

export default class extends NPC {
    name = '靳冰云';
    desc = '靳冰云静立书架之前，手中檀木匣封着一封遗书，眉宇间带着淡淡忧色。';
    title = '<hiw>慈航静斋传人</hiw>';
    gender = 2;
    age = 26;
    hp = 180000;
    max_hp = 180000;
    mp = 90000;
    max_mp = 90000;
    no_fight = true;

    constructor() {
        super();
        this.skill_map(['force', 1200], ['dodge', 1200], ['parry', 1200], ['sword', 1250]);
        this.add_action('cihang_testament', '代取遗书', function (this: NPC, me) {
            const room = this.environment;
            if (!room) return;
            if (!room.fb_query_temp('cihang_challenged', me, false))
                return me.notify('祁冰云摇头道：此物只能托付给浪大侠认可之人。');
            if (room.fb_query_temp('cihang_testament', me, false))
                return me.notify('祁冰云说道：遗书已交给你，请带去见浪大侠。');
            room.fb_set_temp('cihang_testament', true, me);
            me.add_fbscore(10);
            me.notify('祁冰云将檀木匣郑重交给你，并告知拦江岛就在赏雨亭外的云海尽头。');
        });
    }
}
