/**
 * Created by Administrator on 2015-08-03.
 */
Ext.define('erp.store.RoleStore', {
        extend: 'Ext.data.Store',
        storeId: "RoleStore",
        fields: [],
        autoLoad: false,
        proxy: {
            type: 'ajax',
            url: apiBaseUrl + '/index.php/System/Role/getRoleList',
            reader: {
                type: 'json',
                rootProperty: 'data',
                totalProperty: 'total'
            }
        }
    }
);