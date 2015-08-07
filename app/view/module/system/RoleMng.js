/**
 * Created by Administrator on 2015-08-03.
 */
Ext.define('erp.view.module.system.RoleMng', {
    extend: 'Ext.grid.Panel',
    xtype: 'rolemng',

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
                {text:'新增',iconCls:'addIcon',handler:me.addRole}
            ],
            sortableColumns:false,
            enableColumnHide:false,
            columns:[
                {text:'名称',dataIndex:'name',flex:1},
                {text:'描述',dataIndex:'description',flex:1},
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
                            handler: me.editRole
                        }
                    ]
                }
            ],
            store:'RoleStore',
            listeners:{
                afterrender:function(){
                    this.getStore().load();
                }
            }
        });
        this.callParent(args);
    },
    addRole:function(){
        var me = this;
        var win = Ext.create("Ext.window.Window",{
            title:'新增角色',
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
                        {fieldLabel:'角色名',name:'name'},
                        //{fieldLabel:'角色类型',name:'role',disabled:true},
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
                                url: apiBaseUrl + '/index.php/System/Role/addSystemRole',
                                success:function(form,action){
                                    Ext.StoreManager.lookup("RoleStore").load();
                                    win.destroy();
                                },
                                failure:function(form,action){
                                    Ext.toast("新增系统角色失败,请重试!","系统提示");
                                }
                            });
                        }}
                    ]
                }
            ]
        });

        win.show();
    },
    editRole: function (grid, rowIndex, colIndex, item, e, record, row) {
        var me = this;
        console.log(record);
        var form = Ext.create("Ext.form.Panel", {
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
                {fieldLabel:'角色名',name:'name'},
                //{fieldLabel:'角色类型',name:'role',disabled:true},
                {fieldLabel:'描述',name:'description'},
                {xtype:"hidden",name:'id'},
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
            buttons:[
                {text:'重置',handler:function(){
                    this.up("form").getForm().reset();
                }},
                {text:'提交',formBind:true,disabled:true,handler:function(){
                    var form = this.up("form").getForm();
                    form.submit({
                        waitMsg:'正在提交...',
                        url: apiBaseUrl + '/index.php/System/Role/editSystemRole',
                        success:function(form,action){
                            Ext.StoreManager.lookup("RoleStore").load();
                            win.destroy();
                        },
                        failure:function(form,action){
                            Ext.toast("新增系统角色失败,请重试!","系统提示");
                        }
                    });
                }}
            ]
        });
        form.loadRecord(record);
        var win = Ext.create("Ext.window.Window", {
            title: '修改角色',
            width: 550,
            margin: 10,
            modal: true,
            resizable: false,
            items: [form]
        });
        win.show();
    }
});