Ext.define('erp.view.window.PurchasePayWin', {
    extend: 'Ext.window.Window',
    requires: [
        'Ext.data.Store',
        'Ext.data.proxy.Ajax',
        'Ext.data.reader.Json',
        'Ext.form.Panel',
        'Ext.form.field.ComboBox',
        'Ext.form.field.Date',
        'Ext.form.field.Number',
        'Ext.form.field.Text',
        'Ext.form.field.TextArea',
        'Ext.layout.container.Anchor'
    ],
    xtype: 'purchasepaywin',
    layout: 'anchor',
    modal: true,
    initComponent: function () {
        var me = this, fields;
        console.log(me.batch_no,me.title);
        Ext.Ajax.request({
            async: true,
            method: 'POST',
            params: {
                order_no: me.order_no
            },
            url: apiBaseUrl + '/index.php/Purchasing/buyer/getSupplierInfo',
            success: function (res) {
                var json = Ext.decode(res.responseText);
                if (!json.success) {
                    Ext.alert("系统提示", json.msg);
                    me.destroy();
                    return;
                }
                //console.log(json.data);
                var company = me.down("textfield[name=receive_money_company]"),
                    bank_no = me.down("textfield[name=company_bank_no]"),
                    bank_name = me.down("textfield[name=company_open_bank]");
                company.setValue(json.data.name);
                bank_no.setValue(json.data.bank_no);
                bank_name.setValue(json.data.bank_name);

                var rv = company.getRawValue();
                company.setValue(Ext.util.Format.htmlDecode(rv));
                company.setDisabled(false);
                bank_no.setDisabled(false);
                bank_name.setDisabled(false);
            },
            failure: function () {
                Ext.alert("系统提示", "网络请求错误,请重试!");
                me.destroy();
            }
        });
        me.width = 400;
        if (me.title == "申请定金") {
            fields = [
                {fieldLabel: '收款公司', name: 'receive_money_company', disabled: true},
                {fieldLabel: '公司账号', name: 'company_bank_no', disabled: true},
                {fieldLabel: '开户行', name: 'company_open_bank', disabled: true},
                {fieldLabel: '合同号', name: 'contract_no'},
                {fieldLabel: '付款金额(欧)', xtype: 'numberfield', name: 'total', value: me.total,decimalPrecision:5},
                {fieldLabel: '汇率', name: 'exchange_rate'},
                {fieldLabel: '定金百分比', xtype: 'numberfield',minValue:0,maxValue:100, name: 'percent',listeners:{
                    blur:function(){
                        if(!this.isValid()) return;
                        var percent = this.getValue(),form = this.up("form"),
                            total = form.down("numberfield[name=total]").getValue(),
                            money = parseFloat((parseFloat(total) * percent)/100);
                        form.down("textfield[name=money]").setValue(money);
                    }
                },columnWidth:0.95,margin:'5 0 5 5'},
                {xtype:'displayfield',hideLabel:true,value:'%',columnWidth:0.05,margin:'5 5 5 0'},
                {fieldLabel: '定金付款金额(欧)', name: 'money',decimalPrecision:5},
                {
                    fieldLabel: '最后付款日期',
                    name: 'last_pay_day',
                    xtype: 'datefield',
                    editable: false,
                    format: 'Y-m-d',
                    value: new Date()
                },
                {fieldLabel: '用途', name: 'pay_function', xtype: 'textarea', allowBlank: true}
            ];
        } else {
            fields = [
                {fieldLabel: '收款公司', name: 'receive_money_company', disabled: true},
                {fieldLabel: '公司账号', name: 'company_bank_no', disabled: true},
                {fieldLabel: '开户行', name: 'company_open_bank', disabled: true},
                {fieldLabel: '合同号', name: 'contract_no'},
                {fieldLabel: '汇率', name: 'exchange_rate'},
                {fieldLabel: '付款金额(欧)', xtype: 'numberfield', name: 'money', value: me.total,decimalPrecision:5},
                {
                    fieldLabel: '最后付款日期',
                    name: 'last_pay_day',
                    xtype: 'datefield',
                    editable: false,
                    format: 'Y-m-d',
                    value: new Date()
                },
                {fieldLabel: '用途', name: 'pay_function', xtype: 'textarea', allowBlank: true}
            ];
        }
        me.items = [
            {
                xtype: 'form',
                url: apiBaseUrl + '/index.php' + me.url + '?api=1',
                method: 'POST',
                layout:'column',
                defaults: {
                    anchor: '100%',
                    xtype: 'textfield',
                    allowBlank: false,
                    margin: 5,
                    columnWidth:1,
                    labelWidth:110,
                    labelAlign: 'right'
                },
                bodyPadding: 10,
                items: fields,
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
                            var form = this.up('form').getForm();
                            if (form.isValid()) {
                                form.submit({
                                    params: {
                                        status_id: me.status_id,
                                        order_no: me.order_no,
                                        batch_no: me.batch_no,
                                        pay_type: me.title
                                    },
                                    waitMsg: '正在提交...',
                                    success: function (form, action) {
                                        me.destroy();
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
        ];

        me.callParent();
    }
});