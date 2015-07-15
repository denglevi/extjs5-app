/**
 * Created by Administrator on 2015-07-15.
 */
Ext.define('erp.store.GiftCardPutLimitStore', {
    extend: 'Ext.data.Store',
    storeId:"GiftCardPutLimitStore",
    fields: [],
    autoLoad:false,
    proxy: {
        type: 'ajax',
        url: apiBaseUrl+'/index.php/Membership/Gift/getGiftCardPutLimit',
        reader: {
            type: 'json',
            rootProperty: 'data',
            totalProperty: 'total'
        }
    }
});