/**
 * Created by Administrator on 2015-07-13.
 */
Ext.define('erp.view.module.member.VIPCardOpenLimit',{
    extend:'Ext.grid.Panel',
    xtype:'vipcardopenlimit',

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
        {text:'新增',iconCls:'addIcon',handler:"addVIPCardOpenLimit"},
        {text:'删除',iconCls:'delIcon',handler:"delVIPCardOpenLimit"},
        //{text:'修改',iconCls:'editIcon',handler:"editVIPCardOpenLimit"}
    ],
    selModel:'checkboxmodel',
    columns:[
        {text:'卡类别',dataIndex:'member_name',flex:1},
        {text:'调整积分',dataIndex:'rule_integr'},
        {text:'当日个人消费累计',dataIndex:'rule_day',flex:1},
        {text:'半年个人消费累计',dataIndex:'rule_halfayear',flex:1},
        {text:'一年个人消费累计',dataIndex:'rule_year',flex:1},
        {text:'状态',dataIndex:'rule_status',flex:1},
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
                    handler: "editVIPCardOpenLimit"
                }
            ]
        }
    ],
    store:"VIPCardOpenLimitStore",
    listeners:{
        afterrender:function(){
            this.getStore().load();
        }
    }
});