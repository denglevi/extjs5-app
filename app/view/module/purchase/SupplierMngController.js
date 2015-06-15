/**
 * Created by Administrator on 2015-06-12.
 */
Ext.define('erp.view.module.purchase.SupplierMngController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.suppliermng',

    requires: [
        'erp.view.module.purchase.AddPurchaseOrder',
        'erp.view.module.purchase.PurchaseOrderInfo'
    ],

    //config: {
    //    control: {
    //        'useredit button[action=save]': {
    //            click: 'updateUser'
    //        }
    //    }
    //},
    onSupplierGridDblClick:function(gp,record){
        gp.up("suppliermng").getViewModel().set("fieldDisabled",true);
        var form = gp.up("suppliermng").down("form");
        form.loadRecord(record);
    },
    addPurchaseOrder:function(btn){
        btn.up('grid').up('tabpanel').setActiveTab({
            xtype:'addpurchaseorder',
            title:'新建订单',
            closable:true
        });
    },
    onPurchaseOrderGridDblClick:function(gp){
        gp.up('tabpanel').setActiveTab({
            xtype:'purchaseorderinfo',
            title:'订单详情',
            closable:true
        });
    }
});

