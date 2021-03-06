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
                {fieldLabel: '英文名称', name: 'operations_post_en',allowBlank:true},
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
    editStatusPost:function(btn){
        var grid = this.lookupReference("seller_position_grid");

        var sel = grid.getSelection(), ids = [], nos = [];nodel=[];
        var status=btn.itemId;
        if (sel.length == 0) {
            Ext.Msg.alert('系统提示', '请选择职位');
            return;
        }
        if(status=='Enabled'){
            Ext.each(sel, function (record) {
                if(record.get("operations_post_status")==1){
                    nodel.push(record.get("operations_post"));
                }
                ids.push(record.get("id"));
                nos.push(record.get("operations_post"));
            });
            if(nodel.length!=0){
                Ext.Msg.alert('系统提示', '以下已启用职位不允许再次启用!<br>'+nodel.join('<br>'));
                return;
            }
        }
        if(status=='disable'){
            Ext.each(sel, function (record) {
                if(record.get("operations_post_status")==2){
                    nodel.push(record.get("operations_post"));
                }
                ids.push(record.get("id"));
                nos.push(record.get("operations_post"));
            });
            if(nodel.length!=0){
                Ext.Msg.alert('系统提示', '以下已禁用职位不允许再次禁用!<br>'+nodel.join('<br>'));
                return;
            }
        }
        Ext.Msg.show({
            title: '系统消息',
            message: '操作职位状态时,此职位下的职员状态将一起改变,你确定要改变以下职位状态吗？<br>' + nos.join('<br>'),
            buttons: Ext.Msg.YESNO,
            icon: Ext.Msg.QUESTION,
            fn: function (btn) {
                if (btn === 'yes') {
                    Ext.Ajax.request({
                        url: apiBaseUrl + '/index.php/operations/Position/editSellerPositionStatus',
                        waitMsg: '正在修改...',
                        params: {
                            ids: ids.join(','),
                            status:status
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
    /*店员的状态修改*/
    editStatusSeller:function(btn){
        var grid = this.lookupReference("seller_grid");
        var sel = grid.getSelection(), ids = [], nos = [];nodel=[];
        var status=btn.itemId;
        var statusno='';
        if (sel.length == 0) {
            Ext.Msg.alert('系统提示', '请选择职位');
            return;
        }
        if(status=='Enabled'){
            statusno=1;
            Ext.each(sel, function (record) {
                if(record.get("status")==1){
                    nodel.push(record.get("username"));
                }
                ids.push(record.get("id"));
                nos.push(record.get("username"));
            });
            if(nodel.length!=0){
                Ext.Msg.alert('系统提示', '以下已启用职位不允许再次启用!<br>'+nodel.join('<br>'));
                return;
            }
        }
        if(status=='disable'){
            statusno=0;
            Ext.each(sel, function (record) {
                if(record.get("status")==0){
                    nodel.push(record.get("username"));
                }
                ids.push(record.get("id"));
                nos.push(record.get("username"));
            });
            if(nodel.length!=0){
                Ext.Msg.alert('系统提示', '以下已禁用职位不允许再次禁用!<br>'+nodel.join('<br>'));
                return;
            }
        }
        Ext.Msg.show({
            title: '系统消息',
            message: '操作职位状态时,此职位下的职员状态将一起改变,你确定要改变以下职位状态吗？<br>' + nos.join('<br>'),
            buttons: Ext.Msg.YESNO,
            icon: Ext.Msg.QUESTION,
            fn: function (btn) {
                if (btn === 'yes') {
                    Ext.Ajax.request({
                        url: apiBaseUrl + '/index.php/operations/Saleder/editStatusSeller',
                        waitMsg: '正在修改...',
                        params: {
                            ids: ids.join(','),
                            status:statusno
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
    addSeller: function (btn) {
        var form =  Ext.create('Ext.form.Panel', {
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
                {fieldLabel: '工号', name: 'job_no',
                    listeners:{
                        blur:function(val){
                            var box = this;
                            var job_no=box.getValue();
                            Ext.Ajax.request({
                                aysnc: true,
                                method: 'POST',
                                url: apiBaseUrl + '/index.php/Operations/Saleder/verificationId',
                                params: {
                                    job_no:job_no
                                },
                                success: function (res) {
                                    var json = Ext.decode(res.responseText);
                                    if (!json.success) {
                                        Ext.toast(json.msg, "系统提示");
                                        box.setValue("");
                                        return;
                                    }

                                }
                            })

                        }
                    }
                },
                {fieldLabel: '职位', name: 'job_post', xtype: 'combo', editable: false,
                    valueField: 'id',
                    displayField: 'operations_post',
                },
                {fieldLabel: '性别', name: 'sex', xtype: 'combo',displayField:'val',valueField:'val',editable: false,store:Ext.create("Ext.data.Store",{
                    fields:[],
                    data:[
                        {val:'男'},
                        {val:'女'}
                    ]
                })},
                {fieldLabel: '电话', name: 'phone',allowBlank:true},
                {fieldLabel: '地址', name: 'address',allowBlank:true},
                {fieldLabel: '生日', name: 'birthday',allowBlank:true},
                {fieldLabel: '所属大店',
                    name: 'shop_id_1',
                    xtype: 'combo',
                    editable: false,
                    valueField: 'id',
                    displayField: 'shops_name',
                    listeners:{
                        change:function(val){
                            var box = this;
                            var max_shops=box.getValue();
                            var sub = box.up("form").down("combo[name=shop_id]");
                            Ext.Ajax.request({
                                aysnc: true,
                                method: 'POST',
                                url: apiBaseUrl + '/index.php/Commodity/Distribution/getMinStore',
                                params: {
                                    max_shops:max_shops
                                },
                                success: function (res) {
                                    var json = Ext.decode(res.responseText);
                                    if (!json.success) {
                                        Ext.toast(json.msg, "系统提示");
                                        return;
                                    }

                                    sub.clearValue();
                                    sub.setStore(Ext.create('Ext.data.Store', {
                                        fields: ['id', 'name'],
                                        data: json.data
                                    }));
                                    sub.setDisabled(false);
                                }
                            })

                        }
                    }
                },
                {fieldLabel: '所属小店',
                    name: 'shop_id',
                    xtype: 'combo',
                    editable: false,
                    valueField: 'id',
                    displayField: 'shops_name',
                    itemId:'min_shops',allowBlank:true},
                {fieldLabel: '是否启用签名码', name: 'is_signaturex',xtype:'checkbox',
                    listeners:{
                        change:function(){
                            var box = this;
                            if(box.getValue())form.down("textfield[name=signature]").setDisabled(false);
                            else{
                                form.down("textfield[name=signature]").setValue("");
                                form.down("textfield[name=signature]").setDisabled(true);
                            }
                        }
                    }
                },
                {fieldLabel: '签名码', name: 'signature', inputType: 'password',columnWidth: 1,disabled:true},
                {fieldLabel: '备注', name: 'notes', columnWidth: 1,xtype:'textarea',allowBlank:true}
            ],

        });
        Ext.Ajax.request({
            async:true,
            url: apiBaseUrl + '/index.php/Operations/Saleder/getBaseData',
            method:'POST',
            params: {
                shop: 1,
                post: 1,
                max_shop:1,
            },
            success:function(res){
                var json = Ext.decode(res.responseText), data = json.data;
                if (data.shop === undefined || data.post === undefined || data.max_shop === undefined) {
                    Ext.toast("数据获取错误,请重试!", "系统提示");
                    return;
                }
                var form = win.down("form");
                var shop = form.down("combo[name=shop_id_1]"),
                    job_pos = form.down("combo[name=job_post]"),
                    shop_store = Ext.create('Ext.data.Store', {
                        fields: [],
                        data: data.max_shop
                    }),
                    job_pos_store = Ext.create('Ext.data.Store', {
                        fields: [],
                        data: data.post
                    });
                shop.setStore(shop_store);
                job_pos.setStore(job_pos_store);
                console.log(job_pos_store);
            },
            failure:function(){

            }
        });
        var win = Ext.create('Ext.window.Window', {
            title: '新增店员',
            width: 600,
            margin: 10,
            items: [form],
            modal:true,
            resizable:false,
            buttons: [
                {
                    text: '重置',
                    handler: function () {
                        win.down("form").getForm().reset();
                    }
                },
                {
                    text: '提交',
                    formBind: true,
                    disabled: false,
                    handler: function (btn) {
                        var form =  win.down("form").getForm();
                        var  is_signature=form.findField('is_signaturex').getValue()?1:0;
                        if (form.isValid()) {
                            form.submit({
                                waitMsg: '正在提交...',
                                url: apiBaseUrl + '/index.php/operations/Saleder/addOperationsSaleder',
                                method: 'POST',
                                params:{
                                    is_signature:is_signature
                                },
                                success: function (form, action) {
                                    win.destroy();
                                    Ext.StoreManager.lookup("SellerListStore").load();
                                },
                                failure: function (form, action) {
                                    console.log(action);
                                    Ext.Msg.alert('失败','添加员工失败');
                                }
                            });
                        }
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