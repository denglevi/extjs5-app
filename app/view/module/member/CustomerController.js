/**
 * Created by Administrator on 2015-07-16.
 */
Ext.define('erp.view.module.member.CustomerController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.customer',

    requires: [
        'Ext.button.Button',
        'Ext.container.Container',
        'Ext.data.Store',
        'Ext.data.StoreManager',
        'Ext.form.RadioGroup',
        'Ext.form.field.ComboBox',
        'Ext.form.field.Date',
        'Ext.form.field.Display',
        'Ext.form.field.Hidden',
        'Ext.form.field.Number',
        'Ext.form.field.Radio',
        'Ext.form.field.Text',
        'Ext.form.field.TextArea',
        'Ext.grid.Panel',
        'Ext.layout.container.Column',
        'Ext.layout.container.VBox',
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
    delCustomer: function (del_btn) {
        var sel = del_btn.up('grid').getSelection(), ids = [], names = [];
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
    editCustomer: function (grid, rowIndex, colIndex, item, e, record, row) {

        var url = apiBaseUrl + '/index.php/Membership/Customer/editCustomer';
        var form = this.getCustomerFormWin(url);
        form.loadRecord(record);
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
                {fieldLabel: '生日', name: 'customer_birthday', xtype: 'datefield', editable: false, format: 'Y-m-d'},
                {fieldLabel: '年代', name: 'customer_age', xtype: 'textfield'},
                {fieldLabel: '手机号  ', name: 'customer_phone', xtype: 'textfield'},
                {fieldLabel: '推荐人  ', name: 'customer_referrer', xtype: 'textfield'},
                {
                    fieldLabel: '所属终端  ',
                    name: 'customer_terminal',
                    xtype: 'combo',
                    editable: false,
                    disabled: true,
                    displayField: 'shops_name',
                    valueField: 'id'
                },
                {
                    fieldLabel: '登记终端  ',
                    name: 'customer_regter',
                    xtype: 'combo',
                    editable: false,
                    disabled: true,
                    displayField: 'shops_name',
                    valueField: 'id'
                },
                {fieldLabel: '省份', name: 'customer_province', xtype: 'textfield'},
                {fieldLabel: '城市', name: 'customer_city', xtype: 'textfield'},
                {fieldLabel: '地区', name: 'customer_area', xtype: 'textfield'},
                {fieldLabel: '备注', name: 'customer_backups', xtype: 'textareafield', columnWidth: 1,allowBlank:true},
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
            params: {
                shop: 1
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
    },
    viewCustomerInfo: function (grid, rowIndex, colIndex, item, e, record, row) {
        var grid = this.getCustomerInfoGrid(record),me=this;
        var win = Ext.create('Ext.window.Window', {
            title: '查看顾客信息',
            width: 600,
            height: 500,
            modal: true,
            maximizable:true,
            layout: {
                type: 'vbox',
                align: 'strech'
            },
            items: [
                {
                    xtype: 'container',
                    layout: 'column',
                    margin: 20,
                    width: '100%',
                    defaults: {
                        xtype: 'displayfield',
                        labelAlign: 'right',
                        labelWidth: 70,
                        columnWidth: 0.25
                    },
                    items: [
                        {fieldLabel: '顾客姓名', value: record.get("customer_name")},
                        {fieldLabel: '顾客类型', value:  record.get("customer_type")},
                        {fieldLabel: '性别', value:  record.get("customer_sex")},
                        {fieldLabel: '生日', value:  record.get("customer_birthday")},
                        {fieldLabel: '年龄', value:  record.get("customer_age")},
                        {fieldLabel: '手机号', value:  record.get("customer_phone")},
                        {fieldLabel: '推荐人', value: record.get("customer_referrer")},
                        {fieldLabel: '所属终端', value:  record.get("customer_terminal")},
                        {fieldLabel: '登记终端', value:  record.get("customer_regter")},
                        {fieldLabel: '省份', value:  record.get("customer_province")},
                        {fieldLabel: '城市', value:  record.get("customer_city")},
                        {fieldLabel: '地区', value:  record.get("customer_area")},
                        {fieldLabel: '备注', value:  record.get("customer_backups")}
                    ]
                },
                {
                    xtype: 'container',
                    bodyPadding: 10,
                    itemId:'btnContainer',
                    defaults: {
                        xtype: 'button',
                        margin: 5,
                        handler:me.onCustmoerInfoBtnClick,
                        record_id:record.get("id")
                    },
                    items: [
                        {
                            text: '消费信息',
                            disabled:true
                        },
                        {
                            text: '消费流水',
                        },
                        {
                            text: '消费商品明细'
                        }
                    ]
                },
                grid
            ],
            buttons:[
                {text:'发卡',
                    handler:function(){
                        var id = record.get("id");
                        Ext.Ajax.request({
                            url:apiBaseUrl+'/index.php/Membership/Customer/issueCard',
                            method: 'POST',
                            params:{id:id},
                            success: function (data) {
                                var res = Ext.decode(data.responseText);
                                if (!res.success) {
                                    Ext.Msg.alert('系统提示', res.data);
                                    return;
                                }
                                var win = Ext.create('Ext.window.Window', {
                                    title: '发卡信息',
                                    width: 400,
                                    modal: true,
                                    bodyPadding: 10,
                                    layout: 'hbox',
                                    items: [
                                        {
                                            xtype: 'form',
                                            items: [
                                                {
                                                    xtype: 'combo',
                                                    fieldLabel: '会员卡类别',
                                                    displayField: 'type',
                                                    valueField: 'type',
                                                    store: Ext.create("Ext.data.Store", {
                                                        fields: [],
                                                        data: res.data
                                                    }),
                                                    editable: false,
                                                    name: 'type'
                                                },
                                                {
                                                    xtype: 'textfield',
                                                    fieldLabel: '卡号',
                                                    name: 'no'
                                                }, {
                                                    xtype: 'button',
                                                    text: '查询',
                                                    handler: function () {
                                                        var type = win.down("combo[name=type]").getValue();
                                                        var no = win.down("textfield[name=no]").getValue();
                                                        Ext.Ajax.request({
                                                            url: apiBaseUrl + '/index.php/Membership/Customer/addVipInfo',
                                                            method: 'post',
                                                            params: {type: type, no: no},
                                                            success: function (data) {
                                                                var res = Ext.decode(data.responseText);
                                                                if (!res.success) {
                                                                    Ext.Msg.alert('系统提示', res.data);
                                                                    return;
                                                                }
                                                                win.down("#faka").setDisabled(false);
                                                            }
                                                        })
                                                    }
                                                }
                                            ]
                                        }
                                    ],
                                    buttons: [
                                        {
                                            text: '发卡',
                                            disabled: true,
                                            xtype: 'button',
                                            itemId: 'faka',
                                            handler: function () {
                                                var id = record.get("id");
                                                var type = win.down("combo[name=type]").getValue();
                                                var no = win.down("textfield[name=no]").getValue();
                                                Ext.Ajax.request({
                                                    url: apiBaseUrl + '/index.php/Membership/Customer/addVipIssCard',
                                                    method: 'POST',
                                                    params: {id: id, type: type, no: no},
                                                    success: function (data) {
                                                        var res = Ext.decode(data.responseText);
                                                        if (!res.success) {
                                                            Ext.Msg.alert('系统提示', res.msg);
                                                            return;
                                                        }
                                                        //Ext.getBody().unmask();
                                                        Ext.Msg.alert('系统提示', res.data);
                                                        win.down("#faka").setDisabled(true);
                                                        win.destroy();
                                                    },
                                                    failur: function (action) {
                                                        if (action.result.data) {
                                                            Ext.toast(action.result.data, "系统提示");
                                                            return;
                                                        }
                                                        Ext.toast("网络请求错误,请检查网络!", "系统提示");
                                                    }
                                                });
                                            }
                                        }
                                    ]
                                });
                                win.show();
                                //Ext.getBody().unmask();
                                //win.destroy();
                            },
                            failure: function ( action) {
                                if (action.result.msg) {
                                    Ext.toast(action.result.msg, "系统提示");
                                    return;
                                }
                                Ext.toast("网络请求错误,请检查网络!", "系统提示");
                            }
                        });
                    }
                }
            ]
        });
        win.show();
    },
    getCustomerInfoGrid: function (record) {
        var columns = [
            {text: '消费信息', dataIndex: 'key',flex:1},
            {text: '参数', dataIndex: 'val',flex:1}
        ];
        var ref = record.get("id");

        var grid = Ext.create("Ext.grid.Panel",{
            xtype: 'grid',
            flex: 1,
            width: '100%',
            columns: columns,
            sortableColumns:false,
            //store: store
        });
        Ext.Ajax.request({
            async:true,
            url:apiBaseUrl + '/index.php/Membership/Customer/chaConsumeInfo',
            method:'POST',
            params:{id:ref},
            success:function(res){
                var json = Ext.decode(res.responseText),
                    bResult = json.data,
                    data = [
                        {key: '首次消费日期', val:bResult.min_time},
                        {key: '首次消费数量', val: bResult.max_num},
                        {key: '首次消费金额', val: bResult.min_money},
                        {key: '首次关联单号', val: bResult.min_code},
                        {key: '累计消费次数', val: bResult.count_cishu},
                        {key: '累计消费数量', val: bResult.count_num},
                        {key: '累计消费金额', val: bResult.count_money},
                        {key: '最近消费日', val: bResult.max_time},
                        {key: '最近消费数量', val: bResult.max_num},
                        {key: '最近消费金额', val: bResult.max_money}
                    ],
                    store = Ext.create('Ext.data.Store',{
                        fields: [],
                        data:data
                    });
                grid.setStore(store);
            }
        });
        return grid;
    },
    onCustmoerInfoBtnClick:function(btn){
        var record_id = this.record_id;
        var text = btn.getText(),
            items = btn.up("container").items.items,
            store,columns,
            grid = btn.up("container").up("window").down("grid");;
        Ext.Array.each(items,function(item){
            item.setDisabled(false);
        });
        btn.setDisabled(true);
        if("消费信息" == text){
            columns = [
                {text: '消费信息', dataIndex: 'key',flex:1},
                {text: '参数', dataIndex: 'val',flex:1}
            ];
            Ext.Ajax.request({
                async:true,
                url:apiBaseUrl + '/index.php/Membership/Customer/chaConsumeInfo',
                method:'POST',
                params:{id:record_id},
                success:function(res){
                    var json = Ext.decode(res.responseText),
                        bResult = json.data,
                        data = [
                            {key: '首次消费日期', val:bResult.min_time},
                            {key: '首次消费数量', val: bResult.max_num},
                            {key: '首次消费金额', val: bResult.min_money},
                            {key: '首次关联单号', val: bResult.min_code},
                            {key: '累计消费次数', val: bResult.count_cishu},
                            {key: '累计消费数量', val: bResult.count_num},
                            {key: '累计消费金额', val: bResult.count_money},
                            {key: '最近消费日', val: bResult.max_time},
                            {key: '最近消费数量', val: bResult.max_num},
                            {key: '最近消费金额', val: bResult.max_money}
                        ],
                        store = Ext.create('Ext.data.Store',{
                            fields: [],
                            data:data
                        });
                    grid.setStore(store);
                }
            });
        }else if("消费流水" == text){
            columns = [
                {text: '单号', dataIndex: 'numbers_no',flex:1},
                {text: '营业日期', dataIndex: 'numbers_time',flex:1},
                {text: '名称', dataIndex: 'numbers_status',flex:1},
                {text: '终端', dataIndex: 'shops_name',flex:1},
                {text: '数量', dataIndex: 'numbers_num',flex:1},
                {text: '消费金额', dataIndex: 'numbers_money',flex:1},
                {text: '积分', dataIndex: 'numbers_integral',flex:1}
            ];
            Ext.Ajax.request({
                async:true,
                url:apiBaseUrl + '/index.php/Membership/Customer/chaConsumeNumbers',
                method:'POST',
                params:{id:record_id},
                success:function(res){
                    var json = Ext.decode(res.responseText),
                        bResult = json.data;
                    store = Ext.create('Ext.data.Store',{
                        fields: [],
                        data:bResult
                    });
                    grid.setStore(store);
                }
            });
        }else if("消费商品明细" == text){
            columns = [
                {text: '营业日期', dataIndex: 'numbers_time',flex:1},
                {text: '终端', dataIndex: 'shops_name',flex:1},
                {text: '状态', dataIndex: 'numbers_status',flex:1},
                {text: '商品代码', dataIndex: 'detail_code',flex:2},
                {text: '商品名称', dataIndex: 'detail_name',flex:1},
                {text: '商品品牌', dataIndex: 'detail_brand',flex:1},
                {text: '颜色', dataIndex: 'detail_color',flex:1},
                {text: '尺码', dataIndex: 'detail_size',flex:1},
                {text: '参考价', dataIndex: 'detail_price',flex:1},
                {text: '折扣', dataIndex: 'detail_discount',flex:1},
                {text: '会员折扣', dataIndex: 'vip_discount',flex:1},
                {text: '金额', dataIndex: 'detail_money',flex:1}
            ];
            Ext.Ajax.request({
                async:true,
                url:apiBaseUrl + '/index.php/Membership/Customer/chaConsumeDetail',
                method:'POST',
                params:{id:record_id},
                success:function(res){
                    var json = Ext.decode(res.responseText),
                        bResult = json.data;
                    store = Ext.create('Ext.data.Store',{
                        fields: [],
                        data:bResult
                    });
                    grid.setStore(store);
                }
            });
        }
        grid.reconfigure(columns);
    }
});