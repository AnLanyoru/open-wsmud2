import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '火山';
    exits = {
        east: 'fb/binghuo/huoshanjiao',
    };
}
