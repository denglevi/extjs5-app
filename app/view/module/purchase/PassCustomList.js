/**
 * Created by denglevi on 15-6-14.
 */
Ext.define('erp.view.module.purchase.PassCustomList', {
    extend: 'Ext.grid.Panel',
    xtype: 'passcustomlist',
    requires: [
        'Ext.form.field.Text',
        'Ext.toolbar.Fill',
        'Ext.toolbar.Paging',
        'erp.view.module.purchase.SupplierMngController',
        'erp.view.module.purchase.SupplierMngModel',
        'erp.view.window.AddPassCustomWin',
        'erp.view.window.PassCustomInfoWin'
    ],

    viewModel: {
        type: 'suppliermng'
    },
    controller: 'suppliermng',
    selModel: 'checkboxmodel',   //选择框
    title: '清关单列表',
    width: '100%',
    height: '100%',
    border: true,
    sortableColumns: false,
    tbar: [
        //{
        //    text:'新增',
        //    glyph:0xf067,
        //    handler:'addPurchaseOrder'
        //},
        {
            text: '删除',
            glyph: 0xf1f8,
            handler: 'deletePassCustomOrder'
        }, '->',
        {
            xtype: 'textfield',
            fieldLabel: "采购订单号",
            name: 'purchase_no',
            labelAlign:'right'
        },
        {
            xtype: 'textfield',
            fieldLabel: "采购批次号",
            name: 'batch_no',
            labelAlign:'right'
        },
        {
            text: '搜索',
            glyph: 0xf002
        }],
    store: 'PassCustomListStore',
    bbar: ['->', {
        xtype: 'pagingtoolbar',
        store: 'PassCustomListStore',
        emptyMsg: '<b>暂无记录</b>',
        displayMsg: '显示 {0} - {1} 总共 {2} 条记录',
        displayInfo: true
    }],
    columns: [
        {text: '采购订单号', dataIndex: 'order_no', flex: 1},
        {text: '供货单号', dataIndex: 'supply_no', flex: 1},
        {text: '物流单号', dataIndex: 'logistics_no', flex: 1},
        {text: '报关公司', dataIndex: 'cu_name', flex: 1},
        {text: '联系人', dataIndex: 'cu_contaits', flex: 1},
        {text: '报关状态', dataIndex: 'status_name'}
    ],
    listeners: {
        afterrender: function () {
            this.getStore().load();
        },
        rowdblclick:function(obj,record){
            var me = this;
            var win = Ext.create('erp.view.window.PassCustomInfoWin',{
                title:record.get("status_name"),
                record:record
            });
            win.show();
            win.on("beforedestroy",function(){
                me.getStore().load();
            });
        }
    }
});