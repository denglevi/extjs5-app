/**
 * Created by Administrator on 2015-08-03.
 */
Ext.define('erp.view.module.system.AuthoritySetting', {
    extend: 'Ext.Container',
    xtype: 'authoritysetting',
    requires: [
        'Ext.container.Container',
        'Ext.form.FieldSet',
        'Ext.form.field.Base',
        'Ext.form.field.Checkbox',
        'Ext.grid.Panel',
        'Ext.layout.container.Anchor',
        'Ext.layout.container.Column',
        'Ext.layout.container.HBox',
        'Ext.panel.Panel'
    ],

    initComponent: function (args) {
        var me = this;
        Ext.apply(me, {
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            items: [
                {
                    xtype: 'grid',
                    title: '角色列表',
                    sortableColumns: false,
                    itemId: 'roleList',
                    enableColumnHide: false,
                    width: 150,
                    border: true,
                    columns: [
                        {text: '角色名称', dataIndex: 'name', flex: 1}
                    ],
                    store: 'RoleStore',
                    listeners: {
                        rowdblclick: me.onAuthRoleListGridDblClick,
                        scope: me
                    }
                },
                {
                    title: '权限列表',
                    flex: 1,
                    itemId: 'authList',
                    xtype: 'form',
                    bodyPadding: 10,
                    url: apiBaseUrl + '/index.php/System/Authority/setRoleAuth',
                    scrollable:true,
                    buttons: [
                        {
                            text: '全选', handler: function () {
                            var boxes = me.query("checkbox"), len = boxes.length;
                            for (var i = 0; i < len; i++) {
                                var box = boxes[i], id = box.auth_id;
                                box.setValue(true);
                            }
                        }
                        },
                        {
                            text: '重置', handler: function () {
                            this.up("form").getForm().reset();
                        }
                        },
                        {
                            text: '应用',
                            handler: function () {
                                if(me.role_id == null){
                                    Ext.toast("请选择要应用的角色", "系统提示");
                                    return;
                                }
                                var form = this.up("form").getForm();
                                form.submit({
                                    params:{
                                        id:me.role_id
                                    },
                                    success:function(form,action){
                                        Ext.toast("角色权限设置成功", "系统提示");
                                    },
                                    failure:function(form,action){
                                        Ext.toast("角色权限设置失败,请重试!", "系统提示");
                                    }
                                });
                            }
                        }
                    ]
                }
            ],
            listeners: {
                afterrender: function () {
                    me.down("#roleList").getStore().load();
                    Ext.Ajax.request({
                        async: true,
                        url: apiBaseUrl + '/index.php/System/Authority/getAllAuthByModeule',
                        success: function (res) {
                            var json = Ext.decode(res.responseText);
                            var items = json.data, list = me.down("#authList"), panels = [];
                            for (var id in items) {
                                var item = items[id];
                                var fields = [], auths = item.authority, l = auths.length;
                                for (var j = 0; j < l; j++) {
                                    var auth = auths[j];
                                    var field = {
                                        boxLabel: auth.name,
                                        name: 'auth[]',
                                        columnWidth: 0.15,
                                        auth_id: auth.id,
                                        inputValue: auth.id
                                    };
                                    fields.push(field);
                                }
                                var fieldset = {
                                    xtype: 'fieldset',
                                    title: item.name,
                                    margin: '10 0 0 0',
                                    layout: 'column',
                                    collapsible: true,
                                    defaultType: 'checkbox',
                                    items: fields
                                };
                                panels.push(fieldset);
                            }

                            list.add(panels);
                        },
                        failure: function (res) {
                            Ext.toast("数据获取错误,请稍后再试!", "系统提示");
                        }
                    });
                }
            }
        });
        this.callParent(args);
    },
    onAuthRoleListGridDblClick: function (gp, record) {
        var me = this;
        me.role_id = record.get("id");
        console.log(record);
        Ext.Ajax.request({
            async: true,
            url: apiBaseUrl + '/index.php/System/Authority/getAuthListByRole',
            params: {
                id: record.get("id")
            },
            success: function (res) {
                var json = Ext.decode(res.responseText);
                if (json.data != null) {
                    var ids = json.data.split(',');
                    ids.pop();
                } else {
                    var ids = [];
                }
                var boxes = me.query("checkbox"), len = boxes.length;
                for (var i = 0; i < len; i++) {
                    var box = boxes[i], id = box.auth_id;
                    console.log(box);
                    if (ids.indexOf(id) != -1) box.setValue(true);
                    else box.setValue(false);
                }
            },
            failure: function (res) {
                Ext.toast("数据获取错误,请稍后再试!", "系统提示");
            }
        });
    }
});