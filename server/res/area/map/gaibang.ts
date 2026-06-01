import { FAMILY_AREA } from "../../../core/room/fam_area.js";

export default class extends FAMILY_AREA {
    id = "gaibang";
    name = "丐帮";
    desc = "墨门行者，人数众多，势力极广，号称「天下第一大帮」，由来已不得考证，帮众以裘褐为衣,以跂蹻为服,日夜不休,以自苦为极。";
    sp = "以拳脚棍法为主，攻击效果突出";
    is_area = true;
    first = "gaibang/shudong";
    room_path = "gaibang/";
    index = 6;
    family = "GAIBANG";
    map = [
    { n: "树洞", id: "gaibang/shudong", p: [0, 0] },
    { n: "树洞下", id: "gaibang/shudongxia", p: [0, 1], exits: ["n", "e"] },
    { n: "暗道", id: "gaibang/andao1", p: [1, 1], exits: ["e"] },
    { n: "暗道", id: "gaibang/andao2", p: [2, 1] },
    { n: "密室", id: "gaibang/mishi", p: [3, 1], exits: ["n", "w", "e"] },
    { n: "破庙", id: "gaibang/pomiao", p: [3, 0] },
    { n: "暗道", id: "gaibang/andao3", p: [4, 1] },
    { n: "暗道", id: "gaibang/andao4", p: [5, 1], exits: ["w", "n"] },
    { n: "林中小屋", id: "gaibang/xiaowu", p: [5, 0] }
];
}
