/**
 * Created by denglevi on 15-6-14.
 */
Ext.define('erp.view.module.purchase.PurchaseOrderInfo', {
    extend: 'Ext.container.Container',
    xtype: 'purchaseorderinfo',

    requires: [
        'Ext.Ajax',
        'Ext.Array',
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
        'Ext.form.field.Number',
        'Ext.form.field.Text',
        'Ext.form.field.TextArea',
        'Ext.grid.Panel',
        'Ext.layout.container.Column',
        'Ext.layout.container.Fit',
        'Ext.layout.container.HBox',
        'Ext.panel.Panel',
        'Ext.toolbar.Fill',
        'Ext.toolbar.Toolbar',
        'Ext.window.Window',
        'erp.view.module.purchase.AddCheckProductOrder',
        //'erp.view.module.purchase.SupplierMngController',
        'erp.view.module.purchase.SupplierMngModel',
        'erp.view.window.AddLogisticsFormWin',
        'erp.view.window.AddPassCustomWin',
        'erp.view.window.ApplyPassCustomPayWin',
        'erp.view.window.PurchasePayWin'
    ],
    //controller: 'suppliermng',
    viewModel: {
        type: 'suppliermng'
    },
    initComponent: function () {
        var me = this, res = this.res, model = this.getViewModel();
        if (res.order_info.order_state == "spot_purchase_order") {
            me.columns = me.getSpotPurchaseOrderColumns();
        } else {
            me.columns = me.getFuturePurchaseOrderColumns();
        }
        var product_info = res.product_info,
            log = res.log,
            order_info = res.order_info,
            status = res.status,
            batchs = res.batchs,
            next_status = res.next_status,
            barContainer = me.getBarContainer(batchs, order_info),
            infoGrid = me.getInfoGrid(product_info);
        model.set("purchaseOrderStatus", status);
        console.log(res);
        me.res = res;
        if (next_status !== null) {
            var url = next_status.action == '' ? '/Purchasing/Buyer/purchasingAction' : next_status.action;
            var hidden = (next_status.mark == 1 || next_status.other_action == 1) && (next_status.is_last == 0) ? true : false;
            model.set("btnIsHidden", hidden);
            model.set("nextStatusText", next_status.name);
        }
        me.layout = 'vbox';
        me.items = [
            {
                xtype: 'container',
                width: '100%',
                margin: '30 30 40 30',
                bind: {
                    data: '{purchaseOrderStatus}'
                },
                tpl: new Ext.XTemplate(
                    '<div class="status">',
                    '<tpl for=".">',
                    '<div style="float: left;margin-top: 20px;">',
                    '<span class="dot {[this.getDot(values.id)]}"></span>',
                    '<span class="line {[this.getLine(values.id,xindex)]}"></span><br>',
                    '<span class="text">{name}</span>',
                    '</div>',
                    '</tpl>',
                    '</div>',
                    {
                        getDot: function (id) {
                            if (next_status === null) return 'green';
                            if (id > next_status.id) return 'red';
                            if (id == next_status.id) return 'blue';
                            return 'green';
                        },
                        getLine: function (id, index) {
                            if (index == status.length) return 'hide';
                            if (next_status === null) return 'green';
                            if (id >= next_status.id) return 'red';
                            return 'green';
                        }
                    }
                )
            },
            {
                xtype: 'panel',
                data: order_info,
                width: '100%',
                //margin: 10,
                dockedItems: [{
                    xtype: 'toolbar',
                    dock: 'bottom',
                    bind: {
                        hidden: '{btnIsHidden}'
                    },
                    items: [
                        '->', {
                            bind: {
                                text: '{nextStatusText}',
                                disabled: '{statusBtn}'
                            },
                            handler: me.onNextStatusBtnClick,
                            scope: this
                        }
                    ]
                }],
                tpl: new Ext.XTemplate(
                    '<div class="col-md-12">',
                    '<div class="col-md-3">日期：{order_time}</div>',
                    '<div class="col-md-3">供应商：{vendor_name}</div>',
                    '<div class="col-md-3">订单号：{order_nos}</div>',
                    '<div class="col-md-3">买手：{nickname}</div>',
                    '</div>',
                    '<div class="col-md-12">',
                    '<div class="col-md-3">订单类型：{[this.getType(values.order_state)]}</div>',
                    '<div class="col-md-3">商品数量：{product_num}</div>',
                    '<div class="col-md-3">订单金额：{product_total_price}</div>', '{[this.getNum(values.order_state,values.product_remain_num)]}',
                    //'<div class="col-md-3">剩余订货件数：{product_total_price}</div>',
                    '</div>',
                    {
                        getType: function (type) {
                            console.log(type);
                            if (type == 'spot_purchase_order') return '现货';
                            if (type == 'futures_purchase_order') return '期货';

                            return '未定义';
                        },
                        getNum: function (type, remain_num) {
                            if (type == 'futures_purchase_order') return '<div class="col-md-3">剩余订货件数：' + remain_num + '</div>';
                        }
                    }
                )
            },
            barContainer,
            infoGrid
        ];
        me.listeners = {
            beforedestroy: function () {
                var store = Ext.StoreManager.lookup("PurchaseOrderListStore");
                if (store != null) store.load();
            }
        };
        me.callParent();
    },
    onNextStatusBtnClick: function () {
        //期货状态
        var me = this,
            model = me.getViewModel(),
            next_status = me.res.next_status,
            order_info = me.res.order_info,
            product_info = me.res.product_info,
            batchs = me.res.batchs;
        if (next_status === null) return;
        model.set("statusBtn", true);
        var url = next_status.action == '' ? '/Purchasing/Buyer/purchasingAction' : next_status.action;

        if ('申请付款' == next_status.name) {
            console.log(next_status, order_info);
            var win = Ext.create('erp.view.window.PurchasePayWin', {
                title: next_status.name,
                status_id: order_info.order_status,
                order_no: order_info.order_nos,
                batch_no: batchs[0].batch_no,
                url: url,
                total: order_info.product_total_price
            });
            win.on("beforedestroy", me.changeOrderData, me);
            win.show();
        } else if ("申请部分货款" == next_status.name) {
            var store = null;
            console.log(order_info);
            var win = Ext.create('Ext.window.Window', {
                title: next_status.name,
                width: 550,
                modal: true,
                layout: 'fit',
                status_id: order_info.order_status,
                order_no: order_info.order_nos,
                url: url,
                total: total,
                items: [
                    {
                        xtype: 'form',
                        bodyPadding: 10,
                        method: 'POST',
                        layout: 'column',
                        defaults: {
                            margin: 5,
                            xtype: 'textfield',
                            columnWidth: 0.5,
                            labelAlign: 'right',
                            labelWidth: 90,
                            allowBlank: false
                        },
                        url: apiBaseUrl + '/index.php/Purchasing/Buyer/applyPartGoodsPay',
                        items: [
                            {fieldLabel: '订单号', value: order_info.order_nos},
                            {fieldLabel: '合同号', name: 'contract_no'},
                            {xtype: 'hiddenfield', name: 'supplier', value: order_info.vendor_id},
                            {
                                fieldLabel: '供应商',
                                editable: false,
                                name: 'supplier_name',
                                value: order_info.name,
                                listeners: {
                                    beforerender: function () {
                                        var rv = this.getRawValue();
                                        this.setValue(Ext.util.Format.htmlDecode(rv));
                                    }
                                }
                            },
                            //{
                            //    xtype: 'combo',
                            //    fieldLabel: '供应商',
                            //    name: 'supplier',
                            //    disabled: true,
                            //    displayField: 'name',
                            //    valueField: 'id_no',
                            //    editable: false,
                            //    columnWidth:0.5,
                            //    listeners:{
                            //        change:function(){
                            //            var form = this.up("form"),supplier = form.down("combo[name=supplier]"),val = this.getValue().split('|');
                            //            var items = supplier.getStore().getData().items,len = items.length;
                            //            console.log(items,val[0]);
                            //            for(var i=0;i<len;i++){
                            //                var item = items[i];
                            //                if(val[0] == item.get("id")){
                            //                    form.down("textfield[name=receive_money_company]").setValue(item.get("name"));
                            //                    form.down("textfield[name=company_bank_no]").setValue(item.get("bank_no"));
                            //                    form.down("textfield[name=company_open_bank]").setValue(item.get("bank_name"));
                            //                    break;
                            //                }
                            //            }
                            //        }
                            //    }
                            //},
                            //{
                            //    xtype: 'combo', fieldLabel: '买手', name: 'buyer', disabled: true,
                            //    displayField: 'username',
                            //    valueField: 'id',
                            //    editable: false
                            //},
                            {fieldLabel: '收款公司', name: 'receive_money_company', value: order_info.bank_name},
                            {fieldLabel: '公司账号', name: 'company_bank_no', value: order_info.bank_no},
                            {fieldLabel: '开户行', name: 'company_open_bank', value: order_info.address},
                            {fieldLabel: '汇率', name: 'exchange_rate'},
                            {
                                xtype: 'filefield',
                                name: 'excel_file',
                                buttonText: '导入商品',
                                clearOnSubmit: false,
                                listeners: {
                                    change: function () {
                                        var val = this.getValue();
                                        this.up("form").getForm().submit({
                                            clientValidation: false,
                                            waitMsg: '正在导入商品信息...',
                                            url: apiBaseUrl + '/index.php/Purchasing/Buyer/importPurchaseOrderProduct',
                                            success: function (form, action) {
                                                var data = action.result.data;
                                                console.log(data);
                                                me.products = data;
                                                var total = 0;
                                                for (var i = 0; i < data.length; i++) {
                                                    var goods = data[i], num = (parseFloat(goods.rate) + 1) * parseFloat(goods.orderinfo_wholesale) * parseFloat(goods.orderinfo_amount);
                                                    total += num;
                                                }
                                                win.down("textfield[name=money]").setValue(total);
                                                store = Ext.create('Ext.data.Store', {
                                                    fields: ["style_no", "name", 'color', 'size', 'num', 'batch_price', 'total_price', 'retail_price'],
                                                    data: data
                                                });
                                                //me.down("grid").setStore(store);
                                                Ext.toast("导入成功", '系统提示');
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
                            },
                            {fieldLabel: '付款金额(欧)', name: 'money', value: me.total, xtype: 'numberfield'},
                            {
                                fieldLabel: '最后付款日期',
                                name: 'last_pay_day',
                                xtype: 'datefield',
                                editable: false,
                                format: 'Y-m-d',
                                value: new Date()
                            },
                            {
                                fieldLabel: '是否为最后一批货',
                                name: 'is_last_batch',
                                xtype: 'checkbox',
                                labelWidth: 120,
                                allowBlank: true
                            },
                            {
                                fieldLabel: '备注',
                                name: 'pay_function',
                                xtype: 'textarea',
                                columnWidth: 1,
                                allowBlank: true
                            }
                        ],
                        buttons: [
                            {
                                text: '重置',
                                handler: function () {
                                    this.up('form').getForm().reset();
                                }
                            },
                            {
                                text: '提交',
                                formBind: true,
                                disabled: true,
                                handler: function () {
                                    console.log(store);
                                    if (store == null || store.getData().length == 0) {
                                        Ext.Msg.alert('系统提示', "请导入商品资料");
                                        return;
                                    }
                                    var data = store.data;
                                    console.log(data);
                                    var form = this.up('form').getForm();
                                    if (form.isValid()) {
                                        form.submit({
                                            waitMsg: '正在提交...',
                                            params: {
                                                products: Ext.encode(me.products),
                                                order_no: order_info.order_nos,
                                                status_id: order_info.order_status,
                                                pay_type: next_status.name
                                            },
                                            success: function (form, action) {
                                                Ext.toast("提交成功", "系统提示");
                                                console.log(action.result);
                                                win.destroy();
                                                var data = action.result.product;
                                                me.down("segmentedbutton").add({
                                                    text: action.result.batch_no
                                                });
                                                var store = Ext.StoreManager.lookup("PurchaseOrderListStore");
                                                if (store != null) store.load();
                                            },
                                            failure: function (form, action) {
                                                console.log(action);
                                                Ext.Msg.alert('失败', action.result.msg);
                                            }
                                        });
                                    }
                                }
                            }
                        ]
                    }
                ]
            });
            //Ext.Ajax.request({
            //    async: true,
            //    url: apiBaseUrl + '/index.php/Purchasing/Buyer/getSupplierAndBuyer',
            //    success: function (response) {
            //        //myMask.destroy( );
            //        var text = Ext.decode(response.responseText);
            //        if (!text.success) {
            //            Ext.toast("获取数据错误,请关闭重试!", "系统提示");
            //            return;
            //        }
            //        res = text.data;
            //        var form = win.down("form");
            //        //form.down("combo[name=buyer]").setStore(Ext.create('Ext.data.Store', {
            //        //    fields: ['id', 'username'],
            //        //    data: res.buyer
            //        //}));
            //        form.down("combo[name=supplier]").setStore(Ext.create('Ext.data.Store', {
            //            fields: [],
            //            data: res.supplier
            //        }));
            //
            //        //form.down("combo[name=buyer]").setDisabled(false);
            //        form.down("combo[name=supplier]").setDisabled(false);
            //    }
            //});
            win.on("beforedestroy", me.changeOrderData, me);
            win.show();
        } else if ("申请报关付款" == next_status.name) {
            console.log(batchs);
            var win = Ext.create('erp.view.window.ApplyPassCustomPayWin', {
                title: next_status.name,
                status_id: order_info.order_status,
                order_no: order_info.order_nos,
                batch_no: batchs[0].batch_no,
                url: url,
                width: 600,
                total: total
            });
            win.on("beforedestroy", me.changeOrderData, me);
            win.show();
        } else if ("申请定金" == next_status.name) {
            var total = 0;
            Ext.each(product_info, function (product) {
                var money = product.orderinfo_wholesale * (parseFloat(product.rate) + 1) * product.orderinfo_amount;
                total += money;
            });
            var win = Ext.create('erp.view.window.PurchasePayWin', {
                title: next_status.name,
                status_id: order_info.order_status,
                order_no: order_info.order_nos,
                url: url,
                total: total,
            });
            win.show();
            win.on("beforedestroy", me.changeOrderData, me);
        } else if ("验货" == next_status.name) {
            var tab = {
                title: next_status.name,
                order_no: order_info.order_nos,
                batch_no: batchs[0].batch_no,
                order_info: order_info,
                xtype: "addcheckproductorder",
                closable: true
            };
            me.up("tabpanel").setActiveTab(tab);
        } else if ("提货" == next_status.name || "发货到仓库" == next_status.name) {
            var need_notice = "提货" == next_status.name ? 0 : 1;
            win = Ext.create('erp.view.window.AddLogisticsFormWin', {
                title: next_status.name,
                need_notice: need_notice,
                order_no: order_info.order_nos,
                batch_no: batchs[0].batch_no,
                order_info: order_info,
                url: url
            });
            win.show();
            win.on("beforedestroy", me.changeOrderData, me);
        } else if ("申请报关" == next_status.name) {
            var me = this;
            //console.log(order_info.order_nos, batchs[0].batch_no);
            Ext.getBody().mask("正在提交...");
            Ext.Ajax.request({
                async: true,
                url: apiBaseUrl + '/index.php/Purchasing/Buyer/applyPassCustom',
                method: 'POST',
                params: {
                    order_no: order_info.order_nos,
                    batch_no: batchs[0].batch_no
                },
                success: function (res) {
                    var text = Ext.decode(res.responseText);
                    if (!text.success) {
                        Ext.Msg.alert("系统提示", text.msg);
                        Ext.getBody().unmask();
                        return;
                    }
                    Ext.getBody().unmask();
                    me.changeOrderData();
                },
                failure: function (res) {

                }
            });
        } else if ("完成报关" == next_status.name || "收货确认" == next_status.name || "完成付款" == next_status.name) {
            me.handlerPurchaseOrder(order_info.order_nos, batchs[0].batch_no);
            //me.changeOrderData();
        } else if ("关单" == next_status.name) {
            me.uploadCloseFile(order_info.order_nos);
        }
    },
    changeOrderData: function () {
        var me = this;
        Ext.Ajax.request({
            async: true,
            url: apiBaseUrl + '/index.php/Purchasing/Buyer/getPurchaseOrderInfo',
            params: {
                id: me.order_id
            },
            success: function (response) {
                var text = Ext.decode(response.responseText);
                res = text.data;
                me.res = res;
                var model = me.getViewModel();
                model.set("purchaseOrderStatus", res.status);
                model.set("statusBtn", false);
                if (res.next_status !== null) {
                    var hidden = res.next_status.mark == 1 || res.next_status.other_action == 1 ? true : false;
                    model.set("btnIsHidden", hidden);
                    model.set("nextStatusText", res.next_status.name);
                }
            }
        });
    },
    getInfoGrid: function (product_info) {
        var me = this;
        //console.log(me.columns);
        return {
            title: '商品信息',
            xtype: 'grid',
            //margin: '10 0 0 0',
            flex: 1,
            width: '100%',
            sortableColumns: false,
            columns: me.columns,
            store: Ext.create('Ext.data.Store', {
                fields: [],
                data: product_info
            }),
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'top',
                hidden: true,
                items: ['->', {
                    text: '',
                    handler: me.batchOrderStatusBtnClick,
                    scope: this
                }]
            }]
        }
    },
    batchOrderStatusBtnClick: function (btn) {
        //期货状态
        var me = this, batch_no = btn.up("grid").getTitle(), batchs = me.res.batchs, len = batchs.length, bat;
        for (var i = 0; i < len; i++) {
            if (batchs[i].batch_no == batch_no) {
                var bat = batchs[i];
                break;
            }
        }
        console.log(bat);
        var status = bat.status,
            status_name = status.name;
        if (status !== null) var url = status.action == '' ? '/Purchasing/Buyer/purchasingAction' : status.action;
        if ("完成报关" == status_name || "收货确认" == status_name || "完成付款" == status_name) {
            Ext.getBody().mask("正在提交...");
            Ext.Ajax.request({
                async: true,
                url: apiBaseUrl + '/index.php/Purchasing/Buyer/handlerPurchaseOrder',
                params: {
                    batch_no: bat.batch_no,
                    order_no: bat.order_no
                },
                success: function (response) {
                    Ext.getBody().unmask();
                    var text = Ext.decode(response.responseText);
                    if (!text.success) {
                        Ext.Msg.alert("系统提示", text.msg);
                        return;
                    }
                    Ext.toast("提交成功!", "系统提示");
                    me.destroy();
                }
            });
        } else if ("验货" == status_name) {
            btn.setDisabled(true);
            var tabpanel = me.up("tabpanel");
            var tab = {
                title: status_name,
                order_no: bat.order_no,
                batch_no: bat.batch_no,
                order_info: me.res.order_info,
                xtype: "addcheckproductorder",
                closable: true,
                listeners: {
                    beforedestroy: function () {
                        var info = tabpanel.down("purchaseorderinfo");
                        console.log(info);
                        if (info == null) return;
                        me.changeOrderData();
                        var btn = me.down("segmentedbutton").down("button");
                        btn.setPressed(true);
                    }
                }
            };
            tabpanel.setActiveTab(tab);
        } else if ("提货" == status_name || "发货到仓库" == status_name) {
            var need_notice = "提货" == status_name ? 0 : 1;
            var win = Ext.create('erp.view.window.AddLogisticsFormWin', {
                title: status_name,
                need_notice: need_notice,
                order_no: bat.order_no,
                batch_no: bat.batch_no,
                order_info: me.res.order_info
            });
            win.show();
            win.on("beforedestroy", function () {
                me.destroy();
            });
        } else if ("申请报关" == status_name) {
            var me = this;
            Ext.getBody().mask("正在提交...");
            Ext.Ajax.request({
                async: true,
                url: apiBaseUrl + '/index.php/Purchasing/Buyer/applyPassCustom',
                method: 'POST',
                params: {
                    order_no: bat.order_no,
                    batch_no: bat.batch_no
                },
                success: function (res) {
                    Ext.getBody().unmask();
                    var text = Ext.decode(res.responseText);
                    if (!text.success) {
                        Ext.Msg.alert("系统提示", text.msg);
                        return;
                    }
                    me.destroy();
                },
                failure: function (res) {

                }
            });
        } else if ("申请报关付款" == status_name) {
            var win = Ext.create('erp.view.window.ApplyPassCustomPayWin', {
                title: status_name,
                status_id: bat.batch_status,
                order_no: bat.order_no,
                batch_no: bat.batch_no,
                url: url,
                total: 0
            });
            win.on("beforedestroy", function () {
                me.destroy();
            }, me);
            win.show();
        }
    },
    getBarContainer: function (batchs, order_info) {
        var me = this;
        if (order_info.is_last == 1) {
            var items = [
                {itemId: 'goods_info', text: '商品信息', itemId: 'goods_info', pressed: true},
                {itemId: 'log', text: '操作日志'},
                {itemId: 'close_file', text: '关单文件'}
            ];
        } else {
            var items = [
                {itemId: 'goods_info', text: '商品信息', itemId: 'goods_info', pressed: true},
                {itemId: 'log', text: '操作日志'}
            ];
        }

        if ('spot_purchase_order' != order_info.order_state) {
            for (var i = 0; i < batchs.length; i++) {
                var bat = batchs[i];
                items.push({itemId: bat.batch_no, text: bat.batch_no})
            }
        }
        return {
            xtype: 'segmentedbutton',
            margin: 10,
            //layout: 'hbox',
            //itemId: 'bar_container',
            //defaultType: 'button',
            //defaults: {
            //    margin: '0 0 0 5',
            //    scope: this,
            //    handler: me.onGridTopBtnClick
            //},
            items: items,
            listeners: {
                toggle: me.onGridTopBtnClick,
                scope: this
            }
        };
    },
    setBtnDisabled: function () {
        var items = this.down("#bar_container").items.items;
        Ext.Array.each(items, function (item) {
            item.setDisabled(false);
        });
    },
    onGridTopBtnClick: function (container, btn, pressed) {
        var grid = this.down("grid"),
            text = btn.getText(), columns, data = [], me = this;
        //me.setBtnDisabled();
        //btn.setDisabled(true);
        grid.setTitle(text);
        var item = grid.getDockedItems('toolbar[dock="top"]');
        if ("操作日志" == text) {
            item[0].setHidden(true);
            columns = [
                {text: '日期', dataIndex: 'time'},
                {text: '操作', dataIndex: 'name', flex: 1},
                {text: '操作人', dataIndex: 'username', flex: 1}
            ];
            data = me.res.log;
        } else if (text == "关单文件") {
            item[0].setHidden(true);
            columns = [
                {text: '文件名称', dataIndex: 'name', flex: 1},
                {
                    text: '下载',
                    xtype: 'actioncolumn',
                    flex: 1,
                    dataIndex:'file_path',
                    items: [
                        {
                            iconCls: 'downloadIcon',
                            tooltip: '点击下载',
                            handler:function(grid, rowIndex, colIndex, item, e, record, row){
                                window.open(apiBaseUrl+"/.."+record.get("file_path"),"文件下载", 'height=100, width=400, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no');
                                //window.location.href = apiBaseUrl+record.get("file_path");
                            }
                        }
                    ]
                }
            ];
            console.log(me.res.order_info);
            data = Ext.decode(me.res.order_info.file_info);
        } else {
            if (text == "商品信息") {
                item[0].setHidden(true);
                columns = [
                    {text: '品牌', dataIndex: 'brand'},
                    {text: '国际款号', dataIndex: 'orderinfo_style', flex: 1},
                    {text: '商品名称', dataIndex: 'orderinfo_name'},
                    {text: '颜色', dataIndex: 'orderinfo_color'},
                    {text: '尺码', dataIndex: 'orderinfo_group'},
                    {text: '性别', dataIndex: 'sex'},
                    {text: '年份季节', dataIndex: 'year_season'},
                    {text: '数量', dataIndex: 'orderinfo_amount'},
                    {text: '加价率', dataIndex: 'rate'},
                    {text: '批发价(欧)', dataIndex: 'orderinfo_wholesale'},
                    {
                        text: '加价率批发价(欧)', dataIndex: 'rate', renderer: function (val, data, record) {
                        var batch_price = parseFloat(record.get("orderinfo_wholesale")),
                            rate = parseFloat(record.get("rate"));
                        return batch_price * rate + batch_price;
                    }
                    },
                    {
                        text: '总价(欧)', dataIndex: 'rate', renderer: function (val, data, record) {
                        var num = parseFloat(record.get("orderinfo_amount")),
                            batch_price = parseFloat(record.get("orderinfo_wholesale"));
                        //console.log(num,batch_price);
                        return num * batch_price;
                    }
                    },
                    {
                        text: '加价率总价(欧)', dataIndex: 'rate', renderer: function (val, data, record) {
                        var batch_price = parseFloat(record.get("orderinfo_wholesale")),
                            num = parseFloat(record.get("orderinfo_amount")),
                            rate = parseFloat(record.get("rate"));
                        return (batch_price * rate + batch_price) * num;
                    }
                    },
                    {text: '官方零售价(欧)', dataIndex: 'orderinfo_official', flex: 1}
                ];
                data = me.res.product_info;
            } else {
                var batchs = me.res.batchs, len = batchs.length;
                columns = [
                    {text: '品牌', dataIndex: 'brand'},
                    {text: '国际款号', dataIndex: 'style_no', flex: 1},
                    {text: '商品名称', dataIndex: 'name'},
                    {text: '颜色', dataIndex: 'color'},
                    {text: '尺码', dataIndex: 'size'},
                    {text: '性别', dataIndex: 'sex'},
                    {text: '年份季节', dataIndex: 'year_season'},
                    {text: '数量', dataIndex: 'num'},
                    {text: '加价率', dataIndex: 'rate'},
                    {text: '批发价(欧)', dataIndex: 'batch_price'},
                    {
                        text: '加价率批发价(欧)', dataIndex: 'rate', renderer: function (val, data, record) {
                        var batch_price = parseFloat(record.get("batch_price")),
                            rate = parseFloat(record.get("rate"));
                        return batch_price * rate + batch_price;
                    }
                    },
                    {
                        text: '总价(欧)', dataIndex: 'rate', renderer: function (val, data, record) {
                        var num = parseFloat(record.get("num")),
                            batch_price = parseFloat(record.get("batch_price"));
                        //console.log(num,batch_price);
                        return num * batch_price;
                    }
                    },
                    {
                        text: '加价率总价(欧)', dataIndex: 'rate', renderer: function (val, data, record) {
                        var batch_price = parseFloat(record.get("batch_price")),
                            num = parseFloat(record.get("num")),
                            rate = parseFloat(record.get("rate"));
                        return (batch_price * rate + batch_price) * num;
                    }
                    },
                    {text: '官方零售价(欧)', dataIndex: 'retail_price', flex: 1}
                ];
                for (var i = 0; i < len; i++) {
                    var bat = batchs[i];
                    if (bat.batch_no == text) {
                        if (bat.status != null && bat.status.is_last != 1) {
                            item[0].setHidden(false)
                            var button = item[0].down("button");
                            button.setText(bat.status.name);
                            if (bat.status.other_action == 1) button.setDisabled(true);
                            else button.setDisabled(false)
                        } else {
                            item[0].setHidden(true);
                        }
                        data = bat.products;
                        break;
                    }
                }
            }
        }

        var store = Ext.create('Ext.data.Store', {
            fields: [],
            data: data
        });
        grid.reconfigure(store, columns);
    },
    getTabItems: function (batchs, log, product_info) {
        var me = this;
        var items = [,
            {
                title: '操作日志',
                xtype: 'grid',
                height: 400,
                sortableColumns: false,
                columns: [
                    {text: '日期', dataIndex: 'time'},
                    {text: '操作', dataIndex: 'name', flex: 1},
                    {text: '操作人', dataIndex: 'username', flex: 1}
                ],
                store: Ext.create('Ext.data.Store', {
                    fields: [],
                    data: log
                })
            }
        ];

        for (var i = 0; i < batchs.length; i++) {
            var bat = batchs[i];
            var status_name = bat.status.name,
                order_no = bat.order_no,
                batch_no = bat.batch_no;
            console.log(bat);
            items.push(
                {
                    title: batch_no,
                    xtype: 'grid',
                    sortableColumns: false,
                    store: Ext.create('Ext.data.Store', {
                        fields: [],
                        data: bat.products
                    }),
                    tbar: ['->', {
                        text: status_name, disabled: bat.status.other_action == 1 ? true : false,
                        handler: function () {
                            console.log(bat);
                            if (status !== null) var url = status.action == '' ? '/Purchasing/Buyer/purchasingAction' : status.action;
                            if ("完成报关" == status_name || "收货确认" == status_name || "完成付款" == status_name) {
                                me.handlerPurchaseOrder(bat.order_no, bat.batch_no);
                            } else if ("验货" == status_name) {
                                var tab = {
                                    title: status_name,
                                    order_no: order_no,
                                    batch_no: batch_no,
                                    xtype: "addcheckproductorder",
                                    closable: true
                                };
                                me.up("tabpanel").setActiveTab(tab);
                            } else if ("提货" == status_name || "发货到仓库" == status_name) {
                                var need_notice = "提货" == status_name ? 0 : 1;
                                Ext.create('erp.view.window.AddLogisticsFormWin', {
                                    title: status_name,
                                    need_notice: need_notice,
                                    order_no: order_no,
                                    batch_no: batch_no
                                }).show();
                            } else if ("申请报关" == status_name) {
                                var win = Ext.create('erp.view.window.AddPassCustomWin', {
                                    title: status_name,
                                    order_no: order_no,
                                    batch_no: batch_no,
                                    next_status: status
                                });
                                win.show();
                            }
                        }
                    }],
                    columns: [
                        {text: '国际款号', dataIndex: 'style_no', flex: 1},
                        {text: '商品名称', dataIndex: 'name'},
                        {text: '颜色', dataIndex: 'color'},
                        {text: '尺码', dataIndex: 'size'},
                        {text: '性别', dataIndex: 'sex'},
                        {text: '数量', dataIndex: 'num'},
                        {text: '加价率', dataIndex: 'rate'},
                        {text: '批发价(欧)', dataIndex: 'batch_price'},
                        {
                            text: '加价率批发价(欧)', dataIndex: '', rerender: function (val, data, record) {
                            return record.get("batch_price") * (parseFloat(record.get("rate")) + 1);
                        }
                        },
                        {
                            text: '总价(欧)', dataIndex: 'total_price', rerender: function (val, data, record) {
                            return record.get("num") * record.get("batch_price");
                        }
                        },
                        {
                            text: '加价率总价(欧)', dataIndex: '', rerender: function (val, data, record) {
                            return record.get("batch_price") * (parseFloat(record.get("rate")) + 1) * record.get("num");
                        }
                        },
                        {text: '官方零售价(欧)', dataIndex: 'retail_price', flex: 1}
                    ]
                }
            );
        }

        return items;
    },
    handlerPurchaseOrder: function (order_no, batch_no) {
        var me = this;
        Ext.getBody().mask("正在提交...");
        Ext.Ajax.request({
            async: true,
            url: apiBaseUrl + '/index.php/Purchasing/Buyer/handlerPurchaseOrder',
            params: {
                batch_no: batch_no,
                order_no: order_no
            },
            success: function (response) {
                var text = Ext.decode(response.responseText);
                if (!text.success) {
                    Ext.Msg.alert("系统提示", text.msg);
                    Ext.getBody().unmask();
                    return;
                }
                Ext.getBody().unmask();
                me.changeOrderData();
            }
        });
    },
    uploadCloseFile: function (order_no) {
        var me = this;
        var win = Ext.create('Ext.window.Window', {
            title: "上传关单文件",
            bodyPadding: 10,
            width: 400,
            modal: true,
            items: [
                {
                    xtype: 'form',
                    method: 'POST',
                    url: apiBaseUrl + '/index.php/Purchasing/Customs/closeOrder',
                    items: [
                        {
                            xtype: 'filefield',
                            name: 'excel_file[]',
                            buttonText: '上传文件',
                            allowBlank: true,
                            anchor: '100%',
                            id: "upload_close_purchase_order_doc_field",
                            listeners: {
                                change: function () {
                                    var me = this;
                                    var val = this.getValue();
                                    //console.log(val);
                                    this.up("form").getForm().submit({
                                        waitMsg: '正在上传文件...',
                                        params: {
                                            order_no: order_no
                                        },
                                        success: function (form, action) {
                                            var data = action.result.data;
                                            Ext.toast("操作成功", "系统提示");
                                            win.destroy();
                                        },
                                        failure: function (form, action) {
                                            var dom = me.el,
                                                input = dom.select("input").last();
                                            input.dom.multiple = true;
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
                                },
                                afterrender: function () {
                                    var dom = this.el,
                                        input = dom.select("input").last();
                                    input.dom.multiple = true;
                                }
                            }
                        }
                    ]
                }
            ]
        });
        win.show();
        win.on("beforedestroy", function () {
            me.destroy();
        });
    },
    getSpotPurchaseOrderColumns: function () {
        return [
            {text: '品牌', dataIndex: 'brand'},
            {text: '国际款号', dataIndex: 'orderinfo_style', flex: 1},
            {text: '商品名称', dataIndex: 'orderinfo_name'},
            {text: '颜色', dataIndex: 'orderinfo_color'},
            {text: '尺码', dataIndex: 'orderinfo_group'},
            {text: '性别', dataIndex: 'sex'},
            {text: '年份季节', dataIndex: 'year_season'},
            {text: '数量', dataIndex: 'orderinfo_amount'},
            {text: '折扣率', dataIndex: 'rate'},
            {text: '批发价(欧)', dataIndex: 'orderinfo_wholesale'},
            {
                text: '折扣率批发价(欧)', dataIndex: 'rate', renderer: function (val, data, record) {
                var batch_price = parseFloat(record.get("orderinfo_wholesale")),
                    rate = parseFloat(record.get("rate"));
                return parseFloat((batch_price - batch_price * rate) / 1.22).toFixed(2);
            }
            },
            {
                text: '总价(欧)', dataIndex: 'rate', renderer: function (val, data, record) {
                var num = parseFloat(record.get("orderinfo_amount")),
                    batch_price = parseFloat(record.get("orderinfo_wholesale"));
                //console.log(num,batch_price);
                return num * batch_price;
            }
            },
            {
                text: '折扣率总价(欧)', dataIndex: 'rate', renderer: function (val, data, record) {
                var batch_price = parseFloat(record.get("orderinfo_wholesale")),
                    num = parseFloat(record.get("orderinfo_amount")),
                    rate = parseFloat(record.get("rate")), price = (batch_price - batch_price * rate) / 1.22;
                return parseFloat(price * num).toFixed(2);
            }
            },
            {text: '官方零售价(欧)', dataIndex: 'orderinfo_official', flex: 1}
        ];
    },
    getFuturePurchaseOrderColumns: function () {
        return [
            {text: '品牌', dataIndex: 'brand'},
            {text: '国际款号', dataIndex: 'orderinfo_style', flex: 1},
            {text: '商品名称', dataIndex: 'orderinfo_name'},
            {text: '颜色', dataIndex: 'orderinfo_color'},
            {text: '尺码', dataIndex: 'orderinfo_group'},
            {text: '性别', dataIndex: 'sex'},
            {text: '年份季节', dataIndex: 'year_season'},
            {text: '数量', dataIndex: 'orderinfo_amount'},
            {text: '加价率', dataIndex: 'rate'},
            {text: '批发价(欧)', dataIndex: 'orderinfo_wholesale'},
            {
                text: '加价率批发价(欧)', dataIndex: 'rate', renderer: function (val, data, record) {
                var batch_price = parseFloat(record.get("orderinfo_wholesale")),
                    rate = parseFloat(record.get("rate"));
                return batch_price * rate + batch_price;
            }
            },
            {
                text: '总价(欧)', dataIndex: 'rate', renderer: function (val, data, record) {
                var num = parseFloat(record.get("orderinfo_amount")),
                    batch_price = parseFloat(record.get("orderinfo_wholesale"));
                return num * batch_price;
            }
            },
            {
                text: '加价率总价(欧)', dataIndex: 'rate', renderer: function (val, data, record) {
                var batch_price = parseFloat(record.get("orderinfo_wholesale")),
                    num = parseFloat(record.get("orderinfo_amount")),
                    rate = parseFloat(record.get("rate"));
                return (batch_price * rate + batch_price) * num;
            }
            },
            {text: '官方零售价(欧)', dataIndex: 'orderinfo_official', flex: 1}
        ];
    }
});