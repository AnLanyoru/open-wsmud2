import { USERTASK } from "../../core/task/playertask.js";
import type { CHARACTER } from "../../core/char/character.js";

/**
 * TestResNode — 测试资源菜单的递归节点类型
 *
 * - 叶子节点: [物品路径, 数量]
 * - 分支节点: { [显示名称: string]: TestResNode }
 */
type TestResNode = [string, number] | { [key: string]: TestResNode };

/** 根节点固定为分支类型 */
type TestResRoot = { [key: string]: TestResNode };

const need_test_objs: TestResRoot = {
    门派装备道具测试: {
        "门派装备兑换券(蓝色)": ["cash/menpaiduihuan#2", 8],
        "门派装备兑换券(黄色)": ["cash/menpaiduihuan#3", 7],
        "高级门派兑换券": {
            "门派装备兑换券(紫色)": ["cash/menpaiduihuan#4", 6],
            "门派装备兑换券(橙色)": ["cash/menpaiduihuan#5", 8],
        },
    },
    神器测试: {
        "崆峒印": ["eq/lv6/kongtongyin", 1],
        "七宝指环": ["eq/lv6/qibaozhihuan", 1],
        "金顶佛光": ["eq/lv6/jindingfoguang", 1],
        "盘古斧": ["eq/lv6/pangufu", 1],
    },
    随从礼包: ["sp/npc#shuang", 10],
    技能传功玉简: {
        "base/ (基本)": {
            "基本拳脚": ["book/fbk#unarmed", 1],
            "基本剑法": ["book/fbk#sword", 1],
            "基本刀法": ["book/fbk#blade", 1],
            "基本杖法": ["book/fbk#staff", 1],
            "基本棍法": ["book/fbk#club", 1],
            "基本鞭法": ["book/fbk#whip", 1],
            "基本暗器": ["book/fbk#throwing", 1],
            "基本内功": ["book/fbk#force", 1],
            "基本轻功": ["book/fbk#dodge", 1],
            "基本招架": ["book/fbk#parry", 1],
            "野兽扑咬": ["book/fbk#bite", 1],
        },
        "unarmed/ (拳脚)": {
            "grade1/ <hig>一级</hig>": {
                "密宗大手印": ["book/fbk#dashouyin", 1],
                "猴拳": ["book/fbk#houquan", 1],
            },
            "grade2/ <hic>二级</hic>": {
                "八卦拳": ["book/fbk#baguaquan", 1],
                "化骨绵掌": ["book/fbk#huagumianzhang", 1],
                "绝情掌": ["book/fbk#jueqingzhang", 1],
                "流云掌": ["book/fbk#liuyunzhang", 1],
                "擒龙手": ["book/fbk#qinlong", 1],
                "泰山拳法": ["book/fbk#taishanquanfa", 1],
                "鹰爪功": ["book/fbk#yingzhuagong", 1],
            },
            "grade3/ <hiy>三级</hiy>": {
                "摧心掌": ["book/fbk#cuixinzhang", 1],
                "大嵩阳神掌": ["book/fbk#dasongyangshenzhang", 1],
                "金蛇游身掌": ["book/fbk#jinshezhang", 1],
                "千蛛万毒手": ["book/fbk#qianzhuwandushou", 1],
                "七伤拳": ["book/fbk#qishangquan", 1],
                "三阴蜈蚣爪": ["book/fbk#sanyinzhua", 1],
                "天长掌法": ["book/fbk#tianchangzhang", 1],
                "玄天指": ["book/fbk#xuantianzhi", 1],
            },
            "grade4/ <HIZ>四级</HIZ>": {
                "参合指": ["book/fbk#canhezhi", 1],
                "蛤蟆功": ["book/fbk#hamagong", 1],
                "空明拳": ["book/fbk#kongmingquan", 1],
                "青囊手": ["book/fbk#qingnangshou", 1],
                "神照经": ["book/fbk#shenzhaojing", 1],
                "弹指神通": ["book/fbk#tanzhishengong", 1],
                "玄冥神掌": ["book/fbk#xuanmingshenzhang", 1],
                "一阳指": ["book/fbk#yiyangzhi", 1],
            },
            "grade5/ <hio>五级</hio>": {
                "黯然销魂掌": ["book/fbk#anranxiaohun", 1],
                "六脉神剑": ["book/fbk#liumaishenjian", 1],
                "日月拳法": ["book/fbk#riyuequan", 1],
                "如来神掌": ["book/fbk#rulaishenzhang", 1],
                "三九玄功": ["book/fbk#sanjiuxuangong", 1],
                "太极拳": ["book/fbk#taijiquan3", 1],
                "真言手印": ["book/fbk#zhenyanshouyin", 1],
            },
            "grade6/ <ord>六级</ord>": {
                "天魔策": ["book/fbk#tianmoce", 1],
            },
        },
        "sword/ (剑法)": {
            "grade1/ <hig>一级</hig>": {
                "神龙剑": ["book/fbk#shenlongjian", 1],
                "唐诗剑法": ["book/fbk#tangshijianfa", 1],
            },
            "grade2/ <hic>二级</hic>": {
                "圣火令法": ["book/fbk#shenghuojianfa", 1],
                "神剑诀": ["book/fbk#shenjianjue", 1],
                "云龙剑": ["book/fbk#yunlongjian", 1],
            },
            "grade3/ <hiy>三级</hiy>": {
                "段家剑": ["book/fbk#duanjiajianfa", 1],
                "恒山剑法": ["book/fbk#hengshanjianfa", 1],
                "衡山五神剑": ["book/fbk#hengshanwushenjian", 1],
                "金蛇剑法": ["book/fbk#jinshejianfa", 1],
                "落英神剑": ["book/fbk#luoyingshenjian", 1],
                "全真剑法": ["book/fbk#quanzhenjianfa", 1],
                "松风剑法": ["book/fbk#songfengjianfa", 1],
                "嵩山剑法": ["book/fbk#songshanjianfa", 1],
                "泰山剑法": ["book/fbk#taishanjianfa", 1],
                "天羽奇剑": ["book/fbk#tianyuqijian", 1],
                "五毒钩法": ["book/fbk#wudugoufa", 1],
                "移风剑法": ["book/fbk#yifengjian", 1],
                "玉女素心剑": ["book/fbk#yunvsuxinjian", 1],
            },
            "grade4/ <HIZ>四级</HIZ>": {
                "彼岸剑法": ["book/fbk#bianjianfa", 1],
                "七弦无形剑": ["book/fbk#qixianwuxingjian", 1],
                "越女剑法": ["book/fbk#yuenvjianfa", 1],
            },
            "grade5/ <hio>五级</hio>": {
                "辟邪剑法": ["book/fbk#bixiejianfa", 1],
                "玄铁剑法": ["book/fbk#xuantiejianfa", 1],
                "御剑术": ["book/fbk#yujianshu", 1],
            },
            "grade6/ <ord>六级</ord>": {
                "覆雨剑法": ["book/fbk#fuyujianfa", 1],
                "魔剑": ["book/fbk#mojian", 1],
            },
        },
        "blade/ (刀法)": {
            "grade1/ <hig>一级</hig>": {
                "五虎断门刀": ["book/fbk#wuhuduanmendao", 1],
            },
            "grade2/ <hic>二级</hic>": {
                "胡家刀法": ["book/fbk#hujiadaofa", 1],
            },
            "grade3/ <hiy>三级</hiy>": {
                "狂风快刀": ["book/fbk#kuangfengkuaidao", 1],
            },
            "grade4/ <HIZ>四级</HIZ>": {
                "圆月弯刀": ["book/fbk#yuanyuewandao", 1],
            },
            "grade5/ <hio>五级</hio>": {
                "血刀": ["book/fbk#xuedao", 1],
            },
            "grade6/ <ord>六级</ord>": {
                "修罗刀": ["book/fbk#xiuluodao", 1],
            },
        },
        "staff/ (杖法)": {
            "grade2/ <hic>二级</hic>": {
                "雷霆斧法": ["book/fbk#leitingfufa", 1],
                "蛇岛奇功": ["book/fbk#shedaoqigong", 1],
                "无常杖": ["book/fbk#wuchangzhang", 1],
            },
            "grade4/ <HIZ>四级</HIZ>": {
                "灵蛇杖法": ["book/fbk#lingshezhangfa", 1],
            },
            "grade5/ <hio>五级</hio>": {
                "伏魔杖": ["book/fbk#fumozhang", 1],
            },
        },
        "club/ (棍法)": {
            "grade1/ <hig>一级</hig>": {
                "绝门棍": ["book/fbk#juemengun", 1],
            },
            "grade2/ <hic>二级</hic>": {
                "八卦棍法": ["book/fbk#baguagun", 1],
            },
            "grade3/ <hiy>三级</hiy>": {
                "蒙古骑枪": ["book/fbk#mengguqiangfa", 1],
                "中平枪法": ["book/fbk#zhongpingqiang", 1],
            },
            "grade4/ <HIZ>四级</HIZ>": {
                "伏魔棍": ["book/fbk#fumogun", 1],
            },
        },
        "whip/ (鞭法)": {
            "grade1/ <hig>一级</hig>": {
                "秋风拂尘": ["book/fbk#qiufengfuchen", 1],
                "云龙鞭法": ["book/fbk#yunlongbian", 1],
            },
            "grade3/ <hiy>三级</hiy>": {
                "银索金铃": ["book/fbk#yinsuojinling", 1],
            },
        },
        "throwing/ (暗器)": {
            "grade2/ <hic>二级</hic>": {
                "飞星术": ["book/fbk#feixingshu", 1],
                "金蛇锥法": ["book/fbk#jinshezhui", 1],
            },
            "grade4/ <HIZ>四级</HIZ>": {
                "子午断魂针": ["book/fbk#ziwuduanhunzhen", 1],
            },
            "grade5/ <hio>五级</hio>": {
                "乾坤一掷": ["book/fbk#qiankunyizhi", 1],
            },
        },
        "force/ (内功)": {
            "grade1/ <hig>一级</hig>": {
                "黑龙心法": ["book/fbk#heilongxinfa", 1],
                "冷月神功": ["book/fbk#lengyueshengong", 1],
                "密宗心法": ["book/fbk#mizongxinfa", 1],
                "云龙心法": ["book/fbk#yunlongxinfa", 1],
            },
            "grade2/ <hic>二级</hic>": {
                "碧波神功": ["book/fbk#biboshengong", 1],
                "蒙古心法": ["book/fbk#mengguxinfa", 1],
                "神龙心法": ["book/fbk#shenlongxinfa", 1],
                "五毒神功": ["book/fbk#wudushengong", 1],
            },
            "grade3/ <hiy>三级</hiy>": {
                "白云心法": ["book/fbk#baiyunxinfa", 1],
                "磐石神功": ["book/fbk#panshishengong", 1],
                "圣火神功": ["book/fbk#shenghuoshengong", 1],
                "玉女心经": ["book/fbk#yunvxinjing", 1],
                "镇岳诀": ["book/fbk#zhenyuejue", 1],
            },
            "grade4/ <HIZ>四级</HIZ>": {
                "寒冰真气": ["book/fbk#hanbingzhenqi", 1],
                "化功大法": ["book/fbk#huagongdafa", 1],
                "枯木神功": ["book/fbk#kumushengong", 1],
                "清心咒": ["book/fbk#qingxinzhou", 1],
                "神农心经": ["book/fbk#shennongxinjing", 1],
                "先天功": ["book/fbk#xiantiangong", 1],
                "吸星大法": ["book/fbk#xixingdafa", 1],
                "血海魔功": ["book/fbk#xuehaimogong", 1],
            },
            "grade5/ <hio>五级</hio>": {
                "不老长春功": ["book/fbk#bahuanggong", 1],
                "大悲赋": ["book/fbk#dabeifu", 1],
                "九阳神功": ["book/fbk#jiuyangshengong", 1],
                "九阴神功": ["book/fbk#jiuyinshengong", 1],
                "龙象般若功": ["book/fbk#longxianggong", 1],
                "太玄功": ["book/fbk#taixuangong", 1],
                "无念禅功": ["book/fbk#wunianchangong", 1],
            },
            "grade6/ <ord>六级</ord>": {
                "北冥神功": ["book/fbk#beimingshengong3", 1],
                "长生诀": ["book/fbk#changshengjue", 1],
                "慈航剑典": ["book/fbk#cihangjiandian", 1],
                "逆天道": ["book/fbk#nitiandao", 1],
                "阴阳九转": ["book/fbk#yinyangjiuzhuan", 1],
                "战神图录": ["book/fbk#zhanshentulu", 1],
            },
        },
        "dodge/ (轻功)": {
            "grade1/ <hig>一级</hig>": {
                "金雁功": ["book/fbk#jinyangong", 1],
                "意形步法": ["book/fbk#yixingbufa", 1],
                "云龙身法": ["book/fbk#yunlongshenfa", 1],
            },
            "grade2/ <hic>二级</hic>": {
                "蟾蜍步法": ["book/fbk#chanchubufa", 1],
                "恒山身法": ["book/fbk#hengshanshenfa", 1],
                "青蝠身法": ["book/fbk#qingfushenfa", 1],
                "身空行": ["book/fbk#shenkongxing", 1],
                "神形百变": ["book/fbk#shenxingbaibian", 1],
                "四象步法": ["book/fbk#sixiangbu", 1],
                "踏歌行": ["book/fbk#tagexing", 1],
                "天南步": ["book/fbk#tiannanbu", 1],
                "摘星功": ["book/fbk#zhaixinggong", 1],
            },
            "grade3/ <hiy>三级</hiy>": {
                "暗影浮香": ["book/fbk#anyingfuxiang", 1],
                "笔翰如流": ["book/fbk#bihanruliu", 1],
                "金蛇游身步": ["book/fbk#jinsheyoushenbu", 1],
                "五毒烟萝步": ["book/fbk#wuduyanluobu", 1],
            },
            "grade4/ <HIZ>四级</HIZ>": {
                "惊鸿步": ["book/fbk#jinghongbu", 1],
                "明玉功": ["book/fbk#mingyugong", 1],
                "玄虚步": ["book/fbk#xuanxubu", 1],
            },
            "grade5/ <hio>五级</hio>": {
                "葵花神功": ["book/fbk#kuihuashengong", 1],
                "灵犀步": ["book/fbk#lingxibu", 1],
                "缩地成寸": ["book/fbk#suodichengcun", 1],
                "诸天化身步": ["book/fbk#zhutianbu3", 1],
            },
        },
        "parry/ (招架)": {
            "grade4/ <HIZ>四级</HIZ>": {
                "披麻泼墨": ["book/fbk#pimapomo", 1],
                "移花接木": ["book/fbk#yihuajiemu", 1],
            },
            "grade5/ <hio>五级</hio>": {
                "斗转星移": ["book/fbk#douzhuanxingyi", 1],
                "乾坤大挪移": ["book/fbk#qiankundanuoyi", 1],
            },
        },
        "emei/ (峨眉)": {
            "峨眉心法": ["book/fbk#emeixinfa", 1],
            "回风拂柳剑": ["book/fbk#huifengjian", 1],
            "金顶绵掌": ["book/fbk#jindingzhang", 1],
            "九阴白骨爪": ["book/fbk#jiuyinbaiguzhao", 1],
            "临济十二庄": ["book/fbk#linjizhuang", 1],
            "倚天剑法": ["book/fbk#yitianjianfa", 1],
            "诸天剑诀": ["book/fbk#yitianjianfa4", 1],
            "诸天化身步": ["book/fbk#zhutianbu", 1],
        },
        "gaibang/ (丐帮)": {
            "太祖长拳": ["book/fbk#taizuchangquan", 1],
            "打狗棒": ["book/fbk#dagoubang", 1],
            "飞檐走壁": ["book/fbk#feiyanzoubi", 1],
            "丐帮心法": ["book/fbk#gaibangxinfa", 1],
            "混天气功": ["book/fbk#huntianqigong", 1],
            "混元天罡": ["book/fbk#huntianqigong2", 1],
            "叫花棒法": ["book/fbk#jiaohuabangfa", 1],
            "降龙十八掌": ["book/fbk#xianglongzhang", 1],
            "降龙掌": ["book/fbk#xianglongzhang4", 1],
            "逍遥游": ["book/fbk#xiaoyaoyou", 1],
        },
        "huashan/ (华山)": {
            "独孤九剑": ["book/fbk#dugujiujian", 1],
            "独孤剑诀": ["book/fbk#dugujiujian4", 1],
            "飞燕回翔": ["book/fbk#feiyanhuixiang", 1],
            "华山剑法": ["book/fbk#huashanjianfa", 1],
            "华山拳法": ["book/fbk#huashanquanfa", 1],
            "华山心法": ["book/fbk#huashanxinfa", 1],
            "狂风快剑": ["book/fbk#kuangfengkuaijian", 1],
            "劈石破玉拳": ["book/fbk#poyuquan", 1],
            "紫霞神功": ["book/fbk#zixiashengong", 1],
        },
        "liushan/ (六扇门)": {
            "飞龙探云手": ["book/fbk#feilongshou", 1],
            "千里追风": ["book/fbk#qianlizhuifeng", 1],
            "双刀流": ["book/fbk#shuangdao", 1],
            "天罡正气": ["book/fbk#tiangangzhengqi", 1],
            "天罗地网": ["book/fbk#tianluodiwang", 1],
            "纵横术": ["book/fbk#zonghengshu", 1],
        },
        "shaolin/ (少林)": {
            "达摩剑": ["book/fbk#damojian", 1],
            "伏虎拳": ["book/fbk#fuhuquan", 1],
            "混元一气": ["book/fbk#hunyuanyiqi", 1],
            "大力金刚拳": ["book/fbk#jingangquan", 1],
            "燃木刀法": ["book/fbk#ranmudao", 1],
            "少林身法": ["book/fbk#shaolinshenfa", 1],
            "一苇渡江": ["book/fbk#shaolinshenfa2", 1],
            "韦陀棍": ["book/fbk#weituogun", 1],
            "易筋经": ["book/fbk#yijinjing", 1],
            "金刚不坏体": ["book/fbk#yijinjing2", 1],
            "金刚不灭体": ["book/fbk#yijinjing4", 1],
            "一指禅": ["book/fbk#yizhichan", 1],
        },
        "shashou/ (杀手楼)": {
            "穿心掌": ["book/fbk#chuanxinzhang", 1],
            "飞刀": ["book/fbk#feidao", 1],
            "漫天花雨": ["book/fbk#mantianhuayu", 1],
            "天谕": ["book/fbk#mantianhuayu4", 1],
            "杀生决": ["book/fbk#shashengjue", 1],
            "杀手步法": ["book/fbk#shashoubufa", 1],
            "杀手心法": ["book/fbk#shashouxinfa", 1],
            "踏雪寻梅": ["book/fbk#taxuexunmei", 1],
        },
        "wudang/ (武当)": {
            "太极剑法": ["book/fbk#taijijian", 1],
            "太极拳": ["book/fbk#taijiquan", 1],
            "太极神功": ["book/fbk#taijishengong", 1],
            "梯云纵": ["book/fbk#tiyunzong", 1],
            "武当长拳": ["book/fbk#wudangchangquan", 1],
            "武当剑法": ["book/fbk#wudangjianfa", 1],
            "武当心法": ["book/fbk#wudangxinfa", 1],
        },
        "wulang/ (无浪)": {
            "潮汐诀": ["book/fbk#chaoxijue", 1],
            "大开山手": ["book/fbk#dakaishanshou", 1],
            "观山诀": ["book/fbk#guanshanjue", 1],
            "临水经": ["book/fbk#linshuijing", 1],
            "太公棍法": ["book/fbk#taigonggunfa", 1],
            "逐浪步": ["book/fbk#zhulangbu", 1],
        },
        "xiaoyao/ (逍遥)": {
            "北冥神功": ["book/fbk#beimingshengong", 1],
            "凌波微步": ["book/fbk#lingboweibu", 1],
            "神游太虚": ["book/fbk#lingboweibu4", 1],
            "天山六阳掌": ["book/fbk#liuyangzhang", 1],
            "如意刀": ["book/fbk#ruyidao", 1],
            "小无相功": ["book/fbk#xiaowuxianggong", 1],
            "逍遥心法": ["book/fbk#xiaoyaoxinfa", 1],
            "天山折梅手": ["book/fbk#zhemeishou", 1],
        },
        "new/ (特殊)": {
            "grade3/ <hiy>三级</hiy>": {
                "带刀傀儡": ["book/fbk#daidaokuilei", 1],
            },
            "grade4/ <HIZ>四级</HIZ>": {
                "火龙攻击": ["book/fbk#huolong", 1],
            },
            "grade6/ <ord>六级</ord>": {
                "神殿守卫": ["book/fbk#shouwei", 1],
                "烛九阴": ["book/fbk#zhujiuyin", 1],
                "太阳烛照": ["book/fbk#zhuzhao", 1],
            },
        },
    },
};

export default class extends USERTASK {
    id = "test_res";
    sort = 99;

    // ============ tr_path_cur 编解码 ============

    /** 解析 "0_2_1" → { path: [0, 2], cur: 1 }，最后一个数字为光标，其余为路径下标 */
    private parsePathCur(raw: string): { path: number[]; cur: number } {
        if (!raw || raw === "") return { path: [], cur: 0 };
        const parts = raw.split("_").map(Number);
        if (parts.length === 0) return { path: [], cur: 0 };
        const cur = parts.pop()!;
        return { path: parts, cur };
    }

    /** 编码 path + cur → "0_2_1" */
    private encodePathCur(path: number[], cur: number): string {
        return [...path, cur].join("_");
    }

    /** 将路径下标解析为键名（用于面包屑展示） */
    private getPathKeys(path: number[]): string[] {
        const keys: string[] = [];
        let node: TestResNode = need_test_objs;
        for (const idx of path) {
            if (!this.isBranch(node)) break;
            const nodeKeys = Object.keys(node);
            if (idx >= nodeKeys.length) break;
            const key = nodeKeys[idx];
            keys.push(key);
            node = node[key];
        }
        return keys;
    }

    // ============ 数据访问 ============

    private getNode(me: CHARACTER): TestResRoot {
        const { path } = this.parsePathCur(me.query_temp("tr_path_cur", "0"));
        let node: TestResNode = need_test_objs;
        for (const idx of path) {
            if (!this.isBranch(node)) break;
            const keys = Object.keys(node);
            if (idx >= keys.length) break;
            const next = node[keys[idx]];
            if (next && this.isBranch(next)) {
                node = next;
            } else {
                break;
            }
        }
        return node as TestResRoot;
    }

    private getCursor(me: CHARACTER): number {
        const node = this.getNode(me);
        const max = Object.keys(node).length;
        if (max === 0) return 0;
        const { cur } = this.parsePathCur(me.query_temp("tr_path_cur", "0"));
        return Math.min(cur, max - 1);
    }

    // ============ 类型守卫 ============

    private isLeaf(value: TestResNode): value is [string, number] {
        return Array.isArray(value) && value.length >= 2;
    }

    private isBranch(value: TestResNode): value is TestResRoot {
        return typeof value === "object" && !Array.isArray(value) && value !== null;
    }

    // ============ UI 查询 ============

    query_title(me: CHARACTER): string | undefined {
        const { path } = this.parsePathCur(me.query_temp("tr_path_cur", "0"));
        const depth = path.length;
        if (depth > 0) {
            return `<hic>测试资源领取</hic> <mem>(第${depth + 1}层)</mem>`;
        }
        return `<hic>测试资源领取</hic>`;
    }

    query_desc(me: CHARACTER): string {
        const { path } = this.parsePathCur(me.query_temp("tr_path_cur", "0"));
        const node = this.getNode(me);
        const keys = Object.keys(node);

        if (keys.length === 0) {
            return "<red>当前菜单无可用项目。</red>";
        }

        const cur = this.getCursor(me);
        const lines: string[] = [];

        // 面包屑导航
        if (path.length > 0) {
            const pathKeys = this.getPathKeys(path);
            const breadcrumb = ["<mem>测试资源领取</mem>", ...pathKeys.map((k) => `<mem>${k}</mem>`)];
            lines.push(breadcrumb.join(" <mem>→</mem> "));
            lines.push("");
        }

        lines.push(`<hic>请选择要领取的物品：</hic> <mem>(${cur + 1}/${keys.length})</mem>`);
        lines.push("");

        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const value: TestResNode = node[key];
            const marker = i === cur ? "<hiy>►</hiy>" : "  ";

            if (this.isLeaf(value)) {
                const [, count] = value;
                lines.push(`${marker} <wht>${key}</wht>  <hiy>x${count}</hiy>`);
            } else if (this.isBranch(value)) {
                const subCount = Object.keys(value).length;
                lines.push(`${marker} <hic>${key}</hic>  <mem>(${subCount}项)</mem>`);
            }
        }

        lines.push("");
        lines.push(`<mem>点击【领取】切换光标，通过下方按钮操作</mem>`);

        return lines.join("<br>");
    }

    query_state(_me: CHARACTER): number | undefined {
        return 2;
    }

    // ============ 命令按钮 ============

    /**
     * 根据当前菜单层级和光标位置发送操作按钮
     * - 光标在叶子节点 → [领取 XXX] 按钮
     * - 光标在分支节点 → [进入 XXX] 按钮
     * - 非根菜单时额外显示 [返回上层] [主菜单]
     */
    private sendMenuButtons(me: CHARACTER): void {
        const { path } = this.parsePathCur(me.query_temp("tr_path_cur", "0"));
        const node = this.getNode(me);
        const keys = Object.keys(node);
        if (keys.length === 0) return;

        const cur = this.getCursor(me);
        const key = keys[cur];
        const value: TestResNode = node[key];
        const args: string[] = [];

        args.push("task test_res fin", "切换选择");
        if (this.isLeaf(value)) {
            args.push("task test_res fin2", `领取 ${key}`);
        } else if (this.isBranch(value)) {
            args.push("task test_res fin2", `进入 ${key}`);
        }

        if (path.length > 0) {
            args.push("task test_res start", "返回上层",
                "task test_res giveup", "主菜单");
        }

        if (args.length > 0) {
            me.send(this.query_desc(me));
            me.send_commands(...args);
        }
    }

    // ============ 生命周期 ============

    on_finish(me: CHARACTER, par?: string): boolean {
        if (!par) {
            // 无参数：切换光标
            const { path } = this.parsePathCur(me.query_temp("tr_path_cur", "0"));
            const node = this.getNode(me);
            const keys = Object.keys(node);
            if (keys.length === 0) {
                me.notify("<red>当前没有可领取的测试资源。</red>");
                return false;
            }
            const cur = this.getCursor(me);
            const next = (cur + 1) % keys.length;
            me.set_temp("tr_path_cur", this.encodePathCur(path, next));
            this.sendMenuButtons(me);
            return true;
        }

        if (par !== "ok") {
            return this.selectByKey(me, par);
        }

        return this.confirmCursor(me);
    }

    start(me: CHARACTER): boolean | void {
        const { path } = this.parsePathCur(me.query_temp("tr_path_cur", "0"));
        if (path.length > 0) {
            path.pop();
            me.set_temp("tr_path_cur", this.encodePathCur(path, 0));
        } else {
            me.set_temp("tr_path_cur", this.encodePathCur([], 0));
        }
        this.sendMenuButtons(me);
    }

    giveup(me: CHARACTER): void {
        me.set_temp("tr_path_cur", "0");
        this.sendMenuButtons(me);
    }

    // ============ 选择逻辑 ============

    private selectByKey(me: CHARACTER, key: string): boolean {
        const node = this.getNode(me);
        const value: TestResNode | undefined = node[key];

        if (value === undefined) {
            me.notify(`<red>没有找到【${key}】，请检查选项名称。</red>`);
            return false;
        }

        return this.applySelection(me, key, value);
    }

    private confirmCursor(me: CHARACTER): boolean {
        const node = this.getNode(me);
        const keys = Object.keys(node);
        if (keys.length === 0) {
            me.notify("<red>当前没有可领取的测试资源。</red>");
            return false;
        }
        const cur = this.getCursor(me);
        const key = keys[cur];
        const value: TestResNode = node[key];

        return this.applySelection(me, key, value);
    }

    private applySelection(me: CHARACTER, key: string, value: TestResNode): boolean {
        if (this.isLeaf(value)) {
            const [objPath, count] = value;
            const { path } = this.parsePathCur(me.query_temp("tr_path_cur", "0"));

            const obj = me.add_obj(objPath, count);
            if (obj) {
                const pathKeys = this.getPathKeys(path);
                const fullPath = [...pathKeys, key].join(" → ");
                me.notify(`<hig>你领取了：${obj.unit_name(count)}。</hig>`);
            } else {
                me.notify(`<red>物品【${objPath}】创建失败，请联系管理员。</red>`);
                return false;
            }
            this.sendMenuButtons(me);
            return true;
        }

        if (this.isBranch(value)) {
            const { path } = this.parsePathCur(me.query_temp("tr_path_cur", "0"));
            const node = this.getNode(me);
            const keys = Object.keys(node);
            const idx = keys.indexOf(key);
            path.push(idx);
            me.set_temp("tr_path_cur", this.encodePathCur(path, 0));
            me.notify(`<hic>进入【${key}】子菜单，共 ${Object.keys(value).length} 项可选。</hic>`);
            this.sendMenuButtons(me);
            return true;
        }

        me.notify(`<red>未知的节点类型。</red>`);
        return false;
    }
}
