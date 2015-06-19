/**
 * Created by Administrator on 2015-06-19.
 */
/**
 * Created by Administrator on 2015-06-18.
 */
Ext.define('erp.store.PassCustomListStore', {
        extend: 'Ext.data.Store',
        fields: ['id','logistics_no','order_no','supply_no','cu_contaits','cu_name','create_time'],
        autoLoad:false,
        proxy: {
            type: 'ajax',
            url: apiBaseUrl+'/index.php/Purchasing/Customs/getPassCustomOrderList',
            reader: {
                type: 'json',
                rootProperty: 'data',
                totalProperty: 'total'
            }
        }
    }
);