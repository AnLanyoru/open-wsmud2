import { NPC } from '../../../../core/char/npc.js';

export default class extends NPC {
    name = '黄蓉';
    desc = '一名容色绝丽的少女站在花影之中，眼神灵动，似乎正等人替她办事。';
    gender = 2;
    age = 18;
    hp = 30000;
    max_hp = 30000;
    mp = 10000;
    max_mp = 10000;
    no_fight = true;

    constructor() {
        super();
        this.skill_map(['force', 650], ['dodge', 650], ['parry', 650], ['staff', 650]);
        this.add_action('taohua_huangrong', '交谈', function (this: NPC, me) {
            const room = this.environment;
            if (!room) return;
            if (!room.fb_query_temp('taohua_talked', me, false)) {
                room.fb_set_temp('taohua_talked', true, me);
                me.add_fbscore(20);
                return me.notify('黄蓉请你去找周伯通取回石匣，并指点了通往卧室的道路。');
            }
            if (!room.fb_query_temp('taohua_box', me, false)) {
                return me.notify('黄蓉说道：周伯通还带着爹爹的石匣，你快去找他。');
            }
            if (room.fb_query_temp('taohua_returned', me, false)) {
                return me.notify('黄蓉笑道：石匣已经完璧归赵，多谢你啦。');
            }
            room.fb_set_temp('taohua_returned', true, me);
            me.add_fbscore(40);
            me.notify('你将石匣交给黄蓉，她验看无误，笑着向你道谢。');
        });
    }

    on_kill() {
        return false;
    }
}
