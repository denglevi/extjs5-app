/**
 * Created by Administrator on 2015-07-05.
 */
Ext.define('erp.view.window.AddPassCustomPayWin',{
    extend:'Ext.window.Window',
    requires: [
        'Ext.data.Store',
        'Ext.data.proxy.Ajax',
        'Ext.data.reader.Json',
        'Ext.form.Panel',
        'Ext.form.field.ComboBox',
        'Ext.form.field.Date',
        'Ext.form.field.Text',
        'Ext.form.field.TextArea',
        'Ext.layout.container.Anchor'
    ],
    xtype:'addpasscustompaywin',
    layout:'anchor',
    bodyPadding:10,
    initComponent:function(){
        var me = this;
        me.items=[
            {
                xtype:'form',
                url:apiBaseUrl+'/index.php'+me.url+'?api=1',
                method:'POST',
                defaults:{
                    anchor: '100%',
                    xtype: 'textfield',
                    allowBlank: false,
                    margin: 10
                },
                items:[
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
                        value:me.total
                    },
                    {
                        fieldLabel: '最后付款日期',
                        name: 'last_pay_day',
                        xtype: 'datefield',
                        editable: false,
                        format: 'Y-m-d',
                        value:new Date()

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
                        store:Ext.create('Ext.data.Store',{
                            //autoLoad:true,
                            fields:['id','username'],
                            proxy: {
                                type: 'ajax',
                                url: apiBaseUrl+'/index.php/Purchasing/Buyer/getPayer',
                                reader: {
                                    type: 'json',
                                    rootProperty: 'data'
                                }
                            }
                        })
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
                                        status_id:me.status_id,
                                        order_no:me.order_no,
                                        batch_no:me.batch_no
                                    },
                                    waitMsg:'正在提交付款申请...',
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
            },
        ];

        me.callParent();
    }
});
