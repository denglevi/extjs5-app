/**
 * Created by Administrator on 2015-06-29.
 */
Ext.define('erp.store.WarehouseListStore', {
        extend: 'Ext.data.Store',
        storeId:"WarehouseListStore",
        fields: ['id','storage_name','no'],
        autoLoad:false,
        proxy: {
            type: 'ajax',
            url: apiBaseUrl+'/index.php/Warehouse/Index/getWarehouseList',
            reader: {
                type: 'json',
                rootProperty: 'data',
                totalProperty: 'total'
            }
        }
    }
);