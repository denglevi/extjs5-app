/**
 * Created by Administrator on 2015-06-18.
 */
Ext.define('erp.store.CheckProductListStore', {
        extend: 'Ext.data.Store',
        fields: ['id','check_no','order_no','batch_no','supplier_id','buyer_id','create_time'],
        autoLoad:false,
        proxy: {
            type: 'ajax',
            url: apiBaseUrl+'/index.php/Purchasing/CheckProduct/getCheckProductOrderList',
            reader: {
                type: 'json',
                rootProperty: 'data',
                totalProperty: 'total'
            }
        }
    }
);