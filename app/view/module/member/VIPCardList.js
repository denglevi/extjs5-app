/**
 * Created by Administrator on 2015-07-13.
 */
Ext.define('erp.view.module.member.VIPCardList',{
    extend:'Ext.grid.Panel',
    xtype:'vipcardlist',
    columns:[
        {text:'����',dataIndex:''},
        {text:'����',dataIndex:''},
        {text:'�ۿ�',dataIndex:''},
        {text:'���������ֱ�',dataIndex:''},
        {text:'����',dataIndex:'���ֱ���'}
    ],
    store:"VIPCardListStore"
});
