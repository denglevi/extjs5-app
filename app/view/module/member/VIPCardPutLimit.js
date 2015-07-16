/**
 * Created by Administrator on 2015-07-13.
 */
Ext.define('erp.view.module.member.VIPCardPutLimit',{
    extend:'Ext.grid.Panel',
    xtype:'vipcardputlimit',

    requires: [
        'erp.view.module.member.VIPCardController'
    ],

    controller:"vipcard",
    initComponenet:function(){
        var me = this;
        me.callParent();
    },
    tbar:[
        {text:'新增',iconCls:'addIcon',handler:"addVIPCardPutLimit"},
        {text:'删除',iconCls:'delIcon',handler:"delVIPCardPutLimit"},
        {text:'修改',iconCls:'editIcon',handler:"editVIPCardPutLimit"}
    ],
    selModel:'checkboxmodel',
    columns:[
        {text:'单据编号',dataIndex:'put_number',flex:1},
        {text:'业务日期',dataIndex:'put_time'},
        {text:'卡类别',dataIndex:'member_name',flex:1},
        {text:'卡前缀',dataIndex:'put_prefix',flex:1},
        {text:'起始编号',dataIndex:'put_startber',flex:1},
        {text:'截至编号',dataIndex:'put_uptober',flex:1},
        {text:'编码长度',dataIndex:'put_lenght',flex:1},
        {text:'状态',dataIndex:'put_status',flex:1}
    ],
    store:"VIPCardPutLimitStore",
    listeners:{
        afterrender:function(){
            this.getStore().load();
        }
    }
});