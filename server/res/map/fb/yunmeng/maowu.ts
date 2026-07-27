import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '茅屋';
    desc = '茅屋低矮破旧，屋内只有一张木床和几只药罐，似乎曾有人在此避居。';
    exits = {
        west: 'fb/yunmeng/weiqiang',
    };
}
