/**
 * Created by Administrator on 2015-06-15.
 */
Ext.define('erp.model.SupplierModel', {
    extend: 'Ext.data.Model',

    fields: ['vendor_no', 'name', 'address'],

    /*
     Uncomment to add validation rules
     validators: {
     age: 'presence',
     name: { type: 'length', min: 2 },
     gender: { type: 'inclusion', list: ['Male', 'Female'] },
     username: [
     { type: 'exclusion', list: ['Admin', 'Operator'] },
     { type: 'format', matcher: /([a-z]+)[0-9]{2,3}/i }
     ]
     }
     */

    /*
     Uncomment to add a rest proxy that syncs data with the back end.
     proxy: {
     type: 'rest',
     url : '/users'
     }
     */
});