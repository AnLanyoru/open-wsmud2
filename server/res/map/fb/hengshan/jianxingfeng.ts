import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '见性峰';
    exits = {
        north: 'fb/hengshan/baiyunan',
        west: 'fb/hengshan/beiyuedian',
    };
}
