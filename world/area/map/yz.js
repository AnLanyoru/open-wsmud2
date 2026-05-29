import { AREA } from "../../../os/room/area.js";

export default class extends AREA {
    id = "yz";
    name = "扬州城";
    desc = "公共区域，你可以在这里买卖物品，使用仓库，购买房屋，帮派驻地等";
    is_area = true;
    first = "yz/guangchang";
    index = 0;
    room_path = "yz/";
    is_public = true;
    map = [{ n: "中央广场", id: "yz/guangchang", p: [0, 0], exits: ["w2", "e2", "s", "n"] },
{ n: "北大街", id: "yz/beidajie1", p: [0, -1], exits: ["w", "e", "n"] },
{ n: "北大街", id: "yz/beidajie2", p: [0, -2], exits: ["w", "e", "n"] },
{ n: "北门", id: "yz/beimen", p: [0, -3] },
{ n: "西大街", id: "yz/xidajie1", p: [-2, 0], exits: ["w"] },
{ n: "西大街", id: "yz/xidajie2", p: [-3, 0], exits: ["w", "n"] },
{ n: "西门", id: "yz/ximen", p: [-4, 0] },
{ n: "南大街", id: "yz/nandajie1", p: [0, 1], exits: ["s"] },
{ n: "南大街", id: "yz/nandajie2", p: [0, 2], exits: ["s"] },
{ n: "南门", id: "yz/nanmen", p: [0, 3] },
{ n: "东大街", id: "yz/dongdajie1", p: [2, 0], exits: ["e", "s"] },
{ n: "东大街", id: "yz/dongdajie2", p: [3, 0], exits: ["e"] },
{ n: "东门", id: "yz/dongmen", p: [4, 0] },

{ n: "江边", id: "yz/hanshui", p: [0, -4], exits: ["s"] },
{ n: "矿山", id: "yz/kuang", p: [-5, -0], exits: ["e"] },
{ n: "药林", id: "yz/yaolin", p: [4, 1], exits: ["n"] },
{ n: "工厂", id: "yz/work", p: [-1, 3], exits: ["e"] },

{ n: "衙门", id: "yz/yamen", p: [-2, -1], exits: ["s", "n"] },
{ n: "衙门", id: "yz/ymzhengting", p: [-2, -2] },
{ n: "擂台", id: "yz/leitaixia", p: [-2, 1], exits: ["n"] },
{ n: "住宅大门", id: "yz/home", p: [-3, -1] },
{ n: "镖局大门", id: "yz/biaoju", p: [-3, 1], exits: ["n"] },
{ n: "镖局正厅", id: "yz/zhengting", p: [-3, 2], exits: ["n"] },
{ n: "赌场", id: "yz/duchang", p: [-1, 1], exits: ["e"] },
{ n: "当铺", id: "yz/dangpu", p: [1, 1], exits: ["w"] },
{ n: "武馆", id: "yz/wuguan", p: [-1, 2], exits: ["e"] },
{ n: "帮派驻地", id: "bangpai/men", p: [1, 2], exits: ["w"] },
{ n: "书院", id: "yz/shuyuan", p: [2, -1], exits: ["s"] },
{ n: "药店", id: "yz/yaopu", p: [3, -1], exits: ["s", "n"] },
{ n: "内室", id: "yz/neishi", p: [3, -2] },
{ n: "打铁铺", id: "yz/datiepu", p: [3, 1], exits: ["n"] },
{ n: "醉仙楼", id: "yz/zuixianlou", p: [1, -2], exits: ["w"] },
{ n: "武庙", id: "yz/wumiao", p: [-1, -2], exits: ["e"] },
{ n: "钱庄", id: "yz/qianzhuang", p: [-1, -1], exits: ["e"] },
{ n: "客栈", id: "yz/kedian", p: [1, -1], exits: ["w"] },
{ n: "杂货铺", id: "yz/zahuopu", p: [2, 1], exits: ["w", "s1d"] },
{ n: "成衣铺", id: "yz/garments", p: [2, 2] }];
    actions = [
    ['goto home', '回家', '回到你在扬州城购买的房屋，可练功，采药等'],
    ['goto kuang', '矿山', '扬州城的西面有座矿山，可以挖到珍惜的宝石'],
    ['goto bp', '帮派', '回到自己的帮派驻地'],
    ['pm list', '拍卖', '打开正在拍卖的道具列表']];
}
