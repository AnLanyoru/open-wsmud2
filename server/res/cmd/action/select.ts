import { COMMAND } from "../../../core/command.js";
import type { CHARACTER } from "../../../core/char/character.js";
import type { USER } from "../../../core/char/user.js";

export default class extends COMMAND {
  command = "select,command";
  allow_busy = true;
  allow_state = true;

  /**
   * @param me - 执行命令的角色
   */
  enter(me: USER, arg: string) {
    if (!me.environment) return;
    if (arg) {
      var target = me.environment.find_obj(arg);
      if (!target) {
        return me.notify("这里没有这个东西。");
      }
      let target_cmd = target.query_commands?.(me);
      if (target_cmd) me.notify(target_cmd);
      if (target.check_character()) {
        var str = ['{type:"cmds",items:['];

        if (target.path && me.query_temp("yb_npc2") == target.path) {
          str.push('{cmd:"task yunbiao ');
          str.push(target.id);
          str.push(' give",name:"交镖银"}');
        }
        str.push("]}");
        if (str.length > 2) {
          me.send(str.join(""));
        }
      }
      if (me.user_level > 0 && target.check_player()) {
        me.send_commands(
          "setuser " + target.id + " chat1",
          "永久禁言",
          "setuser " + target.id + " chat2",
          "禁言24小时",
          "setuser " + target.id + " quit",
          "踢出游戏",
          "setuser " + target.id + " dis",
          "登录限制",
          "setuser " + target.id + " query",
          "查询信息",
          "setuser " + target.id + " reback",
          "开始回档",
        );
      }
    } else {
      me.notify(me.environment.query_commands());
    }
  }

  exec(me: USER, target: CHARACTER) {
    let str: (string | number)[] = ['{type:"'];
    str.push(me == target ? 'login"' : 'select"');
    if (target) {
      str.push(",hp:");
      str.push(target.hp);
      str.push(",mp:");
      str.push(target.mp);
      str.push(",max_hp:");
      str.push(target.max_hp);
      str.push(",max_mp:");
      str.push(target.max_mp);
      str.push(',name:"');
      str.push(target.long_name());
      str.push('",level:');
      str.push(target.level);
      str.push(',id:"');
      str.push(target.id);

      str.push('",status:[');
      if (target.status) {
        for (let i = 0; i < target.status.length; i++) {
          if (i > 0) str.push(",");
          str.push(target.status[i].to_json!());
        }
      }
      str.push("]");
    }
    str.push("}");
    return me.notify(str.join(""));
  }
}
