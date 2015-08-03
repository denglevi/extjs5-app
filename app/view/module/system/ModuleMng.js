/**
 * Created by Administrator on 2015-08-03.
 */
Ext.define('erp.view.module.system.ModuleMng', {
    extend: 'Ext.grid.Panel',
    xtype: 'modulemng',

    requires: [
        'Ext.grid.column.Action'
    ],

    initComponent:function(args){
        var me = this;

        Ext.apply(me,{
            tbar:[
                {text:'新增',iconCls:'addIcon'}
            ],
            sortableColumns:false,
            enableColumnHide:false,
            columns:[
                {text:'名称',dataIndex:'name',flex:1},
                {text:'描述',dataIndex:'description',flex:1},
                {text:'上级模块',dataIndex:'parent_module',flex:1},
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
                        {
                            iconCls: 'delIcon columnAction',
                            tooltip: '删除',
                            handler: "viewCustomerInfo"
                        },
                        {
                            iconCls: 'editIcon columnAction',
                            tooltip: '修改',
                            handler: "editCustomer"
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

});