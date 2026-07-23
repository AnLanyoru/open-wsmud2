import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '黑风口';
    desc = '两山之间形成一道狭长风口，狂风夹着冰粒迎面打来。西边是密林，东面山坳中有一汪小天池。';
    exits = {
        west: 'fb/guanwai/milin3',
        east: 'fb/guanwai/xiaotianchi',
    };
}
