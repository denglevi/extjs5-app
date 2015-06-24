/**
 * Created by denglevi on 15-6-14.
 */
Ext.define('erp.view.module.warehouse.WarehouseController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.warehouse',

    requires: [
        'Ext.Ajax',
        'Ext.XTemplate',
        'Ext.container.Container',
        'Ext.data.Store',
        'Ext.grid.Panel',
        'Ext.tab.Panel',
        'erp.view.module.warehouse.AddImportGoodsOrder',
        'erp.view.module.warehouse.AddWarehouseReceive'
    ],

    init: function () {

    },
    onWarehouseReceiveGridDblClick: function (gp, record) {
        var batch_no = record.get("batch_no");
        console.log(record);
        var title;
        if (1 == record.get("status")) {
            title = "查看收货信息";
        } else {
            title = "导入收货信息";
        }
        gp.up('tabpanel').setActiveTab({
            xtype: 'addwarehousereceive',
            title: title,
            closable: true,
            record: record
        });
    },
    onWarehouseImportListGridDblClick: function (gp, record) {
        var id = record.get("id"), res;
        Ext.Ajax.request({
            async: false,
            method: 'POST',
            url: apiBaseUrl + '/index.php/Warehouse/ImportGoods/getWarhouseImportInfo',
            params: {
                id: id
            },
            success: function (response) {
                //myMask.destroy( );
                res = Ext.decode(response.responseText);
            }
        });

        if (!res.success) return;
        //var container = Ext.create()
        var info = res.data.list;
        var order = res.data.order;
        var log = res.data.log;
        console.log(res.data);
        var warehouseimportgoods = gp.up("warehouseimportgoods");
        var panel = warehouseimportgoods.down("panel[name=info]");
        var model = warehouseimportgoods.getViewModel();
        model.set("import_info", info);
        var goods_info_data = Ext.create('Ext.data.Store',{
            fields:[],
            data:order
        });
        var goods_info_log = Ext.create('Ext.data.Store',{
            fields:[],
            data:log
        });
        model.set("goods_info_data", order);
        if (panel.items.items.length > 0) {
            panel.down("tabpanel").down("grid[name=goods_info_data]").setStore(goods_info_data);
            panel.down("tabpanel").down("grid[name=goods_info_log]").setStore(goods_info_log);
            return;
        }
        panel.add([{
            xtype: 'container',
            name: "info",
            width: '100%',
            bind: {
                data: '{import_info}'
            },
            margin: '30 30 40 30',
            tpl: new Ext.XTemplate(
                '<div class="col-md-12">',
                '<div class="col-md-4">单据标号：{notice_no}</div>',
                '<div class="col-md-4">日期：{date}</div>',
                '<div class="col-md-4">供应商：{name}</div>',
                '</div>',
                '<div class="col-md-12">',
                '<div class="col-md-4">渠道：{channel}</div>',
                '<div class="col-md-4">仓库：{storage_name}</div>',
                '<div class="col-md-4">品牌：{name_en}</div>',
                '</div>',
                '<div class="col-md-12">',
                '<div class="col-md-4">供应商单号：{order_no}</div>',
                '<div class="col-md-4">已入录数：{has}</div>',
                '<div class="col-md-4">商品总数：{sum}</div>',
                '</div>',
                '<div class="col-md-12">',
                '<div class="col-md-4">差异数：{variance}</div>',
                '<div class="col-md-4">摘要：{warehouse_location_id}</div>',
                '</div>'
            )
        },{
            xtype:'tabpanel',
            flex:1,
            width:'100%',
            items:[
                {
                    title:'入库信息',
                    xtype:'grid',
                    name:'goods_info',
                    sortableColumns:false,
                    scrollable:'y',
                    columns:[
                        {text:'唯一码',dataIndex:'orderinfo_style',flex:1},
                        {text:'供应商款号',dataIndex:'orderinfo_style',flex:1},
                        {text:'名称',dataIndex:'orderinfo_name'},
                        {text:'系统颜色代码',dataIndex:'orderinfo_color'},
                        {text:'颜色名称',dataIndex:'orderinfo_color'},
                        {text:'国际颜色代码',dataIndex:'orderinfo_color'},
                        {text:'尺码',dataIndex:'orderinfo_group'},
                        {text:'单价',dataIndex:'orderinfo_amount',flex:1}
                    ]
                },
                {
                    title:'商品信息',
                    xtype:'grid',
                    name:'goods_info_data',
                    sortableColumns:false,
                    scrollable:'y',
                    columns:[
                        {text:'供应商款号',dataIndex:'orderinfo_style',flex:1},
                        {text:'名称',dataIndex:'orderinfo_name'},
                        {text:'颜色',dataIndex:'orderinfo_color'},
                        {text:'尺码',dataIndex:'orderinfo_group'},
                        {text:'数量',dataIndex:'orderinfo_amount',flex:1}
                    ],
                    store:goods_info_data
                },
                {
                    title:'差异数',
                    xtype:'grid',
                    name:'goods_info_data',
                    sortableColumns:false,
                    scrollable:'y',
                    columns:[
                        {text:'供应商款号',dataIndex:'orderinfo_style',flex:1},
                        {text:'颜色',dataIndex:'orderinfo_color'},
                        {text:'尺码',dataIndex:'orderinfo_group'},
                        {text:'差异数',dataIndex:'orderinfo_amount',flex:1}
                    ]
                },
                {
                    title:'操作日志',
                    xtype:'grid',
                    name:'goods_info_log',
                    sortableColumns:false,
                    scrollable:'y',
                    columns:[
                        {text:'时间',dataIndex:'orderinfo_style',flex:1},
                        {text:'操作',dataIndex:'orderinfo_name'},
                        {text:'操作人',dataIndex:'orderinfo_color'}
                    ],
                    store:goods_info_log
                }
            ]
        }]);
    },
    addImportGoodsOrder:function(btn){
        btn.up("tabpanel").setActiveTab({
            xtype: 'addimportgoodsorder',
            title: "新增进货单",
            closable: true
        });
    }
});