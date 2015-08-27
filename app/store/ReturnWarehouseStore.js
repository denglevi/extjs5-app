/**
 * Created by Administrator on 2015-08-24.
 */
Ext.define('erp.store.ReturnWarehouseStore', {
        extend: 'Ext.data.Store',
        storeId:"ReturnWarehouseStore",
        fields: [],
        autoLoad: false,
        proxy: {
            type: 'ajax',
            url: apiBaseUrl + '/index.php/Warehouse/Refund/getSetWarehouseNotice',
            reader: {
                type: 'json',
                rootProperty: 'data',
                totalProperty: 'total'
            }
        }
    }
);