/**
 * Created by Administrator on 2015-06-15.
 */
Ext.define('erp.store.PurchaseOrderListStore', {
        extend: 'Ext.data.Store',
        fields: ['id','order_nos', 'name', 'order_type','status_name','order_time','order_buyer'],
        //data:[
        //    {no:'xxx',supplier:'xxx',type:'xxx',status:'xxx',date:'2015-06-14'},
        //    {no:'xxx',supplier:'xxx',type:'xxx',status:'xxx',date:'2015-06-14'},
        //    {no:'xxx',supplier:'xxx',type:'xxx',status:'xxx',date:'2015-06-14'},
        //    {no:'xxx',supplier:'xxx',type:'xxx',status:'xxx',date:'2015-06-14'},
        //    {no:'xxx',supplier:'xxx',type:'xxx',status:'xxx',date:'2015-06-14'},
        //    {no:'xxx',supplier:'xxx',type:'xxx',status:'xxx',date:'2015-06-14'}
        //],
        autoLoad:false,
        proxy: {
            type: 'ajax',
            url: apiBaseUrl+'/index.php/Purchasing/Buyer/getPurchaseOrderList.html?api=1',
            reader: {
                type: 'json',
                rootProperty: 'data',
                totalProperty: 'total'
            }
        }
    }
);
