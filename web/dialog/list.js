import Util from '../utils/util.js';

export default {
    init: function () {
        Dialog.pack.init();
    },
    onBackgroundData: function (data) {
        if (data.store === undefined || data.store === 0) return false;
        this.updateitem(data);
        return true;
    },
    hide: function () {
        this.element.remove();
        this.isShow = false;
    },
    close: function () {
        this.hide();
    },
    updateitem: function (data) {
        if (data.store !== undefined && data.store !== 0) {
            var source_pack = this.get_source_pack(data);
            if (!this.stores || !this.isShow) {
                if (!source_pack) return true;
                var result = source_pack.updateitem({remove: data.store, id: data.id});
                // 取出到一个新堆叠时，增量消息没有完整物品元数据，刷新背包以免漏项。
                if (data.store < 0) this.refresh_source_pack(data);
                return result;
            }
            var item = this.find_item(1, data.id, source_pack ? source_pack.items : []);
            var store_item = this.find_item(3, data.storeid);
            var update_store = !this.is_store_filtered
                || data.otype === undefined
                || data.otype === this.selected_type;
            if (!item) {
                if (data.store > 0 || !store_item || !source_pack) {
                    if (source_pack) this.refresh_source_pack(data);
                    if (this.is_store_filtered) SendCommand('store ' + this.selected_type);
                    if (!store_item) return;
                } else {
                    item = Object.assign({}, store_item);
                    item.id = data.id;
                    item.count = (-data.store);
                    source_pack.items.push(item);
                }
            } else {
                item.count -= data.store;
            }
            if (update_store) {
                if (!store_item) {
                    if (!item) return;
                    store_item = Object.assign({}, item);
                    store_item.id = data.storeid;
                    store_item.count = data.store;
                    this.stores.push(store_item);
                } else {
                    store_item.count += data.store;
                }
                if (store_item.count <= 0) this.stores.Remove(store_item);
            }
            if (data.sum !== undefined) this.store_count = data.sum;
            else if (!this.is_store_filtered) this.store_count = this.stores.length;
            if (item && item.count <= 0) source_pack.items.Remove(item);

        } else if (data.sell) {
            var item = this.find_item(2, data.id);
            if (item) {
                if (item.count !== -1) item.count -= data.sell;
                var currency = data.gongji ?? data.jungong ?? data.yaoyuan ?? data.mvalue;
                if (currency >= 0) {
                    this.gongji = currency;
                    this.show_footer(currency);
                }
                return this.create_items(
                    this.selllist,
                    this.leftElement,
                    2,
                    this.selllist.length,
                );
            }
        }
        if (this.isstore && this.isShow) {
            this.create_items(this.stores, this.leftElement, 3,
                Math.max(this.max_store_count, 100));// this.max_store_count

            Dialog.title("你的仓库中有" + this.store_count + "/" + this.max_store_count + "件物品");
        }
        this.update_pack();
        if (data.money != undefined) this.show_footer(data.money);
    }, get_source_pack: function (data) {
        if (!data.sourceid) return Dialog.pack;
        if (Dialog.pack2?.id === data.sourceid) return Dialog.pack2;
    }, refresh_source_pack: function (data) {
        SendCommand(data.sourceid ? ('pack ' + data.sourceid) : 'pack');
    }, find_item: function (otype, id, pack_items) {
        var items = pack_items || Dialog.pack.items || [];
        if (otype == 2) items = this.selllist;
        else if (otype == 3) items = this.stores;
        for (var i = 0; i < items.length; i++) {
            if (items[i].id == id) {
                return items[i];
            }
        }
    }, formatItems: function (data) {
        let items = [];
        for (let item of data) {
            items.push({
                name: item[0], id: item[1],
                count: item[2], grade: item[3],
                unit: item[4], value: item[5]
            });
        }
        return items;
    }, onData: function (data) {
        if (data.id) {
            return this.updateitem(data);
        }
        var gongji = data.gongji ?? data.jungong ?? data.yaoyuan ?? data.mvalue;
        if (data.selllist) {
            this.show();
            this.isstore = false;
            this.gongji = gongji;
            this.money_name = null;
            this.typeElement.hide();
            this.selllist = this.formatItems(data.selllist);
            if (data.gongji >= 0) this.money_name = '门派功绩';
            else if (data.jungong >= 0) this.money_name = "军功";
            else if (data.yaoyuan >= 0) this.money_name = "<ord>妖元</ord>";
            else this.money_name = data.mtype;
            this.create_items(this.selllist, this.leftElement, 2, this.selllist.length);
            Dialog.titleElement.html(data.title);
            Dialog.icon("shopping-cart");
            if (data.seller) this.seller = data.seller;
            this.update_pack();
        } else if (data.stores) {
            this.show();
            this.typeElement.show();
            this.isstore = true;
            this.stores = Dialog.pack.formatItems(data.stores);
            this.is_store_filtered = data.filtered !== undefined
                ? Boolean(data.filtered)
                : data.max_store_count > 200;
            var selected_type = parseInt(data.otype);
            this.selected_type = selected_type >= 0 && selected_type <= 4 ? selected_type : 0;
            var type_elems = this.typeElement.children();
            type_elems.removeClass('select');
            $(type_elems[this.selected_type]).addClass('select');
            if (this.is_store_filtered) {
                this.typeElement.show();
            } else {
                this.typeElement.hide();
            }
            this.store_count = data.sum ?? data.stores.length;
            this.create_items(this.stores, this.leftElement, 3,
                Math.max(data.max_store_count, 100));
            this.leftElement[0].scrollTop = 0;
            Dialog.titleElement.html("你的仓库中有" + this.store_count + "/"
                + data.max_store_count + "件物品");
            this.max_store_count = data.max_store_count;
            Dialog.icon("lock");
            this.update_pack();
        }
        if (gongji >= 0) {
            this.gongji = gongji;
            this.show_footer(gongji);
        }
    },
    show: function (data) {
        if (!Dialog.isShow || Dialog.curItem != "list")
            Dialog.show("list");
        if (this.rightElement) {
            this.rightElement.show();
            if (Dialog.pack.objelement) Dialog.pack.objelement.remove();
        }
        if (this.isShow) return;
        if (!this.element) {
            this.element = $('<div class="dialog-list"><div class="otype-list"><div class="otype-item select" otype="0">道具</div><div class="otype-item"  otype="1">秘籍</div><div class="otype-item" otype="2">宝石</div><div class="otype-item" otype="3">资源</div><div class="otype-item" otype="4">装备</div></div><div class="trade-list"></div><div class="obj-list"></div></div >');
            var children = this.element.children();
            this.typeElement = $(children[0])
            this.typeElement.hide();
            this.leftElement = $(children[1]);
            this.rightElement = $(children[2]);
        }
        this.element.on("click", ".obj-item", Dialog.list.item_click);
        this.element.on("click", ".otype-item", Dialog.list.otype_click);
        this.element.appendTo(Dialog.contentElement.empty());
        this.isShow = true;

    },
    selected_type: 0,
    otype_click: function () {
        let type = $(this).attr('otype');
        let index = parseInt(type);
        let store = Dialog.list;
        if (!store.stores) return;
        if (!(index >= 0 && index <= 4)) return;
        if (index === store.selected_type) return;
        let type_elems = store.typeElement.children();
        $(type_elems[store.selected_type]).removeClass('select');
        store.selected_type = parseInt(type);
        $(type_elems[index]).addClass('select');
        SendCommand('store ' + index);
    },
    show_footer: function (money) {
        money = this.money_name ? this.gongji : money;
        let cmd = this.isstore ? "store" : "sell";
        if (this.isstore) {
            var str = this.money_name ? ("你目前有" + money + "<hiy>"
                + this.money_name + "</hiy>") : ("你身上有" + Util.moneyToStr(money));
            Dialog.footerElement.html("<div class='inventory-footer'>"
                + "<div class='inventory-footer-money'>" + str + "</div>"
                + "<div class='inventory-footer-actions'>"
                + "<span cmd='#menu pack'>背包</span>"
                + "<span cmd='" + cmd + " all'>存仓库</span></div></div>");
            Dialog.pack.schedule_footer_layout();
        } else {
            var str = this.money_name ? ("你目前有" + money + "<hiy>"
                + this.money_name + "</hiy>") : ("你身上有" + Util.moneyToStr(money));
            Dialog.footerElement.html("<div class='obj-money'>" + str + "<span cmd='" + cmd + " all'>清理杂物</span></div>");
        }
    }, update_pack: function () {
        var items = Dialog.pack.items;
        if (!items) SendCommand("pack");
        else {
            this.create_items(items, this.rightElement, 1, Dialog.pack.max_count);
            this.show_footer(Dialog.pack.money);
        }

    },
    create_items: function (items, elem, otype, max_count) {
        var html = [];
        //otype 1自己的物品 2，贩卖的物品
        var list = items;
        if (otype === 1 || otype === 3) {
            list = Dialog.pack.sort_items(items);
        }
        for (var i = 0; i < max_count; i++) {
            var item = list[i];
            // if (otype === 3 && item
            //     && item.otype !== this.selected_type) continue;
            html.push('<div class="obj-item');
            if (item) {
                html.push(item.is_lock ? " lock" : "", ' grade', item.grade);
                html.push('" obj="');
                html.push(item.id);
                html.push('" otype="')
                html.push(otype);
                html.push('">');
                if (otype === 1) {
                    html.push('<span class="grade', item.grade, '">');
                    html.push(item.name);
                    html.push('</span>');
                } else {
                    html.push(item.name);
                }
                html.push("<span class='obj-value'>");
                if (otype == 2) {
                    html.push("每");
                    html.push(item.unit);
                    html.push(this.money_name ? (item.value + "<hiy>" + this.money_name + "</hiy>")
                        : Util.moneyToStr(item.value));
                    if (item.count == -1) {
                        html.push("：大量现货");
                    } else {
                        html.push("：剩余");
                        html.push(item.count);
                        html.push(item.unit);
                    }

                } else if (otype === 1 && !this.isstore) {
                    if (item.value) {
                        html.push("每");
                        html.push(item.unit);
                        html.push(Util.moneyToStr(item.value));
                        html.push("：");
                        html.push(item.count);
                        html.push(item.unit);
                    } else {
                        html.push("不可出售");
                    }

                } else if (item.count > 1) {
                    html.push(item.count);
                    html.push(item.unit);
                }
                html.push('</span>');
            } else {
                html.push('">');
            }

            html.push('</div>');
        }
        elem.html(html.join(""));

    }
    , item_click: function () {
        var elem = $(this);
        var obj = elem.attr("obj");
        var otype = elem.attr("otype");
        var item = Dialog.list.find_item(otype, obj);
        if (!item) return;
        var html = ["<div class='item-commands'>"];
        if (Dialog.list.isstore) {
            if (otype == 3) {
                html.push('<span cmd="checkobj ' + obj + ' from ' + "store" + '">查看</span>');
                html.push('<span cmd="_confirm qu ' + obj + '">取出</span>');
            } else if (otype == 1) {
                html.push('<span cmd="checkobj ' + obj + ' from item">查看</span>');
                html.push('<span cmd="_confirm store ' + item.count + ' ' + obj + '">存到仓库</span>');
            }
        } else {
            if (otype == 2) {
                html.push('<span cmd="checkobj ' + obj + ' from ' + Dialog.list.seller + '">查看</span>');
                if (item.count)
                    html.push('<span cmd="_confirm buy ' + item.count + ' ' + obj + ' from ' + Dialog.list.seller + '">购买</span>');
            } else if (otype == 1) {

                html.push('<span cmd="checkobj ' + obj + ' from item">查看</span>');
                html.push('<span cmd="_confirm sell ' + item.count + ' ' + obj + ' to ' + Dialog.list.seller + '">卖掉</span>');
            }
        }


        html.push("</div>");
        Dialog.list.element.find(".item-commands").remove();

        elem = $(html.join("")).insertAfter(elem);
        Util.checkScroll(elem);
    }
};
