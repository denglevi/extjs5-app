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
                var company = me.down("textfield[name=receive_money_company]"),
                    store = Ext.create("Ext.data.Store",{
                        fields:[],
                        data:json.data
                    });
                company.setStore(store);

                company.setDisabled(false);
            },
            failure:function(){
                Ext.alert("系统提示","网络请求错误,请重试!");
                me.destroy();
            }
        });
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
                bodyPadding:10,
                items:[
                    {
                        fieldLabel: '报关公司',
                        name: 'receive_money_company',
                        xtype:'combo',
                        displayField:'name',
                        valueField:'name',
                        editable:false,
                        listeners:{
                            change:function(obj,newVal,oldVal){
                                var items = obj.getStore().getData().items,len=items.length;
                                for(var i=0;i<len;++i){
                                    if(newVal == items[i].get("name")){
                                        var no =me.down("textfield[name=company_bank_no]"),
                                            bank = me.down("textfield[name=company_open_bank]");
                                        no.setValue(items[i].get("bank_account"));
                                        bank.setValue(items[i].get("open_bank"));

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
                        name: 'company_bank_no',
                        disabled:true
                    },
                    {
                        fieldLabel: '开户行',
                        name: 'company_open_bank',
                        disabled:true
                    },
                    {
                        fieldLabel: '付款金额',
                        xtype:'numberfield',
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
                        xtype: 'textarea',
                        allowBlank:true
                    },
                    //{
                    //    fieldLabel: '选择付款人',
                    //    name: 'payer',
                    //    xtype: 'combo',
                    //    editable: false,
                    //    displayField: 'username',
                    //    valueField: 'id',
                    //    //queryMode:'local',
                    //    store:Ext.create('Ext.data.Store',{
                    //        //autoLoad:true,
                    //        fields:['id','username'],
                    //        proxy: {
                    //            type: 'ajax',
                    //            url: apiBaseUrl+'/index.php/Purchasing/Buyer/getPayer',
                    //            reader: {
                    //                type: 'json',
                    //                rootProperty: 'data'
                    //            }
                    //        }
                    //    })
                    //}
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
                                        batch_no:me.batch_no,
                                        pay_type:me.title
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