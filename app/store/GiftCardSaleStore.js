/**
 * Created by Administrator on 2015-07-15.
 */
Ext.define('erp.store.GiftCardSaleStore', {
        extend: 'Ext.data.Store',
        storeId:"GiftCardSaleStore",
        fields: [],
        autoLoad:false,
        proxy: {
            type: 'ajax',
            url: apiBaseUrl+'/index.php/Membership/Sales/getGiftCardSaleList',
            reader: {
                type: 'json',
                rootProperty: 'data',
                totalProperty: 'total'
            }
        }
    }
);
