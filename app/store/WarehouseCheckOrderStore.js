/**
 * Created by Administrator on 2015-07-03.
 */
Ext.define('erp.store.WarehouseCheckOrderStore',{
    extend:'Ext.data.Store',
    fields: ['move_no', 'id'],
    autoLoad: false,
    storeId:'warehouseCheckOrderStore',
    proxy: {
        type: 'ajax',
        url: apiBaseUrl + '/index.php/Warehouse/CheckVouch/getWarehouseCheckOrderList',
        reader: {
            type: 'json',
            rootProperty: 'data',
            totalProperty: 'total'
        }
    }
});
