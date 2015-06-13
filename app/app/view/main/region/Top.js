/**
 * Created by Administrator on 2015-06-04.
 */
Ext.define('erp.view.main.region.Top', {
    extend: 'Ext.toolbar.Toolbar',
    alias: 'widget.maintop',

    requires: [
        'Ext.Array',
        'Ext.form.Label',
        'erp.ux.TransparentButton'
    ],

    initComponent: function () {
        var me = this;
        me.items = [
            {
                xtype: 'label',
                style: 'color:white;',
                text: 'COSCIA ERP SYSTEM'
            }, ''
        ];
        var menus = me.up("main").getViewModel().getTopMenus();
        me.items = me.items.concat([{
            text: '首页',
            glyph: 0xf015
        }], menus, ['->', {
            text: '帮助',
            glyph: 0xf059,
            tooltip: '获取帮助',
            menu: [
                {
                    text: '关于',
                    glyph: 0xf06a
                },
                {
                    text: '在线支持',
                    glyph: 0xf1cd
                }
            ]
        }]);
        me.listeners = {
            afterrender: function (tb) {
                var menus = tb.query("transparentbutton");
                Ext.Array.each(menus, function (menu) {
                    if ("帮助" == menu.text) {
                        return;
                    }
                    menu.on("click", "onMainMenu");
                });
            }
        };
        me.callParent(arguments);
    },
    style: 'background-color : #205081',
    height: 50,
    defaults: {
        xtype: 'transparentbutton'
    }
});