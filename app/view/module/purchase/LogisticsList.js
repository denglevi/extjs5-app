/**
 * Created by denglevi on 15-6-14.
 */
Ext.define('erp.view.module.purchase.LogisticsList', {
    extend: 'Ext.grid.Panel',
    xtype:'logisticslist',
    requires: [
        'Ext.form.field.Text',
        'Ext.toolbar.Paging',
        'erp.view.module.purchase.SupplierMngController',
        'erp.view.module.purchase.SupplierMngModel'
    ],

    viewModel: {
        type: 'suppliermng'
    },
    controller: 'suppliermng',
    selModel: 'checkboxmodel',   //选择框
    title:'采购物流列表',
    width:'100%',
    height:'100%',
    border:true,
    sortableColumns:false,
    tbar: [
        {
            text:'新增',
            glyph:0xf067,
            handler:'addPurchaseOrder'
        },
        {
            text:'删除',
            glyph:0xf1f8
        },'->',
        {
            xtype: 'textfield',
            fieldLabel: "物流单号",
            name: 'logistic_no'
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
        store: null,
        emptyMsg: '<b>暂无记录</b>',
        displayMsg: '显示 {0} - {1} 总共 {2} 条记录',
        displayInfo: true
    }],
    columns:[
        {text:'物流单号',dataIndex:'purchase_no',flex:1},
        {text:'供货单号',dataIndex:'batch_no',flex:1},
        {text:'供应商',dataIndex:'supplier'},
        {text:'物流类型',dataIndex:'type'},
        {text:'联系人',dataIndex:'contact'},
        {text:'提交日期',dataIndex:'date'}
    ]
});