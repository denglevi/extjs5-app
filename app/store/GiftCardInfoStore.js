/**
 * Created by Administrator on 2015-07-15.
 */
Ext.define('erp.store.GiftCardInfoStore', {
        extend: 'Ext.data.Store',
        storeId:"GiftCardInfoStore",
        fields: [],
        autoLoad:false,
        proxy: {
            type: 'ajax',
            url: apiBaseUrl+'/index.php/Membership/Data/getGiftCardInfoList',
            reader: {
                type: 'json',
                rootProperty: 'data',
                totalProperty: 'total'
            }
        }
    }
);