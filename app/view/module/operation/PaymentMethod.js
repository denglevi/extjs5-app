/**
 * Created by Administrator on 2015-07-01.
 */
Ext.define('erp.view.module.operation.PaymentMethod', {
    extend: 'Ext.grid.Panel',
    xtype: 'paymentmethod',
    requires: [
        'Ext.toolbar.Paging',
        'erp.view.module.operation.OperationController',
        'erp.view.module.operation.OperationModel'
    ],
    controller: 'operation',
    viewModel: 'operation',
    initComponent: function () {
        var me = this;
        Ext.apply(me, {
            selModel:'checkboxmodel',
            sortableColumns: false,
            enableColumnHide: false,
            tbar:[
                {text:'新增',
                    //glyph:0xf067,
                    iconCls:'addIcon',
                    handler:'addPaymentMethod'},
                {text:'删除',
                    //glyph:0xf1f8,
                    iconCls:'delIcon',
                    handler:'delPaymentMethod'},
                {text:'修改',
                    //glyph:0xf044,
                    iconCls:'editIcon',
                    handler:'editPaymentMethod'}
            ],
            columns: [
                {text: '结算方式', dataIndex: 'cleraing_name', flex: 1},
                {text: '结算类别', dataIndex: 'cleraing_class', flex: 1,renderer:function(val){
                    if(1 == val) return "银行卡";
                    if(2 == val) return "现金";
                    if(3 == val) return "礼券";
                    if(4 == val) return "其他";
                }},
                {text: '手续费率', dataIndex: 'cleraing_poundage', flex: 1},
                {text: '线上支付', dataIndex: 'cleraing_onlinepayment', flex: 1,renderer:function(val){
                    if(1==val) return "是";
                    return "否";
                }},
                {text: '找零', dataIndex: 'cleraing_change', flex: 1,renderer:function(val){
                    if(1==val) return "是";
                    return "否";
                }},
                {text: '积分', dataIndex: 'cleraing_integral', flex: 1,renderer:function(val){
                    if(1==val) return "是";
                    return "否";
                }},
                {text: '状态', dataIndex: 'cleraing_condition', flex: 1,renderer:function(val){
                    if(1==val) return "禁用";
                    return "激活";
                }}
            ],
            store:'PaymentMethodStore',
            bbar:['->', {
                xtype: 'pagingtoolbar',
                store: 'PaymentMethodStore',
                displayInfo:true
            }],
            listeners:{
                afterrender:function(){
                    this.getStore().load();
                }
            }
        });
        this.callParent();
    }
});