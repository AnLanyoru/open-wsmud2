/**
 * CHARACTER 通用/显示 方法扩展
 */
require("./character");

/** @type {string[]} 等级称号 */
const level_descs = ["普通百姓", "武士", "武师", "宗师", "武圣", "武帝", "武神"];
/** @type {string[]} 等级颜色 */
const level_color = ["", "wht", "hig", "hiy", "hiz", "hio", "ord"];

Object.assign(CHARACTER.prototype, {
    /**
     * 获取等级描述(含颜色)
     * @returns {string}
     */
    get_level_desc() {
        if (!this.level) return level_descs[this.level];
        const cc = level_color[this.level];
        return "<" + cc + ">" + level_descs[this.level] + "</" + cc + ">";
    },

    /**
     * 获取等级颜色
     * @returns {string}
     */
    get_level_color() {
        return level_color[this.level];
    },

    /**
     * 完整显示名称
     * @returns {string}
     */
    long_name() {

        if (this.title) return this.title + " " + this.name;
        return this.name;

    },

    /**
     * 查询称号
     * @returns {string|undefined}
     */
    query_title() {
        return this.title;
    },

    /**
     * 查询年龄
     * @returns {number}
     */
    query_age() {
        return this.age;
    },

    /**
     * 门派称谓
     * @param {boolean} [isbad]
     * @returns {string}
     */
    call(isbad) {
        return this.family.call(this, isbad);
    },

    /**
     * 自称
     * @param {boolean} [isbad]
     * @returns {string}
     */
    callme(isbad) {
        return this.family.call_me(this);
    },

    /**
     * 同门师兄弟姐妹称谓
     * @param {CHARACTER} target
     * @returns {string}
     */
    fam_call(target) {
        const age1 = target.query_age();
        const age2 = this.query_age();
        if (age1 < age2) {
            return this.gender === 1 ? "师兄" : "师姐";
        }
        return this.gender === 1 ? "师弟" : "师妹";
    },

    /**
     * 第三人称代称
     * @returns {string}
     */
    call3() {
        return this.gender == 1 ? "他" : "她";
    },

    /**
     * 是否隐藏
     * @returns {boolean}
     */
    is_hidden() {
        return this.hp <= 0 || this.query_temp('hidden');
    },

    /**
     * 是否是队友
     * @param {CHARACTER} p
     * @returns {boolean}
     */
    is_team(p) {
        if (!p) return false;
        if (p.team)
            return this.team == p.team;
        return this.family == p.family;
    },

    /**
     * 向队伍发送消息
     * @param {string} msg
     * @param {boolean} [nome] - 是否排除自己
     */
    send_team(msg, nome) {
        if (!this.team) return this.send(msg);
        for (let i = 0; i < this.team.length; i++) {
            if (nome && this.team[i] == this) continue;
            this.team[i].send(msg);
        }
    },

    /**
     * 查询队伍ID
     * @returns {string|null}
     */
    query_teamid() {
        if (this.follow_target) return this.follow_target.query_teamid();
        return null;
    },

    /**
     * 查询状态JSON
     * @returns {string}
     */
    query_status() {
        const ary = ["{type:\"status\",hp:"];
        ary.push(this.hp);
        ary.push(",max_hp:");
        ary.push(this.max_hp);
        ary.push(",mp:");
        ary.push(this.mp);
        ary.push(",max_mp:");
        ary.push(this.max_mp);
        ary.push(",name:\"");
        ary.push(this.name);
        ary.push("\",id:\"");
        ary.push(this.id);
        ary.push("\"}");
        return ary.join("");
    },

    /**
     * 查询操作命令(默认空实现)
     */
    query_commands() {

    },

    /**
     * 查询外观描述
     * @param {CHARACTER} me - 观察者
     * @param {string} [eqcmd] - 查看装备命令
     * @returns {string}
     */
    query_desc(me, eqcmd) {
        const str = [];
        str.push(this.long_name());
        str.push("\n");
        const call3 = this == me ? "你" : this.call3();
        str.push(call3, "看起来约", get_agestr(this.query_age()), "岁。\n");
        str.push(call3, "长得", get_perdesc(this), "。\n");
        str.push(call3, get_skill_desc(this.query_skill(this.attack_skill.id)), "。\n");
        str.push(call3, get_status(this), "\n");
        this.format_equipments(call3, str, eqcmd);
        return str.join("");
    },

    /**
     * 格式化装备显示
     * @param {string} call3 - 第三人称代词
     * @param {string[]} str - 输出数组
     * @param {string} [eqcmd]
     */
    format_equipments(call3, str, eqcmd) {
        if (this.query_setting("hide_equip")) {
            return str.push("看样子", call3, "不想让别人看自己的装备。");
        } else if (this.equipment && this.equipment.length) {
            const eqstr = [];
            for (let i = 0; i < this.equipment.length; i++) {
                const item = this.equipment[i];
                if (!item) continue;
                eqstr.push("<span cmd='", eqcmd || "look", " ", (i),
                    " of ", this.id, "'>◆", item.color_name, "</span>\n");
            }
            if (eqstr.length) {
                return str.push(call3, "装备着：\n", eqstr.join(""));
            }
        }
        str.push(call3, "光着身子，什么都没穿。\n");
    },
});

/**
 * 获取容貌描述
 * @param {CHARACTER} obj
 * @returns {string}
 */
function get_perdesc(obj) {
    const ary = obj.gender === 1 ? boy_pers : girl_pers;
    let per = obj.per + obj.query_prop("per");
    let index = parseInt(per / 2);
    if (index < 0) index = 0;
    if (index >= ary.length) index = ary.length - 1;
    return ary[index];
}

/**
 * 获取年龄段描述
 * @param {number} age
 * @returns {string}
 */
function get_agestr(age) {
    let index = parseInt((age || 10) / 10);
    if (index >= age_strs.length) index = age_strs.length - 1;
    return age_strs[index];
}

/**
 * 获取武功等级描述
 * @param {number} level
 * @returns {string}
 */
function get_skill_desc(level) {
    if (!level) return "看上去似乎不会任何武功。";

    if (level < 1000)
        return "的武功看上去似乎" + skill_levels[parseInt(level / 50)];
    let v = parseInt((level - 1000) / 500);
    if (v > 6) v = 6;
    return "的武功看上去似乎" + skill_levels[v + 20];
}

/**
 * 获取气血状态描述
 * @param {CHARACTER} obj
 * @returns {string}
 */
function get_status(obj) {
    let p = parseInt(obj.hp * 10 / obj.max_hp);
    if (p < 0) p = 0;
    if (p >= Look_status.length) p = Look_status.length - 1;
    return Look_status[p];
}

/** @type {string[]} 男性容貌描述 */
const boy_pers = [
    "<BLU>眉歪眼斜，瘌头癣脚，不象人样</BLU>",
    "<BLU>呲牙咧嘴，黑如锅底，奇丑无比</BLU>",
    "<BLU>面如桔皮，头肿如猪，让人不想再看第二眼</BLU>",
    "<HIB>贼眉鼠眼，身高三尺，宛若猴状</HIB>",
    "<HIB>肥头大耳，腹圆如鼓，手脚短粗，令人发笑</HIB>",
    "<NOR>面颊凹陷，瘦骨伶仃，可怜可叹</NOR>",
    "<NOR>傻头傻脑，痴痴憨憨，看来倒也老实</NOR>",
    "<NOR>相貌平平，不会给人留下什么印象</NOR>",
    "<YEL>膀大腰圆，满脸横肉，恶形恶相</YEL>",
    "<YEL>腰圆背厚，面阔口方，骨格不凡</YEL>",
    "<RED>眉目清秀，端正大方，一表人才</RED>",
    "<RED>双眼光华莹润，透出摄人心魄的光芒</RED>",
    "<HIY>举动如行云游水，独蕴风情，吸引所有异性目光</HIY>",
    "<HIY>双目如星，眉梢传情，所见者无不为之心动</HIY>",
    "<HIR>粉面朱唇，身姿俊俏，举止风流无限</HIR>",
    "<HIR>丰神如玉，目似朗星，令人过目难忘</HIR>",
    "<MAG>面如美玉，粉妆玉琢，俊美不凡</MAG>",
    "<MAG>飘逸出尘，潇洒绝伦</MAG>",
    "<MAG>丰神俊朗，长身玉立，宛如玉树临风</MAG>",
    "<HIM>神清气爽，骨格清奇，宛若仙人</HIM>",
    "<HIM>一派神人气度，仙风道骨，举止出尘</HIM>"
];

/** @type {string[]} 女性容貌描述 */
const girl_pers = [
    "<BLU>丑如无盐，状如夜叉</BLU>",
    "<BLU>歪鼻斜眼，脸色灰败，直如鬼怪一般</BLU>",
    "<BLU>八字眉，三角眼，鸡皮黄发，让人一见就想吐</BLU>",
    "<HIB>眼小如豆，眉毛稀疏，手如猴爪，不成人样</HIB>",
    "<HIB>一嘴大暴牙，让人一看就没好感</HIB>",
    "<NOR>满脸疙瘩，皮色粗黑，丑陋不堪</NOR>",
    "<NOR>干黄枯瘦，脸色腊黄，毫无女人味</NOR>",
    "<YEL>身材瘦小，肌肤无光，两眼无神</YEL>",
    "<YEL>虽不标致，倒也白净，有些动人之处</YEL>",
    "<RED>肌肤微丰，雅淡温宛，清新可人</RED>",
    "<RED>鲜艳妍媚，肌肤莹透，引人遐思</RED>",
    "<HIR>娇小玲珑，宛如飞燕再世，楚楚动人</HIR>",
    "<HIR>腮凝新荔，肌肤胜雪，目若秋水</HIR>",
    "<HIW>粉嫩白至，如芍药笼烟，雾里看花</HIW>",
    "<HIW>丰胸细腰，妖娆多姿，让人一看就心跳不已</HIW>",
    "<MAG>娇若春花，媚如秋月，真的能沉鱼落雁</MAG>",
    "<MAG>眉目如画，肌肤胜雪，真可谓闭月羞花</MAG>",
    "<MAG>气质美如兰，才华馥比山，令人见之忘俗</MAG>",
    "<HIM>灿若明霞，宝润如玉，恍如神妃仙子</HIM>",
    "<HIM>美若天仙，不沾一丝烟尘</HIM>",
    "<HIM>宛如<HIW>玉雕冰塑</HIW>，似梦似幻，已不再是凡间人物</HIM>"
];

/** @type {string[]} 气血状态描述 */
const Look_status = [
    "<HIR>受伤过重，已经有如风中残烛，随时都可能断气。</HIR>",
    "<HIR>受伤过重，已经奄奄一息，命在旦夕了。</HIR>",
    "<HIR>伤重之下已经难以支撑，眼看就要倒在地上。</HIR>",
    "<RED>受了相当重的伤，只怕会有生命危险。</RED>",
    "<RED>已经伤痕累累，正在勉力支撑著不倒下去。</RED>",
    "<RED>气息粗重，动作开始散乱，看来所受的伤著实不轻。</RED>",
    "<HIY>受伤不轻，看起来状况并不太好。</HIY>",
    "<HIY>受了几处伤，不过似乎并不碍事。</HIY>",
    "<HIY>看起来可能受了点轻伤。</HIY>",
    "<HIG>似乎受了点轻伤，不过光从外表看不大出来。</HIG>",
    "<HIG>看起来气血充盈，并没有受伤。</HIG>"
];

/** @type {string[]} 年龄段描述 */
const age_strs = ["几", "十多", "二十多", "三十多", "四十多", "五十多", "六十多", "七十多", "八十多", "九十多"
    , "一百多"];

/** @type {string[]} 武功等级描述 */
const skill_levels = [
    "<BLU>初学乍练</BLU>",
    "<BLU>不知所以</BLU>",
    "<HIB>粗通皮毛</HIB>",
    "<HIB>渐有所悟</HIB>",
    "<YEL>半生不熟</YEL>",
    "<YEL>马马虎虎</YEL>",
    "<HIY>平淡无奇</HIY>",
    "<HIY>触类旁通</HIY>",
    "<HIG>心领神会</HIG>",
    "<HIG>挥洒自如</HIG>",
    "<HIC>驾轻就熟</HIC>",
    "<HIC>出类拔萃</HIC>",
    "<CYN>初入佳境</CYN>",
    "<CYN>神乎其技</CYN>",
    "<MAG>威不可当</MAG>",
    "<HIW>豁然贯通</HIW>",
    "<HIW>超群绝伦</HIW>",
    "<RED>登峰造极</RED>",
    "<WHT>登堂入室</WHT>",
    "<HIM>一代宗师</HIM>",
    "<WHT>超凡入圣</WHT>",
    "<HIO>出神入化</HIO>",
    "<HIO>独步天下</HIO>",
    "<HIR>空前绝后</HIR>",
    "<HIR>旷古绝伦</HIR>",
    "<HIW>深不可测</HIW>",
    "<HIW>返璞归真</HIW>"];
