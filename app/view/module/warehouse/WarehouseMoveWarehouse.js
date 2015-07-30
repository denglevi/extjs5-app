/**
 * Created by Administrator on 2015-06-29.
 */
Ext.define('erp.view.module.warehouse.WarehouseMoveWarehouse', {
    extend: 'Ext.Container',
    xtype: 'warehousemovewarehouse',
    requires: [
        'Ext.data.Store',
        'Ext.data.proxy.Ajax',
        'Ext.data.reader.Json',
        'Ext.grid.Panel',
        'erp.view.module.warehouse.WarehouseModel',
        'erp.view.module.warehouse.WarehouseMoveWarehouseController',
    ],

    viewModel: {
        type: 'warehouse'
    },
    controller: 'warehousemovewarehouse',
    initComponent: function () {
        var me = this;
        me.layout = 'hbox';

        var import_list = this.getMoveLocationList();
        this.items = [import_list];
        import_list.on("rowdblclick","onMoveWarehouseOrderGridDblClick");

        me.callParent();
    },
    getMoveLocationList: function () {
        var store = Ext.create('Ext.data.Store', {
            fields: ['move_no', 'id'],
            autoLoad: false,
            storeId:'moveLocationStore',
            proxy: {
                type: 'ajax',
                url: apiBaseUrl + '/index.php/Warehouse/Manage/getWarehouseMoveWarehouseList',
                reader: {
                    type: 'json',
                    rootProperty: 'data',
                    totalProperty: 'total'
                }
            }
        });
        var import_list_grid = Ext.create('Ext.grid.Panel', {
            title: '移库单列表',
            height: '100%',
            width: 240,
            reference:'move_warehouse_grid',
            border: true,
            sortableColumns:false,
            selModel:'checkboxmodel',
            enableRemoveColumn:false,
            columns: [
                {text: '移库单号', dataIndex: 'move_no', width:130},
                {text: '状态', dataIndex: 'status', flex: 1,renderer:function(val){
                    if(0==val) return '<b>未发出</b>';
                    if(1==val) return '<b class="text-info">已验收</b>';
                }}
            ],
            store: store,
            tbar: [
                //{
                //    text: '新增',
                //    glyph: 0xf067,
                //    handler: 'addMoveLocationOrder'
                //},
                {
                    text: '删除',
                    glyph: 0xf1f8,
                    handler:'delMoveWarehouseOrder'
                }
            ],
            //bbar: ['->', {
            //    xtype: 'pagingtoolbar',
            //    store: store,
            //    displayInfo: true
            //}],
            listeners: {
                afterrender: function () {
                    store.load();
                }
            }
        });
        return import_list_grid;
    }
});


