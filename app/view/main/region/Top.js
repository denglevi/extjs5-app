/**
 * Created by Administrator on 2015-06-04.
 */
Ext.define('erp.view.main.region.Top', {
    extend: 'Ext.toolbar.Toolbar',
    alias: 'widget.maintop',

    requires: [
        'Ext.Array',
        'Ext.form.Label',
        'erp.ux.TransparentButton',
        'erp.view.main.MainController',
        'erp.view.main.MainModel'
    ],
    style: 'background-color : #205081',
    height: 50,
    defaults: {
        xtype: 'transparentbutton'
    },
    controller: 'main',
    viewModel: {
        type: 'main'
    },
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
            //glyph: 0xf015,
            iconCls:'homeIcon'
        }], menus, ['->', {
            text:'注销',
            handler:'logoutSystem',
            iconCls:'logoutIcon'
        },
            {
                text: '帮助',
                //glyph: 0xf059,
                iconCls:'helpIcon',
                tooltip: '获取帮助',
                menu: [
                    {
                        text: '关于',
                        iconCls:'aboutIcon'
                        //glyph: 0xf06a
                    },
                    {
                        text: '在线支持',
                        iconCls:'contactIcon'
                        //glyph: 0xf1cd
                    }
                ]
            },
            //{
            //    glyph : 0xf102,
            //    handler : 'hiddenTopBottom',
            //    tooltip : '隐藏顶部和底部区域',
            //    disableMouseOver : true
            //}
        ]);
        me.listeners = {
            afterrender: function (tb) {
                var menus = tb.query("transparentbutton");
                Ext.Array.each(menus, function (menu) {
                    if ("帮助" == menu.text || "注销" == menu.text) {
                        return;
                    }
                    menu.on("click", "onMainMenu");
                });
            }
        };
        me.callParent(arguments);
    }
});