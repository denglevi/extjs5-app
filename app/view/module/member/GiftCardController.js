/**
 * Created by Administrator on 2015-07-16.
 */
Ext.define('erp.view.module.member.GiftCardController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.giftcard',

    requires: [
        'Ext.data.Store',
        'Ext.data.StoreManager',
        'Ext.form.field.ComboBox',
        'Ext.form.field.Hidden',
        'Ext.form.field.Number',
        'Ext.form.field.Text',
        'Ext.layout.container.Column',
        'Ext.layout.container.HBox',
        'Ext.layout.container.VBox',
        'Ext.window.Window'
    ],

    init: function() {

    },
    addGiftCardReturnStandard:function(){
        var url = apiBaseUrl+'/index.php/Membership/Rebate/addGiftCardReturnStandard';
        var form = this.getGiftCardReturnStandardForm(url);
        var win = Ext.create('Ext.window.Window', {
            modal: true,
            resizable: false,
            width: 400,
            layout: 'fit',
            title: "新增返利标准",
            items: [form]
        });
        form.on("destroyGiftCardReturnStandardWin", function () {
            win.destroy();
            var store = Ext.StoreManager.lookup("GiftCardReturnStandardStore");
            if (store !== null) store.load();
        });
        win.show();
    },
    delGiftCardReturnStandard:function(del_btn){
        var sel = del_btn.up('grid').getSelection(), ids = [];
        if (sel.length == 0) {
            Ext.Msg.alert('系统提示', '请选择要删除的返利标准');
            return;
        }
        Ext.each(sel, function (record) {
            ids.push(record.get("id"));
        });

        Ext.Msg.show({
            title: '系统消息',
            message: '你确定要删除所选返利标准吗？',
            buttons: Ext.Msg.YESNO,
            icon: Ext.Msg.QUESTION,
            fn: function (btn) {
                if (btn === 'yes') {
                    Ext.getBody().mask("正在删除...");
                    Ext.Ajax.request({
                        url: apiBaseUrl+'/index.php/Membership/Rebate/delGiftCardReturnStandard',
                        params: {
                            ids: ids.join(',')
                        },
                        success: function (data) {
                            var res = Ext.decode(data.responseText);
                            if (!res.success) {
                                Ext.Msg.alert('系统提示', res.msg);
                                return;
                            }
                            Ext.getBody().unmask();
                            del_btn.up('grid').getStore().load();
                        },
                        failure: function (data) {
                            Ext.getBody().unmask();
                            Ext.Msg.alert('系统提示', "请求网络错误,请检查网络,重试!");
                        }
                    })
                }
            }
        });
    },
    getGiftCardReturnStandardForm:function(url){
        var form = Ext.create('Ext.form.Panel', {
            bodyPadding: 10,
            layout:'vbox',
            defaults: {
                allowBlank: false,
                labelAlign: 'right',
                anchor: '100%',
                margin: 5,
                minValue: 0,
                xtype:'numberfield'
            },
            items: [
                {xtype: 'hidden', name: 'id'},
                {fieldLabel:'大于或等于',name:'rebate_greater'},
                {fieldLabel:'小于',name:'rebate_sga'},
                {fieldLabel:'返利率',xtype:'textfield',name:'return_rebate'}
            ],
            buttons: [
                {
                    text: '重置',
                    handler: function () {
                        this.up("form").getForm().reset();
                    }
                },
                {
                    text: '提交',
                    formBind: true,
                    disabled: false,
                    handler: function (btn) {
                        var form = this.up("form").getForm();
                        if (form.isValid()) {
                            form.submit({
                                waitMsg: '正在提交...',
                                url: url,
                                method: 'POST',
                                success: function (form, action) {
                                    btn.up("form").fireEvent("destroyGiftCardReturnStandardWin");
                                },
                                failur: function (form, action) {
                                    if (action.result.msg) {
                                        Ext.toast(action.result.msg, "系统提示");
                                        return;
                                    }
                                    Ext.toast("网络请求错误,请检查网络!", "系统提示");
                                }
                            });
                        }
                    }
                }
            ]
        });

        return form;
    },
    addGiftCardPutLimit:function(){
        var url = apiBaseUrl+'/index.php/Membership/Gift/addGiftCardPutLimit';
        var form = this.getGiftCardPutLimitWin(url);
        var win = Ext.create('Ext.window.Window', {
            modal: true,
            resizable: false,
            width: 600,
            layout: 'fit',
            title: "新增礼品卡投放单",
            items: [form]
        });
        form.on("destroyGiftCardPutLimitWin", function () {
            win.destroy();
            var store = Ext.StoreManager.lookup("GiftCardPutLimitStore");
            if (store !== null) store.load();
        });
        win.show();
    },
    delGiftCardPutLimit:function(del_btn){
        var sel = del_btn.up('grid').getSelection(), ids = [], nos = [];
        if (sel.length == 0) {
            Ext.Msg.alert('系统提示', '请选择要删除的投放单');
            return;
        }
        Ext.each(sel, function (record) {
            ids.push(record.get("id"));
            nos.push(record.get("gift_code"));
        });

        Ext.Msg.show({
            title: '系统消息',
            message: '你确定要删除以下投放单吗？<br>' + nos.join('<br>'),
            buttons: Ext.Msg.YESNO,
            icon: Ext.Msg.QUESTION,
            fn: function (btn) {
                if (btn === 'yes') {
                    Ext.getBody().mask("正在删除...");
                    Ext.Ajax.request({
                        url: apiBaseUrl+'/index.php/Membership/Gift/delGiftCardPutLimit',
                        params: {
                            ids: ids.join(',')
                        },
                        success: function (data) {
                            var res = Ext.decode(data.responseText);
                            if (!res.success) {
                                Ext.Msg.alert('系统提示', res.msg);
                                return;
                            }
                            Ext.getBody().unmask();
                            del_btn.up('grid').getStore().load();
                        },
                        failure: function (data) {
                            Ext.getBody().unmask();
                            Ext.Msg.alert('系统提示', "请求网络错误,请检查网络,重试!");
                        }
                    })
                }
            }
        });
    },
    editGiftCardPutLimit:function(btn){
        var sel = btn.up('grid').getSelection(), ids = [], nos = [];
        if (sel.length > 1) {
            Ext.Msg.alert('系统提示', '一次只能修改一条记录!');
            return;
        }
        if (sel.length == 0) {
            Ext.Msg.alert('系统提示', '请选择你要修改的礼品卡投放单');
            return;
        }
        var url = apiBaseUrl+'/index.php/Membership/Gift/editGiftCardPutLimit';
        var form = this.getGiftCardPutLimitWin(url);
        form.loadRecord(sel[0]);
        var win = Ext.create('Ext.window.Window', {
            modal: true,
            resizable: false,
            width: 600,
            layout: 'fit',
            title: "修改VIP卡投放单",
            items: [form]
        });
        form.on("destroyGiftCardPutLimitWin", function () {
            win.destroy();
            var store = Ext.StoreManager.lookup("GiftCardPutLimitStore");
            if (store !== null) store.load();
        });
        win.show();
    },
    getGiftCardPutLimitWin:function(url){
        var form = Ext.create('Ext.form.Panel', {
            layout: 'column',
            bodyPadding: 10,
            defaults: {
                allowBlank: false,
                columnWidth: 0.5,
                //labelWidth:70,
                labelAlign: 'right',
                anchor: '100%',
                margin: 5,
                minValue: 0
                //afterLabelTpl:'<b class="text-danger">*</b>'
            },
            items: [
                {xtype: 'hidden', name: 'id'},
                {fieldLabel: '初始面值', name: 'gift_original', xtype: 'numberfield'},
                {fieldLabel: '建议售价', name: 'gift_suggest', xtype: 'numberfield'},
                {fieldLabel: '卡前缀', name: 'gift_prefix', xtype: 'textfield'},
                {fieldLabel: '起始编号', name: 'gift_start', xtype: 'numberfield'},
                {fieldLabel: '截止编号  ', name: 'gift_upto', xtype: 'numberfield'},
                {fieldLabel: '编码长度  ', name: 'gift_lenght', xtype: 'numberfield'},
                {fieldLabel: '卡号不包含以下数字  ', name: 'gift_exclusive', xtype: 'numberfield',labelWidth:150},
                {fieldLabel: '有效期  ', name: 'gift_validity', xtype: 'numberfield',labelWidth:150},
            ],
            buttons: [
                {
                    text: '重置',
                    handler: function () {
                        this.up("form").getForm().reset();
                    }
                },
                {
                    text: '提交',
                    formBind: true,
                    disabled: false,
                    handler: function (btn) {
                        var form = this.up("form").getForm();
                        if (form.isValid()) {
                            form.submit({
                                waitMsg: '正在提交...',
                                url: url,
                                method: 'POST',
                                success: function (form, action) {
                                    btn.up("form").fireEvent("destroyGiftCardPutLimitWin");
                                },
                                failur: function (form, action) {
                                    if (action.result.msg) {
                                        Ext.toast(action.result.msg, "系统提示");
                                        return;
                                    }
                                    Ext.toast("网络请求错误,请检查网络!", "系统提示");
                                }
                            });
                        }
                    }
                }
            ]
        });
        return form;
    }
});