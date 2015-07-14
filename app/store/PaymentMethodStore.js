/**
 * Created by Administrator on 2015-07-06.
 */
Ext.define('erp.store.PaymentMethodStore', {
        extend: 'Ext.data.Store',
        storeId:"PaymentMethodStore",
        fields: ['id', 'shop_id','month','money','allot_time','status'],
        autoLoad: false,
        proxy: {
            type: 'ajax',
            url: apiBaseUrl + '/index.php/Operations/ClearingForm/getPaymentMethodList',
            reader: {
                type: 'json',
                rootProperty: 'data',
                totalProperty: 'total'
            }
        }
    }
);