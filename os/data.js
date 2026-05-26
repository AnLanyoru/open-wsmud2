
module.exports = {
    parties: new Map(),
    PAIMAI: new Map(),
    temp: {},
    save: function () {

        let str = ["{"];
        this.save_temp(str);
        this.on_save(str);
        str.push('}');
        return WORLD.DB.saveData(str.join(""));
    },
    temp_replacer: function (key, value) {
        if (value.e) {

        }

        return value;
    },
    save_temp: function (str) {
        str.push('temp:', JSON.stringify(this.temp));
    },
    load: async function () {
        const data = await WORLD.DB.readData(__PATH.DATA + "data.js");
        this.temp = data.temp ?? {};
        this.on_load(data);
    },
    query_temp: function (name, def) {
        if (!this.temp) return;
        let item = this.temp[name];
        if (item && item.e) {
            if (Date.now() <= item.e) {
                return item.v;
            }
            delete this.temp[name];
            return def;
        }
        return item || def;
    },
    set_temp: function (name, value, time) {
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
    remove_temp: function (name) {
        if (!this.temp) return;
        this.temp[name] = null;
    },

    add_temp: function (name, value, time) {
        if (!this.temp) this.temp = {};
        let old = this.temp[name];
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
                let v = value + (old || 0);
                this.temp[name] = {
                    v: v,
                    e: Date.now() + time
                };
                return v;
            }
        } else {
            let v = value + (old || 0);
            this.temp[name] = v;
            return v;
        }
    },
    temp_data: {},
    clear_data: function () {
        this.temp_data = {};
    }
    ,
    add_data: function (key, user, val) {
        if (!val) return;
        let data = this.temp_data[key];
        if (!data) data = this.temp_data[key] = {};
        let user_data = data[user.id];
        if (!user_data) user_data = data[user.id] = { name: user.name, value: 0 };
        user_data.value += val;
    }, query_max_data: function (key) {
        let data = this.temp_data[key];
        if (!data) return;
        let userData = null;
        for (let key in data) {
            let item = data[key];
            if (!userData) userData = item;
            else if (item.value > userData.value) {
                userData = item;
            }
        }
        return userData;
    }, query_min_data: function (key) {
        let data = this.temp_data[key];
        if (!data) return;
        let userData = null;
        for (let key in data) {
            let item = data[key];
            if (!userData) userData = item;
            else if (item.value < userData.value) {
                userData = item;
            }
        }
        return userData;
    }
};

