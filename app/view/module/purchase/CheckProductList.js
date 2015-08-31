/**
 * Created by denglevi on 15-6-14.
 */
Ext.define('erp.view.module.purchase.CheckProductList', {
    extend: "Ext.grid.Panel",
    alias:"widget.checkproductlist",
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
    title:'验货单列表',
    width:'100%',
    height:'100%',
    border:true,
    sortableColumns:false,
    initComponent:function(args){
        var me = this;
        me.store = Ext.create("Ext.data.Store",{
            storeId:"CheckProductListStore",
            fields: ['id','check_no','order_no','batch_no','supplier_id','buyer_id','create_time'],
            autoLoad:false,
            proxy: {
                type: 'ajax',
                url: apiBaseUrl+'/index.php/Purchasing/CheckProduct/getCheckProductOrderList',
                reader: {
                    type: 'json',
                    rootProperty: 'data',
                    totalProperty: 'total'
                }
            }
        });
        me.bbar = ['->', {
            xtype: 'pagingtoolbar',
            store: 'CheckProductListStore',
            displayInfo: true
        }];

        this.callParent(args)
    },
    tbar: [
        '->',
        {
            xtype: 'textfield',
            fieldLabel: "采购订单号",
            name: 'purchase_no',
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
            //glyph: 0xf002,
            iconCls:'searchIcon',
            handler:function(){
                var grid = this.up("checkproductlist"),
                    purchase_no = grid.down("textfield[name=purchase_no]").getValue(),
                    batch_no = grid.down("textfield[name=batch_no]").getValue(),
                    pt = grid.down("pagingtoolbar"),
                    store = grid.getStore();
                store.setProxy({
                    extraParams: {
                        batch_no: batch_no,
                        purchase_no: purchase_no
                    },
                    type: 'ajax',
                    url: apiBaseUrl+'/index.php/Purchasing/CheckProduct/getCheckProductOrderList',
                    reader: {
                        type: 'json',
                        rootProperty: 'data',
                        totalProperty: 'total'
                    }
                });
                store.on("load", function () {
                    grid.down("textfield[name=batch_no]").reset();
                    grid.down("textfield[name=purchase_no]").reset();
                });
                pt.moveFirst();
            }
        }],
    columns:[
        {text:'验货订单号',dataIndex:'check_no',flex:1},
        {text:'采购订单号',dataIndex:'order_no',flex:1},
        {text:'供货单号',dataIndex:'batch_no',flex:1},
        {text:'供应商',dataIndex:'name',flex:1},
        {text:'买手',dataIndex:'nickname'},
        {text:'备注',dataIndex:'mark',flex:1},
        {text:'提交日期',dataIndex:'date'}
    ],
    listeners:{
        afterrender:function(){
            this.getStore().load();
        },
        rowdblclick: 'onCheckProductOrderGridDblClick'
    }
});