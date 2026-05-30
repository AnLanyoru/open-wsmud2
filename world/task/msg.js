import fs from "fs";
import { TASK } from "../../os/task/task.js";
import { WORLD } from "../../os/world.js";
import { COMMAND } from "../../os/command.js";

export default class extends TASK {
    id = "msg";
    handler = null;
    msgs = [
    "欢迎登录，感谢你的支持，如有任何问题或建议",
    "如有BUG请提交管理员，谢谢配合"

];
    is_check_file = false;

    startup() {
    this.handler = this.call_out(this.run, 20 * 60000);
}
    stop() {
    if (this.handler) clearTimeout(this.handler);
}
    run() {
    COMMAND.DO("sys", this.msgs.random());
    this.startup();
    var dt = new Date();
    if (dt.getHours() == 4 && !this.is_check_file) {
        this.is_check_file = true;
        this.check_file();
    }
    if (dt.getHours() == 5) {
        this.is_check_file = false;
        this.clearyz();
    }
}
    clearyz() {
    WORLD.COMMANDS['checkorg'].cmd_clearmail();
    WORLD.COMMANDS['checkorg'].cmd_clearstore();
}
    check_file() {

    const min1 = new Date(Date.now() - 3600000 * 24 * 7);//七天内每个一小时
    const min2 = new Date(Date.now() - 3600000 * 24 * 30);//30天内每天一个
    const min3 = new Date(Date.now() - 3600000 * 24 * 160);//一年内一周一个，一年外的删除


    const min4 = new Date(Date.now() - 3600000 * 24 * 30);//日志30天内每天一个
    this.check_temp_files("log", (dir) => {
        dir = dir.replace("log", "").replace(".txt", "");
        let pars = dir.split('-');
        let dt = new Date(pars[0], pars[1] - 1, pars[2]);
        return dt < min4;
    });

    this.check_temp_files("req", (dir) => {
        dir = dir.replace("request", "").replace(".txt", "");
        let pars = dir.split('-');
        let dt = new Date(pars[0], pars[1] - 1, pars[2]);
        return dt < min4;
    });
    this.check_temp_files("bak", (dir) => {
        dir = dir.replace("data", "").replace(".js", "");
        let pars = dir.split('-');
        if (pars.length < 3) return false;
        let dt = new Date(pars[0], pars[1] - 1, pars[2], pars[3]);
        if (dt > min1) return false;
        if (dt > min2) {

            if (dt.getHours() === 5) return false;
            return true;
        }
        if (dt > min3) {
            if (dt.getHours() === 5 && dt.getDay() === 1) return false;
            return true;
        }
        return true;

    });

    this.check_temp_files("temp", (dir) => {
        let pars = dir.split('-');
        if (pars.length < 5) return false;
        let dt = new Date(pars[1], pars[2] - 1, pars[3], pars[4]);
        if (dt > min2) {
            if (dt.getHours() === 5) return false;
            return true;
        }
        return true;
    });
}
    async check_temp_files(path, func) {
    const dir = __PATH.DATA + path + "/";
    const paths = await fs.readdir(dir);
    for (var i = 0; i < paths.length; i++) {
        if (func(paths[i])) {
            fs.unlink(dir + paths[i]);
        }
    }
}
}

const __PATH = globalThis.__PATH;
