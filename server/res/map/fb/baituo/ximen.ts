import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '西门';
    desc = '偏僻西门通向庄外荒地，门轴锈迹斑斑，墙根留着蛇群频繁爬行形成的光滑痕迹。';
    exits = {
        east: 'fb/baituo/changlang',
        west: 'fb/baituo/cao1',
    };
}
