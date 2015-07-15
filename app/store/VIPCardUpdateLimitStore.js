/**
 * Created by Administrator on 2015-07-15.
 */
Ext.define('erp.store.VIPCardUpdateLimitStore', {
        extend: 'Ext.data.Store',
        storeId:"VIPCardUpdateLimitStore",
        fields: [],
        autoLoad:false,
        proxy: {
            type: 'ajax',
            url: apiBaseUrl+'/index.php/Membership/Change/getVIPCardUpdateLimit',
            reader: {
                type: 'json',
                rootProperty: 'data',
                totalProperty: 'total'
            }
        }
    }
);