this.inherits(COMMAND);
this.command = "deleterole";
this.allow_login = true;
this.enter = function (me, pars) {
    if (!pars) return;
    var olduser = WORLD.getUser(pars);
    if (olduser) {
        return me.notify("{type:\"deleterole\",result:0,message:\"登陆中的角色不允许删除\"}");
    }
    WORLD.DB.deleteRole(me.userid, pars).then(x => {
        if (x) {
            me.notify("{type:\"deleterole\",result:1,id:\"" + pars + "\"}");
            var user = WORLD.getUser(pars);
            if (user) {
                if (user.environment) user.environment.item_changed(user, false);
                WORLD.USERS.remove(user);
            }
        } else {
            me.notify("{type:\"deleterole\",result:0}");
        }
    }).catch(err => {
        me.notify("{type:\"deleterole\",result:0}");
    });
}