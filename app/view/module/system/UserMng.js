/**
 * Created by Administrator on 2015-08-03.
 */
Ext.define('erp.view.module.system.UserMng', {
    extend: 'Ext.grid.Panel',
    xtype: 'usermng',

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
                {text:'登录名',dataIndex:'username',flex:1},
                {text:'部门',dataIndex:'group_name',flex:1},
                {text:'角色',dataIndex:'role_name',flex:1},
                {text:'邮箱',dataIndex:'email',flex:2},
                {text:'电话',dataIndex:'mobile',flex:1},
                {text:'注册时间',dataIndex:'create_time',flex:1},
                {text:'最后登录时间',dataIndex:'last_login_time',flex:1},
                {text:'最后登录IP',dataIndex:'last_login_ip',flex:1},
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
            store:'UserStore',
            listeners:{
                afterrender:function(){
                    this.getStore().load();
                }
            }
        });
        this.callParent(args);
    },

});