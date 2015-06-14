/**
 * Created by denglevi on 15-6-14.
 */
Ext.define('erp.view.module.goods.Goods', {
    extend: 'Ext.Container',

    requires: [
        'erp.view.module.goods.GoodsController',
        'erp.view.module.goods.GoodsModel'
    ],

    /*
    Uncomment to give this component an xtype
    xtype: 'goods',
    */

    viewModel: {
        type: 'goods'
    },
    controller: 'goods',

    items: [
        /* include child components here */
    ]
});