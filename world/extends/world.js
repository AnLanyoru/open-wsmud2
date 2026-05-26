
WORLD.on_startup = function () {
    init_fams();
    WORLD.COMMANDS.jh.init();
}

function init_fams() {
    for (let fam in FAMILIES) {
        FAMILIES[fam].init();
    }
}

WORLD.on_user_quit = function (user) {
    //在玩家退出游戏时调用
    if (WORLD.is_server(user)) {
        if (user.query_temp('pt')) {
            WORLD.COMMANDS['party'].on_user_login(user, false);//帮派初始化
        }
        WORLD.on_user_save(user);
    } else {
        if (user.query_temp('cross_type') == 'duizhan') {
            WORLD.PUB_USERS.push(user);
            user.disconnect_time = 0;
        }
    }
}
WORLD.on_user_save = function (user) {
    //在玩家退出游戏，或者游戏关闭时候调用

}


WORLD.on_heart_beat = function (now) {

}

const illegalUARegex = /node|python|java|curl|wget|postman|robot|spider|bot/i;
const Origins = [];
WORLD.check_connect = function (socket) {
    if (WORLD.SERVER.istest) return true;

    return true;
}

WORLD.close = async function () {
    WORLD.status = 5;
    console.log('正在尝试关闭数据连接');
    for (let user of this.USERS) {
        if (user.socket)
            user.socket.end();
    }
    //await this.LISTENER.close();
    console.log('关闭网络连接');
    clearInterval(this.heart_beat_service);
    // console.time('savedb');
    if (await WORLD.save()) {
        //  console.timeEnd('savedb');
        //await this.DB.close();
        console.log('关闭数据连接');
        return true;
    }
    return false;
}