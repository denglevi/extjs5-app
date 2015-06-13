Ext.define('erp.view.main.region.Bottom', {
    extend: 'Ext.toolbar.Toolbar',
    alias: 'widget.mainbottom',

    requires: [
        'Ext.toolbar.TextItem',
        'erp.ux.TransparentButton'
    ],

    height: 30,
    defaults: {
        xtype: 'transparentbutton'
    },
    items: [
        {
            xtype: 'tbtext',
            html: '欢迎使用COSCIA ERP系统'
        },'->',
        {
            text: '寇莎国际品牌管理有限公司'
        }, '->',
        {
            text: '登录用户：denglevi',
            glyph: 0xf007
        }, '->',
        {
            text: '寇莎国际品牌管理有限公司 版权所有'
        }, '',
        {
            text: 'version 0.1'
        }, '->'
    ]
});