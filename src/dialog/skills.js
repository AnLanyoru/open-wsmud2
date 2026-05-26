import Setting from '../setting.js';
import Util from '../utils/util.js';
import SCRIPT from '../script.js';


export default {
    isShow: false,
    selectItem: ".dialog-skills",
    init: function () {
        if (!this.created)
            Dialog.injectStyle(skills_css);
        this.created = true;
    },
    hide: function () {
        if (this.skill_element) {
            this.skill_element.remove();
            this.skill_element = null;
            this.element.removeClass("hide-item");
            this.create_footer();
            this.skill_element_id = null;
            return false;
        }
    },
    close: function () {
        this.hide();
        this.element.remove();
        //Dialog.footerElement.addClass("hide");
        this.isShow = false;
        this.skill_element_id = null;
        this.element.removeClass("hide-item");
    },
    limit: 0,
    selected_item: -1,
    showdesc: function (data) {
        if (!this.isShow) return;
        this.element.find(".item-commands").remove();
        if (this.skill_element) this.skill_element.remove();
        this.skill_element = $("<pre></pre>").html(data.desc).appendTo(this.element);
        // Dialog.title(data.title);
        this.skill_element_id = data.id;
        this.element.addClass("hide-item");
        let html = ['<div class="item-commands">'];

        if (this.master) {
            html.push('<span cmd="xue ', data.id, ' from ', this.master, '">学习</span>');
            if (this.is_follower) {
                html.push('<span cmd="dc ', this.master, ' lingwu ', data.id, '">进阶</span>');
                html.push('<span cmd="dc ', this.master, ' fangqi ', data.id, '">遗忘</span>');
            }

        } else {
            if (data.is_custom)
                html.push('<span cmd="zc ', data.id, '">推演</span>');
            html.push('<span cmd="lingwu ', data.id, '">进阶</span>');
            html.push('<span cmd="lingwu2 ', data.id, '">融合</span>');
            html.push('<span cmd="fangqi ', data.id, '">遗忘</span>');
        }
        html.push('</div>');
        Dialog.footer(html.join(""));

    },
    footerChanged: function (index, ref) {
        if (index == this.selected_item && !ref) return;
        this.selected_item = index;
        Dialog.skills.element.find(".item-commands").remove();
        if (index == 2) {
            if (!this.books) SendCommand('sbook');
            else this.showBooks();
            return this.element.addClass("dialog-books");
        }
        if (this.element.is('.dialog-books')) {
            this.element.removeClass('dialog-books');
            this.create_footer();
            return this.createSkillItems(this.items);
        }
        if (index == 0) {
            this.element.find('.base').removeClass('hide');
            this.element.find(".skill").addClass('hide');
        } else if (index == 1) {
            this.element.find('.base').addClass('hide');
            this.element.find(".skill").removeClass('hide');
        }
    },
    footers: ["基础", "特殊", "书架"],
    eq_group: 0,
    create_footer: function (isbook) {
        var footers = this.footers;
        var html = [];
        for (var i = 0; i < footers.length; i++) {
            html.push("<span class='footer-item" +
                (i == this.selected_item ? " select" : "") + "' for='" + i + "''>"
                + footers[i] + "</span>");
        }
        // if (isbook)
        //     html.push("<span class='obj-money'>你的书架目前有<HIC>" + this.books.length + "</HIC>本秘籍</span>");
        // else
        //     html.push("<span class='obj-money'>你目前的技能上限为<HIC>" + this.limit + "</HIC>级</span>");
        if (!isbook) {
            for (let i = 0; i < 3; i++) {
                html.push('<span class="sk-group',
                    2 - i === this.sk_group ? " select" : "",
                    '" group="', 2 - i, '">', 3 - i, '</span>');
            }
        }
        Dialog.footer(html.join(""));
    },
    eq_group_click: function () {
        let group = parseInt($(this).attr('group'));
        if (group >= 0) SendCommand('skgroup ' + group);
    },
    updateSkill: function (data) {
        if (!this.skills) return;
        var item = this.skills[data.id];
        if (!item) {

            return this.addSkill(item);
        }
        if (data.name)
            item.name = data.name;
        if (data.grade >= 0 && data.grade !== item.grade) {
            item.grade = data.grade;
            if (item.can_enables) {
                for (let sk of item.can_enables) {
                    let base_skill = this.skills[sk];
                    if (base_skill && base_skill.enable_skill === data.id) {
                        this.updateSkillItem(base_skill);
                    }
                }
            }
        }
        if (data.enable) {
            if (item.enable_skill) {
                var old_skill = item.enable_skill;
                item.enable_skill = null;
                this.skills[old_skill][data.id] = false;
                this.updateSkillItem(this.skills[old_skill]);
            }
            this.skills[data.enable][data.id] = true;
            item.enable_skill = data.enable;
            this.updateSkillItem(this.skills[data.enable]);
            this.updateSkillItem(this.skills[data.id]);
        } else if (data.exp != undefined || data.level != undefined) {
            if (data.level >= 0) item.level = data.level;
            if (data.exp >= 0) item.exp = data.exp;
            if (data.can_enables) item.can_enables = data.can_enables;
            this.updateSkillItem(item);
        }
        else if (data.enable == false) {
            if (item.enable_skill) {
                var old_skill = item.enable_skill;
                this.skills[old_skill][data.id] = false;
                item.enable_skill = null;
                this.updateSkillItem(this.skills[old_skill]);
                this.updateSkillItem(this.skills[data.id]);
            }
        }

    }, updateSkillItem: function (item) {
        var sk_elem = this.element.find(".skill-item[skid='" + item.id + "']");
        if (sk_elem) {
            let hide = sk_elem.css('display') === 'none';
            sk_elem.replaceWith(this.createSkillItem(item));
            if (hide) sk_elem.hide();
        }
    },
    addSkill: function (item) {

        if (!this.items || !item) return;
        if (this.skills[item.id]) {
            return this.updateSkill(item);
        }
        this.items.push(item);
        this.skills[item.id] = item;
        this.items = this.sort_items(this.items);
        this.createSkillItems(this.items);
    }, format_books: function (data) {
        let books = [];

        for (let i = 0; i < data.length; i++) {
            books.push({
                name: data[i][0],
                grade: data[i][1],
                id: i
            });
        }
        return books;
    },
    onData: function (data) {
        if (data.book) {
            if (!this.books) return;
            this.books.push({ name: data.book[0], grade: data.book[1], id: data.book[2] });
            if (this.isShow && this.selected_item == 2) {
                return this.showBooks();
            }
            return;
        }
        if (data.books) {
            this.books = this.format_books(data.books);
            if (this.isShow || !Dialog.master.isShow)
                return this.showBooks();
            else
                return Dialog.master.showBooks();
        }
        if (data.id && !data.desc) {
            if (data.from)
                return this.updateSkill.call(Dialog.master, data);
            return this.updateSkill(data);
        }
        if (data.item) {
            if (Dialog.master.isShow && Dialog.master.is_follower) {
                return this.addSkill.call(Dialog.master, data.item);
            }
            return this.addSkill(data.item);
        }
        if (!this.isShow) {
            if (Dialog.master.isShow)
                return Dialog.master.onData(data);
        }

        if (data.desc) {
            if (data.id) this.updateSkill(data);
            return this.showdesc(data);
        }


        if (data.remove && this.items) {
            if (data.from && data.from !== Process.player) return;
            this.items.Remove(this.skills[data.remove]);

            for (var i = 0; i < this.items.length; i++) {
                if (this.items[i].enable_skill == data.remove) {
                    this.items[i].enable_skill = null;
                }
            }
            delete this.skills[data.remove];
            if (this.skill_element && this.skill_element_id === data.remove) {
                this.hide();
            }
            return this.createSkillItems(this.items);
        }
        if (data.items) {
            this.title = data.title;
            Dialog.title(this.title + "，等级上限" + data.limit + "级");
            Dialog.icon("book");
            this.items = this.sort_items(data.items);
            this.skills = {};
            for (var i = 0; i < this.items.length; i++) {
                var item = this.items[i];
                this.skills[item.id] = item;
            }
            if (this.items.length > 10 && this.selected_item < 0) {
                this.footerChanged(0);
            }
            this.createSkillItems(this.items);
        }
        if (data.sk_group >= 0) {
            this.sk_group = data.sk_group;
            this.limit = data.limit;
            this.create_footer();
        }
        if (data.limit >= 0) {
            this.limit = data.limit;
            Dialog.title(this.title + "，等级上限" + this.limit + "级");
        }
    },
    show: function () {
        if (this.isShow) return;
        this.isShow = true;
        if (!this.element) {
            //  this.container = $('<div class="skill-container"><div class="skill-sider"><div class="skill-sider-item select">1</div><div class="skill-sider-item">2</div><div class="skill-sider-item">3</div></div></div>');
            this.element = $('<div class="dialog-skills"></div>');
            Dialog.footerElement
                .on("click", ".sk-group", Dialog.skills.eq_group_click);
        }
        this.element.on("click", ".skill-item", Dialog.skills.item_click);
        //Dialog.footerElement.remveClass("hide");
        this.element.appendTo(Dialog.contentElement);
        //this.container.appendTo(Dialog.contentElement);
        this.element.removeClass("hide-item");
        if (!this.items) SendCommand("cha");
        else {
            SendCommand("cha none");
            Dialog.icon("book");
            this.create_footer();
        }
    },
    isEnable: function (item, skills) {
        if (!item.can_enables) return false;
        for (var i = 0; i < item.can_enables.length; i++) {
            var base_skill = skills[item.can_enables[i]];
            if (base_skill && base_skill.enable_skill == item.id) return true;
        }
        return false;
    },
    showBooks: function () {
        var html = [];
        var books = this.sort_items(this.books);
        for (let item of books) {
            html.push('<div class="book-item ');
            html.push('grade', item.grade, '" >');
            html.push('<div class="book-name">', item.name, '</div>');
            html.push('<div class="book-action border-right" cmd="sbook ', item.id, '">查看</div>');
            html.push('<div class="book-action" cmd="study ', item.id, '">学习</div>');
            html.push('</div>');
        }
        this.element.html(html.join(""));
        this.create_footer(true);
    },
    createSkillItem: function (item, skills) {
        skills = skills || this.skills;
        var html = [];
        html.push('<div class="skill-item ');
        html.push('grade' + item.grade);
        if (!this.master) {
            if (item.can_enables) {
                html.push(' skill');
                if (this.selected_item == 0) html.push(' hide');
            } else {
                html.push(' base');
                if (this.selected_item == 1) html.push(' hide');
            }
        }

        var is_enable = this.isEnable(item, skills);
        if (is_enable) {
            html.push(' enable');
        }
        html.push('" skid="' + item.id + '">');

        html.push('<span class="glyphicon glyphicon-ok enable-flag"></span>');
        html.push(item.name);
        //  html.push('</', lvcolor, '>');
        if (item.enable_skill && skills) {
            var sp_skill = skills[item.enable_skill];
            if (sp_skill) {
                html.push('<span class="enable_skill">已装备：');
                html.push(wrap_name(sp_skill));
                html.push("</span>");
            }

        }

        html.push('<span class="skill-level">');
        // var lv_desc = this.get_lvdesc(item.level);
        //push(lv_desc.replace(">", ">" + item.level + '级 / ' + item.exp + "%" + '&nbsp;'));
        html.push(item.level);
        html.push('级 / ');
        html.push(item.exp);
        html.push("%");
        html.push('&nbsp;');
        html.push(Dialog.skills.get_lvdesc(item.level));
        html.push('</span></div>');
        return html.join("");
    },
    sort_items: function (items) {
        if (!items || !Setting.auto_sortitem) return items;
        var list = [];
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var isok = false;
            for (var j = 0; j < list.length; j++) {
                if (item.grade > list[j].grade) {
                    list.splice(j, 0, item);
                    isok = true;
                    break;
                }
            }
            if (!isok) {
                list.push(item);
            }
        }
        return list;
    },
    createSkillItems: function (items, skills) {
        let html = [];
        for (var i = 0; i < items.length; i++) {
            html.push(this.createSkillItem(items[i], skills));
        }
        this.element.html(html.join(""));

    }, level_color: ["wht", "hig", "hic", "hij", "hiz", "hio", "ord"]
    , get_lvdesc: function (level) {
        if (level < 1000)
            return Dialog.skills.skill_levels[parseInt(level / 50)];
        var v = parseInt((level - 1000) / 500);
        if (v > 6) v = 6;
        return Dialog.skills.skill_levels[v + 20];
    },
    skill_levels: [
        "<BLU>初学乍练</BLU>", "<BLU>不知所以</BLU>", "<HIB>粗通皮毛</HIB>", "<HIB>渐有所悟</HIB>",
        "<YEL>半生不熟</YEL>", "<YEL>马马虎虎</YEL>", "<HIY>平淡无奇</HIY>", "<HIY>触类旁通</HIY>",
        "<HIG>心领神会</HIG>", "<HIG>挥洒自如</HIG>", "<HIC>驾轻就熟</HIC>", "<HIC>出类拔萃</HIC>",
        "<CYN>初入佳境</CYN>", "<CYN>神乎其技</CYN>", "<MAG>威不可当</MAG>",
        "<HIW>豁然贯通</HIW>", "<HIW>超群绝伦</HIW>", "<RED>登峰造极</RED>", "<WHT>登堂入室</WHT>",
        "<HIM>一代宗师</HIM>", "<WHT>超凡入圣</WHT>", "<HIO>出神入化</HIO>", "<HIO>独步天下</HIO>",
        "<HIR>空前绝后</HIR>", "<HIR>旷古绝伦</HIR>", "<HIW>深不可测</HIW>", "<HIW>返璞归真</HIW>"]
    ,
    item_click: function () {
        var elem = $(this);
        var html = ["<div class='item-commands'>"];
        var item = Dialog.skills.skills[elem.attr("skid")];
        if (!item) return;
        html.push('<span cmd="checkskill ' + item.id + '">查看详细</span>');
        if (item.can_enables) {
            for (var i = 0; i < item.can_enables.length; i++) {
                var baseSkill = Dialog.skills.skills[item.can_enables[i]];
                if (!baseSkill) continue;
                if (baseSkill.enable_skill != item.id)
                    html.push('<span cmd="enable ' + baseSkill.id + ' ' + item.id + '">装备' + baseSkill.name + '</span>');
                else {
                    html.push('<span cmd="enable ' + baseSkill.id + ' none">取消装备' + baseSkill.name + '</span>');
                }
            }
        }
        if (item.enable_skill) {
            var sp_skill = Dialog.skills.skills[item.enable_skill];
            if (sp_skill) html.push('<span cmd="enable ' + item.id + ' none">取消装备' + sp_skill.name + '</span>');
            else item.enable_skill = null;
        }
        html.push('<span cmd="_confirm fangqi ' + item.id + '">遗忘</span>');
        html.push('<span cmd="lianxi ' + item.id + '">练习</span>');
        SCRIPT.LAST_OBJ = item;
        let commands = Dialog.extend.query('skill', item);
        for (let item of commands) {
            html.push('<span cmd="', item.cmd, '">', item.name, '</span>');
        }
        html.push("</div>");
        Dialog.skills.element.find(".item-commands").remove();
        $(html.join("")).insertAfter(elem);
        Util.checkScroll(elem.next());
    }
};
const level_desc = ["wht", "hig", "hic", "hiy", "him", "hio", 'ord'];
function wrap_name(obj) {
    let tag = level_desc[obj.grade];
    return `<${tag}>${obj.name}</${tag}>`;
}
const skills_css = `
.dialog-skills {
    overflow-y: auto;
    min-height: 15em;
    max-height: 35em;
}

.hide-item {}

.dialog-skills>pre {
    padding: 0px;
    margin: 0px;
    white-space: pre-wrap;
}

.dialog-skills>.skill-item {
    line-height: 2em;
    padding-left: 1.5em;
    border-radius: 4px;
    border-left-width: 2px;
    border-left-style: solid;
    white-space: nowrap;
    overflow-x: auto;
    margin-bottom: 0.5em;
    background-color: #111;
    cursor: pointer;
}


.hide-item>.skill-item {
    display: none;
}

.dialog-skills>.dialog-books>.skill-item {
    display: none;
}

.dialog-skills>.skill-item>.skill-level {
    float: right;
    margin-right: 0.625em;
}

.dialog-skills>.skill-item>.enable-flag {
    display: none;
    color: var(--border-color);
    line-height: 2em;
}

.dialog-skills>.enable {
    padding-left: 0px;
}

.dialog-skills>.enable>.enable-flag {
    display: inline-block;
    padding-left: 0.25em;
    padding-right: 0.25em;
}

.dialog-skills>.skill-item>.enable_skill {
    margin-left: 0.5em;
}

.dialog-skills>.enable>.item-commands {
    padding-left: 1em;
}

.dialog-skills>.book-item {
    line-height: 2em;
    padding-left: 1.5em;
    border-radius: 4px;
    border-left-width: 2px;
    border-left-style: solid;
    white-space: nowrap;
    overflow-x: auto;
    margin-bottom: 0.5em;
    background-color: #111;
    cursor: pointer;
    display: flex;
    flex-direction: row;
}

.dialog-skills>.book-item>.book-name {
    flex: 1;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--border-color);
    overflow: hidden;
}

.dialog-skills>.book-item>.book-action {
    flex: 0;
    background-color: #222;
    padding-left: 1em;
    padding-right: 1em;
}

`;
