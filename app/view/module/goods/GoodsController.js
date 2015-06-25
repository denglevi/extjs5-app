/**
 * Created by denglevi on 15-6-14.
 */
Ext.define('erp.view.module.goods.GoodsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.goods',

    requires: [
        'Ext.Ajax',
        'Ext.data.reader.Json',
        'Ext.form.Panel',
        'Ext.form.action.Action',
        'Ext.form.field.File',
        'Ext.window.Window',
        'erp.view.window.GoodsInfoWin',
        'erp.view.window.GoodsMenuInfoWin'
    ],

    /**
     * Called when the view is created
     */
    init: function() {

    },
    importGoodsMenu:function(import_btn){
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
                            name:'goods_menu',
                            allowBlank:false,
                            listeners:{
                                change: function (obj) {
                                    var val = this.getValue();
                                    this.up("form").getForm().submit({
                                        waitMsg:'正在导入商品信息...',
                                        success: function (form, action) {
                                            obj.up("form").up("window").destroy();
                                            Ext.Msg.alert('系统提示', "导入成功");
                                            import_btn.up("grid").getStore().load();
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
        var menu_id = record.get("id"),res;
        console.log(menu_id);
        Ext.Ajax.request({
            async:false,
            method:'POST',
            url: apiBaseUrl+'/index.php/Commodity/CommodityMenu/getGoodsMenuInfo',
            params: {
                id: menu_id
            },
            success: function(response){
                res = Ext.decode(response.responseText);
            }
        });
        if(!res.success) return;
        console.log(res.data);
        Ext.create('erp.view.window.GoodsMenuInfoWin',{
            title: "款号详情",
            info:res.data
        }).show();
    },
    onGoodListGridDblClick:function(gp,record){
        var id = record.get("id"),res;
        Ext.Ajax.request({
            async:false,
            method:'POST',
            url: apiBaseUrl+'/index.php/Commodity/CommodityMenu/getGoodsInfo',
            params: {
                id: id
            },
            success: function(response){
                //myMask.destroy( );
                res = Ext.decode(response.responseText);
            }
        });
        if(!res.success) return;
        Ext.create('erp.view.window.GoodsInfoWin',{
            title: "商品详情",
            info:res.data
        }).show();
    },
    searchMenu: function () {
        var me = this.getView();
        var system_style_no = me.down("textfield[name=system_style_no]").getValue();
        var supply_style_no = me.down("textfield[name=supply_style_no]").getValue();

        me.getStore().setProxy({
            type: 'ajax',
            url: apiBaseUrl + '/index.php/Commodity/CommodityMenu/getGoodsMenuList?system_style_no=' + system_style_no + '&supply_style_no=' + supply_style_no,
            reader: {
                type: 'json',
                rootProperty: 'data',
                totalProperty: 'total'
            }
        });
        me.getStore().load();
    }
});