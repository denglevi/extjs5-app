/**
 * This class is the main view for the application. It is specified in app.js as the
 * "autoCreateViewport" property. That setting automatically applies the "viewport"
 * plugin to promote that instance of this class to the body element.
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('erp.view.main.Main', {
    extend: 'Ext.container.Container',
    requires: [
        'Ext.layout.container.Border',
        'Ext.tab.Panel',
        'erp.view.main.MainController',
        'erp.view.main.MainModel',
        'erp.view.main.region.Bottom',
        'erp.view.main.region.Left',
        'erp.view.main.region.Top'
    ],

    alias: 'widget.main',
    controller: 'main',
    viewModel: {
        type: 'main'
    },
    initComponent: function () {
        Ext.setGlyphFontFamily("FontAwesome");
        this.callParent();
    },
    layout: {
        type: 'border'
    },

    items: [
        {
            xtype:'maintop',
            region:'north'
        },
        {
            xtype: 'mainleft',
            reference:"mainleft",
            bind: {
                title: '{name}',
                glyph:'{index_icon}'
            },
            collapsible : true,
            region: 'west',
            width: 200,
            split: true
        },
        {
            region: 'center',
            xtype: 'tabpanel',
            items:[]
        },
        {
            region:'south',
            xtype:'mainbottom'
        }
    ]
});
