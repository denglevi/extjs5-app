/**
 * Created by Administrator on 2015-06-12.
 */
Ext.define('erp.view.module.purchase.PurchaseOrderList', {
    extend: "Ext.grid.Panel",
    alias: "widget.purchaseorderlist",
    requires: [
        'Ext.data.Store',
        'Ext.form.field.Text',
        'Ext.toolbar.Paging',
        'erp.view.module.purchase.SupplierMngController',
        'erp.view.module.purchase.SupplierMngModel'
    ],
    controller: 'suppliermng',
    viewModel: {
        type: 'suppliermng'
    },
    title:'采购单列表',
    width:'100%',
    height:'100%',
    border:true,
    tbar: [
            {
                text:'新增'
            },
            {
                text:'删除'
            },'->',
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
        store: null,
        emptyMsg: '<b>暂无记录</b>',
        displayMsg: '显示 {0} - {1} 总共 {2} 条记录',
        displayInfo: true
    }],
    columns: [
        {text: '订单号', dataIndex: 'no'},
        {text: '供应商', dataIndex: 'supplier'},
        {text: '订单类型', dataIndex: 'type'},
        {text: '状态', dataIndex: 'status'},
        {text: '提交日期', dataIndex: 'date',flex:1}
    ],
    store:Ext.create("Ext.data.Store",
        {
            fields: ['no', 'supplier', 'type','status','date'],
            data:[
                {no:'xxx',supplier:'xxx',type:'xxx',status:'xxx',date:'2015-06-14'},
                {no:'xxx',supplier:'xxx',type:'xxx',status:'xxx',date:'2015-06-14'},
                {no:'xxx',supplier:'xxx',type:'xxx',status:'xxx',date:'2015-06-14'},
                {no:'xxx',supplier:'xxx',type:'xxx',status:'xxx',date:'2015-06-14'},
                {no:'xxx',supplier:'xxx',type:'xxx',status:'xxx',date:'2015-06-14'},
                {no:'xxx',supplier:'xxx',type:'xxx',status:'xxx',date:'2015-06-14'}
            ]
            //proxy: {
            //    type: 'ajax',
            //    url: 'http://localhost/coscia/index.php/Purchasing/Vendor/vendorList.html',
            //    reader: {
            //        type: 'json',
            //        rootProperty: 'data'
            //    }
            //}
        }
    ),
    listeners:{
        rowdblclick:'onPurchaseOrderGridDblClick'
    }
});