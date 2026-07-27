import { NPC } from '../../../../core/char/npc.js';

export default class extends NPC {
    name = '石破天';
    desc = '少年衣着朴素，神情纯真，正对着石壁上的蝌蚪文字苦苦思索。';
    gender = 1;
    age = 20;
    hp = 360000;
    max_hp = 360000;
    mp = 180000;
    max_mp = 180000;
    no_fight = true;

    constructor() {
        super();
        this.skill_map(['force', 1600], ['dodge', 1600], ['parry', 1600], ['unarmed', 1650], ['taixuangong', 1750, ['force', 'unarmed', 'parry']], ['xuanxubu', 1650, 'dodge']);
        this.add_action('xiake_ask', '等候提问', function (this: NPC, me) {
            const room = this.environment;
            if (!room) return;
            const route = room.fb_query_temp('xiake_route', me, '');
            if (route && route !== 'reward') return me.notify('你已选择罚恶一途，只能一路杀到岛主石门。');
            if (!route) room.fb_set_temp('xiake_route', 'reward', me);
            const layer = room.fb_query_temp('xiake_layer', me, 1);
            if (layer > 6) return me.notify('石破天体内真气正汹涌奔腾，你该先与他比试一招。');
            room.fb_set_temp('xiake_asked', layer, me);
            room.fb_set_temp('xiake_studied', 0, me);
            me.notify(layer === 6 ? '石破天指着第六层石壁问你其中诗句的含义。' : `石破天指着第${layer}层石壁问你其中诗句的含义，请你去对应石室领悟后再来回答。`);
        });
        this.add_action('xiake_answer_yes', '回答“是”', function (this: NPC, me) {
            const room = this.environment;
            if (!room) return;
            const layer = room.fb_query_temp('xiake_layer', me, 1);
            if (layer >= 6) return me.notify('第六层石壁艰深莫测，你无法说出哪门基本技能有所进益。');
            if (room.fb_query_temp('xiake_asked', me, 0) !== layer || room.fb_query_temp('xiake_studied', me, 0) !== layer)
                return me.notify('你还没有依照石破天所问的诗句去石室领悟。');
            room.fb_set_temp('xiake_layer', layer + 1, me);
            room.fb_set_temp('xiake_asked', 0, me);
            me.add_fbscore(15, 100);
            me.notify(`你将方才有所进益的基本技能告诉石破天，他恍然大悟，与你一同进入第${layer + 1}层。`);
        });
        this.add_action('xiake_answer_unknown', '回答“不知道”', function (this: NPC, me) {
            const room = this.environment;
            if (!room) return;
            const layer = room.fb_query_temp('xiake_layer', me, 1);
            if (layer !== 6 || room.fb_query_temp('xiake_asked', me, 0) !== 6 || room.fb_query_temp('xiake_studied', me, 0) !== 6)
                return me.notify('石破天尚未问到第六层石壁，你不能贸然作答。');
            room.fb_set_temp('xiake_layer', 7, me);
            room.fb_set_temp('xiake_surging', true, me);
            me.add_fbscore(15, 100);
            me.notify('<hic>你坦言头昏脑胀，什么也没看懂。石破天独自走到石壁前参悟，片刻后内息忽然汹涌澎湃。</hic>');
        });
        this.add_action('xiake_duel', '比试石破天', function (this: NPC, me) {
            const room = this.environment;
            if (!room) return;
            if (!room.fb_query_temp('xiake_surging', me, false)) return me.notify('石破天仍在思索石壁，此时无须比试。');
            if (room.fb_query_temp('xiake_duelled', me, false)) return me.notify('你已用一招试出石破天体内真气的症结。');
            room.fb_set_temp('xiake_duelled', true, me);
            me.notify('你与石破天比试一招，将他打得气息一滞，随即收手。');
        });
        this.add_action('xiake_help', '帮他一把', function (this: NPC, me) {
            const room = this.environment;
            if (!room) return;
            if (!room.fb_query_temp('xiake_duelled', me, false)) return me.notify('石破天气息尚未显出症结，你还不知道该如何相助。');
            if (room.fb_query_temp('xiake_helped', me, false)) return me.notify('石破天体内太玄真气已经归于圆融。');
            room.fb_set_temp('xiake_helped', true, me);
            me.add_fbscore(10, 100);
            me.notify('石破天忽然痛苦万分，你出手替他疏导奔涌真气。片刻后，石壁武学在他体内融会贯通。');
        });
    }
}
