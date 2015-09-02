/**
 * Created by Administrator on 2015-06-19.
 */
Ext.define('erp.view.module.warehouse.WarehouseReceive', {
    extend: 'Ext.grid.Panel',
    xtype: 'warehousereceive',
    requires: [
        'Ext.form.field.Text',
        'Ext.toolbar.Fill',
        'Ext.toolbar.Paging',
        'erp.view.module.warehouse.WarehouseController'
    ],
    controller: 'warehouse',
    selModel: 'checkboxmodel',   //选择框
    title: '收货单列表',
    width: '100%',
    height: '100%',
    border: true,
    store: 'WarehouseReceiveStore',
    sortableColumns: false,
    tbar: [
        //{
        //    text:'新增',
        //    glyph:0xf067,
        //    //handler:'addPurchaseOrder'
        //},
        //{
        //    text:'删除',
        //    glyph:0xf1f8
        //},
        '->',
        {
            xtype: 'textfield',
            fieldLabel: "物流单号",
            name: 'logistics_no',
            labelAlign: 'right',
            labelWidth:70
        },
        {
            xtype: 'textfield',
            fieldLabel: "采购批次号",
            name: 'batch_no',
            labelAlign: 'right',
            labelWidth:70
        },
        {
            xtype: 'combo',
            fieldLabel: "状态",
            labelAlign: 'right',
            editable:false,
            width:110,
            name: 'status',
            value:2,
            store: Ext.create("Ext.data.Store", {
                fields: [],
                data: [
                    {text: '全部', val: 2},
                    {text: '已收货', val: 1},
                    {text: '待收货', val: 0}
                ]
            }),
            displayField: 'text',
            valueField: 'val',
            labelWidth:30
        },
        {
            text: '搜索',
            iconCls: 'searchIcon',
            handler: function () {
                var grid = this.up("grid"),
                    logistics_no = grid.down("textfield[name=logistics_no]").getValue(),
                    batch_no = grid.down("textfield[name=batch_no]").getValue(),
                    pt = grid.down("pagingtoolbar"),
                    status = grid.down("combo").getValue();

                var store = Ext.StoreManager.lookup("WarehouseReceiveStore");

                store.setProxy({
                    type: 'ajax',
                    url: apiBaseUrl+'/index.php/Warehouse/Index/getWarehouseReceiveList?logistics_no=' + logistics_no + '&batch_no=' + batch_no + '&status=' + status,
                    reader: {
                        start:0,
                        type: 'json',
                        rootProperty: 'data',
                        totalProperty: 'total'
                    }
                });
                pt.moveFirst();
            }
        }],
    bbar: ['->', {
        xtype: 'pagingtoolbar',
        store: 'WarehouseReceiveStore',
        emptyMsg: '<b>暂无记录</b>',
        displayMsg: '显示 {0} - {1} 总共 {2} 条记录',
        displayInfo: true
    }],
    columns: [
        {text: '物流单号', dataIndex: 'logistics_no', flex: 1},
        {text: '供货单号', dataIndex: 'batch_no', flex: 1},
        {text: '供应商', dataIndex: 'name', flex: 1},
        {
            text: '物流类型', dataIndex: 'logistics_type', renderer: function (val) {
            if (val == 1) return "国内陆运";
            if (val == 2) return "国内空运";

            return "未定义";
        }
        },
        {text: '联系人', dataIndex: 'contact', flex: 1},
        {text: '收货日期', dataIndex: 'date'},
        {text: '收货人', dataIndex: 'nickname'},
        {
            text: '状态', dataIndex: 'status', renderer: function (val) {
            if (1 == val) return "已收货";

            return "<b class='text-danger'>待收货</b>";
        }
        }
    ],
    listeners: {
        afterrender: function () {
            this.getStore().load();
        },
        rowdblclick: 'onWarehouseReceiveGridDblClick'
    }
});
