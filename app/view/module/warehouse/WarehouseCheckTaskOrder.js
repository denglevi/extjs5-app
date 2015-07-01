/**
 * Created by Administrator on 2015-06-30.
 */
Ext.define('erp.view.module.warehouse.WarehouseCheckTaskOrder', {
    extend: 'Ext.Container',
    xtype: 'warehousechecktaskorder',
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

        var task_list = this.getCheckTaskList();
        this.items = [task_list];
        task_list.on("rowdblclick","onWarehouseCheckTaskOrderGridDblClick");

        me.callParent();
    },
    getCheckTaskList: function () {
        var store = Ext.create('Ext.data.Store', {
            fields: ['move_no', 'id'],
            autoLoad: false,
            storeId:'warehouseCheckTaskOrderStore',
            proxy: {
                type: 'ajax',
                url: apiBaseUrl + '/index.php/Warehouse/Manage/getWarehouseCheckTaskOrderList',
                reader: {
                    type: 'json',
                    rootProperty: 'data',
                    totalProperty: 'total'
                }
            }
        });
        var task_list_grid = Ext.create('Ext.grid.Panel', {
            title: '任务单列表',
            height: '100%',
            width: 200,
            reference:'move_warehouse_grid',
            border: true,
            sortableColumns:false,
            selModel:'checkboxmodel',
            enableRemoveColumn:false,
            columns: [
                {text: '任务单号', dataIndex: 'move_no', flex: 1}
            ],
            store: store,
            tbar: [
                {
                    text: '新增',
                    glyph: 0xf067,
                    handler: 'addWarehouseCheckTaskOrder'
                },
                {
                    text: '删除',
                    glyph: 0xf1f8,
                    handler:'delWarehouseCheckTaskOrder'
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
        return task_list_grid;
    }
});



