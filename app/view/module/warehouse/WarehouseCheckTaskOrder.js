/**
 * Created by Administrator on 2015-06-30.
 */
Ext.define('erp.view.module.warehouse.WarehouseCheckTaskOrder', {
    extend: 'Ext.grid.Panel',
    xtype: 'warehousechecktaskorder',
    requires: [
        'Ext.grid.column.Action',
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
    reference: 'move_warehouse_grid',
    border: true,
    sortableColumns: false,
    selModel: 'checkboxmodel',
    enableRemoveColumn: false,
    columns: [
        {text: '任务单号', dataIndex: 'receipts_no', flex: 1},
        {text: '日期', dataIndex: 'data'},
        {
            text: '盘点类型', dataIndex: 'task_type', renderer: function (val) {
            if (1 == val) return "全盘";
            if (2 == val) return "品牌";
            if (3 == val) return "分类";
        }
        },
        {text: '实盘数', dataIndex: 'sum_length1'},
        {text: '账面数', dataIndex: 'sum_length'},
        {text: '亏盈数', dataIndex: 'pal_num'},
        {text: '亏盈金额', dataIndex: 'pal'},
        {text: '备注', dataIndex: 'remark'},
        {text: '状态', dataIndex: 'status'},
        {
            text: '操作',
            xtype: 'actioncolumn',
            flex: 1,
            width: 50,
            items: [
                {icon: '/resources/images/next.png', tooltip: '执行', iconCls: 'colunmsAction'},
                {icon: '/resources/images/accept.png', tooltip: '确认', iconCls: 'colunmsAction'},
                {icon: '/resources/images/chart_bar.png', tooltip: '盈亏', iconCls: 'colunmsAction'},
                {icon: '/resources/images/setfieldrole.png', tooltip: '终止', iconCls: 'colunmsAction'}
            ]
        }
    ],
    store: 'WarehouseCheckTaskOrderStore',
    tbar: [
        {
            text: '新增',
            glyph: 0xf067,
            handler: "addTaskOrder"
        },
        {
            text: '删除',
            glyph: 0xf1f8,
            handler: 'delWarehouseCheckTaskOrder'
        }
    ],
    bbar: ['->', {
        xtype: 'pagingtoolbar',
        store: 'WarehouseCheckTaskOrderStore',
        displayInfo: true
    }],
    listeners: {
        afterrender: function () {
            this.getStore().load();
        },
        rowdblclick: "onWarehouseCheckTaskOrderGridDblClick"
    }
});



