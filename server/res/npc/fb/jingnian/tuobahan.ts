import { NPC } from '../../../../core/char/npc.js';

export default class extends NPC {
    name = '跋锋寒';
    desc = '跋锋寒身形挺拔，目光冷峻如刀，守在崖底等待徐子陵返回。';
    title = '<hic>塞外刀客</hic>';
    gender = 1;
    age = 29;
    hp = 420000;
    max_hp = 420000;
    mp = 150000;
    max_mp = 150000;
    no_fight = true;

    constructor() {
        super();
        this.skill_map(['force', 1550], ['dodge', 1580], ['parry', 1550], ['blade', 1600]);
        this.add_action('jingnian_wait_xu', '等徐子陵回来', function (this: NPC, me) {
            const room = this.environment;
            if (!room || room.fb_query_temp('jingnian_route', me, '') !== 'shaoshuai') return me.notify('跋锋寒没有理会你。');
            if (!room.fb_query_temp('jingnian_disguised', me, false)) return me.notify('跋锋寒冷冷看着你，没有把你认作寇仲。');
            room.fb_set_temp('jingnian_hebi', true, me);
            me.notify('跋锋寒等到徐子陵回来后，将和氏璧交给了伪装成寇仲的你。');
        });
    }
}
