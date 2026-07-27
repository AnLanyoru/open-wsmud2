import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '石洞';
    desc = '洞内阴湿腥臭，累累兽骨堆在岩壁下，一条巨蟒睁开灯笼般的双眼缓缓逼近。';
    exits = {
        south: 'fb/baituo/zhulin',
    };

    constructor() {
        super();
        this.set_npc('fb/baituo/mangshe');
    }
}
