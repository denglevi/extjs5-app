/**
 * Created by Administrator on 2015-06-12.
 */
Ext.define('erp.view.module.purchase.PurchaseOrderList', {
    extend: "Ext.grid.Panel",
    alias: "widget.purchaseorderlist",
    requires: [
        'Ext.form.field.Text',
        'Ext.grid.column.Action',
        'Ext.toolbar.Fill',
        'Ext.toolbar.Paging',
        'erp.view.module.purchase.SupplierMngController',
        'erp.view.module.purchase.SupplierMngModel'
    ],
    controller: 'suppliermng',
    viewModel: {
        type: 'suppliermng'
    },
    initComponent:function(args){
        var me = this;
        me.store = Ext.create("Ext.data.Store",{
            storeId: 'PurchaseOrderListStore',
            fields: ['id', 'order_nos', 'name', 'order_type', 'status_name', 'order_time', 'order_buyer'],
            autoLoad: false,
            proxy: {
                type: 'ajax',
                url: apiBaseUrl + '/index.php/Purchasing/Buyer/getPurchaseOrderList.html?api=1',
                reader: {
                    type: 'json',
                    rootProperty: 'data',
                    totalProperty: 'total'
                }
            }
        });
        me.bbar = ['->', {
            xtype: 'pagingtoolbar',
            store: me.store,
            displayInfo: true
        }];
        this.on("afterrender",function(){
           var store =  me.getStore();
            //store.setProxy({
            //    type: 'ajax',
            //    url: apiBaseUrl + '/index.php/Purchasing/Buyer/getPurchaseOrderList.html?api=1',
            //    reader: {
            //        type: 'json',
            //        rootProperty: 'data',
            //        totalProperty: 'total'
            //    }
            //});
            store.load();
            Ext.Ajax.request({
                async: true,
                url: apiBaseUrl + '/index.php/Purchasing/Buyer/getSupplierAndBuyer',
                success: function (response) {
                    //myMask.destroy( );
                    var text = Ext.decode(response.responseText);
                    if(!text.success){
                        Ext.toast("获取数据错误,请关闭重试!","系统提示");
                        return;
                    }
                    res = text.data;
                    me.down("combo[name=supllier_name]").setStore(Ext.create('Ext.data.Store', {
                        fields: ['id_no', 'name'],
                        data:res.supplier
                    }));
                    me.down("combo[name=supllier_name]").setDisabled(false);
                }
            });
        });

        this.callParent(args);
    },
    listeners:{
        rowdblclick:"onPurchaseOrderGridDblClick"
    },
    sortableColumns:false,
    selModel: 'checkboxmodel',   //选择框
    title: '采购单列表',
    width: '100%',
    height: '100%',
    border: true,
    tbar: [
        {
            text: '新增',
            //glyph: 0xf067,
            iconCls:'addIcon',
            handler: 'addPurchaseOrder'
        },
        {
            text: '删除',
            //glyph: 0xf1f8,
            iconCls:'delIcon',
            handler:'deletePurchaseOrder'
        }, '->',
        {
            xtype: 'textfield',
            fieldLabel: "采购订单号",
            name: 'purchase_order_no',
            labelAlign:'right'
        },
        {
            xtype: 'combo',
            fieldLabel: "供应商名称",
            name: 'supllier_name',
            displayField:'name',
            valueField:'id_no',
            disabled:true,
            editable:false,
            labelAlign:'right'
        },
        {
            text: '搜索',
            //glyph: 0xf002,
            iconCls:'searchIcon',
            handler:function(){
                var grid = this.up("purchaseorderlist"),
                    purchase_order_no = grid.down("textfield[name=purchase_order_no]").getValue(),
                    supllier_name = grid.down("textfield[name=supllier_name]").getValue(),
                    pt = grid.down("pagingtoolbar"),
                    store = grid.getStore();
                store.setProxy({
                    extraParams: {
                        supllier_name: supllier_name,
                        purchase_order_no: purchase_order_no
                    },
                    type: 'ajax',
                    url: apiBaseUrl + '/index.php/Purchasing/Buyer/getPurchaseOrderList.html?api=1',
                    reader: {
                        type: 'json',
                        rootProperty: 'data',
                        totalProperty: 'total'
                    }
                });
                store.on("load", function () {
                    grid.down("textfield[name=purchase_order_no]").reset();
                    grid.down("textfield[name=supllier_name]").reset();
                });
                pt.moveFirst();
            }
        }],
    columns: [
        {text: '订单号', dataIndex: 'order_nos',flex:1},
        {text: '供应商', dataIndex: 'name',flex:1},
        {text: '买手', dataIndex: 'order_buyer'},
        {text: '订单类型', dataIndex: 'order_state',renderer:function(value, cellmeta, record, rowIndex, columnIndex, store){
            if(value == 'spot_purchase_order'){
                return '现货';
            }
            return '期货';
        }},
        {text: '状态', dataIndex: 'status_name'},
        {text: '提交日期', dataIndex: 'order_time', flex: 2},
        {
            text: '操作',
            xtype: 'actioncolumn',
            flex: 1,
            items: [
                {
                    iconCls: 'viewIcon columnAction',
                    tooltip: '查看',
                    handler: "viewPurchaseOrderInfo"
                }
            ]
        }
    ],
    store: 'PurchaseOrderListStore'
});