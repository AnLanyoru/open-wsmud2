import { NPC } from '../../../../core/char/npc.js';

export default class extends NPC {
    name = '血刀老祖';
    title = '<hiy>血刀老祖</hiy>';
    desc = '血刀老祖披着赤色袈裟，手中血刀寒芒吞吐，笑声令人胆寒。';
    hp = 260000;
    max_hp = 260000;
    mp = 90000;
    max_mp = 90000;
    score = 70;
    pfm_rate = 1;

    constructor() {
        super();
        this.skill_map(['force', 1300], ['dodge', 1280], ['parry', 1300], ['blade', 1320]);
    }

    on_enter(me) {
        if (me.is_player && !this.fight_type) this.do_kill(me);
    }
}
