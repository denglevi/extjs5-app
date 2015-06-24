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
        'Ext.grid.Panel',
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
        goods_list.on("rowdblclick","onGoodListGridDblClick");

        me.callParent();
    },
    getImportList: function () {
        var import_list_grid = Ext.create('Ext.grid.Panel', {
            title: '导入列表',
            height: '100%',
            width: 200,
            border: true,
            columns: [
                {text: '导入单号', dataIndex: 'no', flex: 1}
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
            columns: [
                {text: '商品图片', dataIndex: 'image_src', flex: 1,renderer:function(val){
                    var src = val ||'/resources/images/logo.png';
                    return '<img height=50 src="'+src+'" alt="" class="img-thumbnail" />';
                }},
                {text: '唯一码', dataIndex: 'no', flex: 1},
                {text: '名称', dataIndex: 'name_zh'},
                {text: '颜色代码', dataIndex: 'supply_color_no'},
                {text: '颜色名称', dataIndex: 'color'},
                {text: '尺码', dataIndex: 'size'},
                {text: '单价', dataIndex: 'retail_price'}
            ],
            store: 'GoodsListStore',
            bbar: ['->', {
                xtype: 'pagingtoolbar',
                store: 'GoodsListStore',
                emptyMsg: '<b>暂无记录</b>',
                displayMsg: '显示 {0} - {1} 总共 {2} 条记录',
                displayInfo: true
            }]
        });

        return goods_list_grid;
    }
});