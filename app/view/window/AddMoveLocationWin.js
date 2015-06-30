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
        'Ext.form.field.Text',
        'Ext.grid.Panel',
        'Ext.layout.container.HBox'
    ],
    //height: 500,
    //width: 700,
    resizable: false,
    title: '新增移位单',
    items: [
        {
            xtype: 'container',
            layout: 'hbox',
            name:'no',
            margin: 10,
            items: [
                {
                    xtype: 'textfield',
                    enableKeyEvents: true,
                    fieldLabel: '移入库位',
                    name: 'location',
                    labelAlign: 'right'
                },
                //{
                //    xtype: 'textfield',
                //    enableKeyEvents: true,
                //    fieldLabel: '唯一码',
                //    flex: 1,
                //    name: 'no',
                //    labelAlign: 'right',
                //    listeners: {
                //        keyup: {
                //            fn: function (obj, e) {
                //                if (e.keyCode == 13) {
                //                    var no = obj.getValue(), nos = [];
                //                    if (Ext.String.trim(no) == "") return;
                //                    var location = obj.up("container").down("textfield[name=location]").getValue();
                //                    if (Ext.String.trim(location) == "") {
                //                        Ext.toast("请先扫入要移入的库位", "系统提示", "t");
                //                        return;
                //                    }
                //                    obj.setValue('');
                //                    var store = obj.up("addmovelocationwin").down("grid").getStore();
                //                    var res = store.findRecord("no", no);
                //                    if (res !== null) {
                //                        Ext.toast(no + "这件商品已在列表中", "系统提示", 't');
                //                        return;
                //                    }
                //
                //                    Ext.Ajax.request({
                //                        async: true,
                //                        url: apiBaseUrl + '/index.php/Warehouse/Manage/scanGoods',
                //                        params: {
                //                            no: no,
                //                            location: location
                //                        },
                //                        success: function (response) {
                //                            var text = Ext.decode(response.responseText);
                //                            console.log(text);
                //                            if (!text.success) {
                //                                Ext.toast(no + text.msg, "系统提示", 't');
                //                                return;
                //                            }
                //                            //nos.push({no: no, location: location});
                //                            res = text.data;
                //                            store.insert(0, res);
                //                        }
                //                    });
                //                }
                //            },
                //            scope: this
                //        }
                //    }
                //}
            ]
        },
        //{
        //    xtype: 'grid',
        //    height: '100%',
        //    title: '移位的商品',
        //    xtype: 'grid',
        //    reference: 'move_location_list',
        //    enableColumnHide: false,
        //    enableColumnResize: false,
        //    sortableColumns: false,
        //    scrollable: 'y',
        //    columns: [
        //        {text: '唯一码', dataIndex: 'no', flex: 2},
        //        {text: '移出库位', dataIndex: 'location_id', flex: 1}
        //    ],
        //    store: Ext.create('Ext.data.Store', {
        //        fields: ['no', 'move_out_location'],
        //        data: []
        //    })
        //}
    ],
    buttons: [
        {
            text: '保存',
            handler: function () {
                var win = this.up("window");
                var container = win.down("container[name=no]");
                var location = container.down("textfield[name=location]").getValue();
                if (Ext.String.trim(location) == "") {
                    Ext.toast("要移入的库位不能为空", "系统提示", "t");
                    return;
                }
                //var store = this.up("window").down("grid").getStore();
                //var items = store.getData().items;
                //var data = [];
                //Ext.Array.each(items,function(item){
                //   data.push({
                //      no:item.get("no"),
                //       lib_no:item.get("lib_no"),
                //       location_id:item.get("location_id")
                //   });
                //});

                Ext.Ajax.request({
                    async: true,
                    url: apiBaseUrl + '/index.php/Warehouse/Manage/addWarehouseMoveLocationOrder',
                    params: {
                        //data: Ext.encode(data),
                        location:location
                    },
                    success: function (response) {
                        var text = Ext.decode(response.responseText);
                        console.log(text);
                        if (!text.success) {
                            Ext.toast(no + text.msg, "系统提示", 't');
                            return;
                        }
                        win.fireEvent("refresh_move_location_grid");
                        win.destroy();
                    }
                });
            }
        }
    ]
});
