import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '后山';
    desc = '后山松林幽深，山风穿枝如低声诵经，一条僻静小径绕向禅院侧后方，地上少有人迹。';
    exits = {
        west: 'fb/jingnian/baishi',
    };
}
