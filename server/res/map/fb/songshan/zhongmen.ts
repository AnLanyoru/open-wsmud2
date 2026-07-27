import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '中门';
    desc = '厚重木门连接禅院与会盟堂，门上嵩山剑派的徽记在寒风中显得肃杀。';
    exits = {
        south: 'fb/songshan/chanyuan',
        north: 'fb/songshan/huimengtang',
    };
}
