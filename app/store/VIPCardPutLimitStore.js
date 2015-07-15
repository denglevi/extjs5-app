/**
 * Created by Administrator on 2015-07-15.
 */
Ext.define('erp.store.VIPCardPutLimitStore', {
        extend: 'Ext.data.Store',
        storeId:"VIPCardPutLimitStore",
        fields: [],
        autoLoad:false,
        proxy: {
            type: 'ajax',
            url: apiBaseUrl+'/index.php/Membership/Put/getPutLimit',
            reader: {
                type: 'json',
                rootProperty: 'data',
                totalProperty: 'total'
            }
        }
    }
);