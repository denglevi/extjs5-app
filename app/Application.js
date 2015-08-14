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
        'erp.view.login.Login',
        'erp.view.main.Main',
        'Ext.window.Toast'
    ],

    name: 'erp',
    //controllers: [
    //    'Root'
    //    // TODO: add controllers here
    //],
    stores: [
        'SupplierStore','PurchaseOrderListStore','PurchaseOrderStore','CheckProductListStore',
        'LogisticsListStore','PassCustomListStore','WarehouseReceiveStore','GoodsMenuStore','GoodsListStore',
        'WarehouseListStore','WarehouseCheckTaskOrderStore','WarehouseCheckOrderStore','SellerPositionListStore','WarehouseSelectStore',
        'SellerListStore','ResultAllotListStore','PaymentMethodStore','BundledSalesListStore','ShopStore',
        'VIPCardListStore','VIPCardOpenLimitStore','VIPCardUpdateLimitStore','VIPCardPutLimitStore',
        'CustomerMngStore','VIPCardListStore','GiftCardInfoStore','GiftCardReturnStandardStore',
        'GiftCardSaleStore','GiftCardPutLimitStore','VIPListStore','GoodsDeliveryNoticeStore','WarehouseDeliveryOrderStore',
        'GroupStore','RoleStore','ModuleStore','UserStore','SystemLogStore','AuthorityStore'
        // TODO: add global / shared stores here
    ],
    //views:['erp.view.login.Login','erp.view.main.Main'],

    launch: function () {
        //var package = true;
        //if(!package){
        //    Ext.gui = require('nw.gui');
        //    var win = Ext.gui.Window.get();
        //    win.on('close', function() {
        //        this.hide();
        //        localStorage.removeItem("is_login");
        //        localStorage.removeItem("user");
        //        this.close(true);
        //    });
        //}
        if(version == "desktop"){
            /*
             桌面版代码注释
             */
            ipc.send("close-splash-screen","ping");
        }else{
            /*
             WEB版代码注释
             */
            if(localStorage.getItem("is_login") == 1){
                var username = localStorage.getItem("user");
                Ext.widget("main",{username:username});
            }
        }
        
        Ext.widget("login");
    }
});
