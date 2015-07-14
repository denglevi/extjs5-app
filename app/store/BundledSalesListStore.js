/**
 * Created by Administrator on 2015-07-06.
 */
Ext.define('erp.store.BundledSalesListStore', {
        extend: 'Ext.data.Store',
        storeId:"BundledSalesListStore",
        fields: ['id'],
        autoLoad: false,
        proxy: {
            type: 'ajax',
            url: apiBaseUrl + '/index.php/Operations/Promotion/getBundledSalesList',
            reader: {
                type: 'json',
                rootProperty: 'data',
                totalProperty: 'total'
            }
        }
    }
);