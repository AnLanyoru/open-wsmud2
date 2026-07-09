import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '二门坎子';
    exits = {
        southwest: 'fb/guanwai/damen',
        east: 'fb/guanwai/mantianxing',
    };
}
