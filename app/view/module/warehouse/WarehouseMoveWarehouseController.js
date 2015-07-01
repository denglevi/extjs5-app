/**
 * Created by Administrator on 2015-06-30.
 */
Ext.define('erp.view.module.warehouse.WarehouseMoveWarehouseController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.warehousemovewarehouse',

    requires: [
        'Ext.Ajax',
        'Ext.String',
        'Ext.data.Store',
        'Ext.data.proxy.Ajax',
        'Ext.data.reader.Json',
        'Ext.form.field.ComboBox',
        'Ext.form.field.Display',
        'Ext.form.field.Text',
        'Ext.grid.Panel',
        'Ext.layout.container.Anchor',
        'Ext.layout.container.HBox',
        'Ext.panel.Panel',
        'Ext.toolbar.Toolbar',
        'Ext.window.Window'
    ],

    init: function () {

    },
    addMoveWarehouseNotice: function () {
        var me = this;
        var win = Ext.create('Ext.window.Window', {
            title: '新增移库通知单',
            modal: true,
            bodyPadding: 10,
            items: [
                {
                    xtype: 'combo',
                    enableKeyEvents: true,
                    fieldLabel: '移入仓库',
                    name: 'warehouse',
                    labelAlign: 'right',
                    displayField: 'no',
                    editable: false,
                    valueField: 'id',
                    store: Ext.create('Ext.data.Store', {
                        fields: ['id', 'no', 'storage_name'],
                        autoLoad: true,
                        proxy: {
                            type: 'ajax',
                            url: apiBaseUrl + '/index.php/Warehouse/Manage/getLocation',
                            reader: {
                                type: 'json',
                                rootProperty: 'data'
                            }
                        }
                    })
                }
            ],
            buttons: [
                {
                    text: '提交',
                    handler: function () {
                        var warehouse = win.down("combo").getValue();
                        if (Ext.String.trim(warehouse) == "") {
                            Ext.toast("请输入要移入的仓库", "系统提示", "t");
                            return;
                        }
                        Ext.Ajax.request({
                            async: true,
                            url: apiBaseUrl + '/index.php/Warehouse/Manage/addWarehouseMoveWarehouseOrder',
                            params: {
                                warehouse: warehouse
                            },
                            success: function (response) {
                                var text = Ext.decode(response.responseText);
                                console.log(text);
                                if (!text.success) {
                                    Ext.toast(no + text.msg, "系统提示", 't');
                                    return;
                                }
                                me.lookupReference("move_warehouse_notice_grid").getStore().load();
                                win.destroy();
                            }
                        });
                    }
                }
            ]
        });
        win.show();
    },
    delMoveWarehouseNotice: function () {
        var grid = this.lookupReference("move_warehouse_notice_grid");
        var sel = grid.getSelection(), ids = [], nos = [];
        if (sel.length == 0) {
            Ext.Msg.alert('系统提示', '请选择要删除的移库通知单');
            return;
        }
        Ext.each(sel, function (record) {
            ids.push(record.get("id"));
            nos.push(record.get("notice_no"));
        });
        Ext.Msg.show({
            title: '系统提示',
            message: '你确定要删除以下移库通知单吗？<br>' + nos.join('<br>'),
            buttons: Ext.Msg.YESNO,
            icon: Ext.Msg.QUESTION,
            fn: function (btn) {
                if (btn === 'yes') {
                    Ext.Ajax.request({
                        url: apiBaseUrl + '/index.php/Warehouse/Manage/delWarehouseMoveWarehouseNotice',
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
    delMoveWarehouseOrder: function () {
        var grid = this.lookupReference("move_warehouse_grid");
        var sel = grid.getSelection(), ids = [], nos = [];
        if (sel.length == 0) {
            Ext.Msg.alert('系统提示', '请选择要删除的移库单');
            return;
        }
        Ext.each(sel, function (record) {
            ids.push(record.get("id"));
            nos.push(record.get("move_no"));
        });
        Ext.Msg.show({
            title: '系统提示',
            message: '你确定要删除以下移库单吗？<br>' + nos.join('<br>'),
            buttons: Ext.Msg.YESNO,
            icon: Ext.Msg.QUESTION,
            fn: function (btn) {
                if (btn === 'yes') {
                    Ext.Ajax.request({
                        url: apiBaseUrl + '/index.php/Warehouse/Manage/delWarehouseMoveWarehouseOrder',
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
    onMoveWarehouseGridDblClick: function (gp, record) {
        var me = this;
        var id = record.get("id"),
            no = record.get("notice_no"),
            warehouse = record.get("no"),
            warehouse_id = record.get("move_in_warehouse"),
            status = record.get("status");
        var container = gp.up("warehousemovewarehousenotice");
        var info = this.lookupReference("move_warehouse_notice_info");
        var model = this.getViewModel();

        model.set("move_warehouse_notice_id", id);
        model.set("move_warehouse_notice_no", no);
        model.set("move_warehouse_notice_status", status == 1 ? true : false);
        model.set("move_warehouse_notice_warehouse", warehouse);
        model.set("move_warehouse_notice_warehouse_id", warehouse_id);
        if (info !== null) {
            var store = info.down("grid").getStore();
            store.setProxy({
                type: 'ajax',
                url: apiBaseUrl + '/index.php/Warehouse/Manage/getMoveWarehouseNoticeGoods?id=' + id,
                reader: {
                    type: 'json',
                    rootProperty: 'data'
                }
            });
            store.load();
            return;
        }
        container.add({
            xtype: 'panel',
            reference: 'move_warehouse_notice_info',
            flex: 1,
            title: '移库通知单详情',
            items: [
                {
                    xtype: 'panel',
                    margin: 10,
                    layout: 'hbox',
                    items: [
                        {
                            xtype: 'displayfield', fieldLabel: '移库通知单号', flex: 1,
                            bind: {
                                value: '{move_warehouse_notice_no}'
                            }
                        },
                        {
                            xtype: 'displayfield', fieldLabel: '要移入的仓库', flex: 2,
                            bind: {
                                value: '{move_warehouse_notice_warehouse}'
                            }
                        }
                    ],
                    dockedItems: [{
                        xtype: 'toolbar',
                        dock: 'bottom',
                        bind: {
                            hidden: '{move_warehouse_notice_status}'
                        },
                        items: [
                            '->',
                            {
                                text: '录入移库商品',
                                handler: function () {
                                    var win = Ext.create('Ext.window.Window', {
                                        title: '扫描商品',
                                        bodyPadding: 10,
                                        modal: true,
                                        width: 400,
                                        layout: 'anchor',
                                        items: [
                                            {
                                                labelWidth: 70,
                                                xtype: 'textfield',
                                                fieldLabel: '唯一码',
                                                labelAlign: 'right',
                                                name: 'no',
                                                anchor: '100%',
                                                enableKeyEvents: true,
                                                listeners: {
                                                    keyup: {
                                                        fn: me.onMoveLoactionInfoKeyUp,
                                                        scope: me
                                                    }
                                                }
                                            }
                                        ]

                                    });
                                    win.show();
                                }
                            },
                            {
                                text: '保存',
                                handler: function () {
                                    var grid = me.lookupReference("move_warehouse_notice_goods_gird");
                                    var store = grid.getStore();
                                    var items = store.getData().items;
                                    var goods = [];
                                    for (var i = 0; i < items.length; ++i) {
                                        var item = items[i];
                                        if (item.get("mark") !== 0) continue;
                                        goods.push({
                                            goods_no: item.get("goods_no")
                                        });
                                    }
                                    //console.log(goods,id);return;
                                    Ext.Ajax.request({
                                        async: true,
                                        url: apiBaseUrl + '/index.php/Warehouse/Manage/saveMoveWarehouseNoticeGoods',
                                        params: {
                                            id: model.get("move_warehouse_notice_id"),
                                            warehouse_id: model.get("move_warehouse_notice_warehouse_id"),
                                            status: 0,
                                            data: Ext.encode(goods)
                                        },
                                        success: function (response) {
                                            var text = Ext.decode(response.responseText);
                                            console.log(text);
                                            if (!text.success) {
                                                Ext.toast(no + text.msg, "系统提示", 't');
                                                return;
                                            }
                                            Ext.toast("保存成功", "系统提示", 't');
                                        }
                                    });
                                }
                            },
                            {
                                text: '提交',
                                handler: function () {
                                    var grid = me.lookupReference("move_warehouse_notice_goods_gird");
                                    var store = grid.getStore();
                                    var items = store.getData().items;
                                    var goods = [];
                                    for (var i = 0; i < items.length; ++i) {
                                        var item = items[i];
                                        if (item.get("mark") !== 0) continue;
                                        goods.push({
                                            goods_no: item.get("goods_no")
                                        });
                                    }

                                    //console.log(goods);
                                    //return;
                                    Ext.Ajax.request({
                                        async: true,
                                        url: apiBaseUrl + '/index.php/Warehouse/Manage/saveMoveWarehouseNoticeGoods',
                                        params: {
                                            id: model.get("move_warehouse_notice_id"),
                                            status: 1,
                                            warehouse_id: model.get("move_warehouse_notice_warehouse_id"),
                                            data: Ext.encode(goods)
                                        },
                                        success: function (response) {
                                            var text = Ext.decode(response.responseText);
                                            console.log(text);
                                            if (!text.success) {
                                                Ext.toast(no + text.msg, "系统提示", 't');
                                                return;
                                            }
                                            Ext.toast("提交成功", "系统提示", 't');
                                            model.set("move_warehouse_notice_status", 1);
                                            gp.getStore().load();
                                        }
                                    });
                                }
                            }
                        ]
                    }]
                },
                {
                    xtype: 'grid',
                    title: '待移库商品列表',
                    flex: 1,
                    width: '100%',
                    reference: 'move_warehouse_notice_goods_gird',
                    enableRemoveColumn: false,
                    sortableColumns: false,
                    columns: [
                        {text: '唯一码', dataIndex: 'goods_no', flex: 1},
                        {text: '移出仓库', dataIndex: 'move_warehouse_out_warehouse'},
                        {text: '移出库位', dataIndex: 'move_warehouse_out_location'},
                        {text: '录入时间', dataIndex: 'create_time', format: 'data(Y-m-d)', flex: 1}
                    ],
                    listeners: {
                        afterrender: function () {
                            var store = Ext.create('Ext.data.Store', {
                                fields: [],
                                autoLoad: true,
                                proxy: {
                                    type: 'ajax',
                                    url: apiBaseUrl + '/index.php/Warehouse/Manage/getMoveWarehouseNoticeGoods?id=' + id,
                                    reader: {
                                        type: 'json',
                                        rootProperty: 'data'
                                    }
                                }
                            });
                            this.setStore(store);
                        }
                    }
                }
            ]
        });
    },
    onMoveLoactionInfoKeyUp: function (obj, e) {
        if (e.keyCode !== 13) return;
        var me = this, no = obj.getValue();

        if (Ext.String.trim(no) == "") return;
        obj.setValue('');
        var grid = me.lookupReference("move_warehouse_notice_goods_gird");
        var store = grid.getStore();
        var res = store.findRecord("goods_no", no);

        if (res !== null) {
            Ext.toast(no + "这件商品已在列表中", "系统提示", 't');
            return;
        }

        Ext.Ajax.request({
            async: true,
            url: apiBaseUrl + '/index.php/Warehouse/Manage/moveWarehouseScanGoods',
            params: {
                no: no
            },
            success: function (response) {
                var text = Ext.decode(response.responseText);
                console.log(text);
                if (!text.success) {
                    Ext.toast(no + text.msg, "系统提示", 't');
                    return;
                }
                text.data.mark = 0;
                res = text.data;
                store.insert(0, res);
            }
        });
    },
    onMoveWarehouseOrderInfoKeyUp: function (obj, e) {
        if (e.keyCode !== 13) return;
        var me = this, location = obj.up("window").down("textfield[name=location]").getValue(),
            no = obj.getValue();

        if ("" == Ext.String.trim(location)) {
            Ext.toast("请先输入移入库位", "系统提示", "t");
            return;
        }

        if (Ext.String.trim(no) == "") return;
        obj.setValue('');
        var grid = me.lookupReference("move_warehouse_order_goods_gird");
        var store = grid.getStore();
        var res = store.findRecord("goods_no", no);
        var model = this.getViewModel();
        if (res !== null) {
            Ext.toast(no + "这件商品已在列表中", "系统提示", 't');
            return;
        }

        Ext.Ajax.request({
            async: true,
            url: apiBaseUrl + '/index.php/Warehouse/Manage/moveWarehouseOrderScanGoods',
            params: {
                notice_id: model.get("move_warehouse_order_notice_id"),
                no: no
            },
            success: function (response) {
                var text = Ext.decode(response.responseText);
                console.log(text);
                if (!text.success) {
                    Ext.toast(no + text.msg, "系统提示", 't');
                    return;
                }
                text.data.mark = 0;
                text.data.location = location;
                res = text.data;
                store.insert(0, res);
            }
        });
    },
    onMoveWarehouseOrderGridDblClick: function (gp, record) {
        var me = this;
        var id = record.get("id"),
            no = record.get("move_no"),
            warehouse = record.get("no"),
            notice_id = record.get("notice_id"),
            status = record.get("status");
        var container = gp.up("warehousemovewarehouse");
        var info = this.lookupReference("move_warehouse_order_info");
        var model = this.getViewModel();

        model.set("move_warehouse_order_id", id);
        model.set("move_warehouse_order_notice_id", notice_id);
        model.set("move_warehouse_order_no", no);
        model.set("move_warehouse_order_status", status == 1 ? true : false);
        model.set("move_warehouse_order_warehouse", warehouse);
        if (info !== null) {
            var store = info.down("grid").getStore();
            store.setProxy({
                type: 'ajax',
                url: apiBaseUrl + '/index.php/Warehouse/Manage/getMoveWarehouseOrderGoods?id=' + id,
                reader: {
                    type: 'json',
                    rootProperty: 'data'
                }
            });
            store.load();
            return;
        }
        container.add({
            xtype: 'panel',
            reference: 'move_warehouse_order_info',
            flex: 1,
            title: '移库单详情',
            items: [
                {
                    xtype: 'panel',
                    margin: 10,
                    layout: 'hbox',
                    items: [
                        {
                            xtype: 'displayfield', fieldLabel: '移库单号', flex: 1,
                            bind: {
                                value: '{move_warehouse_order_no}'
                            }
                        },
                        {
                            xtype: 'displayfield', fieldLabel: '要移入的仓库', flex: 2,
                            bind: {
                                value: '{move_warehouse_order_warehouse}'
                            }
                        }
                    ],
                    dockedItems: [{
                        xtype: 'toolbar',
                        dock: 'bottom',
                        bind: {
                            hidden: '{move_warehouse_order_status}'
                        },
                        items: [
                            '->',
                            {
                                text: '录入移库商品',
                                handler: function () {
                                    var win = Ext.create('Ext.window.Window', {
                                        title: '扫描商品',
                                        bodyPadding: 10,
                                        modal: true,
                                        width: 400,
                                        layout: 'anchor',
                                        items: [
                                            {
                                                labelWidth: 70,
                                                xtype: 'textfield',
                                                fieldLabel: '移入库位',
                                                labelAlign: 'right',
                                                name: 'location',
                                                anchor: '100%',
                                                enableKeyEvents: true
                                            },
                                            {
                                                labelWidth: 70,
                                                xtype: 'textfield',
                                                fieldLabel: '唯一码',
                                                labelAlign: 'right',
                                                name: 'no',
                                                anchor: '100%',
                                                enableKeyEvents: true,
                                                listeners: {
                                                    keyup: {
                                                        fn: me.onMoveWarehouseOrderInfoKeyUp,
                                                        scope: me
                                                    }
                                                }
                                            }
                                        ]

                                    });
                                    win.show();
                                }
                            },
                            {
                                text: '保存',
                                handler: function () {
                                    var grid = me.lookupReference("move_warehouse_order_goods_gird");
                                    var store = grid.getStore();
                                    var items = store.getData().items;
                                    var goods = [];
                                    for (var i = 0; i < items.length; ++i) {
                                        var item = items[i];
                                        if (item.get("mark") !== 0) continue;
                                        goods.push({
                                            goods_no: item.get("goods_no"),
                                            location: item.get("location")
                                        });
                                    }
                                    //console.log(goods,id);return;
                                    Ext.Ajax.request({
                                        async: true,
                                        url: apiBaseUrl + '/index.php/Warehouse/Manage/saveMoveWarehouseOrderGoods',
                                        params: {
                                            id: model.get("move_warehouse_order_id"),
                                            status: 0,
                                            data: Ext.encode(goods)
                                        },
                                        success: function (response) {
                                            var text = Ext.decode(response.responseText);
                                            console.log(text);
                                            if (!text.success) {
                                                Ext.toast(no + text.msg, "系统提示", 't');
                                                return;
                                            }
                                            Ext.toast("保存成功", "系统提示", 't');
                                        }
                                    });
                                }
                            },
                            {
                                text: '提交',
                                handler: function () {
                                    var grid = me.lookupReference("move_warehouse_order_goods_gird");
                                    var store = grid.getStore();
                                    var items = store.getData().items;
                                    var goods = [];
                                    for (var i = 0; i < items.length; ++i) {
                                        var item = items[i];
                                        if (item.get("mark") !== 0) continue;
                                        goods.push({
                                            goods_no: item.get("goods_no")
                                        });
                                    }

                                    //console.log(goods);
                                    //return;
                                    Ext.Ajax.request({
                                        async: true,
                                        url: apiBaseUrl + '/index.php/Warehouse/Manage/saveMoveWarehouseNoticeGoods',
                                        params: {
                                            id: model.get("move_warehouse_order_id"),
                                            status: 1,
                                            data: Ext.encode(goods)
                                        },
                                        success: function (response) {
                                            var text = Ext.decode(response.responseText);
                                            console.log(text);
                                            if (!text.success) {
                                                Ext.toast(no + text.msg, "系统提示", 't');
                                                return;
                                            }
                                            Ext.toast("提交成功", "系统提示", 't');
                                            model.set("move_warehouse_order_status", 1);
                                            gp.getStore().load();
                                        }
                                    });
                                }
                            }
                        ]
                    }]
                },
                {
                    xtype: 'grid',
                    title: '移库商品列表',
                    flex: 1,
                    width: '100%',
                    reference: 'move_warehouse_order_goods_gird',
                    enableRemoveColumn: false,
                    sortableColumns: false,
                    columns: [
                        {text: '唯一码', dataIndex: 'goods_no', flex: 1},
                        {text: '移入库位', dataIndex: 'move_warehouse_in_location'},
                        {text: '移库时间', dataIndex: 'create_time', format: 'data(Y-m-d)', flex: 1}
                    ],
                    listeners: {
                        afterrender: function () {
                            var store = Ext.create('Ext.data.Store', {
                                fields: [],
                                autoLoad: true,
                                proxy: {
                                    type: 'ajax',
                                    url: apiBaseUrl + '/index.php/Warehouse/Manage/getMoveWarehouseOrderGoods?id=' + id,
                                    reader: {
                                        type: 'json',
                                        rootProperty: 'data'
                                    }
                                }
                            });
                            this.setStore(store);
                        }
                    }
                }
            ]
        });
    }
});