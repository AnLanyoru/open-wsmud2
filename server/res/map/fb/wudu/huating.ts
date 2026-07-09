import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '花厅';
    exits = {
        west: 'fb/wudu/huayuan',
        north: 'fb/wudu/huating2',
    };
}
