import { NPC } from '../../../../core/char/npc.js';

export default class extends NPC {
    name = '浪翻云';
    desc = '浪翻云负剑凭栏，目光如江海般深远，覆雨剑意若有若无地笼罩四周。';
    title = '<hiy>覆雨剑</hiy>';
    gender = 1;
    age = 45;
    hp = 720000;
    max_hp = 720000;
    mp = 260000;
    max_mp = 260000;
    no_fight = true;

    constructor() {
        super();
        this.skill_map(['force', 1750], ['dodge', 1750], ['parry', 1750], ['sword', 1850]);
        this.add_action('cihang_challenge_lang', '我来挑战你', function (this: NPC, me) {
            const room = this.environment;
            if (!room) return;
            const route = room.fb_query_temp('cihang_route', me, '');
            if (!['langzi', 'jianmo'].includes(route)) return me.notify('你所选路线并非以挑战浪翻云开始。');
            room.fb_set_temp('cihang_met_lang', true, me);
            me.notify('你选择“我来挑战你”。浪翻云暂不出剑，只让你先去右路寻找靳冰云。');
        });
        this.add_action('cihang_watch', '我来观战，寻求突破的机缘', function (this: NPC, me) {
            const room = this.environment;
            if (!room) return;
            const route = room.fb_query_temp('cihang_route', me, '');
            if (!['guoshi', 'moshi'].includes(route)) return me.notify('你所选路线并非观战求突破。');
            room.fb_set_temp('cihang_met_lang', true, me);
            me.notify('你选择观战并寻求突破机缘，浪翻云让你先去右路寻找靳冰云。');
        });
        this.add_action('cihang_give_letter', '交出遗书', function (this: NPC, me) {
            const room = this.environment;
            if (!room || !room.fb_query_temp('cihang_testament', me, false)) return me.notify('你身上没有靳冰云交托的遗书。');
            room.fb_set_temp('cihang_letter_given', true, me);
            me.notify('你将遗书交给浪翻云。他看罢收信，允许你按所选路线赐教或观战。');
        });
        this.add_action('cihang_duel', '请浪翻云赐教', function (this: NPC, me) {
            const room = this.environment;
            if (!room || !room.fb_query_temp('cihang_letter_given', me, false)) return me.notify('须先完成靳冰云遗书流程。');
            if (!room.fb_query_temp('cihang_lang_score', me, false)) {
                room.fb_set_temp('cihang_lang_score', true, me);
                me.add_fbscore(20, 100);
            }
            room.fb_set_temp('cihang_lang_passed', true, me);
            me.notify('你与浪翻云比试至残血便收手，取得前往拦江岛面对庞斑的资格。');
        });
    }
}
