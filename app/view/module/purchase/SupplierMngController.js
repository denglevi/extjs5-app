/**
 * Created by Administrator on 2015-06-12.
 */
Ext.define('erp.view.module.purchase.SupplierMngController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.suppliermng',

    requires: [
        'Ext.Ajax',
        'erp.view.module.purchase.AddPurchaseOrder',
        'erp.view.module.purchase.CheckProductOrderInfo',
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
                            var res = Ext.decode(data.responseText);
                            if(!res.success){
                                Ext.Msg.alert('系统提示', res.msg);
                                return;
                            }
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
        Ext.getBody().mask("请稍等,正在获取数据...");
        Ext.Ajax.request({
            async: true,
            url: apiBaseUrl + '/index.php/Purchasing/Buyer/getPurchaseOrderInfo',
            params: {
                id: order_id
            },
            success: function (response) {
                Ext.getBody().unmask();
                var text = Ext.decode(response.responseText);
                res = text.data;
                gp.up('tabpanel').setActiveTab({
                    xtype:'purchaseorderinfo',
                    title:'订单详情',
                    closable:true,
                    order_id:order_id,
                    res:res,
                    listeners:{
                        beforedestroy:function(){
                            gp.getStore().load();
                        }
                    }
                });
            }
        });
    },
    onCheckProductOrderGridDblClick:function(gp,record){
        var batch_no = record.get("batch_no");
        gp.up('tabpanel').setActiveTab({
            xtype:'checkproductorderinfo',
            title:'验货单详情',
            closable:true,
            batch_no:batch_no,
            record:record
        });
    },
    deletePassCustomOrder:function(del_btn){
        var sel = del_btn.up('grid').getSelection(),ids=[],nos=[];
        if(sel.length == 0){
            Ext.Msg.alert('系统提示', '请选择要删除的订单');
            return;
        }
        Ext.each(sel,function(record){
            ids.push(record.get("id"));
            nos.push(record.get("supply_no"));
        });
        Ext.Msg.show({
            title:'系统消息',
            message: '你确定要删除以下清关单吗？<br>'+nos.join('<br>'),
            buttons: Ext.Msg.YESNO,
            icon: Ext.Msg.QUESTION,
            fn: function(btn) {
                if (btn === 'yes') {
                    Ext.Ajax.request({
                        url:apiBaseUrl+'/index.php/Purchasing/Customs/deletePassCustomOrder',
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
    deleteLogisticsOrder:function(del_btn){
        var sel = del_btn.up('grid').getSelection(),ids=[],nos=[];
        if(sel.length == 0){
            Ext.Msg.alert('系统提示', '请选择要删除的订单');
            return;
        }
        Ext.each(sel,function(record){
            ids.push(record.get("id"));
            nos.push(record.get("logistics_no"));
        });
        Ext.Msg.show({
            title:'系统消息',
            message: '你确定要删除以下物流单吗？<br>'+nos.join('<br>'),
            buttons: Ext.Msg.YESNO,
            icon: Ext.Msg.QUESTION,
            fn: function(btn) {
                if (btn === 'yes') {
                    Ext.Ajax.request({
                        url:apiBaseUrl+'/index.php/Purchasing/Logistics/deleteLogisticsOrder',
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
    }
});

