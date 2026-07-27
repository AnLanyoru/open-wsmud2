import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '竹林';
    desc = '细竹被巨物碾倒出一道宽阔痕迹，阴冷山风从北面的石洞中夹着腥气涌来。';
    exits = {
        south: 'fb/baituo/cao2',
        north: 'fb/baituo/dong',
    };
}
