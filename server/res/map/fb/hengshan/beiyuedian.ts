import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '北岳殿';
    desc = '大殿供奉北岳大帝，香火烟气绕梁不散，殿外石阶分别通往见性峰与下山道路。';
    exits = {
        east: 'fb/hengshan/jianxingfeng',
        south: 'fb/hengshan/shandao',
    };
}
