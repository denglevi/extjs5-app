/**
 * Created by Administrator on 2015-08-03.
 */
Ext.define('erp.view.module.system.UserMng', {
    extend: 'Ext.grid.Panel',
    xtype: 'usermng',

    requires: [
        'Ext.data.Store',
        'Ext.data.StoreManager',
        'Ext.form.field.ComboBox',
        'Ext.form.field.Hidden',
        'Ext.form.field.Text',
        'Ext.grid.column.Action',
        'Ext.layout.container.Column',
        'Ext.window.Window'
    ],

    initComponent: function (args) {
        var me = this;

        Ext.apply(me, {
            tbar: [
                {text: '新增', iconCls: 'addIcon', handler: me.addUser}
            ],
            sortableColumns: false,
            enableColumnHide: false,
            columns: [
                {text: '登录名', dataIndex: 'username', flex: 1},
                {text: '部门', dataIndex: 'group_name', flex: 1},
                {text: '角色', dataIndex: 'role_name', flex: 1},
                {text: '邮箱', dataIndex: 'email', flex: 2},
                {text: '电话', dataIndex: 'mobile', flex: 1},
                {text: '注册时间', dataIndex: 'create_time', flex: 1},
                {text: '最后登录时间', dataIndex: 'last_login_time', flex: 1},
                {text: '最后登录IP', dataIndex: 'last_login_ip', flex: 1},
                {
                    text: '状态', dataIndex: 'status', flex: 1, renderer: function (val) {
                    if (0 == val) return "停用";
                    if (1 == val) return "激活";
                }
                },
                {
                    text: '操作',
                    xtype: 'actioncolumn',
                    flex: 1,
                    items: [
                        //{
                        //    iconCls: 'delIcon columnAction',
                        //    tooltip: '删除',
                        //    handler: "viewCustomerInfo"
                        //},
                        {
                            iconCls: 'editIcon columnAction',
                            tooltip: '修改',
                            handler: me.editUser
                        }
                    ]
                }
            ],
            store: 'UserStore',
            listeners: {
                afterrender: function () {
                    this.getStore().load();
                }
            }
        });
        this.callParent(args);
    },
    addUser: function () {
        var me = this;
        var win = Ext.create("Ext.window.Window", {
            title: '新增用户',
            width: 550,
            margin: 10,
            modal: true,
            resizable: false,
            items: [
                {
                    xtype: 'form',
                    layout: 'column',
                    defaults: {
                        xtype: 'textfield',
                        labelAlign: 'right',
                        labelWidth: 70,
                        columnWidth: 0.5,
                        allowBlank: false,
                        margin: 5
                    },
                    items: [
                        {fieldLabel: '用户名', name: 'username'},
                        {
                            fieldLabel: '部门',
                            xtype: 'combo',
                            name: 'group_id',
                            disabled: true,
                            displayField: 'name',
                            valueField: 'id',
                            editable: false
                        },
                        {
                            fieldLabel: '角色',
                            xtype: 'combo',
                            name: 'role_id',
                            disabled: true,
                            displayField: 'name',
                            valueField: 'id',
                            editable: false
                        },
                        {fieldLabel: '邮箱', name: 'email'},
                        {fieldLabel: '电话', name: 'mobile'}
                    ],
                    buttons: [
                        {
                            text: '重置', handler: function () {
                            this.up("form").getForm().reset();
                        }
                        },
                        {
                            text: '提交', formBind: true, disabled: true, handler: function () {
                            var form = this.up("form").getForm();
                            form.submit({
                                waitMsg: '正在提交...',
                                url: apiBaseUrl + '/index.php/System/User/addSystemUser',
                                success: function (form, action) {
                                    Ext.StoreManager.lookup("UserStore").load();
                                    win.destroy();
                                },
                                failure: function (form, action) {
                                    Ext.toast("新增系统用户失败,请重试!", "系统提示");
                                }
                            });
                        }
                        }
                    ]
                }
            ]
        });
        Ext.Ajax.request({
            async: true,
            url: apiBaseUrl + '/index.php/System/User/getGroupAndRole',
            success: function (response) {
                var text = Ext.decode(response.responseText);
                if (!text.success) {
                    Ext.toast("初始化数据错误,请重试!", "系统提示");
                    return;
                }
                res = text.data;
                console.log(text);
                win.down("combo[name=group_id]").setStore(Ext.create("Ext.data.Store", {
                    fields: [],
                    data: res.group
                }));
                win.down("combo[name=group_id]").setDisabled(false);
                win.down("combo[name=role_id]").setStore(Ext.create("Ext.data.Store", {
                    fields: [],
                    data: res.role
                }));
                win.down("combo[name=role_id]").setDisabled(false);
            }
        });
        win.show();
    },
    editUser: function (grid, rowIndex, colIndex, item, e, record, row) {
        var me = this;
        var form = Ext.create("Ext.form.Panel", {
            layout: 'column',
            defaults: {
                xtype: 'textfield',
                labelAlign: 'right',
                labelWidth: 70,
                columnWidth: 0.5,
                allowBlank: false,
                margin: 5
            },
            items: [
                {fieldLabel: '用户名', name: 'username'},
                {xtype:'hidden',name: 'id'},
                {
                    fieldLabel: '部门',
                    xtype: 'combo',
                    name: 'group_id',
                    disabled: true,
                    displayField: 'name',
                    valueField: 'id',
                    editable: false
                },
                {
                    fieldLabel: '角色',
                    xtype: 'combo',
                    name: 'role_id',
                    disabled: true,
                    displayField: 'name',
                    valueField: 'id',
                    editable: false
                },
                {fieldLabel: '邮箱', name: 'email'},
                {fieldLabel: '电话', name: 'mobile'},
                {
                    fieldLabel: '是否停用',
                    xtype: 'combo',
                    name: 'status',
                    store:Ext.create("Ext.data.Store",{
                       fields:[],
                        data:[
                            {key:'停用',val:0},
                            {key:'激活',val:1}
                        ]
                    }),
                    displayField: 'key',
                    valueField: 'val',
                    editable: false
                }
            ],
            buttons: [
                {
                    text: '重置', handler: function () {
                    this.up("form").getForm().reset();
                }
                },
                {
                    text: '提交', formBind: true, disabled: true, handler: function () {
                    var form = this.up("form").getForm();
                    form.submit({
                        waitMsg: '正在提交...',
                        url: apiBaseUrl + '/index.php/System/User/editSystemUser',
                        success: function (form, action) {
                            Ext.StoreManager.lookup("UserStore").load();
                            win.destroy();
                        },
                        failure: function (form, action) {
                            Ext.toast("新增系统用户失败,请重试!", "系统提示");
                        }
                    });
                }
                }
            ]
        });
        form.loadRecord(record);
        var win = Ext.create("Ext.window.Window", {
            title: '修改用户',
            width: 550,
            margin: 10,
            modal: true,
            resizable: false,
            items: [form]
        });
        Ext.Ajax.request({
            async: true,
            url: apiBaseUrl + '/index.php/System/User/getGroupAndRole',
            success: function (response) {
                var text = Ext.decode(response.responseText);
                if (!text.success) {
                    Ext.toast("初始化数据错误,请重试!", "系统提示");
                    return;
                }
                res = text.data;
                console.log(text);
                win.down("combo[name=group_id]").setStore(Ext.create("Ext.data.Store", {
                    fields: [],
                    data: res.group
                }));
                win.down("combo[name=group_id]").setDisabled(false);
                win.down("combo[name=role_id]").setStore(Ext.create("Ext.data.Store", {
                    fields: [],
                    data: res.role
                }));
                win.down("combo[name=role_id]").setDisabled(false);
            }
        });
        win.show();
    }
});