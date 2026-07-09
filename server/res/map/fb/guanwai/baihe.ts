import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '白河';
    exits = {
        north: 'fb/guanwai/xiaowu',
        east: 'fb/guanwai/milin',
        west: 'fb/guanwai/caoguduo',
    };
}
