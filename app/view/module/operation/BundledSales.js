/**
 * Created by Administrator on 2015-07-06.
 */
Ext.define('erp.view.module.operation.BundledSales', {
    extend: 'Ext.grid.Panel',
    xtype: 'bundledsales',
    requires: [
        'Ext.Ajax',
        'Ext.container.Container',
        'Ext.data.Store',
        'Ext.form.field.Text',
        'Ext.grid.Panel',
        'Ext.grid.plugin.RowEditing',
        'Ext.layout.container.HBox',
        'Ext.layout.container.VBox',
        'Ext.tab.Panel',
        'Ext.toolbar.Paging',
        'erp.view.module.operation.BundledSalesInfo',
        'erp.view.module.operation.OperationModel',
        'erp.view.module.operation.SalesActivityController'
    ],
    controller: 'salesactivity',
    viewModel: 'operation',
    initComponent: function () {
        var me = this;
        Ext.apply(me, {
            selModel: 'checkboxmodel',
            sortableColumns: false,
            enableColumnHide: false,
            tbar: [
                {
                    text: '新增',
                    handler: 'addBundledSales',
                    iconCls: 'addIcon'
                },
                {
                    text: '删除',
                    iconCls: 'delIcon',
                    handler: 'delBundledSales'
                },
                //{
                //    text: '修改',
                //    handler: 'editBundledSales',
                //    iconCls: 'editIcon',},
                '->',
                {xtype: 'textfield', fieldLabel: '开始日期', labelAlign: 'right'},
                {xtype: 'textfield', fieldLabel: '结束日期', labelAlign: 'right'},
                {text: '搜索'}
            ],
            columns: [
                {text: '活动编号', dataIndex: 'docment_no', flex: 1},
                {text: '活动店铺', dataIndex: 'shops_name', flex: 1},
                {text: '制单日期', dataIndex: 'crea_time', flex: 1},
                {text: '活动名称', dataIndex: 'activy_name', flex: 1},
                {text: '开始日期', dataIndex: 'start_date', flex: 1},
                {text: '结束日期', dataIndex: 'end_date', flex: 1},
                {
                    text: '状态', dataIndex: 'status', flex: 1, renderer: function (val) {
                    if (0 == val) return "未审核";
                    if (1 == val) return "已审核";
                    if (2 == val) return "已启动";
                    if (3 == val) return "已结束";
                }
                },
                {text: '操作', dataIndex: 'cleraing_condition', flex: 1}
            ],
            store: 'BundledSalesListStore',
            bbar: ['->', {
                xtype: 'pagingtoolbar',
                store: 'BundledSalesListStore'
            }],
            listeners: {
                afterrender: function () {
                    this.getStore().load();
                },
                rowdblclick: me.onGridDblClick
            }
        });
        this.callParent();
    },
    onGridDblClick: function (gp, record) {
        var me = this,
            tab = me.up("tabpanel");
        var info = {
            xtype: 'bundledsalesinfo',
            title: '捆绑促销详情',
            closable: true,
            record:record,
            layout: {
                type: 'vbox',
                align: 'stretch'
            }
        };
        tab.setActiveTab(info);
    },
    getBarContainer: function (record) {
        return {
            xtype: 'container',
            layout: 'hbox',
            defaultType: 'button',
            items: [
                {
                    itemId: 'promotion_item',
                    text: '促销商品',
                    scope: this,
                    handler: this.onShowPromotionClick
                },
                {
                    itemId: 'showEmployees',
                    margin: '0 0 0 10',
                    text: '分级让利',
                    scope: this,
                    handler: this.onShowEmployeesClick
                },
                {
                    itemId: 'showEmployees',
                    margin: '0 0 0 10',
                    text: '分级促销',
                    scope: this,
                    handler: this.onShowEmployeesClick
                },
                {
                    itemId: 'showEmployees',
                    margin: '0 0 0 10',
                    text: '结算方式',
                    scope: this,
                    handler: this.onSettlementClick
                },
                {
                    itemId: 'showVIP',
                    margin: '0 0 0 10',
                    text: 'VIP权益',
                    scope: this,
                    handler: this.onShowVIP
                }
            ]
        };
    },
    /*结算方式显示*/
    onSettlementClick:function(){
        var grid = this.down('grid'),me=this;
        Ext.suspendLayouts();
        grid.setTitle('VIP权益');
        var item = grid.getDockedItems('toolbar[dock="top"]');
        if ('分级让利' == title) {
            var store = Ext.create('Ext.data.Store', {
                fields: [], data: []
            });
            item[0].down("button").setHidden(false);
            item[0].down("button").setText("新增");
            grid.reconfigure(me.vip_store, [
                {text: '类别', dataIndex: 'vip_name'},
                {text: '常规折扣', dataIndex: 'vip_rule_dis'},
                {text: '促销折扣', dataIndex: 'rescu_dis'},
                {text: '基本金额积分比', dataIndex: 'basic_int', flex: 1},
                {text: '积分倍率', dataIndex: 'intv_rate'},
                {text: '操作', dataIndex: ''}
            ]);
            //this.down('#showOffices').enable();
            //this.down('#showEmployees').disable();
            Ext.resumeLayouts(true);
        }
    },
    onShowVIP: function () {
        var grid = this.down('grid'),me=this;
        Ext.suspendLayouts();
        grid.setTitle('VIP权益');
        var item = grid.getDockedItems('toolbar[dock="top"]');
        if ('分级让利' == title) {
            var store = Ext.create('Ext.data.Store', {
                fields: [], data: []
            });
            item[0].down("button").setHidden(false);
            item[0].down("button").setText("新增");
            grid.reconfigure(me.vip_store, [
                {text: '类别', dataIndex: 'vip_name'},
                {text: '常规折扣', dataIndex: 'vip_rule_dis'},
                {text: '促销折扣', dataIndex: 'rescu_dis'},
                {text: '基本金额积分比', dataIndex: 'basic_int', flex: 1},
                {text: '积分倍率', dataIndex: 'intv_rate'},
                {text: '操作', dataIndex: ''}
            ]);
            //this.down('#showOffices').enable();
            //this.down('#showEmployees').disable();
            Ext.resumeLayouts(true);
        }
    },
    getInfoContainer: function (record) {
        var items = [], me = this;
        Ext.Ajax.request({
            async: false,
            method: 'POST',
            url: apiBaseUrl + '/index.php/Operations/Promotion/getBundledSalesInfo',
            params: {
                id: record.get("id")
            },
            success: function (res) {
                var json = Ext.decode(res.responseText);
                me.gridsData = json.data;
            },
            failure: function (res) {

            }
        });
        console.log(me.gridsData);
        me.vip_store = Ext.create('Ext.data.Store', {
            fields: [], data: me.gridsData.vip
        });
        me.exchange_store = Ext.create('Ext.data.Store', {
            fields: [], data: me.gridsData.exchange
        });
        var grid = Ext.create('Ext.grid.Panel', {});
        return {
            margin: '10 0 0 0',
            xtype: 'grid',
            flex: 1,
            columns: [
                {text: '商品名称', dataIndex: 'system_suply_no'},
                {text: '优惠价', dataIndex: 'style_money'},
                {text: '状态', dataIndex: ''}
            ],
            itemId: 'info_grid',
            store: me.exchange_store,
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'top',
                items: ['->', {
                    text: '导入换购商品',
                    handler: me.btnOnClick,
                    scope:me
                }]
            }]
        };
    },
    getInfoTab: function (record) {
        var items = [], me = this;
        Ext.Ajax.request({
            async: false,
            method: 'POST',
            url: apiBaseUrl + '/index.php/Operations/Promotion/getBundledSalesInfo',
            params: {
                id: record.get("id")
            },
            success: function (res) {
                var json = Ext.decode(res.responseText);
                me.gridsData = json.data;
            },
            failure: function (res) {

            }
        });
        console.log(me.gridsData);
        me.vip_store = Ext.create('Ext.data.Store', {
            fields: [], data: me.gridsData.vip
        });
        me.exchange_store = Ext.create('Ext.data.Store', {
            fields: [], data: me.gridsData.exchange
        });
        var grid = Ext.create('Ext.grid.Panel', {
            itemId: 'info_grid',
            flex: 1,
            columns: [
                {text: '商品名称', dataIndex: 'system_suply_no'},
                {text: '优惠价', dataIndex: 'style_money'},
                {text: '状态', dataIndex: ''}
            ],
            store: me.exchange_store,
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'top',
                items: ['->', {
                    text: '导入换购商品',
                    handler: me.btnClick
                }]
            }]
        });
        var tbar = ['->',
            {text: '新增', handler: me.addRow}
        ];


        items = [{
            title: '换购商品',
            items: [grid]
        }];

        if (record.get("genlis_s") == 1) {
            items.push({
                title: '分级让利',
            });
        }
        if (record.get("hierarchical") == 1) {
            items.push({
                title: '分级促销'
            });
        }
        if (record.get("pocler_limit") == 1) {
            items.push({
                title: '结算方式'
            });
        }
        if (record.get("suitable_user").indexOf('2') != -1) {
            var title = 'VIP权益';
            items.push({
                title: title
            });
        }

        return {
            xtype: 'tabpanel',
            flex: 1,
            defaults: {
                layout: 'fit'
            },
            items: items,
            listeners: {
                tabchange: function (tp, newTab, oldTab) {
                    var title = newTab.getTitle();
                    var item = grid.getDockedItems('toolbar[dock="top"]');
                    if ('分级让利' == title) {
                        var store = Ext.create('Ext.data.Store', {
                            fields: [], data: []
                        });
                        item[0].down("button").setHidden(false);
                        item[0].down("button").setText("新增");
                        grid.addPlugin({
                            ptype: 'rowediting',
                            clicksToEdit: 1
                        });
                        grid.reconfigure(store, [
                            {text: '购买件数', dataIndex: 'num', editor: true},
                            {text: '让利金额', dataIndex: 'money'},
                            {text: '备注', dataIndex: 'mark'},
                            {text: '操作', dataIndex: ''}
                        ]);
                    } else if ("分级促销" == title) {
                        grid.reconfigure(null, [
                            {text: '购买件数', dataIndex: 'buy_num'},
                            {text: '折扣', dataIndex: 'num_money'},
                            {text: '备注', dataIndex: 'restu_text'},
                            {text: '操作', dataIndex: ''}
                        ]);
                        item[0].down("button").setHidden(false);
                        item[0].down("button").setText("新增");
                        grid.addPlugin({
                            ptype: 'rowediting',
                            clicksToEdit: 1
                        });
                    } else if ("换购商品" == title) {
                        item[0].down("button").setHidden(false);
                        item[0].down("button").setText("导入换购商品");
                        grid.reconfigure(me.exchange_store, [
                            {text: '商品名称', dataIndex: 'system_suply_no'},
                            {text: '优惠价', dataIndex: 'style_money'},
                            {text: '状态', dataIndex: ''}
                        ]);
                    } else if ("VIP权益" == title) {
                        item[0].down("button").setHidden(false);
                        item[0].down("button").setText("新增");
                        grid.reconfigure(me.vip_store, [
                            {text: '类别', dataIndex: 'vip_name'},
                            {text: '常规折扣', dataIndex: 'vip_rule_dis'},
                            {text: '促销折扣', dataIndex: 'rescu_dis'},
                            {text: '基本金额积分比', dataIndex: 'basic_int', flex: 1},
                            {text: '积分倍率', dataIndex: 'intv_rate'},
                            {text: '操作', dataIndex: ''}
                        ]);
                    } else if ("结算方式" == title) {
                        grid.reconfigure(null, [
                            {text: '结算名称', dataIndex: ''},
                            {text: '备注', dataIndex: ''},
                            {text: '操作', dataIndex: ''}
                        ]);
                        item[0].down("button").setHidden(true);
                    }
                    newTab.removeAll();
                    newTab.add(grid);
                }
            }
        }
    }
});