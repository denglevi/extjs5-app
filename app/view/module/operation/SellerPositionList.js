/**
 * Created by Administrator on 2015-07-01.
 */
Ext.define('erp.view.module.operation.SellerPositionList', {
    extend: 'Ext.Container',
    xtype: 'sellerpositionlist',

    requires: [
        'Ext.grid.Panel',
        'Ext.layout.container.HBox',
        'Ext.toolbar.Fill',
        'Ext.toolbar.Paging',
        'erp.view.module.operation.OperationController',
        'erp.view.module.operation.OperationModel'
    ],

    viewModel: {
        type: 'operation'
    },
    controller: 'operation',
    initComponent: function () {
        var me = this;
        Ext.apply(me, {
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            defaults: {
                xtype: 'grid',
                flex: 1,
                border: true,
                sortableColumns: false,
                enableColumnHide: false,
                listeners: {
                    afterrender: function () {
                        this.getStore().load();
                    }
                },
                selModel: 'checkboxmodel'
            },
            items: [
                {
                    title: '职位列表',
                    reference: 'seller_position_grid',
                    tbar: [
                        {
                            text: '新增',
                            //glyph:0xf067,
                            iconCls: 'addIcon',
                            handler: 'addSellerPosition'
                        },
                        {
                            text: '删除',
                            //glyph:0xf1f8,
                            iconCls: 'delIcon',
                            handler: 'delSellerPosition'
                        },
                        {
                            text: '修改',
                            //glyph:0xf044,
                            iconCls: 'editIcon',
                            handler: 'editSellerPosition'
                        }
                    ],
                    columns: [
                        {text: '中文职位名', dataIndex: 'operations_post', flex: 1},
                        {text: '英文职位名', dataIndex: 'operations_post_en', flex: 1},
                        {text: '最低折扣', dataIndex: 'operations_low_discount'},
                        {text: '最高折扣', dataIndex: 'operations_tall_discount'},
                        {
                            text: '职位状态', dataIndex: 'operations_post_status', renderer: function (val) {
                            if (0 == val) return "启用";
                            return "禁用";
                        }
                        }
                    ],
                    store: 'SellerPositionListStore',
                    bbar: [
                        {text: '禁用', glyph: 0xf05e, itemId: 'disable', handler: 'editStatusPost'},
                        {text: '启用', glyph: 0xf05d, itemId: 'Enabled', handler: 'editStatusPost'}, '->', {
                            xtype: 'pagingtoolbar',
                            store: 'SellerPositionListStore'
                        }]
                },
                {
                    title: '店员列表',
                    itemId: 'seller_grid',
                    reference: 'seller_grid',
                    tbar: [
                        {
                            text: '新增',
                            //glyph:0xf067,
                            iconCls: 'addIcon',
                            handler: 'addSeller'
                        },
                        {
                            text: '删除',
                            //glyph:0xf1f8,
                            iconCls: 'delIcon',
                            handler: 'delSeller'
                        },
                        {
                            text: '修改',
                            //glyph:0xf044,
                            iconCls: 'editIcon',
                            handler: 'editSeller'
                        }
                    ],
                    columns: [
                        {text: '工号', dataIndex: 'job_no', flex: 1},
                        {text: '姓名', dataIndex: 'username', flex: 1},
                        {text: '职位', dataIndex: 'operations_post', flex: 1},
                        {text: '手机', dataIndex: 'phone', flex: 1},
                        {text: '性别', dataIndex: 'sex'},
                        {
                            text: '状态', dataIndex: 'status', renderer: function (val) {
                            if (0 == val) return "启用";
                            return "禁用";
                        }
                        }
                    ],
                    store: 'SellerListStore',
                    bbar: [
                        {text: '禁用', glyph: 0xf05e},
                        {text: '启用', glyph: 0xf05d}, '->', {
                            xtype: 'pagingtoolbar',
                            store: 'SellerListStore'
                        }]
                }
            ]
        });
        me.callParent();
    }
});