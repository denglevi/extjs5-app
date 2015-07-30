/**
 * Created by denglevi on 15-6-14.
 */
Ext.define('erp.view.module.purchase.CheckProductList', {
    extend: "Ext.grid.Panel",
    alias:"widget.checkproductlist",
    requires: [
        'Ext.form.field.Text',
        'Ext.toolbar.Fill',
        'Ext.toolbar.Paging',
        'erp.view.module.purchase.SupplierMngController',
        'erp.view.module.purchase.SupplierMngModel'
    ],
    viewModel: {
        type: 'suppliermng'
    },
    controller: 'suppliermng',
    selModel: 'checkboxmodel',   //选择框
    title:'验货单列表',
    width:'100%',
    height:'100%',
    border:true,
    sortableColumns:false,
    store:'CheckProductListStore',
    tbar: [
        //{
        //    text:'新增',
        //    glyph:0xf067,
        //    handler:'addPurchaseOrder'
        //},
        //{
        //    text:'删除',
        //    glyph:0xf1f8
        //},
        '->',
        {
            xtype: 'textfield',
            fieldLabel: "采购订单号",
            name: 'purchase_no'
        },
        {
            xtype: 'textfield',
            fieldLabel: "采购批次号",
            name: 'batch_no'
        },
        {
            text: '搜索',
            glyph: 0xf002
        }],
    bbar: ['->', {
        xtype: 'pagingtoolbar',
        store: 'CheckProductListStore',
        emptyMsg: '<b>暂无记录</b>',
        displayMsg: '显示 {0} - {1} 总共 {2} 条记录',
        displayInfo: true
    }],
    columns:[
        {text:'采购订单号',dataIndex:'order_no',flex:1},
        {text:'供货单号',dataIndex:'batch_no',flex:1},
        {text:'供应商',dataIndex:'name'},
        {text:'买手',dataIndex:'username'},
        {text:'提交日期',dataIndex:'date'}
    ],
    listeners:{
        afterrender:function(){
            this.getStore().load();
        },
        rowdblclick: 'onCheckProductOrderGridDblClick'
    }
});