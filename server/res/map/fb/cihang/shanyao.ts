import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '山门';
    desc = '白石山门依峰而建，石阶两侧古松如盖，淡淡檀香随云气飘来，门后便是静斋清修之地。';
    exits = {
        south: 'fb/cihang/qichongmen',
        north: 'fb/cihang/shanmen',
    };
}
