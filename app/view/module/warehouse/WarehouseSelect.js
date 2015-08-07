/**
 * Created by Administrator on 2015-06-30.
 */
Ext.define('erp.view.module.warehouse.WarehouseSelect', {
    extend: 'Ext.Container',
    xtype: 'warehouseselect',

    requires: [
        'Ext.Ajax',
        'Ext.data.Store',
        'Ext.data.StoreManager',
        'Ext.data.proxy.Ajax',
        'Ext.data.reader.Json',
        'Ext.form.Panel',
        'Ext.form.field.ComboBox',
        'Ext.form.field.Date',
        'Ext.grid.Panel',
        'Ext.layout.container.Column',
        'Ext.toolbar.Fill',
        'Ext.toolbar.Paging',
        'Ext.toolbar.TextItem'
    ],

    initComponent: function () {
        var me = this;

        me.layout = {
            type: 'vbox',
            align: 'stretch'
        };
        Ext.Ajax.request({
            async: true,
            url: apiBaseUrl + '/index.php/Warehouse/Stock/getSearchData',
            success: function (response) {
                var text = Ext.decode(response.responseText);
                if (!text.success) {
                    Ext.toast("初始化数据错误,请重试!", "系统提示");
                    return;
                }
                res = text.data;
                console.log(text);
                var form = me.down("form");
                form.down("combo[name=brand]").setStore(Ext.create('Ext.data.Store', {
                    fields: ['base_data_id', 'name_en'],
                    data: res.brand
                }));
                form.down("combo[name=warehouse]").setStore(Ext.create('Ext.data.Store', {
                    fields: ['id', 'username'],
                    data: res.warehouse
                }));
                form.down("combo[name=large_class]").setStore(Ext.create('Ext.data.Store', {
                    fields: ['base_data_id', 'name'],
                    data: res.large_class
                }));

                form.down("combo[name=brand]").setDisabled(false);
                form.down("combo[name=warehouse]").setDisabled(false);
                form.down("combo[name=large_class]").setDisabled(false);
            }
        });
        var fields = me.getSearchFields();
        var grid = me.getGrid();
        me.items = [fields, grid];

        this.callParent();
    },
    getSearchFields: function () {
        var me = this;
        var fields = {
            xtype: 'form',
            layout: 'column',
            height: 'auto',
            //minHeight: 100,
            bodyPadding: 10,
            margin: '25 0 0 0',
            defaults: {
                margin: 5,
                labelWidth: 70,
                labelAlign: 'right',
                editable: false,
                disabled: true
            },
            items: [
                {xtype: 'combo', fieldLabel: '品牌', name: 'brand', displayField: 'name_en', valueField: 'base_data_id'},
                {
                    xtype: 'combo', fieldLabel: '大类', name: 'large_class', listeners: {
                    change: function () {
                        var val = this.getValue(), sub = this.up("form").down("combo[name=small_class]"),
                            items = this.getStore().getData().items, len = items.length, small_class;
                        if (val == null) {
                            sub.setDisabled(true);
                            return;
                        }
                        for (var i = 0; i < len; i++) {
                            var item = items[i];
                            if (item.get("name") == val) {
                                small_class = item.get("sub_class");
                                break;
                            }
                        }
                        console.log(small_class);
                        sub.clearValue();

                        var form = me.down("form");
                        form.down("combo[name=small_class]").setStore(Ext.create('Ext.data.Store', {
                            fields: ['id', 'name'],
                            data: small_class
                        }));
                        sub.setDisabled(false);
                    }
                }, displayField: 'name', valueField: 'name'
                },
                {xtype: 'combo', fieldLabel: '小类', name: 'small_class', displayField: 'name', valueField: 'name',},
                {
                    xtype: 'combo', fieldLabel: '仓库', name: 'warehouse', listeners: {
                    change: function () {
                        var val = this.getValue(), sub = this.up("form").down("combo[name=location]");
                        sub.clearValue();
                        console.log(val);
                        if (val !== null) {
                            console.log(123);
                            Ext.Ajax.request({
                                async: true,
                                url: apiBaseUrl + '/index.php/Warehouse/Stock/getLocation',
                                params: {
                                    id: val
                                },
                                success: function (response) {
                                    var text = Ext.decode(response.responseText);
                                    if (!text.success) {
                                        Ext.toast("初始化数据错误,请重试!", "系统提示");
                                        return;
                                    }
                                    res = text.data;
                                    console.log(text);
                                    var form = me.down("form");
                                    form.down("combo[name=location]").setStore(Ext.create('Ext.data.Store', {
                                        fields: ['id', 'name'],
                                        data: res
                                    }));
                                    sub.setDisabled(false);
                                }
                            });
                        }
                        else sub.setDisabled(true);
                    }
                }, displayField: 'no', valueField: 'id'
                },
                {xtype: 'combo', fieldLabel: '库位', name: 'location', displayField: 'no', valueField: 'id'},
                {xtype: 'datefield', disabled: false, fieldLabel: '入库日期', format: 'Y-m-d', name: 'warehouse_start_date'},
                {xtype: 'tbtext', html:'-'},
                {xtype: 'datefield', disabled: false,hideLabel:true, format: 'Y-m-d', name: 'warehouse_end_date'},
                {xtype: 'datefield', disabled: false, fieldLabel: '上架日期', format: 'Y-m-d', name: 'exhibit_start_date'},
                {xtype: 'tbtext', html:'-'},
                {xtype: 'datefield', disabled: false,hideLabel:true, format: 'Y-m-d', name: 'exhibit_end_date'}
            ],
            buttons: [
                {
                    text: '重置',
                    handler: function () {
                        this.up('form').getForm().reset();
                    }
                },
                {
                    text: '搜索',
                    handler: me.search
                }
            ]
        }

        return fields;
    },
    getGrid: function () {
        var grid = {
            xtype: 'grid',
            flex: 1,
            reference: 'warehouse_search_grid',
            title: '商品列表',
            sortableColumns: false,
            enableColumnHide: false,
            columns: [
                {text: '品牌', dataIndex: 'brand'},
                {text: '唯一码', dataIndex: 'goods_no', flex: 1},
                {text: '国际款号', dataIndex: 'supply_style_no', flex: 1},
                {text: '大类', dataIndex: 'large_class'},
                {text: '小类', dataIndex: 'small_class'},
                {text: '库位', dataIndex: 'location'},
                {text: '入库日期', dataIndex: 'warehouse_date'},
                {text: '上架日期', dataIndex: 'exhibit_date'},
                {
                    text: '商品状态', dataIndex: 'status', width: 70, renderer: function (val) {
                    if (0 == val) return '<b class="text-danger">未入库</b>';
                    if (1 == val) return '<b class="text-success">已入库</b>';
                    if (2 == val) return '<b class="text-info">已上架</b>';
                    if (3 == val) return '<b class="text-warning">已下架</b>';
                    if (4 == val) return '<b class="text-primary">已出库</b>';
                    if (5 == val) return '<b class="text-primary">待移库</b>';
                }
                }
            ],
            bbar: [
                '->', {
                    xtype: 'pagingtoolbar',
                    displayInfo: true,
                    store: "WarehouseSelectStore"
                }],
            store: "WarehouseSelectStore"
        }
        return grid;
    },
    search: function () {
        var form = this.up('form').getForm(),
            store = Ext.StoreManager.lookup("WarehouseSelectStore"),
            vals = form.getValues();
        var pt = this.up("form").up("warehouseselect").down("pagingtoolbar");
        store.setProxy({
            params: {
                page: 1,
                start: 0
            },
            extraParams: {
                vals: Ext.encode(vals)
            },
            type: 'ajax',
            url: apiBaseUrl + '/index.php/Warehouse/Stock/searchGoods',
            reader: {
                type: 'json',
                rootProperty: 'data',
                totalProperty: 'total'
            }
        });
        pt.moveFirst();
        //store.load({
        //
        //});
    }
});
