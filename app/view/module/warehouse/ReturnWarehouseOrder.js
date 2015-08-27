/**
 * Created by Administrator on 2015-08-24.
 */
Ext.define('erp.view.module.warehouse.ReturnWarehouseOrder', {
    extend: 'Ext.grid.Panel',
    xtype: 'returnwarehouseorder',
    requires: [
        'Ext.toolbar.Paging',
        'erp.view.module.warehouse.ReturnWarehouseController',
        'erp.view.module.warehouse.WarehouseModel'
    ],
    viewModel: {
        type: 'warehouse'
    },
    controller: 'returnwarehouse',
    layout: 'fit',
    height: '100%',
    reference: 'warehouse_check_order_grid',
    border: true,
    sortableColumns: false,
    selModel: 'checkboxmodel',
    enableRemoveColumn: false,
    bufferedRenderer:false,
    columns: [
        {text: '通知单号', dataIndex: 'refund_no', flex: 1},
        {text: '申请单号', dataIndex: 'returns_no', flex: 1},
        {text: '入库仓库', dataIndex: 'storage_name'},
        {text: '申请店铺', dataIndex: 'shops_name'},
        {text: '申请日期', dataIndex: 'create_time'}
    ],
    store: 'ReturnWarehouseStore',
    tbar: [
        {
            text: '删除',
            glyph: 0xf1f8,
            handler: 'delWarehouseCheckTaskOrder'
        }
    ],
    bbar: ['->', {
        xtype: 'pagingtoolbar',
        store: 'ReturnWarehouseStore',
        displayInfo: true
    }],
    listeners: {
        afterrender: function () {
            this.getStore().load();
        },
        rowdblclick: "onReturnWarehouseGridDblClick"
    }
});