/**
 * Created by Administrator on 2015-07-13.
 */
Ext.define('erp.view.module.member.VIPMng',{
    extend:'Ext.grid.Panel',
    xtype:'vipmng',

    initComponenet:function(){
        var me = this;
        me.callParent();
    },
    tbar:[
        {text:'新增',iconCls:'addIcon'},
        {text:'删除',iconCls:'delIcon'},
        {text:'修改',iconCls:'editIcon'}
    ],
    selModel:'checkboxmodel',
    columns:[
        {text:'会员卡号',dataIndex:'customer_name',flex:1},
        {text:'会员姓名',dataIndex:'customer_type'},
        {text:'会员类型',dataIndex:'customer_sex',flex:1},
        {text:'性别',dataIndex:'customer_birthday',flex:1},
        {text:'生日',dataIndex:'customer_age',flex:1},
        {text:'年代',dataIndex:'customer_phone',flex:1},
        {text:'手机号',dataIndex:'customer_sum',flex:1},
        {text:'消费总金额',dataIndex:'customer_rcdate',flex:1},
        {text:'最近消费日期',dataIndex:'customer_rcdate',flex:1},
        {text:'备注',dataIndex:'customer_rcdate',flex:1}
    ],
    store:"VIPCardListStore",
    listeners:{
        afterrender:function(){
            this.getStore().load();
        }
    }
});