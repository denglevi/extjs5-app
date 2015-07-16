/**
 * Created by Administrator on 2015-07-16.
 */
Ext.define('erp.view.module.member.CustomerController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.customer',

    requires: [
        'Ext.data.Store',
        'Ext.data.StoreManager',
        'Ext.form.RadioGroup',
        'Ext.form.field.ComboBox',
        'Ext.form.field.Date',
        'Ext.form.field.Hidden',
        'Ext.form.field.Number',
        'Ext.form.field.Radio',
        'Ext.form.field.Text',
        'Ext.form.field.TextArea',
        'Ext.layout.container.Column',
        'Ext.window.Window'
    ],

    /**
     * Called when the view is created
     */
    init: function () {

    },
    addCustomer: function () {
        var url = apiBaseUrl + '/index.php/Membership/Customer/addCustomer';
        var form = this.getCustomerFormWin(url);
        var win = Ext.create('Ext.window.Window', {
            modal: true,
            resizable: false,
            width: 600,
            layout: 'fit',
            title: "新增顾客",
            items: [form]
        });
        form.on("destroyCustomerWin", function () {
            win.destroy();
            var store = Ext.StoreManager.lookup("CustomerMngStore");
            if (store !== null) store.load();
        });
        win.show();
    },
    delCustomer: function () {
        var sel = del_btn.up('grid').getSelection(), ids = [],names=[];
        if (sel.length == 0) {
            Ext.Msg.alert('系统提示', '请选择要删除的顾客');
            return;
        }
        Ext.each(sel, function (record) {
            ids.push(record.get("id"));
            names.push(record.get("customer_name"));
        });

        Ext.Msg.show({
            title: '系统消息',
            message: '你确定要删除以下顾客吗？<br>' + names.join('<br>'),
            buttons: Ext.Msg.YESNO,
            icon: Ext.Msg.QUESTION,
            fn: function (btn) {
                if (btn === 'yes') {
                    Ext.getBody().mask("正在删除...");
                    Ext.Ajax.request({
                        url: apiBaseUrl + '/index.php/Membership/Customer/delCustomer',
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
    editCustomer: function () {
        var sel = btn.up('grid').getSelection(), ids = [], nos = [];
        if (sel.length > 1) {
            Ext.Msg.alert('系统提示', '一次只能修改一条记录!');
            return;
        }
        if (sel.length == 0) {
            Ext.Msg.alert('系统提示', '请选择你要修改的顾客');
            return;
        }
        var url = apiBaseUrl + '/index.php/Membership/Customer/editCustomer';
        var form = this.getCustomerFormWin(url);
        form.loadRecord(sel[0]);
        var win = Ext.create('Ext.window.Window', {
            modal: true,
            resizable: false,
            width: 600,
            layout: 'fit',
            title: "修改顾客",
            items: [form]
        });
        form.on("destroyCustomerWin", function () {
            win.destroy();
            var store = Ext.StoreManager.lookup("CustomerMngStore");
            if (store !== null) store.load();
        });
        win.show();
    },
    getCustomerFormWin: function (url) {
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
                {fieldLabel: '顾客姓名', name: 'customer_name', xtype: 'textfield',},
                {
                    fieldLabel: '性别', name: 'customer_sex', xtype: 'radiogroup',
                    items: [
                        {boxLabel: '男', name: 'customer_sex', inputValue: '男', checked: true},
                        {boxLabel: '女', name: 'customer_sex', inputValue: '女'}
                    ]
                },
                {fieldLabel: '生日', name: 'customer_birthday', xtype: 'datefield',editable:false,format:'Y-m-d'},
                {fieldLabel: '年代', name: 'customer_age', xtype: 'textfield'},
                {fieldLabel: '手机号  ', name: 'customer_phone', xtype: 'textfield'},
                {fieldLabel: '推荐人  ', name: 'customer_referrer', xtype: 'textfield'},
                {fieldLabel: '所属终端  ', name: 'customer_terminal', xtype: 'combo',editable:false,disabled:true,displayField:'shops_name',valueField:'id'},
                {fieldLabel: '登记终端  ', name: 'customer_regter', xtype: 'combo',editable:false,disabled:true,displayField:'shops_name',valueField:'id'},
                {fieldLabel: '省份', name: 'customer_province', xtype: 'textfield'},
                {fieldLabel: '城市', name: 'customer_city', xtype: 'textfield'},
                {fieldLabel: '地区', name: 'customer_area', xtype: 'textfield'},
                {fieldLabel: '备注', name: 'customer_backups', xtype: 'textareafield', columnWidth: 1},
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
                                    btn.up("form").fireEvent("destroyCustomerWin");
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
        Ext.Ajax.request({
            async: true,
            url: apiBaseUrl + '/index.php/Membership/Customer/getBaseData',
            method: 'POST',
            params:{
                shop:1
            },
            success: function (res) {
                var json = Ext.decode(res.responseText);
                var vip1 = form.down("combo[name=customer_terminal]"),
                    vip2 = form.down("combo[name=customer_regter]"),
                    store = Ext.create('Ext.data.Store', {
                        fields: [],
                        data: json.data.shop
                    });

                vip1.setDisabled(false);
                vip2.setDisabled(false);
                vip1.setStore(store);
                vip2.setStore(store);
            },
            failure: function () {

            }
        });
        return form;
    }
});