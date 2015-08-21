/**
 * Created by Administrator on 2015-08-20.
 */
Ext.define('erp.view.module.financial.CostAccount', {
    extend: 'Ext.Container',
    xtype: 'costaccount',
    requires: [
        'Ext.data.Store',
        'Ext.data.proxy.Ajax',
        'Ext.data.reader.Json',
        'Ext.grid.Panel',
        'Ext.layout.container.VBox',
        'Ext.panel.Panel'
    ],
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
            title: '成本单列表',
            height: '100%',
            width: 300,
            border: true,
            enableColumnHide:false,
            sortableColumns:false,
            selModel:'checkboxmodel',
            columns: [
                {text: '成本单号', dataIndex: 'notice_no', width:110},
                {text:'申请日期',dataIndex:'date',width:90},
                {text: '状态', dataIndex: 'status', width:100,renderer:function(val){
                    if(1==val) return "<b class='text-primary'>已验收</b>";
                    return "<b class='text-danger'>未验收</b>";
                }},

            ],
            store: store,
            tbar: [
                //{
                //    text: '新增',
                //    iconCls:'addIcon',
                //    //glyph: 0xf067,
                //    handler: 'addImportGoodsOrder'
                //},
                {
                    text: '删除',
                    iconCls:'delIcon',
                    //glyph: 0xf1f8,
                    handler:'delImportGoodsOrder'
                }
            ],
            bbar: ['->', {
                xtype: 'pagingtoolbar',
                store: store,
                displayInfo: false
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
            title:'成本单详情',
            flex:1,
            layout:'vbox',
            height:'100%'
        });
        return panel;
    }
});