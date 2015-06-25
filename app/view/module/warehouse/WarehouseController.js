/**
 * Created by denglevi on 15-6-14.
 */
Ext.define('erp.view.module.warehouse.WarehouseController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.warehouse',

    requires: [
        'Ext.Ajax',
        'Ext.XTemplate',
        'Ext.data.Store',
        'Ext.form.field.Text',
        'Ext.grid.Panel',
        'Ext.layout.container.Anchor',
        'Ext.panel.Panel',
        'Ext.tab.Panel',
        'Ext.window.Window',
        'erp.view.module.warehouse.AddImportGoodsOrder',
        'erp.view.module.warehouse.AddWarehouseReceive',
        'erp.view.window.AddWarehouseImportGoodsWin'
    ],

    init: function () {

    },
    onWarehouseReceiveGridDblClick: function (gp, record) {
        var batch_no = record.get("batch_no");
        console.log(record);
        var title;
        if (1 == record.get("status")) {
            title = "查看收货信息";
        } else {
            title = "导入收货信息";
        }
        gp.up('tabpanel').setActiveTab({
            xtype: 'addwarehousereceive',
            title: title,
            closable: true,
            record: record
        });
    },
    onWarehouseImportListGridDblClick: function (gp, record) {
        var id = record.get("id"), res, me = this,
            batch_no = record.get("order_no"), nos = [];
        ;
        Ext.Ajax.request({
            async: false,
            method: 'POST',
            url: apiBaseUrl + '/index.php/Warehouse/ImportGoods/getWarhouseImportInfo',
            params: {
                id: id,
                batch_no: batch_no
            },
            success: function (response) {
                //myMask.destroy( );
                res = Ext.decode(response.responseText);
            }
        });

        if (!res.success) {
            Ext.toast(res.msg, "系统提示", 't');
            return;
        }

        var info = res.data.list;
        var order = res.data.order;
        var log = res.data.log;
        var diff = res.data.diff;
        var import_order = res.data.import_order;
        console.log(res.data);
        var warehouseimportgoods = gp.up("warehouseimportgoods");
        var panel = warehouseimportgoods.down("panel[name=info]");
        var model = warehouseimportgoods.getViewModel();
        model.set("import_info", info);
        var goods_info_data = Ext.create('Ext.data.Store', {
            fields: [],
            data: order
        });
        var goods_info_log = Ext.create('Ext.data.Store', {
            fields: [],
            data: log
        });
        var goods_info = Ext.create('Ext.data.Store', {
            fields: [],
            data: import_order
        });
        var goods_info_diff = Ext.create('Ext.data.Store', {
            fields: [],
            data: order
        });
        //model.set("goods_info_data", order);
        if (panel.items.items.length > 0) {
            panel.down("tabpanel").down("grid[name=goods_info_data]").setStore(goods_info_data);
            panel.down("tabpanel").down("grid[name=goods_info_log]").setStore(goods_info_log);
            panel.down("tabpanel").down("grid[name=goods_info]").setStore(goods_info);
            panel.down("tabpanel").down("grid[name=goods_info_diff]").setStore(goods_info_diff);
            return;
        }
        panel.add([{
            xtype: 'panel',
            name: "info",
            width: '100%',
            bind: {
                data: '{import_info}'
            },
            margin: '30 30 0 30',
            tpl: new Ext.XTemplate(
                '<div class="col-md-12">',
                '<div class="col-md-4">单据标号：{notice_no}</div>',
                '<div class="col-md-4">日期：{date}</div>',
                '<div class="col-md-4">供应商：{name}</div>',
                '</div>',
                '<div class="col-md-12">',
                '<div class="col-md-4">渠道：{channel}</div>',
                '<div class="col-md-4">仓库：{storage_name}</div>',
                '<div class="col-md-4">品牌：{name_en}</div>',
                '</div>',
                '<div class="col-md-12">',
                '<div class="col-md-4">供应商单号：{order_no}</div>',
                '<div class="col-md-4">已入录数：{has}</div>',
                '<div class="col-md-4">采购商品总数：{sum}</div>',
                '</div>',
                '<div class="col-md-12">',
                '<div class="col-md-4">收货商品总数：{sum}</div>',
                '<div class="col-md-4">差异数：{variance}</div>',
                '<div class="col-md-4">摘要：{warehouse_location_id}</div>',
                '</div>'
            ),
            bbar: [
                '->', {
                    text: '进货',
                    glyph: 0xf067,
                    handler: function () {
                        var win = Ext.create('Ext.window.Window', {
                            title: '扫货',
                            width: 500,
                            height: 150,
                            resizable: false,
                            layout: 'anchor',
                            bodyPadding: 20,
                            buttons: [
                                {
                                    text: '保存',
                                    handler: function () {
                                        console.log(nos.length);
                                        Ext.Ajax.request({
                                            async: true,
                                            url: apiBaseUrl + '/index.php/Warehouse/ImportGoods/importGoods',
                                            params: {
                                                nos: nos.join(","),
                                                id:id
                                            },
                                            success: function (response) {
                                                var text = Ext.decode(response.responseText);
                                                console.log(text);
                                                if (!text.success) {
                                                    Ext.toast(text.msg, "系统提示", 't');
                                                    return;
                                                }
                                                nos = [];
                                                win.destroy();
                                            }
                                        });
                                    }
                                }
                            ],
                            items: [
                                {
                                    xtype: 'textfield',
                                    fieldLabel: '唯一码',
                                    name: 'no',
                                    enableKeyEvents: true,
                                    labelWidth: 50,
                                    labelAlign: 'right',
                                    anchor: '100%',
                                    listeners: {
                                        keyup: function (obj, e) {
                                            //@todo  上线需要修改
                                            if (e.keyCode == 13) {
                                                var no = obj.getValue();
                                                obj.setValue('');
                                                var store = me.lookupReference("import_goods_info").getStore();
                                                var res = store.findRecord("no", no);
                                                if (res !== null) {
                                                    Ext.toast(no + "这件商品已入库", "系统提示", 't');
                                                    return;
                                                }
                                                Ext.Ajax.request({
                                                    async: true,
                                                    url: apiBaseUrl + '/index.php/Warehouse/ImportGoods/scanGoods',
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
                                                        nos.push(no);
                                                        res = text.data;
                                                        store.insert(0, res);
                                                    }
                                                });
                                            }
                                        }
                                    }
                                }
                            ]
                        });

                        win.show();
                    }
                }
            ]
        }, {
            xtype: 'tabpanel',
            flex: 1,
            width: '100%',
            defaults: {
                xtype: 'grid',
                sortableColumns: false,
                scrollable: 'y'
            },
            items: [
                {
                    title: '入库信息',
                    name: 'goods_info',
                    reference: 'import_goods_info',
                    columns: [
                        {text: '唯一码', dataIndex: 'no', flex: 1},
                        {text: '供应商款号', dataIndex: 'supply_style_no', flex: 1},
                        {text: '名称', dataIndex: 'name_zh'},
                        {text: '系统颜色代码', dataIndex: 'color'},
                        {text: '颜色名称', dataIndex: 'color_name'},
                        {text: '国际颜色代码', dataIndex: 'supply_color_no'},
                        {text: '尺码', dataIndex: 'size'},
                        {text: '单价', dataIndex: 'retail_price', flex: 1}
                    ],
                    store: goods_info
                },
                {
                    title: '商品信息',
                    name: 'goods_info_data',
                    columns: [
                        {text: '供应商款号', dataIndex: 'style_no', flex: 1},
                        {text: '名称', dataIndex: 'product_name', flex: 1},
                        {text: '产地', dataIndex: 'origin'},
                        {text: '颜色', dataIndex: 'color'},
                        {text: '尺码', dataIndex: 'size'},
                        {text: '数量', dataIndex: 'num', flex: 1}
                    ],
                    store: goods_info_data
                },
                {
                    title: '差异数',
                    name: 'goods_info_diff',
                    columns: [
                        {text: '供应商款号', dataIndex: 'style_no', flex: 1},
                        {text: '颜色', dataIndex: 'color'},
                        {text: '尺码', dataIndex: 'size'},
                        {text: '差异数', dataIndex: 'diff_num', flex: 1,renderer:function(val){
                            return '<b class="text-danger">'+val+'</b>';
                        }}
                    ],
                    store:goods_info_diff
                },
                {
                    title: '操作日志',
                    xtype: 'grid',
                    name: 'goods_info_log',
                    sortableColumns: false,
                    scrollable: 'y',
                    columns: [
                        {text: '时间', dataIndex: 'orderinfo_style', flex: 1},
                        {text: '操作', dataIndex: 'orderinfo_name'},
                        {text: '操作人', dataIndex: 'orderinfo_color'}
                    ],
                    store: goods_info_diff
                }
            ]
        }]);
    },
    onWarehouseExhibitListGridDblClick: function (gp, record) {

    },
    addExhibitGoodsOrder: function (btn) {

    },
    addImportGoodsOrder: function (btn) {
        Ext.create('erp.view.window.AddWarehouseImportGoodsWin').show();
        return;
        btn.up("tabpanel").setActiveTab({
            xtype: 'addimportgoodsorder',
            title: "新增进货单",
            closable: true
        });
    },
    saveImportGoods: function () {
        console.log(123);
    }
});