import { ROOM } from "../../../core/room/room.js";

export default class extends ROOM {
    name = "罗汉堂";
    desc = "这是一间极为简陋的禅房。环视四周，除了几幅佛竭外，室内空荡荡地别无他物。地上整齐的摆放着几个破烂且发黑的黄布蒲团，几位须发花白的老僧正在坐在上面闭目入定。这里是本寺十八罗汉参禅修行的地方，不少绝世武功便是在此悟出。一位小沙弥在一边垂手站立。";
    exits = { "west": "shaolin/lianwu" };
}
