/**
 * Created by Administrator on 2015-07-15.
 */
Ext.define('erp.store.VIPCardOpenLimitStore', {
        extend: 'Ext.data.Store',
        storeId:"VIPCardOpenLimitStore",
        fields: [],
        autoLoad:false,
        proxy: {
            type: 'ajax',
            url: apiBaseUrl+'/index.php/Membership/Hairpin/getVIPCardOpenLimit',
            reader: {
                type: 'json',
                rootProperty: 'data',
                totalProperty: 'total'
            }
        }
    }
);