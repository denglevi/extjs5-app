/**
 * Created by Administrator on 2015-08-03.
 */
Ext.define('erp.store.AuthorityStore', {
        extend: 'Ext.data.Store',
        storeId: "AuthorityStore",
        fields: [],
        autoLoad: false,
        proxy: {
            type: 'ajax',
            url: apiBaseUrl + '/index.php/System/Authority/getAuthorityList',
            reader: {
                type: 'json',
                rootProperty: 'data',
                totalProperty: 'total'
            }
        }
    }
);