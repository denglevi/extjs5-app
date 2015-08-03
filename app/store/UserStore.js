/**
 * Created by Administrator on 2015-08-03.
 */
Ext.define('erp.store.UserStore', {
        extend: 'Ext.data.Store',
        storeId: "UserStore",
        fields: [],
        autoLoad: false,
        proxy: {
            type: 'ajax',
            url: apiBaseUrl + '/index.php/System/User/getUserList',
            reader: {
                type: 'json',
                rootProperty: 'data',
                totalProperty: 'total'
            }
        }
    }
);