import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '小路';
    desc = '青石小路两旁芳草鲜美，落英缤纷，远处隐约传来玉箫声，清越中透着肃杀。';
    exits = {
        south: 'fb/taohua/shijianting',
        north: 'fb/taohua/taolinchukou',
    };
}
