/**
 * Created by Administrator on 2015-06-30.
 */
Ext.define('erp.view.module.warehouse.WarehouseMoveWarehouseController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.warehousemovewarehouse',

    requires: [
        'Ext.Ajax',
        'Ext.String',
        'Ext.button.Segmented',
        'Ext.data.Store',
        'Ext.data.StoreManager',
        'Ext.data.proxy.Ajax',
        'Ext.data.reader.Json',
        'Ext.form.field.ComboBox',
        'Ext.form.field.Display',
        'Ext.form.field.Text',
        'Ext.grid.Panel',
        'Ext.layout.container.Anchor',
        'Ext.layout.container.HBox',
        'Ext.panel.Panel',
        'Ext.toolbar.Fill',
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
                    displayField: 'storage_name',
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
        var sel = grid.getSelection(), ids = [], nos = [],mark=0;
        if (sel.length == 0) {
            Ext.Msg.alert('系统提示', '请选择要删除的移库通知单');
            return;
        }
        Ext.each(sel, function (record) {
            if(1==record.get("status")){
                mark = 1;
            }
            ids.push(record.get("id"));
            nos.push(record.get("notice_no"));
        });
        if (mark == 1) {
            Ext.Msg.alert('系统提示', '已经发出的通知单不能删除,请重新选择!');
            return;
        }
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
        var sel = grid.getSelection(), ids = [], nos = [],mark=0;
        if (sel.length == 0) {
            Ext.Msg.alert('系统提示', '请选择要删除的移库单');
            return;
        }
        Ext.each(sel, function (record) {
            if(record.get("notice_status") == 2){
                mark = 1;
                return;
            }
            ids.push(record.get("id"));
            nos.push(record.get("move_no"));
        });
        if (mark == 1) {
            Ext.Msg.alert('系统提示', '只有移库通知终止的移库单才能才能删除!请重新选择!');
            return;
        }
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
            warehouse = record.get("storage_name"),
            warehouse_id = record.get("move_in_warehouse"),
            status = record.get("status");
        var container = gp.up("warehousemovewarehousenotice");
        var info = this.lookupReference("move_warehouse_notice_info");
        var model = this.getViewModel();

        model.set("move_warehouse_notice_id", id);
        model.set("move_warehouse_notice_no", no);
        if(0 == status){
            model.set("status0",false);
            model.set("status1",false);
            model.set("status2",false);
        }else if(1 == status){
            model.set("status0",true);
            model.set("status1",true);
            model.set("status2",false);
        }else if(2 == status){
            model.set("status0",true);
            model.set("status1",true);
            model.set("status2",true);
        }
        model.set("move_warehouse_notice_status", status == 1 ? true : false);
        model.set("move_warehouse_notice_warehouse", warehouse);
        model.set("move_warehouse_notice_warehouse_id", warehouse_id);
        me.getMoveWarehouseNoticeInfoData();
        if (info !== null) {
            var grid = info.down("grid"),
                data,store;
            grid.setStore(model.get("move_warehouse_notice_goods_info_store"));
            var btn = info.down("segmentedbutton").down("button");
            btn.setPressed(true);
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
                            xtype: 'displayfield', fieldLabel: '移入仓库', flex: 1,
                            bind: {
                                value: '{move_warehouse_notice_warehouse}'
                            }
                        },
                        {
                            xtype: 'displayfield', fieldLabel: '移库数量', flex: 1,
                            bind: {
                                value: '{move_warehouse_notice_goods_num}'
                            }
                        }
                    ],
                    dockedItems: [{
                        xtype: 'toolbar',
                        dock: 'bottom',
                        items: [
                            '->',
                            {
                                text: '出库',
                                bind: {
                                    hidden: '{status0}'
                                },
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
                                bind: {
                                    hidden: '{status0}'
                                },
                                handler: function () {
                                    //var grid = me.lookupReference("move_warehouse_notice_goods_gird");
                                    var store = model.get("move_warehouse_notice_goods_info_store");
                                    var items = store.getData().items;
                                    var goods = [];
                                    for (var i = 0; i < items.length; ++i) {
                                        var item = items[i];
                                        if (item.get("mark") !== 0) continue;
                                        goods.push({
                                            goods_no: item.get("goods_no"),
                                            move_out_location:item.get("move_out_location"),
                                            move_out_warehouse:item.get("move_out_warehouse")
                                        });
                                    }
                                    if(goods.length == 0) return;
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
                                            me.getMoveWarehouseNoticeInfoData();
                                            //grid.setStore(model.get("move_warehouse_notice_goods_info_store"));
                                            Ext.toast("提交成功", "系统提示", 't');
                                        }
                                    });
                                }
                            },
                            {
                                text: '发出',
                                bind: {
                                    hidden: '{status1}'
                                },
                                handler: function () {
                                    //var grid = me.lookupReference("move_warehouse_notice_goods_gird");
                                    //var store = grid.getStore();
                                    var store = model.get("move_warehouse_notice_goods_info_store");
                                    var items = store.getData().items;
                                    if(items.length == 0) {
                                        Ext.toast("请先扫入商品在发出!", "系统提示", 't');
                                        return;
                                    }
                                    var goods = [];
                                    for (var i = 0; i < items.length; ++i) {
                                        var item = items[i];
                                        if (item.get("mark") !== 0) continue;
                                        goods.push({
                                            goods_no: item.get("goods_no"),
                                            move_out_location:item.get("move_out_location"),
                                            move_out_warehouse:item.get("move_out_warehouse")
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
                                            me.getMoveWarehouseNoticeInfoData();
                                            //grid.setStore(model.get("move_warehouse_notice_goods_info_store"));
                                            Ext.toast("成功发出", "系统提示", 't');
                                            model.set("move_warehouse_notice_status", 1);
                                            model.set("status0",true);
                                            model.set("status1",true);
                                            model.set("status2",false);
                                            Ext.StoreManager.lookup("moveWarehouseNoticeStore").load();
                                            store.load();
                                        }
                                    });
                                }
                            },
                            {
                                text:"终止",
                                bind: {
                                    hidden: '{status2}'
                                },
                                handler:function(){
                                    var grid = me.lookupReference("move_warehouse_notice_goods_gird");
                                    var store = grid.getStore();
                                    var items = store.getData().items;
                                    var goods = [];
                                    for (var i = 0; i < items.length; ++i) {
                                        var item = items[i];
                                        if (item.get("mark") !== 0) continue;
                                        goods.push({
                                            goods_no: item.get("goods_no"),
                                            move_out_location:item.get("move_out_location"),
                                            move_out_warehouse:item.get("move_out_warehouse")
                                        });
                                    }

                                    //console.log(goods);
                                    //return;
                                    Ext.Ajax.request({
                                        async: true,
                                        url: apiBaseUrl + '/index.php/Warehouse/Manage/saveMoveWarehouseNoticeGoods',
                                        params: {
                                            id: model.get("move_warehouse_notice_id"),
                                            status: 2,
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
                                            Ext.toast("终止成功", "系统提示", 't');
                                            me.getMoveWarehouseNoticeInfoData();
                                            model.set("move_warehouse_notice_status", 2);
                                            model.set("status0",true);
                                            model.set("status1",true);
                                            model.set("status2",true);
                                            Ext.StoreManager.lookup("moveWarehouseNoticeStore").load();
                                            store.load();
                                        }
                                    });
                                }
                            }
                        ]
                    }]
                },
                {
                    xtype: 'segmentedbutton',
                    margin: 10,
                    items: [{
                        text: '待移库商品信息',
                        pressed: true
                    },{
                        text: '操作日志'
                    }],
                    listeners: {
                        toggle: function (container, button, pressed) {
                            var text = button.getText(),
                                grid = container.up("panel").down("#move_warehouse_notice_goods_gird"), columns, store;
                            grid.setTitle(text);
                            if ("待移库商品信息" == text) {
                                columns = [
                                    {text: '唯一码', dataIndex: 'goods_no', flex: 1},
                                    {text: '移出仓库', dataIndex: 'move_out_warehouse'},
                                    {text: '移出库位', dataIndex: 'move_out_location'},
                                    {text: '录入时间', dataIndex: 'create_time',flex: 1}
                                ];
                                store = model.get("move_warehouse_notice_goods_info_store");
                            } else if ("操作日志" == text) {
                                columns = [
                                    {text: '时间', dataIndex: 'orderinfo_style', flex: 1},
                                    {text: '操作', dataIndex: 'orderinfo_name'},
                                    {text: '操作人', dataIndex: 'orderinfo_color'}
                                ];
                                store = model.get("move_warehouse_notice_goods_log_store");
                            }

                            grid.reconfigure(store, columns);
                        }
                    }
                },
                {
                    xtype: 'grid',
                    title: '待移库商品信息',
                    flex: 1,
                    width: '100%',
                    itemId:"move_warehouse_notice_goods_gird",
                    reference: 'move_warehouse_notice_goods_gird',
                    enableRemoveColumn: false,
                    sortableColumns: false,
                    columns: [
                        {text: '唯一码', dataIndex: 'goods_no', flex: 1},
                        {text: '移出仓库', dataIndex: 'move_out_warehouse'},
                        {text: '移出库位', dataIndex: 'move_out_location'},
                        {text: '录入时间', dataIndex: 'create_time',flex: 1}
                    ],
                    store:model.get("move_warehouse_notice_goods_info_store")
                    //listeners: {
                    //    afterrender: function () {
                    //        var store = Ext.create('Ext.data.Store', {
                    //            fields: [],
                    //            autoLoad: true,
                    //            proxy: {
                    //                type: 'ajax',
                    //                url: apiBaseUrl + '/index.php/Warehouse/Manage/getMoveWarehouseNoticeGoods?id=' + id,
                    //                reader: {
                    //                    type: 'json',
                    //                    rootProperty: 'data'
                    //                }
                    //            }
                    //        });
                    //        model.set("move_warehouse_notice_goods_num",store.getData().items.length);
                    //        model.set("move_warehouse_notice_goods_info_store",store);
                    //        this.setStore(store);
                    //    }
                    //}
                }
            ]
        });
    },
    getMoveWarehouseNoticeInfoData:function(){
      //获取移库通知单数据
        var model = this.getViewModel(),id = model.get("move_warehouse_notice_id"),data;
        Ext.Ajax.request({
            async:false,
            url: apiBaseUrl + '/index.php/Warehouse/Manage/getMoveWarehouseNoticeInfoData?id=' + id,
            success:function(res){
                var json = Ext.decode(res.responseText);
                if(!json.success){
                    Ext.toast(json.msg,"系统提示");
                    return;
                }
                data = json.data;
            },
            failure:function(res){
                Ext.toast(json.msg,"系统提示");
            }
        });

        var goods_store = Ext.create('Ext.data.Store', {
            fields: [],
            data:data.goods
        });
        var log_store = Ext.create('Ext.data.Store', {
            fields: [],
            data:data.log
        });
        model.set("move_warehouse_notice_goods_num",goods_store.getData().items.length);
        model.set("move_warehouse_notice_goods_info_store",goods_store);
        model.set("move_warehouse_notice_goods_log_store",log_store);
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
        //先扫入唯一码，在入库
        if (e.keyCode !== 13) return;
        var me = this,model = me.getViewModel(),
            no = obj.getValue();

        if (Ext.String.trim(no) == "") return;
        obj.setValue('');
        var grid = me.lookupReference("move_warehouse_order_goods_gird");
        //var store = grid.getStore();
        var goods_store = model.get("move_warehouse_goods_info_store");

        var res = goods_store.findRecord("goods_no", no);
        if (res !== null) {
            Ext.toast(no + "这件商品已在列表中", "系统提示", 't');
            return;
        }
        var notice_goods_store = model.get("move_warehouse_goods_info_notice_store");
        var res = notice_goods_store.findRecord("goods_no", no);
        if (res == null) {
            Ext.toast(no + "这件商品不在移库通知单中", "系统提示", 't');
            return;
        }
        Ext.Ajax.request({
            async: true,
            url: apiBaseUrl + '/index.php/Warehouse/Manage/moveWarehouseOrderScanGoods',
            params: {
                //notice_id: model.get("move_warehouse_order_notice_id"),
                no: no
            },
            success: function (response) {
                var text = Ext.decode(response.responseText);
                console.log(text);
                if (!text.success) {
                    Ext.toast(no + text.msg, "系统提示", 't');
                    return;
                }
                text.data.mark = 1;
                res = text.data;
                console.log(res,text.data);
                goods_store.insert(0, res);
            }
        });
    },
    onMoveWarehouseOrderGridDblClick: function (gp, record) {
        var me = this;
        var id = record.get("id"),
            no = record.get("move_no"),
            notice_no = record.get("notice_no"),
            warehouse = record.get("no"),
            warehouse_id = record.get("warehouse_id"),
            notice_id = record.get("notice_id"),
            status = record.get("status");
        var container = gp.up("warehousemovewarehouse");
        var info = this.lookupReference("move_warehouse_order_info");
        var model = this.getViewModel();

        model.set("move_warehouse_order_id", id);
        model.set("move_warehouse_order_notice_id", notice_id);
        model.set("move_warehouse_order_no", no);
        model.set("move_warehouse_notice_no", notice_no);
        model.set("move_warehouse_order_status", status == 1 ? true : false);
        model.set("move_warehouse_order_warehouse", warehouse);
        model.set("move_warehouse_order_warehouse_id", warehouse_id);
        me.getMoveWarehouseInfoData();
        if (info !== null) {
            var grid = info.down("grid"),
                data,store;
            Ext.Ajax.request({
                async:false,
                url: apiBaseUrl + '/index.php/Warehouse/Manage/getMoveWarehouseOrderGoods?id=' + id,
                success:function(res){
                    var json = Ext.decode(res.responseText);
                    if(!json.success){
                        Ext.toast(json.msg,"系统提示");
                        return;
                    }
                    data = json.data;
                },
                failure:function(res){
                    Ext.toast(json.msg,"系统提示");

                }
            });

            var goods = Ext.create('Ext.data.Store',{
                fields:[],
                data:data.goods
            });
            var notice_goods = Ext.create('Ext.data.Store',{
                fields:[],
                data:data.notice_goods
            });
            model.set("move_warehouse_goods_info_store",goods);
            model.set("move_warehouse_notice_goods_info_store",notice_goods);
            grid.setStore(goods);
            var btn = info.down("segmentedbutton").down("button");
            btn.setPressed(true);
            //grid.setStore(goods);
            //var store = info.down("grid").getStore();
            //store.setProxy({
            //    type: 'ajax',
            //    url: apiBaseUrl + '/index.php/Warehouse/Manage/getMoveWarehouseOrderGoods?id=' + id,
            //    reader: {
            //        type: 'json',
            //        rootProperty: 'data'
            //    }
            //});
            //store.load();
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
                            xtype: 'displayfield', fieldLabel: '通知单号', flex: 1,
                            bind: {
                                value: '{move_warehouse_notice_no}'
                            }
                        },
                        {
                            xtype: 'displayfield', fieldLabel: '移入仓库', flex: 2,
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
                                text: '入库',
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
                                                        fn: me.onMoveWarehouseOrderInfoKeyUp,
                                                        scope: me
                                                    }
                                                }
                                            },
                                            {
                                                labelWidth: 70,
                                                xtype: 'textfield',
                                                fieldLabel: '移入库位',
                                                labelAlign: 'right',
                                                name: 'location',
                                                anchor: '100%',
                                                enableKeyEvents: true,
                                                listeners:{
                                                    keyup:{
                                                        fn:me.saveMoveWarehouseOrder,
                                                        scope:me
                                                    }
                                                }
                                            }
                                        ]

                                    });
                                    win.show();
                                }
                            },
                            //{
                            //    text: '保存',
                            //    handler: function () {
                            //        //var grid = me.lookupReference("move_warehouse_order_goods_gird");
                            //        var store = model.get("move_warehouse_goods_info_store");
                            //        var items = store.getData().items;
                            //        var goods = [];
                            //        for (var i = 0; i < items.length; ++i) {
                            //            var item = items[i];
                            //            if (item.get("mark") !== 1) continue;
                            //            goods.push({
                            //                goods_no: item.get("goods_no"),
                            //                location: item.get("location")
                            //            });
                            //        }
                            //        //console.log(goods,id);return;
                            //        Ext.Ajax.request({
                            //            async: true,
                            //            url: apiBaseUrl + '/index.php/Warehouse/Manage/saveMoveWarehouseOrderGoods',
                            //            params: {
                            //                id: model.get("move_warehouse_order_id"),
                            //                status: 0,
                            //                data: Ext.encode(goods)
                            //            },
                            //            success: function (response) {
                            //                var text = Ext.decode(response.responseText);
                            //                console.log(text);
                            //                if (!text.success) {
                            //                    Ext.toast(no + text.msg, "系统提示", 't');
                            //                    return;
                            //                }
                            //                me.getMoveWarehouseInfoData();
                            //                Ext.toast("提交成功", "系统提示", 't');
                            //            }
                            //        });
                            //    }
                            //},
                            {
                                text: '验收',
                                handler: function () {
                                    //var grid = me.lookupReference("move_warehouse_order_goods_gird");
                                    //var store = grid.getStore();
                                    var store = model.get("move_warehouse_goods_info_store");
                                    var items = store.getData().items;
                                    var goods = [];
                                    for (var i = 0; i < items.length; ++i) {
                                        var item = items[i];
                                        if (item.get("mark") !== 1) continue;
                                        goods.push({
                                            goods_no: item.get("goods_no"),
                                            location: item.get("location")
                                        });
                                    }
                                    if(items.length == 0) {
                                        Ext.toast("请先扫入商品,再提交验收","系统提示");
                                        return;
                                    }
                                    //console.log(goods,id);return;
                                    Ext.Ajax.request({
                                        async: true,
                                        url: apiBaseUrl + '/index.php/Warehouse/Manage/saveMoveWarehouseOrderGoods',
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
                                            me.getMoveWarehouseInfoData();
                                            model.set("move_warehouse_order_status",true);
                                            Ext.StoreManager.lookup("moveWarehouseStore").load();
                                            Ext.toast("验收成功", "系统提示", 't');
                                        }
                                    });
                                }
                            }
                        ]
                    }]
                },
                {
                    xtype: 'segmentedbutton',
                    margin: 10,
                    items: [{
                        text: '移库商品信息',
                        pressed: true
                    },{
                        text:'通知单商品信息'
                    },{
                        text: '操作日志'
                    }],
                    listeners: {
                        toggle: function (container, button, pressed) {
                            var text = button.getText(),
                                grid = container.up("panel").down("#move_warehouse_goods_gird"), columns, store;
                            grid.setTitle(text);
                            if ("移库商品信息" == text) {
                                columns = [
                                    {text: '唯一码', dataIndex: 'goods_no', flex: 1},
                                    {text: '移入库位', dataIndex: 'move_in_location'},
                                    {text: '移库时间', dataIndex: 'create_time', format: 'data(Y-m-d)', flex: 1}
                                ];
                                store = model.get("move_warehouse_goods_info_store");
                            } else if ("通知单商品信息" == text) {
                                columns = [
                                    {text: '唯一码', dataIndex: 'goods_no', flex: 1},
                                    {text: '移出仓库', dataIndex: 'move_out_warehouse'},
                                    {text: '移出库位', dataIndex: 'move_out_location'},
                                    {text: '录入时间', dataIndex: 'create_time',flex: 1},
                                    {text:'是否移库',dataIndex:'moved',renderer:function(val){
                                        if(1== val) return "<b class='text-info'>已移库</b>";
                                        if(0== val) return "<b class='text-danger'>未移库</b>";
                                    }}
                                ];
                                store = model.get("move_warehouse_goods_info_notice_store");
                            }else if ("操作日志" == text) {
                                columns = [
                                    {text: '时间', dataIndex: 'orderinfo_style', flex: 1},
                                    {text: '操作', dataIndex: 'orderinfo_name'},
                                    {text: '操作人', dataIndex: 'orderinfo_color'}
                                ];
                                store = model.get("move_warehouse_goods_log_store");
                            }

                            grid.reconfigure(store, columns);
                        }
                    }
                },
                {
                    xtype: 'grid',
                    title: '移库商品信息',
                    flex: 1,
                    width: '100%',
                    itemId:"move_warehouse_goods_gird",
                    reference: 'move_warehouse_order_goods_gird',
                    enableRemoveColumn: false,
                    sortableColumns: false,
                    columns: [
                        {text: '唯一码', dataIndex: 'goods_no', flex: 1},
                        {text: '移入库位', dataIndex: 'move_in_location'},
                        {text: '移库时间', dataIndex: 'create_time', format: 'data(Y-m-d)', flex: 1}
                    ],
                    store:model.get("move_warehouse_goods_info_store")
                    //listeners: {
                    //    afterrender: function () {
                    //        //var store = Ext.create('Ext.data.Store', {
                    //        //    fields: [],
                    //        //    autoLoad: true,
                    //        //    proxy: {
                    //        //        type: 'ajax',
                    //        //        url: apiBaseUrl + '/index.php/Warehouse/Manage/getMoveWarehouseOrderGoods?id=' + id,
                    //        //        reader: {
                    //        //            type: 'json',
                    //        //            rootProperty: 'data'
                    //        //        }
                    //        //    }
                    //        //});
                    //        var data;
                    //        Ext.Ajax.request({
                    //            async:false,
                    //            url: apiBaseUrl + '/index.php/Warehouse/Manage/getMoveWarehouseOrderGoods?id=' + id,
                    //            success:function(res){
                    //                var json = Ext.decode(res.responseText);
                    //                if(!json.success){
                    //                    Ext.toast(json.msg,"系统提示");
                    //                    return;
                    //                }
                    //                data = json.data;
                    //            },
                    //            failure:function(res){
                    //                Ext.toast(json.msg,"系统提示");
                    //
                    //            }
                    //        });
                    //
                    //        var goods = Ext.create('Ext.data.Store',{
                    //            fields:[],
                    //            data:data.goods
                    //        });
                    //        var notice_goods = Ext.create('Ext.data.Store',{
                    //            fields:[],
                    //            data:data.notice_goods
                    //        });
                    //        model.set("move_warehouse_goods_info_store",goods);
                    //        model.set("move_warehouse_notice_goods_info_store",notice_goods);
                    //        this.setStore(goods);
                    //    }
                    //}
                }
            ]
        });
    },
    getMoveWarehouseInfoData:function(){
        //获取移库单数据
        var model = this.getViewModel(),id = model.get("move_warehouse_order_id"),data;
        Ext.Ajax.request({
            async:false,
            url: apiBaseUrl + '/index.php/Warehouse/Manage/getMoveWarehouseInfoData?id=' + id,
            success:function(res){
                var json = Ext.decode(res.responseText);
                if(!json.success){
                    Ext.toast(json.msg,"系统提示");
                    return;
                }
                data = json.data;
            },
            failure:function(res){
                Ext.toast(json.msg,"系统提示");
            }
        });

        var goods_store = Ext.create('Ext.data.Store', {
            fields: [],
            data:data.goods
        });
        var notice_goods_store = Ext.create('Ext.data.Store', {
            fields: [],
            data:data.notice_goods
        });
        var log_store = Ext.create('Ext.data.Store', {
            fields: [],
            data:data.log
        });
        model.set("move_warehouse_goods_info_store",goods_store);
        model.set("move_warehouse_goods_info_notice_store",notice_goods_store);
        model.set("move_warehouse_goods_log_store",log_store);
    },
    saveMoveWarehouseOrder:function(btn,e){
        var me = this;
        if (e.keyCode !== 13) return;
        var model = this.getViewModel(),
            store = model.get("move_warehouse_goods_info_store"),
            items = store.getData().items,
            len = items.length,nos=[],
            location = btn.getValue();

        for(var i=0;i<len;i++){
            var item = items[i];
            if(1 != item.get("mark")) continue;
            nos.push(item.get("goods_no"));
        }
        console.log(location,nos,items);
        if(nos.length == 0) return;

        Ext.Ajax.request({
            async: true,
            url: apiBaseUrl + '/index.php/Warehouse/Manage/saveMoveWarehouseOrderGoods',
            params: {
                id: model.get("move_warehouse_order_id"),
                status: 0,
                location:location,
                warehouse_id:model.get("move_warehouse_order_warehouse_id"),
                nos: nos.join(",")
            },
            success: function (response) {
                var text = Ext.decode(response.responseText);
                console.log(text);
                if (!text.success) {
                    Ext.toast(text.msg, "系统提示", 't');
                    return;
                }
                btn.setValue("");
                me.getMoveWarehouseInfoData();
                Ext.toast("保存成功", "系统提示", 't');
            }
        });
    }
});