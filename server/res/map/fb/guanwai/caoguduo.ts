import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '谷草跺';
    desc = '几座高大的谷草垛堆在路边，风吹过时枯草簌簌作响。西北通向满天星，东面可到白河。';
    exits = {
        northwest: 'fb/guanwai/mantianxing',
        east: 'fb/guanwai/baihe',
    };
}
