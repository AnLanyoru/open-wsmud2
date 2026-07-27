import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '极顶山道';
    desc = '碎石小径贴着峰脊延伸，西侧封禅台隐在云后，脚下山谷深不可测。';
    exits = {
        eastup: 'fb/songshan/shanmen',
        westdown: 'fb/songshan/fengshantai',
    };
}
