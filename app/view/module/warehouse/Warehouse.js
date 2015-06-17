/**
 * Created by denglevi on 15-6-14.
 */
Ext.define('erp.view.module.warehouse.Warehouse', {
    extend: 'Ext.Container',

    requires: [
        'erp.view.module.warehouse.WarehouseController',
        'erp.view.module.warehouse.WarehouseModel'
    ],

    /*
    Uncomment to give this component an xtype
    xtype: 'warehouse',
    */

    viewModel: {
        type: 'warehouse'
    },
    controller: 'warehouse',

    items: [
        /* include child components here */
    ]
});