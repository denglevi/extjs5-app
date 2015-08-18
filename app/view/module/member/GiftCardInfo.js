/**
 * Created by Administrator on 2015-07-13.
 */
Ext.define('erp.view.module.member.GiftCardInfo',{
    extend:'Ext.grid.Panel',
    xtype:'giftcardinfo',

    requires: [
        'Ext.grid.column.Action'
    ],

    initComponent:function(){
        var me = this;
        me.callParent();
    },
    tbar:[
        {text:'新增',iconCls:'addIcon'},
        {text:'删除',iconCls:'delIcon'},
        //{text:'修改',iconCls:'editIcon'}
    ],
    selModel:'checkboxmodel',
    columns:[
        {text:'卡号',dataIndex:'giftcard_no',flex:1},
        {text:'发卡终端',dataIndex:'shops_name',flex:1},
        {text:'发卡日期',dataIndex:'sales_time',flex:1},
        {text:'当前余额',dataIndex:'giftcard_money',flex:1},
        {text:'状态',dataIndex:'giftcard_status',flex:1},
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
                    //handler: "editVIPCardUpdateLimit"
                }
            ]
        }
    ],
    store:"GiftCardInfoStore",
    listeners:{
        afterrender:function(){
            this.getStore().load();
        }
    }
});