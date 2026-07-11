import Util from './utils/util.js';

const MessageQueue = {
    size: 3,
    max: 666,
    container: null,
    pages: null,
    count: 0,
    allow_scroll: true,
    create: function (elem, size = 3, max = 666) {
        let queue = Object.create(this);
        queue.container = elem;
        queue.pages = [];
        queue.size = size;
        queue.max = max;

        if (Util.isMobile) {
            elem.on('touchend', this.stopDrag.bind(queue));
        } else {
            elem.on('wheel', this.stopDrag.bind(queue));
        }
        queue.scroll_button = $('<div class="scroll-flag" style="display:none;"><span class="glyphicon glyphicon-chevron-down"></span></div>');
        queue.scroll_button.appendTo(elem);
        queue.scroll_button.on('pointerup', queue.start_move.bind(queue));

        return queue;
    },
    stopDrag: function (e) {
        // 用户手动滚动时立即打断自动平滑动画
        this._cancelScrollAnim();
        let is_end = this.is_end();
        if (is_end === this.allow_scroll) return;
        this.allow_scroll = is_end;
        if (is_end) {
            this.scroll_button.hide();
        }
    },
    start_move: function () {
        this.allow_scroll = true;
        this.scroll_button.hide();
        this.scroll2end();
    },
    push: function (x) {
        this.pushBatch(x);
        this.flushScroll();
    },
    /** 批量追加（仅写入 DOM，不触发滚动） — 配合 flushScroll 使用，避免批处理帧内多次重排 */
    pushBatch: function (x) {
        let queue = this.pages;
        if (!queue.length) {
            queue.push($("<pre></pre>").appendTo(this.container));
        }
        if (this.count > this.max) {
            if (queue.length >= this.size) {
                queue.splice(0, 1)[0].remove();
            }
            this.count = 0;
            queue.push($("<pre></pre>").appendTo(this.container));
        }

        let page = queue[queue.length - 1];
        page.append(x + "\n");
        this.count++;
    },
    /** 批量追加结束后调用一次滚动 — 用 rAF 合并到下一渲染帧 */
    flushScroll: function () {
        if (this._scrollRAF) return;
        this._scrollRAF = requestAnimationFrame(() => {
            this._scrollRAF = 0;
            this.scroll2end();
        });
    },
    /** 取消正在进行的平滑滚动动画（用于用户手动滚动/翻页时打断） */
    _cancelScrollAnim: function () {
        if (this._scrollAnimRAF) {
            cancelAnimationFrame(this._scrollAnimRAF);
            this._scrollAnimRAF = 0;
        }
    },
    pop: function () {
        if (!this.pages.length) return null;
        let lastPage = this.pages[this.pages.length - 1];
        let html = lastPage.html();
        if (!html) {
            lastPage.remove();
            this.pages.pop();
            return this.pop();
        }
        // Page content: "msg1\nmsg2\n...\nlastMsg\n"
        let lastNL = html.lastIndexOf('\n');
        if (lastNL < 0) {
            let popped = html;
            lastPage.remove();
            this.pages.pop();
            this.count = 0;
            return popped;
        }
        // Remove trailing \n to get "msg1\nmsg2\n...\nlastMsg"
        let beforeTrailing = html.substring(0, lastNL);
        // Find \n before lastMsg
        let prevNL = beforeTrailing.lastIndexOf('\n');
        let popped;
        if (prevNL >= 0) {
            // popped = "lastMsg", keep "msg1\nmsg2\n...\n"
            popped = beforeTrailing.substring(prevNL + 1);
            lastPage.html(beforeTrailing.substring(0, prevNL + 1));
        } else {
            // Only one message in page, remove it entirely
            popped = beforeTrailing;
            lastPage.html('');
        }
        this.count = Math.max(0, this.count - 1);
        if (!lastPage.html().trim() && this.pages.length > 1) {
            lastPage.remove();
            this.pages.pop();
        }
        return popped;
    },
    clear: function () {
        for (let item of this.pages) {
            item.remove();
        }
        this.pages.length = 0;
        this.count = 0;
    },
    is_end: function () {
        const elem = this.container[0];
        const scrollHeight = elem.scrollHeight;
        const clientHeight = elem.clientHeight;
        const scrollTop = elem.scrollTop;
        return scrollTop + clientHeight >= scrollHeight - 50;
    },
    scroll2end: function () {
        const elem = this.container[0];
        if (!this.allow_scroll) {
            const scrollHeight = elem.scrollHeight;
            const clientHeight = elem.clientHeight;
            if (scrollHeight < clientHeight) return;
            let rect = this.container[0].getBoundingClientRect();
            return this.scroll_button.show().css('top',
                rect.bottom - this.scroll_button.height() - screenTop);
        }
        // 自定义平滑滚动：基于 rAF 的线性插值
        // 批量消息到达时持续更新目标位置，动画自动延伸，不打断不重置
        const targetTop = elem.scrollHeight - elem.clientHeight;
        if (targetTop <= 0) { elem.scrollTop = 0; return; }
        // 已到位（误差 1px 内）直接吸附
        if (Math.abs(elem.scrollTop - targetTop) <= 1) { elem.scrollTop = targetTop; return; }
        // 距离过大时跳过动画直接吸附（超长消息避免长动画）
        const dist = targetTop - elem.scrollTop;
        if (dist > 2000) { elem.scrollTop = targetTop; return; }
        // 更新目标位置 — 若动画进行中，下次 tick 自然朝新目标插值
        this._scrollTarget = targetTop;
        if (this._scrollAnimRAF) return;
        const dur = 120;
        const startTime = performance.now();
        const startTop = elem.scrollTop;
        const step = (now) => {
            const t = Math.min(1, (now - startTime) / dur);
            // 朝当前 _scrollTarget 插值（目标可能在动画中被更新）
            const curTarget = this._scrollTarget;
            elem.scrollTop = startTop + (curTarget - startTop) * t;
            if (t < 1 && this._scrollTarget === curTarget) {
                this._scrollAnimRAF = requestAnimationFrame(step);
            } else if (t < 1) {
                // 目标更新了，重启动画从当前位置朝新目标
                this._scrollAnimRAF = 0;
                this.scroll2end();
            } else {
                this._scrollAnimRAF = 0;
            }
        };
        this._scrollAnimRAF = requestAnimationFrame(step);
    }
};

export default MessageQueue;
