
import MAP from '../map.js';

export default {
    onData: function (data) {
        Dialog.title(data.title || "地图");
    },
    init: function () {

    },
    show: function () {
        Dialog.init();
        var rm = MAP.Room.name;
        var index = rm.indexOf('-');
        if (index > -1) {
            rm = rm.substr(0, index);
        }
        Dialog.title(rm);
        Dialog.footer("");
        this.element = $(".map");
        Dialog.contentElement.append(this.element);
        Dialog.icon("map-marker");
        Dialog.iconElement.attr("class", "dialog-icon glyphicon glyphicon-map-marker");

    },
    hide: function () {
        this.element.remove();
        if ($(".map-panel").children().length == 0)
            this.element.appendTo(".map-panel");

    },
    close: function () {
        this.hide();
    }
};
