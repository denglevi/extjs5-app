/**
 * Created by Administrator on 2015-07-17.
 */
Ext.define('erp.store.WarehouseDeliveryOrderStore', {
    extend: 'Ext.data.Store',
    storeId:"WarehouseDeliveryOrderStore",
    fields: [],
    autoLoad: false,
    proxy: {
        type: 'ajax',
        url: apiBaseUrl + '/index.php/Warehouse/DeliveryGoods/getDeliveryGoodsOrderList',
        reader: {
            type: 'json',
            rootProperty: 'data',
            totalProperty: 'total'
        }
    }
});