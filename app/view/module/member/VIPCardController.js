/**
 * Created by Administrator on 2015-07-15.
 */
Ext.define('erp.view.module.member.VIPCardController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.vipcard',

    requires: [
        'Ext.data.StoreManager',
        'Ext.form.field.Checkbox',
        'Ext.form.field.Hidden',
        'Ext.form.field.Number',
        'Ext.form.field.Text',
        'Ext.layout.container.Column',
        'Ext.window.Window'
    ],

    /**
     * Called when the view is created
     */
    init: function() {

    },
    addVIPCardType:function(){
        var url = apiBaseUrl+'/index.php/Membership/sort/addVIPType';
        var form = this.getVIPCardTypeForm(url);
        var win = Ext.create('Ext.window.Window',{
            modal:true,
            resizable:false,
            width:600,
            layout:'fit',
            title:"新增VIP卡类型",
            items:[form]
        });
        win.show();
    },
    delVIPCardType:function(del_btn){
        var sel = del_btn.up('grid').getSelection(),ids=[],nos=[];
        if(sel.length == 0){
            Ext.Msg.alert('系统提示', '请选择要删除的VIP卡');
            return;
        }
        Ext.each(sel,function(record){
            ids.push(record.get("id"));
            nos.push(record.get("member_name"));
        });

        Ext.Msg.show({
            title:'系统消息',
            message: '你确定要删除以下VIP卡吗？<br>'+nos.join('<br>'),
            buttons: Ext.Msg.YESNO,
            icon: Ext.Msg.QUESTION,
            fn: function(btn) {
                if (btn === 'yes') {
                    Ext.getBody().mask("正在删除...");
                    Ext.Ajax.request({
                        url: apiBaseUrl+'/index.php/Membership/sort/delVIPType',
                        params:{
                            ids:ids.join(',')
                        },
                        success:function(data){
                            var res = Ext.decode(data.responseText);
                            if(!res.success){
                                Ext.Msg.alert('系统提示', res.msg);
                                return;
                            }
                            Ext.getBody().unmask();
                            del_btn.up('grid').getStore().load();
                        },
                        failure:function(data){
                            Ext.getBody().unmask();
                            Ext.Msg.alert('系统提示', "请求网络错误,请检查网络,重试!");
                        }
                    })
                }
            }
        });
    },
    editVIPCardType:function(btn){
        var sel = btn.up('grid').getSelection(),ids=[],nos=[];
        if(sel.length > 1){
            Ext.Msg.alert('系统提示', '一次只能修改一条记录!');
            return;
        }
        if(sel.length == 0){
            Ext.Msg.alert('系统提示', '请选择你要修改的VIP卡类型');
            return;
        }
        var url = apiBaseUrl+'/index.php/Membership/sort/editVIPType';
        var form = this.getVIPCardTypeForm(url);
        form.loadRecord(sel[0]);
        var win = Ext.create('Ext.window.Window',{
            modal:true,
            resizable:false,
            width:600,
            layout:'fit',
            title:"修改VIP卡类型",
            items:[form]
        });
        win.show();
    },
    getVIPCardTypeForm:function(url){
        var form = Ext.create('Ext.form.Panel',{
            layout:'column',
            bodyPadding:10,
            defaults:{
                xtype:'textfield',
                allowBlank:false,
                columnWidth:0.5,
                //labelWidth:70,
                labelAlign:'right',
                anchor:'100%',
                margin:5,
                minValue:0
                //afterLabelTpl:'<b class="text-danger">*</b>'
            },
            items:[
                {xtype:'hidden',name:'id'},
                {fieldLabel:'代码',name:'member_code'},
                {fieldLabel:'名称',name:'member_name'},
                {fieldLabel:'级别',name:'member_rank',xtype:'numberfield'},
                {fieldLabel:'基本金额积分比',name:'member_netcash',xtype:'numberfield'},
                {fieldLabel:'积分倍率',name:'member_ratio',xtype:'numberfield'},
                {fieldLabel:'折扣',name:'member_dis',xtype:'numberfield'},
                {fieldLabel:'启用积分',name:'member_integral',xtype:'checkbox'},
                {fieldLabel:'有效期限(月)',name:'member_validity',xtype:'numberfield'},
                {fieldLabel:'积分有效期(月)',name:'member_graldity',xtype:'numberfield'},
                {fieldLabel:'可储值卡',name:'member_torage',xtype:'checkbox'},
                {fieldLabel:'启用生日优惠',name:'member_birthdayyh',xtype:'checkbox'},
                {labelWidth:150,fieldLabel:'消费自动延长有效期(月)',name:'member_va',columnWidth:1,xtype:'numberfield'},
            ],
            buttons:[
                {
                    text:'重置',
                    handler:function(){
                        this.up("form").getForm().reset();
                    }
                },
                {
                    text:'提交',
                    formBind:true,
                    disabled:false,
                    handler:function(){
                        var form = this.up("form").getForm();
                        if(form.isValid()){
                            form.submit({
                                waitMsg:'正在提交...',
                                url: url,
                                method:'POST',
                                success:function(form,action){
                                    win.destroy();
                                    var store = Ext.StoreManager.lookup("VIPCardListStore");
                                    if(store !== null) store.load();
                                },
                                failure:function(form,action){
                                    if(action.result.msg){
                                        Ext.toast(action.result.msg,"系统提示");
                                        return;
                                    }
                                    Ext.toast("网络请求错误,请检查网络!","系统提示");
                                }
                            });
                        }
                    }
                }
            ]
        });
        return form;
    }
});