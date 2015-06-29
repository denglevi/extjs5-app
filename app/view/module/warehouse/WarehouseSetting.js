/**
 * Created by Administrator on 2015-06-29.
 */
Ext.define('erp.view.module.warehouse.WarehouseSetting', {
    extend: 'Ext.Container',
    xtype: 'warehousesetting',
    requires: [
        'Ext.grid.Panel',
        'Ext.layout.container.HBox',
        'erp.view.module.warehouse.WarehouseController'
    ],
    controller: 'warehouse',
    title: '仓库设置',
    initComponent: function () {
        Ext.apply(this, {
            layout: {
                type: 'hbox'
            },
            items: [{
                xtype: 'grid',
                title: '仓库列表',
                width: 300,
                border: true,
                height: '100%',
                selModel: 'checkboxmodel',
                store: 'WarehouseListStore',
                sortableColumns: false,
                enableColumnHide: false,
                tbar: [
                    {
                        text: '新增',
                        glyph: 0xf067,
                        handler: 'addPurchaseOrder'
                    },
                    {
                        text: '删除',
                        glyph: 0xf1f8
                    },
                    {
                        text: '编辑',
                        glyph: 0xf1f8
                    }
                ],
                columns: [
                    {text: '仓库代码', dataIndex: 'no'},
                    {text: '仓库', dataIndex: 'storage_name', flex: 1}
                ],
                listeners: {
                    afterrender: function () {
                        this.getStore().load();
                    },
                    rowdblclick: 'onWarehouseListGridDblClick'
                }
            }]
        });
        this.callParent();
    }
});

