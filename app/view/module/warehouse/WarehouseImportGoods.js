/**
 * Created by Administrator on 2015-06-24.
 */
Ext.define('erp.view.module.warehouse.WarehouseImportGoods', {
    extend: 'Ext.Container',
    xtype: 'warehouseimportgoods',
    requires: [
        'Ext.data.Store',
        'Ext.data.proxy.Ajax',
        'Ext.data.reader.Json',
        'Ext.grid.Panel',
        'Ext.layout.container.VBox',
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
        me.layout = {
            type: 'hbox',
            stretch: true
        };
        var import_list = this.getImportList();
        var panel = this.getInfoPanel();
        this.items = [import_list,panel];
        import_list.on("rowdblclick","onWarehouseImportListGridDblClick");

        me.callParent();
    },
    getImportList: function () {
        var store = Ext.create('Ext.data.Store', {
            fields: ['notice_no', 'id'],
            autoLoad: false,
            storeId:'importGoodsStore',
            proxy: {
                type: 'ajax',
                url: apiBaseUrl + '/index.php/Warehouse/ImportGoods/getWarehouseImportList',
                reader: {
                    type: 'json',
                    rootProperty: 'data',
                    totalProperty: 'total'
                }
            }
        });
        var import_list_grid = Ext.create('Ext.grid.Panel', {
            title: '进货单列表',
            height: '100%',
            width: 300,
            border: true,
            enableColumnHide:false,
            sortableColumns:false,
            selModel:'checkboxmodel',
            columns: [
                {text: '进货单号', dataIndex: 'notice_no', width:110},
                {text:'进货日期',dataIndex:'date',width:90},
                {text: '是否验收', dataIndex: 'is_check', width:100,renderer:function(val){
                    if(1==val) return "<b class='text-primary'>已验收</b>";
                    return "<b class='text-danger'>未验收</b>";
                }},

            ],
            store: store,
            tbar: [
                {
                    text: '新增',
                    iconCls:'addIcon',
                    //glyph: 0xf067,
                    handler: 'addImportGoodsOrder'
                },
                {
                    text: '删除',
                    iconCls:'delIcon',
                    //glyph: 0xf1f8,
                    handler:'delImportGoodsOrder'
                }
            ],
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'bottom',
                layout:'vbox',
                items: [{
                    xtype:'radiogroup',
                    fieldLabel:'状态',
                    labelAlign:'right',
                    labelWidth:30,
                    defaults:{
                      margin:'0 2 0 0'
                    },
                    items:[
                        { boxLabel: '全部', name: 'is_check', inputValue: 2, checked: true},
                        { boxLabel: '未验', name: 'is_check', inputValue: 0},
                        { boxLabel: '已验', name: 'is_check', inputValue: 1}
                    ],
                    listeners:{
                        change:function(obj){
                            var val = obj.getValue(),
                                pt = import_list_grid.down("pagingtoolbar");
                            store.setProxy({
                                type: 'ajax',
                                url: apiBaseUrl + '/index.php/Warehouse/ImportGoods/getWarehouseImportList?is_check=' + val.is_check,
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
                    store: store,
                    defaults:{
                        margin:0,
                        padding:0
                    }
                }]
            }],
            listeners: {
                afterrender: function () {
                    store.load();
                }
            }
        });
        return import_list_grid;
    },
    getInfoPanel: function () {
        var panel = Ext.create('Ext.panel.Panel',{
            name:"info",
            title:'进货单详情',
            flex:1,
            layout:'vbox',
            height:'100%'
        });

        return panel;
    }
});

