import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '东厢房';
    desc = '厢房内琴谱散落，窗棂被剑气削断，空气中还残留着淡淡的血腥气。';
    exits = {
        west: 'fb/hengshan2/liufudating',
    };
}
