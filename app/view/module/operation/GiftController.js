/**
 * Created by Administrator on 2015-08-17.
 */
Ext.define('erp.view.module.operation.GiftController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.gift',
    requires: [
        'Ext.Ajax',
        'Ext.Array',
        'Ext.data.Store',
        'Ext.data.StoreManager',
        'Ext.form.Panel',
        'Ext.form.field.Checkbox',
        'Ext.form.field.ComboBox',
        'Ext.form.field.Date',
        'Ext.form.field.Display',
        'Ext.form.field.Hidden',
        'Ext.form.field.Text',
        'Ext.form.field.TextArea',
        'Ext.layout.container.Anchor',
        'Ext.layout.container.Column',
        'Ext.layout.container.VBox',
        'Ext.window.Window',
        'erp.view.module.operation.SingleDetails'
    ],
    init: function () {

    },
    //礼券投放单的操作
    addSingleInfo:function(){
        var url = apiBaseUrl+'index.php/Operations/SingleType/addSingleInfo';
        var form = this.addSingleInfoForm(url);
        var win = Ext.create('Ext.window.Window', {
            modal: true,
            resizable: false,
            width: 600,
            layout: 'fit',
            title: "新增礼券投放单",
            items: [form]
        });
        form.on("destroySortWin", function () {
            win.destroy();
            var store = Ext.StoreManager.lookup("SingleList"); //CouponSortList:首页的ajax交互数据，重新加载一次此操作    是别名
            if (store !== null) store.load();
        });
        win.show();
    },
    //礼券的删除
    delSingleInfo:function(del_btn){
        var sel = del_btn.up('grid').getSelection(), ids = [], nos = [];//返回一个数组，数组值为当前选中的值；否则返回空值
        if (sel.length == 0) {
            Ext.Msg.alert('系统提示', '请选择要删除的礼券类别');
            return;
        }
        Ext.each(sel,function(record){
            ids.push(record.get("id"));
            nos.push(record.get("single_no"));
        });
        Ext.Msg.show({
            title:'系统消息',
            message:'您确定要删除以下礼券投放单麽？<br/>'+nos.join()+'<br/>',
            buttons:Ext.Msg.YESNO,
            icon: Ext.Msg.QUESTION,
            fn:function(btn){
                if(btn=='yes'){
                    Ext.getBody().mask("正在删除.....");
                    Ext.Ajax.request({
                        url: apiBaseUrl + '/index.php/Operations/SingleType/delSIngleInfo',
                        params:{ id:ids.join(',')},
                        success:function(data){
                            var res = Ext.decode(data.responseText);
                            if(!res.success){
                                Ext.Msg.alert('系统提示',res.msg);
                                return;
                            }
                            Ext.getBody().unmask();
                            del_btn.up('grid').getStore().load();
                        },
                        failure:function(data){
                            Ext.getBody().unmask();
                            Ext.Msg.alert('系统提示','请求网络错误,请检查网络,重试!');
                        }
                    })
                }
            }
        });
    },
    //form 表单
    addSingleInfoForm:function(url){
        var me = this;
        var store = Ext.create('Ext.data.Store', {
            fields: ['type', 'val'],
            data: [
                {type: '投放激活', val: 0},
                {type: '整单激活', val: 1}
            ]
        });
        var form = Ext.create('Ext.form.Panel', {
            layout: 'column',
            bodyPadding: 10,
            defaults: {
                xtype: 'textfield',
                allowBlank: false, //此form表单中的所有input的为必填
                columnWidth: 0.5,
                labelWidth:70,
                labelAlign: 'right',
                anchor: '100%',
                margin: 5,
                minValue: 0
                //afterLabelTpl:'<b class="text-danger">*</b>'
            },
            items: [
                {xtype: 'hidden', name: 'id'},
                {
                    fieldLabel: '礼券类别',
                    name: 'sort_id',
                    xtype: 'combo',
                    displayField: 'name',
                    valueField: 'id',
                    editable: false,
                    disabled: true
                },
                {fieldLabel: '初始面值', name: 'single_money'},
                {fieldLabel: '卡前缀', name: 'single_prefix' },
                {fieldLabel: '起始编号', name: 'single_onset' },
                {fieldLabel: '截至编号', name: 'single_end' },
                {fieldLabel: '编码长度', name: 'encoding_length' },
                {fieldLabel: '截至有效日', name: 'single_upto',xtype:'datefield',editable:false,format:'Y-m-d' },
                {fieldLabel: '不包含数字', name: 'single_exclusive' },
                {fieldLabel: '组织', name: 'single_organization',xtype:'combo',displayField: 'name',valueField: 'id',editable: false,disabled: true},
                {fieldLabel: '激活方式', name: 'single_activate',  store: store,valueField: 'val',displayField: 'type',xtype:'combo' },

            ],
            buttons: [
                {
                    text: '重置',
                    handler: function () {
                        this.up("form").getForm().reset();
                    }
                },
                {
                    text: '提交',
                    formBind: true,
                    disabled: false,
                    handler: function (btn) {
                        var form = this.up("form").getForm();
                        //var sort_money='';var sort_num='';var sort_brand='';
                        //var sort_name = form.findField('sort_name').getValue();
                        //var id = form.findField("id").getValue();
                        //if(form.findField('sort_moneys').getValue()?1:0) sort_money = form.findField('sort_money').getValue();
                        //if(form.findField('sort_nums').getValue()?1:0) sort_num = form.findField('sort_num').getValue();
                        //if(form.findField('sort_brands').getValue()?1:0) sort_brand = form.findField('sort_brand[]').getValue();
                        ////console.log(sort_brand,sort_money,sort_num,sort_name,id);
                        ////console.log(form.findField('sort_moneys').getValue()); return; 获取到name是 sort_moneys的状态
                        if (form.isValid()) {
                            form.submit({
                                waitMsg: '正在提交...',
                                url: url,
                                method: 'POST',
                                success: function (form, action) {
                                    btn.up("form").fireEvent("destroySortWin");
                                },
                                failur: function (form, action) {
                                    if (action.result.msg) {
                                        Ext.toast(action.result.msg, "系统提示");
                                        return;
                                    }
                                    Ext.toast("网络请求错误,请检查网络!", "系统提示");
                                }
                            });
                        }
                    }
                }
            ]
        });
        Ext.Ajax.request({
            async: true,
            url: apiBaseUrl + '/index.php/Operations/SingleType/getSortInfo',
            method: 'POST',
            success: function (res) {
                var json = Ext.decode(res.responseText);
                var sort = form.down("combo[name=sort_id]"),
                    store = Ext.create('Ext.data.Store', {
                        fields: [],
                        data: json.data
                    });
                sort.setDisabled(false);
                sort.setStore(store);
            },
            failure: function () {}
        });
        Ext.Ajax.request({
            async:true,
            url:apiBaseUrl + '/index.php/Operations/SingleType/getShopsInfo',
            method:'POST',
            success:function(res){
                var json = Ext.decode(res.responseText);
                var sort = form.down("combo[name=single_organization]"),
                    store = Ext.create('Ext.data.Store',{
                        fields: [],
                        data: json.data
                    })
                sort.setDisabled(false);
                sort.setStore(store);
            },
            failure: function () {}
        })
        return form;
    },
    //详情页的数据
    omSingleDetailsInfo:function(gp,record){
        var tab = gp.up("tabpanel"),ref = 'singledetails-'+record.get("id"),
            item = tab.down('#'+ref);
        if(item != null){
            tab.setActiveTab(item);
            return;
        }
        tab.setActiveTab({
            itemId:ref,
            xtype:'singledetails',
            record:record,
            title:'礼券投放单详情',
            closable:true
        });
    }


});