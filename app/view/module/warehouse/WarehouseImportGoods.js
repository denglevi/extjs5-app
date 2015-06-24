/**
 * Created by Administrator on 2015-06-24.
 */
Ext.define('erp.view.module.warehouse.WarehouseImportGoods', {
    extend: 'Ext.Container',
    xtype: 'warehouseimportgoods',
    requires: [
        'Ext.data.Store',
        'Ext.data.proxy.Ajax',
        'Ext.data.reader.Json',
        'Ext.grid.Panel',
        'Ext.layout.container.VBox',
        'Ext.panel.Panel',
        'Ext.toolbar.Paging',
        'erp.view.module.warehouse.WarehouseController',
        'erp.view.module.warehouse.WarehouseModel'
    ],

    viewModel: {
        type: 'warehouse'
    },
    controller: 'warehouse',
    initComponent: function () {
        var me = this;
        me.layout = {
            type: 'hbox',
            stretch: true
        };

        var import_list = this.getImportList();
        var panel = this.getInfoPanel();
        this.items = [import_list,panel];
        import_list.on("rowdblclick","onWarehouseImportListGridDblClick");
        //goods_list.on("rowdblclick","onGoodListGridDblClick");

        me.callParent();
    },
    getImportList: function () {
        var store = Ext.create('Ext.data.Store', {
            fields: ['notice_no', 'id'],
            autoLoad: false,
            proxy: {
                type: 'ajax',
                url: apiBaseUrl + '/index.php/Warehouse/ImportGoods/getWarehouseImportList',
                reader: {
                    type: 'json',
                    rootProperty: 'data',
                    totalProperty: 'total'
                }
            }
        });
        var import_list_grid = Ext.create('Ext.grid.Panel', {
            title: '进货单列表',
            height: '100%',
            width: 200,
            border: true,
            sortableColumns:false,
            columns: [
                {text: '进货单号', dataIndex: 'notice_no', flex: 1}
            ],
            store: store,
            tbar: [
                {
                    text: '新增',
                    glyph: 0xf067,
                    handler: 'addImportGoodsOrder'
                },
                {
                    text: '删除',
                    glyph: 0xf1f8,
                    handler:'deletePurchaseOrder'
                }],
            bbar: ['->', {
                xtype: 'pagingtoolbar',
                store: store,
                displayInfo: true
            }],
            listeners: {
                afterrender: function () {
                    store.load();
                }
            }
        });
        return import_list_grid;
    },
    getInfoPanel: function () {
        var panel = Ext.create('Ext.panel.Panel',{
            name:"info",
            title:'进货单详情',
            flex:1,
            layout:'vbox',
            height:'100%'
        });

        return panel;
    }
});

