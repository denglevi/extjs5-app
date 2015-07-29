/**
 * Created by Administrator on 2015-06-18.
 */
Ext.define('erp.view.window.PayFormWin', {
    extend: 'Ext.window.Window',
    requires: [
        'Ext.Array',
        'Ext.form.Panel',
        'Ext.form.field.Display',
        'Ext.form.field.File',
        'Ext.form.field.Number',
        'Ext.form.field.Text',
        'Ext.form.field.TextArea',
        'Ext.layout.container.Column',
        'Ext.layout.container.Fit'
    ],
    xtype: 'payformwin',
    title: "付款单",
    width: 600,
    layout: 'fit',
    modal: true,
    initComponent: function () {
        var me = this,
            rate = '7.0505';

        this.items = [
            {
                xtype: 'form',
                url: apiBaseUrl + '/index.php/Financial/Index/pay',
                method: 'POST',
                bodyPadding: 10,
                layout: 'column',
                defaults: {
                    anchor: '100%',
                    xtype: 'textfield',
                    allowBlank: false,
                    disabled: false,
                    margin: 5,
                    columnWidth: 0.5,
                    labelAlign: 'right',
                    labelWidth: 110
                },
                items: this.getFieldItems(rate),
                buttons: this.getBtns(rate)
            }
        ]
        this.callParent();
    },

    getFieldItems: function (rate) {
        var record = this.record, me = this, pay_money;
        if (me.record.get("pay_type") == "申请报关付款") {
            pay_money = {xtype: 'displayfield', fieldLabel: '申请付款金额', name: 'money', value: record.get("money")};
        } else {
            pay_money = {xtype: 'displayfield', fieldLabel: '申请付款金额(欧)', name: 'money', value: record.get("money")};
        }
        var normal = [
            {
                xtype: 'displayfield',
                fieldLabel: '收款公司',
                name: 'receive_money_company',
                value: record.get("receive_money_company")
            },
            {xtype: 'displayfield', fieldLabel: '公司账号', name: 'company_bank_no', value: record.get("company_bank_no")},
            {xtype: 'displayfield', fieldLabel: '最后付款日期', name: 'last_pay_day', value: record.get("last_pay_day")},
            pay_money,
            {
                xtype: 'displayfield',
                fieldLabel: '开户行',
                name: 'company_open_bank',
                value: record.get("company_open_bank")
            },
            {
                xtype: 'displayfield',
                fieldLabel: '用途',
                name: 'pay_function',
                value: record.get("pay_function"),
                columnWidth: 1
            }
        ];
        console.log(record);
        if (this.status == 0) {
            var newFields;
            if (me.record.get("pay_type") != "申请报关付款") {
                newFields = [
                    {
                        fieldLabel: '实际付款金额(欧)', name: 'EUR', allowBlank: false, xtype: 'numberfield',
                        listeners: {
                            blur: function () {
                                var form = me.down("form"),
                                    rate = form.down("field[name=rate]").getValue(),
                                    EUR = form.down("field[name=EUR]").getValue();

                                form.down("field[name=RMB]").setValue(parseFloat((rate * EUR).toFixed(10)));
                            }
                        }
                    },
                    {xtype: 'displayfield', fieldLabel: '汇率', name: 'rate', value: rate},
                    {fieldLabel: '人民币', editable: false, name: 'RMB', allowBlank: false},
                    {
                        fieldLabel: '付款凭证',
                        name: 'fileinfo[]',
                        xtype: 'filefield',
                        buttonText: '上传',
                        allowBlank: false,
                        disabled: false,
                        editable: true,
                    },
                    {fieldLabel: '备注', name: 'mark', xtype: 'textarea', allowBlank: true, columnWidth: 1}
                ];
            } else {
                newFields = [
                    //{
                    //    fieldLabel: '实际付款金额(欧)', name: 'EUR', allowBlank: false, xtype: 'numberfield',
                    //    listeners: {
                    //        blur: function () {
                    //            var form = me.down("form"),
                    //                rate = form.down("field[name=rate]").getValue(),
                    //                EUR = form.down("field[name=EUR]").getValue();
                    //
                    //            form.down("field[name=RMB]").setValue(parseFloat((rate * EUR).toFixed(10)));
                    //        }
                    //    }
                    //},
                    //{xtype: 'displayfield', fieldLabel: '汇率', name: 'rate', value: rate},
                    {fieldLabel: '实际付款金额', editable: true, name: 'RMB', allowBlank: false},
                    {
                        fieldLabel: '付款凭证',
                        name: 'fileinfo[]',
                        xtype: 'filefield',
                        buttonText: '上传',
                        allowBlank: false,
                        disabled: false,
                        editable: true,
                    },
                    {fieldLabel: '备注', name: 'mark', xtype: 'textarea', allowBlank: true, columnWidth: 1}
                ];
            }
            return Ext.Array.merge(normal, newFields);
        }
        var info = Ext.decode(record.get("info"));
        console.log(record, info);
        var newFields;
        if (me.record.get("pay_type") == "申请报关付款") {
            newFields = [
                //{xtype:'displayfield',fieldLabel: '欧元金额', name: 'EUR', value: info.EUR},
                //{xtype:'displayfield',fieldLabel: '汇率', name: 'rate', value: info.rate},
                {xtype: 'displayfield', fieldLabel: '实际付款金额', name: 'RMB', value: info.RMB},
                {
                    xtype: 'displayfield',
                    fieldLabel: '付款凭证',
                    name: 'fileinfo',
                    value: info.fileinfo,
                    renderer: function (val) {
                        return '<a href="' + apiBaseUrl + val + '">付款凭证</a>';
                    }
                },
                {xtype: 'displayfield', fieldLabel: '备注', name: 'mark', value: info.mark, columnWidth: 1}
            ];
        } else {
            newFields = [
                {xtype: 'displayfield', fieldLabel: '实际付款金额(欧)', name: 'EUR', value: info.EUR},
                {xtype: 'displayfield', fieldLabel: '汇率', name: 'rate', value: info.rate},
                {xtype: 'displayfield', fieldLabel: '人民币', name: 'RMB', value: info.RMB},
                {
                    xtype: 'displayfield',
                    fieldLabel: '付款凭证',
                    name: 'fileinfo',
                    value: info.fileinfo,
                    renderer: function (val) {
                        return '<a target="_blank" href="' + apiBaseUrl + val + '">付款凭证</a>';
                    }
                },
                {xtype: 'displayfield', fieldLabel: '备注', name: 'mark', value: info.mark, columnWidth: 1}
            ];
        }


        return Ext.Array.merge(normal, newFields);
    },
    getBtns: function (rate) {
        var record = this.record, me = this;
        if (this.status == 1) return null;
        return [
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
                    var form = this.up('form').getForm(),
                        vals = form.getValues();
                    var money = this.up('form').down("displayfield[name=money]").getValue();
                    if (me.record.get("pay_type") == "申请报关付款") {
                        if (vals.RMB != money) {
                            Ext.Msg.alert('系统提示', "实际付款金额和申请付款金额不等!");
                            return;
                        }
                    }else{
                        if (vals.EUR != money) {
                            Ext.Msg.alert('系统提示', "实际付款金额和申请付款金额不等!");
                            return;
                        }
                    }
                    if (form.isValid()) {
                        form.submit({
                            params: {
                                id: record.get("id"),
                                order_no: record.get("order_no"),
                                batch_no: record.get("batch_no"),
                                rate: rate
                            },
                            waitMsg: '正在提交付款...',
                            success: function (form, action) {
                                console.log(action.result);
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
    }
});