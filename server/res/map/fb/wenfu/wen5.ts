import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '侧房';
    exits = {
        west: 'fb/wenfu/zoulang4',
    };
}
