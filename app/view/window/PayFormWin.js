/**
 * Created by Administrator on 2015-06-18.
 */
Ext.define('erp.view.window.PayFormWin', {
    extend: 'Ext.window.Window',
    requires: [
        'Ext.Array',
        'Ext.form.Panel',
        'Ext.form.field.File',
        'Ext.form.field.Text',
        'Ext.form.field.TextArea',
        'Ext.layout.container.Fit'
    ],
    xtype: 'payformwin',
    layout: 'fit',
    bodyPadding: 10,
    title: "付款单",
    initComponent: function () {
        var me = this;
        this.items = [
            {
                xtype: 'form',
                url: apiBaseUrl + '/Financial/Index/pay',
                method: 'POST',
                defaults: {
                    anchor: '100%',
                    xtype: 'textfield',
                    allowBlank: false,
                    disabled: false,
                    editable:false,
                    margin: 10
                },
                items: this.getFieldItems(),
                buttons: this.getBtns()
            }
        ]
        this.callParent();
    },

    getFieldItems: function () {
        var record = this.record,me=this;
        var edit = this.status == 1?false:true;
        var normal = [
            {fieldLabel: '收款公司', name: 'receive_money_company', value: record.get("receive_money_company")},
            {fieldLabel: '公司账号', name: 'company_bank_no', value: record.get("company_bank_no")},
            {fieldLabel: '开户行', name: 'company_open_bank', value: record.get("company_open_bank")},
            {fieldLabel: '付款金额', name: 'money', value: record.get("money")},
            {fieldLabel: '最后付款日期', name: 'last_pay_day', value: record.get("last_pay_day")},
            {fieldLabel: '用途', name: 'pay_function', value: record.get("pay_function")}
        ];

        if (this.status == 1) {
            var newFields = [
                {
                    fieldLabel: '欧元金额', name: 'EUR', allowBlank: false, disabled: false,editable:edit,
                    listeners: {
                        blur: function () {
                            var form = me.down("form"),
                                rate = form.down("field[name=rate]").getValue(),
                                EUR = form.down("field[name=EUR]").getValue();

                            form.down("field[name=RMB]").setValue(rate * EUR);
                        }
                    }
                },
                {fieldLabel: '汇率', editable:edit,name: 'rate', value: '7.0505'},
                {fieldLabel: '人民币', editable:edit,name: 'RMB', allowBlank: false},
                {
                    fieldLabel: '付款凭证',
                    editable:edit,
                    name: 'fileinfo',
                    xtype: 'filefield',
                    buttonText: '上传',
                    allowBlank: false,
                    disabled: false,
                    editable:true,
                },
                {fieldLabel: '备注',editable:edit, name: 'mark', xtype: 'textarea', allowBlank: false, disabled: false,editable:true,}
            ];
            return Ext.Array.merge(normal,newFields);
        }
        var newFields = [
            {fieldLabel: '欧元金额', editable:edit,name: 'EUR', value: '1111'},
            {fieldLabel: '汇率', editable:edit,name: 'rate', value: '7.0505'},
            {fieldLabel: '人民币', editable:edit,name: 'RMB', value: '1111'},
            {fieldLabel: '付款凭证',editable:edit, name: 'fileinfo', value: '1111'},
            {fieldLabel: '备注', editable:edit,name: 'mark', xtype: 'textarea', value: '1111'}
        ];

        return Ext.Array.merge(normal,newFields);
    },
    getBtns: function () {
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
                    var form = this.up('form').getForm();
                    if (form.isValid()) {
                        form.submit({
                            params: {
                                id: record.get("id"),
                                order_no: record.get("order_no"),
                                batch_no: record.get("batch_no")
                            },
                            waitMsg: '正在提交付款...',
                            success: function (form, action) {
                                console.log(action.result);
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