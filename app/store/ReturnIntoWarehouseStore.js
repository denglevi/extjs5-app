/**
 * Created by Administrator on 2015-08-25.
 */
Ext.define('erp.store.ReturnIntoWarehouseStore', {
        extend: 'Ext.data.Store',
        storeId:"ReturnIntoWarehouseStore",
        fields: [],
        autoLoad: false,
        proxy: {
            type: 'ajax',
            url: apiBaseUrl + '/index.php/Warehouse/RefundInto/getIntoWarehouseStore',
            reader: {
                type: 'json',
                rootProperty: 'data',
                totalProperty: 'total'
            }
        }
    }
);