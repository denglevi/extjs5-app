/**
 * Created by Administrator on 2015-07-15.
 */
Ext.define('erp.view.module.member.VIPCardController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.vipcard',

    requires: [
        'Ext.data.Store',
        'Ext.data.StoreManager',
        'Ext.form.field.Checkbox',
        'Ext.form.field.ComboBox',
        'Ext.form.field.Hidden',
        'Ext.form.field.Number',
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
    addVIPCardType: function () {
        var url = apiBaseUrl + '/index.php/Membership/sort/addVIPType';
        var form = this.getVIPCardTypeForm(url);
        var win = Ext.create('Ext.window.Window', {
            modal: true,
            resizable: false,
            width: 600,
            layout: 'fit',
            title: "新增VIP卡类型",
            items: [form]
        });
        form.on("destroyVIPWin", function () {
            win.destroy();
            var store = Ext.StoreManager.lookup("VIPCardListStore");
            if (store !== null) store.load();
        });
        win.show();
    },
    delVIPCardType: function (del_btn) {
        var sel = del_btn.up('grid').getSelection(), ids = [], nos = [];
        if (sel.length == 0) {
            Ext.Msg.alert('系统提示', '请选择要删除的VIP卡');
            return;
        }
        Ext.each(sel, function (record) {
            ids.push(record.get("id"));
            nos.push(record.get("member_name"));
        });

        Ext.Msg.show({
            title: '系统消息',
            message: '你确定要删除以下VIP卡吗？<br>' + nos.join('<br>'),
            buttons: Ext.Msg.YESNO,
            icon: Ext.Msg.QUESTION,
            fn: function (btn) {
                if (btn === 'yes') {
                    Ext.getBody().mask("正在删除...");
                    Ext.Ajax.request({
                        url: apiBaseUrl + '/index.php/Membership/sort/delVIPType',
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
    editVIPCardType: function (btn) {
        var sel = btn.up('grid').getSelection(), ids = [], nos = [];
        if (sel.length > 1) {
            Ext.Msg.alert('系统提示', '一次只能修改一条记录!');
            return;
        }
        if (sel.length == 0) {
            Ext.Msg.alert('系统提示', '请选择你要修改的VIP卡类型');
            return;
        }
        var url = apiBaseUrl + '/index.php/Membership/sort/editVIPType';
        var form = this.getVIPCardTypeForm(url);
        form.loadRecord(sel[0]);
        var win = Ext.create('Ext.window.Window', {
            modal: true,
            reference: 'vip_win',
            resizable: false,
            width: 600,
            layout: 'fit',
            title: "修改VIP卡类型",
            items: [form]
        });
        form.on("destroyVIPWin", function () {
            win.destroy();
            var store = Ext.StoreManager.lookup("VIPCardListStore");
            if (store !== null) store.load();
        });
        win.show();
    },
    getVIPCardTypeForm: function (url) {
        var me = this, form = Ext.create('Ext.form.Panel', {
            layout: 'column',
            bodyPadding: 10,
            defaults: {
                xtype: 'textfield',
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
                {fieldLabel: '代码', name: 'member_code'},
                {fieldLabel: '名称', name: 'member_name'},
                {fieldLabel: '级别', name: 'member_rank', xtype: 'numberfield'},
                {fieldLabel: '基本金额积分比', name: 'member_netcash', xtype: 'numberfield'},
                {fieldLabel: '积分倍率', name: 'member_ratio', xtype: 'numberfield'},
                {fieldLabel: '折扣', name: 'member_dis', xtype: 'numberfield'},
                {fieldLabel: '启用积分', name: 'member_integral', xtype: 'checkbox'},
                {fieldLabel: '有效期限(月)', name: 'member_validity', xtype: 'numberfield'},
                {fieldLabel: '积分有效期(月)', name: 'member_graldity', xtype: 'numberfield'},
                {fieldLabel: '可储值卡', name: 'member_torage', xtype: 'checkbox'},
                {fieldLabel: '启用生日优惠', name: 'member_birthdayyh', xtype: 'checkbox'},
                {
                    labelWidth: 150,
                    fieldLabel: '消费自动延长有效期(月)',
                    name: 'member_vliex',
                    columnWidth: 1,
                    xtype: 'numberfield'
                },
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
                                    btn.up("form").fireEvent("destroyVIPWin");
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
    addVIPCardOpenLimit: function () {
        var url = apiBaseUrl + '/index.php/Membership/Hairpin/addVIPCardOpenLimit';
        var form = this.getVIPCardOpenLimitForm(url);
        var win = Ext.create('Ext.window.Window', {
            modal: true,
            resizable: false,
            width: 600,
            layout: 'fit',
            title: "新增开卡规则",
            items: [form]
        });
        form.on("destroyVIPCardOpenLimitWin", function () {
            win.destroy();
            var store = Ext.StoreManager.lookup("VIPCardOpenLimitStore");
            if (store !== null) store.load();
        });
        win.show();
    },
    delVIPCardOpenLimit: function (del_btn) {
        var sel = del_btn.up('grid').getSelection(), ids = [], nos = [];
        if (sel.length == 0) {
            Ext.Msg.alert('系统提示', '请选择要删除的VIP卡');
            return;
        }
        Ext.each(sel, function (record) {
            ids.push(record.get("id"));
            nos.push(record.get("member_name"));
        });

        Ext.Msg.show({
            title: '系统消息',
            message: '你确定要删除以下开发规则吗？<br>' + nos.join('<br>'),
            buttons: Ext.Msg.YESNO,
            icon: Ext.Msg.QUESTION,
            fn: function (btn) {
                if (btn === 'yes') {
                    Ext.getBody().mask("正在删除...");
                    Ext.Ajax.request({
                        url: apiBaseUrl + '/index.php/Membership/Hairpin/delVIPCardOpenLimit',
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
    editVIPCardOpenLimit: function (btn) {
        var sel = btn.up('grid').getSelection(), ids = [], nos = [];
        if (sel.length > 1) {
            Ext.Msg.alert('系统提示', '一次只能修改一条记录!');
            return;
        }
        if (sel.length == 0) {
            Ext.Msg.alert('系统提示', '请选择你要修改的VIP卡类型');
            return;
        }
        var url = apiBaseUrl + '/index.php/Membership/Hairpin/editVIPCardOpenLimit';
        var form = this.getVIPCardOpenLimitForm(url);
        form.loadRecord(sel[0]);
        var win = Ext.create('Ext.window.Window', {
            modal: true,
            reference: 'vip_win',
            resizable: false,
            width: 600,
            layout: 'fit',
            title: "修改VIP卡类型",
            items: [form]
        });
        form.on("destroyVIPCardOpenLimitWin", function () {
            win.destroy();
            var store = Ext.StoreManager.lookup("VIPCardOpenLimitStore");
            if (store !== null) store.load();
        });
        win.show();
    },
    getVIPCardOpenLimitForm: function (url) {

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
                {
                    fieldLabel: '卡类别',
                    name: 'rule_name',
                    xtype: 'combo',
                    displayField: 'name',
                    valueField: 'id',
                    editable: false,
                    disabled: true
                },
                {fieldLabel: '调整积分', name: 'rule_integr', xtype: 'numberfield'},
                {fieldLabel: '当日个人消费', name: 'rule_day', xtype: 'numberfield'},
                {fieldLabel: '半年个人消费', name: 'rule_halfayear', xtype: 'numberfield'},
                {fieldLabel: '一年个人消费', name: 'rule_year', xtype: 'numberfield'},
                {fieldLabel: '备注', name: 'rule_backups', xtype: 'textareafield'}
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
                                    btn.up("form").fireEvent("destroyVIPCardOpenLimitWin");
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
            url: apiBaseUrl + '/index.php/Membership/Hairpin/getVIPType',
            method: 'POST',
            success: function (res) {
                var json = Ext.decode(res.responseText);
                var vip = form.down("combo"),
                    store = Ext.create('Ext.data.Store', {
                        fields: [],
                        data: json.data
                    });
                console.log(vip);
                vip.setDisabled(false);
                vip.setStore(store);
            },
            failure: function () {

            }
        });
        return form;
    },
    addVIPCardUpdateLimit: function () {
        var url = apiBaseUrl+'/index.php/Membership/Change/addVIPCardUpdateLimit';
        var form = this.getVIPCardUpdateLimitWin(url);
        var win = Ext.create('Ext.window.Window', {
            modal: true,
            resizable: false,
            width: 600,
            layout: 'fit',
            title: "新增升级规则",
            items: [form]
        });
        form.on("destroyVIPCardUpdateLimitWin", function () {
            win.destroy();
            var store = Ext.StoreManager.lookup("VIPCardUpdateLimitStore");
            if (store !== null) store.load();
        });
        win.show();
    },
    delVIPCardUpdateLimit: function (del_btn) {
        var sel = del_btn.up('grid').getSelection(), ids = [], nos = [];
        if (sel.length == 0) {
            Ext.Msg.alert('系统提示', '请选择要删除的升级规则');
            return;
        }
        Ext.each(sel, function (record) {
            ids.push(record.get("id"));
            nos.push(record.get("member_name"));
        });

        Ext.Msg.show({
            title: '系统消息',
            message: '你确定要删除以下升级规则吗？<br>' + nos.join('<br>'),
            buttons: Ext.Msg.YESNO,
            icon: Ext.Msg.QUESTION,
            fn: function (btn) {
                if (btn === 'yes') {
                    Ext.getBody().mask("正在删除...");
                    Ext.Ajax.request({
                        url: apiBaseUrl+'/index.php/Membership/Change/delVIPCardUpdateLimit',
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
    editVIPCardUpdateLimit:function(btn){
        var sel = btn.up('grid').getSelection(), ids = [], nos = [];
        if (sel.length > 1) {
            Ext.Msg.alert('系统提示', '一次只能修改一条记录!');
            return;
        }
        if (sel.length == 0) {
            Ext.Msg.alert('系统提示', '请选择你要修改的VIP卡升级规则');
            return;
        }
        var url = apiBaseUrl+'/index.php/Membership/Change/editVIPCardUpdateLimit';
        var form = this.getVIPCardUpdateLimitWin(url);
        form.loadRecord(sel[0]);
        var win = Ext.create('Ext.window.Window', {
            modal: true,
            reference: 'vip_win',
            resizable: false,
            width: 600,
            layout: 'fit',
            title: "修改VIP卡升级规则",
            items: [form]
        });
        form.on("destroyVIPCardUpdateLimitWin", function () {
            win.destroy();
            var store = Ext.StoreManager.lookup("VIPCardUpdateLimitStore");
            if (store !== null) store.load();
        });
        win.show();
    },
    getVIPCardUpdateLimitWin:function(url){
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
                {
                    fieldLabel: '原卡类别',
                    name: 'change_raw',
                    xtype: 'combo',
                    displayField: 'name',
                    valueField: 'id',
                    editable: false,
                    disabled: true
                },
                {fieldLabel: '升级卡类别', name: 'change_upgrade',xtype: 'combo',
                    displayField: 'name',
                    valueField: 'id',
                    editable: false,
                    disabled: true},
                {fieldLabel: '消费周期(月)', name: 'change_cyle', xtype: 'numberfield'},
                {fieldLabel: '周期内消费', name: 'change_money', xtype: 'numberfield'},
                {fieldLabel: '消费周期(年)', name: 'change_year', xtype: 'numberfield'},
                {fieldLabel: '周期内消费', name: 'change_yearey', xtype: 'numberfield'}
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
                                    btn.up("form").fireEvent("destroyVIPCardUpdateLimitWin");
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
            url: apiBaseUrl + '/index.php/Membership/Hairpin/getVIPType',
            method: 'POST',
            success: function (res) {
                var json = Ext.decode(res.responseText);
                var vip1 = form.down("combo[name=change_raw]"),
                    vip2 = form.down("combo[name=change_upgrade]"),
                    store = Ext.create('Ext.data.Store', {
                        fields: [],
                        data: json.data
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
    },
    addVIPCardPutLimit:function(){
        var url = apiBaseUrl+'/index.php/Membership/Put/addVIPCardPutLimit';
        var form = this.getVIPCardPutLimitWin(url);
        var win = Ext.create('Ext.window.Window', {
            modal: true,
            resizable: false,
            width: 600,
            layout: 'fit',
            title: "新增VIP卡投放单",
            items: [form]
        });
        form.on("destroyVIPCardPutLimitWin", function () {
            win.destroy();
            var store = Ext.StoreManager.lookup("VIPCardPutLimitStore");
            if (store !== null) store.load();
        });
        win.show();
    },
    delVIPCardPutLimit:function(del_btn){
        var sel = del_btn.up('grid').getSelection(), ids = [], nos = [];
        if (sel.length == 0) {
            Ext.Msg.alert('系统提示', '请选择要删除的投放单');
            return;
        }
        Ext.each(sel, function (record) {
            ids.push(record.get("id"));
            nos.push(record.get("put_number"));
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
                        url: apiBaseUrl+'/index.php/Membership/Put/delVIPCardPutLimit',
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
    editVIPCardPutLimit:function(btn){
        var sel = btn.up('grid').getSelection(), ids = [], nos = [];
        if (sel.length > 1) {
            Ext.Msg.alert('系统提示', '一次只能修改一条记录!');
            return;
        }
        if (sel.length == 0) {
            Ext.Msg.alert('系统提示', '请选择你要修改的VIP卡投放单');
            return;
        }
        var url = apiBaseUrl+'/index.php/Membership/Put/editVIPCardPutLimit';
        var form = this.getVIPCardPutLimitWin(url);
        form.loadRecord(sel[0]);
        var win = Ext.create('Ext.window.Window', {
            modal: true,
            resizable: false,
            width: 600,
            layout: 'fit',
            title: "修改VIP卡投放单",
            items: [form]
        });
        form.on("destroyVIPCardPutLimitWin", function () {
            win.destroy();
            var store = Ext.StoreManager.lookup("VIPCardPutLimitStore");
            if (store !== null) store.load();
        });
        win.show();
    },
    getVIPCardPutLimitWin:function(url){
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
                {
                    fieldLabel: 'vip卡类型',
                    name: 'member_id',
                    xtype: 'combo',
                    displayField: 'name',
                    valueField: 'id',
                    editable: false,
                    disabled: true
                },
                {fieldLabel: '折扣', name: 'put_discount', xtype: 'numberfield'},
                {fieldLabel: '卡前缀', name: 'put_prefix', xtype: 'textfield'},
                {fieldLabel: '起始编号', name: 'put_startber', xtype: 'numberfield'},
                {fieldLabel: '截止编号  ', name: 'put_uptober', xtype: 'numberfield'},
                {fieldLabel: '编码长度  ', name: 'put_lenght', xtype: 'numberfield'},
                {fieldLabel: '卡号不包含以下数字  ', name: 'put_exclusive', xtype: 'numberfield',columnWidth:1,labelWidth:150},
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
                                    btn.up("form").fireEvent("destroyVIPCardPutLimitWin");
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
            url: apiBaseUrl + '/index.php/Membership/Hairpin/getVIPType',
            method: 'POST',
            success: function (res) {
                var json = Ext.decode(res.responseText);
                var vip = form.down("combo[name=member_id]"),
                    store = Ext.create('Ext.data.Store', {
                        fields: [],
                        data: json.data
                    });

                vip.setDisabled(false);
                vip.setStore(store);
            },
            failure: function () {

            }
        });
        return form;
    }
});