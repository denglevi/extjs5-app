/**
 * Created by Administrator on 2015-08-03.
 */
Ext.define('erp.store.ModuleStore', {
        extend: 'Ext.data.Store',
        storeId: "ModuleStore",
        fields: [],
        autoLoad: false,
        proxy: {
            type: 'ajax',
            url: apiBaseUrl + '/index.php/System/Module/getModuleList',
            reader: {
                type: 'json',
                rootProperty: 'data',
                totalProperty: 'total'
            }
        }
    }
);