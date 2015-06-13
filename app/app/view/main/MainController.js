/**
 * This class is the main view for the application. It is specified in app.js as the
 * "autoCreateViewport" property. That setting automatically applies the "viewport"
 * plugin to promote that instance of this class to the body element.
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('erp.view.main.MainController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.main',

    requires: [
        'Ext.Array',
        'Ext.container.Container',
        'Ext.layout.container.Accordion',
        'Ext.tree.Panel'
    ],
    onMainMenu: function (el) {
        //点击不同菜单之后，左边栏显示不同的菜单
        var text = el.text;
        var model = el.up("maintop").up("main").getViewModel();
        if (text == model.get("name")) return;
        model.set("name", text);
        model.set("index_icon", el.glyph);
        var mainLeft = this.lookupReference("mainleft")
        if (text == "首页") {
            var menus = model.get("menus");
            var menu = [];
            Ext.Array.each(menus, function (m) {
                menu.push({
                    title: m.text,
                    glyph: m.glyph,
                    html: m.text + m.glyph
                });
            });
            var items = [
                {
                    xtype: 'container',
                    layout: "accordion",
                    items: menu
                }
            ];
        } else {
            var menusStore = model.getLeftMenus(text);
            var items = [
                {
                    xtype: 'treepanel',
                    width: 200,
                    height: 150,
                    store: menusStore,
                    rootVisible: false,
                    listeners: {
                        itemdblclick: function (tree, record, item, index, e, eOpts) {
                            console.log(record);
                        }
                    }
                }
            ];
        }
        mainLeft.add(items);
    }
});
