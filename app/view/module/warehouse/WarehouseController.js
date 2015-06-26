/**
 * Created by denglevi on 15-6-14.
 */
Ext.define('erp.view.module.warehouse.WarehouseController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.warehouse',

    requires: [
        'Ext.Ajax',
        'Ext.Array',
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
        var id = record.get("id"),
            me = this,
            batch_no = record.get("order_no"),
            warehouseimportgoods = gp.up("warehouseimportgoods"),
            panel = warehouseimportgoods.down("panel[name=info]"),
            model = warehouseimportgoods.getViewModel();

        this.getImportGoodsData(id, batch_no, model);

        if (panel.items.items.length > 0) return;

        var items = this.getDetailItems(id, batch_no, model);
        panel.add(items);
    },
    onWarehouseExhibitListGridDblClick: function (gp, record) {
        var id = record.get("id"),
            me = this,
            import_goods_order_id = record.get("import_goods_order_id"),
            warehouseexhibitgoods = gp.up("warehouseexhibitgoods"),
            model = warehouseexhibitgoods.getViewModel(),
            res = this.getExhibitOrderData(id, model, import_goods_order_id);

        if (!res) return;
        var panel = warehouseexhibitgoods.down("panel[name=exhibit_info]");
        if (panel.items.items.length > 0) return;

        var detail = this.getExhibitOrderDetail(id, model, import_goods_order_id);
        panel.add(detail);
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
    },
    getImportGoodsData: function (id, batch_no, model) {
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
        //var diff = res.data.diff;
        var import_order = res.data.import_order;

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
        var total = 0, diff_total = 0;
        Ext.Array.each(order, function (item) {
            total += item.num;
            diff_total += parseInt(item.diff_num);
        });
        info.sum = total;
        info.variance = diff_total;
        model.set("import_info", info);
        model.set("goods_info", goods_info);
        model.set("goods_info_data", goods_info_data);
        model.set("goods_info_diff", goods_info_diff);
        model.set("goods_info_log", goods_info_log);
    },
    getDetailItems: function (id, batch_no, model) {
        var nos = [], me = this;
        return [{
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
                //'<div class="col-md-4">收货商品总数：{sum}</div>',
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
                                                id: id
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
                                                me.getImportGoodsData(id, batch_no, model);
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
                    bind: {
                        store: '{goods_info}'
                    }
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
                    bind: {
                        store: '{goods_info_data}'
                    }
                },
                {
                    title: '差异数',
                    name: 'goods_info_diff',
                    columns: [
                        {text: '供应商款号', dataIndex: 'style_no', flex: 1},
                        {text: '颜色', dataIndex: 'color'},
                        {text: '尺码', dataIndex: 'size'},
                        {
                            text: '差异数', dataIndex: 'diff_num', flex: 1, renderer: function (val) {
                            return '<b class="text-danger">' + val + '</b>';
                        }
                        }
                    ],
                    bind: {
                        store: '{goods_info_diff}'
                    }
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
                    bind: {
                        store: '{goods_info_log}'
                    }
                }
            ]
        }]
    },
    getExhibitOrderDetail: function (id, model, import_goods_order_no) {
        var nos = [], me = this;
        return [{
            xtype: 'panel',
            name: "exhibit_info",
            width: '100%',
            bind: {
                data: '{exhibit_info}'
            },
            margin: '30 30 0 30',
            tpl: new Ext.XTemplate(
                '<table class="table table-bordered">',
                '<tr>',
                '<td>进货单号</td>',
                '<td>{import_goods_order_no}</td>',
                '<td>进货数</td>',
                '<td class="success">{has}</td>',
                '<td>已上架数</td>',
                '<td class="success">{exhibit_goods_num}</td>',
                '<td>未上架数</td>',
                '<td class="info">{[this.getUnExhibitNum(values.has,values.exhibit_goods_num)]}</td>',
                '</tr>',
                '</table>',
                {
                    getUnExhibitNum: function (has, exhibit_num) {
                        return has - exhibit_num;
                    }
                }
            ),
            bbar: [
                '->', {
                    text: '上架',
                    glyph: 0xf067,
                    handler: function () {
                        var info = model.get("exhibit_info");
                        if(info.has == info.exhibit_goods_num){
                            Ext.Msg.alert("系统提示","该订单已经完成上架");
                            return;
                        }
                        var win = Ext.create('Ext.window.Window', {
                            title: '扫货上架',
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
                                            url: apiBaseUrl + '/index.php/Warehouse/ExhibitGoods/warehouseExhibitGoods',
                                            params: {
                                                nos: nos.join(","),
                                                id: id
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
                                                me.getExhibitOrderData(id, model, import_goods_order_no);
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
                                                var store = me.lookupReference("import_order_info").getStore();
                                                var res = store.findRecord("no", no);
                                                if (res === null) {
                                                    Ext.toast(no + "这件商品未入库,或不在此进货单中", "系统提示", 't');
                                                    return;
                                                }
                                                var store = me.lookupReference("exhibit_order_info").getStore();
                                                var res = store.findRecord("no", no);
                                                if (res !== null) {
                                                    Ext.toast(no + "这件商品已上架,请重新扫描!", "系统提示", 't');
                                                    return;
                                                }

                                                Ext.Ajax.request({
                                                    async: true,
                                                    url: apiBaseUrl + '/index.php/Warehouse/ExhibitGoods/scanGoods',
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
                    title: '上架信息',
                    name: 'exhibit_order',
                    reference: 'exhibit_order_info',
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
                    bind: {
                        store: '{exhibit_order}'
                    }
                },
                {
                    title: '进货信息',
                    name: 'import_order',
                    reference:'import_order_info',
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
                    bind: {
                        store: '{import_order}'
                    }
                },
                {
                    title: '差异数',
                    name: 'exhibit_diff',
                    columns: [
                        {text: '唯一码', dataIndex: 'no', flex: 1,tdCls:'text-danger'},
                        {text: '供应商款号', dataIndex: 'supply_style_no', flex: 1},
                        {text: '名称', dataIndex: 'name_zh'},
                        {text: '系统颜色代码', dataIndex: 'color'},
                        {text: '颜色名称', dataIndex: 'color_name'},
                        {text: '国际颜色代码', dataIndex: 'supply_color_no'},
                        {text: '尺码', dataIndex: 'size'},
                        {text: '单价', dataIndex: 'retail_price', flex: 1}
                    ],
                    bind: {
                        store: '{exhibit_diff}'
                    }
                },
                //{
                //    title: '操作日志',
                //    xtype: 'grid',
                //    name: 'goods_info_log',
                //    sortableColumns: false,
                //    scrollable: 'y',
                //    columns: [
                //        {text: '时间', dataIndex: 'orderinfo_style', flex: 1},
                //        {text: '操作', dataIndex: 'orderinfo_name'},
                //        {text: '操作人', dataIndex: 'orderinfo_color'}
                //    ],
                //    bind: {
                //        store: '{goods_info_log}'
                //    }
                //}
            ]
        }]
    },
    getExhibitOrderData: function (id, model, import_goods_order_id) {
        Ext.Ajax.request({
            async: false,
            method: 'POST',
            url: apiBaseUrl + '/index.php/Warehouse/ExhibitGoods/getWarehouseExhibitInfo',
            params: {
                id: id,
                import_goods_order_id: import_goods_order_id
            },
            success: function (response) {
                res = Ext.decode(response.responseText);
            }
        });

        if (!res.success) {
            Ext.toast(res.msg, "系统提示", 't');
            return;
        }
        var info = res.data.info;
        if (info.has == 0) {
            Ext.Msg.alert("系统提示", "此上架单关联的进货单还未执行进货操作，请先进货!");
            return false;
        }
        console.log(res.data);
        model.set("exhibit_info", info);
        var import_order = res.data.import_order;
        var exhibit_order = res.data.exhibit_order;
        var exhibit_diff = res.data.exhibit_diff;
        var import_order = Ext.create('Ext.data.Store', {
            fields: [],
            data: import_order
        });

        var exhibit_order = Ext.create('Ext.data.Store', {
            fields: [],
            data: exhibit_order
        });

        var exhibit_diff = Ext.create('Ext.data.Store', {
            fields: [],
            data: exhibit_diff
        });

        model.set("import_order", import_order);
        model.set("exhibit_order", exhibit_order);
        model.set("exhibit_diff", exhibit_diff);
        return true;
    }
});