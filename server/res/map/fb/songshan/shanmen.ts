import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '峻极山门';
    desc = '山门高踞险峰，匾额上峻极二字气势逼人，数条山路在此交汇。';
    exits = {
        southdown: 'fb/songshan/chaotianmen',
        northup: 'fb/songshan/qianting',
        westdown: 'fb/songshan/shandao2',
    };
}
