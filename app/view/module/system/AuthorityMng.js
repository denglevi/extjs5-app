/**
 * Created by Administrator on 2015-08-03.
 */
Ext.define('erp.view.module.system.AuthorityMng', {
    extend: 'Ext.grid.Panel',
    xtype: 'authoritymng',

    requires: [
        'Ext.data.Store',
        'Ext.data.StoreManager',
        'Ext.form.field.ComboBox',
        'Ext.form.field.Hidden',
        'Ext.form.field.Text',
        'Ext.grid.column.Action',
        'Ext.layout.container.Anchor',
        'Ext.layout.container.Column',
        'Ext.toolbar.Fill',
        'Ext.toolbar.Paging',
        'Ext.window.Window'
    ],

    initComponent: function (args) {
        var me = this;

        Ext.apply(me, {
            tbar: [
                {text: '新增', iconCls: 'addIcon',handler:me.addAuthority}
            ],
            sortableColumns: false,
            enableColumnHide: false,
            columns: [
                {text: '权限名', dataIndex: 'name', flex: 1},
                {text: '权限标示', dataIndex: 'action', flex: 1},
                {text: '所属模块', dataIndex: 'module_name', flex: 1},
                {text: '描述', dataIndex: 'description', flex: 1},
                {text: '创建时间', dataIndex: 'update_time', flex: 1},
                {text: '更新时间', dataIndex: 'update_time', flex: 1},
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
                            handler: me.editAuthority
                        }
                    ]
                }
            ],
            bbar: ['->', {
                xtype: 'pagingtoolbar',
                store: 'AuthorityStore',
                displayInfo: true
            }],
            store: 'AuthorityStore',
            listeners: {
                afterrender: function () {
                    this.getStore().load();
                }
            }
        });
        this.callParent(args);
    },
    addAuthority:function(){
        var me = this;
        var win = Ext.create("Ext.window.Window",{
            title:'新增权限',
            width:500,
            margin:10,
            modal:true,
            resizable:false,
            items:[
                {
                    xtype:'form',
                    layout:'anchor',
                    defaults:{
                        xtype:'textfield',
                        labelAlign:'right',
                        anchor:'100%',
                        allowBlank:false,
                        margin:5
                    },
                    items:[
                        {fieldLabel:'权限名',name:'name'},
                        {fieldLabel:'权限标示',name:'action'},
                        {allowBlank:true,fieldLabel:'所属模块',name:'module_id',disabled:true,xtype:'combo',displayField:'name',valueField:'id',editable:false},
                        {fieldLabel:'描述',name:'description'}
                    ],
                    buttons:[
                        {text:'重置',handler:function(){
                            this.up("form").getForm().reset();
                        }},
                        {text:'提交',formBind:true,disabled:true,handler:function(){
                            var form = this.up("form").getForm();
                            form.submit({
                                waitMsg:'正在提交...',
                                url: apiBaseUrl + '/index.php/System/Authority/addSystemAuthority',
                                success:function(form,action){
                                    Ext.StoreManager.lookup("AuthorityStore").load();
                                    win.destroy();
                                },
                                failure:function(form,action){
                                    Ext.toast("新增系统权限失败,请重试!","系统提示");
                                }
                            });
                        }}
                    ]
                }
            ]
        });
        Ext.Ajax.request({
            async: true,
            url: apiBaseUrl + '/index.php/System/Authority/getModule',
            success: function (response) {
                var text = Ext.decode(response.responseText);
                if (!text.success) {
                    Ext.toast("初始化数据错误,请重试!", "系统提示");
                    return;
                }
                res = text.data;
                console.log(text);
                win.down("combo[name=module_id]").setStore(Ext.create("Ext.data.Store",{
                    fields:[],
                    data:res
                }));
                win.down("combo[name=module_id]").setDisabled(false);
            }
        });
        win.show();
    },
    editAuthority: function (grid, rowIndex, colIndex, item, e, record, row) {
        var me = this;
        console.log(record);
        var form = Ext.create("Ext.form.Panel", {
            layout:'anchor',
            defaults:{
                xtype:'textfield',
                labelAlign:'right',
                anchor:'100%',
                allowBlank:false,
                margin:5
            },
            items:[
                {fieldLabel:'权限名',name:'name'},
                {fieldLabel:'权限标示',name:'action'},
                {xtype:"hidden",name:'id'},
                {allowBlank:true,fieldLabel:'所属模块',name:'module_id',disabled:true,xtype:'combo',displayField:'name',valueField:'id',editable:false},
                {fieldLabel:'描述',name:'description'}
            ],
            buttons:[
                {text:'重置',handler:function(){
                    this.up("form").getForm().reset();
                }},
                {text:'提交',formBind:true,disabled:true,handler:function(){
                    var form = this.up("form").getForm();
                    form.submit({
                        waitMsg:'正在提交...',
                        url: apiBaseUrl + '/index.php/System/Authority/editSystemAuthority',
                        success:function(form,action){
                            Ext.StoreManager.lookup("AuthorityStore").load();
                            win.destroy();
                        },
                        failure:function(form,action){
                            Ext.toast("修改系统权限失败,请重试!","系统提示");
                        }
                    });
                }}
            ]
        });
        form.loadRecord(record);
        var win = Ext.create("Ext.window.Window", {
            title: '修改权限',
            width: 550,
            margin: 10,
            modal: true,
            resizable: false,
            items: [form]
        });

        Ext.Ajax.request({
            async: true,
            url: apiBaseUrl + '/index.php/System/Authority/getModule',
            success: function (response) {
                var text = Ext.decode(response.responseText);
                if (!text.success) {
                    Ext.toast("初始化数据错误,请重试!", "系统提示");
                    return;
                }
                res = text.data;
                console.log(text);
                win.down("combo[name=module_id]").setStore(Ext.create("Ext.data.Store",{
                    fields:[],
                    data:res
                }));
                win.down("combo[name=module_id]").setDisabled(false);
            }
        });
        win.show();
    }
});