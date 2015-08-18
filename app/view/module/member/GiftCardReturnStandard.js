/**
 * Created by Administrator on 2015-07-13.
 */
Ext.define('erp.view.module.member.GiftCardReturnStandard',{
    extend:'Ext.grid.Panel',
    xtype:'giftcardreturnstandard',

    requires: [
        'erp.view.module.member.GiftCardController'
    ],

    controller:'giftcard',
    initComponent:function(){
        var me = this;
        me.callParent();
    },
    tbar:[
        {text:'新增',iconCls:'addIcon',handler:'addGiftCardReturnStandard'},
        {text:'删除',iconCls:'delIcon',handler:'delGiftCardReturnStandard'},
        //{text:'修改',iconCls:'editIcon',handler:'addGiftCardReturnStandard'}
    ],
    selModel:'checkboxmodel',
    columns:[
        {text:'大于(≥)',dataIndex:'rebate_greater',flex:1},
        {text:'小于(＜)',dataIndex:'rebate_sga',flex:1},
        {text:'返利率',dataIndex:'return_rebate',flex:1},
    ],
    store:"GiftCardReturnStandardStore",
    listeners:{
        afterrender:function(){
            this.getStore().load();
        }
    }
});