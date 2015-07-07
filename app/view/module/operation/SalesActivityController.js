/**
 * Created by Administrator on 2015-07-06.
 */
Ext.define('erp.view.module.operation.SalesActivityController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.salesactivity',

    requires: [
        'Ext.Ajax',
        'Ext.data.Store',
        'Ext.form.CheckboxGroup',
        'Ext.form.Panel',
        'Ext.form.RadioGroup',
        'Ext.form.field.Checkbox',
        'Ext.form.field.ComboBox',
        'Ext.form.field.Date',
        'Ext.form.field.Text',
        'Ext.form.field.Time',
        'Ext.layout.container.Column',
        'Ext.window.Window'
    ],

    init:function(){

    },
    addBundledSales:function(btn){
        var win = Ext.create('Ext.window.Window',{
            modal:true,
            resizable:false,
            width:600,
            title:'新增捆绑促销活动'
        });
        var form = this.createBundledSalesForm(win);
        win.add(form);
        win.show();
        win.on("beforedestroy",function(){
            btn.up("grid").getStore().load();
        });
    },
    createBundledSalesForm:function(win){
        var form = Ext.create('Ext.form.Panel',{
            bodyPanel:10,
            layout:{
                type:'column'
            },
            url: apiBaseUrl + '/index.php/Operations/Promotion/addBundledSalesList',
            method:'POST',
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
                {fieldLabel:'大店',name:'shop',xtype:'combo',editable:false,disabled:true,displayField:'shops_name',valueField:'id'},
                {fieldLabel:'开始日期',name:'start_date',xtype:'datefield',editable:false,format:'Y-m-d'},
                {fieldLabel:'结束日期',name:'end_date',xtype:'datefield',editable:false,format:'Y-m-d'},
                {fieldLabel:'捆绑数量',name:'bundled_num'},
                {fieldLabel:'捆绑方式',name:'bundled_type',xtype:'combo',displayField:'name',valueField:'val',editable:false,store:Ext.create('Ext.data.Store',{
                    fields:['name','val'],
                    data:[
                        {name:'任意捆绑',val:'1'},
                        {name:'不同商品范围捆绑',val:'2'},
                        {name:'同款商品捆绑',val:'3'}
                    ]
                })},
                {fieldLabel:'促销类型',name:'sales_type',xtype:'combo',displayField:'name',valueField:'val',editable:false,store:Ext.create('Ext.data.Store',{
                    fields:['name','val'],
                    data:[
                        {name:'折扣',val:'1'},
                        {name:'优惠价',val:'2'},
                        {name:'捆绑价',val:'3'}
                    ]
                })},
                {fieldLabel:'换购品数量',name:'exchange_num'},
                {fieldLabel:'是否约束时段',xtype:'radiogroup',editable:false,items: [
                    {boxLabel: '是', name: 'has_time_limit', inputValue: 1},
                    {boxLabel: '否', name: 'has_time_limit', inputValue: 0}
                ],listeners:{
                    change:function(btn,newVal,oldVal){
                        if(newVal.type == 1) {

                            form.down("timefield[name=start_time]").setHidden(false);
                            form.down("timefield[name=start_time]").setDisabled(false);
                            form.down("timefield[name=end_time]").setHidden(false);
                            form.down("timefield[name=end_time]").setDisabled(false);
                            return;
                        }
                        form.down("timefield[name=start_time]").setHidden(true);
                        form.down("timefield[name=start_time]").setDisabled(true);
                        form.down("timefield[name=end_time]").setHidden(true);
                        form.down("timefield[name=end_time]").setDisabled(true);
                        return;
                    }
                }
                },
                {fieldLabel:'开始时段',name:'start_time',xtype:'timefield',editable:false,hidden:true,disabled:true},
                {fieldLabel:'结束时段',name:'end_time',xtype:'timefield',editable:false,hidden:true,disabled:true},
                {fieldLabel:'分级让利',name:'checkbox_1',xtype:'checkboxfield',editable:false,columnWidth:0.25},
                {fieldLabel:'分级促销',name:'checkbox_2',xtype:'checkboxfield',editable:false,columnWidth:0.25},
                {fieldLabel:'结算方式限制',name:'checkbox_3',xtype:'checkboxfield',editable:false,columnWidth:0.25},
                {fieldLabel:'与整单促销叠加',name:'checkbox_4',xtype:'checkboxfield',editable:false,columnWidth:0.25},
                //{fieldLabel:'调价品参与促销',name:'checkbox_5',xtype:'checkboxfield',editable:false,columnWidth:0.25},
                {fieldLabel:'VIP积分调整',name:'checkbox_6',xtype:'checkboxfield',editable:false,columnWidth:0.25},
                {fieldLabel:'sku设置促销品',name:'checkbox_7',xtype:'checkboxfield',editable:false,columnWidth:0.25},
                {fieldLabel:'允许使用折扣券',name:'checkbox_8',xtype:'checkboxfield',editable:false,columnWidth:0.25},
                //{fieldLabel:'限额卡不参与促销',name:'checkbox_9',xtype:'checkboxfield',editable:false,columnWidth:0.25},
                {fieldLabel:'允许退换货',name:'checkbox_10',xtype:'checkboxfield',editable:false,columnWidth:0.25},
                //{fieldLabel:'买高赠低',name:'checkbox_11',xtype:'checkboxfield',editable:false,columnWidth:0.5},
                {fieldLabel:'促销日有效',name:'checkbox_12',xtype:'checkboxfield',editable:false,columnWidth:0.25,listeners:{
                    change:function(obj,newVal,oldVal){
                        if(newVal){
                            form.down("#day").setDisabled(false);
                            return;
                        }
                        form.down("#day").setDisabled(true);
                    }
                }},
                {fieldLabel:'促销日',itemId:"day",disabled:true,xtype:'checkboxgroup',columnWidth:0.75,items:[
                    { boxLabel: '一', name: 'day[]', inputValue: '1' },
                    { boxLabel: '二', name: 'day[]', inputValue: '2' },
                    { boxLabel: '三', name: 'day[]', inputValue: '3' },
                    { boxLabel: '四', name: 'day[]', inputValue: '4' },
                    { boxLabel: '五', name: 'day[]', inputValue: '5' },
                    { boxLabel: '六', name: 'day[]', inputValue: '6' },
                    { boxLabel: '日', name: 'day[]', inputValue: '7' }
                ]},
                {fieldLabel:'适用对象',name:'checkbox_14',xtype:'checkboxgroup',items:[
                    { boxLabel: '普通', name: 'obj[]', inputValue: '1' },
                    { boxLabel: 'VIP', name: 'obj[]', inputValue: '2' }
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
        Ext.Ajax.request({
            url: apiBaseUrl + '/index.php/operations/ResultsAllot/getBaseData',
            params: {
                shop: 0
            },
            method:'POST',
            async:true,
            success:function(res){
                var json = Ext.decode(res.responseText);
                if(!json.success){
                    Ext.toast(json.msg,"系统提示");
                    return;
                }

                var store = Ext.create("Ext.data.Store",{
                    fields:[],
                    data:json.data.shop
                });

                form.down("combo[name=shop]").setStore(store);
                form.down("combo[name=shop]").setDisabled(false);
            },
            failure:function(){
                Ext.toast("获取大店数据错误!","系统提示");
            }
        });

        return form;
    }
})