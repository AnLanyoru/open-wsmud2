import { NPC } from '../../../../core/char/npc.js';

export default class extends NPC {
    name = '洪七公';
    desc = '老叫化衣衫褴褛，手持碧竹杖，虽满脸笑意，举手投足却有降龙伏虎之威。';
    title = '<hio>北丐</hio>';
    gender = 1;
    age = 62;
    hp = 310000;
    max_hp = 310000;
    mp = 92000;
    max_mp = 92000;
    score = 20;
    pfm_rate = 1;

    constructor() {
        super();
        this.skill_map(['force', 1280], ['dodge', 1280], ['parry', 1320], ['unarmed', 1320], ['club', 1280], ['xianglongzhang', 1380, ['unarmed', 'parry']], ['dagoubang', 1340, 'club'], ['huntianqigong', 1300, 'force']);
    }
}
