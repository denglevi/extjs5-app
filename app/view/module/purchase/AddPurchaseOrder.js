/**
 * Created by denglevi on 15-6-14.
 */
Ext.define('erp.view.module.purchase.AddPurchaseOrder', {
    extend: 'Ext.container.Container',
    alias: 'widget.addpurchaseorder',
    requires: [
        'Ext.Ajax',
        'Ext.data.Store',
        'Ext.data.StoreManager',
        'Ext.form.Panel',
        'Ext.form.RadioGroup',
        'Ext.form.action.Action',
        'Ext.form.field.ComboBox',
        'Ext.form.field.Date',
        'Ext.form.field.File',
        'Ext.form.field.Text',
        'Ext.grid.Panel',
        'Ext.layout.container.Anchor'
    ],

    initComponent: function () {
        var me = this, res;
        this.layout = 'hbox';
        this.listeners = {
            afterrender: function () {
                //getSupplierAndBuyer
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
                        var form = me.down("form");
                        form.down("combo[name=buyer]").setStore(Ext.create('Ext.data.Store', {
                            fields: ['id', 'nickname'],
                            data: res.buyer
                        }));
                        form.down("combo[name=supplier]").setStore(Ext.create('Ext.data.Store', {
                            fields: ['id_no', {
                                name: 'name', convert: function (v) {
                                    return Ext.util.Format.htmlDecode(v);
                                }
                            }],
                            data: res.supplier
                        }));

                        form.down("combo[name=buyer]").setDisabled(false);
                        form.down("combo[name=supplier]").setDisabled(false);
                    }
                });
            }
        }
        this.items = [
            {
                xtype: 'form',
                width: 350,
                height: '100%',
                border: true,
                layout: 'anchor',
                bodyPadding: 5,
                method: 'POST',
                url: apiBaseUrl + '/index.php/Purchasing/Buyer/addPurchaseOrder',
                defaults: {
                    anchor: '100%',
                    xtype: 'textfield',
                    allowBlank: false,
                    margin: 10
                },
                items: [
                    {
                        fieldLabel: '制单日期',
                        name: 'date',
                        xtype: 'datefield',
                        editable: false,
                        format: 'Y-m-d',
                        value: new Date()
                    },
                    {
                        fieldLabel: '供应商',
                        name: 'supplier',
                        xtype: 'combo',
                        editable: false,
                        displayField: 'name',
                        valueField: 'id_no',
                        disabled: true
                    },
                    {
                        fieldLabel: '买手',
                        name: 'buyer',
                        xtype: 'combo',
                        editable: false,
                        displayField: 'nickname',
                        valueField: 'id',
                        disabled: true
                    },
                    {
                        xtype: 'radiogroup', fieldLabel: '订货类型', items: [
                        {boxLabel: '期货', name: 'type', inputValue: '1', checked: true},
                        {boxLabel: '现货', name: 'type', inputValue: '0'}
                    ], listeners: {
                        change: function (obj, newVal) {
                            var type = newVal.type, grid = obj.up("form").up("addpurchaseorder").down("grid"), columns;
                            if (type == 1) {
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
                            } else {
                                columns = [
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
                                        return parseFloat((batch_price - batch_price * rate)/1.22).toFixed(2);
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
                                            rate = parseFloat(record.get("rate")),price = (batch_price - batch_price * rate)/1.22;
                                        return parseFloat(price * num).toFixed(2);
                                    }
                                    },
                                    {text: '官方零售价(欧)', dataIndex: 'orderinfo_official', flex: 1}
                                ];
                            }
                            grid.setColumns(columns);
                        }
                    }
                    },
                    {
                        xtype: 'filefield', name: 'excel_file', buttonText: '导入商品', allowBlank: true,
                        listeners: {
                            change: function () {
                                var typefield = this.up("form").down("radiogroup"), type = typefield.getValue();
                                var val = this.getValue();
                                this.up("form").getForm().submit({
                                    clientValidation: false,
                                    waitMsg: '正在导入商品信息...',
                                    params: {
                                        type: type.type
                                    },
                                    url: apiBaseUrl + '/index.php/Purchasing/Buyer/importPurchaseOrderProduct',
                                    success: function (form, action) {
                                        var data = action.result.data;
                                        //console.log(data);
                                        me.products = data;
                                        var store = Ext.create('Ext.data.Store', {
                                            fields: ["style_no", "name", 'color', 'size', 'num', 'batch_price', 'total_price', 'retail_price'],
                                            data: data
                                        });
                                        me.down("grid").setStore(store);
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
                                                //@todo web desktop版本需要修改
                                                //web
                                                if (version == "desktop" && action.result.errorCode != 300) {
                                                    Ext.Msg.alert('系统提示', action.result.msg);
                                                    return;
                                                }
                                                if (version == "web") {
                                                    Ext.Msg.alert('系统提示', action.result.msg);
                                                    return;
                                                }
                                                Ext.Msg.show({
                                                    title: '系统提示',
                                                    message: "导入的模板不正确,请重新导入",
                                                    buttons: Ext.Msg.YESCANCEL,
                                                    buttonText: {yes: '点击下载模板', cancel: '取消'},
                                                    icon: Ext.Msg.QUESTION,
                                                    fn: function (btn) {
                                                        if (btn === 'yes') {
                                                            ipc.send("save-file", action.result.filePath);
                                                        } else {

                                                        }
                                                    }
                                                });
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
                        text: '保存',
                        formBind: true,
                        disabled: true,
                        handler: function () {
                            var grid = me.down("grid");
                            console.log(me.products);
                            if (grid.getStore() == null || grid.getStore().getData().length == 0) {
                                Ext.Msg.alert('系统提示', "请导入商品资料");
                                return;
                            }
                            console.log(grid.getStore());
                            var data = grid.getStore().data;
                            console.log(data);
                            var form = this.up('form').getForm();
                            if (form.isValid()) {
                                form.submit({
                                    waitMsg: '正在新增...',
                                    //headers: {'Content-Type': 'application/json'},
                                    params: {
                                        products: Ext.encode(me.products)
                                    },
                                    success: function (form, action) {
                                        //me.down("grid").getStore().load();
                                        console.log(action.result);
                                        me.destroy();
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
            },
            {
                title: '导入商品信息',
                flex: 1,
                xtype: 'grid',
                height: '100%',
                sortableColumns: false,
                columns: [
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
                ]
            }
        ]

        this.callParent(arguments);
    }
});