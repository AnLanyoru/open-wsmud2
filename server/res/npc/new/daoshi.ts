import { ItemCommandsJson } from '../../../core/char/follower.js';
import { NPC } from '../../../core/char/npc.js';

export default class extends NPC {
    name = '<hic>指引者</hic>';
    desc = '她是一位漂亮的女性，脸上笑眯眯的';
    title = '<hig>新手导师</hig>';
    gender = 2;
    age = 20;
    per = 41;
    mp = 1500;
    max_mp = 1500;
    hp = 1500;
    max_hp = 1500;

    constructor() {
        super();
        this.set_objects(['sp/new/qicai', 1, 1]);
    }

    query_commands_json(player, isyb) {
        var json: ItemCommandsJson = {
            type: 'item',
            desc: this.desc,
            id: this.id,
            commands: [
                {
                    cmd: 'look ' + this.id,
                    name: '查看',
                },
            ],
        };

        if (this.actions) {
            for (var cmd in this.actions) {
                let cmd_name = this.actions[cmd].name;
                if (!cmd_name) continue;
                json.commands.push({
                    cmd: cmd + ' ' + this.id,
                    name: cmd_name,
                });
            }
        }
        return JSON.stringify(json);
    }
}
