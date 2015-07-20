/**
 * Created by denglevi on 15-6-14.
 */
Ext.define('erp.view.module.goods.GoodsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.goods',

    requires: [
        'Ext.Ajax',
        'Ext.button.Button',
        'Ext.button.Segmented',
        'Ext.container.Container',
        'Ext.data.Store',
        'Ext.data.StoreManager',
        'Ext.data.proxy.Ajax',
        'Ext.data.reader.Json',
        'Ext.form.Panel',
        'Ext.form.action.Action',
        'Ext.form.field.ComboBox',
        'Ext.form.field.Date',
        'Ext.form.field.Display',
        'Ext.form.field.File',
        'Ext.form.field.Text',
        'Ext.grid.Panel',
        'Ext.layout.container.Anchor',
        'Ext.layout.container.Column',
        'Ext.layout.container.VBox',
        'Ext.panel.Panel',
        'Ext.toolbar.Fill',
        'Ext.toolbar.Toolbar',
        'Ext.window.Window',
        'erp.view.window.GoodsInfoWin',
        'erp.view.window.GoodsMenuInfoWin'
    ],

    /**
     * Called when the view is created
     */
    init: function () {

    },
    importGoodsMenu: function (import_btn) {
        Ext.create('Ext.window.Window', {
            title: '导入商品资料',
            bodyPadding: 20,
            items: [
                {
                    xtype: 'form',
                    method: 'POST',
                    url: apiBaseUrl + '/index.php/Commodity/CommodityMenu/importGoodsMenuInfo',
                    items: [
                        {
                            xtype: 'filefield',
                            buttonText: '上传商品资料',
                            name: 'goods_menu',
                            allowBlank: false,
                            listeners: {
                                change: function (obj) {
                                    var val = this.getValue();
                                    this.up("form").getForm().submit({
                                        waitMsg: '正在导入商品信息...',
                                        success: function (form, action) {
                                            obj.up("form").up("window").destroy();
                                            Ext.Msg.alert('系统提示', "导入成功");
                                            import_btn.up("grid").getStore().load();
                                        },
                                        failure: function (form, action) {
                                            switch (action.failureType) {
                                                case Ext.form.action.Action.CLIENT_INVALID:
                                                    Ext.Msg.alert('系统提示', '表单验证错误');
                                                    break;
                                                case Ext.form.action.Action.CONNECT_FAILURE:
                                                    Ext.Msg.alert('系统提示', '远程连接错误，请稍后重试');
                                                    break;
                                                case Ext.form.action.Action.SERVER_INVALID:
                                                    Ext.Msg.alert('系统提示', action.result.msg);
                                            }
                                        }
                                    });
                                }
                            }
                        }
                    ]
                }
            ]
        }).show();
    },
    deleteGoodsMenu: function () {

    },
    onGoodsMenuGridDblClick: function (gp, record) {
        var menu_id = record.get("id"), res;
        console.log(menu_id);
        Ext.Ajax.request({
            async: false,
            method: 'POST',
            url: apiBaseUrl + '/index.php/Commodity/CommodityMenu/getGoodsMenuInfo',
            params: {
                id: menu_id
            },
            success: function (response) {
                res = Ext.decode(response.responseText);
            }
        });
        if (!res.success) return;
        console.log(res.data);
        Ext.create('erp.view.window.GoodsMenuInfoWin', {
            title: "款号详情",
            info: res.data
        }).show();
    },
    onGoodListGridDblClick: function (gp, record) {
        var id = record.get("id"), res;
        Ext.Ajax.request({
            async: false,
            method: 'POST',
            url: apiBaseUrl + '/index.php/Commodity/CommodityMenu/getGoodsInfo',
            params: {
                id: id
            },
            success: function (response) {
                //myMask.destroy( );
                res = Ext.decode(response.responseText);
            }
        });
        if (!res.success) return;
        Ext.create('erp.view.window.GoodsInfoWin', {
            title: "商品详情",
            info: res.data
        }).show();
    },
    searchMenu: function () {
        var me = this.getView();
        var system_style_no = me.down("textfield[name=system_style_no]").getValue();
        var supply_style_no = me.down("textfield[name=supply_style_no]").getValue();

        me.getStore().setProxy({
            type: 'ajax',
            url: apiBaseUrl + '/index.php/Commodity/CommodityMenu/getGoodsMenuList?system_style_no=' + system_style_no + '&supply_style_no=' + supply_style_no,
            reader: {
                type: 'json',
                rootProperty: 'data',
                totalProperty: 'total'
            }
        });
        me.getStore().load();
    },
    searchGoods: function () {
        var model = this.getViewModel();

        var system_style_no = model.get("system_style_no");
        var no = model.get("no");
        var status = model.get("status");
        var id = model.get("import_id")
        var store = this.lookupReference('goods_list_grid').getStore();

        store.setProxy({
            type: 'ajax',
            url: apiBaseUrl + '/index.php/Commodity/CommodityMenu/getGoodsInfoList?id=' + id + '&system_style_no=' + system_style_no + '&no=' + no + '&status=' + status,
            reader: {
                type: 'json',
                rootProperty: 'data',
                totalProperty: 'total'
            }
        });
        store.load();
    },
    addGoodsDeliveryNotice: function () {
        var win = Ext.create('Ext.window.Window', {
            width: 600,
            modal: true,
            title: '新增配货通知单',
            layout: 'fit',
            items: [{
                xtype: 'form',
                bodyPadding: 10,
                layout: 'column',
                defaults: {
                    margin: 5,
                    xtype: 'textfield',
                    labelAlign: 'right',
                    labelWidth: 70,
                    columnWidth: 0.5,
                    anchor: '100%',
                    allowBlank: false
                },
                items: [
                    {
                        fieldLabel: '商店',
                        name: 'store',
                        xtype: 'combo',
                        disabled: true,
                        valueField: 'id',
                        displayField: 'shops_name',
                        editable: false
                    },
                    {
                        fieldLabel: '仓库',
                        name: 'warehouse_id',
                        xtype: 'combo',
                        disabled: true,
                        valueField: 'id',
                        displayField: 'storage_name',
                        editable: false
                    },
                    {fieldLabel: '订单号', name: 'order_no'},
                    {fieldLabel: '发货类型', name: 'send_type'},
                    {fieldLabel: '价格选定', name: 'price_select'},
                    {fieldLabel: '折扣', name: 'discount'},
                    {
                        fieldLabel: '预配货日',
                        name: 'expected_send_date',
                        xtype: 'datefield',
                        format: 'Y-m-d',
                        value: new Date(),
                        editable: false
                    },
                    {
                        fieldLabel: '品牌',
                        name: 'brand_id',
                        xtype: 'combo',
                        disabled: true,
                        valueField: 'id',
                        displayField: 'name_en',
                        editable: false
                    },
                    {fieldLabel: '渠道', name: 'challne'}
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
                                    url: apiBaseUrl + '/index.php/Commodity/Distribution/addDeliveryNotice',
                                    method: 'POST',
                                    success: function (form, action) {
                                        win.destroy();
                                        var store = Ext.StoreManager.lookup("GoodsDeliveryNoticeStore");
                                        if (store !== null) store.load();
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
            }]
        });
        Ext.Ajax.request({
            async: true,
            url: apiBaseUrl + '/index.php/Commodity/Distribution/getBaseData',
            method: 'POST',
            params: {
                shop: 1,
                warehouse: 1,
                brand: 1
            },
            success: function (res) {
                var json = Ext.decode(res.responseText), data = json.data;
                if (data.shop === undefined || data.warehouse === undefined || data.brand === undefined) {
                    Ext.toast("数据获取错误,请重试!", "系统提示");
                    return;
                }
                var form = win.down("form");
                var shop = form.down("combo[name=store]"),
                    warehouse = form.down("combo[name=warehouse_id]"),
                    brand = form.down("combo[name=brand_id]"),
                    shop_store = Ext.create('Ext.data.Store', {
                        fields: [],
                        data: data.shop
                    }),
                    warehouse_store = Ext.create('Ext.data.Store', {
                        fields: [],
                        data: data.warehouse
                    }),
                    brand_store = Ext.create('Ext.data.Store', {
                        fields: [],
                        data: data.brand
                    })
                    ;

                shop.setDisabled(false);
                warehouse.setDisabled(false);
                brand.setDisabled(false);
                shop.setStore(shop_store);
                warehouse.setStore(warehouse_store);
                brand.setStore(brand_store);
            },
            failure: function () {
                Ext.toast("服务请求失败,请稍后再试!", "系统提示");
            }
        });
        win.show();
    },
    getNoticeDetailItems: function () {
        var id = this.getViewModel().get("goods_delivery_notice_id");
        this.products = [];
        this.logs = [];
        var me = this;
        var productStore = Ext.create("Ext.data.Store",{
            fields:[],
            autoLoad:true,
            storeId:'delivery_goods_notice_store',
            proxy:{
                type:'ajax',
                url:apiBaseUrl + '/index.php/Commodity/Distribution/getDeliveryNoticeGoods?id='+id,
                reader:{
                    type:'json',
                    rootProperty:'data'
                }
            }
        });
        return [{
            xtype: 'panel',
            name: "info",
            bind: {
                data: '{notice_info}'
            },
            margin: '30 30 0 30',
            tpl: new Ext.XTemplate(
                '<div class="col-md-12">',
                '<div class="col-md-4">通知单号：{notice_no}</div>',
                '<div class="col-md-4">商店：{store}</div>',
                '<div class="col-md-4">仓库：{warehouse_id}</div>',
                '</div>',
                '<div class="col-md-12">',
                '<div class="col-md-4">订单号：{order_no}</div>',
                '<div class="col-md-4">发货类型：{send_type}</div>',
                '<div class="col-md-4">价格选定：{price_select}</div>',
                '</div>',
                '<div class="col-md-12">',
                '<div class="col-md-4">折扣：{discount}</div>',
                '<div class="col-md-4">预配货日：{expected_send_date}</div>',
                '<div class="col-md-4">品牌：{brand_id}</div>',
                '</div>',
                '<div class="col-md-12">',
                '<div class="col-md-4">渠道：{challne}</div>',
                '</div>'
            ),
            dockedItems:{
                dock:'bottom',
                items:[
                    {
                        xtype:"toolbar",
                        bind:{
                            hidden:'{notice_status}'
                        },
                        items:[
                            '->',
                            {
                                xtype:'form',
                                items:[
                                    {
                                        buttonOnly:true,
                                        hideLabel: true,
                                        width:82,
                                        buttonConfig:{
                                            text: '导入数据',
                                            margin:'5 0 0 0',
                                            iconCls: 'importIcon',
                                            ui:'default'
                                        },
                                        xtype:'fileuploadfield',
                                        name:'delivery_file',
                                        listeners:{
                                            change:function(btn,val){
                                                var form = this.up("form").getForm();
                                                form.submit({
                                                    waitMsg:'正在导入商品信息...',
                                                    url:apiBaseUrl + '/index.php/Commodity/Distribution/importDeliveryGoods',
                                                    method:'POST',
                                                    success:function(form,action){
                                                        if(!action.result.success){
                                                            Ext.toast(action.result.msg,"系统提示");
                                                            return;
                                                        }
                                                        var data = action.result.data,
                                                            len = data.length,
                                                            tmp_arr = [];
                                                        for(var i=0;i<len;i++){
                                                            var product = data[i];
                                                            product.mark = 1;
                                                            tmp_arr.push(product);
                                                        }

                                                        me.products = me.products.concat(tmp_arr);
                                                        var store = me.lookupReference('goods_delivery_info_grid').getStore();
                                                        store.insert(0,tmp_arr);
                                                    },
                                                    failure:function(form,action){
                                                        if(action.response.status == 200){
                                                            Ext.toast(action.result.msg,"系统提示");
                                                            return;
                                                        }
                                                        Ext.toast("服务请求错误,请重试!","系统提示");
                                                    }
                                                });
                                            }
                                        }
                                    }
                                ]
                            }
                    ,{
                                text:'保存',
                                handler:me.saveDeliveryGoodsNotice,
                                scope:me
                            },{
                                text:'申请配货',
                                handler:me.saveDeliveryGoodsNotice,
                                scope:me
                            }
                        ]
                    }
                ]
            }
        }, {
            xtype: 'segmentedbutton',
            defaults: {
                margin: 5
            },
            items: [
                {text: '商品详细信息', pressed: true},
                //{text: '操作日志'}
            ],
            listeners: {
                toggle: function (container, button, pressed) {
                    var text = button.getText(),
                        columns, store,
                        grid = container.up("panel").down("grid");
                    if ("商品详细信息" == text) {
                        store = Ext.data.StoreManager.lookup("delivery_goods_notice_store");
                        columns = [
                            {text: '商品代码', dataIndex: 'system_style_no', flex: 1},
                            {text: '国际码', dataIndex: 'supply_style_no', flex: 1},
                            {text: '名称', dataIndex: 'name', flex: 1},
                            {text: '颜色', dataIndex: 'color', flex: 1},
                            {text: '尺码', dataIndex: 'size', flex: 1},
                            {text: '数量', dataIndex: 'num', flex: 1},
                            {text: '库存数', dataIndex: 'warehouse_num', flex: 1}
                        ];
                    } else {
                        columns = [
                            {text: '操作类型', dataIndex: 'no', flex: 1},
                            {text: '操作人', dataIndex: 'no', flex: 1},
                            {text: '操作时间', dataIndex: 'no', flex: 1}
                        ];
                    }
                    grid.setTitle(text);
                    grid.reconfigure(store, columns);
                }
            }
        }, {
            xtype: 'grid',
            flex: 1,
            reference: 'goods_delivery_info_grid',
            title: '商品详细信息',
            sortableColumns: false,
            enableColumnHide: false,
            store:productStore,
            columns: [
                {text: '商品代码', dataIndex: 'system_style_no', flex: 1},
                {text: '国际码', dataIndex: 'supply_style_no', flex: 1},
                {text: '名称', dataIndex: 'name', flex: 1},
                {text: '颜色', dataIndex: 'color', flex: 1},
                {text: '尺码', dataIndex: 'size', flex: 1},
                {text: '数量', dataIndex: 'num', flex: 1},
                {text: '库存数', dataIndex: 'warehouse_num', flex: 1}
            ]
        }
        ];
    },
    onGoodsDeliveryNoticeGridDblClick: function (gp, record) {

        var id = record.get("eid"),
            notice_status = record.get("notice_status"),
            me = this,
            order = gp.up("goodsdeliveryorder"),
            panel = order.down("#info_panel"),
            model = order.getViewModel();
        model.set("goods_delivery_notice_id", id);
        model.set("notice_status", notice_status==1?true:false);

        model.set("notice_info", {
            notice_no: record.get("notice_no"),
            store: record.get("store"),
            warehouse_id: record.get("warehouse_id"),
            order_no: record.get("order_no"),
            send_type: record.get("send_type"),
            price_select: record.get("price_select"),
            discount: record.get("discount"),
            expected_send_date: record.get("expected_send_date"),
            brand_id: record.get("brand_id"),
            challne: record.get("challne")
        });

        if (panel.items.items.length > 0) {
            var store = Ext.StoreManager.lookup("delivery_goods_notice_store");
            store.setProxy({
                type: 'ajax',
                url:apiBaseUrl + '/index.php/Commodity/Distribution/getDeliveryNoticeGoods?id='+id,
                reader: {
                    type: 'json',
                    rootProperty: 'data'
                }});
            store.load();
            //this.lookupReference("goods_delivery_info_grid").setStore(model.get("goods_info"));
            return;
        }
        var items = this.getNoticeDetailItems();
        panel.add(items);
        //this.lookupReference("goods_delivery_info_grid").setStore(model.get("goods_info"));
    },
    saveDeliveryGoodsNotice:function(btn){
        var me = this,
            id = this.getViewModel().get("goods_delivery_notice_id");
        console.log(me.products);
        var status = btn.getText()=="申请配货"?1:0;
        var tmp = [];
        for(var i=0;i<me.products.length;i++){
            tmp.push(me.products[i]);
        }
        Ext.Ajax.request({
            async:true,
            method:'POST',
            url:apiBaseUrl + '/index.php/Commodity/Distribution/saveDeliveryGoodsNotice',
            params:{
                products:Ext.encode(tmp),
                id:id,
                status:status
            },
            success:function(res){
                var json = Ext.decode(res.responseText);
                if(!json.success){
                    Ext.toast(json.msg,"系统提示");
                    return;
                }
                Ext.toast(btn.getText()+"成功!","系统提示");
                if(1 == status) me.getViewModel().set("notice_status",true);
            },
            failure:function(){
                Ext.toast("网络链接错误,请检查网络,稍后再试!","系统提示");
            }
        })
    }
});