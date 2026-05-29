import { COMMAND } from "../../../os/command.js";
import { CHARACTER } from "../../../os/char/character.js";
import { SKILL } from "../../../os/skill/skill.js";
import { SKILL_TYPES } from "../../../os/const.js";

export default class extends COMMAND {
    command = "sbook";
    allow_busy = true;
    allow_state = true;
    regex = /^(\w+)(?:\s+(\w+))?$/;

    /**
     * @param {CHARACTER} me - 执行命令的角色
     */
    enter(me, arg, isok) {
    if (!arg) return this.render_books(me);
    if (arg === 'clear') return this.clear_base(me);
    if (arg.length < 4) return this.check_books(me, arg);
    const book = me.find_obj(arg);
    if (!book || !book.path.startsWith('book/book#'))
        return me.send('你要存储什么秘籍？');
    var skill = SKILL.get(book.skill);
    if (!skill) return me.send('没有这个武功可以存储。');
    if (skill.type === SKILL_TYPES.BASE) {
        me.send('基础武功不用保存。');
        if (this.has_base(me)) {
            me.send_commands('sbook clear', '取出已有的基础秘籍');
        }
        return;
    }
    if (!isok) {
        me.send('将武功秘籍存储到你的书架，后续直接从书架中学习。');
        me.send_commands('sbook ' + arg + " ok", '确定存储');
    }
    else {
        if (!me.books) me.books = [];
        if (me.books.indexOf(book.skill) > -1)
            return me.send('你的书架上已经有' + skill.color_name + "了。");
        me.books.push(book.skill);
        me.send('<hic>你将' + book.unit_name(1) + '存放到书架。</hic>');
        me.remove_obj(book, 1);
        me.send(`{"type":"dialog","dialog":"skills","book":["${skill.name}",${skill.grade},${me.books.length - 1}]}`);
    }
}
    check_books(me, arg) {
    let index = parseInt(arg);
    if (!(index >= 0 && index < me.books.length))
        return me.send('你要查看哪本秘籍？ ');
    let skill = SKILL.get(me.books[index]);
    if (!skill)
        return me.send('没有这本秘籍。 ');

    let desc = "一本武功秘籍，里面记载了" + skill.color_name + "的练习方法。";
    var cond = skill.condition_tostring();
    if (cond) {
        desc = desc + "\n学习条件：\n" + cond;
    } else {
        desc = desc + "\n学习条件：无" + cond;
    }
    me.send(desc);
}
    render_books(me) {
    let str = ['{"type":"dialog","dialog":"skills",'];
    let books = me.books ?? [];
    str.push("books:[");
    for (let i = 0; i < books.length; i++) {
        if (i > 0) str.push(',');
        let skill = SKILL.get(books[i]);
        str.push('["', skill.name, '",', skill.grade, ']')
    }
    str.push(']}');
    me.send(str.join(""));
}
    clear_base(me) {
    let books = me.books ?? [];
    for (let i = 0; i < books.length; i++) {
        let skill = SKILL.get(books[i]);
        if (skill.type === SKILL_TYPES.BASE) {
            let obj = me.add_obj('book/book#' + skill.id);
            me.send('你取出' + obj.unit_name(1) + "。");
            books.splice(i, 1);
            i--;
        }
    }
    this.render_books(me);
}
    has_base(me) {
    let books = me.books ?? [];
    for (let sk of books) {
        let skill = SKILL.get(sk);
        if (skill.type === SKILL_TYPES.BASE)
            return true;
    }
    return false;

}
    split_book(me, book) {
    let books = me.books ?? [];
    if (books.indexOf(book.skill) < 0) return me.notify('你只能把已经存放到书架的' + book.color_name + "拆分为秘籍残页。");

    let skill = SKILL.get(book.skill);
    if (skill.grade < 1) return me.notify('基础功法和知识类秘籍不能拆分。');
    let count = COMBINED[skill.grade];

    if (!me.remove_obj(book, 1)) return me.notify('拆分失败。');
    let obj = me.add_obj('book/bc#' + skill.id, count);
    me.send('你将' + book.color_name + "拆分为" + obj.unit_name(count) + "。");
}
}

const COMBINED = [10, 10, 30, 50, 100, 200, 500];
