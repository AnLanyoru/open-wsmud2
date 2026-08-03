function refreshTypographyLayout() {
    // 各模块在自己的布局调度器中合并下一帧的测量，这里不再额外延迟两帧。
    window.dispatchEvent(new Event("menu-layout-change"));
    Dialog.pack?.schedule_footer_layout?.();
    Dialog.stats?.schedule_footer_layout?.();
}

const Setting = {
    keep_msg: 0,
    show_hpnum: 0,
    show_hp: 0,
    item_autoheight: 0,
    item_firstme: 0,
    hide_roomdesc: 0,
    exits_dir: 0,
    show_sa: 0,
    show_command: 0,
    show_send: 0,
    fontsize: "0.875rem",
    font: "",
    no_spmsg: 0,
    fontcolor: "#008000",
    backcolor: "black",
    auto_showcombat: 0,
    auto_sortitem: 0,
    auto_hideroom: 0,
    show_roomitem: 0,
    fullscreen: 0,
    channel_chat: 1,
    channel_tm: 1,
    channel_fam: 1,
    channel_es: 1,
    ban_pk: 0,
    off_plist: 0,
    combat_wrap: 0,
    combat_size: "1em",
    dialog_size: "1em",
    menu_size: "1em",
    w_type: "reflow",
    action_wrap: 0,
    off_hp: 0,
    show_damage: 0,
    no_master: 0,
    no_team: 0,
    top_safe_distance: 0,
    bottom_safe_distance: 0,
    float_dialog: 0,
    float_archive: 0,
    theme: "dark",
    no_load: true,
    show_binary: 0,
    load: function (data) {
        Dialog.keys.init_key();
        Dialog.extend.init_extend();
        if (data) {
            for (var key in data) {
                if (key == "fullscreen") {
                    continue;
                }
                this.set_prop(key, data[key]);
                this[key] = data[key];
            }
        }
        this.loadLocal();
    },
    loadLocal: function () {
        var localKeys = ["top_safe_distance", "bottom_safe_distance", "float_archive", "theme", "show_binary"];
        for (var i = 0; i < localKeys.length; i++) {
            var val = localStorage.getItem("ui_" + localKeys[i]);
            if (val !== null) {
                if (localKeys[i] === "theme") {
                    this[localKeys[i]] = val;
                    this.set_prop(localKeys[i], val);
                } else {
                    var num = parseInt(val) || 0;
                    this[localKeys[i]] = num;
                    this.set_prop(localKeys[i], num);
                }
            }
        }
    }, set_prop: function (key, value) {
        switch (key) {
            case "fontsize":
                $(".container").css("font-size", value);
                $(".dialog-confirm").css("font-size", value);
                refreshTypographyLayout();
                // $(".right-bar")[0].style.bottom = ($(".combat-panel").height() + $(".bottom-bar").height()) + "px";
                break;
            case "font":
                if (value === 'none') value = "";
                $(".container").css("font-family", value);
                refreshTypographyLayout();
                break;
            case "combat_size":
                $(".content-bottom").css("font-size", value);
                break;
            case "dialog_size":
                $(".dialog").css("font-size", value);
                refreshTypographyLayout();
                break;
            case "show_sa":
                Combat.refActions();
                break;
            case "menu_size":
                $(".bottom-bar").css("font-size", value);
                refreshTypographyLayout();
                break;
            case "w_type":
                window.dispatchEvent(new Event("menu-layout-change"));
                break;
            case "fontcolor":
                $(document.body).css("color", value);
                break;
            case "backcolor":
                $(document.body).css("background-color", value);
                break;
            case "hide_roomdesc":
                if (value)
                    $(".room_desc").hide()
                else
                    $(".room_desc").show();
                break;
            case "exits_dir":
                Process.exits();
                break;
            case "off_hp":
                if (value) {
                    $('.item-status').hide();
                } else {
                    $('.item-status').show();
                }
                break;
            case "combat_wrap":
                if (value) {
                    $(".combat-commands").addClass('combat-wrap');
                } else {
                    $(".combat-commands").removeClass('combat-wrap');
                }
                break;
            case "action_wrap":
                if (value) {
                    $(".room-commands").addClass('combat-wrap');
                } else {
                    $(".room-commands").removeClass('combat-wrap');
                }
                break;
            case "item_autoheight":
                if (value) $(".room_items").removeAttr("style");
                else $(".room_items").attr("style", "max-height: 8rem; overflow-y: auto;");
                break;
            case "item_firstme":
                if (value != 1) {
                    var elem = $(".room_items>.room-item[itemid='" + Process.player + "']");
                    $(".room_items").prepend(elem);
                }
                break;
            case "show_hp":
                if (!Combat.IsShow) {
                    if (value == 1)
                        $(".room-item>.item-status").show();
                    else
                        $(".room-item>.item-status").hide();
                }
                break;
            case "show_hpnum":
                Process.cur_room && Process.items(Process.cur_room);
                break;
            case "show_damage":
                $('.item-damage').remove();
                break;
            case "fullscreen":
                if (value) {
                    Setting.launchFullScreen();
                } else {
                    Setting.exitFullscreen();
                }
                break;
            case "show_command":
                Process.itemsElement.find(".item-commands").remove();
                break;
            case "no_spmsg":
                if (value) {
                    Process.ChannelElement.hide();
                } else {
                    Process.ChannelElement.show();
                }
                break;
            case "top_safe_distance":
                $(".container").css("padding-top", value + "px");
                break;
            case "bottom_safe_distance":
                $(".container").css("padding-bottom", value + "px");
                break;
            case "theme":
                document.body.setAttribute("data-theme", value);
                break;

        }
    },
    save: function (key, value) {
        this[key] = value;

        this.set_prop(key, value);
        if (key === "theme" || key === "float_archive") {
            localStorage.setItem("ui_" + key, value);
        } else {
            SendCommand("setting " + key + " " + value);
        }
    },
    launchFullScreen: function (element) {
        element = element || document.documentElement;
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
    },
    exitFullscreen: function () {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    },
    toggleBinary: function () {
        this.show_binary = this.show_binary ? 0 : 1;
        localStorage.setItem("ui_show_binary", this.show_binary);
        ReceiveMessage('<hiy>二进制分析模式：' + (this.show_binary ? '开启' : '关闭') + '</hiy>');
    }
}
export default Setting;
