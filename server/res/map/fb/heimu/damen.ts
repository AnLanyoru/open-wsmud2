import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '大门';
    desc = '黑木崖总坛大门以巨木包铁铸成，门上日月图案在云雾中若隐若现。';
    exits = {
        west: 'fb/heimu/up3',
        east: 'fb/heimu/chengdedian',
    };
}
