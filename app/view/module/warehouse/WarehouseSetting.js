/**
 * Created by Administrator on 2015-06-29.
 */
Ext.define('erp.view.module.warehouse.WarehouseSetting', {
    extend: 'Ext.Container',
    xtype: 'warehousesetting',
    requires: [
        'Ext.data.Store',
        'Ext.data.proxy.Ajax',
        'Ext.data.reader.Json',
        'Ext.grid.Panel',
        'Ext.layout.container.HBox',
        'erp.view.module.warehouse.WarehouseSettingController'
    ],
    controller: 'warehousesetting',
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
                itemId:'warehouse_list',
                border: true,
                height: '100%',
                selModel: 'checkboxmodel',
                store: 'WarehouseListStore',
                sortableColumns: false,
                enableColumnHide: false,
                tbar: [
                    {
                        text: '新增',
                        //glyph: 0xf067,
                        iconCls:'addIcon',
                        handler: 'addWarehouse'
                    },
                    {
                        text: '删除',
                        //glyph: 0xf1f8
                        iconCls:'delIcon',
                        handler:'delWarehouse'
                    },
                    {
                        text: '编辑',
                        iconCls:'editIcon',
                        handler:'editWarehouse'
                        //glyph: 0xf1f8
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
            },{
                xtype: 'grid',
                title: '库位列表',
                flex:1,
                itemId:'location_list',
                height: '100%',
                selModel: 'checkboxmodel',
                sortableColumns: false,
                store:Ext.create("Ext.data.Store",{
                   fields:[],
                    autoLoad:false,
                    proxy:{
                        type:'ajax',
                        url: apiBaseUrl+'/index.php/Warehouse/Index/getWarehouseLocationList',
                        reader:{
                            type:'json',
                            rootProperty:'data'
                        }
                    }
                }),
                enableColumnHide: false,
                tbar: [
                    {
                        text: '新增',
                        //glyph: 0xf067,
                        iconCls:'addIcon',
                        handler: 'addLocation'
                    },
                    {
                        text: '删除',
                        //glyph: 0xf1f8
                        iconCls:'delIcon',
                        handler:'delLocation'
                    },
                    {
                        text: '编辑',
                        iconCls:'editIcon',
                        handler:'editLocation'
                        //glyph: 0xf1f8
                    }
                ],
                columns: [
                    {text: '库位名称', dataIndex: 'library_name', flex: 1},
                    {text: '库位代码', dataIndex: 'no', flex: 1},
                    {text: '所在仓库', dataIndex: 'warehouse_name', flex: 1}
                ],
                listeners: {
                    afterrender: function () {
                        this.getStore().load();
                    }
                }
            }]
        });
        this.callParent();
    }
});

