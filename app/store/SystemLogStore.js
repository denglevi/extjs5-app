/**
 * Created by Administrator on 2015-08-03.
 */
Ext.define('erp.store.SystemLogStore', {
        extend: 'Ext.data.Store',
        storeId: "SystemLogStore",
        fields: [],
        autoLoad: false,
        proxy: {
            type: 'ajax',
            url: apiBaseUrl + '/index.php/System/Index/getSystemLog',
            reader: {
                type: 'json',
                rootProperty: 'data',
                totalProperty: 'total'
            }
        }
    }
);