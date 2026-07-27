import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '碎石小路';
    desc = '浅色碎石铺成的小路穿过修竹，竹影随风摇曳，向东可闻雨打亭檐，向南则通往更幽深的山径。';
    exits = {
        west: 'fb/cihang/guangchang',
        east: 'fb/cihang/tingyu',
        south: 'fb/cihang/xiaolu3',
    };
}
