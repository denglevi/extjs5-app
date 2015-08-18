/**
 * Created by Administrator on 2015-06-29.
 */
Ext.define('erp.view.module.warehouse.WarehouseMoveLocation', {
    extend: 'Ext.Container',
    xtype: 'warehousemovelocation',
    requires: [
        'Ext.container.Container',
        'Ext.data.Store',
        'Ext.data.proxy.Ajax',
        'Ext.data.reader.Json',
        'Ext.grid.Panel',
        'Ext.panel.Panel',
        'erp.view.module.warehouse.WarehouseController',
        'erp.view.module.warehouse.WarehouseModel'
    ],

    viewModel: {
        type: 'warehouse'
    },
    controller: 'warehouse',
    initComponent: function () {
        var me = this;
        me.layout = 'hbox';

        var import_list = this.getMoveLocationList();
        this.items = [import_list];
        import_list.on("rowdblclick","onMoveLocationGridDblClick");

        me.callParent();
    },
    getMoveLocationList: function () {
        var store = Ext.create('Ext.data.Store', {
            fields: ['move_no', 'id'],
            autoLoad: false,
            storeId:'moveLocationStore',
            proxy: {
                type: 'ajax',
                url: apiBaseUrl + '/index.php/Warehouse/Manage/getWarehouseMoveLocationList',
                reader: {
                    type: 'json',
                    rootProperty: 'data',
                    totalProperty: 'total'
                }
            }
        });
        var import_list_grid = Ext.create('Ext.grid.Panel', {
            title: '移位单列表',
            height: '100%',
            width: 300,
            reference:'move_location_grid',
            border: true,
            sortableColumns:false,
            selModel:'checkboxmodel',
            enableRemoveColumn:false,
            columns: [
                {text: '移位单号', dataIndex: 'move_no', width:150},
                {text: '是否提交', dataIndex: 'status', width:150,renderer:function(val){
                    if(1 == val) return '<b class="text-info">已提交</b>';
                    return '<b class="text-danger">未提交</b>';
                }}
            ],
            store: store,
            tbar: [
                {
                    text: '新增',
                    //glyph: 0xf067,
                    iconCls:'addIcon',
                    handler: 'addMoveLocationOrder'
                },
                {
                    text: '删除',
                    //glyph: 0xf1f8,
                    iconCls:'delIcon',
                    handler:'delMoveLocationOrder'
                }
            ],
            //bbar: ['->', {
            //    xtype: 'pagingtoolbar',
            //    store: store,
            //    displayInfo: true
            //}],
            listeners: {
                afterrender: function () {
                    store.load();
                }
            }
        });
        return import_list_grid;
    }
});

