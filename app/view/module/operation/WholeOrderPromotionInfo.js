/**
 * Created by Administrator on 2015-08-19.
 */
Ext.define('erp.view.module.operation.WholeOrderPromotionInfo', {
    extend: 'Ext.Container',
    xtype: 'wholeorderpromotioninfo',
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
            layout: 'vbox',
            items: [
                {
                    xtype: 'panel',
                    layout: 'column',
                    margin: '10 10 0 10',
                    width: '100%',
                    defaults: {
                        xtype: 'displayfield',
                        labelWidth: 135,
                        labelAlign: 'right',
                        columnWidth: 0.33
                    },
                    items: [
                        {fieldLabel: '活动编号', value: record.get("assist_no")},
                        {fieldLabel: '活动名称', value: record.get("assist_namesion")},
                        {fieldLabel: '活动店铺', value: record.get("shops_name")},
                        {fieldLabel: '起始日期', value: record.get("start_date")},
                        {fieldLabel: '截止日期', value: record.get("end_date")},
                        {
                            fieldLabel: '促销类型', value: record.get("assist_prom_style"), renderer: function (val) {
                            if (1 == val) return "满购立减";
                            if (2 == val) return "满购送劵";
                            if (3 == val) return "满购打折";
                        }
                        },
                        {fieldLabel: '时段约束', value: record.get("is_assist_time") == 0 ? '否' : '是'},
                        {fieldLabel: '起始时段', value: record.get("statr_time")},
                        {fieldLabel: '截止时段', value: record.get("end_time")},
                        //{fieldLabel: '与整单促销方案叠加', value: record.get("whole_all") == 0 ? '否' : '是'},
                        //{fieldLabel: '调价品参与促销', value: record.get("tjpcy") == 0 ? '否' : '是'},
                        //{fieldLabel: 'vip积分倍率继承', value: record.get("vipintegral") == 0 ? '否' : '是'},
                        //{fieldLabel: '允许使用折扣券', value: record.get("allowed_coupon") == 0 ? '否' : '是'},
                        {fieldLabel: '允许按sku设置促销品', value: record.get("sku_set") == 0 ? '否' : '是'},
                        //{fieldLabel: '限额卡不参与促销', value: record.get("limitcard_no") == 0 ? '否' : '是'},
                        {fieldLabel: '允许退换货', value: record.get("allow_alteration") == 0 ? '否' : '是'},
                        {fieldLabel: '结算方式限制', value: record.get("colse_type") == 0 ? '否' : '是'},
                        //{fieldLabel: '买高赠低', value: record.get("buy_height_with_low") == 0 ? '否' : '是'},
                        //{fieldLabel: '设置低价品折扣', value: record.get("set_low_price_discount")},
                        {fieldLabel: '促销日有效', value: record.get("is_prom_day") == 0 ? '否' : '是'},
                        {
                            fieldLabel: '促销日', value: record.get("prom_day"), renderer: function (val) {

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
                            fieldLabel: '适用对象', value: record.get("aim_at_user"), renderer: function (val) {
                            if (1 == val) return "普通";
                            if (2 == val) return "VIP";
                            if ('1,2' == val) return "普通,VIP";
                        }
                        },
                        {
                            fieldLabel: '状态', value: record.get("status"), renderer: function (val) {
                            if (0 == val) return "未审核";
                            if (1 == val) return "已审核";
                            if (2 == val) return "已启动";
                            if (3 == val) return "已结束";
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
    addGoodsArea: function () {

    },
    getBbar: function () {
        var bar = ['->'], me = this;
        //if (this.record.get("sku_set") == 1) bar.push({text: '添加导入商品范围', handler: me.addGoodsArea});
        if (this.record.get("status") == 0) {
            return bar.concat({text: '审核', handler: me.checkInfo}, {
                text: '修改', handler: function () {
                    var model = me.getViewModel();
                    model.set("bundledSalesInfoEditable", !model.get("bundledSalesInfoEditable"));
                    if(this.getText() == "修改") this.setText("保存");
                    else this.setText("修改");
                }
            });
        }
        if (this.record.get("status") == 1) return bar.concat({text: '终止'});
        if (this.record.get("status") == 2) return null;
    },
    getBarContainer: function () {
        var me = this;
        var items = [{text: '促销商品范围',pressed:true}];
        if(me.record.get("sku_set") == 1){
            items.push({itemId: 'exchange_goods', text: '促销商品信息'});
        }
        if(me.record.get("colse_type") == 1){
            items.push({itemId: 'payment_method', text: '结算方式'});
        }
        items.push({itemsId: 'multi_sales', text: '分级促销'});
        //items.push({itemsId: 'multi_sales', text: '操作日志'});

        return Ext.create('Ext.button.Segmented', {
            margin: 5,
            items: items,
            listeners: {
                toggle: function (container, button, pressed) {
                    var title = button.getText(),
                        grid = container.up("wholeorderpromotioninfo").down("grid"), columns, store;
                    grid.setTitle(title);
                    var item = grid.getDockedItems('toolbar[dock="top"]'),btn = item[0].down("button");
                    btn.setHidden(false);
                    //if ("促销商品信息" == title) btn.setText("导入商品");
                    //else item[0].down("button").setText("新增");
                    //if (me.record.get("assist_prom_style") == 1) assist_prom_style = '整单立减';
                    //else if (me.record.get("assist_prom_style") == 2) assist_prom_style = '整单赠卷';
                    //else if (me.record.get("assist_prom_style") == 3) assist_prom_style = ' 整单打折';
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
                                        handler: me.editCloseDel  //删除方法
                                    }
                                ]
                            }
                        ];
                    }
                    else if ("促销商品信息" == title) {
                        btn.setText("导入促销商品");
                        store = me.goods_info;
                        console.log(me.record.get("sku_set"))
                        columns = [
                            {text: '商品代码', dataIndex: 'system_suply_no'},
                            {text: '颜色', dataIndex: 'color'},
                            {text: '折扣', dataIndex: 'discount'},
                            {text: '商品库存', dataIndex: 'num'},
                            {text: '数据状态'}
                        ];
                    }
                    else if ("分级促销" == title) {
                        btn.setText("新增");
                        store = me.multi_promotion_store;
                        columns = [
                            {text: '整单金额', dataIndex: 'promotion_money',flex:1},
                            {text: '整单立减', dataIndex: 'promotion_type',flex:1}
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
    getInfoContainer: function () {
        var items = [], me = this;
        //var sku_set = '导入商品';
        //if (me.record.get("sku_set") == 0)sku_set = "新增管理范围";
        Ext.Ajax.request({
            async: false,
            method: 'POST',
            url: apiBaseUrl + '/index.php/Operations/Entire/getBundledSalesInfo',
            params: {
                id: me.record.get("id"),
                sku_set: me.record.get("sku_set"),
                colse_type: me.record.get("colse_type")
            },
            success: function (res) {
                var res = Ext.decode(res.responseText);
                me.gridsData = res.data;
            },
            failure: function (res) {

            }
        });
console.log(me.gridsData);
        var json = [];
        if(me.record.get("sku_set") == 1){
            if(me.record.get("goods_range_info") == 0){
                json.push({range:'通用'});
            }
            if(me.record.get("goods_range_info") == 1){
                json.push({range:'按尺码'});
            }
            if(me.record.get("goods_range_info") == 2){
                json.push({range:'按颜色'});
            }
            if(me.record.get("goods_range_info") == 3){
                json.push({range:'按SKU'});
            }
        }else{
            var data = me.gridsData.assist,len = data.length,str="",range = data[0];
            str = "品牌:"+range.assist_type_brand+"<br />大类:"+range.assist_type_broad+"<br />年季:"+range.assist_type_year+"<br />性别:"+range.assist_type_sex+"<br />小雷:"+range.assist_type_subclass;
            json.push({range:str});
        }

        me.goods_range_store = Ext.create('Ext.data.Store', { //整单范围
            fields: [], data: json
        });
        me.goods_info = Ext.create('Ext.data.Store', {
            fields: [], data: me.gridsData.promotion
        });
        me.multi_promotion_store = Ext.create('Ext.data.Store', { //分级促销
            fields: [], data: me.gridsData.promotion
        });
        me.payment_method_store = Ext.create('Ext.data.Store', { //结算方式
            fields: [], data: me.gridsData.closing
        });
        return {
            xtype: 'grid',
            title: '促销商品范围',
            width: '100%',
            flex: 1,
            columns: [
                {text: '商品范围', dataIndex: 'range',flex: 1},
                {
                    text: '操作',
                    xtype: 'actioncolumn',
                    items: [
                        {
                            iconCls: 'delIcon',
                            tooltip: '删除',
                            handler: function(){
                                //Ext.Msg.alert("确定要删除此范围?","系统提示");
                                Ext.Ajax.request({
                                    async: false,
                                    method: 'POST',
                                    url: apiBaseUrl + '/index.php/Operations/Entire/delPromotionGoodsRange',
                                    params: {
                                        id: me.record.get("id"),
                                        sku_set: me.record.get("sku_set")
                                    },
                                    success: function (res) {
                                        var json = Ext.decode(res.responseText);
                                        if(!json.success){
                                            Ext.toast(json.msg,"系统提示");
                                            return;
                                        }
                                        me.down("grid").setStore(null);
                                    },
                                    failure: function (res) {

                                    }
                                });
                            }
                        }
                    ]
                }
            ],
            itemId: 'info_grid',
            store: me.goods_range_store,
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'top',
                bind: {
                    hidden: '{bundledSalesInfoEditable}'
                },
                items: ['->', {
                    text: '新增促销商品范围',
                    handler: me.btnClick,
                    scope: me
                }]
            }]
        };
    },
    btnClick: function () {
        var me = this;
        var btns = me.down('segmentedbutton'),
            btn = btns.down("button[pressed=true]");
        if (btn.getText() == '促销商品范围') me.addGoodsRange();
        else if (btn.getText() == '促销商品信息')me.importGoodsInfo();
        else if (btn.getText() == '分级促销')me.clearingForm();
        else if (btn.getText() == '结算方式')me.clearingForm();
    },
    //商品信息
    merchandiseInfo: function () {
    },
    //结算方式
    clearingForm: function () {
        var url = apiBaseUrl + '/index.php/Operations/Entire/postClearingForm';
        var form = this.addClearingForm(url);
        var win = Ext.create('Ext.window.Window', {
            modal: true,
            resizable: false,
            width: 600,
            layout: 'fit',
            title: '新增结算方式',
            items: [form]
        });
        form.on("postClearingForm", function () {
            win.destroy();
            //var store = Ext.StoreManager.lookup("CouponSortList"); //CouponSortList:首页的ajax交互数据，重新加载一次此操作    是别名
            if (store !== null) store.load();
        });
        win.show();
    },
    //分级促销
    hierarchicalPromotion: function () {
        var url = apiBaseUrl + '/index.php/Operations/Entire/postHierarchical ';
        var form = this.addWholeSortTyprFroms(url);
        var win = Ext.create('Ext.window.Window', {
            modal: true,
            resizable: false,
            width: 600,
            layout: 'fit',
            title: "新增分级促销数据",
            items: [form]
        });
        form.on("postHierarchical", function () {
            win.destroy();
            //var store = Ext.StoreManager.lookup("CouponSortList"); //CouponSortList:首页的ajax交互数据，重新加载一次此操作    是别名
            if (store !== null) store.load();
        });
        win.show();
    },
    //分级促销的表单
    addWholeSortTyprFroms: function (url) {
        var me = this, id = me.record.get('id'),
            assist_prom_style = me.record.get('assist_prom_style');
        if (assist_prom_style == 1) assist_prom_style = '整单立减';
        else if (assist_prom_style == 2) assist_prom_style = '整单赠卷';
        else if (assist_prom_style == 3)assist_prom_style = ' 整单打折';
        var form = Ext.create('Ext.form.Panel', {
            layout: 'column',
            bodyPadding: 10,
            defaults: {
                xtype: 'textfield',
                columnWidth: 0.5,
                labelWidth: 70,
                labelAlign: 'right',
                anchor: '100%',
                margin: 5,
                minValue: 0
            },
            items: [
                {name: 'main_id', xtype: 'hidden', value: id},
                {fieldLabel: '整单金额', name: 'promotion_money', allowBlank: false},
                {fieldLabel: assist_prom_style, name: 'promotion_type', allowBlank: false}
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
                                url: url,
                                method: 'POST',
                                success: function (form, action) {
                                    btn.up("form").fireEvent("postHierarchical");
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
        });
        return form;
    },
    //删除结算方式
    editCloseDel: function (grid, rowIndex, colIndex, item, e, record, row) {
        var closing_id = record.get("id");
        Ext.Ajax.request({
            async: true,
            url: apiBaseUrl + '/index.php/Operations/Entire/delClosingInfo',
            method: 'POST',
            params: {id: closing_id},
            success: function (res) {
                //等待写刷新
            },
            failure: function () {

            }
        });
    },
    //添加商品范围
    addGoodsRange:function(){
        var me = this;
        var data = me.goods_range_store.getData(),
            items = data.items,len=0;
        console.log(items);
        if(items != null){
            len = items.length;
        }
        if(len >0){
            Ext.Msg.alert("系统提示","请先删除已有的商品范围");
            return;
        }
        console.log(me.record,me.goods_range_store.getData().items);
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
                            var form = this.up("form").getForm(),vals = form.getValues();
                            console.log(form.getValues());
                            if(form.isValid()){
                                form.submit({
                                    url: apiBaseUrl + '/index.php/Operations/Entire/addPromotionGoodsRange',
                                    params:{
                                        sku_set:me.record.get("sku_set"),
                                        id:me.record.get("id")
                                    },
                                    waitMsg:'正在提交...',
                                    success:function(form,action){
                                        console.log(action.result);
                                        if(!action.result.success){
                                            Ext.toast(action.result.msg,"系统提示");
                                            return;
                                        }
                                        var store = null;
                                        if(me.record.get("sku_set")==1){
                                            store = Ext.create("Ext.data.Store",{
                                                fields:[],
                                                    data:[{range:vals.range}]
                                            });
                                            me.down("grid").setStore(store);
                                        }

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
                {xtype: 'tagfield',fieldLabel: '品牌',itemId: 'brand',displayField: 'name_en',valueField: 'base_data_id',name: 'brand[]',editable: true},
                {xtype: 'tagfield',fieldLabel: '年季',itemId: 'year_season',displayField: 'name',valueField: 'base_data_id',name: 'year_season[]',editable: true},
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
                                    var smallClassField = win.down("#small_class");
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
                {xtype: 'tagfield',fieldLabel: '小类',itemId: 'small_class',displayField: 'name',valueField: 'base_data_id',name: 'small_class[]',allowBlank:true},
                {xtype: 'tagfield', fieldLabel: '性别',itemId: 'sex', displayField: 'name', valueField: 'base_data_id', name: 'sex[]'}
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
                    var yearSeasonField = win.down("#year_season");
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
    //导入商品信息
    importGoodsInfo:function(){
        var me = this;
        console.log(me.record);
    }
});