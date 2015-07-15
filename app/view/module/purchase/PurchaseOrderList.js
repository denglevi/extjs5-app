/**
 * Created by Administrator on 2015-06-12.
 */
Ext.define('erp.view.module.purchase.PurchaseOrderList', {
    extend: "Ext.grid.Panel",
    alias: "widget.purchaseorderlist",
    requires: [
        'Ext.form.field.Text',
        'Ext.toolbar.Fill',
        'Ext.toolbar.Paging',
        'erp.view.module.purchase.SupplierMngController',
        'erp.view.module.purchase.SupplierMngModel'
    ],
    controller: 'suppliermng',
    viewModel: {
        type: 'suppliermng'
    },
    sortableColumns:false,
    selModel: 'checkboxmodel',   //选择框
    title: '采购单列表',
    width: '100%',
    height: '100%',
    border: true,
    tbar: [
        {
            text: '新增',
            glyph: 0xf067,
            handler: 'addPurchaseOrder'
        },
        {
            text: '删除',
            glyph: 0xf1f8,
            handler:'deletePurchaseOrder'
        }, '->',
        {
            xtype: 'textfield',
            fieldLabel: "采购订单号",
            name: 'purchase_order_no'
        },
        {
            xtype: 'textfield',
            fieldLabel: "供应商名称",
            name: 'supllier_name'
        },
        {
            text: '搜索',
            glyph: 0xf002
        }],
    bbar: ['->', {
        xtype: 'pagingtoolbar',
        store: 'PurchaseOrderListStore',
        emptyMsg: '<b>暂无记录</b>',
        displayMsg: '显示 {0} - {1} 总共 {2} 条记录',
        displayInfo: true
    }],
    columns: [
        {text: '订单号', dataIndex: 'order_nos',flex:1},
        {text: '供应商', dataIndex: 'name'},
        {text: '买手', dataIndex: 'order_buyer'},
        {text: '订单类型', dataIndex: 'order_state',renderer:function(value, cellmeta, record, rowIndex, columnIndex, store){
            if(value == 'spot_purchase_order'){
                return '现货';
            }
            return '期货';
        }},
        {text: '状态', dataIndex: 'status_name'},
        {text: '提交日期', dataIndex: 'order_time', flex: 2}
    ],
    store: 'PurchaseOrderListStore',
    listeners: {
        afterrender: function () {
            this.getStore().load();
        },
        rowdblclick: 'onPurchaseOrderGridDblClick'
    }
});