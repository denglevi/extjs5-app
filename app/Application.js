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
        'WarehouseListStore','WarehouseCheckTaskOrderStore'
        // TODO: add global / shared stores here
    ],

    launch: function () {
        // TODO - Launch the application
        //Ext.create('Ext.form.Panel',{
        //    width:300,
        //    height:200,
        //    layout:'fit',
        //    renderTo:Ext.getBody(),
        //    title:'系统登录',
        //    items:[
        //        {fieldLable:'用户名',name:'username',labelAlign:'right'},
        //        {fieldLable:'密码',name:'password',labelAlign:'right'}
        //    ],
        //    buttons:[
        //        {text:'登录'}
        //    ]
        //})
    }
});
