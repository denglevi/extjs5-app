/**
 * Created by Administrator on 2015-07-17.
 */
Ext.define('erp.view.module.goods.GoodsDeliveryOrder', {
    extend: 'Ext.Container',

    xtype: 'goodsdeliveryorder',

    requires: [
        'Ext.container.Container',
        'Ext.grid.Panel',
        'Ext.layout.container.HBox',
        'Ext.layout.container.VBox',
        'Ext.panel.Panel',
        'erp.view.module.goods.GoodsController',
        'erp.view.module.goods.GoodsModel'
    ],

    controller: 'goods',
    layout: {
        type: 'hbox',
        align: 'stretch'
    },
    viewModel: {
        type: 'goods'
    },
    initComponent: function () {

        var me = this;
        var import_list = this.getNoticeOrderListGrid();
        this.items = [
            import_list, {
                xtype: 'panel',
                title: '配货通知单详情',
                flex: 1,
                layout:'vbox',
                height:'100%',
                itemId: 'info_panel'
            }
        ];;
        import_list.on("rowdblclick","onGoodsDeliveryNoticeGridDblClick");
        this.listeners = {
            afterrender: function () {
                me.down("grid").getStore().load();
            }
        }
        me.callParent();
    },
    getNoticeOrderListGrid: function () {
        var grid = Ext.create('Ext.grid.Panel', {
            title: '配货通知单列表',
            width: 200,
            border:true,
            sortableColumns: false,
            enableColumnHide: false,
            tbar: [
                {text: '新增', iconCls: 'addIcon', handler: "addGoodsDeliveryNotice"},
                {text: '删除', iconCls: 'delIcon',handler:"delGoodsDeliveryNotice"}
            ],
            selModel: 'checkboxmodel',
            columns: [
                {
                    text: '通知单号',
                    dataIndex: 'notice_no',
                    flex: 1
                },
                {
                    text: '状态',
                    dataIndex: 'status',
                    flex: 1, renderer: function (val) {
                    if(0 == val) return '<b>未审批</b>';
                    if(1 == val) return '<b class="text-info">已审批</b>';
                    if(2 == val) return '<b class="text-danger">已发出</b>';
                    if(3 == val) return '<b class="text-danger">已终止</b>';
                }
                }
            ],
            store: 'GoodsDeliveryNoticeStore'
        });

        return grid;
    }
});