/**
 * Created by Administrator on 2015-07-13.
 */
Ext.define('erp.view.module.member.VIPCardUpdateLimit',{
    extend:'Ext.grid.Panel',
    xtype:'vipcardupdatelimit',

    requires: [
        'Ext.grid.column.Action',
        'erp.view.module.member.VIPCardController'
    ],

    controller:"vipcard",
    initComponenet:function(){
        var me = this;
        me.callParent();
    },
    tbar:[
        {text:'新增',iconCls:'addIcon',handler:"addVIPCardUpdateLimit"},
        {text:'删除',iconCls:'delIcon',handler:"delVIPCardUpdateLimit"},
        //{text:'修改',iconCls:'editIcon',handler:"editVIPCardUpdateLimit"}
    ],
    selModel:'checkboxmodel',
    columns:[
        {text:'原卡类别',dataIndex:'member_name',flex:1},
        {text:'升级卡类别',dataIndex:'change_upname'},
        {text:'消费周期(月)',dataIndex:'change_cyle',flex:1},
        {text:'周期消费内金额',dataIndex:'change_money',flex:1},
        {text:'消费周期(年)',dataIndex:'change_year',flex:1},
        {text:'周期消费内金额',dataIndex:'change_yearey',flex:1},
        {text:'状态',dataIndex:'change_status',flex:1},
        {
            text: '操作',
            xtype: 'actioncolumn',
            flex: 1,
            items: [
                //{
                //    iconCls: 'viewIcon columnAction',
                //    tooltip: '查看',
                //    handler: "viewVIPInfo"
                //},
                {
                    iconCls: 'editIcon columnAction',
                    tooltip: '修改',
                    handler: "editVIPCardUpdateLimit"
                }
            ]
        }
    ],
    store:"VIPCardUpdateLimitStore",
    listeners:{
        afterrender:function(){
            this.getStore().load();
        }
    }
});