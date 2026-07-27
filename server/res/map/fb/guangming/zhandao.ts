import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '栈道';
    desc = '木栈道悬在万丈深谷上方，脚下木板吱呀作响，只容一人谨慎通行。';
    exits = {
        west: 'fb/guangming/shanlu',
        south: 'fb/guangming/shanmen',
    };
}
