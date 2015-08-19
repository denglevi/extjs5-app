/**
 * Created by Administrator on 2015-08-19.
 */
Ext.define('erp.store.WholeOrderPromotionStore', {
        extend: 'Ext.data.Store',
        storeId:"WholeOrderPromotionStore",
        fields: ['id'],
        autoLoad: false,
        proxy: {
            type: 'ajax',
            url: apiBaseUrl + '/index.php/Operations/Entire/getWholeOrderPromotionList',
            reader: {
                type: 'json',
                rootProperty: 'data',
                totalProperty: 'total'
            }
        }
    }
);