/**
 * Created by Administrator on 2015-06-29.
 */
Ext.define('erp.view.window.AddMoveLocationWin', {
    extend: 'Ext.window.Window',
    xtype: 'addmovelocationwin',
    requires: [
        'Ext.Ajax',
        'Ext.Array',
        'Ext.String',
        'Ext.container.Container',
        'Ext.data.Store',
        'Ext.form.field.ComboBox',
        'Ext.form.field.Text',
        'Ext.grid.Panel',
        'Ext.layout.container.HBox'
    ],
    resizable: false,
    title: '新增移位单',
    modal:true,
    initComponent: function (args) {
        var me = this;
        Ext.Ajax.request({
            async: true,
            url: apiBaseUrl + '/index.php/Warehouse/Manage/getBaseData',
            params: {
                warehouse:1
            },
            success: function (response) {
                var text = Ext.decode(response.responseText);
                console.log(text);
                if (!text.success) {
                    Ext.toast(no + text.msg, "系统提示", 't');
                    return;
                }
                var store = Ext.create('Ext.data.Store',{
                   fields:[],
                    data:text.data.warehouse
                });
                me.down("combo").setStore(store);
                me.down("combo").setDisabled(false);
            }
        });
        this.items = [
            {
                xtype: 'container',
                layout: 'hbox',
                name: 'no',
                margin: 10,
                items: [
                    {
                        xtype: 'combo',
                        enableKeyEvents: true,
                        fieldLabel: '移位仓库',
                        name: 'warehouse',
                        disabled:true,
                        displayField:'storage_name',
                        valueField:'id',
                        labelAlign: 'right',
                        editable:false
                    }
                ]
            },
        ];
        this.buttons =[
            {
                text: '保存',
                handler: function () {
                    var warehouse = me.down("combo").getValue();
                    if (Ext.String.trim(warehouse) == "") {
                        Ext.toast("要移入的仓库不能为空", "系统提示", "t");
                        return;
                    }
                    Ext.Ajax.request({
                        async: true,
                        url: apiBaseUrl + '/index.php/Warehouse/Manage/addWarehouseMoveLocationOrder',
                        params: {
                            //data: Ext.encode(data),
                            //location:location
                            warehouse:warehouse
                        },
                        success: function (response) {
                            var text = Ext.decode(response.responseText);
                            console.log(text);
                            if (!text.success) {
                                Ext.toast(no + text.msg, "系统提示", 't');
                                return;
                            }
                            me.fireEvent("refresh_move_location_grid",text.data);
                            me.destroy();
                        }
                    });
                }
            }
        ];
        this.callParent(args);
    }
});
