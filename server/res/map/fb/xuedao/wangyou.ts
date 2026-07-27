import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '忘忧谷';
    desc = '谷中风雪稍歇，枯树与乱石掩映，地上残留着一串仓促奔逃的血色足迹。';
    exits = {
        north: 'fb/xuedao/shangu',
    };
}
