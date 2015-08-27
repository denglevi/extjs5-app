/**
 * Created by Administrator on 2015-06-30.
 */
Ext.define('erp.view.module.warehouse.WarehouseCheckOrder', {
    extend: 'Ext.grid.Panel',
    xtype: 'warehousecheckorder',
    requires: [
        'Ext.toolbar.Paging',
        'erp.view.module.warehouse.WarehouseCheckController',
        'erp.view.module.warehouse.WarehouseModel'
    ],
    viewModel: {
        type: 'warehouse'
    },
    controller: 'warehousecheck',
    layout: 'fit',
    height: '100%',
    reference: 'warehouse_check_order_grid',
    border: true,
    sortableColumns: false,
    selModel: 'checkboxmodel',
    enableRemoveColumn: false,
    bufferedRenderer:false,
    columns: [
        {text: '盘点单号', dataIndex: 'inventory_no', flex: 1},
        {text: '任务单号', dataIndex: 'receipts_no', flex: 1},
        {text: '盘点日期', dataIndex: 'inventory_data'},
        //{text: '实盘数', dataIndex: 'sum_length1'},
        {text: '制单人工号', dataIndex: 'inventory_user'},
        {text: '制单日期', dataIndex: 'create_time'}
    ],
    store: 'WarehouseCheckOrderStore',
    tbar: [
        {
            text: '新增',
            //glyph: 0xf067,
            iconCls:'addIcon',
            handler: "addCheckOrder"
        },
        {
            text: '删除',
            //glyph: 0xf1f8,
            iconCls:'delIcon',
            handler: 'delWarehouseCheckTaskOrder'
        }
    ],
    bbar: ['->', {
        xtype: 'pagingtoolbar',
        store: 'WarehouseCheckOrderStore',
        displayInfo: true
    }],
    listeners: {
        afterrender: function () {
            this.getStore().load();
        },
        rowdblclick: "onWarehouseCheckOrderGridDblClick"
    }
});



