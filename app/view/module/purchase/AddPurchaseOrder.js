/**
 * Created by denglevi on 15-6-14.
 */
Ext.define('erp.view.module.purchase.AddPurchaseOrder', {
    extend: 'Ext.container.Container',
    alias: 'widget.addpurchaseorder',
    requires: [
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
        //'Ext.panel.Panel',
        //'erp.view.module.purchase.PurchaseController',
        //'erp.view.module.purchase.SupplierMngController'
        //'erp.view.module.purchase.SupplierMngController'
        //'erp.view.module.purchase.SupplierMngController'
    ],
    //controller: 'suppliermng',
    //viewModel: {
    //    type: 'suppliermng'
    //},
    initComponent: function () {
        //this.listeners = {
        //    afterrender:'aaa'
        //};
        var me = this;
        this.layout = 'hbox';

        this.items = [
            {
                xtype:'form',
                width:350,
                height:'100%',
                border:true,
                layout: 'anchor',
                bodyPadding:5,
                method:'POST',
                url:'http://localhost:8080/',
                defaults:{
                    anchor: '100%',
                    xtype:'textfield',
                    allowBlank:false,
                    margin: 10
                },
                items:[
                    {
                        fieldLabel:'制单日期',
                        name:'date',
                        xtype:'datefield',
                        editable:false
                    },
                    {
                        fieldLabel:'供应商',
                        name:'date',
                        xtype:'combo',
                        editable:false,
                            store:Ext.create('Ext.data.Store', {
                            fields: ['abbr', 'name'],
                            data : [
                                {"abbr":"AL", "name":"Alabama"},
                                {"abbr":"AK", "name":"Alaska"},
                                {"abbr":"AZ", "name":"Arizona"}
                            ]}),
                        displayField: 'name',
                        valueField: 'abbr'
                    },
                    {
                        fieldLabel:'买手',
                        name:'date',
                        xtype:'combo',
                        editable:false,
                            store:Ext.create('Ext.data.Store', {
                                fields: ['abbr', 'name'],
                                data : [
                                    {"abbr":"AL", "name":"Alabama"},
                                    {"abbr":"AK", "name":"Alaska"},
                                    {"abbr":"AZ", "name":"Arizona"}
                                ]}),
                        displayField: 'name',
                        valueField: 'abbr',
                    },
                    {
                        xtype: 'radiogroup',
                        fieldLabel: '订货类型',
                        //cls: 'x-check-group-alt',
                        items: [
                            {boxLabel: '现货', name: 'rb-auto', inputValue: 2, checked: true},
                            {boxLabel: '期货', name: 'rb-auto', inputValue: 5}
                        ]
                    },
                    {
                        xtype: 'filefield',
                        name: 'excel_file',
                        buttonText: '导入商品',
                        listeners:{
                            change:function(){
                                this.up("form").getForm().submit({
                                    clientValidation: true,
                                    url: 'updateConsignment.php',
                                    success: function(form, action) {
                                        Ext.Msg.alert('Success', action.result.msg);
                                    },
                                    failure: function(form, action) {
                                        switch (action.failureType) {
                                            case Ext.form.action.Action.CLIENT_INVALID:
                                                Ext.Msg.alert('Failure', 'Form fields may not be submitted with invalid values');
                                                break;
                                            case Ext.form.action.Action.CONNECT_FAILURE:
                                                Ext.Msg.alert('Failure', 'Ajax communication failed');
                                                break;
                                            case Ext.form.action.Action.SERVER_INVALID:
                                                Ext.Msg.alert('Failure', action.result.msg);
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
                            //if (me.getViewModel().get("fieldDisabled")) {
                            //    Ext.Msg.alert('系统提示', "当前表单处于不可编辑状态，请激活!");
                            //    return;
                            //}
                            var form = this.up('form').getForm();
                            if (form.isValid()) {
                                form.submit({
                                    success: function (form, action) {
                                        //me.down("grid").getStore().load();
                                        Ext.Msg.alert('成功', action.result.msg);
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
                title:'导入商品信息',
                flex:1,
                xtype:'grid',
                height:'100%',
                sortableColumns:false,
                columns:[
                    {text:'国际款号',dataIndex:'style_no',flex:2},
                    {text:'商品名称',dataIndex:'name'},
                    {text:'颜色',dataIndex:'color'},
                    {text:'尺码',dataIndex:'size',flex:1},
                    {text:'数量',dataIndex:'num'},
                    {text:'批发价',dataIndex:'batch_price'},
                    {text:'总价',dataIndex:'total_price'},
                    {text:'官方零售价',dataIndex:'retail_price'}
                ],
                store:Ext.create('Ext.data.Store',{
                    fields:["style_no","name",'color','size','num','batch_price','total_price','retail_price'],
                    autoLoad:true,
                    data:[
                        {style_no:'xxx',name:'xxx',color:'xxx',size:'xxx',num:'xxx',batch_price:'xxx',total_price:'xxx',retail_price:'xxx'},
                        {style_no:'xxx',name:'xxx',color:'xxx',size:'xxx',num:'xxx',batch_price:'xxx',total_price:'xxx',retail_price:'xxx'},
                        {style_no:'xxx',name:'xxx',color:'xxx',size:'xxx',num:'xxx',batch_price:'xxx',total_price:'xxx',retail_price:'xxx'},
                        {style_no:'xxx',name:'xxx',color:'xxx',size:'xxx',num:'xxx',batch_price:'xxx',total_price:'xxx',retail_price:'xxx'},
                        {style_no:'xxx',name:'xxx',color:'xxx',size:'xxx',num:'xxx',batch_price:'xxx',total_price:'xxx',retail_price:'xxx'},
                        {style_no:'xxx',name:'xxx',color:'xxx',size:'xxx',num:'xxx',batch_price:'xxx',total_price:'xxx',retail_price:'xxx'},
                        {style_no:'xxx',name:'xxx',color:'xxx',size:'xxx',num:'xxx',batch_price:'xxx',total_price:'xxx',retail_price:'xxx'},
                        {style_no:'xxx',name:'xxx',color:'xxx',size:'xxx',num:'xxx',batch_price:'xxx',total_price:'xxx',retail_price:'xxx'}
                    ]
                })
            }
        ]

        this.callParent(arguments);
    }
});