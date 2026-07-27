import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '山坡';
    desc = '碎石山坡草木稀疏，东面峰石横出，西侧可回到通往峰顶的主路。';
    exits = {
        west: 'fb/guangming/banshanyao',
        east: 'fb/guangming/shanpo2',
    };
}
