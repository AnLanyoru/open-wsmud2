import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '崇圣宝殿';
    desc = '宝殿金碧辉煌，佛像庄严肃穆，殿中梵音低回；牟尼堂在般若台南侧，需先通过一侧护法阁。';
    exits = {
        north: 'fb/tianlong/ta',
    };
}
