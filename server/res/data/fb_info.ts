export type FbInfo = {
  index?: number;
  name?: string;
  desc?: string;
  reward?: string;
  diffs?: number[];
};

export const FB_INFO_BY_INDEX: FbInfo[] = [
  {
    index: 0,
    name: "树林",
    desc: "扬州东城外的一处山坳，被一群狼占领着，有些不知情的人误闯到这里就再也回不去了，据说丢下不少金银财宝。",
    reward:
      "获得1000点经验，1000点潜能\n掉落或解谜奖励：\n<span cmd='look3 0 of fb_0'><wht>动物皮毛</wht></span>\n<span cmd='look3 1 of fb_0'><wht>布衣</wht></span>\n<span cmd='look3 2 of fb_0'><wht>钢刀</wht></span>\n<span cmd='look3 3 of fb_0'><wht>铁戒指</wht></span>\n<span cmd='look3 4 of fb_0'><wht>铁棍</wht></span>\n<span cmd='look3 5 of fb_0'><wht>铁剑</wht></span>\n<span cmd='look3 6 of fb_0'><wht>英雄巾</wht></span>\n<span cmd='look3 7 of fb_0'><wht>布鞋</wht></span>\n<span cmd='look3 8 of fb_0'><hig>短衣劲装</hig></span>\n<span cmd='look3 9 of fb_0'><wht>基本轻功秘籍</wht></span>",
    diffs: [1, 0, 0],
  },
  {
    index: 1,
    name: "财主家",
    desc: "扬州城的一个土财主家，养了几个看家护院，在本地是横行霸道。",
    reward:
      "获得1100点经验，1100点潜能\n掉落或解谜奖励：\n<span cmd='look3 0 of fb_1'><wht>家丁服</wht></span>\n<span cmd='look3 1 of fb_1'><wht>家丁鞋</wht></span>\n<span cmd='look3 2 of fb_1'><wht>东厢钥匙</wht></span>\n<span cmd='look3 3 of fb_1'><hic>崔莺莺的手镯</hic></span>\n<span cmd='look3 4 of fb_1'><hig>崔员外的戒指</hig></span>\n<span cmd='look3 5 of fb_1'><hic>小箱子</hic></span>\n<span cmd='look3 6 of fb_1'><wht>基本拳脚秘籍</wht></span>\n<span cmd='look3 7 of fb_1'><wht>基本招架秘籍</wht></span>\n<span cmd='look3 8 of fb_1'><wht>基本轻功秘籍</wht></span>",
    diffs: [1, 1, 0],
  },
  {
    index: 2,
    name: "流氓巷",
    desc: "扬州城北的一条老街道，被一群大小流氓整天占着，去那里行侠仗义是个不错的主意。",
    reward:
      "获得1200点经验，1200点潜能\n掉落或解谜奖励：\n<span cmd='look3 0 of fb_2'><hig>流氓巾</hig></span>\n<span cmd='look3 1 of fb_2'><hig>流氓衣</hig></span>\n<span cmd='look3 2 of fb_2'><hig>流氓鞋</hig></span>\n<span cmd='look3 3 of fb_2'><hig>流氓护腕</hig></span>\n<span cmd='look3 4 of fb_2'><hig>流氓短剑</hig></span>\n<span cmd='look3 5 of fb_2'><hig>流氓闷棍</hig></span>\n<span cmd='look3 6 of fb_2'><hig>千斤拳</hig></span>\n<span cmd='look3 7 of fb_2'><wht>基本内功秘籍</wht></span>\n<span cmd='look3 8 of fb_2'><wht>基本拳脚秘籍</wht></span>\n<span cmd='look3 9 of fb_2'><hig>太祖长拳残页</hig></span>\n<span cmd='look3 10 of fb_2'><wht>基本招架秘籍</wht></span>\n<span cmd='look3 11 of fb_2'><wht>基本轻功秘籍</wht></span>",
    diffs: [1, 0, 1],
  },
  {
    index: 3,
    name: "丽春院",
    desc: "扬州城的丽春院是天下闻名，据说最近朝廷在追捕的几个逃犯在这里出现过，要不要去试试运气。",
    reward:
      "获得1300点经验，1300点潜能\n掉落或解谜奖励：\n<span cmd='look3 0 of fb_3'><wht>基本刀法秘籍</wht></span>\n<span cmd='look3 1 of fb_3'><hig>五虎断门刀秘籍</hig></span>\n<span cmd='look3 2 of fb_3'><hig>五虎断门刀残页</hig></span>\n<span cmd='look3 3 of fb_3'><wht>基本鞭法秘籍</wht></span>\n<span cmd='look3 4 of fb_3'><hig>云龙鞭法残页</hig></span>\n<span cmd='look3 5 of fb_3'><hic>黑龙鞭</hic></span>\n<span cmd='look3 6 of fb_3'><hig>黑虎单刀</hig></span>\n<span cmd='look3 7 of fb_3'><hig>官服</hig></span>\n<span cmd='look3 8 of fb_3'><hig>韦春芳的项链</hig></span>",
    diffs: [1, 0, 0],
  },
  {
    index: 4,
    name: "兵营",
    desc: "这是扬州城兵营，扬州守备史青山就驻扎在这里",
    reward:
      "获得1400点经验，1400点潜能\n掉落或解谜奖励：\n<span cmd='look3 0 of fb_4'><wht>基本刀法秘籍</wht></span>\n<span cmd='look3 1 of fb_4'><wht>基本剑法秘籍</wht></span>\n<span cmd='look3 2 of fb_4'><hic>将军剑</hic></span>\n<span cmd='look3 3 of fb_4'><hig>军刀</hig></span>\n<span cmd='look3 4 of fb_4'><hig>军服</hig></span>\n<span cmd='look3 5 of fb_4'><hig>齐眉棍</hig></span>\n<span cmd='look3 6 of fb_4'><hig>官服</hig></span>",
    diffs: [1, 0, 0],
  },
  {
    index: 5,
    name: "庄府",
    desc: "因明史一案被抄家灭族的庄府一众妇孺被何惕守救后就藏在这里，想要伺机刺杀鳌拜",
    reward:
      "获得1500点经验，1500点潜能\n掉落或解谜奖励：\n<span cmd='look3 0 of fb_5'><hic>神龙心法残页</hic></span>\n<span cmd='look3 1 of fb_5'><hig>意形步法残页</hig></span>\n<span cmd='look3 2 of fb_5'><hig>神龙剑残页</hig></span>",
    diffs: [1, 0, 0],
  },
  {
    index: 6,
    name: "鳌拜府",
    desc: "满洲第一勇士鳌拜的府邸",
    reward:
      "获得1600点经验，1600点潜能\n掉落或解谜奖励：\n<span cmd='look3 0 of fb_6'><hic>金丝宝甲</hic></span>\n<span cmd='look3 1 of fb_6'><hic>鳌拜匕首</hic></span>\n<span cmd='look3 2 of fb_6'><hig>混元一气残页</hig></span>\n<span cmd='look3 3 of fb_6'><hig>飞檐走壁残页</hig></span>\n<span cmd='look3 4 of fb_6'><hig>伏虎拳残页</hig></span>\n<span cmd='look3 5 of fb_6'><hig>绝门棍残页</hig></span>\n<span cmd='look3 6 of fb_6'><wht>牢房钥匙</wht></span>\n<span cmd='look3 7 of fb_6'><hig>四十二章经</hig></span>",
    diffs: [1, 0, 0],
  },
  {
    index: 7,
    name: "天地会",
    desc: "天地会在北京城的青木堂所在，据说在入口在一家药铺里面",
    reward:
      "获得1700点经验，1700点潜能\n掉落或解谜奖励：\n<span cmd='look3 0 of fb_7'><hig>密宗心法残页</hig></span>\n<span cmd='look3 1 of fb_7'><hig>密宗大手印残页</hig></span>\n<span cmd='look3 2 of fb_7'><hig>猴拳残页</hig></span>\n<span cmd='look3 3 of fb_7'><hic>云龙剑残页</hic></span>\n<span cmd='look3 4 of fb_7'><hig>云龙身法残页</hig></span>\n<span cmd='look3 5 of fb_7'><hig>云龙心法残页</hig></span>\n<span cmd='look3 6 of fb_7'><hic>神形百变残页</hic></span>\n<span cmd='look3 7 of fb_7'><hig>秋风拂尘残页</hig></span>\n<span cmd='look3 8 of fb_7'><hic>云龙剑</hic></span>",
    diffs: [1, 0, 0],
  },
  {
    index: 8,
    name: "神龙教",
    desc: "北京城东出海不远出的神龙岛是神龙教大本营。这里蛇虫出没，提前准备点蛇药比较好。",
    reward:
      "获得1800点经验，1800点潜能\n掉落或解谜奖励：\n<span cmd='look3 0 of fb_8'><hic>神龙心法残页</hic></span>\n<span cmd='look3 1 of fb_8'><hig>意形步法残页</hig></span>\n<span cmd='look3 2 of fb_8'><hic>蛇岛奇功残页</hic></span>\n<span cmd='look3 3 of fb_8'><hig>神龙剑残页</hig></span>\n<span cmd='look3 4 of fb_8'><hic>化骨绵掌残页</hic></span>\n<span cmd='look3 5 of fb_8'><hic>神龙袍</hic></span>\n<span cmd='look3 6 of fb_8'><hic>神龙冠</hic></span>\n<span cmd='look3 7 of fb_8'><hic>神龙靴</hic></span>\n<span cmd='look3 8 of fb_8'><hic>神龙护腕</hic></span>\n<span cmd='look3 9 of fb_8'><hic>神龙腰带</hic></span>\n<span cmd='look3 10 of fb_8'><hic>神龙杖</hic></span>\n<span cmd='look3 11 of fb_8'><hic>神龙令</hic></span>",
    diffs: [1, 0, 1],
  },
  {
    index: 9,
    name: "关外",
    desc: "出了山海关，靠近长白山的地方，这里有很多关于闯王宝藏，大清龙脉的传说",
    reward:
      "获得1900点经验，1900点潜能\n掉落或解谜奖励：\n<span cmd='look3 0 of fb_9'><hig>冷月神功残页</hig></span>\n<span cmd='look3 1 of fb_9'><hig>熊胆</hig></span>\n<span cmd='look3 2 of fb_9'><hic>胡家刀法残页</hic></span>\n<span cmd='look3 3 of fb_9'><hic>四象步法残页</hic></span>\n<span cmd='look3 4 of fb_9'><hiy>闯王宝刀</hiy></span>",
    diffs: [1, 0, 0],
  },
  {
    index: 10,
    name: "温府",
    desc: "石梁派温家，一家六兄弟全都阴险毒辣无比，使用毒计得到了金蛇郎君的宝藏",
    reward:
      "获得2000点经验，2000点潜能\n掉落或解谜奖励：\n<span cmd='look3 0 of fb_10'><hig>金蛇锥</hig></span>\n<span cmd='look3 1 of fb_10'><hic>金蛇戒</hic></span>\n<span cmd='look3 2 of fb_10'><hic>金蛇披风</hic></span>\n<span cmd='look3 3 of fb_10'><hic>温仪的香囊</hic></span>\n<span cmd='look3 4 of fb_10'><hic>八卦拳残页</hic></span>\n<span cmd='look3 5 of fb_10'><hic>八卦棍法残页</hic></span>\n<span cmd='look3 6 of fb_10'><hiy>金蛇剑法残页</hiy></span>\n<span cmd='look3 7 of fb_10'><hiy>金蛇游身掌残页</hiy></span>\n<span cmd='look3 8 of fb_10'><hiy>金蛇游身步残页</hiy></span>\n<span cmd='look3 9 of fb_10'><hiy>八卦棍</hiy></span>\n<span cmd='look3 10 of fb_10'><hiy>金蛇剑</hiy></span>",
    diffs: [1, 0, 0],
  },
  {
    index: 11,
    name: "五毒教",
    desc: "自称是五仙教，别人称之为五毒教 驱使蛤蟆、蜘蛛、蝎子、毒蛇、蜈蚣五种毒物战斗，善用毒",
    reward:
      "获得2100点经验，2100点潜能\n掉落或解谜奖励：\n<span cmd='look3 0 of fb_11'><hic>五毒神功残页</hic></span>\n<span cmd='look3 1 of fb_11'><hiy>五毒烟萝步残页</hiy></span>\n<span cmd='look3 2 of fb_11'><hiy>五毒钩法残页</hiy></span>\n<span cmd='look3 3 of fb_11'><hiy>千蛛万毒手残页</hiy></span>",
    diffs: [1, 0, 1],
  },
  {
    index: 12,
    name: "恒山",
    desc: "北岳恒山，也是五岳剑派恒山派的所在地",
    reward:
      "获得2200点经验，2200点潜能\n掉落或解谜奖励：\n<span cmd='look3 0 of fb_12'><hic>恒山身法残页</hic></span>\n<span cmd='look3 1 of fb_12'><hiy>白云心法残页</hiy></span>\n<span cmd='look3 2 of fb_12'><hiy>恒山剑法残页</hiy></span>\n<span cmd='look3 3 of fb_12'><hiy>天长掌法残页</hiy></span>\n<span cmd='look3 4 of fb_12'><hiy>狂风快刀残页</hiy></span>\n<span cmd='look3 5 of fb_12'><hiy>狂风刀</hiy></span>\n<span cmd='look3 6 of fb_12'><hiy>田伯光的面罩</hiy></span>",
    diffs: [1, 0, 0],
  },
  {
    index: 13,
    name: "青城山",
    desc: "青城派的所在地",
    reward:
      "获得2300点经验，2300点潜能\n掉落或解谜奖励：\n<span cmd='look3 0 of fb_13'><hic>踏歌行残页</hic></span>\n<span cmd='look3 1 of fb_13'><hiy>摧心掌残页</hiy></span>\n<span cmd='look3 2 of fb_13'><hiy>松风剑法残页</hiy></span>",
    diffs: [1, 0, 0],
  },
  {
    index: 14,
    name: "衡山",
    desc: "衡山派的所在地",
    reward:
      "获得2400点经验，2400点潜能\n掉落或解谜奖励：\n<span cmd='look3 0 of fb_14'><hic>琴中剑</hic></span>\n<span cmd='look3 1 of fb_14'><hiy>曲洋的琴环</hiy></span>\n<span cmd='look3 2 of fb_14'><hiy>刘正风的茧绸袍</hiy></span>\n<span cmd='look3 3 of fb_14'><hic>穿云纵残页</hic></span>\n<span cmd='look3 4 of fb_14'><hic>流云掌残页</hic></span>\n<span cmd='look3 5 of fb_14'><hiy>镇岳诀残页</hiy></span>\n<span cmd='look3 6 of fb_14'><hiy>衡山五神剑残页</hiy></span>",
    diffs: [1, 0, 0],
  },
  {
    index: 15,
    name: "泰山",
    desc: "泰山派的所在地",
    reward:
      "获得2500点经验，2500点潜能\n掉落或解谜奖励：\n<span cmd='look3 0 of fb_15'><hiy>泰山登山靴</hiy></span>\n<span cmd='look3 1 of fb_15'><hiy>磐石护符</hiy></span>\n<span cmd='look3 2 of fb_15'><hic>泰山拳法残页</hic></span>\n<span cmd='look3 3 of fb_15'><hiy>泰山剑法残页</hiy></span>\n<span cmd='look3 4 of fb_15'><hiy>磐石神功残页</hiy></span>",
    diffs: [1, 0, 0],
  },
  {
    index: 16,
    name: "嵩山",
    desc: "中岳嵩山，也是五岳剑派嵩山派的所在地",
    reward:
      "获得2600点经验，2600点潜能\n掉落或解谜奖励：\n<span cmd='look3 0 of fb_16'><hiy>大嵩阳神掌残页</hiy></span>\n<span cmd='look3 1 of fb_16'><hiy>嵩山剑法残页</hiy></span>\n<span cmd='look3 2 of fb_16'><hiy>五岳令旗</hiy></span>\n<span cmd='look3 3 of fb_16'><hiy>盟主披风</hiy></span>\n<span cmd='look3 4 of fb_16'><HIZ>寒冰真气残页</HIZ></span>",
    diffs: [1, 0, 0],
  },
  {
    index: 17,
    name: "云梦沼泽",
    desc: "对很多江湖中人来说都不愿意踏足的地方，据说那里有无数猛兽巨鳄，到处充满着危险",
    reward:
      "获得2700点经验，2700点潜能\n掉落或解谜奖励：\n<span cmd='look3 0 of fb_17'><hig>鳄鱼皮</hig></span>\n<span cmd='look3 1 of fb_17'><hig>火龙筋</hig></span>\n<span cmd='look3 2 of fb_17'><hig>玄晶</hig></span>\n<span cmd='look3 3 of fb_17'><hic>蓝宝石</hic></span>\n<span cmd='look3 4 of fb_17'><hic>红宝石</hic></span>\n<span cmd='look3 5 of fb_17'><hic>黄宝石</hic></span>\n<span cmd='look3 6 of fb_17'><hic>绿宝石</hic></span>\n<span cmd='look3 7 of fb_17'><hiy>火龙刀</hiy></span>\n<span cmd='look3 8 of fb_17'><hiy>火龙剑</hiy></span>\n<span cmd='look3 9 of fb_17'><hiy>火龙拳</hiy></span>\n<span cmd='look3 10 of fb_17'><hiy>火龙鞭</hiy></span>\n<span cmd='look3 11 of fb_17'><hiy>火龙棍</hiy></span>",
    diffs: [1, 0, 1],
  },
  {
    index: 18,
    name: "桃花岛",
    desc: "此处名为桃花岛，乃是天下“五绝”之一“东邪”黄药师的隐居之所。",
    reward:
      "获得2800点经验，2800点潜能\n掉落或解谜奖励：\n<span cmd='look3 0 of fb_18'><hig>金雁功残页</hig></span>\n<span cmd='look3 1 of fb_18'><hic>碧波神功残页</hic></span>\n<span cmd='look3 2 of fb_18'><hiy>暗影浮香残页</hiy></span>\n<span cmd='look3 3 of fb_18'><hiy>落英神剑残页</hiy></span>\n<span cmd='look3 4 of fb_18'><HIZ>弹指神通残页</HIZ></span>\n<span cmd='look3 5 of fb_18'><HIZ>空明拳残页</HIZ></span>\n<span cmd='look3 6 of fb_18'><HIZ>玉箫</HIZ></span>\n<span cmd='look3 7 of fb_18'><HIZ>软猬甲</HIZ></span>",
    diffs: [1, 1, 0],
  },
  {
    index: 19,
    name: "白驼山",
    desc: "西毒欧阳锋的大本营，在西域大漠深处",
    reward:
      "获得2900点经验，2900点潜能\n掉落或解谜奖励：\n<span cmd='look3 0 of fb_19'><HIZ>灵蛇杖法残页</HIZ></span>\n<span cmd='look3 1 of fb_19'><hic>蟾蜍步法残页</hic></span>\n<span cmd='look3 2 of fb_19'><HIZ>蛤蟆功残页</HIZ></span>\n<span cmd='look3 3 of fb_19'><HIZ>灵蛇杖</HIZ></span>",
    diffs: [1, 0, 1],
  },
  {
    index: 20,
    name: "星宿海",
    desc: "星宿派大本营，星宿老仙丁春秋的地盘，门下弟子大都喜欢拍马逢迎，又无恶不作",
    reward:
      "获得3000点经验，3000点潜能\n掉落或解谜奖励：\n<span cmd='look3 0 of fb_20'><hic>摘星功残页</hic></span>\n<span cmd='look3 1 of fb_20'><hic>飞星术残页</hic></span>\n<span cmd='look3 2 of fb_20'><hiy>碧磷针</hiy></span>\n<span cmd='look3 3 of fb_20'><hiy>三阴蜈蚣爪残页</hiy></span>\n<span cmd='look3 4 of fb_20'><HIZ>化功大法残页</HIZ></span>\n<span cmd='look3 5 of fb_20'><HIZ>神木王鼎</HIZ></span>",
    diffs: [1, 0, 0],
  },
  {
    index: 21,
    name: "冰火岛",
    desc: "一处无人小岛，因为一半冰山一半火山所以叫做冰火岛，据说金毛狮王谢逊就流落到这里。",
    reward:
      "获得3100点经验，3100点潜能\n掉落或解谜奖励：\n<span cmd='look3 0 of fb_21'><hig>玄晶</hig></span>\n<span cmd='look3 1 of fb_21'><hic>蓝宝石</hic></span>\n<span cmd='look3 2 of fb_21'><hic>红宝石</hic></span>\n<span cmd='look3 3 of fb_21'><hic>黄宝石</hic></span>\n<span cmd='look3 4 of fb_21'><hic>绿宝石</hic></span>\n<span cmd='look3 5 of fb_21'><hic>红宝石</hic></span>\n<span cmd='look3 6 of fb_21'><hic>青蝠身法残页</hic></span>\n<span cmd='look3 7 of fb_21'><hiy>精致的蓝宝石</hiy></span>\n<span cmd='look3 8 of fb_21'><hiy>精致的黄宝石</hiy></span>\n<span cmd='look3 9 of fb_21'><hiy>精致的绿宝石</hiy></span>\n<span cmd='look3 10 of fb_21'><hiy>玲珑火芝</hiy></span>\n<span cmd='look3 11 of fb_21'><hiy>七伤拳残页</hiy></span>\n<span cmd='look3 12 of fb_21'><HIZ>离火珠</HIZ></span>\n<span cmd='look3 13 of fb_21'><hio>屠龙刀</hio></span>",
    diffs: [1, 1, 1],
  },
  {
    index: 22,
    name: "移花宫",
    desc: "移花宫所处武林禁地绣玉谷是男人的禁地，也是一个百花齐放，宛若世外仙境的地方。从开派以来绣玉谷移花宫里都为漂亮女子。",
    reward:
      "获得3200点经验，3200点潜能\n掉落或解谜奖励：\n<span cmd='look3 0 of fb_22'><hic>绝情掌残页</hic></span>\n<span cmd='look3 1 of fb_22'><hiy>涟星的冰玉簪</hiy></span>\n<span cmd='look3 2 of fb_22'><hiy>邀月的手镯</hiy></span>\n<span cmd='look3 3 of fb_22'><hiy>花无缺的玉佩</hiy></span>\n<span cmd='look3 4 of fb_22'><hiy>移风剑法残页</hiy></span>\n<span cmd='look3 5 of fb_22'><hiy>碧玉血莲</hiy></span>\n<span cmd='look3 6 of fb_22'><HIZ>移花宫装</HIZ></span>\n<span cmd='look3 7 of fb_22'><HIZ>移花宫履</HIZ></span>\n<span cmd='look3 8 of fb_22'><HIZ>移花接木残页</HIZ></span>\n<span cmd='look3 9 of fb_22'><HIZ>明玉功残页</HIZ></span>\n<span cmd='look3 10 of fb_22'><hio>碧血照丹青</hio></span>",
    diffs: [1, 1, 1],
  },
  {
    index: 23,
    name: "燕子坞",
    desc: "燕子坞是姑苏慕容家的大本营，据说那里的还施水阁收集了大量的武功",
    reward:
      "获得3300点经验，3300点潜能\n掉落或解谜奖励：\n<span cmd='look3 0 of fb_23'><HIZ>阿朱的易容面具</HIZ></span>\n<span cmd='look3 1 of fb_23'><HIZ>参合指残页</HIZ></span>\n<span cmd='look3 2 of fb_23'><hio>斗转星移残页</hio></span>",
    diffs: [1, 1, 0],
  },
  {
    index: 24,
    name: "黑木崖",
    desc: "日月神教的总坛所在地，威震江湖的东方不败就坐镇此处，守卫众多，戒备森严。",
    reward:
      "获得3400点经验，3400点潜能\n掉落或解谜奖励：\n<span cmd='look3 0 of fb_24'><hiy>上官云的披风</hiy></span>\n<span cmd='look3 1 of fb_24'><hiy>童百熊的戒指</hiy></span>\n<span cmd='look3 2 of fb_24'><hiy>杨莲亭的项圈</hiy></span>\n<span cmd='look3 3 of fb_24'><hiy>贾布的护腰锁</hiy></span>\n<span cmd='look3 4 of fb_24'><hio>辟邪剑法残页</hio></span>\n<span cmd='look3 5 of fb_24'><hio>葵花神功残页</hio></span>\n<span cmd='look3 6 of fb_24'><HIZ>东方不败的绣花针</HIZ></span>",
    diffs: [1, 1, 1],
  },
  {
    index: 25,
    name: "缥缈峰",
    desc: "缥缈峰灵鹫宫是威震天下的天山童姥所在地",
    reward:
      "获得3500点经验，3500点潜能\n掉落或解谜奖励：\n<span cmd='look3 0 of fb_25'><hic>神剑诀残页</hic></span>\n<span cmd='look3 1 of fb_25'><hiy>天羽奇剑残页</hiy></span>\n<span cmd='look3 2 of fb_25'><HIZ>驻颜丹</HIZ></span>\n<span cmd='look3 3 of fb_25'><hio>不老长春功残页</hio></span>\n<span cmd='look3 4 of fb_25'><hio>天龙遗珠</hio></span>",
    diffs: [1, 1, 0],
  },
  {
    index: 26,
    name: "光明顶",
    desc: "明教总坛所在地。",
    reward:
      "获得3600点经验，3600点潜能\n掉落或解谜奖励：\n<span cmd='look3 0 of fb_26'><hiy>圣火神功残页</hiy></span>\n<span cmd='look3 1 of fb_26'><hic>青蝠身法残页</hic></span>\n<span cmd='look3 2 of fb_26'><hic>鹰爪功残页</hic></span>\n<span cmd='look3 3 of fb_26'><hic>圣火令法残页</hic></span>\n<span cmd='look3 4 of fb_26'><HIZ>圣火令</HIZ></span>\n<span cmd='look3 5 of fb_26'><HIZ>周芷若的手镯</HIZ></span>\n<span cmd='look3 6 of fb_26'><HIZ>杨不悔的项链</HIZ></span>\n<span cmd='look3 7 of fb_26'><HIZ>赵敏的戒指</HIZ></span>\n<span cmd='look3 8 of fb_26'><HIZ>韦一笑的逃命鞋</HIZ></span>\n<span cmd='look3 9 of fb_26'><hio>九阳神功残页</hio></span>\n<span cmd='look3 10 of fb_26'><hio>乾坤大挪移残页</hio></span>\n<span cmd='look3 11 of fb_26'><hio>倚天剑</hio></span>",
    diffs: [1, 0, 1],
  },
  {
    index: 27,
    name: "天龙寺",
    desc: "大理段家的皇家寺院，据说有一门神奇的武功六脉神剑，以指为剑，命中极高，更可隔空点穴，制敌于数米之外",
    reward:
      "获得3700点经验，3700点潜能\n掉落或解谜奖励：\n<span cmd='look3 0 of fb_27'><hic>天南步残页</hic></span>\n<span cmd='look3 1 of fb_27'><hiy>段家剑残页</hiy></span>\n<span cmd='look3 2 of fb_27'><HIZ>枯木神功残页</HIZ></span>\n<span cmd='look3 3 of fb_27'><hio>六脉神剑残页</hio></span>\n<span cmd='look3 4 of fb_27'><hio>龙骨舍利</hio></span>",
    diffs: [1, 1, 0],
  },
  {
    index: 28,
    name: "血刀门",
    desc: "大雪山里面的一个门派，门内全部人都使用弯刀因刀上有条血红色弯条所以叫「血刀」。",
    reward:
      "获得3800点经验，3800点潜能\n掉落或解谜奖励：\n<span cmd='look3 0 of fb_28'><hic>身空行残页</hic></span>\n<span cmd='look3 1 of fb_28'><HIZ>神照经残页</HIZ></span>\n<span cmd='look3 2 of fb_28'><HIZ>血海魔功残页</HIZ></span>\n<span cmd='look3 3 of fb_28'><hio>血刀残页</hio></span>\n<span cmd='look3 4 of fb_28'><hio>血刀</hio></span>\n<span cmd='look3 5 of fb_28'><hio>龙血斗篷</hio></span>",
    diffs: [1, 0, 1],
  },
  {
    index: 29,
    name: "古墓派",
    desc: "古墓派身处终南山下活死人墓中，派中多为女子",
    reward:
      "获得3900点经验，3900点潜能\n掉落或解谜奖励：\n<span cmd='look3 0 of fb_29'><hiy>玉女心经残页</hiy></span>\n<span cmd='look3 1 of fb_29'><hiy>银索金铃残页</hiy></span>\n<span cmd='look3 2 of fb_29'><HIZ>冰魄银针</HIZ></span>\n<span cmd='look3 3 of fb_29'><HIZ>金铃索</HIZ></span>\n<span cmd='look3 4 of fb_29'><hio>黯然销魂掌残页</hio></span>\n<span cmd='look3 5 of fb_29'><hio>玄铁剑法残页</hio></span>\n<span cmd='look3 6 of fb_29'><hio>盘龙簪</hio></span>\n<span cmd='look3 7 of fb_29'><hio>龙骨环</hio></span>",
    diffs: [1, 1, 0],
  },
  {
    index: 30,
    name: "华山论剑",
    desc: "五年一度的华山论剑",
    reward:
      "获得4000点经验，4000点潜能\n掉落或解谜奖励：\n<span cmd='look3 0 of fb_30'><hiy>段家剑残页</hiy></span>\n<span cmd='look3 1 of fb_30'><HIZ>枯木神功残页</HIZ></span>\n<span cmd='look3 2 of fb_30'><hic>天南步残页</hic></span>\n<span cmd='look3 3 of fb_30'><hig>金雁功残页</hig></span>\n<span cmd='look3 4 of fb_30'><hiy>全真剑法残页</hiy></span>\n<span cmd='look3 5 of fb_30'><hic>蟾蜍步法残页</hic></span>\n<span cmd='look3 6 of fb_30'><hiy>暗影浮香残页</hiy></span>\n<span cmd='look3 7 of fb_30'><hic>碧波神功残页</hic></span>\n<span cmd='look3 8 of fb_30'><hiy>落英神剑残页</hiy></span>\n<span cmd='look3 9 of fb_30'><HIZ>蛤蟆功残页</HIZ></span>\n<span cmd='look3 10 of fb_30'><HIZ>灵蛇杖法残页</HIZ></span>\n<span cmd='look3 11 of fb_30'><HIZ>弹指神通残页</HIZ></span>\n<span cmd='look3 12 of fb_30'><HIZ>一阳指残页</HIZ></span>\n<span cmd='look3 13 of fb_30'><HIZ>灵蛇杖</HIZ></span>\n<span cmd='look3 14 of fb_30'><HIZ>玉箫</HIZ></span>\n<span cmd='look3 15 of fb_30'><HIZ>玉竹杖</HIZ></span>\n<span cmd='look3 16 of fb_30'><hio>九阴神功残页</hio></span>\n<span cmd='look3 17 of fb_30'><hio>天龙鞶</hio></span>",
    diffs: [1, 0, 0],
  },
  {
    index: 31,
    name: "侠客岛",
    desc: "一处神秘的小岛，因为神秘的石壁武功而名声大震。据说里面存有各大门派失传的武功。",
    reward:
      "获得4100点经验，4100点潜能\n掉落或解谜奖励：\n<span cmd='look3 0 of fb_31'><HIZ>玄虚步残页</HIZ></span>\n<span cmd='look3 1 of fb_31'><hio>太玄功残页</hio></span>\n<span cmd='look3 2 of fb_31'><hio>天龙逐日靴</hio></span>\n<span cmd='look3 3 of fb_31'><hio>逆鳞手环</hio></span>",
    diffs: [1, 0, 1],
  },
  {
    index: 32,
    name: "净念禅宗",
    desc: "传说中的武林圣地之一，罕有传人行走江湖，专注於天人之道的研究。",
    reward:
      "获得4200点经验，4200点潜能\n掉落或解谜奖励：\n<span cmd='look3 0 of fb_32'><hio>无念禅功残页</hio></span>\n<span cmd='look3 1 of fb_32'><hio>伏魔杖残页</hio></span>\n<span cmd='look3 2 of fb_32'><hio>如来神掌残页</hio></span>\n<span cmd='look3 3 of fb_32'><hio>邪帝舍利</hio></span>\n<span cmd='look3 4 of fb_32'><hio>金刚伏魔杖</hio></span>\n<span cmd='look3 5 of fb_32'><ord>长生诀残页</ord></span>",
    diffs: [1, 1, 0],
  },
  {
    index: 33,
    name: "慈航静斋",
    desc: "传说中的武林圣地之一，门下传人多为女子，武功以剑诀为主，神秘莫测。",
    reward:
      "获得4300点经验，4300点潜能\n掉落或解谜奖励：\n<span cmd='look3 0 of fb_33'><HIZ>彼岸剑法残页</HIZ></span>\n<span cmd='look3 1 of fb_33'><hio>灵犀步残页</hio></span>\n<span cmd='look3 2 of fb_33'><hio>飞翼剑</hio></span>\n<span cmd='look3 3 of fb_33'><hio>彼岸花</hio></span>\n<span cmd='look3 4 of fb_33'><ord>慈航剑典残页</ord></span>",
    diffs: [1, 1, 0],
  },
  {
    index: 34,
    name: "阴阳谷",
    desc: "绝情谷底的一处神秘所在，一半是万年玄冰，冰冷刺骨，一半是不灭地火，焚金裂石",
    reward:
      "获得4400点经验，4400点潜能\n掉落或解谜奖励：\n<span cmd='look3 0 of fb_34'><hig>玄晶</hig></span>\n<span cmd='look3 1 of fb_34'><hio>破军</hio></span>\n<span cmd='look3 2 of fb_34'><hio>贪狼</hio></span>\n<span cmd='look3 3 of fb_34'><hio>七杀</hio></span>\n<span cmd='look3 4 of fb_34'><hio>紫薇</hio></span>\n<span cmd='look3 5 of fb_34'><hio>阴阳环</hio></span>\n<span cmd='look3 6 of fb_34'><ord>阴阳九转残页</ord></span>",
    diffs: [1, 0, 1],
  },
  {
    index: 35,
    name: "战神殿",
    desc: "一处神秘的宫殿，据说入口会随着时间而变动，里面隐藏着武道极致的奥秘，得之更能触及天地之秘。",
    reward:
      "获得4500点经验，4500点潜能\n掉落或解谜奖励：\n<span cmd='look3 0 of fb_35'><hio>魔龙战甲</hio></span>\n<span cmd='look3 1 of fb_35'><hio>金狴骨冠</hio></span>\n<span cmd='look3 2 of fb_35'><hio>木凤羽靴</hio></span>\n<span cmd='look3 3 of fb_35'><hio>火猊斗篷</hio></span>\n<span cmd='look3 4 of fb_35'><ord>神器碎片</ord></span>\n<span cmd='look3 5 of fb_35'><ord>战神图录残页</ord></span>",
    diffs: [1, 1, 0],
  },
];

export const FB_INFO: Record<string, FbInfo> = {
  lw: {
    index: 0,
    name: "树林",
    desc: "扬州东城外的一处山坳，被一群狼占领着，有些不知情的人误闯到这里就再也回不去了，据说丢下不少金银财宝。",
    reward:
      "获得1000点经验，1000点潜能\n掉落或解谜奖励：\n<span cmd='look3 0 of fb_0'><wht>动物皮毛</wht></span>\n<span cmd='look3 1 of fb_0'><wht>布衣</wht></span>\n<span cmd='look3 2 of fb_0'><wht>钢刀</wht></span>\n<span cmd='look3 3 of fb_0'><wht>铁戒指</wht></span>\n<span cmd='look3 4 of fb_0'><wht>铁棍</wht></span>\n<span cmd='look3 5 of fb_0'><wht>铁剑</wht></span>\n<span cmd='look3 6 of fb_0'><wht>英雄巾</wht></span>\n<span cmd='look3 7 of fb_0'><wht>布鞋</wht></span>\n<span cmd='look3 8 of fb_0'><hig>短衣劲装</hig></span>\n<span cmd='look3 9 of fb_0'><wht>基本轻功秘籍</wht></span>",
    diffs: [1, 0, 0],
  },
  cuifu: {
    index: 1,
    name: "财主家",
    desc: "扬州城的一个土财主家，养了几个看家护院，在本地是横行霸道。",
    reward:
      "获得1100点经验，1100点潜能\n掉落或解谜奖励：\n<span cmd='look3 0 of fb_1'><wht>家丁服</wht></span>\n<span cmd='look3 1 of fb_1'><wht>家丁鞋</wht></span>\n<span cmd='look3 2 of fb_1'><wht>东厢钥匙</wht></span>\n<span cmd='look3 3 of fb_1'><hic>崔莺莺的手镯</hic></span>\n<span cmd='look3 4 of fb_1'><hig>崔员外的戒指</hig></span>\n<span cmd='look3 5 of fb_1'><hic>小箱子</hic></span>\n<span cmd='look3 6 of fb_1'><wht>基本拳脚秘籍</wht></span>\n<span cmd='look3 7 of fb_1'><wht>基本招架秘籍</wht></span>\n<span cmd='look3 8 of fb_1'><wht>基本轻功秘籍</wht></span>",
    diffs: [1, 1, 0],
  },
  lmw: {
    index: 2,
    name: "流氓巷",
    desc: "扬州城北的一条老街道，被一群大小流氓整天占着，去那里行侠仗义是个不错的主意。",
    reward:
      "获得1200点经验，1200点潜能\n掉落或解谜奖励：\n<span cmd='look3 0 of fb_2'><hig>流氓巾</hig></span>\n<span cmd='look3 1 of fb_2'><hig>流氓衣</hig></span>\n<span cmd='look3 2 of fb_2'><hig>流氓鞋</hig></span>\n<span cmd='look3 3 of fb_2'><hig>流氓护腕</hig></span>\n<span cmd='look3 4 of fb_2'><hig>流氓短剑</hig></span>\n<span cmd='look3 5 of fb_2'><hig>流氓闷棍</hig></span>\n<span cmd='look3 6 of fb_2'><hig>千斤拳</hig></span>\n<span cmd='look3 7 of fb_2'><wht>基本内功秘籍</wht></span>\n<span cmd='look3 8 of fb_2'><wht>基本拳脚秘籍</wht></span>\n<span cmd='look3 9 of fb_2'><hig>太祖长拳残页</hig></span>\n<span cmd='look3 10 of fb_2'><wht>基本招架秘籍</wht></span>\n<span cmd='look3 11 of fb_2'><wht>基本轻功秘籍</wht></span>",
    diffs: [1, 0, 1],
  },
  lcy: {
    index: 3,
    name: "丽春院",
    desc: "扬州城的丽春院是天下闻名，据说最近朝廷在追捕的几个逃犯在这里出现过，要不要去试试运气。",
    reward:
      "获得1300点经验，1300点潜能\n掉落或解谜奖励：\n<span cmd='look3 0 of fb_3'><wht>基本刀法秘籍</wht></span>\n<span cmd='look3 1 of fb_3'><hig>五虎断门刀秘籍</hig></span>\n<span cmd='look3 2 of fb_3'><hig>五虎断门刀残页</hig></span>\n<span cmd='look3 3 of fb_3'><wht>基本鞭法秘籍</wht></span>\n<span cmd='look3 4 of fb_3'><hig>云龙鞭法残页</hig></span>\n<span cmd='look3 5 of fb_3'><hic>黑龙鞭</hic></span>\n<span cmd='look3 6 of fb_3'><hig>黑虎单刀</hig></span>\n<span cmd='look3 7 of fb_3'><hig>官服</hig></span>\n<span cmd='look3 8 of fb_3'><hig>韦春芳的项链</hig></span>",
    diffs: [1, 0, 0],
  },
  by: {
    index: 4,
    name: "兵营",
    desc: "这是扬州城兵营，扬州守备史青山就驻扎在这里",
    reward:
      "获得1400点经验，1400点潜能\n掉落或解谜奖励：\n<span cmd='look3 0 of fb_4'><wht>基本刀法秘籍</wht></span>\n<span cmd='look3 1 of fb_4'><wht>基本剑法秘籍</wht></span>\n<span cmd='look3 2 of fb_4'><hic>将军剑</hic></span>\n<span cmd='look3 3 of fb_4'><hig>军刀</hig></span>\n<span cmd='look3 4 of fb_4'><hig>军服</hig></span>\n<span cmd='look3 5 of fb_4'><hig>齐眉棍</hig></span>\n<span cmd='look3 6 of fb_4'><hig>官服</hig></span>",
    diffs: [1, 0, 0],
  },
  zhuang: {
    index: 5,
    name: "庄府",
    desc: "因明史一案被抄家灭族的庄府一众妇孺被何惕守救后就藏在这里，想要伺机刺杀鳌拜",
    reward:
      "获得1500点经验，1500点潜能\n掉落或解谜奖励：\n<span cmd='look3 0 of fb_5'><hic>神龙心法残页</hic></span>\n<span cmd='look3 1 of fb_5'><hig>意形步法残页</hig></span>\n<span cmd='look3 2 of fb_5'><hig>神龙剑残页</hig></span>",
    diffs: [1, 0, 0],
  },
  ao: {
    index: 6,
    name: "鳌拜府",
    desc: "满洲第一勇士鳌拜的府邸",
    reward:
      "获得1600点经验，1600点潜能\n掉落或解谜奖励：\n<span cmd='look3 0 of fb_6'><hic>金丝宝甲</hic></span>\n<span cmd='look3 1 of fb_6'><hic>鳌拜匕首</hic></span>\n<span cmd='look3 2 of fb_6'><hig>混元一气残页</hig></span>\n<span cmd='look3 3 of fb_6'><hig>飞檐走壁残页</hig></span>\n<span cmd='look3 4 of fb_6'><hig>伏虎拳残页</hig></span>\n<span cmd='look3 5 of fb_6'><hig>绝门棍残页</hig></span>\n<span cmd='look3 6 of fb_6'><wht>牢房钥匙</wht></span>\n<span cmd='look3 7 of fb_6'><hig>四十二章经</hig></span>",
    diffs: [1, 0, 0],
  },
  tdh: {
    index: 7,
    name: "天地会",
    desc: "天地会在北京城的青木堂所在，据说在入口在一家药铺里面",
    reward:
      "获得1700点经验，1700点潜能\n掉落或解谜奖励：\n<span cmd='look3 0 of fb_7'><hig>密宗心法残页</hig></span>\n<span cmd='look3 1 of fb_7'><hig>密宗大手印残页</hig></span>\n<span cmd='look3 2 of fb_7'><hig>猴拳残页</hig></span>\n<span cmd='look3 3 of fb_7'><hic>云龙剑残页</hic></span>\n<span cmd='look3 4 of fb_7'><hig>云龙身法残页</hig></span>\n<span cmd='look3 5 of fb_7'><hig>云龙心法残页</hig></span>\n<span cmd='look3 6 of fb_7'><hic>神形百变残页</hic></span>\n<span cmd='look3 7 of fb_7'><hig>秋风拂尘残页</hig></span>\n<span cmd='look3 8 of fb_7'><hic>云龙剑</hic></span>",
    diffs: [1, 0, 0],
  },
};
