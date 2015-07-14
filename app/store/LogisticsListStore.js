/**
 * Created by Administrator on 2015-06-18.
 */
Ext.define('erp.store.LogisticsListStore', {
        extend: 'Ext.data.Store',
        storeId:"LogisticsListStore",
        fields: ['id','logistics_no','order_no','batch_no','supplier_id','contact','create_time','name'],
        autoLoad:false,
        proxy: {
            type: 'ajax',
            url: apiBaseUrl+'/index.php/Purchasing/Logistics/getLogisticsOrderList',
            reader: {
                type: 'json',
                rootProperty: 'data',
                totalProperty: 'total'
            }
        }
    }
);