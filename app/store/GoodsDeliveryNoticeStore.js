/**
 * Created by Administrator on 2015-07-17.
 */
Ext.define('erp.store.GoodsDeliveryNoticeStore', {
    extend: 'Ext.data.Store',
    storeId:"GoodsDeliveryNoticeStore",
    fields: [],
    autoLoad: false,
    proxy: {
        type: 'ajax',
        url: apiBaseUrl + '/index.php/Commodity/Distribution/getDeliveryNoticeList',
        reader: {
            type: 'json',
            rootProperty: 'data',
            totalProperty: 'total'
        }
    }
});