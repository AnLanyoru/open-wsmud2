/**
 *
 * @authors kwer (kwer8080@foxmail.com)
 * @date    2017-09-23 16:59:50
 * @version $Id$
 */
this.inherits(ROOM);
this.name = "东大街";
this.desc = "这是一条宽阔的青石板街道，向东西两头延伸。";
// this.desc = "这儿是很大的十字街口，北边是东内大街，南面是一条街道，听说有钱人一般都住在里面，东面通向襄阳城的青龙门，向西可到达中央广场。";
this.exits = {
    east  : "xiangyang/eastjie3",
    west  : "xiangyang/eastjie1",
    // south : "xiangyang/jiedao",
    // north : "xiangyang/eastroad1",
};
