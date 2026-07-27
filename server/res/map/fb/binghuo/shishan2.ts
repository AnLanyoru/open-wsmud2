import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '石山';
    desc = '背风岩坳堆着折断树枝和兽骨，远处冰海白茫茫一片，只有火山烟柱清晰可见。';
    exits = {
        east: 'fb/binghuo/shishan',
        south: 'fb/binghuo/xiaodong',
    };
}
