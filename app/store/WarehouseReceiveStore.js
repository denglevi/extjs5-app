/**
 * Created by Administrator on 2015-06-19.
 */
Ext.define('erp.store.WarehouseReceiveStore', {
        extend: 'Ext.data.Store',
        fields: ['id','logistics_no','order_no','batch_no','supplier_id','receive_no','create_time','name','status'],
        autoLoad:false,
        proxy: {
            type: 'ajax',
            url: apiBaseUrl+'/index.php/Warehouse/Index/getWarehouseReceiveList',
            reader: {
                type: 'json',
                rootProperty: 'data',
                totalProperty: 'total'
            }
        }
    }
);
