/**
 * Created by Administrator on 2015-07-15.
 */
Ext.define('erp.store.CustomerMngStore', {
        extend: 'Ext.data.Store',
        storeId:"CustomerMngStore",
        fields: [],
        autoLoad:false,
        proxy: {
            type: 'ajax',
            url: apiBaseUrl+'/index.php/Membership/Customer/getCustomerList',
            reader: {
                type: 'json',
                rootProperty: 'data',
                totalProperty: 'total'
            }
        }
    }
);