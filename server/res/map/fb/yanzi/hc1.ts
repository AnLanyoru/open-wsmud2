import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '花丛';
    exits = {
        east: 'fb/yanzi/zhuangmen',
        west: 'fb/yanzi/anbian',
    };
}
