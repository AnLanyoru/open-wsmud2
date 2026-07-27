import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '卧室';
    desc = '卧室布置简朴，床侧木架放着道袍与长剑，书案上摊开一卷青城剑谱。';
    exits = {
        south: 'fb/qingcheng/huayuan',
    };
}
