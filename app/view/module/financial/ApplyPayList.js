/**
 * Created by Administrator on 2015-06-17.
 */
Ext.define('erp.view.module.financial.ApplyPayList', {
    extend: 'Ext.grid.Panel',
    xtype: 'applypaylist',

    requires: [
        'Ext.data.Store',
        'Ext.data.proxy.Ajax',
        'Ext.data.reader.Json',
        'Ext.form.Panel',
        'Ext.form.field.File',
        'Ext.form.field.Text',
        'Ext.form.field.TextArea',
        'Ext.window.Window'
    ],

    initComponent: function () {
        var me = this;

        me.columns = [
            {text: '付款类型', dataIndex: 'pay_type',renderer:function(){return "采购付款";}},
            {text: '收款公司', dataIndex: 'receive_money_company',flex:1},
            {text: '公司账号', dataIndex: 'company_bank_no',flex:1},
            {text: '开户行', dataIndex: 'company_open_bank',flex:1},
            {text: '付款金额', dataIndex: 'money'},
            {text: '用途', dataIndex: 'pay_function',flex:2},
            {text: '最后付款日期', dataIndex: 'last_pay_day'},
            {text: '操作', dataIndex: 'pay_function',flex:1}
        ];
        me.store = Ext.create('Ext.data.Store', {
            autoLoad: true,
            fields: ['receive_money_company', 'company_bank_no', 'company_open_bank', 'money', 'pay_function', 'pay_function', "pay_type","status"],
            proxy: {
                type: 'ajax',
                url: apiBaseUrl + '/Financial/Index/getApplyPayList',
                reader: {
                    type: 'json',
                    rootProperty: 'data',
                    totalProperty: 'total'
                }
            }
        });
        me.selModel = 'checkboxmodel';
        me.sortableColumns = false;
        me.listeners = {
            rowdblclick:function(gp,record){
                console.log(record);
                var status = record.get("status");
                if(status == 0){
                    Ext.create('Ext.window.Window',{
                        layout:'fit',
                        bodyPadding:10,
                        title:"付款单",
                        items:[
                            {
                                xtype:'form',
                                url:apiBaseUrl+'/Financial/Index/pay',
                                method:'POST',
                                defaults:{
                                    anchor: '100%',
                                    xtype: 'textfield',
                                    allowBlank: false,
                                    disabled:true,
                                    margin: 10
                                },
                                items:[
                                    {
                                        fieldLabel: '收款公司',
                                        name: 'receive_money_company',
                                        value:record.get("receive_money_company")
                                    },
                                    {
                                        fieldLabel: '公司账号',
                                        name: 'company_bank_no',
                                        value:record.get("company_bank_no")
                                    },
                                    {
                                        fieldLabel: '开户行',
                                        name: 'company_open_bank',
                                        value:record.get("company_open_bank")
                                    },
                                    {
                                        fieldLabel: '付款金额',
                                        name: 'money',
                                        value:record.get("money")
                                    },
                                    {
                                        fieldLabel: '最后付款日期',
                                        name: 'last_pay_day',
                                        value:record.get("last_pay_day")

                                    },
                                    {
                                        fieldLabel: '用途',
                                        name: 'pay_function',
                                        value:record.get("pay_function")
                                    },
                                    {
                                        fieldLabel: '欧元金额',
                                        name: 'EUR',
                                        allowBlank:false,
                                        disabled:false
                                    },
                                    {
                                        fieldLabel: '汇率',
                                        name: 'rate',
                                        allowBlank:false,
                                        disabled:false
                                    },
                                    {
                                        fieldLabel: '人民币',
                                        name: 'RMB',
                                        allowBlank:false,
                                        disabled:false
                                    },
                                    {
                                        fieldLabel: '付款凭证',
                                        name: 'fileinfo',
                                        xtype:'filefield',
                                        buttonText: '上传',
                                        allowBlank:false,
                                        disabled:false
                                    },
                                    {
                                        fieldLabel: '备注',
                                        name: 'mark',
                                        xtype:'textarea',
                                        allowBlank:false,
                                        disabled:false
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
                                            var form = this.up('form').getForm();
                                            if (form.isValid()) {
                                                form.submit({
                                                    params:{
                                                        id:record.get("id"),
                                                        order_no:record.get("order_no"),
                                                        batch_no:record.get("batch_no")
                                                    },
                                                    waitMsg:'正在提交付款...',
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
                        ]
                    }).show()
                    return;
                }

            }
        }
        me.callParent();
    }
});