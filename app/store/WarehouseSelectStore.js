/**
 * Created by Administrator on 2015-08-06.
 */
Ext.define('erp.store.WarehouseSelectStore', {
    extend: 'Ext.data.Store',
    fields: [],
    storeId: "WarehouseSelectStore",
    authLoad: false,
    proxy: {
        type: 'ajax',
        url: apiBaseUrl + '/index.php/Warehouse/Stock/searchGoods',
        reader: {
            type: 'json',
            rootProperty: 'data',
            totalProperty: 'total'
        }
    }
});