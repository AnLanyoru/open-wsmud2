export class Page {
    constructor(filePath) {
        this._filePath = filePath;
        this.$children = null;
        this.$parent = null;
        this.$el = null;
        this.id = null;
        this.template = '';
        this.css = '';
    }

    filePath() {
        return this._filePath;
    }

    mount(parent, options) {
        const tpl = document.createElement('template');
        tpl.innerHTML = this.render(options);
        parent.append(tpl.content);
        this.$el = parent.lastElementChild;
        if (this.on_mount) this.on_mount(this.$el);
        if (this.$children) {
            this.$children.forEach(com => {
                if (com.on_mount) com.on_mount(com.id ? document.getElementById(com.id) : this.$el);
            });
        }
    }

    render(options) {
        return this.template;
    }

    _injectStyle() {
        if (!this.css || this._style_dom) return;
        const style = document.createElement('style');
        style.textContent = this.css;
        document.head.append(style);
        this._style_dom = style;
    }

    unmount() {
        if (this.$el) this.$el.remove();
        this.$el = null;
        if (this.on_unmount) this.on_unmount();
        if (this.$children) this.$children.forEach(com => { if (com.on_unmount) com.on_unmount(); });
        if (this.$parent && this.$parent.$children) {
            this.$parent.$children = this.$parent.$children.filter(com => com !== this);
        }
        this.$parent = null;
        this.$children = null;
    }

    destroy() {
        if (this.on_destroy) this.on_destroy();
        if (this._style_dom) this._style_dom.remove();
    }

    insert(options) {
        if (!options) throw new Error('选项不能为空');
        if (typeof options === 'string') options = { url: options };
        const ComClass = options.Class;
        if (!ComClass) throw new Error(`组件类不存在`);
        const com = new ComClass();
        if (!this.$children) this.$children = [];
        this.$children.push(com);
        com.$parent = this;
        if (options.id) {
            this['$' + options.id] = com;
            com.id = options.id;
        }
        return com.render(options);
    }

    onCompile() {
        this._injectStyle();
    }
}

export function EventsMixin(target) {
    target.prototype.handlers = Object.create(null);
    target.prototype.on = function (type, func, ctx) {
        return this._addListener(type, func, ctx, false);
    };
    target.prototype.once = function (type, func, ctx) {
        return this._addListener(type, func, ctx, true);
    };
    target.prototype._addListener = function (type, func, ctx, once) {
        if (typeof func !== 'function') {
            console.warn('事件注册失败：回调必须是函数');
            return this;
        }
        if (!this.handlers[type]) {
            this.handlers[type] = { listeners: [], cache: [] };
        }
        const handler = this.handlers[type];
        handler.listeners.push({ fn: func, ctx, once });
        if (handler.cache.length) {
            handler.cache.forEach(data => this._runListeners(handler, data));
            handler.cache = [];
        }
        return this;
    };
    target.prototype.emit = function (type, data, delay = true, clear = false) {
        const handler = this.handlers[type];
        if (!handler) {
            if (delay) this.handlers[type] = { listeners: [], cache: [data] };
            return this;
        }
        if (!handler.listeners.length) {
            if (delay) handler.cache.push(data);
            return this;
        }
        this._runListeners(handler, data);
        if (clear) delete this.handlers[type];
        return this;
    };
    target.prototype._runListeners = function (handler, data) {
        for (let i = handler.listeners.length - 1; i >= 0; i--) {
            const { fn, ctx, once } = handler.listeners[i];
            if (fn.call(ctx, data) === false || once) handler.listeners.splice(i, 1);
        }
    };
    target.prototype.off = function (type, func) {
        const handler = this.handlers[type];
        if (!handler) return this;
        if (typeof func !== 'function') {
            delete this.handlers[type];
            return this;
        }
        handler.listeners = handler.listeners.filter(item => item.fn !== func);
        if (!handler.listeners.length) delete this.handlers[type];
        return this;
    };
    target.prototype.removeAll = function (type) {
        if (type) delete this.handlers[type];
        else this.handlers = Object.create(null);
        return this;
    };
}
