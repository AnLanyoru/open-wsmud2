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
        const scrollHeight = elem.scrollHeight;
        const clientHeight = elem.clientHeight;
        if (scrollHeight < clientHeight) return;
        if (!this.allow_scroll) {
            let rect = this.container[0].getBoundingClientRect();

            return this.scroll_button.show().css('top',
                rect.bottom - this.scroll_button.height() - screenTop);
        }
        elem.scrollTop = elem.scrollHeight;
    }
};

export default MessageQueue;
