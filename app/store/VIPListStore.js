/**
 * Created by Administrator on 2015-07-17.
 */
Ext.define('erp.store.VIPListStore', {
    extend: 'Ext.data.Store',
    storeId:"VIPListStore",
    fields: [],
    autoLoad:false,
    proxy: {
        type: 'ajax',
        url: apiBaseUrl+'/index.php/Membership/member/getVIPList',
        reader: {
            type: 'json',
            rootProperty: 'data',
            totalProperty: 'total'
        }
    }
});