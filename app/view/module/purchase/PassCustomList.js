/**
 * Created by denglevi on 15-6-14.
 */
Ext.define('erp.view.module.purchase.PassCustomList', {
    extend: 'Ext.grid.Panel',
    xtype: 'passcustomlist',
    requires: [
        'Ext.form.field.Text',
        'Ext.toolbar.Fill',
        'Ext.toolbar.Paging',
        'erp.view.module.purchase.SupplierMngController',
        'erp.view.module.purchase.SupplierMngModel',
        'erp.view.window.AddPassCustomWin',
        'erp.view.window.PassCustomInfoWin'
    ],

    viewModel: {
        type: 'suppliermng'
    },
    controller: 'suppliermng',
    selModel: 'checkboxmodel',   //选择框
    title: '清关单列表',
    width: '100%',
    height: '100%',
    border: true,
    sortableColumns: false,
    tbar: [
        {
            text:'新增',
            //glyph:0xf067,
            iconCls:'addIcon',
            handler:'addPassCustomOrder'
        },
        {
            text: '删除',
            //glyph: 0xf1f8,
            iconCls:'delIcon',
            handler: 'deletePassCustomOrder'
        }, '->',
        {
            xtype: 'textfield',
            fieldLabel: "报关单号",
            name: 'pass_customs_no',
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
                var grid = this.up("passcustomlist"),
                    pass_customs_no = grid.down("textfield[name=pass_customs_no]").getValue(),
                    batch_no = grid.down("textfield[name=batch_no]").getValue(),
                    pt = grid.down("pagingtoolbar"),
                    store = grid.getStore();
                store.setProxy({
                    extraParams: {
                        pass_customs_no: pass_customs_no,
                        batch_no: batch_no
                    },
                    type: 'ajax',
                    url: apiBaseUrl+'/index.php/Purchasing/Customs/getPassCustomOrderList',
                    reader: {
                        type: 'json',
                        rootProperty: 'data',
                        totalProperty: 'total'
                    }
                });
                store.on("load", function () {
                    grid.down("textfield[name=pass_customs_no]").reset();
                    grid.down("textfield[name=batch_no]").reset();
                });
                pt.moveFirst();
            }
        }],
    store: 'PassCustomListStore',
    initComponent:function(args){
        var me = this;
        me.store = Ext.create("Ext.data.Store",{
            storeId:"PassCustomListStore",
            fields: ['id','logistics_no','order_no','supply_no','cu_contaits','cu_name','create_time'],
            autoLoad:false,
            proxy: {
                type: 'ajax',
                url: apiBaseUrl+'/index.php/Purchasing/Customs/getPassCustomOrderList',
                reader: {
                    type: 'json',
                    rootProperty: 'data',
                    totalProperty: 'total'
                }
            }
        });
        me.bbar = ['->', {
            xtype: 'pagingtoolbar',
            store: 'PassCustomListStore',
            displayInfo: true
        }];
        this.callParent(args)

    },
    columns: [
        //{text: '采购订单号', dataIndex: 'order_no', flex: 1},
        {text: '报关单号', dataIndex: 'pass_customs_no', flex: 1},
        {text: '供货单号', dataIndex: 'supply_no', flex: 1},
        //{text: '物流单号', dataIndex: 'logistics_no', flex: 1},
        {text: '报关公司', dataIndex: 'cu_name', flex: 1},
        {text: '联系人', dataIndex: 'cu_contaits', flex: 1},
        {text: '报关状态', dataIndex: 'status_name'}
    ],
    listeners: {
        afterrender: function () {
            this.getStore().load();
        },
        rowdblclick:function(obj,record){
            var me = this;
            var win = Ext.create('erp.view.window.PassCustomInfoWin',{
                title:record.get("status_name"),
                record:record
            });
            win.show();
            win.on("beforedestroy",function(){
                me.getStore().load();
            });
        }
    }
});