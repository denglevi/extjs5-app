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
    stores: [
        'SupplierStore', 'PurchaseOrderListStore', 'PurchaseOrderStore','CheckProductListStore',
        'LogisticsListStore','PassCustomListStore','WarehouseReceiveStore','GoodsMenuStore','GoodsListStore',
        'WarehouseListStore','WarehouseCheckTaskOrderStore','WarehouseCheckOrderStore','SellerPositionListStore',
        'SellerListStore','ResultAllotListStore','PaymentMethodStore','BundledSalesListStore'
        // TODO: add global / shared stores here
    ],

    launch: function () {
        Ext.get("splash").remove();
        // TODO - Launch the application
        Ext.create('Ext.form.Panel',{
            title: 'Login',
            frame:true,
            width: 320,
            bodyPadding: 15,
            defaultType: 'textfield',
            renderTo:Ext.getBody(),
            items: [{
                allowBlank: false,
                fieldLabel: 'User ID',
                name: 'user',
                emptyText: 'user id'
            }, {
                allowBlank: false,
                fieldLabel: 'Password',
                name: 'pass',
                emptyText: 'password',
                inputType: 'password'
            }, {
                xtype:'checkbox',
                fieldLabel: 'Remember me',
                name: 'remember'
            }],

            buttons: [
                { text:'Register' },
                { text:'Login' }
            ],
            style: { //formpanel位置
                marginRight: 'auto', //
                marginLeft: 'auto',
                marginTop: '150px',
                marginBottom: 'auto'
            }
        });
    }
});
