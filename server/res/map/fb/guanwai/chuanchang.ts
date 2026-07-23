import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '船厂';
    desc = '这里是一座废弃的船厂，岸边散落着腐朽的木料和断裂的桅杆。往南的积雪中留着进山人的足迹，北面隐约可见一座破庙。';
    exits = {
        east: 'fb/guanwai/jiang',
        south: 'fb/guanwai/xuedi',
        north: 'fb/guanwai/shanshenmiao',
    };
}
