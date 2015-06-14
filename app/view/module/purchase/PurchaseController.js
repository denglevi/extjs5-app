/**
 * Created by denglevi on 15-6-11.
 */
Ext.define('erp.view.module.purchase.PurchaseController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.purchase',

    /**
     * Called when the view is created
     */
    init: function() {
        var view = this.getView();
        view.html = 'xxxxxx';
        console.log(123);
    },
    aaa:function(){
        console.log(111);
    }
});