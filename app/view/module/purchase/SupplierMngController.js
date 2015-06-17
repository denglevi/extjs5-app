/**
 * Created by Administrator on 2015-06-12.
 */
Ext.define('erp.view.module.purchase.SupplierMngController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.suppliermng',

    requires: [
        'Ext.Ajax',
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
    deletePurchaseOrder:function(del_btn){

        var sel = del_btn.up('grid').getSelection(),ids=[],nos=[];
        if(sel.length == 0){
            Ext.Msg.alert('系统提示', '请选择要删除的订单');
            return;
        }
        Ext.each(sel,function(record){
            ids.push(record.get("id"));
            nos.push(record.get("order_nos"));
        });
        Ext.Msg.show({
            title:'系统消息',
            message: '你确定要删除以下采购订单吗？<br>'+nos.join('<br>'),
            buttons: Ext.Msg.YESNO,
            icon: Ext.Msg.QUESTION,
            fn: function(btn) {
                if (btn === 'yes') {
                    Ext.Ajax.request({
                        url:apiBaseUrl+'/index.php/Purchasing/Buyer/deletePurchaseOrder',
                        waitMsg:'正在删除...',
                        params:{
                            ids:ids.join(',')
                        },
                        success:function(data){
                            del_btn.up('grid').getStore().load();
                        },
                        failure:function(data){
                            var res = Ext.decode(data.responseText);
                            Ext.Msg.alert('系统提示', res.msg);
                        }
                    })
                }
            }
        });
    },
    onPurchaseOrderGridDblClick:function(gp,record){
        var order_id = record.get("id");
        gp.up('tabpanel').setActiveTab({
            xtype:'purchaseorderinfo',
            title:'订单详情',
            closable:true,
            order_id:order_id
        });
    }
});

