/**
 * Created by Administrator on 2015-07-17.
 */
Ext.define('erp.store.SingleList', {
    extend: 'Ext.data.Store',
    storeId:"SingleList",
    fields: [],
    autoLoad:false,
    proxy: {
        type: 'ajax',
        url: apiBaseUrl+'/index.php/Operations/SingleType/extjsIndex',
        reader: {
            type: 'json',
            rootProperty: 'data',
            totalProperty: 'total'
        }
    }
});