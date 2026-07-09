import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '山道';
    desc =
        '这是一条好似水晶铺成的宽敞大道,每块都是长约八尺，宽约三尺，甚是整齐，堪称巧夺天工。道旁是郁郁葱葱的玫瑰丛，不时可以看到一两只野兔蹦蹦跳跳地跃向丛中深处。往南望去，一座巨大的宫殿巍然耸立。旁边有一块石碑(bei)。';
    exits = {
        south: 'fb/yihua/yihua0',
    };
}
