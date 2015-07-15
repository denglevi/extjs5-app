/**
 * Created by Administrator on 2015-07-15.
 */
Ext.define('erp.store.GiftCardReturnStandardStore', {
        extend: 'Ext.data.Store',
        storeId:"GiftCardReturnStandardStore",
        fields: [],
        autoLoad:false,
        proxy: {
            type: 'ajax',
            url: apiBaseUrl+'/index.php/Membership/Rebate/getGiftCardReturnStandardList',
            reader: {
                type: 'json',
                rootProperty: 'data',
                totalProperty: 'total'
            }
        }
    }
);