/**
 * Created by Administrator on 2015-07-13.
 */
Ext.define('erp.view.module.member.CustomerMng',{
    extend:'Ext.grid.Panel',
    xtype:'customermng',

    requires: [
        'erp.view.module.member.CustomerController'
    ],

    controller:'customer',
    initComponenet:function(){
        var me = this;
        me.callParent();
    },
    tbar:[
        {text:'新增',iconCls:'addIcon',handler:'addCustomer'},
        {text:'删除',iconCls:'delIcon',handler:'delCustomer'},
        {text:'修改',iconCls:'editIcon',handler:'editCustomer'}
    ],
    selModel:'checkboxmodel',
    columns:[
        {text:'顾客姓名',dataIndex:'customer_name',flex:1},
        {text:'顾客类型',dataIndex:'customer_type'},
        {text:'性别',dataIndex:'customer_sex',flex:1},
        {text:'生日',dataIndex:'customer_birthday',flex:1},
        {text:'年代',dataIndex:'customer_age',flex:1},
        {text:'手机号',dataIndex:'customer_phone',flex:1},
        {text:'消费总金额',dataIndex:'customer_sum',flex:1},
        {text:'最近消费日期',dataIndex:'customer_rcdate',flex:1},
        {text:'备份',dataIndex:'customer_backups',flex:1}
    ],
    store:"CustomerMngStore",
    listeners:{
        afterrender:function(){
            this.getStore().load();
        }
    }
});