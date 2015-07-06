/**
 * Created by Administrator on 2015-07-06.
 */
Ext.define('erp.view.module.operation.SalesActivityController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.salesactivity',

    requires: [
        'Ext.form.CheckboxGroup',
        'Ext.form.Panel',
        'Ext.form.field.Checkbox',
        'Ext.form.field.ComboBox',
        'Ext.form.field.Date',
        'Ext.form.field.Text',
        'Ext.layout.container.Anchor',
        'Ext.layout.container.Column',
        'Ext.layout.container.Fit',
        'Ext.window.Window'
    ],

    init:function(){

    },
    addBundledSales:function(btn){
        var form = this.createBundledSalesForm();
        var win = Ext.create('Ext.window.Window',{
            modal:true,
            resizable:false,
            width:600,
            title:'新增捆绑促销活动',
            items:[form]
        });
        win.show();
    },
    createBundledSalesForm:function(){
        var form = Ext.create('Ext.form.Panel',{
            bodyPanel:10,
            layout:{
                type:'column'
            },
            url: apiBaseUrl + '/index.php/Operations/Promotion/addBundledSalesList',
            defaults:{
                xtype:'textfield',
                columnWidth:0.5,
                margin:5,
                allowBlank:false,
                anchor:'100%',
                labelAlign:'right',
                labelWidth:110
            },
            items:[
                {fieldLabel:'活动名称',name:'activity_name'},
                {fieldLabel:'大店',name:'activity_name',xtype:'combo',editable:false},
                {fieldLabel:'开始日期',name:'activity_name',xtype:'datefield',editable:false,format:'Y-m-d'},
                {fieldLabel:'结束日期',name:'activity_name',xtype:'datefield',editable:false,format:'Y-m-d'},
                {fieldLabel:'捆绑数量',name:'activity_name',editable:false},
                {fieldLabel:'捆绑方式',name:'activity_name',xtype:'combo',editable:false},
                {fieldLabel:'换购品数量',name:'activity_name',editable:false},
                {fieldLabel:'是否约束时段',name:'activity_name',xtype:'combo',editable:false},
                {fieldLabel:'开始时段',name:'activity_name',xtype:'combo',editable:false,hidden:true},
                {fieldLabel:'结束时段',name:'activity_name',xtype:'combo',editable:false,hidden:true},
                {fieldLabel:'分级让利',name:'activity_name',xtype:'checkboxfield',editable:false,columnWidth:0.25},
                {fieldLabel:'分级促销',name:'activity_name',xtype:'checkboxfield',editable:false,columnWidth:0.25},
                {fieldLabel:'结算方式限制',name:'activity_name',xtype:'checkboxfield',editable:false,columnWidth:0.25},
                {fieldLabel:'与整单促销叠加',name:'activity_name',xtype:'checkboxfield',editable:false,columnWidth:0.25},
                {fieldLabel:'调价品参与促销',name:'activity_name',xtype:'checkboxfield',editable:false,columnWidth:0.25},
                {fieldLabel:'VIP积分调整',name:'activity_name',xtype:'checkboxfield',editable:false,columnWidth:0.25},
                {fieldLabel:'sku设置促销品',name:'activity_name',xtype:'checkboxfield',editable:false,columnWidth:0.25},
                {fieldLabel:'允许使用折扣券',name:'activity_name',xtype:'checkboxfield',editable:false,columnWidth:0.25},
                {fieldLabel:'限额卡不参与促销',name:'activity_name',xtype:'checkboxfield',editable:false,columnWidth:0.25},
                {fieldLabel:'允许退换货',name:'activity_name',xtype:'checkboxfield',editable:false,columnWidth:0.25},
                {fieldLabel:'买高赠低',name:'activity_name',xtype:'checkboxfield',editable:false,columnWidth:0.5},
                {fieldLabel:'促销日有效',name:'activity_name',xtype:'checkboxfield',editable:false,columnWidth:0.25},
                {fieldLabel:'促销日',xtype:'checkboxgroup',columnWidth:0.75,items:[
                    { boxLabel: '一', name: 'day', inputValue: '1' },
                    { boxLabel: '二', name: 'day', inputValue: '1' },
                    { boxLabel: '三', name: 'day', inputValue: '1' },
                    { boxLabel: '四', name: 'day', inputValue: '1' },
                    { boxLabel: '五', name: 'day', inputValue: '1' },
                    { boxLabel: '六', name: 'day', inputValue: '1' },
                    { boxLabel: '日', name: 'day', inputValue: '1' }
                ]},
                {fieldLabel:'适用对象',name:'activity_name',xtype:'checkboxgroup',items:[
                    { boxLabel: '普通', name: 'object', inputValue: '1' },
                    { boxLabel: 'VIP', name: 'object', inputValue: '1' }
                ]},
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
                        var form = this.up('form').getForm();
                        if (form.isValid()) {
                            form.submit({
                                waitMsg: '正在新增...',
                                success: function (form, action) {
                                    console.log(action.result);
                                    win.destroy();
                                    btn.up("grid").getStore().load();
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
        });

        return form;
    }
})