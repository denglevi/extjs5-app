/**
 * Created by Administrator on 2015-07-06.
 */
Ext.define('erp.store.SellerListStore', {
        extend: 'Ext.data.Store',
        storeId:"SellerListStore",
        fields: ['id', 'job_no', 'username', 'job_post', 'sex', 'phone', 'address', 'birthday','notes','shop_id','is_signature','signature','status'],
        autoLoad: false,
        proxy: {
            type: 'ajax',
            url: apiBaseUrl + '/index.php/Operations/Saleder/getSellerList',
            reader: {
                type: 'json',
                rootProperty: 'data',
                totalProperty: 'total'
            }
        }
    }
);