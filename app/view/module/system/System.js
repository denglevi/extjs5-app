/**
 * Created by denglevi on 15-6-14.
 */
Ext.define('erp.view.module.system.System', {
    extend: 'Ext.Container',

    requires: [
        'erp.view.module.system.SystemController',
        'erp.view.module.system.SystemModel'
    ],

    /*
    Uncomment to give this component an xtype
    xtype: 'system',
    */

    viewModel: {
        type: 'system'
    },
    controller: 'system',

    items: [
        /* include child components here */
    ]
});