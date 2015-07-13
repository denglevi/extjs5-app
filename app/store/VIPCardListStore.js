/**
 * Created by Administrator on 2015-07-13.
 */
Ext.define('erp.store.VIPCardListStore', {
        extend: 'Ext.data.Store',
        fields: ['id','storage_name','no'],
        autoLoad:false,
        proxy: {
            type: 'ajax',
            url: apiBaseUrl+'/index.php/Warehouse/Index/getLoction',
            reader: {
                type: 'json',
                rootProperty: 'data',
                totalProperty: 'total'
            }
        }
    }
);