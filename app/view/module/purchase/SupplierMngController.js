/**
 * Created by Administrator on 2015-06-12.
 */
Ext.define('erp.view.module.purchase.SupplierMngController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.suppliermng',

    requires: [
        'erp.view.module.purchase.AddPurchaseOrder'
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
        form.down("hiddenfield[name='id']").setValue(record.get("id"));
        form.down("textfield[name='name']").setValue(record.get("name"));
        form.down("textfield[name='vendor_no']").setValue(record.get("vendor_no"));
        form.down("textfield[name='bank_name']").setValue(record.get("bank_name"));
        form.down("textfield[name='bank_no']").setValue(record.get("bank_no"));
        form.down("textfield[name='tax_no']").setValue(record.get("tax_no"));
        form.down("textfield[name='address']").setValue(record.get("address"));
    },
    onPurchaseOrderGridDblClick:function(gp,record){
        console.log(2222);
        gp.up('tabpanel').setActiveTab({
            xtype:'addpurchaseorder',
            title:'xxxx',
            closable:true
        });
    }
});

