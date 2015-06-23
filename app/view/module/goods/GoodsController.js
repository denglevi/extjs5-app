/**
 * Created by denglevi on 15-6-14.
 */
Ext.define('erp.view.module.goods.GoodsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.goods',

    requires: [
        'Ext.data.Store',
        'Ext.form.Panel',
        'Ext.form.action.Action',
        'Ext.form.field.File',
        'Ext.window.Window',
        'erp.view.window.GoodsMenuInfoWin'
    ],

    /**
     * Called when the view is created
     */
    init: function() {

    },
    importGoodsMenu:function(){
        Ext.create('Ext.window.Window',{
            title:'导入商品资料',
            bodyPadding:20,
            items:[
                {
                    xtype:'form',
                    method:'POST',
                    url:apiBaseUrl+'/index.php/Commodity/CommodityMenu/importGoodsMenuInfo',
                    items:[
                        {
                            xtype:'filefield',
                            buttonText: '上传商品资料',
                            allowBlank:false,
                            listeners:{
                                change: function () {
                                    var val = this.getValue();
                                    this.up("form").getForm().submit({
                                        waitMsg:'正在导入商品信息...',
                                        success: function (form, action) {
                                            var data = action.result.data;
                                            me.products = data;
                                            var store = Ext.create('Ext.data.Store', {
                                                fields: ["style_no", "name", 'color', 'size', 'num', 'batch_price', 'total_price', 'retail_price'],
                                                data: data
                                            });
                                            me.down("grid").setStore(store);
                                            //Ext.Msg.alert('系统提示', "导入成功");
                                        },
                                        failure: function (form, action) {
                                            switch (action.failureType) {
                                                case Ext.form.action.Action.CLIENT_INVALID:
                                                    Ext.Msg.alert('系统提示', '表单验证错误');
                                                    break;
                                                case Ext.form.action.Action.CONNECT_FAILURE:
                                                    Ext.Msg.alert('系统提示', '远程连接错误，请稍后重试');
                                                    break;
                                                case Ext.form.action.Action.SERVER_INVALID:
                                                    Ext.Msg.alert('系统提示', action.result.msg);
                                            }
                                        }
                                    });
                                }
                            }
                        }
                    ]
                }
            ]
        }).show();
    },
    deleteGoodsMenu:function(){

    },
    onGoodsMenuGridDblClick:function(gp,record){
        var menu_id = record.get("id");
        console.log(menu_id);
        Ext.create('erp.view.window.GoodsMenuInfoWin',{
            title: "款号详情",
            menu_id:menu_id
        }).show();
    },
});