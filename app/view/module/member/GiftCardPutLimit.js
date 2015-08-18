/**
 * Created by Administrator on 2015-07-13.
 */
Ext.define('erp.view.module.member.GiftCardPutLimit',{
    extend:'Ext.grid.Panel',
    xtype:'giftcardputlimit',

    requires: [
        'Ext.grid.column.Action',
        'erp.view.module.member.GiftCardController'
    ],

    controller:'giftcard',
    initComponent:function(){
        var me = this;
        me.callParent();
    },
    tbar:[
        {text:'新增',iconCls:'addIcon',handler:'addGiftCardPutLimit'},
        {text:'删除',iconCls:'delIcon',handler:'delGiftCardPutLimit'},
        //{text:'修改',iconCls:'editIcon',handler:'editGiftCardPutLimit'}
    ],
    selModel:'checkboxmodel',
    columns:[
        {text:'编号',dataIndex:'gift_code',flex:1},
        {text:'日期',dataIndex:'gift_time',flex:1},
        {text:'卡前缀',dataIndex:'gift_prefix',flex:1},
        {text:'起始编号',dataIndex:'gift_start',flex:1},
        {text:'截至编号',dataIndex:'gift_upto',flex:1},
        {text:'编码长度',dataIndex:'gift_lenght',flex:1},
        {text:'状态',dataIndex:'gift_status',flex:1},
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
                    handler: "editGiftCardPutLimit"
                }
            ]
        }
    ],
    store:"GiftCardPutLimitStore",
    listeners:{
        afterrender:function(){
            this.getStore().load();
        }
    }
});
