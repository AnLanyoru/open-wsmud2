import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '洞口';
    desc = '洞口被冰棱遮掩，寒风从黑暗深处涌出，西侧陡坡可折返忘忧谷。';
    exits = {
        westdown: 'fb/xuedao/wangyou',
        east: 'fb/xuedao/xuedao',
    };
}
