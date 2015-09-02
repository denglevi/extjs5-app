/**
 * Created by denglevi on 15-6-14.
 */
Ext.define('erp.view.module.goods.GoodsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.goods',

    requires: [
        'Ext.Ajax',
        'Ext.button.Button',
        'Ext.button.Segmented',
        'Ext.container.Container',
        'Ext.data.Store',
        'Ext.data.StoreManager',
        'Ext.data.proxy.Ajax',
        'Ext.data.reader.Json',
        'Ext.form.Panel',
        'Ext.form.action.Action',
        'Ext.form.field.ComboBox',
        'Ext.form.field.Date',
        'Ext.form.field.Display',
        'Ext.form.field.File',
        'Ext.form.field.Hidden',
        'Ext.form.field.Text',
        'Ext.grid.Panel',
        'Ext.layout.container.Anchor',
        'Ext.layout.container.Column',
        'Ext.layout.container.VBox',
        'Ext.panel.Panel',
        'Ext.toolbar.Fill',
        'Ext.toolbar.Toolbar',
        'Ext.window.Window',
        'erp.view.window.GoodsInfoWin',
        'erp.view.window.GoodsMenuInfoWin'
    ],

    /**
     * Called when the view is created
     */
    init: function () {

    },
    importGoodsMenu: function (import_btn) {
        Ext.create('Ext.window.Window', {
            title: '导入商品资料',
            bodyPadding: 20,
            items: [
                {
                    xtype: 'form',
                    method: 'POST',
                    url: apiBaseUrl + '/index.php/Commodity/CommodityMenu/importGoodsMenuInfo',
                    items: [
                        {
                            xtype: 'filefield',
                            buttonText: '上传商品资料',
                            name: 'goods_menu',
                            allowBlank: false,
                            listeners: {
                                change: function (obj) {
                                    var val = this.getValue();
                                    this.up("form").getForm().submit({
                                        waitMsg: '正在导入商品信息...',
                                        success: function (form, action) {
                                            obj.up("form").up("window").destroy();
                                            Ext.Msg.alert('系统提示', "导入成功");
                                            import_btn.up("grid").getStore().load();
                                        },
                                        failure: function (form, action) {
                                            switch (action.failureType) {
                                                case Ext.form.action.Action.CLIENT_INVALID:
                                                    Ext.Msg.alert('系统提示', '表单验证错误');
                                                    break;
                                                case Ext.form.action.Action.CONNECT_FAILURE:
                                                    Ext.Msg.alert('系统提示', '远程连接错误，请稍后重试');
                                                    break;
                                                case Ext.form.action.Action.SERVER_INVALID:
                                                    Ext.Msg.alert('系统提示', action.result.msg);
                                            }
                                        }
                                    });
                                }
                            }
                        }
                    ]
                }
            ]
        }).show();
    },
    exportGoodsMenu:function(export_btn){
        var grid = export_btn.up("grid"),
            store = grid.getStore(),
            records = grid.getSelectionModel().getSelection();
        if(records.length == 0){
            Ext.Msg.alert("系统提示","请选择要导出的记录!");
            return;
        }
        var menu_id = [];
        Ext.each(records,function(record){
            menu_id.push(record.get("id"));
        });
        Ext.Ajax.request({
            async: false,
            method: 'POST',
            url: apiBaseUrl + '/index.php/Commodity/CommodityMenu/exportGoodsMenuInfo',
            params: {
                ids: menu_id.join(',')
            },
            success: function (response) {
                var res = Ext.decode(response.responseText);
                console.log(res);
            }
        });
    },
    deleteGoodsMenu: function () {

    },
    onGoodsMenuGridDblClick: function (gp, record) {
        var menu_id = record.get("id"), res;
        console.log(menu_id);
        Ext.Ajax.request({
            async: false,
            method: 'POST',
            url: apiBaseUrl + '/index.php/Commodity/CommodityMenu/getGoodsMenuInfo',
            params: {
                id: menu_id
            },
            success: function (response) {
                res = Ext.decode(response.responseText);
            }
        });
        if (!res.success) return;
        console.log(res.data);
        Ext.create('erp.view.window.GoodsMenuInfoWin', {
            title: "款号详情",
            info: res.data
        }).show();
    },
    viewGoodsMenu: function (grid, rowIndex, colIndex, item, e, record, row) {
        var menu_id = record.get("id"), res;
        console.log(menu_id);
        Ext.Ajax.request({
            async: false,
            method: 'POST',
            url: apiBaseUrl + '/index.php/Commodity/CommodityMenu/getGoodsMenuInfo',
            params: {
                id: menu_id
            },
            success: function (response) {
                res = Ext.decode(response.responseText);
            }
        });
        if (!res.success) return;
        console.log(res.data);
        Ext.create('erp.view.window.GoodsMenuInfoWin', {
            title: "款号详情",
            info: res.data
        }).show();
    },
    editGoodsMenu: function (grid, rowIndex, colIndex, item, e, record, row) {
        var menu_id = record.get("id"), res;
        console.log(menu_id);
        Ext.Ajax.request({
            async: false,
            method: 'POST',
            url: apiBaseUrl + '/index.php/Commodity/CommodityMenu/getGoodsMenuInfoAndProperty',
            params: {
                id: menu_id
            },
            success: function (response) {
                res = Ext.decode(response.responseText);
            }
        });
        if (!res.success) return;
        console.log(res.data);
        var style = res.data.style, win,
            season = res.data.season;
        if (season.length == 0) {
            Ext.toast("获取季节失败,请重试!", "系统提示");
            return;
        }
        var seasonStore = Ext.create("Ext.data.Store", {
            fields: [],
            data: season
        });
        var form = Ext.create('Ext.form.Panel', {
            layout: 'column',
            bodyPadding: 10,
            width: 650,
            height: 280,
            url: apiBaseUrl + '/index.php/Commodity/CommodityMenu/editGoodsMenuInfo',
            defaults: {
                xtype: 'textfield',
                columnWidth: 0.5,
                anchor: '100%',
                allowBlank: true,
                labelAlign: 'right',
                labelWidth: 70,
                margin: 5
            },
            items: [
                {xtype: 'hidden', name: 'id', value: style.id},
                {fieldLabel: '系统款号', name: 'system_style_no', allowBlank: false, value: style.system_style_no},
                {fieldLabel: '商品名称', name: 'name_zh', allowBlank: false, value: style.name_zh},
                {fieldLabel: '供应商款号', name: 'supply_style_no', allowBlank: false, value: style.supply_style_no},
                {fieldLabel: '大类', name: 'large_class', value: style.large_class},
                {
                    fieldLabel: '季节',
                    name: 'year_season',
                    allowBlank: false,
                    value: style.year_season,
                    xtype: 'combo',
                    displayField: 'name',
                    valueField: 'val',
                    store: seasonStore,
                    editable: false
                },
                {fieldLabel: '品牌', name: 'brand', allowBlank: false, value: style.brand},
                //{fieldLabel:'中类',name:''},
                {fieldLabel: '小类', name: 'small_class', value: style.small_class},
                {fieldLabel: '性别', name: 'sex', value: style.sex},
                {fieldLabel: '执行标准', name: 'execute_standard', value: style.execute_standard},
                {fieldLabel: '安全级别', name: 'safety_level', value: style.safety_level},
                {fieldLabel: '等级', name: 'level', value: style.level}
            ],
            buttons: [
                {
                    text: '保存',
                    formBind: true,
                    disabled: true,
                    handler: function () {
                        var form = this.up('form').getForm();
                        if (form.isValid()) {
                            form.submit({
                                waitMsg: '正在保存...',
                                success: function (form, action) {
                                    win.destroy();
                                    var store = Ext.StoreManager.lookup("GoodsMenuStore");
                                    if (store != null) store.load();
                                },
                                failure: function (form, action) {
                                    console.log(action);
                                    if (action.result.msg == null) {
                                        Ext.Msg.alert('失败', "网络请求错误,请检查网络重试!");
                                        return;
                                    }
                                    Ext.Msg.alert('失败', action.result.msg);
                                }
                            });
                        }
                    }
                }
            ]
        });
        win = Ext.create('Ext.window.Window', {
            title: "修改款号详情",
            layout: 'fit',
            items: [form]
            //info: res.data
        });
        win.show();
    },
    onGoodListGridDblClick: function (gp, record) {
        var id = record.get("id"), res;
        Ext.Ajax.request({
            async: false,
            method: 'POST',
            url: apiBaseUrl + '/index.php/Commodity/CommodityMenu/getGoodsInfo',
            params: {
                id: id
            },
            success: function (response) {
                //myMask.destroy( );
                res = Ext.decode(response.responseText);
            }
        });
        if (!res.success) return;
        Ext.create('erp.view.window.GoodsInfoWin', {
            title: "商品详情",
            info: res.data
        }).show();
    },
    viewGoodsInfo: function (grid, rowIndex, colIndex, item, e, record, row) {
        var id = record.get("id"), res;
        Ext.Ajax.request({
            async: false,
            method: 'POST',
            url: apiBaseUrl + '/index.php/Commodity/CommodityMenu/getGoodsInfo',
            params: {
                id: id
            },
            success: function (response) {
                //myMask.destroy( );
                res = Ext.decode(response.responseText);
            }
        });
        if (!res.success) return;
        Ext.create('erp.view.window.GoodsInfoWin', {
            title: "商品详情",
            info: res.data
        }).show();
    },
    searchMenu: function () {
        var me = this.getView();
        var system_style_no = me.down("textfield[name=system_style_no]").getValue();
        var supply_style_no = me.down("textfield[name=supply_style_no]").getValue();

        me.getStore().setProxy({
            type: 'ajax',
            url: apiBaseUrl + '/index.php/Commodity/CommodityMenu/getGoodsMenuList?system_style_no=' + system_style_no + '&supply_style_no=' + supply_style_no,
            reader: {
                type: 'json',
                rootProperty: 'data',
                totalProperty: 'total'
            }
        });
        me.getStore().load();
    },
    searchGoods: function () {
        var model = this.getViewModel();

        var system_style_no = model.get("system_style_no");
        var no = model.get("no");
        var status = model.get("status");
        var id = model.get("import_id")
        var store = this.lookupReference('goods_list_grid').getStore();

        store.setProxy({
            type: 'ajax',
            url: apiBaseUrl + '/index.php/Commodity/CommodityMenu/getGoodsInfoList?id=' + id + '&system_style_no=' + system_style_no + '&no=' + no + '&status=' + status,
            reader: {
                type: 'json',
                rootProperty: 'data',
                totalProperty: 'total'
            }
        });
        store.load();
    },
    addGoodsDeliveryNotice: function () {
        var win = Ext.create('Ext.window.Window', {
            width: 600,
            modal: true,
            title: '新增配货通知单',
            layout: 'fit',
            items: [{
                xtype: 'form',
                bodyPadding: 10,
                layout: 'column',
                defaults: {
                    margin: 5,
                    xtype: 'textfield',
                    labelAlign: 'right',
                    labelWidth: 70,
                    columnWidth: 0.5,
                    anchor: '100%'
                },
                items: [
                    {
                        fieldLabel: '商店',
                        name: 'store',
                        xtype: 'combo',
                        disabled: true,
                        valueField: 'id',
                        displayField: 'shops_name',
                        editable: false,
                        allowBlank: false,
                        listeners:{
                            change:function(val){
                                var box = this;
                                var max_shops=box.getValue();
                                var sub = box.up("form").down("combo[name=min_shops]");
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
                    {
                        fieldLabel: '小店',
                        name: 'min_shops',
                        xtype: 'combo',
                        disabled: true,
                        valueField: 'id',
                        displayField: 'shops_name',
                        itemId:'min_shops',
                        editable: false
                    },
                    {
                        fieldLabel: '仓库',
                        name: 'warehouse_id',
                        xtype: 'combo',
                        disabled: true,
                        valueField: 'id',
                        allowBlank: false,
                        displayField: 'storage_name',
                        editable: false
                    },
                    {fieldLabel: '订单号', name: 'order_no'},
                    {fieldLabel: '发货类型', name: 'send_type'},
                    {fieldLabel: '价格选定', name: 'price_select'},
                    {fieldLabel: '折扣', name: 'discount'},
                    {
                        fieldLabel: '预配货日',
                        name: 'expected_send_date',
                        xtype: 'datefield',
                        format: 'Y-m-d',
                        value: new Date(),
                        editable: false
                    },
                    {
                        fieldLabel: '品牌',
                        name: 'brand_id',
                        xtype: 'combo',
                        disabled: true,
                        allowBlank: false,
                        valueField: 'id',
                        displayField: 'name_en',
                        editable: false
                    },
                    {fieldLabel: '渠道', name: 'challne'}
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
                                    url: apiBaseUrl + '/index.php/Commodity/Distribution/addDeliveryNotice',
                                    method: 'POST',
                                    success: function (form, action) {
                                        win.destroy();
                                        var store = Ext.StoreManager.lookup("GoodsDeliveryNoticeStore");
                                        if (store !== null) store.load();
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
            }]
        });
        Ext.Ajax.request({
            async: true,
            url: apiBaseUrl + '/index.php/Commodity/Distribution/getBaseData',
            method: 'POST',
            params: {
                shop: 1,
                warehouse: 1,
                brand: 1,
                max_shop:1
            },
            success: function (res) {
                var json = Ext.decode(res.responseText), data = json.data;
                if (data.shop === undefined || data.warehouse === undefined || data.brand === undefined) {
                    Ext.toast("数据获取错误,请重试!", "系统提示");
                    return;
                }
                var form = win.down("form");
                var shop = form.down("combo[name=store]"),
                    warehouse = form.down("combo[name=warehouse_id]"),
                    brand = form.down("combo[name=brand_id]"),
                    shop_store = Ext.create('Ext.data.Store', {
                        fields: [],
                        data: data.max_shop
                    }),
                    warehouse_store = Ext.create('Ext.data.Store', {
                        fields: [],
                        data: data.warehouse
                    }),
                    brand_store = Ext.create('Ext.data.Store', {
                        fields: [],
                        data: data.brand
                    })
                    ;

                shop.setDisabled(false);
                warehouse.setDisabled(false);
                brand.setDisabled(false);
                shop.setStore(shop_store);
                warehouse.setStore(warehouse_store);
                brand.setStore(brand_store);
            },
            failure: function () {
                Ext.toast("服务请求失败,请稍后再试!", "系统提示");
            }
        });
        win.show();
    },
    delGoodsDeliveryNotice: function (del_btn) {
        var sel = del_btn.up('grid').getSelection(), ids = [], names = [], mark = 0;
        if (sel.length == 0) {
            Ext.Msg.alert('系统提示', '请选择要删除的配货通知单');
            return;
        }
        Ext.each(sel, function (record) {

            if(record.get("notice_status")==0){
                ids.push(record.get("id"));
                names.push(record.get("notice_no"));
            }else
                mark.push(record.get("notice_no"));

        });

        if(mark.length!=0){
            Ext.Msg.alert('系统提示', '已下任务单不允许删除!<br>'+mark.join('<br>'));
            return;
        }
        Ext.each(sel, function (record) {
            //if (record.get("is_check") == 1) {
            //    mark = 1;
            //    return;
            //}
            ids.push(record.get("id"));
            names.push(record.get("notice_no"));
        });

        //if (1 == mark) {
        //    Ext.Msg.alert('系统提示', '已经验收的进货单不允许删除!');
        //    return;
        //}
        Ext.Msg.show({
            title: '系统消息',
            message: '你确定要删除以下配货通知单吗？<br>' + names.join('<br>'),
            buttons: Ext.Msg.YESNO,
            icon: Ext.Msg.QUESTION,
            fn: function (btn) {
                if (btn === 'yes') {
                    Ext.getBody().mask("正在删除...");
                    Ext.Ajax.request({
                        url: apiBaseUrl + '/index.php/Commodity/Distribution/delDeliveryNotice',
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
    getNoticeDetailItems: function (record) {
        var id = this.getViewModel().get("goods_delivery_notice_id");
        this.products = [];
        this.logs = [];
        var me = this;
        var productStore = Ext.create("Ext.data.Store", {
            fields: [],
            autoLoad: true,
            storeId: 'delivery_goods_notice_store',
            proxy: {
                type: 'ajax',
                url: apiBaseUrl + '/index.php/Commodity/Distribution/getDeliveryNoticeGoods?id=' + id,
                reader: {
                    type: 'json',
                    rootProperty: 'data'
                }
            }
        });
        return [{
            xtype: 'form',
            hidden: true,
            items: [
                {
                    buttonOnly: true,
                    xtype: 'fileuploadfield',
                    id: "delivery_upload_file",
                    name: 'delivery_file',
                    listeners: {
                        change: function (btn, val) {
                            var form = this.up("form").getForm();
                            form.submit({
                                waitMsg: '正在导入商品信息...',
                                url: apiBaseUrl + '/index.php/Commodity/Distribution/importDeliveryGoods',
                                method: 'POST',
                                params: {
                                    warehouse_id:record.get("warehouse_id")
                                },
                                success: function (form, action) {
                                    if (!action.result.success) {
                                        Ext.toast(action.result.msg, "系统提示");
                                        return;
                                    }
                                    var data = action.result.data;

                                    var store = me.lookupReference('goods_delivery_info_grid').getStore();
                                    store.setData(data);
                                },
                                failure: function (form, action) {
                                    if (action.response.status == 200) {
                                        Ext.toast(action.result.msg, "系统提示");
                                        return;
                                    }
                                    Ext.toast("服务请求错误,请重试!", "系统提示");
                                }
                            });
                        }
                    }
                }
            ]
        }, {
            xtype: 'panel',
            name: "info",
            width: '100%',
            bind: {
                data: '{notice_info}'
            },
            margin: '30 30 10 30',
            tpl: new Ext.XTemplate(
                '<div class="col-md-12">',
                '<div class="col-md-4">通知单号：{notice_no}</div>',
                '<div class="col-md-4">大店：{shops_name}</div>',
                '<div class="col-md-4">小店：{min_shop_name}</div>',
                '</div>',
                '<div class="col-md-12">',
                '<div class="col-md-4">仓库：{warehouse_id}</div>',
                '<div class="col-md-4">订单号：{order_no}</div>',
                '<div class="col-md-4">价格选定：{price_select}</div>',
                '</div>',
                '<div class="col-md-12">',
                '<div class="col-md-4">折扣：{discount}</div>',
                '<div class="col-md-4">预配货日：{expected_send_date}</div>',
                '<div class="col-md-4">品牌：{brand_id}</div>',
                '</div>',
                '<div class="col-md-12">',
                '<div class="col-md-4">渠道：{challne}</div>',
                '<div class="col-md-4">发货类型：{send_type}</div>',
                '<div class="col-md-4">备注：{reamke}</div>',
                '</div>'
            ),
            dockedItems: {
                dock: 'bottom',
                items: [
                    {
                        xtype: "toolbar",
                        bind: {
                            hidden: '{notice_status}'
                        },
                        items: [
                            '->', {
                                text: "导入数据",
                                iconCls: 'importIcon',
                                handler: function () {
                                    var dom = Ext.get("delivery_upload_file"),
                                        input = dom.select("input").last();
                                    input.dom.click();
                                }
                            }, {
                                text: '保存',
                                handler: me.saveDeliveryGoodsNotice,
                                scope: me
                            }, {
                                text: '申请配货',
                                handler: me.saveDeliveryGoodsNotice,
                                scope: me
                            }
                        ]
                    }
                ]
            }
        },
            {
                xtype: 'segmentedbutton',
                margin: 10,
                items: [
                    {text: '商品详细信息', pressed: true},
                    {text: '操作日志'}
                ],
                listeners: {
                    toggle: function (container, button, pressed) {
                        var text = button.getText(),
                            columns, store,
                            grid = container.up("panel").down("grid");
                        if ("商品详细信息" == text) {
                            store = Ext.data.StoreManager.lookup("delivery_goods_notice_store");
                            columns = [
                                {text: '系统款号', dataIndex: 'system_style_no', flex: 1},
                                {text: '国际款号', dataIndex: 'supply_style_no', flex: 1},
                                {text: '名称', dataIndex: 'name', flex: 1},
                                {text: '颜色', dataIndex: 'color', flex: 1},
                                {text: '尺码', dataIndex: 'size', flex: 1},
                                {text: '数量', dataIndex: 'num', flex: 1},
                                {text: '库存数', dataIndex: 'sum', flex: 1},
                                {
                                    text: '数据状态', dataIndex: 'type', flex: 1, renderer: function (val) {
                                    if (1 == val) return "<span style='color: green'>数据正确</span>";
                                    if (2 == val) return "<span style='color: red'>数据错误</span>";
                                    if (3 == val) return "<span style='color: #003300'>库存不足</span>";
                                }
                                }
                            ];
                        } else {
                            columns = [
                                {text: '操作类型', dataIndex: 'node', flex: 1},
                                {text: '操作人', dataIndex: 'node_username', flex: 1},
                                {text: '操作时间', dataIndex: 'creat_time', flex: 1}
                            ];
                            Ext.Ajax.request({
                                async: true,
                                method: 'POST',
                                url: apiBaseUrl + '/index.php/Commodity/Distribution/getNoticeLogList',
                                params: {
                                    id: id,
                                },
                                success: function (res) {
                                    var data = Ext.decode(res.responseText);
                                    store = Ext.create('Ext.data.Store',{
                                        fields: [],
                                        data:data.data
                                    });
                                    grid.reconfigure(store, columns);

                                },
                                failure: function () {
                                    Ext.toast("网络链接错误,请检查网络,稍后再试!", "系统提示");
                                }
                            });
                        }
                        grid.setTitle(text);
                        grid.reconfigure(store, columns);
                    }
                }
            }
            , {
                xtype: 'grid',
                flex: 1,
                width: '100%',
                reference: 'goods_delivery_info_grid',
                title: '商品详细信息',
                sortableColumns: false,
                enableColumnHide: false,
                store: productStore,
                columns: [
                    {text: '系统款号', dataIndex: 'system_style_no', flex: 1},
                    {text: '国际款号', dataIndex: 'supply_style_no', flex: 1},
                    {text: '名称', dataIndex: 'name', flex: 1},
                    {text: '颜色', dataIndex: 'color', flex: 1},
                    {text: '尺码', dataIndex: 'size', flex: 1},
                    {text: '数量', dataIndex: 'num', flex: 1},
                    {text: '库存数', dataIndex: 'sum', flex: 1},
                    {text: '数据状态', dataIndex: 'type', flex: 1, renderer: function (val) {
                        if (1 == val) return "<span style='color: green'>数据正确</span>";
                        if (2 == val) return "<span style='color: red'>数据错误</span>";
                        if (3 == val) return "<span style='color: #003300'>库存不足</span>";
                    }

                    },
                ]
            }
        ];
    },
    onGoodsDeliveryNoticeGridDblClick: function (gp, record) {

        var id = record.get("id"),
            notice_status = record.get("notice_status"),
            me = this,
            order = gp.up("goodsdeliveryorder"),
            panel = order.down("#info_panel"),
            model = order.getViewModel();
        model.set("goods_delivery_notice_id", id);
        model.set("notice_status", notice_status == 1 ? true : false);
//console.log(record);
        model.set("notice_info", {
            notice_no: record.get("notice_no"),
            shops_name: record.get("shops_name"),
            min_shop_name: record.get("min_shop_name"),
            warehouse_id: record.get("storage_name"),
            order_no: record.get("order_no"),
            send_type: record.get("send_type"),
            price_select: record.get("price_select"),
            discount: record.get("discount"),
            expected_send_date: record.get("expected_send_date"),
            brand_id: record.get("name_en"),
            challne: record.get("challne"),
            reamke:record.get("reamke")
        });

        if (panel.items.items.length > 0) {
            var store = Ext.StoreManager.lookup("delivery_goods_notice_store");
            store.setProxy({
                type: 'ajax',
                url: apiBaseUrl + '/index.php/Commodity/Distribution/getDeliveryNoticeGoods?id=' + id,
                reader: {
                    type: 'json',
                    rootProperty: 'data'
                }
            });
            store.load();
            //this.lookupReference("goods_delivery_info_grid").setStore(model.get("goods_info"));
            return;
        }
        var items = this.getNoticeDetailItems();
        panel.add(items);
        //this.lookupReference("goods_delivery_info_grid").setStore(model.get("goods_info"));
    },
    saveDeliveryGoodsNotice: function (btn) {
        var me = this,
            id = this.getViewModel().get("goods_delivery_notice_id");
        var store = me.lookupReference('goods_delivery_info_grid').getStore(),
            data = store.getData(), items = data.items, len = items.length, tmp = [];
        if (len == 0) return;
        for (var i = 0; i < len; i++) {
            var item = items[i];
            if(item.get("type")==1)
            {
                tmp.push({
                    supply_style_no:item.get("supply_style_no"),
                    system_style_no:item.get("system_style_no"),
                    name:item.get("name"),
                    color:item.get("color"),
                    size:item.get("size"),
                    num:item.get("extra_num")
                });
            }
        }
        var status = btn.getText() == "申请配货" ? 1 : 0;
        Ext.Ajax.request({
            async: true,
            method: 'POST',
            url: apiBaseUrl + '/index.php/Commodity/Distribution/saveDeliveryGoodsNotice',
            params: {
                products: Ext.encode(tmp),
                id: id,
                status: status
            },
            success: function (res) {
                var json = Ext.decode(res.responseText);
                if (!json.success) {
                    Ext.toast(json.msg, "系统提示");
                    return;
                }
                Ext.toast(btn.getText() + "成功!", "系统提示");
                if (1 == status) {
                    me.getViewModel().set("notice_status", true);
                    Ext.StoreManager.lookup("GoodsDeliveryNoticeStore").load();
                }
                Ext.StoreManager.lookup("delivery_goods_notice_store").load();
            },
            failure: function () {
                Ext.toast("网络链接错误,请检查网络,稍后再试!", "系统提示");
            }
        });
    }
});