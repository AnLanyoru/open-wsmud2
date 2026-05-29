import { WORLD } from "./world.js";

export default {
    parties: new Map(),
    PAIMAI: new Map(),
    temp: {},
    on_load(data) {},
    on_save(str) {},
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
