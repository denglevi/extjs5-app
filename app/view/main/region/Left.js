/**
 * Created by Administrator on 2015-06-05.
 */
Ext.define("erp.view.main.region.Left", {
    extend: "Ext.panel.Panel",
    alias: "widget.mainleft",

    requires: [
        'Ext.Array',
        'Ext.layout.container.Accordion',
        'Ext.layout.container.Fit',
        'Ext.panel.Panel',
        'Ext.tree.Panel'
    ],
    layout: 'fit',
    initComponent: function () {
        var me = this;
        var model = this.up("main").getViewModel()
        var menus = model.get("menus");
        var menu = [];
        var i = 0;
        var user_info = localStorage.getItem("userInfo");
            var userInfo = Ext.decode(user_info),
                actions =userInfo.role_info.actions,
                actionStr = actions.join(","),
                len = menus.length,
                arr = [];
        Ext.Array.each(menus, function (m) {
            if(m.hidden || actionStr.indexOf(m.action) == -1) return;
            var items = {
                title: m.text,
                //glyph: m.glyph,
                iconCls: m.iconCls,
                xtype: 'treepanel',
                //cls:'person-form',
                //store: menusStore,
                rootVisible: false,
                listeners: {
                    itemdblclick: "onAddMainTab",
                    expand:function(obj){
                        var len = obj.getStore().data.length;
                        if(len > 0) return;
                        var menusStore = model.getLeftMenus(m.text);
                        obj.setStore(menusStore);
                    }
                }
            };
            if(0 == i){
                items.store = model.getLeftMenus(m.text);
            }
            i++;
            menu.push(items);
        });
        this.items = [
            {
                xtype: 'panel',
                layout: "accordion",
                items: menu
            }
        ];

        this.callParent(arguments);
    },
    listeners: {
        beforeadd: function (panel) {
            panel.removeAll();
        }
    }
});