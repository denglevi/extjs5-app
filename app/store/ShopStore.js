/**
 * Created by Administrator on 2015-08-05.
 */
Ext.define('erp.store.ShopStore', {
    extend: 'Ext.data.Store',
        storeId: "ShopStore",
        fields: [],
        autoLoad: false,
        proxy: {
            type: 'ajax',
            url: apiBaseUrl + '/index.php/Operations/Shop/getShopList',
            reader: {
                type: 'json',
                rootProperty: 'data',
                totalProperty: 'total'
            }
        }
    }
);