/**
 * Created by Administrator on 2015-08-25.
 */
Ext.define('erp.view.module.warehouse.ReturnIntoWarehouseOrder', {
    extend: 'Ext.grid.Panel',
    xtype: 'returnintowarehouseorder',
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
        {text: '单据编号', dataIndex: 'refund_into_no', flex: 1},
        {text: '通知单号', dataIndex: 'refund_no', flex: 1},
        {text: '申请单号', dataIndex: 'teturned_no'},
        {text: '执行类别', dataIndex: 'select_type', renderer: function (val) {
                if (1 == val) return "申请数";
                if (2 == val) return "审核数";
            }
        },
        {text: '入仓仓库', dataIndex: 'storage_name'},
        {text: '仓库编号', dataIndex: 'no'},
        {text: '申请店铺', dataIndex: 'shops_name'},
        {text: '日期', dataIndex: 'create_time'},
        {text: '状态', dataIndex: 'status',renderer: function (val) {
            if (0 == val) return "<span style='color: red'>未验收</span>";
            if (1 == val) return "已验收";
            if (2 == val) return "已终止";
        }}
    ],
    store: 'ReturnIntoWarehouseStore',
    tbar: [
        {
            text: '删除',
            glyph: 0xf1f8,
            handler: 'delWarehouseCheckTaskOrder'
        }
    ],
    bbar: ['->', {
        xtype: 'pagingtoolbar',
        store: 'ReturnIntoWarehouseStore',
        displayInfo: true
    }],
    listeners: {
        afterrender: function () {
            this.getStore().load();
        },
        rowdblclick: "onReturnIntoWarehouseGridDblClick"
    }
});