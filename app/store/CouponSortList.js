/**
 * Created by Administrator on 2015-07-17.
 */
Ext.define('erp.store.CouponSortList', {
    extend: 'Ext.data.Store',
    storeId:"CouponSortList",
    fields: [],
    autoLoad:false,
    proxy: {
        type: 'ajax',
        url: apiBaseUrl+'/index.php/Operations/CouponSort/extjsIndex',
        reader: {
            type: 'json',
            rootProperty: 'data',
            totalProperty: 'total'
        }
    }
});