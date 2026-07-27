import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '广目天王殿';
    desc = '广目天王缠龙怒视，朱红巨柱间香烟缭绕，塑像手中赤龙仿佛正循着来客气机游动。';
    exits = {
        southeast: 'fb/jingnian/daxiong',
    };
}
