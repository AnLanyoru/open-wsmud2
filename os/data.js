import { WORLD } from "./world.js";
import { FAMILIES } from "./skill/family.js";

const STATS = WORLD.STATS;
const DATA = {
    parties: new Map(),
    PAIMAI: new Map(),
    temp: {},
    exps: [15, 20, 30, 40, 50, 100, 200, 80, 90, 100, 110, 120, 130],

    stone_values: [1000, 5000, 30000, 150000, 1000000, 10000000],
    book_values: [1, 1000, 5000, 10000, 100000, 500000, 2000000],

    /** @param {CHARACTER} me @returns {number} */
    get_exp(me) {
        return me.random(5) + this.exps[me.level];
    },

    on_load(data) {
        WORLD.MESSAGE.load(data);
        this.remove_temp('xy_status');
        this.remove_temp('xy_users');
        this.remove_temp('xy_party');
        STATS.TOPS = STATS.load_tops(data.tops);
        STATS.SCORE = data.score ?? new Array(20).fill({ "name": "无", "score": 0 });
        STATS.EQ_STATS = new Array(11);
        data.eq_stats = data.eq_stats ?? [];
        for (let i = 0; i < 11; i++) {
            STATS.EQ_STATS[i] = data.eq_stats[i] ?? new Array(10).fill({ "score": 0 });
        }
        for (let key of FAMS_TATAS) {
            let tops = data['tops_' + key];
            STATS['tops_' + key] =
                STATS.load_tops(tops, FAMILIES[key].name + "弟子", key);
        }
        const sc_stats = data.score_stats ?? {};
        STATS.SC_STATS = {};
        for (let key of FAMS_TATAS) {
            STATS.SC_STATS[key] = sc_stats[key] ??
                new Array(20).fill({ "name": "无", "score": 0 });
        }

        console.log("全局数据已加载");
    },

    on_save(str) {
        str.push(',tops:', STATS.saveTops(STATS.TOPS));

        str.push(',score:', STATS.saveScore());

        str.push(',messages:', WORLD.MESSAGE.save());
        str.push(',notices:', WORLD.MESSAGE.saveNotice());

        for (let key of FAMS_TATAS) {
            let tops = STATS['tops_' + key];
            if (tops) {
                str.push(',tops_', key, ':', STATS.saveTops(tops));
            }
        }
        str.push(',eq_stats:', JSON.stringify(STATS.EQ_STATS ?? []));

        str.push(',score_stats:', JSON.stringify(STATS.SC_STATS ?? {}));
    },

    /** 创建默认排行榜 */
    create_def_tops() {
        for (let key of FAMS_TATAS) {
            STATS['tops_' + key] = STATS.load_tops(null, FAMILIES[key].name + "弟子");
        }
    },

    /** 创建默认装备统计 */
    create_def_eqs() {
        STATS.EQ_STATS = new Array(11);
        for (let i = 0; i < 11; i++) {
            STATS.EQ_STATS[i] = new Array(10).fill({ "score": 0 });
        }
        STATS.EQ_STATS[0] = STATS.WEAPON;
    },

    /** 创建默认分数统计 */
    create_def_scs() {
        STATS.SC_STATS = {};
        for (let key of FAMS_TATAS) {
            STATS.SC_STATS[key] = new Array(20).fill({ "score": 0 });
        }
    },

    PROPS: {},

    /** @param {USER} me @param {FAMILY} fam */
    reset_famtops(me, fam) {
        me.remove_temp('top_fam_sc');
        me.remove_temp('top_fam');
        let tops = STATS['tops_' + fam.id];
        if (tops) {
            for (let i = 0; i < tops.length; i++) {
                let user = tops[i];
                if (user.userid === me.id) {
                    user.userid = null;
                    user.name = fam.name + "弟子";
                    user.title = null;
                    break;
                }
            }
        }
        tops = STATS.SC_STATS?.[fam.id];
        if (tops) {
            for (let i = 0; i < tops.length; i++) {
                if (tops[i].id === me.id) {
                    tops.splice(i, 1);
                    break;
                }
            }
        }
    },
    /**
     * 保存全局数据
     * @returns {Promise<*>}
     */
    save() {

        const str = ["{"];
        this.save_temp(str);
        this.on_save(str);
        str.push('}');
        return WORLD.DB.saveData(str.join(""));
    },
    /**
     * JSON序列化替换函数
     * @param {string} key
     * @param {*} value
     * @returns {*}
     */
    temp_replacer(key, value) {
        if (value.e) {

        }

        return value;
    },
    /**
     * 保存临时数据
     * @param {string[]} str - 输出数组
     * @returns {void}
     */
    save_temp(str) {
        str.push('temp:', JSON.stringify(this.temp));
    },
    /**
     * 加载全局数据
     * @returns {Promise<void>}
     */
    async load() {
        const data = await WORLD.DB.readData(__PATH.DATA + "data.js");
        this.temp = data?.temp ?? {};
        this.on_load(data ?? {});
    },
    /**
     * 查询临时数据
     * @param {string} name - 键名
     * @param {*} [def] - 默认值
     * @returns {*}
     */
    query_temp(name, def) {
        if (!this.temp) return;
        const item = this.temp[name];
        if (item && item.e) {
            if (Date.now() <= item.e) {
                return item.v;
            }
            delete this.temp[name];
            return def;
        }
        return item || def;
    },
    /**
     * 设置临时数据
     * @param {string} name - 键名
     * @param {*} value - 值
     * @param {number} [time] - 有效期(毫秒)
     * @returns {void}
     */
    set_temp(name, value, time) {
        if (!this.temp) this.temp = {};
        if (time) {
            this.temp[name] = {
                v: value,
                e: Date.now() + time
            };
        } else {
            this.temp[name] = value;
        }
    },
    /**
     * 移除临时数据
     * @param {string} name
     * @returns {void}
     */
    remove_temp(name) {
        if (!this.temp) return;
        this.temp[name] = null;
    },

    /**
     * 累加临时数据
     * @param {string} name - 键名
     * @param {number} value - 累加值
     * @param {number} [time] - 有效期(毫秒)
     * @returns {number} 累加后的值
     */
    add_temp(name, value, time) {
        if (!this.temp) this.temp = {};
        const old = this.temp[name];
        if (time) {
            if (old && old.e) {
                time = Date.now() + time;
                if (old.e < Date.now()) {
                    old.e = time;
                    old.v = value;
                } else {
                    if (old.e < time) old.e = time;
                    old.v += value;
                }
                return old.v;
            } else {
                const v = value + (old || 0);
                this.temp[name] = {
                    v: v,
                    e: Date.now() + time
                };
                return v;
            }
        } else {
            const v = value + (old || 0);
            this.temp[name] = v;
            return v;
        }
    },
    /**
     * 统计用临时数据存储
     * @type {Object<string, Object<string, {name: string, value: number}>>}
     */
    temp_data: {},
    /**
     * 清除统计数据
     * @returns {void}
     */
    clear_data() {
        this.temp_data = {};
    },
    /**
     * 添加统计数据
     * @param {string} key - 类别
     * @param {USER} user - 用户对象
     * @param {number} val - 累加值
     * @returns {void}
     */
    add_data(key, user, val) {
        if (!val) return;
        let data = this.temp_data[key];
        if (!data) data = this.temp_data[key] = {};
        let user_data = data[user.id];
        if (!user_data) user_data = data[user.id] = { name: user.name, value: 0 };
        user_data.value += val;
    },
    /**
     * 查询最大值
     * @param {string} key
     * @returns {{name: string, value: number}|undefined}
     */
    query_max_data(key) {
        const data = this.temp_data[key];
        if (!data) return;
        let userData = null;
        for (let key in data) {
            const item = data[key];
            if (!userData) userData = item;
            else if (item.value > userData.value) {
                userData = item;
            }
        }
        return userData;
    },
    /**
     * 查询最小值
     * @param {string} key
     * @returns {{name: string, value: number}|undefined}
     */
    query_min_data(key) {
        const data = this.temp_data[key];
        if (!data) return;
        let userData = null;
        for (let key in data) {
            const item = data[key];
            if (!userData) userData = item;
            else if (item.value < userData.value) {
                userData = item;
            }
        }
        return userData;
    }
};

const FAMS_TATAS = ['WUDANG', 'HUASHAN', 'SHAOLIN',
    'EMEI', 'GAIBANG', 'XIAOYAO', 'SHASHOU', 'NONE'];

export default DATA;
