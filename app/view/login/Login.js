/**
 * Created by denglevi on 15-7-13.
 */
Ext.define('erp.view.login.Login', {
        requires: ['erp.view.login.LoginController'],
        xtype:'login',
        extend: 'Ext.container.Container',
        controller: 'login',
        initComponent:function(){
            Ext.get("splash").remove();
            this.callParent();
        },
        items:[
            {
                xtype:'window',
                closable: false,
                resizable: false,
                modal: true,
                draggable: false,
                autoShow: true,
                title: 'COSCIA ERP系统',
                glyph: 'xf007@FontAwesome',
                items: [{
                    xtype: 'form',
                    //title: '系统登录',
                    //frame:true,
                    width: 320,
                    reference: 'form',
                    bodyPadding: 15,
                    method: 'POST',
                    defaultType: 'textfield',
                    renderTo: Ext.getBody(),
                    items: [{
                        allowBlank: false,
                        fieldLabel: '用户名',
                        name: 'username',
                        emptyText: '用户名',
                        value: localStorage.getItem("username") || ""
                    }, {
                        allowBlank: false,
                        fieldLabel: '密码',
                        name: 'password',
                        emptyText: '密码',
                        inputType: 'password',
                        value: localStorage.getItem("password") || ""
                    }, {
                        xtype: 'checkbox',
                        fieldLabel: '记住密码',
                        name: 'remember',
                        checked:true
                    }]
                }],
                buttons: [
                    //    {
                    //    name: 'registbutton',
                    //    text: '用户注册',
                    //    //glyph: 0xf118
                    //},
                    {
                        name: 'loginbutton',
                        text: '登录',
                        glyph: 'xf110@FontAwesome',
                        listeners: {
                            click: 'onLoginbtnClick'//单击事件 调用LoginConroller.js中的onLoginbtnClick函数
                        }
                    }]
            }
        ]

    }
);