/**
 * Created by Administrator on 2015-07-13.
 */
Ext.define('erp.store.VIPCardListStore', {
        extend: 'Ext.data.Store',
        storeId:"VIPCardListStore",
        fields: [],
        autoLoad:false,
        proxy: {
            type: 'ajax',
            url: apiBaseUrl+'/index.php/Membership/sort/getVIPType',
            reader: {
                type: 'json',
                rootProperty: 'data',
                totalProperty: 'total'
            }
        }
    }
);