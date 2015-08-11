/**
 * Created by Administrator on 2015-06-04.
 */
Ext.define('erp.view.main.region.Top', {
    extend: 'Ext.toolbar.Toolbar',
    alias: 'widget.maintop',

    requires: [
        'Ext.Array',
        'Ext.form.Label',
        'Ext.form.action.Action',
        'Ext.form.field.Base',
        'Ext.form.field.Text',
        'Ext.layout.container.Anchor',
        'Ext.window.Window',
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
            iconCls: 'homeIcon'
        }], menus, ['->', {
            text: '管理',
            iconCls: 'userIcon',
            //tooltip: '管理',
            menu: [
                {
                    text: '修改密码',
                    iconCls: 'userEditIcon',
                    handler: function () {
                        var win = Ext.create('Ext.window.Window', {
                            title: '修改密码',
                            width: 400,
                            modal: true,
                            resizable: false,
                            layout: 'anchor',
                            margin: 10,
                            items: [
                                {
                                    xtype: 'form',
                                    defaults: {
                                        xtype: "textfield",
                                        inputType: 'password',
                                        labelAlign: 'right',
                                        margin: 5,
                                        allowBlank:false,
                                        anchor:'100%'
                                    },
                                    items: [
                                        {name: 'password_original', fieldLabel: "旧密码"},
                                        {name: 'password_new', fieldLabel: "新密码"},
                                        {name: 'password_confirm', fieldLabel: "确认密码"}
                                    ],
                                    buttons: [
                                        {
                                            text: "重置", handler: function () {
                                                    this.up("form").getForm().reset();
                                        }
                                        },
                                        {
                                            text:"提交",
                                            disabled:true,
                                            formBind:true,
                                            handler:function(){
                                                var form = this.up("form").getForm(),
                                                    vals = form.getValues();
                                                if(vals.password_new != vals.password_confirm){
                                                    Ext.toast("新密码和确认密码不相同,请重新输入!","系统提示");
                                                    return;
                                                }
                                                if(form.isValid()){
                                                    form.submit({
                                                        url: apiBaseUrl + '/index.php/System/Index/editUserPassword',
                                                        waitMsg:'正在提交...',
                                                        success:function(form,action){
                                                            if(!action.result.success){
                                                                Ext.toast(action.result.msg,"系统提示");
                                                                return;
                                                            }
                                                            Ext.toast("密码修改成功,请注销重新登录!","系统提示");
                                                            win.destroy();
                                                        },
                                                        failure:function(form,action){
                                                            if(action.failureType == Ext.form.action.Action.SERVER_INVALID){
                                                                Ext.toast(action.result.msg,"系统提示");
                                                                return;
                                                            }
                                                            Ext.toast("修改密码失败,请重试!","系统提示");
                                                        }
                                                    });
                                                }
                                            }
                                        }
                                    ]
                                }
                            ]
                        });
                        win.show();
                    }
                },
                {
                    text: '注销',
                    iconCls: 'logoutIcon',
                    handler: 'logoutSystem'
                }
            ]
        },
            {
                text: '帮助',
                //glyph: 0xf059,
                iconCls: 'helpIcon',
                tooltip: '获取帮助',
                menu: [
                    {
                        text: '关于',
                        iconCls: 'aboutIcon'
                        //glyph: 0xf06a
                    },
                    {
                        text: '在线支持',
                        iconCls: 'contactIcon'
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
                    if ("帮助" == menu.text || "管理" == menu.text) {
                        return;
                    }
                    menu.on("click", "onMainMenu");
                });
            }
        };
        me.callParent(arguments);
    }
});