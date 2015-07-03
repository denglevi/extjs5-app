/**
 * Created by Administrator on 2015-07-02.
 */
Ext.define('erp.view.module.warehouse.WarehouseCheckTaskOrderInfo', {
    extend: 'Ext.Container',
    xtype: 'warehousechecktaskorderinfo',

    requires: [
        'Ext.Ajax',
        'Ext.form.field.Display',
        'Ext.grid.Panel',
        'Ext.layout.container.Column',
        'Ext.layout.container.VBox',
        'Ext.panel.Panel',
        'Ext.tab.Panel'
    ],

    initComponent: function () {
        var me = this;
        //Ext.Ajax.request({
        //    async: false,
        //    url: apiBaseUrl + '/index.php/Warehouse/TaskList/getWarehouseCheckTaskOrderInfo',
        //    method: 'POST',
        //    params: {
        //        id:me.record.get("id");
        //    },
        //    success: function () {
        //
        //    },
        //    failure: function () {
        //
        //    }
        //});
        Ext.apply(me, {
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [
                {
                    xtype: 'panel',
                    bodyPadding: 20,
                    layout: 'column',
                    defaults: {
                        xtype: 'displayfield',
                        columnWidth: 0.2,
                        labelAlign: 'right',
                        labelWidth: 70
                    },
                    items: [
                        {fieldLabel: '任务单号',value:me.record.get("receipts_no")},
                        {fieldLabel: '盘点日期',value:me.record.get("date")},
                        {fieldLabel: '盘点类型',value:me.getCheckType()},
                        {fieldLabel: '扫描数',value:me.record.get("sum_length1")},
                        {fieldLabel: '库存数',value:me.record.get("sum_length")},
                        {fieldLabel: '扫描金额',value:me.record.get("sum1")},
                        {fieldLabel: '库存金额',value:me.record.get("sum")},
                        {fieldLabel: '盈亏金额',value:me.record.get("pal")},
                        {fieldLabel: '盈亏数',value:me.record.get("pal_num")},
                        {fieldLabel: '备注', columnWidth: 1,value:me.record.get("remark")},
                    ],
                    buttons: me.getActionButtons()
                },
                me.getTabItems()
            ]
        });
        this.callParent();
    },
    getTabItems: function () {
        var grid = Ext.create('Ext.grid.Panel', {
            //reference:'warehouse_check_task_order_info_grid',
            columns: [
                {text: '唯一码', flex: 1},
                {text: '系统款号', flex: 1},
                {text: '折扣'},
                {text: '单价'},
                {text: '颜色'},
                {text: '尺码'}
            ]
        }),me=this;
        var tab = Ext.create('Ext.tab.Panel', {
            flex: 1,
            items: [
                {
                    title: '盈亏明细',
                    items: [grid]
                },
                {
                    title: '盘点单明细'
                },
                {
                    title: '差异明细'
                },
                {
                    title: '商品范围',
                    hidden:me.record.get("task_type")!=3
                },
                {
                    title: '操作日志'
                }
            ],
            listeners: {
                tabchange: function (tabPanel, newCard, oldCard, eOpts) {
                    var title = newCard.getTitle(),
                        columns = null,
                        store = null;
                    if (title == "盘点单明细") {
                        columns = [
                            {text: '盘点单号', flex: 1},
                            {text: '实盘数', flex: 1},
                            {text: '重盘次数'},
                            {text: '操作人'},
                            {text: '确认'},
                            {text: '备注'}
                        ];
                    } else if (title == "盈亏明细") {
                        columns = [
                            {text: '唯一码', flex: 1},
                            {text: '系统款号', flex: 1},
                            {text: '折扣'},
                            {text: '单价'},
                            {text: '颜色'},
                            {text: '尺码'}
                        ];

                    } else if (title == "差异明细") {
                        columns = [
                            {text: '唯一码', flex: 1},
                            {text: '系统款号', flex: 1},
                            {text: '折扣'},
                            {text: '单价'},
                            {text: '颜色'},
                            {text: '尺码'}
                        ];
                    } else if (title == "商品范围") {
                        console.log(Ext.decode());

                        newCard.setHtml(me.record.get("check_params"));
                        return;
                    } else if (title == "操作日志") {
                        columns = [
                            {text: '操作', flex: 1},
                            {text: '操作人', flex: 1},
                            {text: '操作时间', flex: 1}
                        ];
                    }
                    grid.reconfigure(store, columns);
                    newCard.add(grid);

                }
            }
        });

        return tab;
    },
    getActionButtons:function(){
        var status = this.record.get("status"),
            btns = [
                {text: '执行'},
                {text: '确认'},
                {text: '盈亏'},
                {text: '终止'}
            ];
        console.log(status);
        if(status == 1) btns.shift();
        else if(status == 2) btns.splice(0,2);
        else if(status == 3) btns.splice(0,3);
        else if(status == 4) return [];

        return btns;
    },
    getCheckType:function(){
        var type = this.record.get("task_type");
        if(type == 1) return "全盘";
        if(type == 2) return "品牌";

        return "分类";
    }

});