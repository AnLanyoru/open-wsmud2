
import Setting from './setting.js';

const Combat = {
    IsShow: false,
    Skills: null,
    actions: null,
    room_actions: null,
    object_actions: null,
    Scroll: function (e) {
        let div = $(this)[0];
        div.scrollLeft += e.originalEvent.deltaY;
    },
    Show: function () {
        if (Combat.IsShow) return Combat.Hide();
        if (!this.object_actions) SendCommand("actions");
        Combat.IsShow = true;
        if (!Setting.off_hp) {
            $(".room-item>.item-status").show();
        }
        $(".combat-panel").removeClass("hide");
        this.refActions();
        Process.message.scroll2end();
        // $(".right-bar")[0].style.bottom = ($(".combat-panel").height() + $(".bottom-bar").height()) + "px";
    },
    Hide: function () {
        Combat.IsShow = false;
        if (!Setting.off_hp) {
            $(".room-item>.item-status").hide();
        }
        $(".combat-panel").addClass("hide");
        //  $(".right-bar")[0].style.bottom = null;
    }, ShowRoomCommands: function (room) {

        this.room = room;
        this.room_actions = room.commands;
        if (!Combat.IsShow) return;
        this.refActions();
        // let panel = $(".room-commands");
        // if (this.room_actions) {
        //     for (let item of this.room_actions) {
        //         panel.find('[cmd="' + item.cmd + '"]').remove();
        //     }
        // }
        // let cmds = room.commands ?? [];
        // Dialog.extend.append(cmds, 'action', room);
        // this.room = room;
        // this.room_actions = cmds;
        // if (!Combat.IsShow) return;
        // this.append_items(cmds, panel);
    },
    def_actions: [{ cmd: "dazuo", name: "打坐" },
    { cmd: "liaoshang", name: "疗伤" }],

    refActions: function () {
        let actions = [...this.def_actions];
        this.actions = actions;
        if (this.room) {
            Dialog.extend.append(actions, 'action', this.room);
        }
        this.create_actions();
    },
    ShowActions: function (data) {
        this.object_actions = data.actions ?? [];
        this.refActions();
        if (data.skills)
            this.ShowPFM(data);
    },
    ShowPFM: function (data) {
        this.Skills = data.skills || [];
        this.create_skillItems(data.skills);
    },
    append_items: function (items, parent) {
        if (!items) return;
        for (let item of items) {
            item.elem =
                $(`<span class='act-item' cmd='${item.cmd}'>${item.name}</span>`)
                    .appendTo(parent);
            if (item.disper > 0) {
                item.elem.css("backgroundSize", item.disper + "% 100%");
            }
        }
    }, create_actions: function (items) {
        var panel = $(".room-commands").empty();
        this.append_items(this.actions, panel);
        this.append_items(this.object_actions, panel);
        this.append_items(this.room_actions, panel);

    }, DisObj: function (data) {
        if (!this.object_actions) return;
        var cmd = data.act ? data.id : "use " + data.id;
        for (var i = 0; i < this.object_actions.length; i++) {
            var item = this.object_actions[i];
            if (item.cmd === cmd) {
                if (data.remove) {
                    this.object_actions.splice(i, 1);
                    return item.elem.remove();
                }
                else {
                    this.ANI_OBJ(item, data.time, data.time);
                }
            }
        }
    }, AddObj: function (id, name) {
        if (!this.object_actions) return;
        var cmd = "use " + id;
        for (var i = 0; i < this.object_actions.length; i++) {
            var item = this.object_actions[i];
            if (item.cmd == cmd) return;
        }
        this.object_actions.push({
            cmd: "use " + id,
            name: name.replace(/\<.+?\>/g, "")
        });
        this.create_actions();
    }
    , ANI_OBJ: function (obj, time, ani_time) {

        let elem = obj.elem;
        if (!elem) return;
        var cur_per = ani_time * 100 / time;
        if (cur_per > 0) {
            elem.css("backgroundSize", cur_per + "% 100%");
        } else {
            if (cur_per < 0) cur_per = 0;
            elem.css("backgroundSize", "0% 100%");
        }
        obj.disper = cur_per;
        setTimeout(Combat.ANI_OBJ, 1000, obj, time, ani_time - 1000);
    }
    , create_skillItems: function (items) {
        var elem = $(".combat-commands").empty();
        if (!items.length) return;
        for (var i = 0; i < items.length; i++) {
            var html = [];
            html.push("<span class='pfm-item' pid='" + items[i].id + "'>");
            html.push(items[i].name);
            // html.push("<span class='shadow'></span>");
            html.push("</span>");
            // items[i].shadow = $(html.join("")).appendTo(elem).find(".shadow")[0];
            items[i].elem = $(html.join("")).appendTo(elem);
        }
    }, ChangeDistime: function (data) {
        var pfmid = data.id.replace("/", ".");
        for (var j = 0; j < Combat.dis_pfms.length; j++) {
            if (Combat.dis_pfms[j].id == pfmid) {
                Combat.dis_pfms[j].ani_time += data.time;
                break;
            }
        }
    }, ClearDistime: function (data) {
        if (!Combat.dis_pfms) return;
        var pfmid = data.id ? data.id.replace("/", ".") : data.id;
        for (var j = 0; j < Combat.dis_pfms.length; j++) {
            if (!pfmid || Combat.dis_pfms[j].id == pfmid) {
                Combat.dis_pfms[j].ani_time = 0;
            }

        }
    }, redisable: function () {
        Combat.dis_pfms = [];
        for (var i = 0; i < Combat.Skills.length; i++) {
            var skill = Combat.Skills[i];
            Combat.dis_pfms.push({
                id: skill.id,
                distime: skill.distime,
                ani_time: skill.distime
            });
        }
        if (!Combat.time_handler) {
            Combat.ANI_PFM();
        }
    }, On_Perform: function (data) {
        if (!this.Skills) return;
        if (data.id === 'all' && !data.rtime) return this.redisable();
        if (data.id)
            data.id = data.id.replace('/', '.');
        data.rtime = data.rtime || 0;
        data.distime = data.distime || 0;
        if (!this.dis_pfms) this.dis_pfms = [];
        for (var i = 0; i < this.dis_pfms.length; i++) {

            if (this.dis_pfms[i].id == data.id) {
                data.id = null;
                this.dis_pfms[i].distime = data.distime;
                this.dis_pfms[i].ani_time = data.distime;
                continue;
            }
            if (this.dis_pfms[i].ani_time < data.rtime) {
                this.dis_pfms[i].ani_time = data.rtime;
                this.dis_pfms[i].distime = data.rtime;
            }
        }
        if (data.id) {
            this.dis_pfms.push({
                id: data.id,
                distime: data.distime,
                ani_time: data.distime
            });
        }
        Combat.ani_time = Combat.ani_time ?? 0;
        if (data.rtime > Combat.ani_time) {
            Combat.distime = data.rtime;
            Combat.ani_time = data.rtime;
        }
        if (!this.time_handler) {
            Combat.ANI_PFM();
        }
    }, PFM_INTERVAL: 300
    , ANI_PFM: function () {
        var p = 0;
        if (Combat.distime > 0)
            p = Combat.ani_time * 100 / Combat.distime;
        for (var i = 0; i < Combat.Skills.length; i++) {
            var skill = Combat.Skills[i];
            var cur_per = p;
            for (var j = 0; j < Combat.dis_pfms.length; j++) {
                if (Combat.dis_pfms[j].id == skill.id && Combat.dis_pfms[j].distime) {
                    cur_per = Combat.dis_pfms[j].ani_time * 100 / Combat.dis_pfms[j].distime;
                    if (cur_per < 0) {
                        Combat.dis_pfms.splice(j, 1);
                    } else {
                        Combat.dis_pfms[j].ani_time -= Combat.PFM_INTERVAL;
                    }
                    break;
                }
            }
            if (cur_per > 0) {
                if (cur_per < 0) cur_per = 0;
                skill.elem.css("backgroundSize", cur_per + "% 100%");
            } else {
                skill.elem.css("backgroundSize", "0% 100%");
            }
        }

        if (Combat.ani_time > 0 || Combat.dis_pfms.length) {
            Combat.time_handler = setTimeout(Combat.ANI_PFM, Combat.PFM_INTERVAL);
        } else {
            Combat.time_handler = null;
        }
        Combat.ani_time -= Combat.PFM_INTERVAL;
    },
    StatusChanged: function (data) {
        var items = $(".room-item");
        for (var i = 0; i < items.length; i++) {
            var item = $(items[i]);
            if (item.attr("itemid") == data.id) {
                this.UpdaeBar(data, "mp", item);
                this.UpdaeBar(data, "hp", item);
                break;
            }
        }
    }, UpdaeBar: function (data, type, item) {
        var val = data[type], max = 0;
        if (val == undefined) return;

        var bar = item.find("." + type + ">.progress-bar");
        if (data["max_" + type]) {
            max = data["max_" + type];
            bar.attr("max", max);
        } else {
            max = parseInt(bar.attr("max"));
        }
        if (Setting.show_hpnum && type == "hp") {

            item.find(".progress-num").html("[" + Process.get_hpnum(val, max) + "<nor>/</nor><hiy>" + max + '</hiy>]');
        }
        bar.css("width", Combat.CountWidth(val, max) + "%");
        if (Setting.show_damage && data.damage && data.id != Process.player) {
            var per = 0;
            if (data.damage == -1) {
                per = parseInt((max - val) * 1000 / max) / 10;
            } else {
                per = parseInt(data.damage * 1000 / max) / 10;
            }
            bar = item.find(".item-damage");
            if (!bar.length) {
                bar = $('<span class="item-damage">[<hiy>0%</hiy>]<span>').appendTo(item.find('.item-name'));
            }
            bar.html("[<hiy>" + per + '%</hiy>]');
        }

    }

    , CountWidth: function (d1, d2) {
        if (d2 == 0) return 0;
        var d = d1 * 100 / d2;
        if (d >= 100) return 100;
        if (d < 0) return 0;
        return d;
    }, Perform: function () {
        var elem = $(this);
        if (elem.is("disable")) return;
        var pfmid = elem.attr("pid");
        if (!pfmid) return;
        SendCommand("perform " + pfmid);
        //  Combat.On_Perform({ id: pfmid });
    },
    STATUS: {},
    AppendStatusItem: function (id, elem, status) {
        var stitem = { elem: elem, items: {} };
        if (status) {
            for (var i = 0; i < status.length; i++) {
                this.StatusItem_add(stitem, status[i]);
            }
        }
        this.STATUS[id] = stitem;
    }
    , StatusItemChanged: function (data) {

        var func = Combat["StatusItem_" + data.action];
        func && func.call(Combat, this.STATUS[data.id], data);

    }, StatusItem_add: function (statu_item, item) {
        if (!statu_item) return;
        var str = [];
        str.push('<span class="status-item');
        if (item.downside) {
            str.push(" downside");
        }
        str.push('" sid="');
        str.push(item.sid);
        str.push('">');
        str.push(item.name);
        if (item.count != undefined) {
            str.push("x");
            str.push(item.count);
        }
        str.push('<span class="shadow"></span></span>');
        statu_item.items[item.sid] = {
            elem: $(str.join("")).appendTo(statu_item.elem)[0],
            name: item.name,
            count: item.count,
            duration: item.duration,
            anitime: item.duration - (item.overtime || 0)
        };
        if (item.duration > 0)
            Combat.StatusItemANI(statu_item.items[item.sid]);
    },
    StatusItem_remove: function (player_status, data) {
        if (!player_status) return;
        var ids = data.sid;
        if (typeof ids == "string") ids = [ids];
        for (var i = 0; i < ids.length; i++) {
            var item = player_status.items[ids[i]];
            if (item) {
                $(item.elem).remove();
                item.handler && clearTimeout(item.handler);
                delete player_status.items[ids[i]];
            }
        }

    },
    StatusItem_refresh: function (player_status, data) {
        if (!player_status) return;
        var item = player_status.items[data.sid];
        if (!item) return;
        var text = item.elem.firstChild;
        var shadow = item.elem.lastChild;
        item.count = data.count;
        item.elem.innerHTML = item.name + "x" + item.count + shadow.outerHTML;
        item.handler && clearTimeout(item.handler);
        item.anitime = item.duration;
        Combat.StatusItemANI(item);
    }, StatusItem_override: function (player_status, data) {

        var item = player_status.items[data.sid];
        if (!item) return;
        item.handler && clearTimeout(item.handler);
        item.anitime = item.duration;
        Combat.StatusItemANI(item);
    },
    StatusItem_clear: function (player_status, data) {
        if (!player_status) return;
        for (var sid in player_status.items) {
            var item = player_status.items[sid];
            if (item) {
                $(item.elem).remove();
                clearTimeout(item.handler);
            }
        }
        player_status.items = {};
    },
    StatusItemANI: function (item) {
        var shadow = item.elem.lastChild;
        var p = item.anitime * 100 / item.duration;
        if (p < 0) p = 0;
        shadow.style.right = p + "%";
        item.anitime = item.anitime - 1000;
        if (p > 0) {
            item.handler = setTimeout(Combat.StatusItemANI, 1000, item);
        } else {
            //elem.parent().remove();
            item.handler = 0;
        }

    }

};
export default Combat;
