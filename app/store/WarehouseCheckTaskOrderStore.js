/**
 * Created by Administrator on 2015-07-02.
 */
Ext.define('erp.store.WarehouseCheckTaskOrderStore',{
    extend:'Ext.data.Store',
    fields: ['move_no', 'id'],
    autoLoad: false,
    storeId:'warehouseCheckTaskOrderStore',
    proxy: {
        type: 'ajax',
        url: apiBaseUrl + '/index.php/Warehouse/TaskList/getWarehouseCheckTaskOrderList',
        reader: {
            type: 'json',
            rootProperty: 'data',
            totalProperty: 'total'
        }
    }
});