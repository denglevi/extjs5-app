/**
 * Created by Administrator on 2015-07-28.
 */
Ext.define('erp.view.window.ApplyPassCustomPayWin',{
    extend:'Ext.window.Window',
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
    xtype:'applypasscustompaywin',
    layout:'anchor',
    modal:true,
    initComponent:function(){
        var me = this;
        Ext.Ajax.request({
            async:true,
            method:'POST',
            params:{
                order_no:me.order_no
            },
            url:apiBaseUrl+'/index.php/Purchasing/buyer/getCustomCompanyInfo',
            success:function(res){
                var json = Ext.decode(res.responseText);
                if(!json.success){
                    Ext.alert("系统提示",json.msg);
                    me.destroy();
                    return;
                }
                console.log(json.data);
                var customs_company = me.down("#custom_pay").down("textfield[name=customs_receive_money_company]"),
                    store = Ext.create("Ext.data.Store",{
                        fields:[],
                        data:json.data.custom_company
                    });
                customs_company.setStore(store);
                customs_company.setDisabled(false);
                var logistics_company = me.down("#logistics_pay").down("textfield[name=logistics_receive_money_company]"),
                    store = Ext.create("Ext.data.Store",{
                        fields:[],
                        data:json.data.logistics_company
                    });
                logistics_company.setStore(store);

                logistics_company.setDisabled(false);
            },
            failure:function(){
                Ext.alert("系统提示","网络请求错误,请重试!");
                me.destroy();
            }
        });
        me.items=[
            {
                xtype:'form',
                url: apiBaseUrl + '/index.php/Purchasing/Customs/applyPassCustomPay',
                method:'POST',
                defaults:{
                    anchor: '100%',
                    allowBlank: false,
                    margin: 5
                },
                bodyPadding:10,
                items:[
                    {
                        xtype:'fieldset',
                        title:'报关费用',
                        layout:'column',
                        itemId:'custom_pay',
                        defaults:{
                            anchor: '100%',
                            xtype: 'textfield',
                            allowBlank: false,
                            columnWidth:0.5,
                            margin: 10,
                            labelAlign:'right'
                        },
                        items:[
                            {
                                fieldLabel: '报关公司',
                                name: 'customs_receive_money_company',
                                xtype:'combo',
                                displayField:'name',
                                valueField:'name',
                                disabled:true,
                                editable:false,
                                listeners:{
                                    change:function(obj,newVal,oldVal){
                                        var items = obj.getStore().getData().items,len=items.length;
                                        for(var i=0;i<len;++i){
                                            if(newVal == items[i].get("name")){
                                                var no =obj.up("fieldset").down("textfield[name=customs_company_bank_no]"),
                                                    bank = obj.up("fieldset").down("textfield[name=customs_company_open_bank]");
                                                no.setValue(items[i].get("bank_account"));
                                                bank.setValue(items[i].get("address"));

                                                no.setDisabled(false);
                                                bank.setDisabled(false);
                                                break;
                                            }
                                        }

                                    }
                                }
                            },
                            {
                                fieldLabel: '公司账号',
                                name: 'customs_company_bank_no',
                                disabled:true
                            },
                            {
                                fieldLabel: '开户行',
                                name: 'customs_company_open_bank',
                                disabled:true
                            },
                            {
                                fieldLabel: '付款金额',
                                xtype:'numberfield',
                                name: 'customs_money',
                                value:me.total
                            },
                            {
                                fieldLabel: '最后付款日期',
                                name: 'customs_last_pay_day',
                                xtype: 'datefield',
                                editable: false,
                                format: 'Y-m-d',
                                value:new Date()

                            },
                            {
                                fieldLabel: '用途',
                                name: 'customs_pay_function',
                                xtype: 'textarea',
                                allowBlank:true
                            }
                        ]
                    },{
                        xtype:'fieldset',
                        title:'国际物流费用',
                        layout:'column',
                        itemId:'logistics_pay',
                        defaults:{
                            anchor: '100%',
                            xtype: 'textfield',
                            allowBlank: false,
                            columnWidth:0.5,
                            labelAlign:'right',
                            margin: 10
                        },
                        items:[
                            {
                                fieldLabel: '物流公司',
                                name: 'logistics_receive_money_company',
                                xtype:'combo',
                                displayField:'name',
                                valueField:'name',
                                editable:false,
                                listeners:{
                                    change:function(obj,newVal,oldVal){
                                        var items = obj.getStore().getData().items,len=items.length;
                                        for(var i=0;i<len;++i){
                                            if(newVal == items[i].get("name")){
                                                var no =obj.up("fieldset").down("textfield[name=logistics_company_bank_no]"),
                                                    bank = obj.up("fieldset").down("textfield[name=logistics_company_open_bank]");
                                                no.setValue(items[i].get("bank_account"));
                                                bank.setValue(items[i].get("address"));

                                                no.setDisabled(false);
                                                bank.setDisabled(false);
                                                break;
                                            }
                                        }

                                    }
                                },
                                disabled:true
                            },
                            {
                                fieldLabel: '公司账号',
                                name: 'logistics_company_bank_no',
                                disabled:true
                            },
                            {
                                fieldLabel: '开户行',
                                name: 'logistics_company_open_bank',
                                disabled:true
                            },
                            {
                                fieldLabel: '付款金额',
                                xtype:'numberfield',
                                name: 'logistics_money',
                                value:me.total
                            },
                            {
                                fieldLabel: '最后付款日期',
                                name: 'logistics_last_pay_day',
                                xtype: 'datefield',
                                editable: false,
                                format: 'Y-m-d',
                                value:new Date()

                            },
                            {
                                fieldLabel: '用途',
                                name: 'logistics_pay_function',
                                xtype: 'textarea',
                                allowBlank:true
                            }
                        ]
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
                                        id:me.pass_customs_id,
                                        next_status:me.pass_customs_next_status,
                                        status:me.pass_customs_status
                                    },
                                    waitMsg:'正在提交...',
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