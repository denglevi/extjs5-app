/**
 * Created by Administrator on 2015-06-12.
 */
Ext.define('erp.view.module.purchase.PurchaseOrderList', {
    extend: "Ext.container.Container",
    alias: "widget.purchaseorderlist",
    requires: [
        'Ext.grid.Panel',
        'Ext.layout.container.HBox',
        'Ext.panel.Panel',
        'erp.view.module.purchase.SupplierMngController',
        'erp.view.module.purchase.SupplierMngModel'
    ],
    controller: 'suppliermng',
    layout: 'hbox',
    split: true,
    viewModel: {
        type: 'suppliermng'
    },
    items:[
        {
            xtype:'grid',
            title:'采购单列表',
            width:300,
            border:true
        },
        {
            xtype:'panel',
            title:'采购单详情',
            flex:1,
            html:'1111'
        }
    ]

});