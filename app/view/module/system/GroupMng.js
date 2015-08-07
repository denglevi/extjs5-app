/**
 * Created by Administrator on 2015-08-03.
 */
Ext.define('erp.view.module.system.GroupMng', {
    extend: 'Ext.grid.Panel',
    xtype: 'groupmng',

    requires: [
        'Ext.data.Store',
        'Ext.data.StoreManager',
        'Ext.form.field.ComboBox',
        'Ext.form.field.Hidden',
        'Ext.form.field.Text',
        'Ext.grid.column.Action',
        'Ext.layout.container.Anchor',
        'Ext.layout.container.Column',
        'Ext.window.Window'
    ],

    initComponent:function(args){
        var me = this;

        Ext.apply(me,{
            tbar:[
                {text:'新增',iconCls:'addIcon',handler:me.addGroup}
            ],
            sortableColumns:false,
            enableColumnHide:false,
            columns:[
                {text:'名称',dataIndex:'name',flex:1},
                {text:'描述',dataIndex:'description',flex:1},
                {text:'上级部门',dataIndex:'parent_id',flex:1},
                {text:'创建时间',dataIndex:'create_time',flex:1},
                {text:'更新时间',dataIndex:'update_time',flex:1},
                {text:'状态',dataIndex:'status',flex:1,renderer:function(val){
                    if(0==val) return "停用";
                    if(1==val) return "激活";
                }},
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
                            handler: me.editGroup
                        }
                    ]
                }
            ],
            store:'GroupStore',
            listeners:{
                afterrender:function(){
                    this.getStore().load();
                }
            }
        });
        this.callParent(args);
    },
    addGroup:function(){
        var me = this;
        var win = Ext.create("Ext.window.Window",{
            title:'新增部门',
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
                        {fieldLabel:'部门名称',name:'name'},
                        {fieldLabel:'上级部门',name:'parent_id',xtype:'combo',disabled:true,displayField:'name',valueField:'id',editable:false},
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
                                url: apiBaseUrl + '/index.php/System/Group/addSystemGroup',
                                success:function(form,action){
                                    Ext.StoreManager.lookup("GroupStore").load();
                                    win.destroy();
                                },
                                failure:function(form,action){
                                    Ext.toast("新增部门失败,请重试!","系统提示");
                                }
                            });
                        }}
                    ]
                }
            ]
        });

        Ext.Ajax.request({
            async: true,
            url: apiBaseUrl + '/index.php/System/Group/getGroup',
            success: function (response) {
                var text = Ext.decode(response.responseText);
                if (!text.success) {
                    Ext.toast("初始化数据错误,请重试!", "系统提示");
                    return;
                }
                res = text.data;
                console.log(text);
                win.down("combo[name=parent_id]").setStore(Ext.create("Ext.data.Store",{
                    fields:[],
                    data:res
                }));
                win.down("combo[name=parent_id]").setDisabled(false);
            }
        });
        win.show();
    },
    editGroup: function (grid, rowIndex, colIndex, item, e, record, row) {
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
                {fieldLabel:'部门名称',name:'name'},
                {xtype:'hidden',name:'id'},
                {fieldLabel:'上级部门',name:'parent_id',xtype:'combo',displayField:'name',valueField:'id',editable:false},
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
                        url: apiBaseUrl + '/index.php/System/Group/editSystemGroup',
                        success:function(form,action){
                            Ext.StoreManager.lookup("GroupStore").load();
                            win.destroy();
                        },
                        failure:function(form,action){
                            Ext.toast("修改部门失败,请重试!","系统提示");
                        }
                    });
                }}
            ]
        });
        form.loadRecord(record);
        var win = Ext.create("Ext.window.Window", {
            title: '修改模块',
            width: 550,
            margin: 10,
            modal: true,
            resizable: false,
            items: [form]
        });
        Ext.Ajax.request({
            async: true,
            url: apiBaseUrl + '/index.php/System/Group/getGroup',
            success: function (response) {
                var text = Ext.decode(response.responseText);
                if (!text.success) {
                    Ext.toast("初始化数据错误,请重试!", "系统提示");
                    return;
                }
                res = text.data;
                console.log(text);
                win.down("combo[name=parent_id]").setStore(Ext.create("Ext.data.Store",{
                    fields:[],
                    data:res
                }));
                win.down("combo[name=parent_id]").setDisabled(false);
            }
        });
        win.show();
    }
});