/**
 * Created by Administrator on 2015-06-30.
 */
Ext.define('erp.view.module.warehouse.WarehouseMoveWarehouseController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.warehousemovewarehouse',

    requires: [
        'Ext.Ajax',
        'Ext.String',
        'Ext.form.field.Text',
        'Ext.window.Window',
        'erp.view.window.AddMoveLocationWin'
    ],

    init:function(){

    },
    addMoveWarehouseNotice:function(){
        var me = this;
        var win = Ext.create('Ext.window.Window',{
            title:'???????',
            modal:true,
            items: [
                {
                    xtype: 'textfield',
                    enableKeyEvents: true,
                    fieldLabel: '????',
                    name: 'warehouse',
                    labelAlign: 'right'
                }],
            buttons: [
                {
                    text: '??',
                    handler: function () {
                        var location = win.down("textfield[name=warehouse]").getValue();
                        if (Ext.String.trim(location) == "") {
                            Ext.toast("??????????", "????", "t");
                            return;
                        }
                        Ext.Ajax.request({
                            async: true,
                            url: apiBaseUrl + '/index.php/Warehouse/Manage/addWarehouseMoveLocationOrder',
                            params: {
                                warehouse:warehouse
                            },
                            success: function (response) {
                                var text = Ext.decode(response.responseText);
                                console.log(text);
                                if (!text.success) {
                                    Ext.toast(no + text.msg, "????", 't');
                                    return;
                                }
                                win.destroy();
                            }
                        });
                    }
                }
            ]
        });
        me.lookupReference("move_warehouse_notice_grid").getStore().load();
        win.show();
    },
    delMoveWarehouseNotice:function(){
        var grid = this.lookupReference("move_warehouse_notice_grid");
        var sel = grid.getSelection(), ids = [], nos = [];
        if (sel.length == 0) {
            Ext.Msg.alert('????', '?????????');
            return;
        }
        Ext.each(sel, function (record) {
            ids.push(record.get("id"));
            nos.push(record.get("notice_no"));
        });
        Ext.Msg.show({
            title: '????',
            message: '?????????????<br>' + nos.join('<br>'),
            buttons: Ext.Msg.YESNO,
            icon: Ext.Msg.QUESTION,
            fn: function (btn) {
                if (btn === 'yes') {
                    Ext.Ajax.request({
                        url: apiBaseUrl + '/index.php/Warehouse/Manage/delWarehouseMoveWarehouseNotice',
                        waitMsg: '????...',
                        params: {
                            ids: ids.join(',')
                        },
                        success: function (data) {
                            var res = Ext.decode(data.responseText);
                            console.log(res);
                            if (!res.success) {
                                Ext.Msg.alert('????', res.msg);
                                return;
                            }
                            grid.getStore().load();
                        },
                        failure: function (data) {
                            var res = Ext.decode(data.responseText);
                            Ext.Msg.alert('????', res.msg);
                        }
                    })
                }
            }
        });
    }
});