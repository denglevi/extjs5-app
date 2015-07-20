/**
 * Created by Administrator on 2015-06-24.
 */
Ext.define('erp.view.module.goods.GoodsList', {
    extend: 'Ext.Container',
    xtype: 'goodslist',
    requires: [
        'Ext.data.Store',
        'Ext.data.proxy.Ajax',
        'Ext.data.reader.Json',
        'Ext.form.field.ComboBox',
        'Ext.form.field.Text',
        'Ext.grid.Panel',
        'Ext.toolbar.Fill',
        'Ext.toolbar.Paging',
        'erp.view.module.goods.GoodsController',
        'erp.view.module.goods.GoodsModel'
    ],

    viewModel: {
        type: 'goods'
    },
    controller: 'goods',
    initComponent: function () {
        var me = this;
        me.layout = {
            type: 'hbox',
            stretch: true
        };

        var import_list = this.getImportList();
        var goods_list = this.getGoodsList();
        this.items = [
            import_list, goods_list
        ];
        import_list.on("rowdblclick", function (gp, record) {
            var id = record.get("id");
            me.getViewModel().set("import_id",id);
            var store = goods_list.getStore();
            store.setProxy({
                type: 'ajax',
                url: apiBaseUrl + '/index.php/Commodity/CommodityMenu/getGoodsInfoList?id=' + id,
                reader: {
                    type: 'json',
                    rootProperty: 'data',
                    totalProperty: 'total'
                }
            });
            store.load();
        }, this);
        goods_list.on("rowdblclick", "onGoodListGridDblClick");

        me.callParent();
    },
    getImportList: function () {
        var import_list_grid = Ext.create('Ext.grid.Panel', {
            title: '导入列表',
            height: '100%',
            width: 350,
            border: true,
            columns: [
                {text: '导入单号', dataIndex: 'no', flex: 2},
                {text: '商品总数', dataIndex: 'goods_num', flex: 1},
                {text: '未入库数', dataIndex: 'unimport_num', flex: 1},
                {text: '已入库数', dataIndex: 'import_num', flex: 1}

            ],
            store: Ext.create('Ext.data.Store', {
                fields: ['no', 'id'],
                autoLoad: false,
                proxy: {
                    type: 'ajax',
                    url: apiBaseUrl + '/index.php/Commodity/CommodityMenu/getGoodsImportList',
                    reader: {
                        type: 'json',
                        rootProperty: 'data',
                        totalProperty: 'total'
                    }
                }
            }),
            listeners: {
                afterrender: function () {
                    this.getStore().load();
                }
            }
        });
        return import_list_grid;
    },
    getGoodsList: function () {
        var goods_list_grid = Ext.create('Ext.grid.Panel', {
            flex: 1,
            height: '100%',
            title: '商品列表',
            reference:'goods_list_grid',
            tbar: [
                '->',
                {
                    xtype: 'textfield',
                    labelAlign: 'right',
                    labelWidth: 60,
                    fieldLabel: "系统款号",
                    name: 'system_style_no',
                    bind: {
                        value: '{system_style_no}'
                    }
                },
                {
                    xtype: 'textfield',
                    labelAlign: 'right',
                    labelWidth: 60,
                    fieldLabel: "唯一码",
                    name: 'no',
                    bind: {
                        value: '{no}'
                    }
                },
                {
                    xtype: 'combo',
                    labelAlign: 'right',
                    editable: false,
                    labelWidth: 60,
                    width: 150,
                    store: Ext.create('Ext.data.Store', {
                        fields: ['staus', 'name'],
                        data: [
                            {"status": "0", "name": "未入库"},
                            {"status": "1", "name": "已入库"},
                            {"status": "2", "name": "已上架"},
                            {"status": "3", "name": "已下架"},
                            {"status": "4", "name": "已出库"}
                        ]
                    }),
                    queryMode: 'local',
                    displayField: 'name',
                    valueField: 'status',
                    fieldLabel: "状态",
                    name: 'status',
                    bind:{
                        value:'{status}'
                    }
                },
                {
                    text: '搜索',
                    glyph: 0xf002,
                    handler: 'searchGoods'
                }],
            columns: [
                {
                    text: '商品图片', dataIndex: 'image_src', flex: 1, renderer: function (val) {
                    var src = val || '/resources/images/logo.png';
                    return '<img height=50 src="' + src + '" alt="" class="img-thumbnail" />';
                }
                },
                {text: '唯一码', dataIndex: 'no', flex: 1},
                {text: '名称', dataIndex: 'name_zh'},
                {text: '颜色代码', dataIndex: 'supply_color_no'},
                {text: '颜色名称', dataIndex: 'color'},
                {text: '尺码', dataIndex: 'size'},
                {text: '单价', dataIndex: 'retail_price'},
                {
                    text: '商品状态', dataIndex: 'status', renderer: function (val) {
                    if (0 == val) return '<b class="text-danger">未入库</b>';
                    if (1 == val) return '<b class="text-success">已入库</b>';
                    if (2 == val) return '<b class="text-info">已上架</b>';
                    if (3 == val) return '<b class="text-warning">已下架</b>';
                    if (4 == val) return '<b class="text-primary">已出库</b>';
                    if (5 == val) return '<b class="text-primary">待移库</b>';
                }
                }
            ],
            store: 'GoodsListStore',
            bbar: ['->', {
                xtype: 'pagingtoolbar',
                store: 'GoodsListStore',
                emptyMsg: '<b>暂无记录</b>',
                displayMsg: '显示 {0} - {1} 总共 {2} 条记录',
                displayInfo: true
            }],
            listeners: {
                afterrender: function () {
                    this.getStore().load();
                }
            }
        });

        return goods_list_grid;
    }
});
