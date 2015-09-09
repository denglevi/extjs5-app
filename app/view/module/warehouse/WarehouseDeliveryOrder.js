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
                layout:'vbox',
                height:'100%',
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
            width: 250,
            border:true,
            sortableColumns: false,
            enableColumnHide: false,
            tbar: [
                {text: '新增', iconCls: 'addIcon', handler: "addWarehouseDeliveryGoodsOrder"},
                {text: '删除', iconCls: 'delIcon',handler:"delWarehouseDeliveryGoodsOrder"}
            ],
            selModel: 'checkboxmodel',
            columns: [
                {text: '配货单号', dataIndex: 'noder_no', width:130},
                {text: '状态', dataIndex: 'status',flex:1, renderer:function(val){
                    console.log(val);
                    if(0 == val||val == null) return '<b>未发</b>';
                    if(1 == val) return '<b class="text-info">已发</b>';
                    if(2 == val) return '<b class="text-danger">终止</b>';
                    if(3 == val) return '<b class="text-danger">已收货</b>';
                }}
            ],
            store: 'WarehouseDeliveryOrderStore',
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'bottom',
                layout:'vbox',
                items: [{
                    xtype:'radiogroup',
                    hideLabel:true,
                    labelAlign:'right',
                    defaults:{
                      margin:'0 5 0 0'
                    },
                    items:[
                        { boxLabel: '全部', name: 'status', inputValue: 3, checked: true},
                        { boxLabel: '未发', name: 'status', inputValue: 0},
                        { boxLabel: '已发', name: 'status', inputValue: 1},
                        { boxLabel: '终止', name: 'status', inputValue: 2}
                    ],
                    listeners:{
                        change:function(obj){
                            var val = obj.getValue(),
                                pt = grid.down("pagingtoolbar"),
                                store = Ext.StoreManager.lookup("WarehouseDeliveryOrderStore");
                            store.setProxy({
                                type: 'ajax',
                                url: apiBaseUrl + '/index.php/Warehouse/DeliveryGoods/getDeliveryGoodsOrderList?status=' + val.status,
                                reader: {
                                    start:0,
                                    type: 'json',
                                    rootProperty: 'data',
                                    totalProperty: 'total'
                                }
                            });
                            pt.moveFirst();
                        }
                    }
                },{
                    xtype: 'pagingtoolbar',
                    store: 'WarehouseDeliveryOrderStore',
                    defaults:{
                        margin:0,
                        padding:0
                    }
                }]
            }]
        });

        return grid;
    }
})
