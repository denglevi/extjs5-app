/**
 * This class is the main view for the application. It is specified in app.js as the
 * "autoCreateViewport" property. That setting automatically applies the "viewport"
 * plugin to promote that instance of this class to the body element.
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('erp.view.main.MainController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.main',

    requires: [
        'Ext.container.Container',
        'Ext.layout.container.Accordion',
        'Ext.tree.Panel'
    ],

    requires: [
        'Ext.Array',
        'Ext.container.Container',
        'Ext.layout.container.Accordion',
        'Ext.tree.Panel',
        //'erp.view.module.purchase.PurchaseOrderList',
        //'erp.view.module.purchase.LogisticsList',
    //    'erp.view.module.purchase.PassCustomList',
    //    'erp.view.module.purchase.CheckProductList',
        'erp.view.module.financial.ApplyPayList',
    //    'erp.view.module.purchase.SupplierMng',
        'erp.view.module.goods.GoodsMenu',
        'erp.view.module.goods.GoodsList',
        'erp.view.module.goods.GoodsDeliveryOrder',
        //'erp.view.module.goods.BaseDataMng',
        'erp.view.module.warehouse.WarehouseReceive',
        'erp.view.module.warehouse.WarehouseDeliveryOrder',
        'erp.view.module.warehouse.WarehouseImportGoods',
        'erp.view.module.warehouse.WarehouseSetting',
        'erp.view.module.warehouse.WarehouseMoveLocation',
        'erp.view.module.warehouse.WarehouseMoveWarehouseNotice',
        'erp.view.module.warehouse.WarehouseMoveWarehouse',
        'erp.view.module.warehouse.WarehouseSelect',
        'erp.view.module.warehouse.WarehouseCheckTaskOrder',
        'erp.view.module.warehouse.WarehouseCheckOrder',
        'erp.view.module.warehouse.WarehouseExhibitGoods',
        'erp.view.module.operation.ResultsAllot',
        'erp.view.module.operation.PaymentMethod',
        'erp.view.module.operation.BundledSales',
        'erp.view.module.operation.SellerPositionList',
        //新增VIEW
        'erp.view.module.member.VIPCardOpenLimit',
        'erp.view.module.member.VIPCardUpdateLimit',
        'erp.view.module.member.VIPCardPutLimit',
        'erp.view.module.member.CustomerMng',
        'erp.view.module.member.VIPMng',
        'erp.view.module.member.GiftCardInfo',
        'erp.view.module.member.GiftCardReturnStandard',
        'erp.view.module.member.GiftCardSale',
        'erp.view.module.member.GiftCardPutLimit',
        'erp.view.module.member.VIPCardList',
    ],
    onMainMenu: function (el) {
        //点击不同菜单之后，左边栏显示不同的菜单
        var me = this;
        var text = el.text;
        var model = el.up("maintop").getViewModel();
        if (text == model.get("name")) return;
        model.set("name", text);
        model.set("index_icon", el.glyph);
        var mainLeft = el.up("maintop").up("main").down("mainleft");
        if (text == "首页") {
            var menus = model.get("menus");
            var menu = [];
            var i = 0;
            Ext.Array.each(menus, function (m) {
                var items = {
                    title: m.text,
                    iconCls: m.iconCls,
                    xtype: 'treepanel',
                    rootVisible: false,
                    listeners: {
                        itemdblclick: "onAddMainTab",
                        expand:function(obj){
                            var len = obj.getStore().data.length;
                            if(len > 0) return;
                            var menusStore = model.getLeftMenus(m.text);
                            obj.setStore(menusStore);
                        }
                    }
                };
                if(0 == i){
                    items.store = model.getLeftMenus(m.text);
                }
                i++;
                menu.push(items);
            });
            var items = [
                {
                    xtype: 'container',
                    layout: "accordion",
                    items: menu
                }
            ];
        } else {
            var menusStore = model.getLeftMenus(text);
            var items = [
                {
                    xtype: 'treepanel',
                    width: 200,
                    height: 150,
                    store: menusStore,
                    rootVisible: false,
                    listeners: {
                        itemdblclick: function (tree, record, item, index, e, eOpts) {
                            if(record.get("leaf")) me.addMainTab(record.get("text"),tree,record.get("view"));
                        }
                    }
                }
            ];
        }
        mainLeft.add(items);
    },
    addMainTab:function(text,tp,view){
        var tabpanel = tp.up("main").down("tabpanel");
        var res = this.hasThisTab(text,tabpanel);
        if(res.has) {
            tabpanel.setActiveTab(res.index);
            return;
        }
        console.log(view);
        var tab = {
            title:text,
            xtype:view ,
            closable:true
        }
        tabpanel.setActiveTab(tab);
    },
    onAddMainTab:function(tp, record, item, index, e, eOpts){
        if(!record.get("leaf")) return;
        var title = record.get("text");
        this.addMainTab(title,tp,record.get("view"));
    },
    hasThisTab:function(text,tabpanel){
        var items = tabpanel.items.items;
        var has = false;
        var num = -1;
        Ext.each(items,function(item,index,all){
            if(item.title == text) {
                has = true;
                num = index;
                return true;
            }
        });
        return {has:has,index:num};
    },
    // 隐藏顶部和底部的按钮事件
    hiddenTopBottom : function() {
        // 如果要操纵控件，最好的办法是根据相对路径来找到该控件，用down或up最好，尽量少用getCmp()函数。
        this.getView().down('maintop').hide();
        this.getView().down('mainbottom').hide();
        if (!this.showButton) { // 显示顶部和底部的一个控件，在顶部和底部隐藏了以后，显示在页面的最右上角
            this.showButton = Ext.widget('component', {
                glyph : 0xf013,
                view : this.getView(),
                floating : true,
                x : document.body.clientWidth - 32,
                y : 0,
                height : 4,
                width : 26,
                style : 'background-color:#cde6c7',
                listeners : {
                    el : {
                        click : function(el) {
                            var c = Ext.getCmp(el.target.id); // 取得component的id值
                            c.view.down('maintop').show();
                            c.view.down('mainbottom').show();
                            c.hide();
                        }
                    }
                }
            })
        };
        this.showButton.show();
    },
    logoutSystem:function(){
        var me = this;
        Ext.getBody().mask("正在注销...");
        Ext.Ajax.request({
            aynsc:true,
            url: apiBaseUrl + '/index.php/System/Index/logoutSystem',
            method:'POST',
            success:function(res){
                Ext.getBody().unmask();
                var data = Ext.decode(res.responseText);
                if(!data.success){
                    Ext.toast(data.msg,"系统提示");
                }

                localStorage.removeItem("is_login");
                localStorage.removeItem("user");
                //history.go(0);
                me.getView().up("viewport").destroy();
                Ext.widget("login");
            },
            failure:function(res){
                Ext.getBody().unmask();
                Ext.toast("网络请求错误,请检查网络!重试","系统提示");
            }
        })
    }
});
