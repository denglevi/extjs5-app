/**
 * Created by Administrator on 2015-06-30.
 */
Ext.define("erp.view.module.warehouse.WarehouseDeliveryOrder",{
    extend:'Ext.Container',
    xtype:'warehousedeliveryorder',

    requires: [
        'Ext.grid.Panel',
        'Ext.layout.container.HBox',
        'Ext.layout.container.VBox',
        'Ext.panel.Panel',
        'erp.view.module.warehouse.WarehouseController',
        'erp.view.module.warehouse.WarehouseModel'
    ],
    controller:'warehouse',
    viewModel:'warehouse',
    initComponent: function () {
        var me = this;
        me.layout = {
            type: 'hbox',
            align: 'stretch'
        };
        var import_list = this.getDeliveryOrderListGrid();
        this.items = [
            import_list, {
                xtype: 'panel',
                title: '配货单详情',
                flex: 1,
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                itemId: 'info_panel'
            }
        ];;
        import_list.on("rowdblclick","onWarehouseDeliveryGoodsOrderGridDblClick");
        this.listeners = {
            afterrender: function () {
                me.down("grid").getStore().load();
            }
        }
        me.callParent();
    },
    getDeliveryOrderListGrid: function () {
        var grid = Ext.create('Ext.grid.Panel', {
            title: '配货单列表',
            width: 200,
            border:true,
            sortableColumns: false,
            enableColumnHide: false,
            tbar: [
                {text: '新增', iconCls: 'addIcon', handler: "addWarehouseDeliveryGoodsOrder"},
                {text: '删除', iconCls: 'delIcon'}
            ],
            selModel: 'checkboxmodel',
            columns: [{text: '配货单号', dataIndex: 'noder_no', flex: 1}],
            store: 'WarehouseDeliveryOrderStore'
        });

        return grid;
    }
})
