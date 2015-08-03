/**
 * Created by Administrator on 2015-08-03.
 */
Ext.define('erp.store.GroupStore', {
        extend: 'Ext.data.Store',
        storeId: "GroupStore",
        fields: [],
        autoLoad: false,
        proxy: {
            type: 'ajax',
            url: apiBaseUrl + '/index.php/System/Group/getGroupList',
            reader: {
                type: 'json',
                rootProperty: 'data',
                totalProperty: 'total'
            }
        }
    }
);