/**
 * Created by denglevi on 15-6-14.
 */
Ext.define('erp.view.module.purchase.AddPurchaseOrder', {
    extend: 'Ext.container.Container',
    alias: 'widget.addpurchaseorder',
    requires: [
        'Ext.Ajax',
        'Ext.data.Store',
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
                        res = text.data;
                        var form = me.down("form");
                        form.down("combo[name=buyer]").setStore(Ext.create('Ext.data.Store', {
                            fields: ['id', 'username'],
                            data:res.buyer
                        }));
                        form.down("combo[name=supplier]").setStore(Ext.create('Ext.data.Store', {
                            fields: ['id_no', 'name'],
                            data:res.supplier
                        }));
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
                        value:new Date()
                    },
                    {
                        fieldLabel: '供应商',
                        name: 'supplier',
                        xtype: 'combo',
                        editable: false,
                        displayField: 'name',
                        valueField: 'id_no'
                    },
                    {
                        fieldLabel: '买手',
                        name: 'buyer',
                        xtype: 'combo',
                        editable: false,
                        displayField: 'username',
                        valueField: 'id',
                    },
                    {
                        xtype: 'radiogroup',
                        fieldLabel: '订货类型',
                        items: [
                            {boxLabel: '现货', name: 'type', inputValue: 'spot_purchase_order', checked: true},
                            {boxLabel: '期货', name: 'type', inputValue: 'future_purchase_order'}
                        ]
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
                                    waitMsg:'正在导入商品信息...',
                                    url: apiBaseUrl + '/index.php/Purchasing/Buyer/importPurchaseOrderProduct',
                                    success: function (form, action) {
                                        var data = action.result.data;
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
                                    waitMsg:'正在新增...',
                                    //headers: {'Content-Type': 'application/json'},
                                    params:{
                                        products:Ext.encode(me.products)
                                    },
                                    success: function (form, action) {
                                        //me.down("grid").getStore().load();
                                        console.log(action.result);
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
                    {text: '国际款号', dataIndex: 'orderinfo_style', flex: 1},
                    {text: '商品名称', dataIndex: 'orderinfo_name'},
                    {text: '颜色', dataIndex: 'orderinfo_color'},
                    {text: '尺码', dataIndex: 'orderinfo_group'},
                    {text: '数量', dataIndex: 'orderinfo_amount'},
                    {text: '批发价(欧)', dataIndex: 'orderinfo_wholesale'},
                    {text: '总价(欧)', dataIndex: 'orderinfo_nprice'},
                    {text: '官方零售价(欧)', dataIndex: 'orderinfo_official'}
                ]
            }
        ]

        this.callParent(arguments);
    }
});