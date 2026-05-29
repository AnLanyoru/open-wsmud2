import { ROOM } from "../../../os/room/room.js";

export default class extends ROOM {
    name = "达摩洞";
    desc = "这里是达摩古洞。五百年前南天竺僧人菩提达摩来到少林寺，见此风水宝地，就住下来广罗弟子，传授禅宗，开创少林寺佛教禅宗千年不败之基。达摩祖师常在此面壁悟道，一坐十年，壁间隐隐似仍可看到他面壁时的打坐姿态。";
    exits = { "south": "shaolin/zhulin2"};
}
