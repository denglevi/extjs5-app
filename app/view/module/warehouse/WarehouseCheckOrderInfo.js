/**
 * Created by Administrator on 2015-07-03.
 */
Ext.define('erp.view.module.warehouse.WarehouseCheckOrderInfo', {
    extend: 'Ext.Container',
    xtype: 'warehousecheckorderinfo',

    requires: [
        'Ext.Ajax',
        'Ext.data.Store',
        'Ext.data.proxy.Ajax',
        'Ext.data.reader.Json',
        'Ext.form.field.Display',
        'Ext.form.field.Text',
        'Ext.grid.Panel',
        'Ext.layout.container.Anchor',
        'Ext.layout.container.Column',
        'Ext.layout.container.VBox',
        'Ext.panel.Panel',
        'Ext.tab.Panel',
        'Ext.window.Window'
    ],

    initComponent: function () {
        var me = this;
        console.log(me.record);
        //Ext.Ajax.request({
        //    async: false,
        //    url: apiBaseUrl + '/index.php/Warehouse/TaskList/getWarehouseCheckTaskOrderInfo',
        //    method: 'POST',
        //    params: {
        //        id:me.record.get("id");
        //    },
        //    success: function () {
        //
        //    },
        //    failure: function () {
        //
        //    }
        //});
        Ext.apply(me, {
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [
                {
                    xtype: 'panel',
                    bodyPadding: 20,
                    layout: 'column',
                    defaults: {
                        xtype: 'displayfield',
                        columnWidth: 0.2,
                        labelAlign: 'right',
                        labelWidth: 70
                    },
                    items: [
                        {fieldLabel: '盘点单号', value: me.record.get("inventory_no")},
                        {fieldLabel: '任务单号', value: me.record.get("receipts_no")},
                        {fieldLabel: '盘点日期', value: me.record.get("inventory_data")},
                        {
                            fieldLabel: '盘点人员工号',
                            labelWidth: 100,
                            columnWidth: 0.4,
                            value: me.record.get("inventory_user")
                        },
                        {fieldLabel: '盘点金额', value: me.record.get("inventory_money")},
                        {fieldLabel: '盘点数量', value: me.record.get("inventory_count")}
                    ],
                    buttons: me.getActionButtons()
                },
                me.getTabItems()
            ]
        });
        this.callParent();
    },
    getTabItems: function () {
        var me = this,
            grid = Ext.create('Ext.grid.Panel', {
                sortableColumns: false,
                enableColumnHide: false,
                enableColumnResize: false,
                columns: [
                    {text: '唯一码', flex: 1, dataIndex: 'no'},
                    {text: '系统款号', flex: 1, dataIndex: 'system_style_no'},
                    {text: '商品名称', flex: 1, dataIndex: 'name_zh'},
                    {text: '折扣', dataIndex: 'discount'},
                    {text: '单价', dataIndex: 'retail_price'}
                ],
                store: Ext.create('Ext.data.Store', {
                    fields: [],
                    autoLoad: false,
                    proxy: {
                        type: 'ajax',
                        url: apiBaseUrl + '/index.php/Warehouse/CheckVouch/getWarehouseCheckOrderGoods?id=' + me.record.get("id"),
                        reader: {
                            rootProperty: 'data',
                            type: 'json'
                        }
                    }
                }),
                listeners: {
                    afterrender: function () {
                        this.getStore().load();
                    }
                }
            });
        var log = Ext.create('Ext.grid.Panel', {
            sortableColumns: false,
            enableColumnHide: false,
            enableColumnResize: false,
            columns: [
                {text: '操作时间', flex: 1, dataIndex: 'operation_time'},
                {text: '操作用户', flex: 1, dataIndex: 'operation_user'},
                {text: '操作模块', flex: 1, dataIndex: 'operation'},
            ],
            store: Ext.create('Ext.data.Store', {
                fields: [],
                autoLoad: false,
                proxy: {
                    type: 'ajax',
                    url: apiBaseUrl + '/index.php/Warehouse/CheckVouch/getCheckOutLogList?id=' + me.record.get("pid"),
                    reader: {
                        rootProperty: 'data',
                        type: 'json'
                    }
                }
            }),
            listeners: {
                afterrender: function () {
                    this.getStore().load();
                }
            }
        });
        var tab = Ext.create('Ext.tab.Panel', {
            flex: 1,
            items: [
                {
                    title: '盘点明细',
                    itemId: 'detail',
                    items: [grid]
                },
                {
                    title: '操作日志',
                    itemId: 'log',
                    items:[log]
                }
            ]
        });

        return tab;
    },
    getActionButtons: function () {
        var me = this;
        var btns = [
            {
                text: '扫货',itemId:'goods_set', handler: function () {
                var win = Ext.create('Ext.window.Window', {
                    title: '扫描商品',
                    width: 400,
                    modal: true,
                    layout: 'anchor',
                    bodyPadding: 20,
                    items: [{
                        xtype: 'textfield',
                        name: 'good_no',
                        fieldLabel: '唯一码',
                        anchor: '100%',
                        labelAlign: 'right',
                        labelWidth: 70,
                        enableKeyEvents: true,
                        listeners: {
                            keyup: function (obj, e) {
                                if (e.keyCode !== 13) return;
                                var no = obj.getValue();
                                Ext.Ajax.request({
                                    async: false,
                                    url: apiBaseUrl + '/index.php/Warehouse/CheckVouch/scanGoods',
                                    method: 'POST',
                                    params: {
                                        no: no,
                                        take_no:me.record.get('tasklist_no'),
                                        id:me.record.get('pid')
                                    },
                                    success: function (res) {
                                        var json = Ext.decode(res.responseText);
                                        var store = me.down("#detail").down("grid").getStore();
                                        if (!json.success) {
                                            Ext.toast(json.msg, "系统提示");
                                            return
                                        }
                                        obj.setValue("");
                                        var res = store.findRecord("no", no);
                                        if (res !== null) {
                                            Ext.toast("此商品已在扫描", "系统提示");
                                            return;
                                        }
                                        json.data.mark = 0;
                                        json.data.inventory_id = me.record.get("id");
                                        store.insert(0, json.data);
                                    },
                                    failure: function (res) {
                                        Ext.toast("服务请求错误,请检查网络连接!", "系统提示");
                                    }
                                });
                            }
                        }
                    }]
                });
                win.show();
            }
            },
            {text: '保存',itemId:'save',handler:me.saveWarehouseCheckOrder,scope:me},
            {text: '确认',itemId:'status_yes',handler:me.editWarehouseCheckStatus,scope:me},
            {text: '取消确认',itemId:'status_no',handler:me.editWarehouseCheckStatusNo,scope:me}
        ];

        if(me.record.get("status")==0){
            btns[3].hidden=true;
            btns[0].hidden=false;
            btns[1].hidden=false;
            btns[2].hidden=false;
        }else{
            btns[0].hidden=false;
            btns[1].hidden=false;
            btns[2].hidden=false;
            btns[3].hidden=true;
        }

        return btns;
    },
    saveWarehouseCheckOrder: function () {
        var me = this, store = me.down("#detail").down("grid").getStore(), goods = [];
        var items = store.getData().items, len = items.length;

        for (var i = 0; i < len; i++) {
            var item = items[i], mark = item.get("mark");
            if (mark != 0) continue;
            goods.push({
                no: item.get("no"),
                system_style_no: item.get("system_style_no"),
                inventory_id: item.get("inventory_id")
            });
        }
        if(goods.length<1){
            Ext.toast("请先扫描商品", "系统提示");
            return;
        }
        Ext.Ajax.request({
            async: true,
            url: apiBaseUrl + '/index.php/Warehouse/CheckVouch/saveWarehouseCheckOrder',
            method: 'POST',
            params: {
                goods: Ext.encode(goods),
                id: me.record.get("pid"),
                status: 1
            },
            success: function (res) {
                var json = Ext.decode(res.responseText);
                if (!json.success) {
                    Ext.toast(json.msg, "系统提示");
                    return
                }
                Ext.toast("保存成功", "系统提示");
                var store = Ext.StoreManager.lookup("WarehouseCheckOrderStore");
                if(store != null) store.load();
            },
            failure: function (res) {
                Ext.toast("服务请求错误,请检查网络连接!", "系统提示");
            }
        });
    },
    editWarehouseCheckStatus:function(){
        var me=this;
        Ext.Ajax.request({
            async: true,
            url: apiBaseUrl + '/index.php/Warehouse/CheckVouch/editWarehouseCheckStatus',
            method: 'POST',
            params: {
                id:me.record.get("pid"),
                status:1
            },
            success: function (res) {
                var json = Ext.decode(res.responseText);
                if (!json.success) {
                    Ext.toast(json.msg, "系统提示");
                    return
                }
                Ext.toast("操作成功", "系统提示");
                me.down('#status_no').setHidden(false);
                me.down('#goods_set').setHidden(true);
                me.down('#save').setHidden(true);
                me.down('#status_yes').setHidden(true);
                Ext.StoreManager.lookup("WarehouseCheckOrderStore").load();
            },
            failure: function (res) {
                Ext.toast("服务请求错误,请检查网络连接!", "系统提示");
            }
        });
    },
    editWarehouseCheckStatusNo:function() {
        var me = this;
        Ext.Ajax.request({
            async: true,
            url: apiBaseUrl + '/index.php/Warehouse/CheckVouch/editWarehouseCheckStatusNo',
            method: 'POST',
            params: {
                id: me.record.get("pid"),
                status: 0
            },
            success: function (res) {
                var json = Ext.decode(res.responseText);
                if (!json.success) {
                    Ext.toast(json.msg, "系统提示");
                    return
                }
                Ext.toast("操作成功", "系统提示");
                me.down('#status_no').setHidden(true);
                me.down('#goods_set').setHidden(false);
                me.down('#save').setHidden(false);
                me.down('#status_yes').setHidden(false);
                Ext.StoreManager.lookup("WarehouseCheckOrderStore").load();
            },
            failure: function (res) {
                Ext.toast("服务请求错误,请检查网络连接!", "系统提示");
            }
        });
    }
});
