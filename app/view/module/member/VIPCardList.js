/**
 * Created by Administrator on 2015-07-13.
 */
Ext.define('erp.view.module.member.VIPCardList',{
    extend:'Ext.grid.Panel',
    xtype:'vipcardlist',
    columns:[
        {text:'代码',dataIndex:''},
        {text:'名称',dataIndex:''},
        {text:'折扣',dataIndex:''},
        {text:'基本金额积分比',dataIndex:''},
        {text:'代码',dataIndex:'积分倍率'}
    ],
    store:"VIPCardListStore"
});
