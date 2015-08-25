Ext.define('erp.view.main.region.Bottom', {
    extend: 'Ext.toolbar.Toolbar',
    alias: 'widget.mainbottom',

    requires: [
        'Ext.toolbar.TextItem',
        'erp.ux.TransparentButton'
    ],
    initComponent: function () {
        var userInfo = Ext.decode(localStorage.getItem("userInfo"));
        var userTip = userInfo == null || userInfo == ""?'':'用户角色:'+userInfo.role_info.name+'<br>上次登录时间:'+userInfo.login_time+'<br>上次登录IP:'+userInfo.last_login_ip;
        Ext.apply(this, {
            height: 30,
            defaults: {
                xtype: 'transparentbutton'
            },
            items: [
                {
                    xtype: 'tbtext',
                    html: '欢迎使用COSCIA ERP系统'
                }, '->',
                {
                    text: '蔻莎国际品牌管理有限公司'
                }, '->',
                {
                    text: '登录用户：' + userInfo.nickname,
                    //glyph: 0xf007
                    tooltip:userTip,
                    iconCls: 'userIcon'
                }, '->',
                {
                    text: '蔻莎国际品牌管理有限公司 @版权所有'
                }, '',
                {
                    text: 'version 0.6.5'
        }, '->'
            ]
        });
        this.callParent();
    }
});