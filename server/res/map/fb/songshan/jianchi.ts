import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '剑池';
    desc = '一方幽池映着天光，池边插满断剑，金铁肃杀之意久久不散。';
    exits = {
        south: 'fb/songshan/huimengtang',
    };
}
