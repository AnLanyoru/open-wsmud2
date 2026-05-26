
import Util from '../utils/util.js';
import SCRIPT from '../script.js';

export default {
    isShow: false,
    init: function () {
        Dialog.skills.init();
        this.createSkillItems = Dialog.skills.createSkillItems;
        this.createSkillItem = Dialog.skills.createSkillItem;
        this.updateSkill = Dialog.skills.updateSkill;
        this.updateSkillItem = Dialog.skills.updateSkillItem;
        this.showdesc = Dialog.skills.showdesc;
        this.isEnable = Dialog.skills.isEnable;
        this.close = Dialog.skills.close;
    },
    hide: function () {
        if (this.skill_element) {
            this.skill_element.remove();
            this.skill_element = null;
            this.element.removeClass("hide-item");
            Dialog.footer("");
            return false;
        }
        this.isShow = false;
    },

    onData: function (data) {
        if (data.desc) {
            return this.showdesc(data);
        }
        if (data.id) {
            //更新技能状态
            return this.updateSkill(data);
        }
        if (data.books) {
            return this.showBooks();
        }
        if (data.remove && data.from === this.master) {
            this.items.Remove(this.skills[data.remove]);
            var skill = this.skills[data.remove];
            for (var i = 0; i < this.items.length; i++) {
                if (this.items[i].enable_skill == data.remove) {
                    this.items[i].enable_skill = null;
                }
            }
            delete this.skills[data.remove];
            return this.createSkillItems(this.items);
        }
        if (!data.master && !data.follower) return;
        Dialog.show("master");
        this.master = data.master || data.follower;
        this.is_follower = !!data.follower;
        var skills = {};
        for (var i = 0; i < data.items.length; i++) {
            var item = data.items[i];
            skills[item.id] = item;
        }
        this.skills = skills;
        this.items = data.items;
        Dialog.title(data.title);
        Dialog.icon("book");
        this.createSkillItems(data.items, skills);
        if (data.limit) {
            if (this.is_follower) {
                let str = ['<div class="footer-item select" for="0">', '技能</div>'];
                str.push('<div class="footer-item" for="1">书架</div>');
                str.push("<span class='obj-money'>", data.target, "目前的技能上限为<HIC>", data.limit, "</HIC>级</span>");
                Dialog.footer(str.join(""));
            }
            else
                Dialog.footer("<span class='obj-money'>你目前的技能上限为<HIC>" + data.limit + "</HIC>级</span>");
        }
    },
    create_footer: function () {

    },
    selectedItem: 0,
    footerChanged: function (index) {
        index = parseInt(index);
        if (index === this.selectedItem) return;
        this.selectedItem = index;
        if (index === 0) {
            this.element.removeClass("dialog-books");
            this.createSkillItems(this.items, this.skills);
        } else {
            if (!Dialog.skills.books) SendCommand('sbook');
            else this.showBooks();
            return this.element.addClass("dialog-books");
        }
    }, showBooks: function () {
        if (!this.isShow || !this.is_follower) return;
        var html = [];
        var books = Dialog.skills.sort_items(Dialog.skills.books);
        for (let item of books) {
            html.push('<div class="book-item ');
            html.push('grade', item.grade, '" >');
            html.push('<div class="book-name">', item.name, '</div>');
            html.push('<div class="book-action border-right" cmd="sbook ', item.id, '">查看</div>');
            html.push('<div class="book-action" cmd="dc ',
                Dialog.master.master, ' study ', item.id, '">学习</div>');
            html.push('</div>');
        }
        this.element.html(html.join(""));
    },
    show: function () {
        if (this.isShow) return;
        if (!this.element) {
            this.element = $('<div class="dialog-skills"></div >');
        }
        this.element.on("click", ".skill-item", this.item_click);
        this.element.appendTo(Dialog.contentElement);
        this.element.removeClass("hide-item");
        this.isShow = true;
    }, item_click: function () {
        var elem = $(this);
        var item = Dialog.master.skills[elem.attr("skid")];
        if (!item) return;
        var html = ["<div class='item-commands'>"];
        html.push('<span cmd="checkskill ' + item.id + ' ' + Dialog.master.master + '">查看详细</span>');
        html.push('<span cmd="xue ' + elem.attr("skid") + ' from ' + Dialog.master.master + '">学习</span>');

        item.master = 1;
        if (Dialog.master.is_follower) {
            var bf = 'dc ' + Dialog.master.master;
            html.push('<span cmd="_confirm ' + bf + ' fangqi ' + elem.attr("skid") + '">遗忘</span>');
            html.push('<span cmd="' + bf + ' lianxi ' + elem.attr("skid") + '">练习</span>');
            if (item.can_enables) {
                for (var i = 0; i < item.can_enables.length; i++) {
                    var baseSkill = Dialog.master.skills[item.can_enables[i]];
                    if (!baseSkill) continue;
                    if (baseSkill.enable_skill != item.id)
                        html.push('<span cmd="' + bf + ' enable ' + baseSkill.id + ' ' + item.id + '">装备' + baseSkill.name + '</span>');
                    else {
                        html.push('<span cmd="' + bf + ' enable ' + baseSkill.id + ' none">取消装备' + baseSkill.name + '</span>');
                    }
                }
            }
            if (item.enable_skill) {
                var sp_skill = Dialog.master.skills[item.enable_skill];
                if (sp_skill) html.push('<span cmd="' + bf + ' enable ' + item.id + ' none">取消装备' + sp_skill.name + '</span>');
                else item.enable_skill = null;
            }
            item.master = 0;
        }
        SCRIPT.LAST_OBJ = item;
        let commands = Dialog.extend.query('mskill', item);
        for (let item of commands) {
            html.push('<span cmd="', item.cmd, '">', item.name, '</span>');
        }
        html.push("</div>");
        Dialog.master.element.find(".item-commands").remove();
        $(html.join("")).insertAfter(elem);
        Util.checkScroll(elem);
    }
}
