

export const ProxyHost = "/";
export const isMobile = /Android|webOS|iPhone|iPad|iPod/i.test(navigator.userAgent);

export function GetUserCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
}

export function SetCookie(name, value) {
    var d = new Date();
    d.setTime(d.getTime() + (300 * 24 * 60 * 60 * 1000));
    document.cookie = name + "=" + value + "; expires=" + d.toGMTString();
}

export function checkScroll(elem) {
    const parent = elem.parent();
    const parentRect = parent[0].getBoundingClientRect();
    const elemRect = elem[0].getBoundingClientRect();
    const isVisible = (
        elemRect.top >= parentRect.top &&
        elemRect.bottom <= parentRect.bottom
    );
    if (!isVisible) {
        const scrollTop = parent.scrollTop() + (elemRect.bottom - parentRect.bottom);
        parent[0].scrollTop = scrollTop;
    }
}

export const storage = {
    setItem(key, value) {
        try {
            if (!value) return this.removeItem(key);
            let data = value;
            if (typeof value === 'object') data = JSON.stringify(value);
            localStorage.setItem(key, data);
            return true;
        } catch (error) {
            console.error('存储数据失败:', error);
            return false;
        }
    },
    getItem(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            if (!item) {
                return defaultValue;
            }
            if (item[0] === '{' || item[0] === '[')
                return JSON.parse(item);
            return item;
        } catch (error) {
            console.error('获取数据失败:', error);
            return defaultValue;
        }
    },
    removeItem(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('移除数据失败:', error);
            return false;
        }
    },
    clearAll() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('清除所有数据失败:', error);
            return false;
        }
    }
};

export function Json2Str(obj) {
    if (typeof obj == "object") {
        if (obj == undefined || obj == null) return "";
        return JSON.stringify(obj);
    }
    return obj;
}

export function Json2Str2(obj) {
    if (obj == undefined || obj == null) return "";
    return JSON.stringify(obj);
}

export function Date2Str(dt) {
    if (dt.valueOf) {
        return "\/Date(" + dt.valueOf() + ")\/";
    }
    return dt;
}

export function Clone(obj) {
    var newobj = {};
    for (var key in obj) {
        newobj[key] = obj[key];
    }
    return newobj;
}

export function Sleep(time) {
    if (!(time > 0)) time = 1000;
    return new Promise((resolve) => {
        setTimeout(resolve, time);
    });
}

export async function Wait(condtion) {
    while (!condtion()) {
        await Sleep(1);
    }
}

export function Str2Json(s) {
    if (s.substring(0, 1) != "{") {
        s = "{" + s + "}";
    }
    return (new Function("return " + s))();
}

export function Str2Json2(s) {
    return (new Function("return " + s))();
}

export function Str2XML(s) {
    var xmlDoc;
    if (!window.DOMParser) {
        xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async = "false";
        xmlDoc.loadXML(s);
    }
    else {
        var parser = new DOMParser();
        xmlDoc = parser.parseFromString(s, "text/xml");
    }
    return $(xmlDoc.documentElement);
}

export const Settings = {
    MaxUploadFileLength: 1048576 * 30
};

export function encode(str) {
    return encodeURIComponent(str);
}

export const CookieHelper = {
    setCookie: function (name, value, expireMinutes) {
        var ck = name + "=" + escape(value);
        if (expireMinutes) {
            var expireDate = new Date();
            expireDate.setTime(expireDate.getTime() + (expireMinutes * 60 * 1000));
            ck += "; expires=" + expireDate.toGMTString();
        }
        document.cookie = ck;
    },
    getCookie: function (name) {
        if (document.cookie.length > 0) {
            begin = document.cookie.indexOf(name + "=");
            if (begin != -1) {
                begin += name.length + 1;
                end = document.cookie.indexOf(";", begin);
                if (end == -1) {
                    end = document.cookie.length;
                }
                return unescape(document.cookie.substring(begin, end));
            }
        }
        return "";
    },
    delCookie: function (name) {
        if (this.getCookie(name)) {
            var date = new Date();
            date.setYear(1000);
            document.cookie = name + "=" + ";" + date.toGMTString();
        }
    }
};

export const C_STR = "零一二三四五六七八九";
export const C_STR2 = ["", "十", "百", "千", "万", "亿"];
export const C_STR3 = ["", "万", "亿"];

export function to_c(num) {
    if (!num) return "零";
    var str = "";
    var count = 0;
    var add = 0;
    while (num) {
        var d = num % 10;
        if (count) {
            if (count % 4 == 0 && add != 3) {
                str = C_STR3[count / 4] + str;
                add = 3;
            } else if (d && add != 2) {
                str = C_STR2[count % 4] + str;
                add = 2;
            }
        }
        if (d) {
            if (d != 1 || num > 10 || count % 4 != 1)
                str = C_STR[d] + str;
            add = 1;
        } else if (add == 1) {
            str = C_STR[d] + str;
            add = 0;
        }
        num = parseInt(num / 10);
        count++;
    }
    return str;
}

export function moneyToStr(value) {
    if (!value) return "";
    var str = [];
    if (value >= 10000) {
        str.push(parseInt(value / 10000) + "两<hiy>黄金</hiy>");
        value = value % 10000;
    }
    if (value > 100) {
        str.push(parseInt(value / 100) + "两<wht>白银</wht>");
        value = value % 100;
    }
    if (value > 0) {
        str.push(value + "个<yel>铜板</yel>");
    }
    return str.join("");
}

export function Get(url, arg, callback) {
    if (!url) return;

    var args = [];
    if ($.isPlainObject(arg)) {
        for (var key in arg) {
            if (arg[key])
                args.push(key + "=" + encode(Json2Str(arg[key])));
        }
        url = url + "?" + args.join("&");
    } else if (typeof arg === 'function') {
        callback = arg;
    } else if ($.isArray(arg)) {
        for (var i = 0; i < arg.length; i++) {
            args.push(encode(Json2Str(arg[i])));
        }
        url = url + "/" + args.join("/");
    }
    var options = {
        url: ProxyHost + url,
        callBack: callback,
        type: "get"
    };
    return Request(options);
}

export function Post(url, arg, callback) {
    var argStr = JSON.stringify(arg);
    var options = {
        url: ProxyHost + url,
        data: argStr,
        callBack: callback,
        type: "post"
    };
    return Request(options);
}

export async function Request(options) {
    const {
        url,
        data,
        type = 'post',
        callBack,
        dataType = 'json'
    } = options;
    const requestConfig = {
        method: type.toUpperCase(),
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8'
        }
    };
    if (data) requestConfig.body = data;
    const response = await fetch(url, requestConfig);

    if (response.status === 404) {
        throw new Error('404 Not Found');
    }
    const result = dataType === 'json'
        ? await response.json()
        : await response.text();
    callBack(result);
}

export function ToDate() {
    if (arguments.length == 0) {
        return new Date();
    }
    if (arguments.length == 1) {
        var s = arguments[0].split("-");
        return new Date(s[0], parseInt(s[1]) - 1, s[2]);
    } else {
        return new Date(arguments[0], arguments[1], arguments[2]);
    }
}

export function CheckInputs(elem, vals) {
    var inpts = elem.find("input");
    for (var i = 0; i < inpts.length; i++) {
        var v = $(inpts[i]).val();
        var ishas = false;
        if (vals) {
            for (var j = 0; j < vals.length; j++) {
                if (vals[j] == v) {
                    ishas = true;
                    continue;
                }
            }
        }
        if (ishas) {
            $(inpts[i]).prop("checked", true);
        } else {
            $(inpts[i]).removeProp("checked");
        }
    }
}

Array.prototype.Remove = function (o) {
    var len = this.length;
    for (var i = 0; i < len; i++) {
        if (this[i] == o) {
            this.splice(i, 1);
            return this;
        }
    }
    return this;
};

Array.prototype.RemoveAt = function (func) {
    for (var i = 0; i < this.length; i++) {
        if (func(this[i])) {
            this.splice(i, 1);
            i--;
        }
    }
};

Array.prototype.Has = function (o) {
    var len = this.length;
    for (var i = 0; i < len; i++) {
        if (this[i] == o) return true;
    }
    return false;
};

Array.prototype.Map = function (fn) {
    var len = this.length;
    var ary = [];
    for (var i = 0; i < len; i++) {
        var o = fn(this[i]);
        if (o) ary.push(o);
    }
    return ary;
};

Array.prototype.First = function (fn) {
    var len = this.length;
    for (var i = 0; i < len; i++) {
        var o = this[i];
        if (fn(o)) {
            return o;
        }
    }
    return null;
};

Array.prototype.Where = function (fn) {
    var len = this.length;
    var arr = [];
    for (var i = 0; i < len; i++) {
        var o = this[i];
        if (fn(o)) {
            arr.push(o);
        }
    }
    return arr;
};

Date.prototype.AddDays = function (d) {
    this.setDate(this.getDate() + d);
    return this;
};

Date.prototype.AddMonths = function (m) {
    this.setMonth(this.getMonth() + m);
    return this;
};

Date.prototype.ToDateString = function () {
    var m = (this.getMonth() + 1);
    if (m < 10) m = "0" + m;
    var d = this.getDate();
    if (d < 10) d = "0" + d;
    return this.getFullYear() + "-" + m + "-" + d;
};

Date.prototype.AddYears = function (y) {
    this.setFullYear(this.getFullYear() + y);
    return this;
};

export default {
    ProxyHost,
    isMobile,
    GetUserCookie,
    SetCookie,
    checkScroll,
    storage,
    Json2Str,
    Json2Str2,
    Date2Str,
    Clone,
    Sleep,
    Wait,
    Str2Json,
    Str2Json2,
    Str2XML,
    Settings,
    encode,
    CookieHelper,
    C_STR,
    C_STR2,
    C_STR3,
    to_c,
    moneyToStr,
    Get,
    Post,
    Request,
    ToDate,
    CheckInputs
};
