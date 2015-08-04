/**
 * Created by Administrator on 2015-07-06.
 */
Ext.define('erp.view.module.operation.OperationController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.operation',

    requires: [
        'Ext.Ajax',
        'Ext.Array',
        'Ext.data.Store',
        'Ext.data.StoreManager',
        'Ext.form.Panel',
        'Ext.form.field.Checkbox',
        'Ext.form.field.ComboBox',
        'Ext.form.field.Date',
        'Ext.form.field.Display',
        'Ext.form.field.Hidden',
        'Ext.form.field.Text',
        'Ext.form.field.TextArea',
        'Ext.layout.container.Anchor',
        'Ext.layout.container.Column',
        'Ext.layout.container.VBox',
        'Ext.window.Window'
    ],
    init: function () {

    },
    addSellerPosition: function (btn) {
        var form = {
            xtype: 'form',
            layout: 'anchor',
            method: 'POST',
            url: apiBaseUrl + '/index.php/operations/Position/addSellerPosition',
            defaults: {
                xtype: 'textfield',
                labelAlign: 'right',
                labelWidth: 100,
                allowBlank: false,
                anchor: '100%',
                margin:5
            },
            items: [
                {fieldLabel: '职位名称', name: 'operations_post'},
                {fieldLabel: '英文名称', name: 'operations_post_en'},
                {fieldLabel: '最低折扣范围', name: 'operations_low_discount'},
                {xtype: 'hidden', name: 'operations_post_status', value: 0},
                {fieldLabel: '最高折扣范围', name: 'operations_tall_discount'}
            ],
            buttons: [
                {
                    text: '重置',
                    handler: function () {
                        this.up('form').getForm().reset();
                    }
                },
                {
                    text: '保存',
                    formBind: true,
                    disabled: true,
                    handler: function () {
                        var form = this.up('form').getForm();
                        if (form.isValid()) {
                            form.submit({
                                waitMsg: '正在新增...',
                                success: function (form, action) {
                                    console.log(action.result);
                                    win.destroy();
                                    Ext.StoreManager.lookup("SellerPositionListStore").load();
                                },
                                failure: function (form, action) {
                                    console.log(action);
                                    Ext.Msg.alert('失败', action.result.msg);
                                }
                            });
                        }
                    }
                }
            ]
        };
        var win = Ext.create('Ext.window.Window', {
            title: '新增职位',
            width: 400,
            margin: 10,
            items: [form],
            modal: true,
            resizable: false
        });

        win.show();
    },
    delSellerPosition: function (btn) {
        var grid = this.lookupReference("seller_position_grid");
        var sel = grid.getSelection(), ids = [], nos = [];
        if (sel.length == 0) {
            Ext.Msg.alert('系统提示', '请选择要删除的职位');
            return;
        }
        Ext.each(sel, function (record) {
            ids.push(record.get("id"));
            nos.push(record.get("operations_post"));
        });
        Ext.Msg.show({
            title: '系统消息',
            message: '删除职位时,此职位下的职员将一起从系统中删除,你确定要删除以下职位吗？<br>' + nos.join('<br>'),
            buttons: Ext.Msg.YESNO,
            icon: Ext.Msg.QUESTION,
            fn: function (btn) {
                if (btn === 'yes') {
                    Ext.Ajax.request({
                        url: apiBaseUrl + '/index.php/operations/Position/delSellerPosition',
                        waitMsg: '正在删除...',
                        params: {
                            ids: ids.join(',')
                        },
                        success: function (data) {
                            var res = Ext.decode(data.responseText);
                            console.log(res);
                            if (!res.success) {
                                Ext.Msg.alert('系统提示', res.msg);
                                return;
                            }
                            grid.getStore().load();
                        },
                        failure: function (data) {
                            var res = Ext.decode(data.responseText);
                            Ext.Msg.alert('系统提示', res.msg);
                        }
                    })
                }
            }
        });
    },
    editSellerPosition: function () {
        var grid = this.lookupReference("seller_position_grid");
        var sel = grid.getSelection(), id;
        if (sel.length == 0) {
            Ext.Msg.alert('系统提示', '请选择要修改的职位');
            return;
        }
        if (sel.length > 1) {
            Ext.Msg.alert('系统提示', '一次只能修改一个职位');
            return;
        }
        var record = sel[0];

        var form = Ext.create('Ext.form.Panel', {
            layout: 'anchor',
            defaults: {
                xtype: 'textfield',
                labelAlign: 'right',
                allowBlank: false,
                anchor: '100%',
                margin:5
            },
            url: apiBaseUrl + '/index.php/operations/Position/saveSellerPosition',
            items: [
                {fieldLabel: '职位名称', name: 'operations_post'},
                {fieldLabel: '英文名称', name: 'operations_post_en'},
                {fieldLabel: '最低折扣范围', name: 'operations_low_discount'},
                {xtype: 'hidden', name: 'operations_post_status'},
                {xtype: 'hidden', name: 'id'},
                {fieldLabel: '最高折扣范围', name: 'operations_tall_discount'}
            ],
            buttons: [
                {
                    text: '重置',
                    handler: function () {
                        this.up('form').getForm().reset();
                    }
                },
                {
                    text: '保存',
                    formBind: true,
                    disabled: true,
                    handler: function () {
                        var form = this.up('form').getForm();
                        if (form.isValid()) {
                            form.submit({
                                waitMsg: '正在新增...',
                                success: function (form, action) {
                                    console.log(action.result);
                                    win.destroy();
                                    Ext.StoreManager.lookup("SellerPositionListStore").load();
                                },
                                failure: function (form, action) {
                                    console.log(action);
                                    Ext.Msg.alert('失败', action.result.msg);
                                }
                            });
                        }
                    }
                }
            ]
        });

        form.loadRecord(record);
        var win = Ext.create('Ext.window.Window', {
            title: '修改职位',
            width: 400,
            margin: 10,
            items: [form]
        });

        win.show();
    },
    addSeller: function (btn) {
        var form = {
            xtype: 'form',
            layout: 'column',
            defaults: {
                xtype: 'textfield',
                labelAlign: 'right',
                allowBlank: false,
                columnWidth: 0.5,
                anchor: '100%',
                margin:5
            },
            items: [
                {fieldLabel: '姓名', name: 'username'},
                {fieldLabel: '工号', name: 'job_no'},
                {fieldLabel: '职位', name: 'job_pos', xtype: 'combo', editable: false},
                {fieldLabel: '性别', name: 'sex', xtype: 'combo',displayField:'val',valueField:'val',editable: false,store:Ext.create("Ext.data.Store",{
                    fields:[],
                    data:[
                        {val:'男'},
                        {val:'女'}
                    ]
                })},
                {fieldLabel: '电话', name: 'phone'},
                {fieldLabel: '地址', name: 'address'},
                {fieldLabel: '生日', name: 'birthday'},
                {fieldLabel: '所属大店', name: 'shop_id_1', xtype: 'combo', editable: false},
                {fieldLabel: '所属小店', name: 'shop_id', xtype: 'combo', editable: false},
                {fieldLabel: '是否启用签名码', name: 'is_signature',xtype:'checkbox'},
                {fieldLabel: '签名码', name: 'signature', columnWidth: 1,disabled:true},
                {fieldLabel: '备注', name: 'notes', columnWidth: 1,xtype:'textarea'}
            ]
        };
        var win = Ext.create('Ext.window.Window', {
            title: '新增店员',
            width: 600,
            margin: 10,
            items: [form],
            modal:true,
            resizable:false,
            buttons: [
                {
                    text: '保存',
                    handler: function () {

                    }
                }
            ]
        });

        win.show();
    },
    delSeller: function (btn) {
        var grid = this.lookupReference("seller_management_container").down("#seller_grid");
        var sel = grid.getSelection(), ids = [], nos = [];
        if (sel.length == 0) {
            Ext.Msg.alert('系统提示', '请选择要删除的店员');
            return;
        }
        Ext.each(sel, function (record) {
            ids.push(record.get("id"));
            nos.push(record.get("username"));
        });
        Ext.Msg.show({
            title: '系统消息',
            message: '你确定要删除以下店员吗？<br>' + nos.join('<br>'),
            buttons: Ext.Msg.YESNO,
            icon: Ext.Msg.QUESTION,
            fn: function (btn) {
                if (btn === 'yes') {
                    Ext.Ajax.request({
                        url: apiBaseUrl + '/index.php/operations/Position/delSeller',
                        waitMsg: '正在删除...',
                        params: {
                            ids: ids.join(',')
                        },
                        success: function (data) {
                            var res = Ext.decode(data.responseText);
                            console.log(res);
                            if (!res.success) {
                                Ext.Msg.alert('系统提示', res.msg);
                                return;
                            }
                            grid.getStore().load();
                        },
                        failure: function (data) {
                            var res = Ext.decode(data.responseText);
                            Ext.Msg.alert('系统提示', res.msg);
                        }
                    })
                }
            }
        });
    },
    editSeller: function () {
        var grid = this.lookupReference("seller_grid");
        var sel = grid.getSelection(), id;
        if (sel.length == 0) {
            Ext.Msg.alert('系统提示', '请选择要修改的店员');
            return;
        }
        if (sel.length > 1) {
            Ext.Msg.alert('系统提示', '一次只能修改一个店员');
            return;
        }
        var record = sel[0];

        var form = Ext.create('Ext.form.Panel',{
            layout: 'column',
            defaults: {
                xtype: 'textfield',
                labelAlign: 'right',
                allowBlank: false,
                columnWidth: 0.5,
                anchor: '100%',
                margin:5
            },
            url: apiBaseUrl + '/index.php/operations/Position/saveSeller',
            items: [
                {fieldLabel: '姓名', name: 'username'},
                {fieldLabel: '工号', name: 'job_no'},
                {fieldLabel: '职位', name: 'job_pos', xtype: 'combo', editable: false},
                {fieldLabel: '性别', name: 'sex', xtype: 'combo',displayField:'val',valueField:'val',editable: false,store:Ext.create("Ext.data.Store",{
                    fields:[],
                    data:[
                        {val:'男'},
                        {val:'女'}
                    ]
                })},
                {fieldLabel: '电话', name: 'phone'},
                {fieldLabel: '地址', name: 'address'},
                {fieldLabel: '生日', name: 'birthday'},
                //{fieldLabel: '所属大店', name: 'shop_id_1', xtype: 'combo', editable: false},
                //{fieldLabel: '所属小店', name: 'shop_id', xtype: 'combo', editable: false},
                {fieldLabel: '是否启用签名码', name: 'is_signature',xtype:'checkbox'},
                {fieldLabel: '签名码', name: 'signature', columnWidth: 1,disabled:true},
                {fieldLabel: '备注', name: 'notes', columnWidth: 1,xtype:'textarea'}
            ]
        });

        form.loadRecord(record);
        var win = Ext.create('Ext.window.Window', {
            title: '修改店员',
            width: 600,
            margin: 10,
            items: [form],
            resizable:false,
            modal:true,
            buttons: [
                {
                    text: '保存',
                    handler: function () {

                    }
                }
            ]
        });

        win.show();
    },
    addResultAllot: function (btn) {
        var form = Ext.create('Ext.form.Panel',{
            xtype: 'form',
            layout: 'column',
            method: 'POST',
            bodyPadding: 10,
            url: apiBaseUrl + '/index.php/operations/ResultsAllot/addResultAllot',
            defaults: {
                labelAlign: 'right',
                labelWidth: 70,
                columnWidth: 0.5,
                allowBlank: false,
                anchor: '100%',
                margin:5,
            },
            items: [
                {fieldLabel: '年月', name: 'month', xtype: 'datefield', columnWidth: 1,format:'Y-m',editable:false}
            ],
            buttons: [
                {
                    text: '重置',
                    handler: function () {
                        this.up('form').getForm().reset();
                    }
                },
                {
                    text: '保存',
                    formBind: true,
                    disabled: true,
                    handler: function () {
                        var form = this.up('form').getForm();
                        if (form.isValid()) {
                            form.submit({
                                waitMsg: '正在新增...',
                                success: function (form, action) {
                                    console.log(action.result);
                                    win.destroy();
                                    Ext.StoreManager.lookup("ResultAllotListStore").load();
                                },
                                failure: function (form, action) {
                                    console.log(action);
                                    Ext.Msg.alert('失败', action.result.msg);
                                }
                            });
                        }
                    }
                }
            ]
        }), shops;
        Ext.Ajax.request({
            async: false,
            url: apiBaseUrl + '/index.php/operations/ResultsAllot/getBaseData',
            params: {
                shop: 0
            },
            method: 'POST',
            success: function (res) {
                var res = Ext.decode(res.responseText);
                shops = res.data.shop;
            },
            failure: function () {
                Ext.toast("获取数据错误", "系统提示");
            }
        });
        Ext.Array.each(shops, function (shop) {
            var shop = {fieldLabel: shop.shops_name, name: 'shop-' + shop.id, xtype: 'textfield'};
            form.add(shop);
        });
        var win = Ext.create('Ext.window.Window', {
            title: '新增业绩分配',
            width: 400,
            items: [form],
            modal: true,
            resizable: false
        });

        win.show();
    },
    delResultAllot:function(btn){
        var grid = btn.up("grid");
        var sel = grid.getSelection(), ids = [];
        if (sel.length == 0) {
            Ext.Msg.alert('系统提示', '请选择要删除的业绩分配');
            return;
        }
        Ext.each(sel, function (record) {
            ids.push(record.get("id"));
        });
        Ext.Msg.show({
            title: '系统消息',
            message: '你确定要删除所选业绩分配吗？',
            buttons: Ext.Msg.YESNO,
            icon: Ext.Msg.QUESTION,
            fn: function (btn) {
                if (btn === 'yes') {
                    Ext.Ajax.request({
                        url: apiBaseUrl + '/index.php/operations/ResultsAllot/delResultAllot',
                        waitMsg: '正在删除...',
                        params: {
                            ids: ids.join(',')
                        },
                        success: function (data) {
                            var res = Ext.decode(data.responseText);
                            console.log(res);
                            if (!res.success) {
                                Ext.Msg.alert('系统提示', res.msg);
                                return;
                            }
                            grid.getStore().load();
                        },
                        failure: function (data) {
                            var res = Ext.decode(data.responseText);
                            Ext.Msg.alert('系统提示', res.msg);
                        }
                    })
                }
            }
        });
    },
    editResultAllot:function(btn){
        var grid = btn.up("grid");
        var sel = grid.getSelection(), id;
        if (sel.length == 0) {
            Ext.Msg.alert('系统提示', '请选择要修改的职位');
            return;
        }
        if (sel.length > 1) {
            Ext.Msg.alert('系统提示', '一次只能修改一个职位');
            return;
        }
        var record = sel[0];

        var form = Ext.create('Ext.form.Panel', {
            xtype: 'form',
            layout: 'vbox',
            bodyPadding: 10,
            defaults: {
                labelAlign: 'right',
                allowBlank: false,
                anchor: '100%',
                margin:5
            },
            url: apiBaseUrl + '/index.php/operations/ResultsAllot/saveResultAllot',
            items: [
                {xtype:'hidden',name:'id'},
                {fieldLabel: '店铺', name: 'shops_name',xtype:'displayfield'},
                {fieldLabel: '年月', name: 'themonths',xtype:'datefield',format:'Y-m'},
                {fieldLabel: '业绩', name: 'money',xtype: 'textfield',}
            ],
            buttons: [
                {
                    text: '重置',
                    handler: function () {
                        this.up('form').getForm().reset();
                    }
                },
                {
                    text: '保存',
                    formBind: true,
                    disabled: true,
                    handler: function () {
                        var form = this.up('form').getForm();
                        if (form.isValid()) {
                            form.submit({
                                waitMsg: '正在新增...',
                                success: function (form, action) {
                                    win.destroy();
                                    grid.getStore().load();
                                },
                                failure: function (form, action) {
                                    Ext.Msg.alert('失败', action.result.msg);
                                }
                            });
                        }
                    }
                }
            ]
        });

        form.loadRecord(record);
        var win = Ext.create('Ext.window.Window', {
            title: '修改业绩分配',
            width: 400,
            items: [form]
        });

        win.show();
    },
    addPaymentMethod:function(btn){
        var store = Ext.create('Ext.data.Store',{
            fields:['name','val'],
            data:[
                {name:'是',val:1},
                {name:'否',val:0}
            ]
        });
        var type = Ext.create('Ext.data.Store',{
            fields:['name','val'],
            data:[
                {name:'银行卡',val:1},
                {name:'现金',val:2},
                {name:'礼券',val:3},
                {name:'其他',val:4}
            ]
        });
        var form = Ext.create('Ext.form.Panel',{
            xtype: 'form',
            layout: 'column',
            method: 'POST',
            bodyPadding: 10,
            url: apiBaseUrl + '/index.php/operations/ClearingForm/addPaymentMethod',
            defaults: {
                labelAlign: 'right',
                labelWidth: 70,
                columnWidth: 0.5,
                allowBlank: false,
                anchor: '100%',
                margin:5,
            },
            items: [
                {fieldLabel: '结算名称', name: 'cleraing_name', xtype: 'textfield'},
                {fieldLabel: '结算类别', name: 'cleraing_class', xtype: 'combo',editable:false,store:type,displayField:'name',valueField:'val'},
                {fieldLabel: '手续费', name: 'cleraing_poundage', xtype: 'textfield'},
                {fieldLabel: '线上支付', name: 'cleraing_onlinepayment', xtype: 'combo',editable:false,store:store,displayField:'name',valueField:'val'},
                {fieldLabel: '是否找零', name: 'cleraing_change', xtype: 'combo',editable:false,store:store,displayField:'name',valueField:'val'},
                {fieldLabel: '是否积分', name: 'cleraing_integral', xtype: 'combo',editable:false,store:store,displayField:'name',valueField:'val'}
            ],
            buttons: [
                {
                    text: '重置',
                    handler: function () {
                        this.up('form').getForm().reset();
                    }
                },
                {
                    text: '保存',
                    formBind: true,
                    disabled: true,
                    handler: function () {
                        var form = this.up('form').getForm();
                        if (form.isValid()) {
                            form.submit({
                                waitMsg: '正在新增...',
                                success: function (form, action) {
                                    console.log(action.result);
                                    win.destroy();
                                    btn.up("grid").getStore().load();
                                },
                                failure: function (form, action) {
                                    console.log(action);
                                    Ext.Msg.alert('失败', action.result.msg);
                                }
                            });
                        }
                    }
                }
            ]
        });
        var win = Ext.create('Ext.window.Window', {
            title: '新增结算方式',
            width: 400,
            items: [form],
            modal: true,
            resizable: false
        });

        win.show();
    },
    delPaymentMethod:function(btn){
        var grid = btn.up("grid");
        var sel = grid.getSelection(), ids = [];
        if (sel.length == 0) {
            Ext.Msg.alert('系统提示', '请选择要删除的结算方式');
            return;
        }
        Ext.each(sel, function (record) {
            ids.push(record.get("id"));
        });
        Ext.Msg.show({
            title: '系统消息',
            message: '你确定要删除所选结算方式吗？',
            buttons: Ext.Msg.YESNO,
            icon: Ext.Msg.QUESTION,
            fn: function (btn) {
                if (btn === 'yes') {
                    Ext.Ajax.request({
                        url: apiBaseUrl + '/index.php/operations/ClearingForm/delPaymentMethod',
                        waitMsg: '正在删除...',
                        params: {
                            ids: ids.join(',')
                        },
                        success: function (data) {
                            var res = Ext.decode(data.responseText);
                            if (!res.success) {
                                Ext.Msg.alert('系统提示', res.msg);
                                return;
                            }
                            grid.getStore().load();
                        },
                        failure: function (data) {
                            var res = Ext.decode(data.responseText);
                            Ext.Msg.alert('系统提示', res.msg);
                        }
                    })
                }
            }
        });
    },
    editPaymentMethod:function(btn){
        var store = Ext.create('Ext.data.Store',{
            fields:['name','val'],
            data:[
                {name:'是',val:1},
                {name:'否',val:0}
            ]
        }),type = Ext.create('Ext.data.Store',{
            fields:['name','val'],
            data:[
                {name:'银行卡',val:1},
                {name:'现金',val:2},
                {name:'礼券',val:3},
                {name:'其他',val:4}
            ]
        }),status = Ext.create('Ext.data.Store',{
            fields:['name','val'],
            data:[
                {name:'激活',val:0},
                {name:'禁用',val:1}
            ]
        });
        var grid = btn.up("grid");
        var sel = grid.getSelection(), id;
        if (sel.length == 0) {
            Ext.Msg.alert('系统提示', '请选择要修改的结算方式');
            return;
        }
        if (sel.length > 1) {
            Ext.Msg.alert('系统提示', '一次只能修改一个结算方式');
            return;
        }
        var record = sel[0];

        var form = Ext.create('Ext.form.Panel', {
            xtype: 'form',
            layout: 'vbox',
            bodyPadding: 10,
            defaults: {
                labelAlign: 'right',
                allowBlank: false,
                anchor: '100%',
                margin:5
            },
            url: apiBaseUrl + '/index.php/operations/ClearingForm/saveResultAllot',
            items: [
                { name: 'id', xtype: 'hidden'},
                {fieldLabel: '结算名称', name: 'cleraing_name', xtype: 'textfield'},
                {fieldLabel: '结算类别', name: 'cleraing_class', xtype: 'combo',editable:false,store:type,displayField:'name',valueField:'val'},
                {fieldLabel: '手续费', name: 'cleraing_poundage', xtype: 'textfield'},
                {fieldLabel: '线上支付', name: 'cleraing_onlinepayment', xtype: 'combo',editable:false,store:store,displayField:'name',valueField:'val'},
                {fieldLabel: '是否找零', name: 'cleraing_change', xtype: 'combo',editable:false,store:store,displayField:'name',valueField:'val'},
                {fieldLabel: '是否积分', name: 'cleraing_integral', xtype: 'combo',editable:false,store:store,displayField:'name',valueField:'val'},
                {fieldLabel: '是否激活', name: 'cleraing_condition', xtype: 'combo',editable:false,store:status,displayField:'name',valueField:'val'}
            ],
            buttons: [
                {
                    text: '重置',
                    handler: function () {
                        this.up('form').getForm().reset();
                    }
                },
                {
                    text: '保存',
                    formBind: true,
                    disabled: true,
                    handler: function () {
                        var form = this.up('form').getForm();
                        if (form.isValid()) {
                            form.submit({
                                waitMsg: '正在新增...',
                                success: function (form, action) {
                                    win.destroy();
                                    grid.getStore().load();
                                },
                                failure: function (form, action) {
                                    Ext.Msg.alert('失败', action.result.msg);
                                }
                            });
                        }
                    }
                }
            ]
        });

        form.loadRecord(record);
        var win = Ext.create('Ext.window.Window', {
            title: '修改结算方式',
            width: 400,
            items: [form]
        });

        win.show();
    }
});