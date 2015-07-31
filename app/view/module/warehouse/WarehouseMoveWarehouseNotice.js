/**
 * Created by Administrator on 2015-06-30.
 */
Ext.define('erp.view.module.warehouse.WarehouseMoveWarehouseNotice', {
    extend: 'Ext.Container',
    xtype: 'warehousemovewarehousenotice',
    requires: [
        'Ext.data.Store',
        'Ext.data.proxy.Ajax',
        'Ext.data.reader.Json',
        'Ext.grid.Panel',
        'erp.view.module.warehouse.WarehouseModel',
        'erp.view.module.warehouse.WarehouseMoveWarehouseController'
    ],

    viewModel: {
        type: 'warehouse'
    },
    controller: 'warehousemovewarehouse',
    initComponent: function () {
        var me = this;
        me.layout = 'hbox';

        var import_list = this.getMoveWarehouseNoticeList();
        this.items = [import_list];
        import_list.on("rowdblclick","onMoveWarehouseGridDblClick");

        me.callParent();
    },
    getMoveWarehouseNoticeList: function () {
        var store = Ext.create('Ext.data.Store', {
            fields: [],
            autoLoad: false,
            storeId:'moveWarehouseNoticeStore',
            proxy: {
                type: 'ajax',
                url: apiBaseUrl + '/index.php/Warehouse/Manage/getWarehouseMoveWarehouseNoticeList',
                reader: {
                    type: 'json',
                    rootProperty: 'data',
                    totalProperty: 'total'
                }
            }
        });
        var import_list_grid = Ext.create('Ext.grid.Panel', {
            title: '移库通知单列表',
            height: '100%',
            width: 240,
            reference:'move_warehouse_notice_grid',
            border: true,
            sortableColumns:false,
            selModel:'checkboxmodel',
            enableRemoveColumn:false,
            columns: [
                {text: '通知单号', dataIndex: 'notice_no', width:130},
                {text: '状态', dataIndex: 'status', flex: 1,renderer:function(val){
                    if(0==val) return '<b>未发出</b>';
                    if(1==val) return '<b class="text-info">已发出</b>';
                    if(2==val) return '<b class="text-danger">已终止</b>';
                }}
            ],
            store: store,
            tbar: [
                {
                    text: '新增',
                    glyph: 0xf067,
                    handler: 'addMoveWarehouseNotice'
                },
                {
                    text: '删除',
                    glyph: 0xf1f8,
                    handler:'delMoveWarehouseNotice'
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


