
import DialogScore from './score.js';
import DialogMap from './map.js';
import DialogKeys from './keys.js';
import DialogSetting from './setting.js';
import DialogExtend from './extend.js';
import DialogChannel from './channel.js';
import DialogPack from './packet.js';
import DialogSkills from './skills.js';
import DialogTasks from './tasks.js';
import DialogShop from './shop.js';
import DialogMessage from './message.js';
import DialogStats from './stats.js';
import DialogJh from './jh.js';
import DialogRelation from './relation.js';
import DialogTeam from './team.js';
import DialogParty from './party.js';
import DialogTrade from './trade.js';
import DialogEvents from './events.js';
import DialogPm from './paimai.js';
import DialogPack2 from './packet2.js';
import DialogMaster from './master.js';
import DialogList from './list.js';



const Dialog = {
    isShow: false,
    curItem: null,
    score: DialogScore,
    map: DialogMap,
    keys: DialogKeys,
    setting: DialogSetting,
    extend: DialogExtend,
    channel: DialogChannel,
    pack: DialogPack,
    skills: DialogSkills,
    tasks: DialogTasks,
    shop: DialogShop,
    message: DialogMessage,
    stats: DialogStats,
    jh: DialogJh,
    relation: DialogRelation,
    team: DialogTeam,
    party: DialogParty,
    trade: DialogTrade,
    events: DialogEvents,
    pm: DialogPm,
    pack2: DialogPack2,
    master: DialogMaster,
    list: DialogList,

    show: function (name, data) {
        if (!name) return;
        const dialog = this[name];
        if (!dialog) throw new Error('没有' + name);
        if (!dialog.created) {
            dialog.init();
            dialog.created = true;
        }
        if (!data) {
            if (this.isShow && name == this.curItem) return this.hide();
            if (this.curItem && name != this.curItem) {
                Dialog[Dialog.curItem].close && Dialog[Dialog.curItem].close();
                Dialog[Dialog.curItem].isShow = false;
                Dialog.contentElement.empty();
            }
            this.init();
            this.curItem = name;
            dialog.show(data);
            Process.message.scroll2end();
        } else {
            dialog.onData(data);
        }
    },
    select: function (name) {
        if (this.isShow && name == this.curItem) return this.hide();
        if (this.curItem && name != this.curItem) {
            Dialog[Dialog.curItem].close && Dialog[Dialog.curItem].close();
            Dialog[Dialog.curItem].isShow = false;
            Dialog.contentElement.empty();
        }
        this.init();
        this.curItem = name;
    },
    init: function () {
        if (this.isShow) return;
        if (!this.isInit) {
            this.contentElement = $(".dialog>.dialog-content");
            this.titleElement = $(".dialog>.dialog-header>.dialog-title");
            this.iconElement = $(".dialog>.dialog-header>.dialog-icon");
            this.footerElement = $(".dialog>.dialog-footer")
                .on("click", ".footer-item", Dialog.footerClick);
            this.hiddenElement = $(".hidden-item");
            this.element = $(".dialog");
            $(".dialog>.dialog-header>.dialog-close").on("click", Dialog.hide);
            this.isInit = true;
        }
        $(".content-room").addClass("hide");
        this.element.removeClass("hide");
        this.isShow = true;
    },
    hide: function () {
        if (Dialog[Dialog.curItem].hide && Dialog[Dialog.curItem].hide() == false) return;
        Dialog.close();
    },
    footerClick: function () {
        var elem = $(this);
        if (elem.is(".select")) return;
        var cmd = elem.attr("for");
        elem.parent().find(".footer-item.select").removeClass("select");
        elem.addClass("select");
        Dialog[Dialog.curItem].footerChanged(cmd, elem);
    },
    title: function (title) {
        Dialog.titleElement.html(title);
    },
    icon: function (css) {
        this.iconElement.attr("class", "dialog-icon glyphicon glyphicon-" + css);
    },
    footer: function (html) {
        html ? this.footerElement.html(html) : this.footerElement.empty();
    },
    close: function () {
        if (!Dialog.isShow) return;
        Dialog.isShow = false;
        $(".content-room").removeClass("hide");
        Dialog.element.addClass("hide");
    },
    injectStyle: function (css) {
        const style = document.createElement("style");
        style.textContent = css;
        document.head.append(style);
    },
};

export default Dialog;
