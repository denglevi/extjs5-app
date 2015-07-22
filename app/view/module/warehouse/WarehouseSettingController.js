/**
 * Created by Administrator on 2015-07-22.
 */
Ext.define('erp.view.module.warehouse.WarehouseSettingController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.warehousesetting',

    requires: [
        'Ext.data.Store',
        'Ext.data.StoreManager',
        'Ext.data.reader.Json',
        'Ext.form.field.ComboBox',
        'Ext.form.field.Hidden',
        'Ext.form.field.Text',
        'Ext.layout.container.Column',
        'Ext.layout.container.HBox',
        'Ext.layout.container.VBox',
        'Ext.window.Window'
    ],

    /**
     * Called when the view is created
     */
    init: function () {

    },
    addWarehouse: function () {
        var me = this, url = apiBaseUrl + '/index.php/Warehouse/Index/addWarehouse';
        var form = this.getWarehouseForm(url);
        var win = Ext.create('Ext.window.Window', {
            width: 400,
            modal: true,
            resizable: false,
            title: '新增仓库',
            layout: 'fit',
            items: [form]
        });

        form.on("destroyWarehouseWin", function () {
            win.destroy();
            me.getView().down("#warehouse_list").getStore().load();
        });
        win.show();
    },
    delWarehouse: function (del_btn) {
        var sel = del_btn.up('grid').getSelection(), ids = [], names = [];
        if (sel.length == 0) {
            Ext.Msg.alert('系统提示', '请选择要删除的仓库');
            return;
        }
        Ext.each(sel, function (record) {
            ids.push(record.get("id"));
            names.push(record.get("storage_name"));
        });

        Ext.Msg.show({
            title: '系统消息',
            message: '你确定要删除以下仓库吗？<br>' + names.join('<br>'),
            buttons: Ext.Msg.YESNO,
            icon: Ext.Msg.QUESTION,
            fn: function (btn) {
                if (btn === 'yes') {
                    Ext.getBody().mask("正在删除...");
                    Ext.Ajax.request({
                        url: apiBaseUrl + '/index.php/Warehouse/Index/delWarehouse',
                        params: {
                            ids: ids.join(',')
                        },
                        success: function (data) {
                            var res = Ext.decode(data.responseText);
                            if (!res.success) {
                                Ext.Msg.alert('系统提示', res.msg);
                                return;
                            }
                            Ext.getBody().unmask();
                            del_btn.up('grid').getStore().load();
                        },
                        failure: function (data) {
                            Ext.getBody().unmask();
                            Ext.Msg.alert('系统提示', "请求网络错误,请检查网络,重试!");
                        }
                    })
                }
            }
        });
    },
    editWarehouse: function (btn) {
        var sel = btn.up('grid').getSelection(), ids = [], names = [];
        if (sel.length == 0) {
            Ext.Msg.alert('系统提示', '请选择要修改的仓库');
            return;
        }
        if (sel.length > 1) {
            Ext.Msg.alert('系统提示', '一次只能修改一条记录');
            return;
        }
        var me = this, url = apiBaseUrl + '/index.php/Warehouse/Index/editWarehouse';
        var form = this.getWarehouseForm(url);
        form.loadRecord(sel[0]);
        var win = Ext.create('Ext.window.Window', {
            width: 400,
            modal: true,
            resizable: false,
            title: '修改仓库',
            layout: 'fit',
            items: [form]
        });

        form.on("destroyWarehouseWin", function () {
            win.destroy();
            me.getView().down("#warehouse_list").getStore().load();
        });
        win.show();
    },
    getWarehouseForm: function (url) {
        var form = Ext.create('Ext.form.Panel', {
            bodyPadding: 10,
            defaults: {
                xtype: 'textfield',
                margin: 5,
                labelAlign: 'right',
                anchor: '100%',
                allowBlank: false
            },
            items: [
                {fieldLabel: "仓库名称", name: 'storage_name'},
                {xtype: 'hidden', name: 'id'},
                {fieldLabel: "仓库代码", name: 'no'},
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
                        if (form.isValid()) {
                            form.submit({
                                waitMsg: '正在提交...',
                                url: url,
                                method: 'POST',
                                success: function (form, action) {
                                    btn.up("form").fireEvent("destroyWarehouseWin");
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
    addLocation: function (btn) {
        var me = this, url = apiBaseUrl + '/index.php/Warehouse/Index/addWarehouseLocation';
        var form = this.getLocationForm(url);
        var win = Ext.create('Ext.window.Window', {
            width: 400,
            modal: true,
            resizable: false,
            title: '新增库位',
            layout: 'fit',
            items: [form]
        });

        form.on("destroyLocationWin", function () {
            win.destroy();
            me.getView().down("#location_list").getStore().load();
        });
        win.show();
    },
    delLocation: function (del_btn) {
        var sel = del_btn.up('grid').getSelection(), ids = [], names = [];
        if (sel.length == 0) {
            Ext.Msg.alert('系统提示', '请选择要删除的库位');
            return;
        }
        Ext.each(sel, function (record) {
            ids.push(record.get("id"));
            names.push(record.get("library_name"));
        });

        Ext.Msg.show({
            title: '系统消息',
            message: '你确定要删除以下仓库吗？<br>' + names.join('<br>'),
            buttons: Ext.Msg.YESNO,
            icon: Ext.Msg.QUESTION,
            fn: function (btn) {
                if (btn === 'yes') {
                    Ext.getBody().mask("正在删除...");
                    Ext.Ajax.request({
                        url: apiBaseUrl + '/index.php/Warehouse/Index/delWarehouseLocation',
                        params: {
                            ids: ids.join(',')
                        },
                        success: function (data) {
                            var res = Ext.decode(data.responseText);
                            if (!res.success) {
                                Ext.Msg.alert('系统提示', res.msg);
                                return;
                            }
                            Ext.getBody().unmask();
                            del_btn.up('grid').getStore().load();
                        },
                        failure: function (data) {
                            Ext.getBody().unmask();
                            Ext.Msg.alert('系统提示', "请求网络错误,请检查网络,重试!");
                        }
                    })
                }
            }
        });
    },
    editLocation: function (btn) {
        var grid = btn.up('grid'),sel = grid.getSelection(), ids = [], names = [];
        if (sel.length == 0) {
            Ext.Msg.alert('系统提示', '请选择要修改的库位');
            return;
        }
        if (sel.length > 1) {
            Ext.Msg.alert('系统提示', '一次只能修改一条记录');
            return;
        }
        var me = this, url = apiBaseUrl + '/index.php/Warehouse/Index/editWarehouseLocation';
        var form = this.getLocationForm(url);
        form.loadRecord(sel[0]);
        var win = Ext.create('Ext.window.Window', {
            width: 400,
            modal: true,
            resizable: false,
            title: '修改库位',
            layout: 'fit',
            items: [form]
        });

        form.on("destroyLocationWin", function () {
            win.destroy();
            me.getView().down("#location_list").getStore().load();
        });
        win.show();
    },
    getLocationForm: function (url) {
        var store = Ext.StoreManager.lookup("WarehouseListStore");
        var form = Ext.create('Ext.form.Panel', {
            bodyPadding: 10,
            defaults: {
                xtype: 'textfield',
                margin: 5,
                labelAlign: 'right',
                anchor: '100%',
                allowBlank: false
            },
            items: [
                {
                    fieldLabel: '所属仓库',
                    xtype: 'combo',
                    name: 'storage_id',
                    displayField: 'storage_name',
                    valueField: 'id',
                    editable:false,
                    disabled:true,
                    queryMode: 'local',
                    store: store
                },
                {fieldLabel: "库位名称", name: 'library_name'},
                {xtype: 'hidden', name: 'id'},
                {fieldLabel: "库位代码", name: 'no'},
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
                        if (form.isValid()) {
                            form.submit({
                                waitMsg: '正在提交...',
                                url: url,
                                method: 'POST',
                                success: function (form, action) {
                                    btn.up("form").fireEvent("destroyLocationWin");
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
        if(store != null){
            form.down("combo").setDisabled(false);
        }
        return form;
    },
    onWarehouseListGridDblClick: function (gp, record) {
        var model = this.getViewModel()
        id = record.get("id");

        model.set("warehouse_id", id);
        var store = this.getView().down("#location_list").getStore();
        store.setProxy(
            {
                type: 'ajax',
                url: apiBaseUrl + '/index.php/Warehouse/Index/getWarehouseLocationList?id=' + id,
                reader: {
                    type: 'json',
                    rootProperty: 'data'
                }
            }
        );
        store.load();
    }
});