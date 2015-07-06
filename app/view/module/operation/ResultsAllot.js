/**
 * Created by Administrator on 2015-07-01.
 */
Ext.define('erp.view.module.operation.ResultsAllot', {
    extend: 'Ext.grid.Panel',
    xtype: 'resultsallot',

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
                {text:'新增',glyph:0xf067,handler:'addResultAllot'},
                {text:'删除',glyph:0xf1f8,handler:'delResultAllot'},
                {text:'修改',glyph:0xf044,handler:'editResultAllot'}
            ],
            columns: [
                {text: '年月', dataIndex: 'themonths', flex: 1},
                {text: '店铺', dataIndex: 'shops_name', flex: 1},
                {text: '金额', dataIndex: 'money', flex: 1},
                {text: '分配时间', dataIndex: 'allot_time', flex: 1}
            ],
            store:'ResultAllotListStore',
            bbar:['->', {
                xtype: 'pagingtoolbar',
                store: 'ResultAllotListStore'
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