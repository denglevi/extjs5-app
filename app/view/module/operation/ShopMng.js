/**
 * Created by Administrator on 2015-08-05.
 */
Ext.define('erp.view.module.operation.ShopMng', {
    extend: 'Ext.grid.Panel',
    xtype: 'shopmng',

    requires: [
        'Ext.data.Store',
        'Ext.data.StoreManager',
        'Ext.form.field.ComboBox',
        'Ext.form.field.Hidden',
        'Ext.form.field.Text',
        'Ext.grid.column.Action',
        'Ext.layout.container.Column',
        'Ext.toolbar.Fill',
        'Ext.toolbar.Paging',
        'Ext.window.Window'
    ],
    initComponent: function (args) {
        var me = this;
        Ext.apply(me, {
            sortableColumns: false,
            enableColumnHide: false,
            store: "ShopStore",
            tbar: [
                {text: '新增', iconCls: 'addIcon', handler: this.addShop},
                //{text:'删除',iconCls:'delIcon',handler:"delVIPCardType"},
                //{text:'修改',iconCls:'editIcon',handler:"editVIPCardType"}
            ],
            columns: [
                {text: '店铺编号', dataIndex: 'shops_no', flex: 1},
                {text: '店铺名称', dataIndex: 'shops_name', flex: 1},
                {text: '店铺地址', dataIndex: 'shops_site', flex: 2},
                {text: '店铺电话', dataIndex: 'shops_tel', flex: 1},
                {
                    text: '店铺类型', dataIndex: 'sid', flex: 1, renderer: function (val) {
                    if (0 == val) return "大店";
                    return "小店";
                }
                },
                {
                    text: '操作',
                    xtype: 'actioncolumn',
                    flex: 1,
                    items: [
                        {
                            iconCls: 'delIcon columnAction',
                            tooltip: '删除',
                            handler: me.delShop
                        },
                        {
                            iconCls: 'editIcon columnAction',
                            tooltip: '修改',
                            handler: me.editShop
                        }
                    ]
                }
            ],
            bbar: [
                '->', {
                    xtype: 'pagingtoolbar',
                    store: 'ShopStore'
                }],
            listeners: {
                afterrender: function () {
                    this.getStore().load();
                }
            }
        });
        this.callParent(args);
    },
    addShop: function () {
        var me = this,win;
        var form = Ext.create("Ext.form.Panel",{
            layout: "column",
            url: apiBaseUrl + '/index.php/Operations/Shop/addShop',
            defaults: {
                xtype: "textfield",
                margin: 5,
                columnWidth: 0.5,
                labelAlign: 'right',
                labelWidth: 70,
                allowBlank: false
            },
            items: [
                {fieldLabel: "店铺编号", name: "shops_no"},
                {fieldLabel: "店铺名称", name: "shops_name"},
                {fieldLabel: "店铺电话", name: "shops_tel"},
                {fieldLabel: "所属店铺", name: "sid",xtype:"combo",editable:false,displayField:"shops_name",valueField:"id",disabled:true},
                {fieldLabel: "店铺地址", name: "shops_site", columnWidth: 1}
            ],
            buttons: [
                {
                    text: "重置", handler: function () {
                    this.up("form").getForm().reset();
                }
                },
                {
                    text: "提交", disabled: true, formBind: true, handler: function () {
                        var form = this.up("form").getForm();
                    form.submit({
                        waitMsg:"正在提交...",
                        success:function(form,action){
                            var res = action.result;
                            if(res.success){
                                Ext.StoreManager.lookup("ShopStore").load();
                                win.destroy();
                            }
                        },
                        failure:function(form,action){
                            if(action.response.status == 200){
                                Ext.toast(json.msg,"系统提示");
                                return;
                            }
                            Ext.toast("服务请求出错,请检查网络稍后再试!","系统提示");
                        }
                    })
                }
                }
            ]

        });
        Ext.Ajax.request({
            async:true,
            url: apiBaseUrl + '/index.php/Operations/Shop/getTopShopList',
            method:"POST",
            success:function(res){
                var json = Ext.decode(res.responseText);
                if(!json.success){
                    Ext.toast(json.msg,"系统提示");
                    return;
                }
                var store = Ext.create("Ext.data.Store",{
                    fields:[],
                    data:json.data
                });

                form.down("combo").setStore(store);
                form.down("combo").setDisabled(false);
            },
            failure:function(){
                Ext.toast("服务请求出错,请检查网络稍后再试!","系统提示");
            }
        });
        win = Ext.create("Ext.window.Window", {
            title: "新增店铺",
            modal: true,
            resizable: false,
            margin: 10,
            width: 500,
            items: [form]
        });

        win.show();
    },
    editShop:function(grid, rowIndex, colIndex, item, e, record, row){
        var me = this,win;
        var form = Ext.create("Ext.form.Panel",{
            layout: "column",
            url: apiBaseUrl + '/index.php/Operations/Shop/editShop',
            defaults: {
                xtype: "textfield",
                margin: 5,
                columnWidth: 0.5,
                labelAlign: 'right',
                labelWidth: 70,
                allowBlank: false
            },
            items: [
                {xtype:'hidden',name:"id"},
                {fieldLabel: "店铺编号", name: "shops_no"},
                {fieldLabel: "店铺名称", name: "shops_name"},
                {fieldLabel: "店铺电话", name: "shops_tel"},
                {fieldLabel: "所属店铺", name: "sid",xtype:"combo",editable:false,displayField:"shops_name",valueField:"id",disabled:true},
                {fieldLabel: "店铺地址", name: "shops_site", columnWidth: 1}
            ],
            buttons: [
                {
                    text: "重置", handler: function () {
                    this.up("form").getForm().reset();
                }
                },
                {
                    text: "提交", disabled: true, formBind: true, handler: function () {
                    var form = this.up("form").getForm();
                    form.submit({
                        waitMsg:"正在提交...",
                        success:function(form,action){
                            var res = action.result;
                            if(res.success){
                                grid.getStore().load();
                                win.destroy();
                            }
                        },
                        failure:function(form,action){
                            if(action.response.status == 200){
                                Ext.toast(json.msg,"系统提示");
                                return;
                            }
                            Ext.toast("服务请求出错,请检查网络稍后再试!","系统提示");
                        }
                    })
                }
                }
            ]

        });
        Ext.Ajax.request({
           async:true,
            url: apiBaseUrl + '/index.php/Operations/Shop/getTopShopList',
            method:"POST",
            success:function(res){
                var json = Ext.decode(res.responseText);
                if(!json.success){
                    Ext.toast(json.msg,"系统提示");
                    return;
                }
                var store = Ext.create("Ext.data.Store",{
                    fields:[],
                    data:json.data
                });

                form.down("combo").setStore(store);
                form.down("combo").setDisabled(false);
            },
            failure:function(){
                Ext.toast("服务请求出错,请检查网络稍后再试!","系统提示");
            }
        });
        form.loadRecord(record);
        win = Ext.create("Ext.window.Window", {
            title: "修改店铺",
            modal: true,
            resizable: false,
            margin: 10,
            width: 500,
            items: [form]
        });

        win.show();
    },
    delShop:function(grid, rowIndex, colIndex, item, e, record, row){
        var me = this,msg,
            id = record.get("id"),
            sid = record.get("sid"),name = record.get("shops_name");

        if(sid == 0){
            msg = "此店铺属于大店,如果删除,所属小店也会一并删除!,确定要删除此店铺吗?";
        }else{
            msg = "确定要删除此店铺吗?";
        }

        Ext.Msg.show({
            title: '系统消息',
            message: msg,
            buttons: Ext.Msg.YESNO,
            icon: Ext.Msg.QUESTION,
            fn: function (btn) {
                if (btn === 'yes') {
                    Ext.Ajax.request({
                        url: apiBaseUrl + '/index.php/Operations/Shop/delShop',
                        waitMsg: '正在删除...',
                        params: {
                            id: id,
                            sid: sid
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
    }
});
