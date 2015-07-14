/**
 * Created by Administrator on 2015-07-06.
 */
Ext.define('erp.store.SellerPositionListStore', {
        extend: 'Ext.data.Store',
        storeId:"SellerPositionListStore",
        fields: ['id', 'operations_post', 'operations_post_en', 'operations_post_status', 'operations_low_discount', 'operations_tall_discount'],
        autoLoad: false,
        proxy: {
            type: 'ajax',
            url: apiBaseUrl + '/index.php/Operations/Position/getSellerPositionList',
            reader: {
                type: 'json',
                rootProperty: 'data',
                totalProperty: 'total'
            }
        }
    }
);