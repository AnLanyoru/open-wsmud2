import { NPC } from '../../../../core/char/npc.js';

export default class extends NPC {
    name = '靳冰云';
    desc = '靳冰云静立亭中，神情清冷，手中收着一封与浪翻云有关的遗书。';
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
        this.add_action('cihang_seek_lang', '我来寻浪翻云', function (this: NPC, me) {
            const room = this.environment;
            if (!room || !room.fb_query_temp('cihang_met_lang', me, false)) return me.notify('靳冰云没有将浪翻云之事托付给你。');
            room.fb_set_temp('cihang_sought_lang', true, me);
            me.notify('你说明自己是来寻浪翻云的，靳冰云问你是否可以代劳送信。');
        });
        this.add_action('cihang_help_letter', '可以代劳', function (this: NPC, me) {
            const room = this.environment;
            if (!room || !room.fb_query_temp('cihang_sought_lang', me, false)) return me.notify('你还没有按流程说明来意。');
            room.fb_set_temp('cihang_testament', true, me);
            if (!room.fb_query_temp('cihang_testament_score', me, false)) {
                room.fb_set_temp('cihang_testament_score', true, me);
                me.add_fbscore(10, 100);
            }
            me.notify('靳冰云将遗书交给你，请你带回去交给浪翻云。');
        });
    }
}
