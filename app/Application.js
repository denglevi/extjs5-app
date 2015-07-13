/**
 * The main application class. An instance of this class is created by app.js when it calls
 * Ext.application(). This is the ideal place to handle application launch and initialization
 * details.
 */
Ext.define('erp.Application', {
    extend: 'Ext.app.Application',

    requires: [
        'Ext.form.Panel',
        'Ext.layout.container.Fit',
    ],

    name: 'erp',
    //controllers: [
    //    'Root'
    //    // TODO: add controllers here
    //],
    stores: [
        'SupplierStore', 'PurchaseOrderListStore', 'PurchaseOrderStore','CheckProductListStore',
        'LogisticsListStore','PassCustomListStore','WarehouseReceiveStore','GoodsMenuStore','GoodsListStore',
        'WarehouseListStore','WarehouseCheckTaskOrderStore','WarehouseCheckOrderStore','SellerPositionListStore',
        'SellerListStore','ResultAllotListStore','PaymentMethodStore','BundledSalesListStore',
        'VIPCardListStore'
        // TODO: add global / shared stores here
    ],

    launch: function () {

    }
});
