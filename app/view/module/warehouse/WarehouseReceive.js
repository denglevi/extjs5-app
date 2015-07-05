/**
 * Created by Administrator on 2015-06-19.
 */
Ext.define('erp.view.module.warehouse.WarehouseReceive', {
    extend: 'Ext.grid.Panel',
    xtype:'warehousereceive',
    requires: [
        'Ext.form.field.Text',
        'Ext.toolbar.Paging',
        'erp.view.module.warehouse.WarehouseController'
    ],
    controller:'warehouse',
    selModel: 'checkboxmodel',   //选择框
    title:'收货单列表',
    width:'100%',
    height:'100%',
    border:true,
    store:'WarehouseReceiveStore',
    sortableColumns:false,
    tbar: [
        {
            text:'新增',
            glyph:0xf067,
            //handler:'addPurchaseOrder'
        },
        //{
        //    text:'删除',
        //    glyph:0xf1f8
        //},
        '->',
        {
            xtype: 'textfield',
            fieldLabel: "物流单号",
            name: 'logistic_no'
        },
        {
            xtype: 'textfield',
            fieldLabel: "采购批次号",
            name: 'batch_no'
        },
        {
            text: '搜索',
            glyph: 0xf002
        }],
    bbar: ['->', {
        xtype: 'pagingtoolbar',
        store: 'WarehouseReceiveStore',
        emptyMsg: '<b>暂无记录</b>',
        displayMsg: '显示 {0} - {1} 总共 {2} 条记录',
        displayInfo: true
    }],
    columns:[
        {text:'物流单号',dataIndex:'logistics_no',flex:1},
        {text:'供货单号',dataIndex:'batch_no',flex:1},
        {text:'供应商',dataIndex:'name',flex:1},
        {text:'物流类型',dataIndex:'type'},
        {text:'联系人',dataIndex:'contact',flex:1},
        {text:'提交日期',dataIndex:'date'},
        {text:'状态',dataIndex:'status',renderer:function(val){
            if(1 == val) return "已收货";

            return "<b class='text-danger'>待收货</b>";
        }}
    ],
    listeners:{
        afterrender:function(){
            this.getStore().load();
        },
        rowdblclick: 'onWarehouseReceiveGridDblClick'
    }
});
