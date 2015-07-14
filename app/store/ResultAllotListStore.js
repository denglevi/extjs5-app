/**
 * Created by Administrator on 2015-07-06.
 */
Ext.define('erp.store.ResultAllotListStore', {
        extend: 'Ext.data.Store',
        storeId:"ResultAllotListStore",
        fields: ['id', 'shop_id','month','money','allot_time','status'],
        autoLoad: false,
        proxy: {
            type: 'ajax',
            url: apiBaseUrl + '/index.php/Operations/ResultsAllot/getResultAllotList',
            reader: {
                type: 'json',
                rootProperty: 'data',
                totalProperty: 'total'
            }
        }
    }
);