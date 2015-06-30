/**
 * This class is the view model for the Main view of the application.
 */
Ext.define('erp.view.main.MainModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.main',

    requires: [
        'Ext.data.TreeStore'
    ],

    data: {
        name: '首页',
        index_icon: 0xf015,
        menus: [
            {
                text: '采购',
                glyph: 0xf07a
            },
            {
                text: '商品',
                glyph: 0xf1b3
            },
            {
                text: '仓库',
                glyph: 0xf1b2
            },
            {
                text: '会员',
                glyph: 0xf007
            },
            {
                text: '营运',
                glyph: 0xf07a
            },
            {
                text: '财务',
                glyph: 0xf0ce
            },
            {
                text: '报表',
                glyph: 0xf080
            },
            {
                text: '系统',
                glyph: 0xf085
            }
        ]
    },
    getTopMenus: function () {
        return this.get("menus");
    },
    getLeftMenus: function (text) {
        var menu = [];
        if (text == "采购") {
            menu = [
                {text: "供应商管理", leaf: true,iconCls:'user',view:'suppliermng'},
                {text: "采购清单", leaf: true,view:'purchaseorderlist'},
                //{text: "收货清单", leaf: true},
                {text: "验货清单", leaf: true,view:'checkproductlist'},
                {text: "采购物流清单", leaf: true,view:'logisticslist'},
                {text: "清关流程", leaf: true,view:'passcustomlist'}
            ];
        } else if (text == "商品") {
            menu = [
                {
                    text: "基础资料", expanded: false, children: [
                    {text: "品牌管理", leaf: true},
                    {text: "颜色管理", leaf: true},
                    {text: "店铺管理", leaf: true},
                    {text: "尺码管理", leaf: true},
                    {text: "类别管理", leaf: true},
                    {text: "洗涤管理", leaf: true}
                ]
                },
                {text: "商品目录", leaf: true,view:'goodsmenu'},
                {text: "商品列表", leaf: true,view:'goodslist'},
                {text: "配送通知单", leaf: true}
            ];
        } else if (text == "仓库") {
            menu = [
                //{
                //    text: "仓库设置", expanded: false, children: [
                //    {text: "仓库", leaf: true},
                //    {text: "库位", leaf: true}
                //]
                //},
                {text: "仓库设置", leaf: true,view:'warehousesetting'},
                {text: "仓库收货", leaf: true,view:'warehousereceive'},
                {text: "进货单", leaf: true,view:'warehouseimportgoods'},
                {text: "商品配货单", leaf: true},
                {text: "商品上架", leaf: true,view:'warehouseexhibitgoods'},
                {
                    text: "仓库管理", expanded: false, children: [
                    {text: "商品移位", leaf: true,view:'warehousemovelocation'},
                    {text: "移库通知单", leaf: true,view:'warehousemovewarehousenotice'},
                    {text: "商品移库", leaf: true,view:'warehousemovewarehouse'}
                ]
                },
                {text: "库存查询", leaf: true},
                {
                    text: "仓库盘点", expanded: false, children: [
                    {text: "任务单", leaf: true},
                    {text: "盘点单", leaf: true}
                ]
                }
            ];
        } else if(text == "财务"){
            menu = [
                {text: "付款申请", leaf: true,view:'applypaylist'}
            ];
        }
        return Ext.create('Ext.data.TreeStore', {
            root: {
                expanded: true,
                children: menu
            }
        });
    }
});