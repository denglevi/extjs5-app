/**
 * Created by Administrator on 2015-06-15.
 */
Ext.define('erp.store.SupplierStore', {
    extend: 'Ext.data.Store',
    requires: [
        'erp.model.SupplierModel'
    ],
    model: 'erp.model.SupplierModel',

    /*
     Fields can also be declared without a model class:
     fields: [
     {name: 'firstName', type: 'string'},
     {name: 'lastName',  type: 'string'},
     {name: 'age',       type: 'int'},
     {name: 'eyeColor',  type: 'string'}
     ]
     */
    autoLoad:false,
    proxy: {
        type: 'ajax',
        url: apiBaseUrl+'/index.php/Purchasing/Vendor/vendorList.html?api=1',
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    }
    //proxy: {
    //    type: 'memory',
    //    reader: {
    //        type: 'json',
    //        rootProperty: 'items'
    //    }
    //}
});