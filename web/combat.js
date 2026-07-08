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
    def_actions: [{cmd: "dazuo", name: "打坐"},
        {cmd: "liaoshang", name: "疗伤"}],

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
        if (Combat.dis_pfms && Combat.dis_pfms.length > 0) {
            Combat.ANI_PFM();
        }
    },
    append_items: function (items, parent) {
        if (!items) return;
        for (let item of items) {
            item.elem =
                $(`<span class='act-item' cmd='${item.cmd}'>${item.name}<span class='cd-overlay'></span></span>`)
                    .appendTo(parent);
            item._overlay = item.elem.find(".cd-overlay");
            // 重绘后重置 CD 动画状态，强制 ANI_OBJ 下次 tick 重新 snap 到正确比例
            item._hadCD = false;
            // 仅在无活动动画时应用 disper（服务端初始静态状态）；
            // 有 _animId 时 disper 已过期，交由 ANI_OBJ tick 重新 snap
            if (item.disper > 0 && !item._animId) {
                item._overlay.css("transform", "scaleX(" + (item.disper / 100) + ")");
                item._hadCD = true;
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
                    if (item._animId) Combat._animUnregister(item._animId);
                    this.object_actions.splice(i, 1);
                    return item.elem.remove();
                } else {
                    this.ANI_OBJ(item, data.time);
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
    , ANI_OBJ: function (obj, time) {
        var end = Date.now() + time;
        obj._cdTotal = time;
        if (obj._animId) Combat._animUnregister(obj._animId);
        obj._animId = null;
        // 新 CD 开始，强制下次 tick 重新 snap（避免 stale disper 或 _hadCD 残留导致跳过 snap）
        obj._hadCD = false;
        var aid = Combat._animRegister(function (now) {
            var overlay = obj._overlay;
            if (!overlay) { obj._animId = null; return false; }
            var remaining = end - now;
            if (remaining > 0) {
                if (!obj._hadCD) {
                    // snap 到剩余比例位置：新 CD 时比例=1，重绘进行中 CD 时比例=remaining/_cdTotal
                    var startScale = obj._cdTotal > 0 ? Math.min(1, remaining / obj._cdTotal) : 1;
                    overlay.css("transition", "none");
                    overlay.css("transform", "scaleX(" + startScale + ")");
                    overlay[0].offsetHeight;
                }
                overlay.css("transition", "transform " + remaining + "ms linear");
                overlay.css("transform", "scaleX(0)");
                obj._hadCD = true;
            } else {
                overlay.css("transform", "scaleX(0)");
                obj._hadCD = false;
            }
            if (remaining <= 0) obj._animId = null;
            return remaining > 0;
        }, 1000);
        if (Combat._animItems[aid]) {
            obj._animId = aid;
        }
    }
    , create_skillItems: function (items) {
        var elem = $(".combat-commands").empty();
        if (!items.length) return;
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var html = [];
            html.push("<span class='pfm-item' pid='" + item.id + "'>");
            html.push(item.name);
            html.push("<span class='cd-overlay'></span>");
            html.push("</span>");
            item.elem = $(html.join("")).appendTo(elem);
            item._overlay = item.elem.find(".cd-overlay");
            item._cdEnd = undefined;
            item._hadCD = false;
            if (item.distime > 0) {
                if (!Combat.dis_pfms) Combat.dis_pfms = [];
                var found = false;
                for (var j = 0; j < Combat.dis_pfms.length; j++) {
                    if (Combat.dis_pfms[j].id == item.id) {
                        Combat.dis_pfms[j].distime = item.distime;
                        Combat.dis_pfms[j].end = Date.now() + item.distime;
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    Combat.dis_pfms.push({
                        id: item.id,
                        distime: item.distime,
                        end: Date.now() + item.distime
                    });
                }
                item._overlay.css("transition", "none");
                item._overlay.css("transform", "scaleX(1)");
                item._hadCD = true;
            }
        }
    }, ChangeDistime: function (data) {
        var pfmid = data.id;
        for (var j = 0; j < Combat.dis_pfms.length; j++) {
            if (Combat.dis_pfms[j].id == pfmid) {
                Combat.dis_pfms[j].end += data.time;
                break;
            }
        }
    }, ClearDistime: function (data) {
        if (!Combat.dis_pfms) return;
        var pfmid = data.id;
        for (var j = 0; j < Combat.dis_pfms.length; j++) {
            if (!pfmid || Combat.dis_pfms[j].id == pfmid) {
                Combat.dis_pfms[j].end = 0;
            }

        }
    }, SetDistime: function (data) {
        var pfmid = data.id;
        // 过滤未装备技能：Skills 已加载时，忽略不在其中的技能 CD
        if (Combat.Skills && Combat.Skills.length > 0) {
            var found = false;
            for (var si = 0; si < Combat.Skills.length; si++) {
                if (Combat.Skills[si].id == pfmid) { found = true; break; }
            }
            if (!found) return;
        }
        if (!Combat.dis_pfms) Combat.dis_pfms = [];
        var now = Date.now();
        for (var j = 0; j < Combat.dis_pfms.length; j++) {
            if (Combat.dis_pfms[j].id == pfmid) {
                Combat.dis_pfms[j].distime = data.distime;
                Combat.dis_pfms[j].end = now + data.distime;
                Combat.ANI_PFM();
                return;
            }
        }
        Combat.dis_pfms.push({
            id: pfmid,
            distime: data.distime,
            end: now + data.distime
        });
        Combat.ANI_PFM();
    }, redisable: function () {
        // 重置：清空独立 CD 和全局冷却
        Combat.dis_pfms = [];
        Combat.end = 0;
        Combat.ANI_PFM();
    }, On_Perform: function (data) {
        // 无 id 或 id="all"：全局冷却，只读 rtime
        if (!data.id || data.id === 'all') {
            if (data.rtime) {
                var now = Date.now();
                var newEnd = now + data.rtime;
                if (!this.dis_pfms) this.dis_pfms = [];
                // 只保留结束时间晚于全局的独立 CD，其余移除走全局显示
                var saved = [];
                for (var i = 0; i < this.dis_pfms.length; i++) {
                    if (this.dis_pfms[i].end > newEnd) {
                        saved.push(this.dis_pfms[i]);
                    }
                }
                Combat.dis_pfms = saved;
                Combat.distime = data.rtime;
                Combat.end = newEnd;
            }
            // rtime 为 0 时：无全局冷却，保留已有独立 CD，仅确保动画在跑
            Combat.ANI_PFM();
            return;
        }
        // 指定 id：单技能冷却（兼容旧协议，实际单技能 CD 已由 setDistime 处理）
        data.rtime = data.rtime || 0;
        data.distime = data.distime || 0;
        if (!this.dis_pfms) this.dis_pfms = [];
        var now2 = Date.now();
        for (var i = 0; i < this.dis_pfms.length; i++) {

            if (this.dis_pfms[i].id == data.id) {
                data.id = null;
                this.dis_pfms[i].distime = data.distime;
                this.dis_pfms[i].end = now2 + data.distime;
                continue;
            }
            if (this.dis_pfms[i].end < now2 + data.rtime) {
                this.dis_pfms[i].end = now2 + data.rtime;
            }
        }
        if (data.id) {
            this.dis_pfms.push({
                id: data.id,
                distime: data.distime,
                end: now2 + data.distime
            });
        }
        Combat.end = Combat.end ?? 0;
        if (now2 + data.rtime > Combat.end) {
            Combat.distime = data.rtime;
            Combat.end = now2 + data.rtime;
        }
        Combat.ANI_PFM();
    },
    // 统一动画循环：合并 ANI_PFM、ANI_OBJ、StatusItemANI 的独立 setTimeout 链
    _animItems: {},
    _animTimer: null,
    _animNextId: 0,
    _animRegister: function (update, interval) {
        var id = ++Combat._animNextId;
        Combat._animItems[id] = { update: update, interval: interval, lastRun: 0 };
        if (!Combat._animTimer) Combat._animTick();
        // 立即执行首帧，避免短冷却动画因 tick 延迟错过初始全遮罩状态
        if (update(Date.now()) === false) {
            delete Combat._animItems[id];
        }
        return id;
    },
    _animUnregister: function (id) {
        delete Combat._animItems[id];
    },
    _animTick: function () {
        var now = Date.now();
        var hasActive = false;
        for (var id in Combat._animItems) {
            var item = Combat._animItems[id];
            if (now - item.lastRun >= item.interval) {
                item.lastRun = now;
                if (item.update(now) === false) {
                    delete Combat._animItems[id];
                } else {
                    hasActive = true;
                }
            } else {
                hasActive = true;
            }
        }
        if (hasActive) {
            Combat._animTimer = setTimeout(Combat._animTick, Combat.PFM_INTERVAL);
        } else {
            Combat._animTimer = null;
        }
    },
    PFM_INTERVAL: 500,
    // CD 冷却动画（注册至统一动画循环，按 PFM_INTERVAL tick）
    ANI_PFM: function () {
        if (Combat._pfmAnimId && Combat._animItems[Combat._pfmAnimId]) {
            // 已有动画循环在跑，强制立即执行一次更新以即时反映新 CD
            Combat._animItems[Combat._pfmAnimId].update(Date.now());
            return;
        }
        Combat._pfmAnimId = null;
        var animId = Combat._animRegister(function (now) {
                // 清理过期条目（end 已过期的独立 CD）
                for (var j = Combat.dis_pfms.length - 1; j >= 0; j--) {
                    if (Combat.dis_pfms[j].end <= now) {
                        Combat.dis_pfms.splice(j, 1);
                    }
                }
                // 每技能渲染：线性时间驱动 CSS transition，500ms tick 仅做校准
                if (Combat.Skills) {
                    for (var i = 0; i < Combat.Skills.length; i++) {
                        var skill = Combat.Skills[i];
                        // 计算技能独立 CD 剩余时间（ms）及总时长
                        var remaining = 0;
                        var distime = 0;
                        for (var j = 0; j < Combat.dis_pfms.length; j++) {
                            if (Combat.dis_pfms[j].id == skill.id && Combat.dis_pfms[j].distime) {
                                remaining = Combat.dis_pfms[j].end - now;
                                distime = Combat.dis_pfms[j].distime;
                                break;
                            }
                        }
                        // 无独立 CD 则走全局冷却
                        if (remaining <= 0) {
                            remaining = Combat.end > now ? Combat.end - now : 0;
                            distime = Combat.distime || 0;
                        }
                        if (remaining > 0) {
                            // 用到期时间戳判断是否需要 snap：时间变化 = 新 CD / CD 刷新 / 重绘
                            var effectiveEnd = now + remaining;
                            if (skill._cdEnd !== effectiveEnd) {
                                // snap 到剩余比例位置：新 CD 时比例=1，重绘进行中 CD 时比例=remaining/distime
                                var startScale = distime > 0 ? Math.min(1, remaining / distime) : 1;
                                skill._overlay.css("transition", "none");
                                skill._overlay.css("transform", "scaleX(" + startScale + ")");
                                skill._overlay[0].offsetHeight;
                                skill._cdEnd = effectiveEnd;
                            }
                            // 过渡时长 = 剩余 ms，CSS 自行跑完全程，tick 只负责校准
                            skill._overlay.css("transition", "transform " + remaining + "ms linear");
                            skill._overlay.css("transform", "scaleX(0)");
                            skill._hadCD = true;
                        } else {
                            skill._overlay.css("transform", "scaleX(0)");
                            skill._hadCD = false;
                            skill._cdEnd = 0;
                        }
                    }
                }
                // 有活动冷却则继续循环，否则置空 ID 等待下次注册
                var hasActive = Combat.end > now || Combat.dis_pfms.length > 0;
                if (!hasActive) Combat._pfmAnimId = null;
                return hasActive;
            }, Combat.PFM_INTERVAL);
        if (Combat._animItems[animId]) {
            Combat._pfmAnimId = animId;
        }
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
        // 清理旧状态条目（换地图/刷新时避免动画泄漏）
        var old = this.STATUS[id];
        if (old) {
            this.StatusItem_clear(old);
        }
        var stitem = {elem: elem, items: {}};
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
            end: Date.now() + item.duration - (item.overtime || 0)
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
                if (item._animId) Combat._animUnregister(item._animId);
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
        if (item._animId) Combat._animUnregister(item._animId);
        item._hadStatus = false;
        item.end = Date.now() + item.duration;
        Combat.StatusItemANI(item);
    }, StatusItem_override: function (player_status, data) {

        var item = player_status.items[data.sid];
        if (!item) return;
        if (item._animId) Combat._animUnregister(item._animId);
        item._hadStatus = false;
        item.end = Date.now() + item.duration;
        Combat.StatusItemANI(item);
    },
    StatusItem_clear: function (player_status, data) {
        if (!player_status) return;
        for (var sid in player_status.items) {
            var item = player_status.items[sid];
            if (item) {
                $(item.elem).remove();
                if (item._animId) Combat._animUnregister(item._animId);
            }
        }
        player_status.items = {};
    },
    // 状态倒计时：统一动画循环驱动，用 Date.now() 与 item.end 差值计算进度
    // 用 _statusEnd 时间戳替代 _hadStatus 布尔值判断是否需要 snap：
    // end 变化 → 新 buff / 刷新 → snap 到比例位置；end 相同 → tick 校准 → 不 snap
    StatusItemANI: function (item) {
        var shadow = item.elem.lastChild;
        if (item._animId) Combat._animUnregister(item._animId);
        item._animId = null;
        var aid = Combat._animRegister(function (now) {
            var remaining = item.end - now;
            if (remaining < 0) remaining = 0;
            if (remaining > 0) {
                if (item._statusEnd !== item.end) {
                    // 新 buff 或刷新：根据已过时间计算比例起始位置，避免带 overtime 时从头开始
                    var elapsed = item.duration - remaining;
                    var startScale = elapsed > 0 ? Math.min(1, elapsed / item.duration) : 0;
                    shadow.style.transition = "none";
                    shadow.style.transform = "scaleX(" + startScale + ")";
                    shadow.offsetHeight;
                    item._statusEnd = item.end;
                }
                shadow.style.transition = "transform " + remaining + "ms linear";
                shadow.style.transform = "scaleX(1)";
                item._hadStatus = true;
            } else {
                shadow.style.transform = "scaleX(1)";
                item._hadStatus = false;
                item._statusEnd = 0;
            }
            if (remaining <= 0) {
                item._animId = null;
                return false;
            }
            return true;
        }, 1000);
        if (Combat._animItems[aid]) {
            item._animId = aid;
        }
    }

};
export default Combat;
