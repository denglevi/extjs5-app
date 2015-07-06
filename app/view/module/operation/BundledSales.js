/**
 * Created by Administrator on 2015-07-06.
 */
Ext.define('erp.view.module.operation.BundledSales', {
    extend: 'Ext.grid.Panel',
    xtype: 'bundledsales',
    requires: [
        'Ext.form.field.Text',
        'Ext.toolbar.Paging',
        'erp.view.module.operation.OperationModel',
        'erp.view.module.operation.SalesActivityController'
    ],
    controller: 'salesactivity',
    viewModel: 'operation',
    initComponent: function () {
        var me = this;
        Ext.apply(me, {
            selModel:'checkboxmodel',
            sortableColumns: false,
            enableColumnHide: false,
            tbar:[
                {text:'新增',glyph:0xf067,handler:'addBundledSales'},
                {text:'删除',glyph:0xf1f8,handler:'delBundledSales'},
                {text:'修改',glyph:0xf044,handler:'editBundledSales'},'->',
                {xtype:'textfield',fieldLabel:'开始日期',labelAlign:'right'},
                {xtype:'textfield',fieldLabel:'结束日期',labelAlign:'right'},
                {text:'搜索'}
            ],
            columns: [
                {text: '活动编号', dataIndex: 'docment_no', flex: 1},
                {text: '活动店铺', dataIndex: 'shops_name', flex: 1},
                {text: '制单日期', dataIndex: 'crea_time', flex: 1},
                {text: '活动名称', dataIndex: 'activy_name', flex: 1},
                {text: '开始日期', dataIndex: 'start_date', flex: 1},
                {text: '结束日期', dataIndex: 'end_date', flex: 1},
                {text: '状态', dataIndex: 'status', flex: 1,renderer:function(val){
                    if(0 == val) return "未审核";
                    if(1 == val) return "已审核";
                    if(2 == val) return "已启动";
                    if(2 == val) return "已结束";
                }},
                {text: '操作', dataIndex: 'cleraing_condition', flex: 1}
            ],
            store:'BundledSalesListStore',
            bbar:['->', {
                xtype: 'pagingtoolbar',
                store: 'BundledSalesListStore'
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