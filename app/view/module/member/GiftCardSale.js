/**
 * Created by Administrator on 2015-07-13.
 */
Ext.define('erp.view.module.member.GiftCardSale',{
    extend:'Ext.grid.Panel',
    xtype:'giftcardsale',

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
        {text:'日期',dataIndex:'cardinfo_time',flex:1},
        {text:'卡号',dataIndex:'card_card',flex:1},
        {text:'终端',dataIndex:'shops_name',flex:1},
        {text:'充值金额',dataIndex:'cardinfo_credit',flex:1},
        {text:'返点金额',dataIndex:'cardinfo_rebates',flex:1},
        {text:'返点卡号',dataIndex:'tocard_card',flex:1},
        {text:'销售人',dataIndex:'sales_name',flex:1},
        {text:'经手人',dataIndex:'sales_handled',flex:1},
        {text:'状态',dataIndex:'cardinfo_status',flex:1},
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
    store:"GiftCardSaleStore",
    listeners:{
        afterrender:function(){
            this.getStore().load();
        }
    }
});