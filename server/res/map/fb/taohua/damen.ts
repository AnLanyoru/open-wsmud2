import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '大门';
    desc = '朱漆大门半掩，门额没有匾题，院内花木布置暗合五行，处处显出主人不凡心思。';
    exits = {
        west: 'fb/taohua/shijianting',
        east: 'fb/taohua/qianyuan',
    };
}
