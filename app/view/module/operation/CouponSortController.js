/**
 * Created by Administrator on 2015-07-06.
 */
Ext.define('erp.view.module.operation.CouponSortController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.couponsort',

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
        'Ext.window.Window'
    ],
    init: function () {

    },
//礼券类别的新增操作
    addCouponSortType:function(){
        var url = apiBaseUrl + '/index.php/Operations/CouponSort/postCouponSortEss';
        var form = this.addCouponSortTyprFrom(url);
        var win = Ext.create('Ext.window.Window', {
            modal: true,
            resizable: false,
            width: 600,
            layout: 'fit',
            title: "新增礼券类型",
            items: [form]
        });
        form.on("destroySortWin", function () {
            win.destroy();
            var store = Ext.StoreManager.lookup("CouponSortList"); //CouponSortList:首页的ajax交互数据，重新加载一次此操作    是别名
            if (store !== null) store.load();
        });
        win.show();
    },
    //礼券的修改属性
    editCouponSortType:function(grid, rowIndex, colIndex, item, e, record){
        var url = apiBaseUrl + '/index.php/Operations/CouponSort/editCouponSortType';
        var form = this.addCouponSortTyprFrom(url);
        if(record.get("sort_num") != "") form.down("checkbox[name=sort_nums]").setValue(true);
        if(record.get("sort_money") != "") form.down("checkbox[name=sort_moneys]").setValue(true);
        if(record.get("sort_brand") != "") form.down("checkbox[name=sort_brands]").setValue(true);
        var str = record.get("sort_brand");
        form.down("#sort_brand").setValue(str.split(','));
        form.loadRecord(record);
        var win = Ext.create('Ext.window.Window',{
            modal:true,//当显示出来的框没有错误的时候，禁止访问其他的URL
            resizable: false,
            width:600,
            layout:'fit',
            title:'修改礼券类型',
            items:[form]
        })
        form.on("destroySortWin",function(){
            win.destroy();
            var store = Ext.StoreManager.lookup("CouponSortList")//CouponSortList:首页的ajax交互数据，重新加载一次此操作    是别名 lookup() : 加载别名
            if(store!==null) store.load();
        })
        win.show();
    },
    //form 表单
    addCouponSortTyprFrom:function(url){
        var me = this, form = Ext.create('Ext.form.Panel', {
            layout: 'column',
            bodyPadding: 10,
            defaults: {
                xtype: 'textfield',
                //allowBlank: false, //此form表单中的所有input的为必填
                columnWidth: 1,
                labelWidth:50,
                labelAlign: 'right',
                anchor: '100%',
                margin: 5,
                minValue: 0
                //afterLabelTpl:'<b class="text-danger">*</b>'
            },
            items: [
                {xtype: 'hidden', name: 'id'},
                {fieldLabel: '名称', name: 'sort_name',allowBlank:false},
                {fieldLabel: '金额', name: 'sort_moneys' ,xtype:'checkbox',columnWidth:0.15,id:'sort_moneys',
                    listeners: {
                        change:function(){
                            var box = this;
                            if(box.getValue() == true){
                                form.down("textfield[name=sort_money]").setDisabled(false);
                            }else{
                                form.down("textfield[name=sort_money]").setDisabled(true);
                                form.down("textfield[name=sort_money]").setValue(null);
                            }
                        }
                    }
                },
                {name:'sort_money',disabled:true,columnWidth:0.35,hideLabel:true},
                {fieldLabel: '张数', name: 'sort_nums' ,xtype:'checkbox',columnWidth:0.15,
                    listeners: {
                        change:function(){
                            var box = this;
                            if(box.getValue() == true){
                                form.down("textfield[name=sort_num]").setDisabled(false);
                            }else{
                                form.down("textfield[name=sort_num]").setDisabled(true);
                                form.down("textfield[name=sort_num]").setValue(null);
                              }
                            }
                        }

                },
                {name:'sort_num',disabled:true,columnWidth:0.35,hideLabel:true},
                {xtype:'checkbox',fieldLabel: '品牌', name: 'sort_brands',columnWidth:0.15,
                    listeners: {
                        change:function(){
                            var box = this;
                            if(box.getValue() == true){
                                Ext.Ajax.request({
                                    aysnc: true,
                                    method: 'POST',
                                    url: apiBaseUrl + '/index.php/Operations/CouponSort/postCouponSortBrand',
                                    success: function (res) {
                                        var json = Ext.decode(res.responseText);
                                        if(!json.success){
                                            Ext.toast(json.msg,"系统提示");
                                            return;
                                        }console.log(json);
                                        var store = Ext.create('Ext.data.Store', {
                                            fields: ['type', 'val'],
                                            data: json.data
                                        });
                                        var brandField = form.down("#sort_brand");
                                        brandField.setStore(store);
                                    }
                                }),
                                form.down("#sort_brand").setDisabled(false);
                            }else{
                                form.down("#sort_brand").setDisabled(true);
                                form.down("#sort_brand").setValue(null);
                            }
                        }
                    }
                },
                {xtype:'tagfield',name:'sort_brand[]',disabled:true,columnWidth:0.85,hideLabel:true,displayField: 'name_en',valueField: 'id',itemId:'sort_brand'}
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
                        var sort_money='';var sort_num='';var sort_brand='';
                        var sort_name = form.findField('sort_name').getValue();
                        var id = form.findField("id").getValue();
                        if(form.findField('sort_moneys').getValue()?1:0) sort_money = form.findField('sort_money').getValue();
                        if(form.findField('sort_nums').getValue()?1:0) sort_num = form.findField('sort_num').getValue();
                        if(form.findField('sort_brands').getValue()?1:0) sort_brand = form.findField('sort_brand[]').getValue();
                        //console.log(sort_brand,sort_money,sort_num,sort_name,id);
                        //console.log(form.findField('sort_moneys').getValue()); return; 获取到name是 sort_moneys的状态
                        if (form.isValid()) {
                            form.submit({
                                waitMsg: '正在提交...',
                                url: url,
                                method: 'POST',
                                params:{
                                    id:id,
                                    sort_name:sort_name,
                                    sort_money:sort_money,
                                    sort_num:sort_num,
                                    sort_brand:sort_brand
                                },
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
        return form;
    },
//礼券类别的删除操作
    delCouponSortInfo:function(del_btn){
        var sel = del_btn.up('grid').getSelection(), ids = [], nos = [];//返回一个数组，数组值为当前选中的值；否则返回空值
        if (sel.length == 0) {
            Ext.Msg.alert('系统提示', '请选择要删除的礼券类别');
                return;
            }
            Ext.each(sel,function(record){
                ids.push(record.get("id"));
                nos.push(record.get("sort_name"));
            });
            Ext.Msg.show({
                title:'系统消息',
                message:"您确定要删除以下礼券类别麽？<br>"+nos.join('<br>'),
                buttons:Ext.Msg.YESNO,
                icon: Ext.Msg.QUESTION,
                fn:function(btn){
                    if(btn=='yes'){
                        Ext.getBody().mask("正在删除.....");
                        Ext.Ajax.request({
                            url: apiBaseUrl + '/index.php/Operations/CouponSort/delCouponSortInfo',
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
            })
    },


});