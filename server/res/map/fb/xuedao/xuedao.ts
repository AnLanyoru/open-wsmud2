import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '山洞';
    desc = '洞底供着一柄石刻血刀，四壁绘满诡异刀招，暗红油灯照得人影摇曳。';
    exits = {
        west: 'fb/xuedao/dongkou',
    };
}
