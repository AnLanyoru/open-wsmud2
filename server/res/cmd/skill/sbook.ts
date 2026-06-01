import { COMMAND } from "../../../core/command.js";
import { CHARACTER } from "../../../core/char/character.js";
import { SKILL } from "../../../core/skill/skill.js";
import { SKILL_TYPES } from "../../../core/const.js";
import { USER } from "../../../core/char/user.js";
import { COMBINED } from "../../obj/book/bc.js";
import { OBJ } from "../../../core/item/obj.js";

export default class extends COMMAND {
    command = "sbook";
    allow_busy = true;
    allow_state = true;
    regex = /^(\w+)(?:\s+(\w+))?$/;

    /**
     * @param {CHARACTER} me - 执行命令的角色
     */
    enter(me: CHARACTER, arg: string, isok: boolean) {
    if (!me.is_player) return;
    let player = me as USER;
    if (!arg) return this.render_books(player);
    if (arg === 'clear') return this.clear_base(player);
    if (arg.length < 4) return this.check_books(player, arg);
    const book = player.find_obj(arg);
    if (!book || !book.path.startsWith('book/book#'))
        return player.send('你要存储什么秘籍？');
    var skill = SKILL.get(book.skill);
    if (!skill) return player.send('没有这个武功可以存储。');
    if (skill.type === SKILL_TYPES.BASE) {
        player.send('基础武功不用保存。');
        if (this.has_base(player)) {
            player.send_commands('sbook clear', '取出已有的基础秘籍');
        }
        return;
    }
    if (!isok) {
        player.send('将武功秘籍存储到你的书架，后续直接从书架中学习。');
        player.send_commands('sbook ' + arg + " ok", '确定存储');
    }
    else {
        if (!player.books) player.books = [];
        if (player.books.indexOf(book.skill) > -1)
            return player.send('你的书架上已经有' + skill.color_name + "了。");
        player.books.push(book.skill);
        player.send('<hic>你将' + book.unit_name(1) + '存放到书架。</hic>');
        player.remove_obj(book, 1);
        player.send(`{"type":"dialog","dialog":"skills","book":["${skill.name}",${skill.grade},${player.books.length - 1}]}`);
    }
}
    check_books(player: USER, arg: string) {
    let index = parseInt(arg);
    if (!(index >= 0 && index < player.books.length))
        return player.send('你要查看哪本秘籍？ ');
    let skill = SKILL.get(player.books[index]);
    if (!skill)
        return player.send('没有这本秘籍。 ');

    let desc = "一本武功秘籍，里面记载了" + skill.color_name + "的练习方法。";
    var cond = skill.condition_tostring();
    if (cond) {
        desc = desc + "\n学习条件：\n" + cond;
    } else {
        desc = desc + "\n学习条件：无" + cond;
    }
    player.send(desc);
}
    render_books(player: USER) {
    let str = ['{"type":"dialog","dialog":"skills",'];
    let books = player.books ?? [];
    str.push("books:[");
    for (let i = 0; i < books.length; i++) {
        if (i > 0) str.push(',');
        let skill = SKILL.get(books[i]);
        if (!skill) continue;
        str.push('["', skill.name, '",', String(skill.grade), ']')
    }
    str.push(']}');
    player.send(str.join(""));
}
    clear_base(player: USER) {
    let books = player.books ?? [];
    for (let i = 0; i < books.length; i++) {
        let skill = SKILL.get(books[i]);
        if (!skill) continue;
        if (skill.type === SKILL_TYPES.BASE) {
            let obj = player.add_obj('book/book#' + skill.id);
            if (obj) {
                player.send('你取出' + obj.unit_name(1) + "。");
            } else {
                player.send("不存在的秘籍。");
            }
            books.splice(i, 1);
            i--;
        }
    }
    this.render_books(player);
}
    has_base(player: USER) {
    let books = player.books ?? [];
    for (let sk of books) {
        let skill = SKILL.get(sk);
        if (!skill) continue;
        if (skill.type === SKILL_TYPES.BASE)
            return true;
    }
    return false;

}
    split_book(player: USER, book: BOOK) {
    let books = player.books ?? [];
    if (books.indexOf(book.skill) < 0) return player.notify('你只能把已经存放到书架的' + book.color_name + "拆分为秘籍残页。");

    let skill = SKILL.get(book.skill);
    if (!skill) return player.notify('没有这个武功秘籍。');
    if (skill.grade < 1) return player.notify('基础功法和知识类秘籍不能拆分。');
    let count = COMBINED[skill.grade];

    if (!player.remove_obj(book, 1)) return player.notify('拆分失败。');
    let obj = player.add_obj('book/bc#' + skill.id, count);
    if(obj) {
    player.send('你将' + book.color_name + "拆分为" + obj.unit_name(count) + "。");}
}
}


