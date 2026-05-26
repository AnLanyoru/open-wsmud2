

export default {
    DIRS: ["west", "north", "south", "east", "northwest", "southwest", "northeast", "southeast",
        "down", "up", "westdown", "northdown", "southdown", "eastdown", "westup", "northup", "southup", "eastup", "enter", "out"],
    REG: /<(\w+)>(.+)<\/\w+>/,
    CreateExitsMap: function (exits, w, name) {
        var str = name.split("-");
        if (str.length > 1) name = str[str.length - 1];
        name = name.replace(/\(.*?\)/, "");
        var unitY = 30;
        var unitX = 70;
        var unitW = 60;
        var unitH = 20;
        var height = unitY + 10;
        var l = (w - unitW) / 2, t = 10;
        var dirs = {};
        if (exits["north"] && exits["up"]) {
            exits["north_2"] = exits["up"];
            delete exits["up"];
        }
        if (exits["south"] && exits["down"]) {
            exits["south_2"] = exits["down"];
            delete exits["down"];
        }
        for (var dir in exits) {
            if (dir.indexOf("south") > -1 || dir == "down" || dir == "out") {
                dirs["s"] = true;
            } else if (dir.indexOf("north") > -1 || dir == "up" || dir == "enter") {
                dirs["n"] = true;
            }
        }
        if (dirs.s) height += unitY;
        if (dirs.n) {
            height += unitY;
            t += unitY;
        }
        var html = [];
        html.push('<svg style="margin-left:-2em" height="' + height + '" width="' + w + '">');
        html.push('<rect x="' + l + '" y="' + t + '"  fill="dimgrey" stroke-width="1" stroke="gray" ');
        html.push('width="' + unitW + '" height="' + unitH + '"></rect>');
        html.push(' <text x="' + (l + 30) + '" y="' + (t + 14) + '"  text-anchor="middle" style="font-size:12px;" ');
        this.pushName(html, name, true);
        for (var dir in exits) {
            var pos1, pos2, pos;
            switch (dir) {
                case "west":
                case "westup":
                case "westdown":
                    pos1 = [l - (unitX - unitW), t + unitH / 2];
                    pos2 = [l, t + unitH / 2];
                    pos = [l - unitX, t];

                    break;
                case "east":
                case "eastup":
                case "eastdown":
                    pos1 = [l + unitW, t + unitH / 2];
                    pos2 = [l + unitX, t + unitH / 2];
                    pos = [l + unitX, t];
                    break;
                case "south":
                case "southup":
                case "southdown":
                case "down":
                    pos1 = [l + unitW / 2, t + unitH];
                    pos2 = [l + unitW / 2, t + unitY];
                    pos = [l, t + unitY];
                    break;
                case "north":
                case "northup":
                case "northdown":
                case "up":
                    pos1 = [l + unitW / 2, t];
                    pos2 = [l + unitW / 2, t - (unitY - unitH)];
                    pos = [l, t - unitY];
                    break;
                case "northwest":
                    pos1 = [l - unitX + unitW, t - unitY + unitH];
                    pos2 = [l, t];
                    pos = [l - unitX, t - unitY];
                    break;
                case "northeast":
                case "north_2":
                case "enter":
                    pos1 = [l + unitX, t - unitY + unitH];
                    pos2 = [l + unitW, t];
                    pos = [l + unitX, t - unitY];
                    break;
                case "southeast":
                case "south_2":
                    pos1 = [l + unitX, t + unitY];
                    pos2 = [l + unitW, t + unitH];
                    pos = [l + unitX, t + unitY];
                    break;
                case "southwest":
                case "out":
                    pos1 = [l - unitX + unitW, t + unitY];
                    pos2 = [l, t + unitH];
                    pos = [l - unitX, t + unitY];
                    break;
            }
            var rm_name = exits[dir];
            if (dir == "south_2") dir = "down";
            else if (dir == "north_2") dir = "up";
            html.push('<rect x="' + pos[0] + '" y="' + pos[1] + '" dir="' + dir + '" fill="#232323" stroke-width="1" stroke="gray" ');
            html.push('width="' + unitW + '" height="' + unitH + '"></rect>');
            html.push(' <text x="' + (pos[0] + 30) + '" y="' + (pos[1] + 14) + '" dir="' + dir + '" text-anchor="middle" style="font-size:12px;"');
            this.pushName(html, rm_name, false);

            if (pos1) {
                html.push('<line  stroke="gray" ');
                html.push(" x1='" + pos1[0] + "' y1='" + pos1[1] + "' x2='" + pos2[0] + "' y2='" + pos2[1] + "'");
                if (dir.indexOf("up") > -1 || dir.indexOf("down") > -1) {
                    html.push(" stroke-dasharray='5,5'");
                    html.push(" stroke-width='10'");
                } else {
                    html.push(" stroke-width='1'");
                }
                html.push("></line >");
            }

        }

        html.push("</svg>");
        return html.join("");
    }, colors: {
        "hig": "#00FF00", "hir": "#FF0000", "him": "#FF00FF",
        "hic": "#00FFFF", "hiy": "#FFFF00", "red": "#800000",
        "wht": "#C0C0C0", "mag": "#800080", "red": "#800000"
        , "hiw": "#FFFFFF", "gre": "#008000", "blu": "#000080", "hib": "#0000FF"
    }, GetColor: function (name, issel) {
        return this.colors[name.toLowerCase()] || "dimgrey";
    },
    ShowMap: function (map, id) {
        if (!map) return;
        this.CurMapID = id;
        var html = [];
        var pos = this.getMinPos(map);
        var offX = 0 - pos.minX;
        var offY = 0 - pos.minY;
        var unitY = 50;
        var unitX = 100;
        var unitW = 60;
        var unitH = 20;
        var content = $(".map-panel");
        this.MapWidth = (pos.maxX + offX + 1) * unitX;
        var off_x = 0;
        var content_width = content.width();
        if (this.MapWidth < content_width) {
            off_x = (content_width - this.MapWidth) / 2;
            this.MapWidth = content_width;
        }
        this.MapHeight = (pos.maxY + offY + 1) * unitY;
        if (this.MapWidth < 0 || this.MapHeight < 0) return;
        var reg = /^([a-z]{1,2})(\d)?([d|l])?$/;
        html.push('<svg class="map" height="' + this.MapHeight + '" width="' + this.MapWidth + '">');
        for (var i = 0; i < map.length; i++) {
            html.push("<rect class='map-room' rm='" + map[i].id + "' ");

            var l = (map[i].p[0] + offX) * unitX + off_x + 20;
            var t = (map[i].p[1] + offY) * unitY + 20;
            html.push("x='" + l + "' y='" + t + "'");
            html.push(' fill="dimgrey" stroke-width="1" stroke="gray" ');
            html.push('width="' + unitW + '" height="' + unitH + '"></rect>');
            var exits = map[i].exits;
            if (exits) {
                for (var j = 0; j < exits.length; j++) {
                    reg.test(exits[j]);
                    var length = RegExp.$2 ? parseInt(RegExp.$2) : 1;
                    var pos1;
                    var pos2;
                    switch (RegExp.$1) {
                        case "w":
                            pos1 = [l - (unitX - unitW) - unitX * (length - 1), t + unitH / 2];
                            pos2 = [l, t + unitH / 2];
                            break;
                        case "e":
                            pos1 = [l + unitW, t + unitH / 2];
                            pos2 = [l + unitX + unitX * (length - 1), t + unitH / 2];
                            break;
                        case "s":
                            pos1 = [l + unitW / 2, t + unitH];
                            pos2 = [l + unitW / 2, t + unitY + unitY * (length - 1)];
                            break;
                        case "n":
                            pos1 = [l + unitW / 2, t];
                            pos2 = [l + unitW / 2, t - (unitY - unitH) - unitY * (length - 1)];
                            break;
                        case "nw":
                            pos1 = [l - length * unitX + unitW, t - length * unitY + unitH];
                            pos2 = [l, t];
                            break;
                        case "ne":
                            pos1 = [l + unitW, t];
                            pos2 = [l + length * unitX, t - (unitY - unitH)];
                            break;
                        case "se":
                            pos1 = [l + unitW, t + unitH];
                            pos2 = [l + length * unitX, t + length * unitY];
                            break;
                        case "sw":
                            pos1 = [l, t + unitH];
                            pos2 = [l - (unitX - unitW) - unitX * (length - 1), t + length * unitY];
                            break;
                    }
                    if (pos1) {
                        html.push('<line  stroke="gray" ');
                        html.push(" x1='" + pos1[0] + "' y1='" + pos1[1] + "' x2='" + pos2[0] + "' y2='" + pos2[1] + "'");
                        if (RegExp.$3) {
                            html.push(" stroke-dasharray='5,5'");
                        }
                        if (RegExp.$3 == "l") {
                            html.push(" stroke-width='10'");
                        } else {
                            html.push(" stroke-width='1'");
                        }
                        html.push("></line >");
                    }

                }

            }
            html.push(' <text x="' + (l + 30) + '" y="' + (t + 14) + '" text-anchor="middle" style="font-size:12px;" ');
            this.pushName(html, map[i].n, true);
        }
        html.push("</svg>");
        content.html(html.join(""));
        this.MapContent = $("svg");
        if (!this.IsShow) {
            this.IsShow = true;
            $(".map-panel").slideDown("fast");
        }
        this.SetRoom(this.Room);
    },
    pushName: function (html, rm_name, issel) {
        var mathch = this.REG.exec(rm_name);
        if (mathch) {
            html.push('  fill="' + this.GetColor(mathch[1]) + '"');
            html.push('>' + mathch[2] + '</text>');
        } else {
            html.push(' fill="');
            html.push(issel ? "#232323" : "dimgrey");
            html.push('">' + rm_name + '</text>');
        }
    },
    getMinPos: function (map) {
        var pos = {
            minX: 99999,
            minY: 99999,
            maxX: 0,
            maxY: 0
        };
        for (var i = 0; i < map.length; i++) {
            var x = map[i].p[0];
            var y = map[i].p[1];
            if (x < pos.minX) {
                pos.minX = x;
            } if (x > pos.maxX) pos.maxX = x;
            if (y < pos.minY) {
                pos.minY = y;
            } if (y > pos.maxY) pos.maxY = y;
        }
        return pos;
    },
    State: 0,
    ZoomState: 100,
    Buffer: {},
    HideItem: function () {
        if (this.State == 0) {
            this.State = 1;
            $(".room_desc").slideUp("fast");
        }
    },
    ShowItem: function () {
        if (this.State == 1) {
            this.State = 0;
            $(".room_desc").slideDown("fast");
        }
    }, ZoomIn: function (pars) {
        if (pars.zoom) return;
        this.ZoomState = this.ZoomState / pars.zoom;
        if (this.ZoomState > 200) this.ZoomState = 200;
        if (this.ZoomState < 80) this.ZoomState = 80;
        var pw = this.MapWidth * this.ZoomState / 100;
        var ph = this.MapHeight * this.ZoomState / 100;
        this.MapContent.attr("viewBox", "0,0," + pw + "," + ph);
    }, SetRoom: function (rm) {
        this.Room = rm;
        if (!this.IsShow) return;

        if (this.CurRoomItem) {
            this.CurRoomItem.attr("fill", "dimgrey");
            this.CurRoomItem.attr("stroke", "gray");
        }
        this.CurRoomItem = null;
        var item = this.MapContent.find("rect[rm='" + rm.path + "']");
        if (item.length) {
            this.CurRoomItem = item;
            this.CurRoomItem.attr("fill", "#bebebe");
            this.CurRoomItem.attr("stroke", "gray");
            var pos = [item.attr("x"), item.attr("y"), item.attr("width"), item.attr("height")];
            var elem = document.querySelector(".map-panel");
            var height = elem.offsetHeight;
            var width = elem.offsetWidth;
            elem.scrollTop = pos[1] - (height - pos[3]) / 2;
            elem.scrollLeft = pos[0] - (width - pos[2]) / 2;
        }
        var map_path = rm.path.substr(0, rm.path.lastIndexOf("/"));
        if (map_path != this.CurMapID) {
            if (this.Buffer[map_path]) {
                return this.ShowMap(this.Buffer[map_path], map_path);
            }
            SendCommand("map " + map_path);
        }
    },
    LoadMap: function () {
        if (this.IsShow) {
            this.IsShow = false;
            return $(".map-panel").slideUp("fast");
        }
        var rm = this.Room;
        if (!rm) return;
        var name = rm.path.substr(0, rm.path.lastIndexOf("/"));
        if (name == this.CurMapID) {
            $(".map-panel").slideDown("fast");
            this.IsShow = true;
            return;
        }
        if (this.Buffer[name]) {
            return this.ShowMap(this.Buffer[name], name);
        }
        SendCommand("map " + name);
    }, SetMapBuffer: function (maps, id) {
        this.Buffer[id] = maps;
    }, UpdateMap: function (mapid, data) {
        var map = this.Buffer[mapid];
        if (!map) return;
        if (!data.id) {
            this.Buffer[mapid] = null;
            if (this.CurMapID == mapid) this.CurMapID = null;
            return;
        }
        for (var i = 0; i < map.length; i++) {
            if (map[i].id == data.id) {
                map[i].n = data.n || map[i].n;
                map[i].p = data.p || map[i].p;
                map[i].exits = data.exits || map[i].exits;
                break;
            }
        }
        if (mapid == this.CurMapID) {
            this.ShowMap(map, mapid);
        }
    }
}
