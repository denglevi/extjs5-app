/**
 * Created by Administrator on 2015-07-13.
 */
Ext.define('erp.view.module.member.VIPCardList',{
    extend:'Ext.grid.Panel',
    xtype:'vipcardlist',

    requires: [
        'Ext.grid.column.Action',
        'erp.view.module.member.VIPCardController'
    ],
    initComponenet:function(){
        var me = this;
        me.callParent();
    },
    controller:"vipcard",
    tbar:[
        {text:'新增',iconCls:'addIcon',handler:"addVIPCardType"},
        {text:'删除',iconCls:'delIcon',handler:"delVIPCardType"},
        //{text:'修改',iconCls:'editIcon',handler:"editVIPCardType"}
    ],
    sortableColumns:false,
    selModel:'checkboxmodel',
    columns:[
        {text:'代码',dataIndex:'member_code',flex:1},
        {text:'名称',dataIndex:'member_name',flex:1},
        {text:'折扣',dataIndex:'member_dis',flex:1},
        {text:'基本金额积分比',dataIndex:'member_netcash',flex:1},
        {text:'积分倍率',dataIndex:'member_ratio',flex:1},
        {text:'状态',dataIndex:'member_out',flex:1,renderer:function(val){
            if(1==val) return "停用";
            if(0==val) return "启用";
        }},
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
                    handler: "editVIPCardType"
                }
            ]
        }
    ],
    store:"VIPCardListStore",
    listeners:{
        afterrender:function(){
            this.getStore().load();
        }
    }
});
