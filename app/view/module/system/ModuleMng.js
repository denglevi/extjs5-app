/**
 * Created by Administrator on 2015-08-03.
 */
Ext.define('erp.view.module.system.ModuleMng', {
    extend: 'Ext.grid.Panel',
    xtype: 'modulemng',

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
                {text:'新增',iconCls:'addIcon',handler:me.addModule}
            ],
            sortableColumns:false,
            enableColumnHide:false,
            columns:[
                {text:'名称',dataIndex:'name',flex:1},
                {text:'描述',dataIndex:'description',flex:1},
                //{text:'上级模块',dataIndex:'parent_module',flex:1},
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
                            handler: me.editModule
                        }
                    ]
                }
            ],
            store:'ModuleStore',
            listeners:{
                afterrender:function(){
                    this.getStore().load();
                }
            }
        });
        this.callParent(args);
    },
    addModule:function(){
        var me = this;
        var win = Ext.create("Ext.window.Window",{
            title:'新增模块',
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
                        {fieldLabel:'模块名',name:'name'},
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
                                url: apiBaseUrl + '/index.php/System/Module/addSystemModule',
                                success:function(form,action){
                                    Ext.StoreManager.lookup("ModuleStore").load();
                                    win.destroy();
                                },
                                failure:function(form,action){
                                    Ext.toast("新增系统用户失败,请重试!","系统提示");
                                }
                            });
                        }}
                    ]
                }
            ]
        });

        win.show();
    },
    editModule: function (grid, rowIndex, colIndex, item, e, record, row) {
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
                {fieldLabel:'模块名',name:'name'},
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
                        url: apiBaseUrl + '/index.php/System/Module/editSystemModule',
                        success:function(form,action){
                            Ext.StoreManager.lookup("ModuleStore").load();
                            win.destroy();
                        },
                        failure:function(form,action){
                            Ext.toast("修改系统模块失败,请重试!","系统提示");
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
        win.show();
    }
});