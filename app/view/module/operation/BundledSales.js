/**
 * Created by Administrator on 2015-07-06.
 */
Ext.define('erp.view.module.operation.BundledSales', {
    extend: 'Ext.grid.Panel',
    xtype: 'bundledsales',
    requires: [
        'Ext.Ajax',
        'Ext.button.Button',
        'Ext.container.Container',
        'Ext.data.Store',
        'Ext.form.field.Display',
        'Ext.form.field.Text',
        'Ext.grid.Panel',
        'Ext.grid.plugin.RowEditing',
        'Ext.layout.container.Column',
        'Ext.layout.container.HBox',
        'Ext.layout.container.VBox',
        'Ext.panel.Panel',
        'Ext.tab.Panel',
        'Ext.toolbar.Paging',
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
                {text: '新增', glyph: 0xf067, handler: 'addBundledSales'},
                {text: '删除', glyph: 0xf1f8, handler: 'delBundledSales'},
                {text: '修改', glyph: 0xf044, handler: 'editBundledSales'}, '->',
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
                    if (2 == val) return "已结束";
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
        var info = me.createInfoPanel(record);
        tab.setActiveTab(info);
    },
    createInfoPanel: function (record) {
        var me = this;
        var panel = {
            xtype: 'container',
            title: '捆绑促销详情',
            closable: true,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [
                {
                    xtype: 'panel',
                    layout: 'column',
                    margin: 10,
                    defaults: {
                        xtype: 'displayfield',
                        labelWidth: 135,
                        labelAlign: 'right',
                        columnWidth: 0.33
                    },
                    items: [
                        {fieldLabel: '活动编号', value: record.get("docment_no")},
                        {fieldLabel: '活动名称', value: record.get("activy_name")},
                        {fieldLabel: '活动店铺', value: record.get("shops_name")},
                        {fieldLabel: '起始日期', value: record.get("start_date")},
                        {fieldLabel: '截止日期', value: record.get("end_date")},
                        {fieldLabel: '捆绑数量', value: record.get("bingding_num")},
                        {
                            fieldLabel: '捆绑方式', value: record.get("bingding_style"), renderer: function (val) {
                            if (1 == val) return "任意捆绑";
                            if (2 == val) return "不同商品范围捆绑";
                            if (3 == val) return "同款商品捆绑";
                        }
                        },
                        {fieldLabel: '换购品数量', value: record.get("redemption_num")},
                        {
                            fieldLabel: '促销类型', value: record.get("promotion_type"), renderer: function (val) {
                            if (1 == val) return "折扣";
                            if (2 == val) return "优惠价";
                            if (3 == val) return "捆绑价";
                        }
                        },
                        {fieldLabel: '分级让利', value: record.get("genlis_s") == 0 ? '否' : '是'},
                        {fieldLabel: '分级促销', value: record.get("hierarchical") == 0 ? '否' : '是'},
                        {fieldLabel: '时段约束', value: record.get("restrain_time") == 0 ? '否' : '是'},
                        {fieldLabel: '起始时段', value: record.get("statr_time")},
                        {fieldLabel: '截止时段', value: record.get("end_time")},
                        {fieldLabel: '与整单促销方案叠加', value: record.get("whole_all") == 0 ? '否' : '是'},
                        //{fieldLabel: '调价品参与促销', value: record.get("tjpcy") == 0 ? '否' : '是'},
                        {fieldLabel: 'vip积分倍率继承', value: record.get("vipintegral") == 0 ? '否' : '是'},
                        {fieldLabel: '允许使用折扣券', value: record.get("allowed_coupon") == 0 ? '否' : '是'},
                        {fieldLabel: '允许按sku设置促销品', value: record.get("sku_setupt") == 0 ? '否' : '是'},
                        //{fieldLabel: '限额卡不参与促销', value: record.get("limitcard_no") == 0 ? '否' : '是'},
                        {fieldLabel: '允许退换货', value: record.get("allowed_alteration") == 0 ? '否' : '是'},
                        {fieldLabel: '结算方式限制', value: record.get("pocler_limit") == 0 ? '否' : '是'},
                        //{fieldLabel: '买高赠低', value: record.get("buy_height_with_low") == 0 ? '否' : '是'},
                        //{fieldLabel: '设置低价品折扣', value: record.get("set_low_price_discount")},
                        {fieldLabel: '促销日有效', value: record.get("promoday") == 0 ? '否' : '是'},
                        {
                            fieldLabel: '促销日', value: record.get("day_list"), renderer: function (val) {

                            var days = val.split(','), str = [];
                            for (var i = 0; i < days.length; i++) {
                                var day = days[i];
                                if (day == 1) str.push('星期一');
                                else if (day == 2) str.push('星期二');
                                else if (day == 3) str.push('星期三');
                                else if (day == 4) str.push('星期四');
                                else if (day == 5) str.push('星期五');
                                else if (day == 6) str.push('星期六');
                                else if (day == 7) str.push('星期日');
                            }

                            return str.join(',');
                        }
                        },
                        {
                            fieldLabel: '适用对象', value: record.get("suitable_user"), renderer: function (val) {
                            if (1 == val) return "普通";
                            if (2 == val) return "VIP";
                            if ('1,2' == val) return "普通,VIP";
                        }
                        },
                    ],
                    bbar: me.getBbar(record)
                },
                me.getInfoTab(record)
            ]
        };

        return panel;
    },
    getInfoTab: function (record) {
        var items = [], me = this;
        Ext.Ajax.request({
            async: false,
            method: 'POST',
            url: apiBaseUrl + '/index.php/Operations/Promotion/getBundledSalesInfo',
            params: {
                id:record.get("id")
            },
            success: function (res) {
                var json = Ext.decode(res.responseText);
                me.gridsData = json.data;
            },
            failure: function (res) {

            }
        });
        console.log(me.gridsData);
        me.vip_store = Ext.create('Ext.data.Store',{
            fields:[], data:me.gridsData.vip
        });
        me.exchange_store = Ext.create('Ext.data.Store',{
            fields:[], data:me.gridsData.exchange
        });
        var grid = Ext.create('Ext.grid.Panel', {
            itemId:'info_grid',
            flex:1,
            columns: [
                {text: '商品名称', dataIndex: 'system_suply_no'},
                {text: '优惠价', dataIndex: 'style_money'},
                {text: '状态', dataIndex: ''}
            ],
            store:me.exchange_store,
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'top',
                items: ['->',{
                    text: '导入换购商品',
                    handler:me.btnClick
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
            defaults:{
                layout:'fit'
            },
            items: items,
            listeners: {
                tabchange: function (tp, newTab, oldTab) {
                    var title = newTab.getTitle();
                    var item = grid.getDockedItems('toolbar[dock="top"]');
                    if ('分级让利' == title) {
                        var store = Ext.create('Ext.data.Store',{
                           fields:[], data:[]
                        });
                        item[0].down("button").setHidden(false);
                        item[0].down("button").setText("新增");
                        grid.addPlugin({
                            ptype: 'rowediting',
                            clicksToEdit: 1
                        });
                        grid.reconfigure(store, [
                            {text: '购买件数', dataIndex: 'num',editor:true},
                            {text: '让利金额', dataIndex: 'money'},
                            {text: '备注', dataIndex: 'mark'},
                            {text: '操作', dataIndex: ''}
                        ]);
                    } else if ("分级促销" == title) {
                        grid.reconfigure(null, [
                            {text: '购买件数', dataIndex: ''},
                            {text: '折扣', dataIndex: ''},
                            {text: '备注', dataIndex: ''},
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
                            {text: '基本金额积分比', dataIndex: 'basic_int',flex:1},
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
                    newTab.add(grid);
                }
            }
        }
    },
    getBbar: function (record) {
        var bar = ['->'];
        if (record.get("status") == 0) return bar.concat({text: '添加商品范围'}, {text: '审批'}, {text: '修改'});
        if (record.get("status") == 1) return bar.concat({text: '终止'});
        if (record.get("status") == 2) return null;
    },
    btnClick: function (btn) {
        var grid = btn.up("grid");
        console.log(grid.up("panel").getTitle());
        grid.getStore().insert(0,{num:3,money:100,mark:'1111'});
    }
});