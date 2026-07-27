import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '花园';
    desc = '园中青竹与兰草错落有致，一条石径北通掌门卧室，西面返回人声嘈杂的练武场。';
    exits = {
        west: 'fb/qingcheng/caochang',
        north: 'fb/qingcheng/woshi',
    };
}
