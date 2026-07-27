import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '小洞';
    desc = '这处小洞仅容一人弯腰通过，岩壁留着刀劈斧凿的痕迹，角落放着几只破旧陶碗。';
    exits = { north: 'fb/binghuo/shishan2' };
}
