/**
 * Created by denglevi on 15-6-11.
 */
Ext.define('app.view.module.purchase.PurchaseController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.purchase',

    /**
     * Called when the view is created
     */
    init: function() {

    },
    onSupplierListDblClick:function(gp, record, tr, rowIndex, e, eOpts){
        console.log(record.get("name"));
    }
});