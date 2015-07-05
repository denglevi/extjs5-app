/**
 * Created by denglevi on 15-6-14.
 */
Ext.define('erp.view.module.warehouse.WarehouseController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.warehouse',

    requires: [
        'Ext.Ajax',
        'Ext.Array',
        'Ext.String',
        'Ext.XTemplate',
        'Ext.data.Store',
        'Ext.data.proxy.Ajax',
        'Ext.data.reader.Json',
        'Ext.form.field.Display',
        'Ext.form.field.Text',
        'Ext.grid.Panel',
        'Ext.layout.container.Anchor',
        'Ext.layout.container.HBox',
        'Ext.panel.Panel',
        'Ext.tab.Panel',
        'Ext.toolbar.Toolbar',
        'Ext.window.Window',
        'erp.view.module.warehouse.AddImportGoodsOrder',
        'erp.view.module.warehouse.AddWarehouseReceive',
        'erp.view.window.AddMoveLocationWin',
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

        if (panel.items.items.length > 0) {
            this.lookupReference("import_goods_info").setStore(model.get("goods_info"));
            this.lookupReference("purchase_goods_info").setStore(model.get("goods_info_data"));
            this.lookupReference("import_goods_diff").setStore(model.get("goods_info_diff"));
            return;
        }

        var items = this.getDetailItems(id, batch_no, model);
        panel.add(items);
        this.lookupReference("import_goods_info").setStore(model.get("goods_info"));
        this.lookupReference("purchase_goods_info").setStore(model.get("goods_info_data"));
        this.lookupReference("import_goods_diff").setStore(model.get("goods_info_diff"));
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
        console.log(res.data);
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
            total += parseInt(item.num);
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
                    //bind: {
                    //    store: '{goods_info}'
                    //}
                },
                {
                    title: '商品信息',
                    reference: 'purchase_goods_info',
                    columns: [
                        {text: '供应商款号', dataIndex: 'style_no', flex: 1},
                        {text: '名称', dataIndex: 'product_name', flex: 1},
                        {text: '产地', dataIndex: 'origin'},
                        {text: '颜色', dataIndex: 'color'},
                        {text: '尺码', dataIndex: 'size'},
                        {text: '数量', dataIndex: 'num', flex: 1}
                    ],
                    //bind: {
                    //    store: '{goods_info_data}'
                    //}
                },
                {
                    title: '差异数',
                    reference: 'import_goods_diff',
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
                    //bind: {
                    //    store: '{goods_info_diff}'
                    //}
                },
                //{
                //    title: '操作日志',
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
                        if (info.has == info.exhibit_goods_num) {
                            Ext.Msg.alert("系统提示", "该订单已经完成上架");
                            return;
                        }
                        var win = Ext.create('Ext.window.Window', {
                            title: '扫货上架',
                            width: 500,
                            height: 150,
                            resizable: false,
                            layout: 'anchor',
                            bodyPadding: 20,
                            items: [
                                {
                                    xtype: 'textfield',
                                    fieldLabel: '唯一码',
                                    name: 'no',
                                    enableKeyEvents: true,
                                    labelWidth: 70,
                                    labelAlign: 'right',
                                    anchor: '100%',
                                    listeners: {
                                        keyup: {
                                            fn: function (obj, e) {
                                                //@todo  上线需要修改
                                                if (e.keyCode == 13) {
                                                    var no = obj.getValue();
                                                    if (Ext.String.trim(no) == "") {
                                                        //Ext.toast("请输入唯一码", "系统提示", 't');
                                                        return;
                                                    }
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
                                            },
                                            scope: this
                                        }
                                    }
                                },
                                {
                                    xtype: 'textfield',
                                    fieldLabel: '上架库位',
                                    name: 'location',
                                    enableKeyEvents: true,
                                    labelWidth: 70,
                                    labelAlign: 'right',
                                    anchor: '100%',
                                    listeners: {
                                        keyup: {
                                            fn: function (obj, e) {
                                                //@todo  上线需要修改
                                                if (e.keyCode == 13) {
                                                    var location = obj.getValue();
                                                    if (Ext.String.trim(location) == "") {
                                                        //Ext.toast("请输入上架库位", "系统提示", 't');
                                                        return;
                                                    }

                                                    if (nos.length == 0) {
                                                        Ext.toast("请先扫入商品在上架", "系统提示", 't');
                                                        return;
                                                    }
                                                    Ext.Ajax.request({
                                                        async: true,
                                                        url: apiBaseUrl + '/index.php/Warehouse/ExhibitGoods/warehouseExhibitGoods',
                                                        params: {
                                                            nos: nos.join(","),
                                                            id: id,
                                                            location: location
                                                        },
                                                        success: function (response) {
                                                            var text = Ext.decode(response.responseText);
                                                            console.log(text);
                                                            if (!text.success) {
                                                                Ext.toast(text.msg, "系统提示", 't');
                                                                return;
                                                            }
                                                            nos = [];
                                                            obj.setValue("");
                                                            //win.destroy();
                                                            me.getExhibitOrderData(id, model, import_goods_order_no);
                                                        }
                                                    });
                                                }
                                            }
                                        },
                                        scope: this
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
                    reference: 'import_order_info',
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
                    columns: [
                        {text: '唯一码', dataIndex: 'no', flex: 1, tdCls: 'text-danger'},
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
    },
    onWarehouseListGridDblClick: function (gp, record) {
        var grid = this.lookupReference('locationgrid'), id = record.get("id");
        if (null != grid) {
            var store = grid.getStore()
            store.getProxy().setExtraParam("id", id);
            store.load();
            return;
        }
        gp.up("warehousesetting").add(
            {
                title: '库位列表',
                flex: 1,
                reference: 'locationgrid',
                xtype: 'grid',
                sortableColumns: false,
                selModel: 'checkboxmodel',
                enableColumnHide: false,
                tbar: [
                    {
                        text: '新增',
                        glyph: 0xf067,
                        handler: 'addPurchaseOrder'
                    },
                    {
                        text: '删除',
                        glyph: 0xf1f8
                    },
                    {
                        text: '编辑',
                        glyph: 0xf1f8
                    }
                ],
                columns: [
                    {text: '库位代码', dataIndex: 'no'},
                    {text: '库位名称', dataIndex: 'library_name', flex: 1},
                    {text: '库位描述', dataIndex: 'description', flex: 2}
                ],
                listeners: {
                    afterrender: function () {
                        var store = Ext.create('Ext.data.Store', {
                            fields: ['id', 'storage_id', 'library_name', 'no'],
                            autoLoad: true,
                            proxy: {
                                type: 'ajax',
                                actionMethods: {
                                    read: 'post',
                                },
                                url: apiBaseUrl + '/index.php/Warehouse/Index/getLoction',
                                extraParams: {
                                    id: id
                                },
                                reader: {
                                    type: 'json',
                                    rootProperty: 'data',
                                    totalProperty: 'total'
                                }
                            }
                        });
                        this.setStore(store);
                    }
                }
            }
        )
    },
    addMoveLocationOrder: function () {
        var me = this;
        var win = Ext.create('erp.view.window.AddMoveLocationWin');
        win.on("refresh_move_location_grid", function () {
            me.lookupReference("move_location_grid").getStore().load();
        });
        win.show();
    },
    delMoveLocationOrder: function (btn) {
        var grid = this.lookupReference("move_location_grid");
        var sel = grid.getSelection(), ids = [], nos = [];
        if (sel.length == 0) {
            Ext.Msg.alert('系统提示', '请选择要删除的订单');
            return;
        }
        Ext.each(sel, function (record) {
            ids.push(record.get("id"));
            nos.push(record.get("move_no"));
        });
        Ext.Msg.show({
            title: '系统消息',
            message: '你确定要删除以下移位单吗？<br>' + nos.join('<br>'),
            buttons: Ext.Msg.YESNO,
            icon: Ext.Msg.QUESTION,
            fn: function (btn) {
                if (btn === 'yes') {
                    Ext.Ajax.request({
                        url: apiBaseUrl + '/index.php/Warehouse/Manage/delWarehouseMoveLocationOrder',
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
    onMoveLocationGridDblClick: function (gp, record) {
        var me = this;
        var id = record.get("id"), no = record.get("move_no"), warehouse = record.get("storage_name"), status = record.get("status");
        var container = gp.up("warehousemovelocation");
        var info = this.lookupReference("move_location_order_info");
        var model = this.getViewModel();

        model.set("move_location_order_id", id);
        model.set("move_location_order_no", no);
        model.set("move_location_order_status", status == 1 ? true : false);
        model.set("move_location_order_warehouse", warehouse);
        if (info !== null) {
            var store = info.down("grid").getStore();
            store.setProxy({
                type: 'ajax',
                url: apiBaseUrl + '/index.php/Warehouse/Manage/getMoveLocationGoods?id=' + id,
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
            reference: 'move_location_order_info',
            flex: 1,
            title: '移位单详情',
            items: [
                {
                    xtype: 'panel',
                    margin: 10,
                    layout: 'hbox',
                    items: [
                        {
                            xtype: 'displayfield', fieldLabel: '移位单号', flex: 1,
                            bind: {
                                value: '{move_location_order_no}'
                            }
                        },
                        {
                            xtype: 'displayfield', fieldLabel: '移位仓库', flex: 2,
                            bind: {
                                value: '{move_location_order_warehouse}'
                            }
                        }
                    ],
                    dockedItems: [{
                        xtype: 'toolbar',
                        dock: 'bottom',
                        bind: {
                            hidden: '{move_location_order_status}'
                        },
                        items: [
                            '->',
                            {
                                text: '移位',
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
                                    var grid = me.lookupReference("move_location_goods_gird");
                                    var store = grid.getStore();
                                    var items = store.getData().items;
                                    var goods = [];
                                    for(var i=0;i<items.length;++i){
                                        var item = items[i];
                                        if(item.get("mark") !== 0) continue;
                                        goods.push({
                                            goods_no:item.get("goods_no"),
                                            move_in_location:item.get("move_in_location"),
                                            move_out_location:item.get("move_out_location")
                                        });
                                    }
                                    console.log(goods,id);
                                    Ext.Ajax.request({
                                        async: true,
                                        url: apiBaseUrl + '/index.php/Warehouse/Manage/saveMoveLocationGoods',
                                        params: {
                                            id: model.get("move_location_order_id"),
                                            status:0,
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
                                    var grid = me.lookupReference("move_location_goods_gird");
                                    var store = grid.getStore();
                                    var items = store.getData().items;
                                    var goods = [];
                                    for(var i=0;i<items.length;++i){
                                        var item = items[i];
                                        if(item.get("mark") !== 0) continue;
                                        goods.push({
                                            goods_no:item.get("goods_no"),
                                            move_in_location:item.get("move_in_location"),
                                            move_out_location:item.get("move_out_location"),
                                        });
                                    }
                                    Ext.Ajax.request({
                                        async: true,
                                        url: apiBaseUrl + '/index.php/Warehouse/Manage/saveMoveLocationGoods',
                                        params: {
                                            id: model.get("move_location_order_id"),
                                            status:1,
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
                                            model.set("move_location_order_status",1);
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
                    title: '移位商品列表',
                    flex: 1,
                    width: '100%',
                    reference:'move_location_goods_gird',
                    enableRemoveColumn:false,
                    sortableColumns:false,
                    columns: [
                        {text: '唯一码', dataIndex: 'goods_no', flex: 1},
                        {text: '移出库位', dataIndex: 'move_out_location'},
                        {text: '移入库位', dataIndex: 'move_in_location'},
                        {text: '移位时间', dataIndex: 'create_time', format: 'data(Y-m-d)', flex: 1}
                    ],
                    listeners: {
                        afterrender: function () {
                            var store = Ext.create('Ext.data.Store', {
                                fields: [],
                                autoLoad: true,
                                proxy: {
                                    type: 'ajax',
                                    url: apiBaseUrl + '/index.php/Warehouse/Manage/getMoveLocationGoods?id=' + id,
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
        var me = this, location = obj.up("window").down("textfield[name=location]").getValue(),
            no = obj.getValue();
        me.nos = [];
        if ("" == Ext.String.trim(location)) {
            Ext.toast("请先输入移入库位", "系统提示", "t");
            return;
        }

        if (Ext.String.trim(no) == "") return;
        obj.setValue('');
        var info = me.lookupReference("move_location_order_info"),
            grid = info.down("grid");
        var store = grid.getStore();
        var res = store.findRecord("goods_no", no);
        if (res !== null) {
            Ext.toast(no + "这件商品已在列表中", "系统提示", 't');
            return;
        }

        Ext.Ajax.request({
            async: true,
            url: apiBaseUrl + '/index.php/Warehouse/Manage/scanGoods',
            params: {
                no: no,
                location: location
            },
            success: function (response) {
                var text = Ext.decode(response.responseText);
                console.log(text);
                if (!text.success) {
                    Ext.toast(no + text.msg, "系统提示", 't');
                    return;
                }
                me.nos.push({no: no, location: location});
                text.data.mark = 0;
                text.data.move_in_location = location;
                res = text.data;
                store.insert(0, res);
            }
        });
    }
});