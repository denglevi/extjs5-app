/**
 * Created by denglevi on 15-6-14.
 */
Ext.define('erp.view.module.purchase.PurchaseOrderInfo', {
    extend: 'Ext.container.Container',
    xtype: 'purchaseorderinfo',

    requires: [
        'Ext.Ajax',
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
        'Ext.form.field.TextArea',
        'Ext.grid.Panel',
        'Ext.layout.container.Column',
        'Ext.layout.container.Fit',
        'Ext.panel.Panel',
        'Ext.tab.Panel',
        'Ext.toolbar.Toolbar',
        'Ext.window.Window',
        'erp.view.module.purchase.AddCheckProductOrder',
        'erp.view.window.AddLogisticsFormWin',
        'erp.view.window.AddPassCustomWin',
        'erp.view.window.PurchasePayWin'
    ],
    initComponent: function () {
        var me = this, res;
        //var myMask = new Ext.LoadMask({target:Ext.getBody(),msg:"请稍等,正在获取数据..."});
        //myMask.show();
        Ext.Ajax.request({
            async: false,
            url: apiBaseUrl + '/index.php/Purchasing/Buyer/getPurchaseOrderInfo',
            params: {
                id: me.order_id
            },
            success: function (response) {
                //myMask.destroy( );
                var text = Ext.decode(response.responseText);
                res = text.data;
            }
        });

        var product_info = res.product_info,
            log = res.log,
            order_info = res.order_info,
            status = res.status,
            batchs = res.batchs,
            next_status = res.next_status;
        console.log(res);
        if (next_status !== null) var url = next_status.action == '' ? '/Purchasing/Buyer/purchasingAction' : next_status.action;
        me.layout = 'vbox';
        me.items = [
            {
                xtype: 'container',
                width: '100%',
                margin: '30 30 40 30',
                data: status,
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
                margin: 10,
                dockedItems: [{
                    xtype: 'toolbar',
                    dock: 'bottom',
                    items: [
                        '->'
                    ]
                }],
                tpl: new Ext.XTemplate(
                    '<div class="col-md-12">',
                    '<div class="col-md-2">日期：{order_time}</div>',
                    '<div class="col-md-2">供应商：{vendor_name}</div>',
                    '<div class="col-md-2">订单号：{order_nos}</div>',
                    '<div class="col-md-2">买手：{username}</div>',
                    '<div class="col-md-4">订单类型：{[this.getType(values.order_state)]}</div>',
                    '</div>',
                    {
                        getType: function (type) {
                            console.log(type);
                            if (type == 'spot_purchase_order') return '现货';
                            if (type == 'futures_purchase_order') return '期货';

                            return '未定义';
                        }
                    }
                ),
                listeners: {
                    afterrender: function () {
                        if (next_status == null || next_status.other_action == 1) return;
                        this.down("toolbar").add({
                            text: next_status.name,
                            handler: function (btn) {
                                if ('申请付款' == next_status.name) {
                                    var total = 0;
                                    Ext.each(product_info, function (product) {
                                        total += parseFloat(product.orderinfo_nprice);
                                    });
                                    Ext.create('erp.view.window.PurchasePayWin', {
                                        title: next_status.name,
                                        status_id: order_info.order_status,
                                        order_no: order_info.order_nos,
                                        batch_no: batchs[0].batch_no,
                                        url: url,
                                        total: total
                                    }).show();
                                } else if ("申请部分货款" == next_status.name) {
                                    var store = null;
                                    var win = Ext.create('Ext.window.Window', {
                                        title: next_status.name,
                                        width: 550,
                                        modal:true,
                                        layout: 'fit',
                                        items: [
                                            {
                                                xtype: 'form',
                                                bodyPadding: 10,
                                                method: 'POST',
                                                layout:'column',
                                                defaults: {
                                                    margin: 5,
                                                    xtype:'textfield',
                                                    columnWidth:0.5,
                                                    labelAlign:'right',
                                                    labelWidth:80
                                                },
                                                url: apiBaseUrl + '/index.php/Purchasing/Buyer/applyPartGoodsPay',
                                                items: [
                                                    {
                                                        xtype: 'displayfield',
                                                        fieldLabel: '订单号',
                                                        value: order_info.order_nos,
                                                        columnWidth:1
                                                    },
                                                    {
                                                        xtype: 'combo',
                                                        fieldLabel: '供应商',
                                                        name: 'supplier',
                                                        disabled: true,
                                                        displayField: 'name',
                                                        valueField: 'id_no',
                                                        editable:false
                                                    },
                                                    {
                                                        xtype: 'combo', fieldLabel: '买手', name: 'buyer', disabled: true,
                                                        displayField: 'username',
                                                        valueField: 'id',
                                                        editable:false
                                                    },
                                                    {
                                                        fieldLabel: '收款公司',
                                                        name: 'receive_money_company'
                                                    },
                                                    {
                                                        fieldLabel: '公司账号',
                                                        name: 'company_bank_no',
                                                    },
                                                    {
                                                        fieldLabel: '开户行',
                                                        name: 'company_open_bank',
                                                    },
                                                    {
                                                        fieldLabel: '付款金额',
                                                        name: 'money',
                                                        value: me.total
                                                    },
                                                    {
                                                        fieldLabel: '最后付款日期',
                                                        name: 'last_pay_day',
                                                        xtype: 'datefield',
                                                        editable: false,
                                                        format: 'Y-m-d',
                                                        value: new Date()

                                                    },
                                                    {
                                                        fieldLabel: '用途',
                                                        name: 'pay_function',
                                                        xtype: 'textarea'
                                                    },
                                                    {
                                                        fieldLabel: '选择付款人',
                                                        name: 'payer',
                                                        xtype: 'combo',
                                                        editable: false,
                                                        displayField: 'username',
                                                        valueField: 'id',
                                                        //queryMode:'local',
                                                        store: Ext.create('Ext.data.Store', {
                                                            //autoLoad:true,
                                                            fields: ['id', 'username'],
                                                            proxy: {
                                                                type: 'ajax',
                                                                url: apiBaseUrl + '/index.php/Purchasing/Buyer/getPayer',
                                                                reader: {
                                                                    type: 'json',
                                                                    rootProperty: 'data'
                                                                }
                                                            }
                                                        })
                                                    },
                                                    {
                                                        xtype: 'filefield',
                                                        name: 'excel_file',
                                                        buttonText: '导入商品',
                                                        allowBlank: true,
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
                                                                        store = Ext.create('Ext.data.Store', {
                                                                            fields: ["style_no", "name", 'color', 'size', 'num', 'batch_price', 'total_price', 'retail_price'],
                                                                            data: data
                                                                        });
                                                                        //me.down("grid").setStore(store);
                                                                        //Ext.Msg.alert('系统提示', "导入成功");
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
                                                                    //headers: {'Content-Type': 'application/json'},
                                                                    params: {
                                                                        products: Ext.encode(me.products),
                                                                        order_no: order_info.order_nos,
                                                                        status_id: next_status.id
                                                                    },
                                                                    success: function (form, action) {
                                                                        //me.down("grid").getStore().load();
                                                                        console.log(action.result);
                                                                        win.destroy();
                                                                        console.log(store);
                                                                        me.down("tabpanel").setActiveTab({
                                                                            xtype: 'grid',
                                                                            title:action.result.batch_no,
                                                                            sortableColumns: false,
                                                                            columns: [
                                                                                {
                                                                                    text: '国际款号',
                                                                                    dataIndex: 'orderinfo_style',
                                                                                    flex: 1
                                                                                },
                                                                                {
                                                                                    text: '商品名称',
                                                                                    dataIndex: 'orderinfo_name'
                                                                                },
                                                                                {
                                                                                    text: '颜色',
                                                                                    dataIndex: 'orderinfo_color'
                                                                                },
                                                                                {
                                                                                    text: '尺码',
                                                                                    dataIndex: 'orderinfo_group'
                                                                                },
                                                                                {
                                                                                    text: '数量',
                                                                                    dataIndex: 'orderinfo_amount'
                                                                                },
                                                                                {
                                                                                    text: '批发价(欧)',
                                                                                    dataIndex: 'orderinfo_wholesale'
                                                                                },
                                                                                {
                                                                                    text: '总价(欧)',
                                                                                    dataIndex: 'orderinfo_nprice'
                                                                                },
                                                                                {
                                                                                    text: '官方零售价(欧)',
                                                                                    flex:1,
                                                                                    dataIndex: 'orderinfo_official'
                                                                                }
                                                                            ],
                                                                            store:store
                                                                        });
                                                                        var store = Ext.StoreManager.lookup("PurchaseOrderListStore");
                                                                        if (store != null) store.load();
                                                                        //Ext.Msg.alert('系统提示', '新增订单成功');
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
                                        ],
                                        status_id: order_info.order_status,
                                        order_no: order_info.order_nos,
                                        url: url,
                                        total: total
                                    });
                                    Ext.Ajax.request({
                                        async: true,
                                        url: apiBaseUrl + '/index.php/Purchasing/Buyer/getSupplierAndBuyer',
                                        success: function (response) {
                                            //myMask.destroy( );
                                            var text = Ext.decode(response.responseText);
                                            if (!text.success) {
                                                Ext.toast("获取数据错误,请关闭重试!", "系统提示");
                                                return;
                                            }
                                            res = text.data;
                                            var form = win.down("form");
                                            form.down("combo[name=buyer]").setStore(Ext.create('Ext.data.Store', {
                                                fields: ['id', 'username'],
                                                data: res.buyer
                                            }));
                                            form.down("combo[name=supplier]").setStore(Ext.create('Ext.data.Store', {
                                                fields: ['id_no', 'name'],
                                                data: res.supplier
                                            }));

                                            form.down("combo[name=buyer]").setDisabled(false);
                                            form.down("combo[name=supplier]").setDisabled(false);
                                        }
                                    });

                                    win.show();
                                } else if ("申请报关付款" == next_status.name) {
                                    Ext.create('erp.view.window.PurchasePayWin', {
                                        title: next_status.name,
                                        status_id: order_info.order_status,
                                        order_no: order_info.order_nos,
                                        batch_no: batchs[0].batch_no,
                                        url: url,
                                        total: total
                                    }).show();
                                } else if ("申请定金" == next_status.name) {
                                    var win = Ext.create('erp.view.window.PurchasePayWin', {
                                        title: next_status.name,
                                        status_id: order_info.order_status,
                                        order_no: order_info.order_nos,
                                        url: url,
                                        total: total,
                                    });
                                    win.show();
                                    win.on("beforedestroy", function () {
                                        btn.setDisabled(true);
                                    });
                                } else if ("验货" == next_status.name) {
                                    var tab = {
                                        title: next_status.name,
                                        order_no: order_info.order_nos,
                                        batch_no: batchs[0].batch_no,
                                        xtype: "addcheckproductorder",
                                        closable: true
                                    };
                                    me.up("tabpanel").setActiveTab(tab);
                                } else if ("提货" == next_status.name || "发货到仓库" == next_status.name) {
                                    var need_notice = "提货" == next_status.name ? 0 : 1;
                                    Ext.create('erp.view.window.AddLogisticsFormWin', {
                                        title: next_status.name,
                                        need_notice: need_notice,
                                        order_no: order_info.order_nos,
                                        batch_no: batchs[0].batch_no,
                                        url: url
                                    }).show();
                                } else if ("申请报关" == next_status.name) {
                                    var win = Ext.create('erp.view.window.AddPassCustomWin', {
                                        title: next_status.name,
                                        order_no: order_info.order_nos,
                                        batch_no: batchs[0].batch_no,
                                        next_status: next_status,
                                        url: url
                                    });
                                    win.show();
                                } else if ("完成报关" == next_status.name || "收货确认" == next_status.name || "完成付款" == next_status.name) {
                                    me.handlerPurchaseOrder(order_info.order_nos, batchs[0].batch_no);
                                } else if ("关单" == next_status.name) {
                                    me.uploadCloseFile(order_info.order_nos);
                                }
                            }
                        });
                    }
                }
            },
            {
                xtype: 'tabpanel',
                width: '100%',
                flex: 1,
                items: this.getTabItems(batchs,log,product_info),
                listeners: {}
            }
        ];

        me.callParent();
    },
    getTabItems:function(batchs,log,product_info){
        var items = [
            {
                title: '商品信息',
                xtype: 'grid',
                scrollable: 'y',
                itemId: 'goods_info',
                sortableColumns: false,
                columns: [
                    {text: '国际款号', dataIndex: 'orderinfo_style', flex: 1},
                    {text: '商品名称', dataIndex: 'orderinfo_name'},
                    {text: '颜色', dataIndex: 'orderinfo_color'},
                    {text: '尺码', dataIndex: 'orderinfo_group'},
                    {text: '数量', dataIndex: 'orderinfo_amount'},
                    {text: '批发价(欧)', dataIndex: 'orderinfo_wholesale'},
                    {text: '总价(欧)', dataIndex: 'orderinfo_nprice'},
                    {text: '官方零售价(欧)', dataIndex: 'orderinfo_official', flex: 1}
                ],
                listeners: {
                    afterrender: function () {
                        var store = Ext.create('Ext.data.Store', {
                            fields: [],
                            data: product_info
                        });
                        this.setStore(store);
                    }
                }
            }
        ];

        for(var i=0;i<batchs.length;i++){
            var bat = batchs[i];
            items.push(
                {
                    title: bat.batch_no,
                    xtype: 'grid',
                    sortableColumns: false,
                    columns: [
                        {text: '国际款号', dataIndex: 'orderinfo_style', flex: 1},
                        {text: '商品名称', dataIndex: 'orderinfo_name'},
                        {text: '颜色', dataIndex: 'orderinfo_color'},
                        {text: '尺码', dataIndex: 'orderinfo_group'},
                        {text: '数量', dataIndex: 'orderinfo_amount'},
                        {text: '批发价(欧)', dataIndex: 'orderinfo_wholesale'},
                        {text: '总价(欧)', dataIndex: 'orderinfo_nprice'},
                        {text: '官方零售价(欧)', dataIndex: 'orderinfo_official', flex: 1}
                    ]
                }
            );
        }

        items.push(
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
        );

        return items;
    },
    handlerPurchaseOrder: function (order_no, batch_no) {
        var me = this;
        Ext.Ajax.request({
            async: false,
            url: apiBaseUrl + '/index.php/Purchasing/Buyer/handlerPurchaseOrder',
            params: {
                batch_no: batch_no,
                order_no: order_no
            },
            success: function (response) {
                //myMask.destroy( );
                var text = Ext.decode(response.responseText);
                if (!text.success) {
                    Ext.Msg.alert("系统提示", text.msg);
                    return;
                }
                me.destroy();
            }
        });
    },
    uploadCloseFile: function (order_no) {
        var me = this;
        var win = Ext.create('Ext.window.Window', {
            title: "上传清关文件",
            bodyPadding: 40,
            items: [
                {
                    xtype: 'form',
                    method: 'POST',
                    url: apiBaseUrl + '/index.php/Purchasing/Customs/closeOrder',
                    items: [
                        {
                            xtype: 'filefield',
                            name: 'excel_file',
                            buttonText: '上传文件',
                            allowBlank: true,
                            listeners: {
                                change: function () {
                                    var val = this.getValue();
                                    console.log(val);
                                    this.up("form").getForm().submit({
                                        waitMsg: '正在上传文件...',
                                        params: {
                                            order_no: order_no
                                        },
                                        success: function (form, action) {
                                            var data = action.result.data;
                                            win.destroy();
                                            me.destroy();
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
            //order_no:order_info.order_nos,
            //batch_no:batchs[0].batch_no,
            //url:url
        }).show();
    }
});