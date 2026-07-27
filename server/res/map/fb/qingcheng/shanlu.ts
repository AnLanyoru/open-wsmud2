import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '山路';
    desc = '青城山木蔽日，石阶在竹林间蜿蜒向西，雾气深处隐约可见天师洞的古朴门额。';
    exits = {
        westup: 'fb/qingcheng/tianshidong',
    };
}
