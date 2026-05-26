/**
 *
 * @authors kwer (kwer8080@foxmail.com)
 * @date    2017-09-25 22:24:58
 * @version $Id$
 */
this.inherits(ROOM);
this.name = "兵营";
this.desc = "这里是兵营，密密麻麻到处都是官兵，有的在武将的指挥下列队操练，有的独自在练功，有的坐着、躺着正在休息。南墙下坐着主帅，不动声色地巡视着四周。看到你进来，他们全都瞪大眼睛盯着你。";
this.exits = {
    "out" : "xiangyang/guangchang",
};
this.set_npc('xiangyang/bing');