import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '满天星';
    exits = {
        west: 'fb/guanwai/ermenkan',
        southeast: 'fb/guanwai/caoguduo',
    };
}
