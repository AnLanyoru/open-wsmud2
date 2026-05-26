

let tools = null;
let hideTool = null;
let bottom_tools = null;
let ToolState = 0;
let ToolOpacity = 0;
let ToolSpeed = 0;

export function InitTools() {
    if (!tools) {
        tools = $(".right-bar>.tool-item");
        hideTool = $(".br-tool");
        bottom_tools = $('.bottom-bar>.tool-item');
    }
}

export function ShowTools() {
    InitTools();
    if (ToolState == 1) return;
    if (ToolState == 0) {//显示
        for (var i = 0; i < tools.length; i++) {
            tools[i].style.display = "";
            tools[i].style.opacity = 0;
        }
        ToolSpeed = 200;
        ToolOpacity = 0;
        $(hideTool).removeClass("hide-tool");
    } else {//隐藏
        ToolOpacity = 100;
        ToolSpeed = 100;
        $(hideTool).addClass("hide-tool");
    }
    window.setTimeout(ShowToolsAnimate.bind(null, ToolState), 100);
    ToolState = 1;
}

export function ShowToolsAnimate(type) {
    if (type == 0) {
        ToolOpacity = ToolOpacity + ToolSpeed;
        var to = ToolOpacity;
        for (var i = tools.length - 1; i >= 0; i--) {
            if (to < 0) tools[i].style.opacity = 0;
            else if (to > 100) tools[i].style.opacity = 1;
            else tools[i].style.opacity = to / 100;
            to -= 20;
            if (to < 0) break;
        }
        ToolOpacity -= 30;
        if (to < 100) {
            window.setTimeout(ShowToolsAnimate.bind(null, type), 100);
        } else {
            ToolState = 2;
        }
    } else {
        ToolOpacity = ToolOpacity - ToolSpeed;
        var to = ToolOpacity;
        for (var i = 0; i < tools.length; i++) {
            if (to < 0) tools[i].style.opacity = 0;
            else if (to > 100) tools[i].style.opacity = 1;
            else tools[i].style.opacity = to / 100 * 1;
            to += 20;
            if (to >= 100) break;
        }
        ToolOpacity -= 20;
        if (to >= 0) {
            window.setTimeout(ShowToolsAnimate.bind(null, type), 100);
        } else {
            ToolState = 0;
            for (var i = 0; i < tools.length; i++) {
                tools[i].style.display = "none";
            }
        }
    }
}

export function showFlag(cmd, val) {
    InitTools();
    if (val < 0) val = 0;
    else if (val > 99) val = 99;
    let tool = tools.filter("[command='" + cmd + "']");
    if (!tool.length)
        tool = bottom_tools.filter("[command='" + cmd + "']");
    if (val) {
        tool.find(".tag").removeClass("hide");
    } else {
        tool.find(".tag").addClass("hide");
    }
}
