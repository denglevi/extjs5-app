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
                //glyph: 0xf07a,
                iconCls:'purchaseIcon',
                hidden:false,
                action:'view_purchase_module'
            },
            {
                text: '商品',
                //glyph: 0xf1b3
                iconCls:'goodsIcon',
                hidden:false,
                action:'view_goods_module'
            },
            {
                text: '仓库',
                //glyph: 0xf1b2
                iconCls:'warehouseIcon',
                hidden:false,
                action:'view_warehouse_module'
            },
            {
                text: '会员',
                //glyph: 0xf007
                iconCls:'memberIcon',
                hidden:false,
                action:'view_member_module'
            },
            {
                text: '营运',
                //glyph: 0xf07a
                iconCls:'operationIcon',
                hidden:false,
                action:'view_operation_module'
            },
            {
                text: '报表',
                //glyph: 0xf0ce
                iconCls:'financialIcon',
                hidden:false,
                action:'view_report_module'
            },
            //{
            //    text: '报表',
            //    //glyph: 0xf080
            //    iconCls:'reportIcon',
            //    hidden:true,
            //    action:'view_purchase_model'
            //},
            {
                text: '系统',
                //glyph: 0xf085
                iconCls:'systemIcon',
                hidden:false,
                action:'view_system_module'
            }
        ],
        systemMngMenus:[
            {text: "用户管理", leaf: true, view: 'usermng'},
            {text: "日志管理", leaf: true,view: 'systemlogmng'},
            {text: "模块管理", leaf: true,view: 'modulemng'},
            {
                text: "权限管理", leaf: false, children: [
                {text: "权限设置", leaf: true, view:  'authoritymng'},
                {text: "分配权限", leaf: true,view: 'authoritysetting'}
            ]
            },
            {text: "部门管理", leaf: true,view: 'groupmng'},
            {text: "角色管理", leaf: true,view: 'rolemng'}
        ],
        purchaseMngMenus:[
            {text: "供应商管理", leaf: true,view: 'suppliermng',iconCls:'userIcon'},
            {text: "采购清单", leaf: true, view: 'purchaseorderlist'},
            //{text: "收货清单", leaf: true},
            {text: "验货清单", leaf: true, view: 'checkproductlist'},
            {text: "采购物流清单", leaf: true, view: 'logisticslist'},
            {text: "清关流程", leaf: true, view: 'passcustomlist'}
        ],
        goodsMngMenus:[
            {
                text: "基础资料",leaf:true,view:'basedatamng'
                //children: [
                //    {text: "品牌管理", leaf: true},
                //    {text: "颜色管理", leaf: true},
                //    {text: "店铺管理", leaf: true},
                //    {text: "尺码管理", leaf: true},
                //    {text: "类别管理", leaf: true},
                //    {text: "洗涤管理", leaf: true}
                //]
            },
            {text: "商品目录", leaf: true, view: 'goodsmenu'},
            {text: "商品列表", leaf: true, view: 'goodslist'},
            {text: "配送通知单", leaf: true,view:'goodsdeliveryorder'}
        ],
        warehouseMngMenus:[
            //{
            //    text: "仓库设置", expanded: false, children: [
            //    {text: "仓库", leaf: true},
            //    {text: "库位", leaf: true}
            //]
            //},
            {text: "仓库设置", leaf: true, view: 'warehousesetting'},
            {text: "仓库收货", leaf: true, view: 'warehousereceive'},
            {text: "进货单", leaf: true, view: 'warehouseimportgoods'},
            {text: "商品配货单", leaf: true,view:'warehousedeliveryorder'},
            {text: "商品上架", leaf: true, view: 'warehouseexhibitgoods'},
            {
                text: "仓库管理", expanded: false, children: [
                {text: "商品移位", leaf: true, view: 'warehousemovelocation'},
                {text: "移库通知单", leaf: true, view: 'warehousemovewarehousenotice'},
                {text: "商品移库", leaf: true, view: 'warehousemovewarehouse'}
            ]
            },
            {text: "库存查询", leaf: true, view: 'warehouseselect'},
            {
                text: "仓库盘点", expanded: false, children: [
                {text: "任务单", leaf: true, view: 'warehousechecktaskorder'},
                {text: "盘点单", leaf: true, view: 'warehousecheckorder'}
            ]
            }
        ],
        operateMngMenus:[
            {text: "店员管理", leaf: true, view: 'sellerpositionlist'},
            {text: "店铺管理", leaf: true, view: 'shopmng'},
            {text: "业绩分配", leaf: true, view: 'resultsallot'},
            {
                text: "活动促销", leaf: false, children: [
                {text: "捆绑促销", leaf: true, view: 'bundledsales'},
                {text: "整单促销", leaf: true}
            ]
            },
            {text: "结算方式", leaf: true, view: 'paymentmethod'}
        ],
        memberMngMenus:[
            {
                text: "VIP资料", leaf: false, children: [
                {text: "VIP卡类别", leaf: true, view: 'vipcardlist'},
                {text: "VIP会员发卡规则", leaf: true,view:'vipcardopenlimit'},
                {text: "VIP会员升级规则", leaf: true,view:'vipcardupdatelimit'},
                {text: "VIP会员卡制成投放单", leaf: true,view:'vipcardputlimit'}
            ]
            },
            {text: "顾客管理", leaf: true,view:'customermng'},
            {text: "会员管理", leaf: true,view:'vipmng'},
            {
                text: "礼品卡", leaf: false, children: [
                {text: "礼品卡资料", leaf: true, view: 'giftcardinfo'},
                {text: "礼品卡返利标准", leaf: true,view:'giftcardreturnstandard'},
                {text: "礼品卡销售", leaf: true,view:'giftcardsale'},
                {text: "礼品卡制成投放单", leaf: true,view:'giftcardputlimit'}
            ]
            }
        ],
        financialMngMenus:[
            {text: "付款申请", leaf: true, view: 'applypaylist'}
        ]
    },
    getTopMenus: function () {
        var menus = this.get("menus");
        var user_info = localStorage.getItem("userInfo");
        if(user_info != null){
            var userInfo = Ext.decode(user_info),
                actions =userInfo.role_info.actions,
                actionStr = actions.join(","),
                len = menus.length,
                arr = [];
            for(var i=0;i<len;i++){
                var menu = menus[i];
                if(actionStr.indexOf(menu.action) == -1) continue;
                arr.push(menu);
            }
        }
        return arr;
    },
    getLeftMenus: function (text) {
        var menu = [];
        if (text == "采购") {
            menu = this.get("purchaseMngMenus");
        } else if (text == "商品") {
            menu = this.get("goodsMngMenus");
        } else if (text == "仓库") {
            menu = this.get("warehouseMngMenus");
        } else if (text == "报表") {
            menu = this.get("financialMngMenus");
        } else if (text == "营运") {
            menu = this.get("operateMngMenus");
        } else if (text == "会员") {
            menu = this.get("memberMngMenus");
        } else if(text == "系统"){
            menu = this.get("systemMngMenus");
        }
        return Ext.create('Ext.data.TreeStore', {
            root: {
                expanded: true,
                children: menu
            }
        });
    }
});