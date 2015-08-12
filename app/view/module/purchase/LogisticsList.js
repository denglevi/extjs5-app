/**
 * Created by denglevi on 15-6-14.
 */
Ext.define('erp.view.module.purchase.LogisticsList', {
    extend: 'Ext.grid.Panel',
    xtype:'logisticslist',
    requires: [
        'Ext.form.field.Text',
        'Ext.toolbar.Fill',
        'Ext.toolbar.Paging',
        'erp.view.module.purchase.SupplierMngController',
        'erp.view.module.purchase.SupplierMngModel'
    ],

    viewModel: {
        type: 'suppliermng'
    },
    controller: 'suppliermng',
    selModel: 'checkboxmodel',   //选择框
    title:'采购物流列表',
    width:'100%',
    height:'100%',
    border:true,
    store:'LogisticsListStore',
    sortableColumns:false,
    initComponent:function(args){
        var me = this;
        me.store = Ext.create("Ext.data.Store",{
            storeId:"LogisticsListStore",
            fields: ['id','logistics_no','order_no','batch_no','supplier_id','contact','create_time','name'],
            autoLoad:false,
            proxy: {
                type: 'ajax',
                url: apiBaseUrl+'/index.php/Purchasing/Logistics/getLogisticsOrderList',
                reader: {
                    type: 'json',
                    rootProperty: 'data',
                    totalProperty: 'total'
                }
            }
        });
        me.bbar = ['->', {
            xtype: 'pagingtoolbar',
            store: 'LogisticsListStore',
            displayInfo: true
        }];
        this.callParent(args)
    },
    tbar: [
        //{
        //    text:'新增',
        //    glyph:0xf067,
        //    //handler:'addPurchaseOrder'
        //},
        {
            text:'删除',
            glyph:0xf1f8,
            handler: 'deleteLogisticsOrder'
        },'->',
        {
            xtype: 'textfield',
            fieldLabel: "物流单号",
            name: 'logistic_no',
            labelAlign:'right'
        },
        {
            xtype: 'textfield',
            fieldLabel: "采购批次号",
            name: 'batch_no',
            labelAlign:'right'
        },
        {
            text: '搜索',
            glyph: 0xf002,
            handler:function(){
                var grid = this.up("logisticslist"),
                    logistic_no = grid.down("textfield[name=logistic_no]").getValue(),
                    batch_no = grid.down("textfield[name=batch_no]").getValue(),
                    pt = grid.down("pagingtoolbar"),
                    store = grid.getStore();
                store.setProxy({
                    extraParams: {
                        batch_no: batch_no,
                        logistic_no: logistic_no
                    },
                    type: 'ajax',
                    url: apiBaseUrl+'/index.php/Purchasing/Logistics/getLogisticsOrderList',
                    reader: {
                        type: 'json',
                        rootProperty: 'data',
                        totalProperty: 'total'
                    }
                });
                store.on("load", function () {
                    grid.down("textfield[name=batch_no]").reset();
                    grid.down("textfield[name=logistic_no]").reset();
                });
                pt.moveFirst();
            }
        }],
    columns:[
        {text:'物流单号',dataIndex:'logistics_no',flex:1},
        {text:'供货单号',dataIndex:'batch_no',flex:1},
        {text:'供应商',dataIndex:'name',flex:1},
        {text:'物流类型',dataIndex:'logistics_type',renderer:function(val){
            if(0 == val) return "国内陆运";
            if(1 == val) return "国内空运";
            if(2 == val) return "国际空运";
            if(3 == val) return "国际海运";
        }},
        {text:'联系人',dataIndex:'contact',flex:1},
        {text:'提交日期',dataIndex:'date'}
    ],
    listeners:{
        afterrender:function(){
            this.getStore().load();
        }
    }
});