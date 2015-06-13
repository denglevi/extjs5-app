/**
 * Created by denglevi on 15-6-14.
 */
Ext.define('erp.view.module.purchase.AddPurchaseOrder', {
    extend: 'Ext.container.Container',
    alias: 'widget.addpurchaseorder',
    requires: [
        'erp.view.module.purchase.SupplierMngController',
        'erp.view.module.purchase.SupplierMngModel'
    ],
    controller: 'suppliermng',
    viewModel: {
        type: 'suppliermng'
    },
    initComponent: function () {

        this.callParent();
    },
    html:'xxxxxxxxxx'
});