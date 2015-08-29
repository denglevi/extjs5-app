/**
 * Created by Administrator on 2015-07-06.
 */
Ext.define('erp.view.module.operation.BundledSalesInfo', {
    extend: 'Ext.Container',
    xtype: 'bundledsalesinfo',

    requires: [
        'Ext.Ajax',
        'Ext.Array',
        'Ext.container.Container',
        'Ext.data.Store',
        'Ext.form.field.Display',
        'Ext.grid.Panel',
        'Ext.layout.container.Column',
        'Ext.layout.container.HBox',
        'Ext.panel.Panel',
        'Ext.toolbar.Toolbar',
        'erp.view.module.operation.OperationModel',
        'erp.view.module.operation.SalesActivityController'
    ],

    controller: 'salesactivity',
    viewModel: 'operation',
    initComponent: function () {
        var me = this,
            record = me.record,
            bbar = this.getBbar(),
            barContainer = this.getBarContainer(),
            infoConainer = this.getInfoContainer();
        Ext.apply(me, {
            items: [
                {
                    xtype: 'panel',
                    layout: 'column',
                    margin: 10,
                    defaults: {
                        xtype: 'displayfield',
                        labelWidth: 135,
                        labelAlign: 'right',
                        columnWidth: 0.33
                    },
                    items: [
                        {fieldLabel: '活动编号', value: record.get("docment_no")},
                        {fieldLabel: '活动名称', value: record.get("activy_name")},
                        {fieldLabel: '活动店铺', value: record.get("shops_name")},
                        {fieldLabel: '起始日期', value: record.get("start_date")},
                        {fieldLabel: '截止日期', value: record.get("end_date")},
                        {fieldLabel: '捆绑数量', value: record.get("bingding_num")},
                        {
                            fieldLabel: '捆绑方式', value: record.get("bingding_style"), renderer: function (val) {
                            if (1 == val) return "任意捆绑";
                            if (2 == val) return "不同商品范围捆绑";
                            if (3 == val) return "同款商品捆绑";
                        }
                        },
                        {fieldLabel: '换购品数量', value: record.get("redemption_num")},
                        {
                            fieldLabel: '促销类型', value: record.get("promotion_type"), renderer: function (val) {
                            if (1 == val) return "折扣";
                            if (2 == val) return "优惠价";
                            if (3 == val) return "捆绑价";
                        }
                        },
                        {fieldLabel: '分级让利', value: record.get("genlis_s") == 0 ? '否' : '是'},
                        {fieldLabel: '分级促销', value: record.get("hierarchical") == 0 ? '否' : '是'},
                        {fieldLabel: '时段约束', value: record.get("restrain_time") == 0 ? '否' : '是'},
                        {fieldLabel: '起始时段', value: record.get("statr_time")},
                        {fieldLabel: '截止时段', value: record.get("end_time")},
                        {fieldLabel: '与整单促销方案叠加', value: record.get("whole_all") == 0 ? '否' : '是'},
                        //{fieldLabel: '调价品参与促销', value: record.get("tjpcy") == 0 ? '否' : '是'},
                        {fieldLabel: 'vip积分倍率继承', value: record.get("vipintegral") == 0 ? '否' : '是'},
                        {fieldLabel: '允许使用折扣券', value: record.get("allowed_coupon") == 0 ? '否' : '是'},
                        {fieldLabel: '允许按sku设置促销品', value: record.get("sku_setupt") == 0 ? '否' : '是'},
                        //{fieldLabel: '限额卡不参与促销', value: record.get("limitcard_no") == 0 ? '否' : '是'},
                        {fieldLabel: '允许退换货', value: record.get("allowed_alteration") == 0 ? '否' : '是'},
                        {fieldLabel: '结算方式限制', value: record.get("pocler_limit") == 0 ? '否' : '是'},
                        //{fieldLabel: '买高赠低', value: record.get("buy_height_with_low") == 0 ? '否' : '是'},
                        //{fieldLabel: '设置低价品折扣', value: record.get("set_low_price_discount")},
                        {fieldLabel: '促销日有效', value: record.get("promoday") == 0 ? '否' : '是'},
                        {
                            fieldLabel: '促销日', value: record.get("day_list"), renderer: function (val) {

                            var days = val.split(','), str = [];
                            for (var i = 0; i < days.length; i++) {
                                var day = days[i];
                                if (day == 1) str.push('星期一');
                                else if (day == 2) str.push('星期二');
                                else if (day == 3) str.push('星期三');
                                else if (day == 4) str.push('星期四');
                                else if (day == 5) str.push('星期五');
                                else if (day == 6) str.push('星期六');
                                else if (day == 7) str.push('星期日');
                            }

                            return str.join(',');
                        }
                        },
                        {
                            fieldLabel: '适用对象', value: record.get("suitable_user"), renderer: function (val) {
                            if (1 == val) return "普通";
                            if (2 == val) return "VIP";
                            if ('1,2' == val) return "普通,VIP";
                        }
                        },
                    ],
                    bbar: bbar
                },
                barContainer,
                infoConainer
            ]
        });
        this.callParent();
    },
    addGoodsArea:function(){

    },
    getBbar: function () {
        var bar = ['->'],me = this;
        if (this.record.get("status") == 0) {
            return bar.concat({text: '审核', handler: me.handlerSalesPromotionStatus}
            );
        }
        if (this.record.get("status") == 1) return bar.concat({text: '终止'});
        if (this.record.get("status") == 2) return null;
    },
    getBarContainer: function () {
        var me = this;
        var vip_set=me.record.get('vipintegral');

        var items = [{text: '促销商品范围',pressed:true}];

        if(me.record.get("sku_setupt") == 1){
            items.push({itemId: 'exchange_goods', text: '促销商品信息'});
        }
        items.push({itemId: 'promotion_item',text: '换购商品',pressed:false});
        if(me.record.get("genlis_s") == 1){
            items.push({itemId: 'multi_benefit', text: '分级让利'});
        }
        if(me.record.get("hierarchical") == 1) {
            items.push({itemsId:'multi_sales',text: '分级促销'})
        };
        if(me.record.get("suitable_user").indexOf(2) != -1){
            items.push({itemId: 'vip',text: 'VIP权益'})
        };

        if(me.record.get("pocler_limit")== 1){
            items.push({itemId: 'pocler',text: '结算方式'})
        };
        return Ext.create('Ext.button.Segmented', {
            margin: 5,
            items: items,
            listeners: {
                toggle: function (container, button, pressed) {
                    var title = button.getText(),
                        grid = container.up("bundledsalesinfo").down("grid"), columns, store;
                    grid.setTitle(title);
                    var item = grid.getDockedItems('toolbar[dock="top"]'),btn = item[0].down("button");
                    btn.setHidden(false);
                    if ("促销商品范围" == title) {
                        btn.setText("新增促销商品范围");
                        store = me.goods_range_store;
                        columns = [
                            {text: '商品范围', dataIndex: 'range',flex:1},
                            {
                                text: '操作',
                                xtype: 'actioncolumn',
                                items: [
                                    {
                                        iconCls: 'delIcon',
                                        tooltip: '删除',
                                        handler: me.editGoodMenuDel  //删除方法
                                    }
                                ]
                            }
                        ];
                    }
                    else if ("促销商品信息" == title) {
                        btn.setText("导入促销商品");
                        store = me.promotion_item_store;
                        columns = [
                            {text: '商品代码', dataIndex: 'code_no'},
                            {text: '颜色', dataIndex: 'color'},
                            {text: '尺码', dataIndex: 'size'},
                            {text: '活动价', dataIndex: 'type_mon'},
                        ];
                    }
                    else if("换购商品"==title){
                        btn.setText("导入商品范围");
                        store = me.exchange_store;
                        columns = [
                            {text: '商品名称', dataIndex: 'system_suply_no',flex:1},
                            {text: '优惠价', dataIndex: 'style_money',flex:1},
                        ];
                    }
                    else if ("分级促销" == title) {
                        btn.setText("新增");
                        store = me.multi_sales_store;
                        columns = [
                            {text: '商品件数', dataIndex: 'goods_num',flex:1},
                            {text: '折扣', dataIndex: 'goods_money',flex:1},
                            {text: '备注', dataIndex: 'restu_texts',flex:1},
                            {
                                text: '操作',
                                xtype: 'actioncolumn',
                                flex: 1,
                                items: [
                                    {
                                        iconCls: 'delIcon',
                                        tooltip: '删除',
                                        disabled:true,
                                        handler: me.editSalePromoDel
                                    }
                                ]
                            }
                        ];
                    }
                    else if("分级让利"==title){

                        btn.setText("新增");
                        store = me.multi_benefit_store;
                        columns = [
                            {text: '购买件数', dataIndex: 'buy_num',flex:1},
                            {text: '让利金额', dataIndex: 'num_money',flex:1},
                            {text: '备注', dataIndex: 'restu_text',flex:1},
                            {
                                text: '操作',
                                xtype: 'actioncolumn',
                                flex: 1,
                                items: [
                                    {
                                        iconCls: 'delIcon',
                                        tooltip: '删除',
                                        disabled:true,
                                        handler: me.editGenListDel
                                    }
                                ]
                            }
                        ];
                    }
                    else if("VIP权益"==title){
                        btn.setText("新增");
                        store = me.vip_store;

                        columns = [
                            {text: '类别', dataIndex: 'vip_name',flex:1},
                            {text: '常规折扣', dataIndex: 'vip_rule_dis',flex:1},
                            {text: '促销折扣', dataIndex: 'rescu_dis',flex:1},
                            {text: '基本金额积分比', dataIndex: 'basic_int',flex:1},
                            {text: '积分倍率', dataIndex: 'intv_rate',flex:1},
                            {
                                text: '操作',
                                xtype: 'actioncolumn',
                                flex: 1,

                                items: [
                                    {
                                        iconCls: 'delIcon',
                                        tooltip: '删除',
                                        //disabled:true,
                                        handler: me.editVipListDel  //删除方法
                                    },
                                    {
                                        iconCls: 'editIcon',
                                        tooltip: '修改VIP积分倍率',
                                        hidden:vip_set=1?true:false,
                                        //disabled:true,
                                        handler: me.editVipIntegral  //删除方法
                                    },
                                ]
                            },



                        ];
                    }
                    else if ("结算方式" == title) {
                        btn.setText("新增");
                        store = me.payment_method_store;
                        columns = [
                            {text: '结算名称', dataIndex: 'cleraing_name',flex: 1},
                            {
                                text: '操作',
                                xtype: 'actioncolumn',
                                flex: 1,
                                items: [
                                    {
                                        iconCls: 'delIcon',
                                        tooltip: '删除',
                                        //disabled:true,
                                        handler: me.editCloseDel  //删除方法
                                    }
                                ]
                            }
                        ];
                    };

                    grid.reconfigure(store, columns);
                }
            }

        });
    },
    setBtnDisabled:function(){
        var items = this.down("#bar_container").items.items;
        Ext.Array.each(items,function(item){
            item.setDisabled(false);
        });
    },

    getInfoContainer: function () {
        var items = [], me = this;
        Ext.Ajax.request({
            async: false,
            method: 'POST',
            url: apiBaseUrl + '/index.php/Operations/Promotion/getBundledSalesInfo',
            params: {
                id: me.record.get("id"),
                sku_setupt: me.record.get("sku_setupt"),
                pocler_limit: me.record.get("pocler_limit")
            },
            success: function (res) {
                var json = Ext.decode(res.responseText);
                me.gridsData = json.data;
            },
            failure: function (res) {

            }
        });
        var json = [];
        if (me.record.get("sku_setupt") == 1 && me.record.get("sele_type") != null) {
            json.push({range: me.record.get("sele_type")});
        } else if (me.record.get("sku_setupt") == 0) {

            var data = me.gridsData.assist, len = data.length, str = "";

            if (len > 0) {
                var range = data[0];
                str = "品牌:" + range.brand + "<br />大类:" + range.lei + "<br />年季:" + range.year + "<br />性别:" + range.sex + "<br />小类:" + range.centen;
                json.push({range: str});
            }
            console.log(json);
        }
        /*VIP*/
        me.vip_store = Ext.create('Ext.data.Store', {
            fields: [], data: me.gridsData.vip
        });
        /*换购*/
        me.exchange_store = Ext.create('Ext.data.Store', {
            fields: [], data: me.gridsData.exchange
        });
        /*分级促销*/
        me.multi_sales_store = Ext.create('Ext.data.Store', {
            fields: [], data: me.gridsData.multi_sales
        });
        /*分级让利*/
        me.multi_benefit_store = Ext.create('Ext.data.Store', {
            fields: [], data: me.gridsData.multi_benefit
        });
        /*结算方式*/
        me.payment_method_store = Ext.create('Ext.data.Store', {
            fields: [], data: me.gridsData.payment_method
        });
        /*促销商品*/
        me.promotion_item_store = Ext.create('Ext.data.Store', {
            fields: [], data: me.gridsData.promotion_item
        });
        /*分类类别*/
        me.Classification_store = Ext.create('Ext.data.Store', {
            fields: [], data: me.gridsData.Classification
        });
        /*范围*/
        me.assist_store=Ext.create('Ext.data.Store', {
            fields: [], data: json
        });
        return {
            margin: '10 0 0 0',
            xtype: 'grid',
            title:'促销商品范围',
            flex: 1,
            columns: [
                {
                    text: '商品范围', dataIndex: 'range', flex: 1, renderer: function (value) {
                    console.log(value);
                    if (value == 0) return '通用';
                    if (value == 1) return '按尺码';
                    if (value == 2) return '按颜色';
                    if (value == 3) return '按SKU';
                    return value;
                },
                },
                {
                    text: '操作',
                    xtype: 'actioncolumn',
                    items: [
                        {
                            iconCls: 'delIcon',
                            tooltip: '删除',
                            handler: me.editCloseDel  //删除方法
                        }
                    ]
                }


            ],
            itemId: 'info_grid',
            store: me.assist_store,
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'top',
                bind:{
                    hidden:'{bundledSalesInfoEditable}'
                },
                items: ['->', {
                    text: '新增促销商品范围',
                    handler: me.btnOnClick
                }]
            }]
        };
    },
    btnOnClick:function(btn){
        var me = this;
        var btns =  me.up('bundledsalesinfo').down('segmentedbutton'),
            btn = btns.down("button[pressed=true]");

        if(btn.getText()=='促销商品范围') me.up('bundledsalesinfo').addGoodsRange();
        else if(btn.getText() == '促销商品信息') me.up('bundledsalesinfo').redemptionImportGoods();
        else if(btn.getText() == '换购商品') me.up('bundledsalesinfo').ImportRedemption();
        else if(btn.getText() == '结算方式')me.up('bundledsalesinfo').addClearForm();
        else if(btn.getText() == '分级促销') me.up('bundledsalesinfo').addPromotion();
        else if(btn.getText() == '分级让利') me.up('bundledsalesinfo').classificationBenefits();
        else if(btn.getText() == 'VIP权益') me.up('bundledsalesinfo').addVIPIntegralList();
    },
    redemptionImportGoods:function(){
        var me = this,win;
        win = Ext.create("Ext.window.Window",{
            title:'导入换购商品信息',
            width:400,
            items:[
                {
                    xtype:'form',
                    bodyPadding:10,
                    items:[
                        {
                            xtype:'fileuploadfield',
                            fieldLabel:'选择导入信息',
                            labelAlign:'right',
                            allowBlank:false,
                            anchor:'100%',
                            buttonText:'导入文件',
                            name:'promotion_goods_info'
                        }
                    ],
                    buttons: [
                        {
                            text: '重置',
                            handler: function () {
                                this.up("form").getForm().reset();
                            }
                        },
                        {
                            text: '提交',
                            formBind: true,
                            disabled: false,
                            handler: function (btn) {
                                var form = this.up("form").getForm();
                                if (form.isValid()) {
                                    form.submit({
                                        waitMsg: '正在提交...',
                                        url: apiBaseUrl + '/index.php/Operations/Promotion/importSalesPromotionGoodsInfo',
                                        method: 'POST',
                                        params:{
                                            id:me.record.get("id")
                                        },
                                        success: function (form, action) {
                                            me.promotion_item_store = Ext.create('Ext.data.Store', {
                                                fields: [], data: action.result.data
                                            });
                                            me.down("grid").setStore(me.promotion_item_store);
                                            win.destroy();
                                            Ext.toast("导入成功!", "系统提示");
                                        },
                                        failur: function (form, action) {
                                            if (action.result.msg) {
                                                Ext.toast(action.result.msg, "系统提示");
                                                return;
                                            }
                                            Ext.toast("网络请求错误,请检查网络!", "系统提示");
                                        }
                                    });
                                }
                            }
                        }
                    ]
                }
            ]
        });
        win.show();
        console.log(me.record);
    },
    //添加分级让利
    classificationBenefits:function(){
        var me = this;
        var win = Ext.create("Ext.window.Window",{
            title:'新增分级让利',
            width:400,
            modal:true,
            resizable:false,
            items:[
                {
                    xtype:'form',
                    bodyPadding:10,
                    defaults:{
                        anchor:'100%',
                        allowBlank:false,
                        labelAlign:'right',
                    },
                    buttons:[
                        {text:'重置',handler:function(){
                            this.up("form").getForm().reset();
                        }},
                        {text:'提交',formBind:true,disabled:true,handler:function(){
                            var form = this.up("form").getForm();
                            if(form.isValid()){
                                form.submit({
                                    url: apiBaseUrl + '/index.php/Operations/Promotion/addClassification',
                                    params:{
                                        pid_actvin :me.record.get("id")
                                    },
                                    waitMsg:'正在提交...',
                                    success:function(form,action){
                                        var items = me.multi_benefit_store.getData().items;
                                        var data = [];
                                        Ext.each(items,function(item){
                                            data.push(item.getData());
                                        });
                                        data.push(action.result.data);
                                        me.multi_benefit_store = Ext.create('Ext.data.Store', {
                                            fields: [], data: data
                                        });
                                        me.down("grid").setStore(me.multi_benefit_store);
                                        win.destroy();
                                    },
                                    failure:function(form,action){
                                        Ext.toast(action.result.msg,"系统提示");
                                    }
                                });
                            }
                        }}
                    ]
                }
            ]
        });
        win.down("form").add([
            {xtype: 'textfield',fieldLabel: '购买件数',displayField: 'name_en',
                regex: /^\d+$/,
                regexText: '请输入正确的数据类型',
                valueField: 'name_en',name: 'buy_num',editable: true},
            {xtype: 'textfield',fieldLabel: '让利金额',displayField: 'name',
                regex: /^\d+(\.\d{1,2})?$/,
                regexText: '请输入正确的数据类型',
                valueField: 'no',name: 'num_money',editable: true},
            {xtype: 'textareafield', fieldLabel: '备注', displayField: 'name',
                valueField: 'name', name: 'restu_text',allowBlank:true}
        ]);
        win.show();
    },
    //删除分级让利
    editGenListDel:function(grid, rowIndex, colIndex, item, e, record, row){
        var me = this;
        var vip_id = record.get("id");
        Ext.Ajax.request({
            async: true,
            url: apiBaseUrl + '/index.php/Operations/Promotion/delGenList',
            method: 'POST',
            params: {id: vip_id},
            success: function (form,action) {
                me.multi_benefit_store = Ext.create('Ext.data.Store', {
                    fields: [], data: action.result.data
                });
                me.down("grid").setStore(me.multi_benefit_store);
                win.destroy();
            },
            failure: function () {
                Ext.toast(action.result.msg,"系统提示");
            }
        });
    },
    /*添加分级促销*/
    addPromotion:function(){
        var me = this;
        var win = Ext.create("Ext.window.Window",{
            title:'新增分级让利',
            width:400,
            modal:true,
            resizable:false,
            items:[
                {
                    xtype:'form',
                    bodyPadding:10,
                    defaults:{
                        anchor:'100%',
                        allowBlank:false,
                        labelAlign:'right',
                    },
                    buttons:[
                        {text:'重置',handler:function(){
                            this.up("form").getForm().reset();
                        }},
                        {text:'提交',formBind:true,disabled:true,handler:function(){
                            var form = this.up("form").getForm();
                            if(form.isValid()){
                                form.submit({
                                    url: apiBaseUrl + '/index.php/Operations/Promotion/addSalesPromotion',
                                    params:{
                                        no_id :me.record.get("id")
                                    },
                                    waitMsg:'正在提交...',
                                    success:function(form,action){
                                        var items = me.multi_sales_store.getData().items;
                                        var data = [];
                                        Ext.each(items,function(item){
                                            data.push(item.getData());
                                        });
                                        data.push(action.result.data);
                                        me.multi_sales_store = Ext.create('Ext.data.Store', {
                                            fields: [], data: data
                                        });
                                        me.down("grid").setStore(me.multi_sales_store);
                                        win.destroy();
                                    },
                                    failure:function(form,action){
                                        Ext.toast(action.result.msg,"系统提示");
                                    }
                                });
                            }
                        }}
                    ]
                }
            ]
        });
        win.down("form").add([
            {xtype: 'textfield',fieldLabel: '购买件数',displayField: 'name_en',
                regex: /^\d+$/,
                regexText: '请输入正确的数据类型',
                valueField: 'name_en',name: 'goods_num',editable: true},
            {xtype: 'textfield',fieldLabel: '折扣',displayField: 'name',
                regex: /^$|^0.\d{2}/,
                regexText: '请输入正确的数据类型',
                valueField: 'no',name: 'goods_money',editable: true},
            {xtype: 'textareafield', fieldLabel: '备注', displayField: 'name',
                valueField: 'name', name: 'restu_texts',allowBlank:true}
        ]);
        win.show();
    },
    /*删除分级促销*/
    editSalePromoDel:function(grid, rowIndex, colIndex, item, e, record, row){
        var vip_id = record.get("id");
        Ext.Ajax.request({
            async: true,
            url: apiBaseUrl + '/index.php/Operations/Promotion/delSalePromo',
            method: 'POST',
            params: {id: vip_id},
            success: function (res) {
                me.multi_sales_store = Ext.create('Ext.data.Store', {
                    fields: [], data: action.result.data
                });
                me.down("grid").setStore(me.multi_sales_store);
                win.destroy();
            },
            failure: function () {
                Ext.toast(action.result.msg,"系统提示");
            }
        });
    },
    /*删除分级促销*/
    editSalePromoDel:function(grid, rowIndex, colIndex, item, e, record, row){
        var vip_id = record.get("id");
        Ext.Ajax.request({
            async: true,
            url: apiBaseUrl + '/index.php/Operations/Promotion/delSalePromo',
            method: 'POST',
            params: {id: vip_id},
            success: function (res) {
                //等待写刷新
            },
            failure: function () {

            }
        });
    },

    /*修改Vip积分*/
    editVipIntegral:function(grid, rowIndex, colIndex, item, e, record, row){
        var form = Ext.create("Ext.form.Panel",
            {
                bodyPadding:10,
                defaults:{
                    anchor:'100%',
                    allowBlank:false,
                    labelAlign:'right',
                },
                items:[
                    {xtype: 'hidden', name: 'id'},
                    {
                        xtype: 'textfield',
                        fieldLabel: '会员类别',
                        displayField: 'vip_name',
                        valueField: 'vip_name',
                        name: 'vip_name',
                        readOnly: true,
                        allowBlank: false,
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: '常规折扣',
                        displayField: 'vip_rule_dis',
                        valueField: 'vip_rule_dis',
                        name: 'vip_rule_dis',
                        readOnly: true,
                        allowBlank: false,

                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: '促销折扣',
                        displayField: 'rescu_dis',
                        valueField: 'rescu_dis',
                        name: 'rescu_dis',
                        allowBlank:true,
                        regex: /^$|^0.\d{2}/,
                        regexText: '请输入正确的数据类型',
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: '基本金额积分比',
                        displayField: 'basic_int',
                        valueField: 'basic_int',
                        name: 'basic_int',
                        readOnly: true,
                        allowBlank: false,

                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: '积分倍率',
                        displayField: 'intv_rate',
                        regex: /^\d+$/,
                        regexText: '请输入正确的数据类型',
                        valueField: 'intv_rate ',
                        name: 'intv_rate',
                        allowBlank:true
                    }
                ],
                buttons:[
                    {text:'提交',formBind:true,disabled:true,handler:function(){
                        var form = this.up("form").getForm();
                        if(form.isValid()){
                            form.submit({
                                url: apiBaseUrl + '/index.php/Operations/Promotion/editVipIntegral',

                                waitMsg:'正在提交...',
                                success:function(form,action){
                                    me.vip_store = Ext.create('Ext.data.Store', {
                                        fields: [], data: action.result.data
                                    });
                                    me.down("grid").setStore(me.vip_store);
                                    win.destroy();
                                },
                                failure:function(form,action){
                                    Ext.toast(action.result.msg,"系统提示");
                                }
                            });
                        }
                    }}
                ]
            }
        );

        form.loadRecord(record);
        var win = Ext.create("Ext.window.Window",{
            title:'新增VIP积分',
            width:400,
            modal:true,
            resizable:false,
            items:form
        });
        win.show();
    },
    /*删除VIP*/
    editVipListDel:function(grid, rowIndex, colIndex, item, e, record, row){
        var me=this;
        var vip_id = record.get("id");
        var win=Ext.Ajax.request({
            async: true,
            url: apiBaseUrl + '/index.php/Operations/Promotion/delvip',
            method: 'POST',
            params: {id: vip_id},
            success:function(form,action){
                me.vip_store = Ext.create('Ext.data.Store', {
                    fields: [], data: action.result.data
                });
                me.down("grid").setStore(me.vip_store);
                win.destroy();
            },
            failure:function(form,action){
                Ext.toast(action.result.msg,"系统提示");
            }
        });
    },
    /*新增Vip*/
    addVIPIntegralList:function(){
        var me = this;
        //console.log();
        var win = Ext.create("Ext.window.Window",{
            title:'新增分级让利',
            width:400,
            modal:true,
            resizable:false,
            items:[
                {
                    xtype:'form',
                    bodyPadding:10,
                    defaults:{
                        anchor:'100%',
                        allowBlank:false,
                        labelAlign:'right',
                    },
                    items:[{
                        xtype: 'checkboxgroup',
                        fieldLabel: '选择会员',
                        columns: 2,

                    }],
                    buttons:[
                        {text:'重置',handler:function(){
                            this.up("form").getForm().reset();
                        }},
                        {text:'提交',formBind:true,disabled:true,handler:function(){
                            var form = this.up("form").getForm();
                            if(form.isValid()){
                                form.submit({
                                    url: apiBaseUrl + '/index.php/Operations/Promotion/addVipList',
                                    params:{
                                        activy_main_id :me.record.get("id")
                                    },
                                    waitMsg:'正在提交...',
                                    success:function(form,action){
                                        var items = me.vip_store.getData().items;
                                        var data = [];
                                        Ext.each(items,function(item){
                                            data.push(item.getData());
                                        });
                                        data.push(action.result.data);
                                        me.vip_store = Ext.create('Ext.data.Store', {
                                            fields: [], data: data
                                        });
                                        me.down("grid").setStore(me.vip_store);
                                        win.destroy();
                                    },
                                    failure:function(form,action){
                                        Ext.toast(action.result.msg,"系统提示");
                                    }
                                });
                            }
                        }}
                    ]
                }
            ]
        });
        Ext.Ajax.request({
            async:true,
            url: apiBaseUrl + '/index.php/Operations/Promotion/getVipList',
            params: {
                id:me.record.get("id")
            },
            method:'POST',
            success:function(res){
                var json = Ext.decode(res.responseText);
                if(!json.success){
                    Ext.toast(json.msg,"系统提示");
                    return;
                }
                var item=json.data;
                win.down("checkboxgroup").add(item);
            },
            failure:function(){
                Ext.toast("请求数据错误,请检查网络,重试!","系统提示");
            }
        });
        win.show();
    },

    /*新增结算方式*/
    addClearForm:function(){
        var me = this;
        //console.log();
        var win = Ext.create("Ext.window.Window",{
            title:'新增结算方式',
            width:400,
            modal:true,
            resizable:false,
            items:[
                {
                    xtype:'form',
                    bodyPadding:10,
                    defaults:{
                        anchor:'100%',
                        allowBlank:false,
                        labelAlign:'right',
                    },
                    items:[{
                        xtype: 'checkboxgroup',
                        fieldLabel: '选择结算方式',
                        columns: 2,

                    }],
                    buttons:[
                        {text:'重置',handler:function(){
                            this.up("form").getForm().reset();
                        }},
                        {text:'提交',formBind:true,disabled:true,handler:function(){
                            var form = this.up("form").getForm();
                            if(form.isValid()){
                                form.submit({
                                    url: apiBaseUrl + '/index.php/Operations/Promotion/addColseForm',
                                    params:{
                                        activy_main_id :me.record.get("id")
                                    },
                                    waitMsg:'正在提交...',
                                    success:function(form,action){
                                        var items = me.multi_benefit_store.getData().items;
                                        var data = [];
                                        Ext.each(items,function(item){
                                            data.push(item.getData());
                                        });
                                        data.push(action.result.data);
                                        me.payment_method_store = Ext.create('Ext.data.Store', {
                                            fields: [], data: data
                                        });
                                        me.down("grid").setStore(me.payment_method_store);
                                        win.destroy();
                                    },
                                    failure:function(form,action){
                                        Ext.toast(action.result.msg,"系统提示");
                                    }
                                });
                            }
                        }}
                    ]
                }
            ]
        });
        Ext.Ajax.request({
            async:true,
            url: apiBaseUrl + '/index.php/Operations/Promotion/getClearList',
            params: {
                id:me.record.get("id")
            },
            method:'POST',
            success:function(res){
                var json = Ext.decode(res.responseText);
                if(!json.success){
                    Ext.toast(json.msg,"系统提示");
                    return;
                }
                var item=json.data;
                win.down("checkboxgroup").add(item);
            },
            failure:function(){
                Ext.toast("请求数据错误,请检查网络,重试!","系统提示");
            }
        });
        win.show();
    },

    /*新增促销商品范围*/
    /*新增促销商品范围*/
    addRange:function(){
        //var promotion = me.promotion_item_store.getData(),/*促销商品*/
        //    classification=me.Classification_store.getData(),/*分类类别*/
        //    items = data.items,len=0;
        var me = this;
        var data = me.promotion_item_store.getData(),
            items = data.items,len= 0;
        if(items != null ){
            len = items.length;
        }
        if(len >0){
            Ext.Msg.alert("系统提示","请先删除已有的商品范围");
            return;
        }
        var win = Ext.create("Ext.window.Window",{
            title:'新增促销商品范围',
            width:400,
            modal:true,
            resizable:false,
            items:[
                {
                    xtype:'form',
                    bodyPadding:10,
                    defaults:{
                        anchor:'100%',
                        allowBlank:false,
                        labelAlign:'right',
                    },
                    buttons:[
                        {text:'重置',handler:function(){
                            this.up("form").getForm().reset();
                        }},
                        {text:'提交',formBind:true,disabled:true,handler:function(){
                            var form = this.up("form").getForm();
                            if(form.isValid()){
                                form.submit({
                                    url: apiBaseUrl + '/index.php/Operations/Entire/addPromotionGoodsRange',
                                    params:{
                                        sku_set:me.record.get("sku_set"),
                                        id:me.record.get("id")
                                    },
                                    waitMsg:'正在提交...',
                                    success:function(form,action){
                                        var items = me.assist_store.getData().items;
                                        var data = [];
                                        Ext.each(items,function(item){
                                            data.push(item.getData());
                                        });
                                        data.push(action.result.data);
                                        me.assist_store = Ext.create('Ext.data.Store', {
                                            fields: [], data: data
                                        });
                                        me.down("grid").setStore(me.payment_method_store);
                                        win.destroy();
                                    },
                                    failure:function(form,action){
                                        Ext.toast("新增商品范围失败!","系统提示");
                                    }
                                });
                            }
                        }}
                    ]
                }
            ]
        });
        if(me.record.get("sku_set") == 1){
            win.down("form").add([
                {
                    xtype:'combo',
                    store:Ext.create("Ext.data.Store",{
                        fields:[],
                        data:[
                            {name:'通用',val:'0'},
                            {name:'按尺码',val:'1'},
                            {name:'按颜色',val:'2'},
                            {name:'按SKU',val:'3'}
                        ]
                    }),
                    name:'range',
                    anchor:'100%',
                    displayField:'name',
                    valueField:'val',
                    editable:false,
                    labelAlign:'right',
                    fieldLabel:'请选择商品范围'
                }
            ]);
        }
        if(me.record.get("sku_set") == 0){
            win.down("form").add([
                {xtype: 'tagfield',fieldLabel: '品牌',displayField: 'name_en',valueField: 'name_en',name: 'brand',editable: true},
                {xtype: 'tagfield',fieldLabel: '年季',displayField: 'name',valueField: 'no',name: 'year_season',editable: true},
                {xtype: 'tagfield',fieldLabel: '大类',displayField: 'name',valueField: 'base_data_id',itemId: 'large_class',name: 'large_class[]',
                    listeners: {
                        change: function () {
                            var val = this.getValue();
                            var str = val.join(',');
                            Ext.Ajax.request({
                                aysnc: true,
                                method: 'POST',
                                url: apiBaseUrl + '/index.php/Warehouse/TaskList/getExtBigClass',
                                params: {
                                    large_class: str
                                },
                                success: function (res) {
                                    var json = Ext.decode(res.responseText);
                                    console.log(json);
                                    if (!json.success) {
                                        Ext.toast(json.msg, "系统提示");
                                        return;
                                    }
                                    var store = Ext.create('Ext.data.Store', {
                                        fields: ['type', 'val'],
                                        data: json.data
                                    });
                                    var smallClassField = win.down("tagfield[name=small_class]");
                                    smallClassField.setStore(store);
                                    smallClassField.setDisabled(false);
                                    smallClassField.setHidden(false);
                                },
                                failure: function (res) {
                                    Ext.toast("请求错误,请检查网络!", "系统提示");
                                }
                            });
                        }
                    }
                },
                {xtype: 'tagfield',fieldLabel: '小类',displayField: 'name',valueField: 'name',name: 'small_class',allowBlank:true},
                {xtype: 'tagfield', fieldLabel: '性别', displayField: 'name', valueField: 'name', name: 'sex'}
            ]);
            Ext.Ajax.request({
                aysnc: true,
                method: 'POST',
                url: apiBaseUrl + '/index.php/Warehouse/TaskList/getBaseList',
                params: {
                    brand: 0,
                    year_season: 0,
                    large_class: 0,
                    sex: 0
                },
                success: function (res) {
                    var json = Ext.decode(res.responseText);
                    console.log(json);

                    if (!json.success) {
                        Ext.toast(json.msg, "系统提示");
                        return;
                    }
                    var store = Ext.create('Ext.data.Store', {
                        fields: ['type', 'val'],
                        data: json.data.brand
                    });
                    var yearSeasonStore = Ext.create('Ext.data.Store', {
                        fields: ['type', 'val'],
                        data: json.data.year_season
                    });
                    var largeClassStore = Ext.create('Ext.data.Store', {
                        fields: ['type', 'val'],
                        data: json.data.large_class
                    });
                    var sexStore = Ext.create('Ext.data.Store', {
                        fields: ['type', 'val'],
                        data: json.data.sex
                    });
                    var brandField = win.down("combo[name=brand]");
                    var yearSeasonField = win.down("tagfield[name=year_season]");
                    var largeClassField = win.down("#large_class");
                    var sexField = win.down("tagfield[name=sex]");
                    brandField.setStore(store);
                    yearSeasonField.setStore(yearSeasonStore);
                    largeClassField.setStore(largeClassStore);
                    sexField.setStore(sexStore);

                    brandField.setDisabled(false);
                    yearSeasonField.setDisabled(false);
                    largeClassField.setDisabled(false);
                    sexField.setDisabled(false);

                    brandField.setHidden(false);
                    yearSeasonField.setHidden(false);
                    largeClassField.setHidden(false);
                    sexField.setHidden(false);
                },
                failure: function (res) {
                    Ext.toast("请求错误,请检查网络!", "系统提示");
                }
            });
        }
        win.show();
    },

    /*导入换购商品*/
    ImportRedemption:function(){
        var me = this,win;
        win = Ext.create("Ext.window.Window",{
            title:'导入换购商品信息',
            width:400,
            items:[
                {
                    xtype:'form',
                    bodyPadding:10,
                    items:[
                        {
                            xtype:'fileuploadfield',
                            fieldLabel:'选择导入信息',
                            labelAlign:'right',
                            allowBlank:false,
                            anchor:'100%',
                            buttonText:'导入文件',
                            name:'promotion_goods_info'
                        }
                    ],
                    buttons: [
                        {
                            text: '重置',
                            handler: function () {
                                this.up("form").getForm().reset();
                            }
                        },
                        {
                            text: '提交',
                            formBind: true,
                            disabled: false,
                            handler: function (btn) {
                                var form = this.up("form").getForm();
                                if (form.isValid()) {
                                    form.submit({
                                        waitMsg: '正在提交...',
                                        url: apiBaseUrl + '/index.php/Operations/Promotion/importPromotionGoodsInfo',
                                        method: 'POST',
                                        params:{
                                            id:me.record.get("id")
                                        },
                                        success: function (form, action) {
                                            me.exchange_store = Ext.create('Ext.data.Store', {
                                                fields: [], data: action.result.data
                                            });
                                            me.down("grid").setStore(me.exchange_store);
                                            win.destroy();
                                            Ext.toast("导入成功!", "系统提示");
                                        },
                                        failur: function (form, action) {
                                            if (action.result.msg) {
                                                Ext.toast(action.result.msg, "系统提示");
                                                return;
                                            }
                                            Ext.toast("网络请求错误,请检查网络!", "系统提示");
                                        }
                                    });
                                }
                            }
                        }
                    ]
                }
            ]
        });
        win.show();
        console.log(me.record);
    },
    //添加商品范围
    addGoodsRange:function(){
        var me = this;
        var data = me.assist_store.getData(),
            items = data.items,len=0;
        if(items != null){
            len = items.length;
        }
        if(len >0){
            Ext.Msg.alert("系统提示","请先删除已有的商品范围");
            return;
        }
        var win = Ext.create("Ext.window.Window",{
            title:'新增促销商品范围',
            width:400,
            modal:true,
            resizable:false,
            items:[
                {
                    xtype:'form',
                    bodyPadding:10,
                    defaults:{
                        anchor:'100%',
                        allowBlank:false,
                        labelAlign:'right',
                    },
                    buttons:[
                        {text:'重置',handler:function(){
                            this.up("form").getForm().reset();
                        }},
                        {text:'提交',formBind:true,disabled:true,handler:function(){
                            var form = this.up("form").getForm();
                            if(form.isValid()){
                                form.submit({
                                    url: apiBaseUrl + '/index.php/Operations/Promotion/addPromotionGoodsRange',
                                    params:{
                                        sku_set:me.record.get("sku_setupt"),
                                        id:me.record.get("id")
                                    },
                                    waitMsg:'正在提交...',
                                    success:function(form,action){
                                        win.destroy();
                                        Ext.toast("导入成功!", "系统提示");
                                    },
                                    failur: function (form, action) {
                                        if (action.result.msg) {
                                            Ext.toast(action.result.msg, "系统提示");
                                            return;
                                        }
                                        Ext.toast("网络请求错误,请检查网络!", "系统提示");
                                    }
                                });
                            }
                        }}
                    ]
                }
            ]
        });
        if(me.record.get("sku_setupt") == 1){
            win.down("form").add([
                {
                    xtype:'combo',
                    store:Ext.create("Ext.data.Store",{
                        fields:[],
                        data:[
                            {name:'通用',val:'0'},
                            {name:'按尺码',val:'1'},
                            {name:'按颜色',val:'2'},
                            {name:'按SKU',val:'3'}
                        ]
                    }),
                    name:'range',
                    anchor:'100%',
                    displayField:'name',
                    valueField:'val',
                    editable:false,
                    labelAlign:'right',
                    fieldLabel:'请选择商品范围'
                }
            ]);
        }
        if(me.record.get("sku_setupt") == 0){
            win.down("form").add([
                {xtype: 'tagfield',itemId:'brand',fieldLabel: '品牌',displayField: 'name_en',valueField: 'id',name: 'brand[]',editable: true},
                {xtype: 'tagfield',itemId:'yeary',fieldLabel: '年季',displayField: 'name',valueField: 'id',name: 'year_season[]',editable: true},
                {xtype: 'tagfield',fieldLabel: '大类',displayField: 'name',valueField: 'base_data_id',itemId: 'large_class',name: 'large_class[]',
                    listeners: {
                        change: function () {
                            var val = this.getValue();
                            var str = val.join(',');
                            Ext.Ajax.request({
                                aysnc: true,
                                method: 'POST',
                                url: apiBaseUrl + '/index.php/Warehouse/TaskList/getExtBigClass',
                                params: {
                                    large_class: str
                                },
                                success: function (res) {
                                    var json = Ext.decode(res.responseText);
                                    console.log(json);
                                    if (!json.success) {
                                        Ext.toast(json.msg, "系统提示");
                                        return;
                                    }
                                    var store = Ext.create('Ext.data.Store', {
                                        fields: ['type', 'val'],
                                        data: json.data
                                    });
                                    var smallClassField = win.down("#min_class");
                                    smallClassField.setStore(store);
                                    smallClassField.setDisabled(false);
                                    smallClassField.setHidden(false);
                                },
                                failure: function (res) {
                                    Ext.toast("请求错误,请检查网络!", "系统提示");
                                }
                            });
                        }
                    }
                },
                {xtype: 'tagfield',itemId:'min_class',fieldLabel: '小类',displayField: 'name',valueField: 'id',name: 'small_class[]',allowBlank:true},
                {xtype: 'tagfield', itemId:'sex',fieldLabel: '性别', displayField: 'name', valueField: 'id', name: 'sex[]'}
            ]);
            Ext.Ajax.request({
                aysnc: true,
                method: 'POST',
                url: apiBaseUrl + '/index.php/Warehouse/TaskList/getBaseList',
                params: {
                    brand: 0,
                    year_season: 0,
                    large_class: 0,
                    sex: 0
                },
                success: function (res) {
                    var json = Ext.decode(res.responseText);
                    console.log(json);

                    if (!json.success) {
                        Ext.toast(json.msg, "系统提示");
                        return;
                    }
                    var store = Ext.create('Ext.data.Store', {
                        fields: ['type', 'val'],
                        data: json.data.brand
                    });
                    var yearSeasonStore = Ext.create('Ext.data.Store', {
                        fields: ['type', 'val'],
                        data: json.data.year_season
                    });
                    var largeClassStore = Ext.create('Ext.data.Store', {
                        fields: ['type', 'val'],
                        data: json.data.large_class
                    });
                    var sexStore = Ext.create('Ext.data.Store', {
                        fields: ['type', 'val'],
                        data: json.data.sex
                    });
                    var brandField = win.down("#brand");
                    var yearSeasonField = win.down("#yeary");
                    var largeClassField = win.down("#large_class");
                    var sexField = win.down("#sex");
                    brandField.setStore(store);
                    yearSeasonField.setStore(yearSeasonStore);
                    largeClassField.setStore(largeClassStore);
                    sexField.setStore(sexStore);

                    brandField.setDisabled(false);
                    yearSeasonField.setDisabled(false);
                    largeClassField.setDisabled(false);
                    sexField.setDisabled(false);

                    brandField.setHidden(false);
                    yearSeasonField.setHidden(false);
                    largeClassField.setHidden(false);
                    sexField.setHidden(false);
                },
                failure: function (res) {
                    Ext.toast("请求错误,请检查网络!", "系统提示");
                }
            });
        }
        win.show();
    },
    handlerSalesPromotionStatus:function(){
        var me = this;
        console.log(me.record);return;
        var status = me.record.get("status"),id=me.record.get("id");
        Ext.Ajax.request({
            async: false,
            method: 'POST',
            url: apiBaseUrl + '/index.php/Operations/Promotion/handlerPromotionStatus',
            params: {
                id: me.record.get("id"),
                status:parseInt(status)+1
            },
            success: function (res) {
                var json = Ext.decode(res.responseText);
                if (!json.success) {
                    Ext.toast(json.msg, "系统提示");
                    return;
                }
                me.destroy();
                //me.down("grid").setStore(Ext.create('Ext.data.Store', {fields: [], data: []}));
            },
            failure: function (res) {

            }
        });
    },
    /*删除商品范围*/
    editGoodMenuDel:function(){
        var closing_id = record.get("id");
        var sku_set=record.get("sele_type");

        Ext.Ajax.request({
            async: true,
            url: apiBaseUrl + '/index.php/Operations/Promotion/editGoodMenuDel',
            method: 'POST',
            params: {id: closing_id,sku_set:sku_set},
            success: function (res) {
                //等待写刷新
            },
            failure: function () {

            }
        });
    }
});