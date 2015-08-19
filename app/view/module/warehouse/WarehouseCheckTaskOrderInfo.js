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
        'Ext.tab.Panel',

    ],
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
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
            items: [
                {
                    xtype: 'panel',
                    bodyPadding: 20,
                    layout: 'column',
                    flex:1,
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
        var me=this;
        var grid = Ext.create('Ext.grid.Panel',
            {
                //reference:'warehouse_check_task_order_info_grid',
                scrollable:true,
                height:"100%",
                columns: [
                    {text: '唯一码', flex: 1,dataIndex:'no'},
                    {text: '系统款号', flex: 1,dataIndex:'system_style_no'},
                    {text: '折扣',dataIndex:'discount'},
                    {text: '单价',dataIndex:'retail_price'},
                    {text: '颜色',dataIndex:'color'},
                    {text: '尺码',dataIndex:'size'},
                    {text: '差异',dataIndex:'sum'}
                ],
                store:
                    Ext.create('Ext.data.Store', {
                        extend:'Ext.data.Store',
                        fields: [],
                        autoLoad: true,
                        proxy: {
                            type: 'ajax',
                            url: apiBaseUrl + '/index.php/Warehouse/TaskList/getWarehouseCheckTaskLoss',
                            extraParams:{
                                id:me.record.get("id")
                            },
                            reader: {
                                type: 'json',
                                rootProperty: 'data',
                                totalProperty: 'total'
                            }
                        }
                    })
            });
        var tab = Ext.create('Ext.tab.Panel', {
            scrollable:true,
            flex:2,
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
                            {text: '盘点单号', flex: 1,dataIndex:'inventory_no'},
                            {text: '实盘数', flex: 1,dataIndex:'inventory_count'},
                            //{text: '重盘次数',dataIndex:'inventory_count'},
                            {text: '操作人',dataIndex:'inventory_user'},
                            {text: '确认',dataIndex:'status',
                                renderer: function (val) {
                                    if (1 == val) return "已确认";
                                    if (0 == val) return "未确认";

                                }
                            },
                            {text: '备注',dataIndex:'inventory_message'}
                        ];
                        store = Ext.create('Ext.data.Store', {
                            extend:'Ext.data.Store',
                            fields: [],
                            autoLoad: true,
                            proxy: {
                                type: 'ajax',
                                url: apiBaseUrl + '/index.php/Warehouse/TaskList/getWarehouseCheckNotice',
                                extraParams:{
                                    id:me.record.get("id")
                                },
                                reader: {
                                    type: 'json',
                                    rootProperty: 'data',
                                    totalProperty: 'total'
                                }
                            }
                        });
                    } else if (title == "盈亏明细") {
                        columns = [
                            {text: '唯一码', flex: 1,dataIndex:'no'},
                            {text: '系统款号', flex: 1,dataIndex:'system_style_no'},
                            {text: '折扣',dataIndex:'discount'},
                            {text: '单价',dataIndex:'retail_price'},
                            {text: '颜色',dataIndex:'color'},
                            {text: '尺码',dataIndex:'size'},
                            {text: '差异',dataIndex:'sum'}
                        ];
                        store = Ext.create('Ext.data.Store', {
                            extend:'Ext.data.Store',
                            fields: [],
                            autoLoad: true,
                            proxy: {
                                type: 'ajax',
                                url: apiBaseUrl + '/index.php/Warehouse/TaskList/getWarehouseCheckTaskLoss',
                                extraParams:{
                                    id:me.record.get("id")
                                },
                                reader: {
                                    type: 'json',
                                    rootProperty: 'data',
                                    totalProperty: 'total'
                                }
                            }
                        });


                    } else if (title == "差异明细") {
                        columns = [
                            {text: '唯一码', flex: 1,dataIndex:'no'},
                            {text: '系统款号', flex: 1,dataIndex:'system_style_no'},
                            {text: '折扣',dataIndex:'discount'},
                            {text: '单价',dataIndex:'retail_price'},
                            {text: '颜色',dataIndex:'color'},
                            {text: '尺码',dataIndex:'size'},
                            {text: '差异',dataIndex:'sum'}
                        ];
                        store = Ext.create('Ext.data.Store', {
                            extend:'Ext.data.Store',
                            fields: [],
                            autoLoad: true,
                            proxy: {
                                type: 'ajax',
                                url: apiBaseUrl + '/index.php/Warehouse/TaskList/getWarehouseTakeGoodLoss',
                                extraParams:{
                                    id:me.record.get("id")
                                },
                                reader: {
                                    type: 'json',
                                    rootProperty: 'data',
                                    totalProperty: 'total'
                                }
                            }
                        });

                    } else if (title == "商品范围") {
                        columns = [
                            {text: '盘点类别', flex: 1,dataIndex:'type',
                                renderer: function (val) {
                                    if (1 == val) return "全盘";
                                    if (2 == val) return "按品牌";
                                    if (3 == val) return "按分类";
                                }
                            },
                            {text: '品牌', flex: 1,dataIndex:'brand'},
                            {text: '大类',dataIndex:'large_class'},
                            {text: '小类',dataIndex:'small_class'},
                            {text: '性别',dataIndex:'sex'},
                            {text: '季节',dataIndex:'year_season'},
                        ];
                        store = Ext.create('Ext.data.Store', {
                            extend:'Ext.data.Store',
                            fields: [],
                            autoLoad: true,
                            proxy: {
                                type: 'ajax',
                                url: apiBaseUrl + '/index.php/Warehouse/TaskList/getWarehouseCheckGoodNotice',
                                extraParams:{
                                    id:me.record.get("id")
                                },
                                reader: {
                                    type: 'json',
                                    rootProperty: 'data',
                                    totalProperty: 'total'
                                }
                            }
                        });
                    } else if (title == "操作日志") {
                        columns = [
                            {text: '操作', flex: 1,dataIndex:'operation'},
                            {text: '操作人', flex: 1,dataIndex:'operation_user'},
                            {text: '操作时间', flex: 1,dataIndex:'operation_time'}
                        ];
                        store = Ext.create('Ext.data.Store', {
                            extend:'Ext.data.Store',
                            fields: [],
                            autoLoad: true,
                            proxy: {
                                type: 'ajax',
                                url: apiBaseUrl + '/index.php/Warehouse/TaskList/getWarehouseTakeLog',
                                extraParams:{
                                    id:me.record.get("id")
                                },
                                reader: {
                                    type: 'json',
                                    rootProperty: 'data',
                                    totalProperty: 'total'
                                }
                            }
                        });
                    }
                    if(title == "盘点单明细"){
                        grid.addListener("rowdblclick",function(grid,record){
                            var tab = me.up("tabpanel"),ref = 'warehousecheckorderinfo-'+record.get("id"),
                                item = tab.down('#'+ref);
                            if(item != null){
                                tab.setActiveTab(item);
                                return;
                            }
                            tab.setActiveTab({
                                itemId:ref,
                                xtype:'warehousecheckorderinfo',
                                record:record,
                                title:'盘点单详情',
                                closable:true
                            });
                        });
                    }else {
                        console.log(grid.hasListener("rowdblclick"));
                        if(grid.hasListener("rowdblclick"))grid.removeListener("rowdblclick",function(){});
                    }
                    grid.reconfigure(store, columns);
                    newCard.add(grid);

                }
            }
        });

        return tab;
    },
    getActionButtons:function(){
        var status = this.record.get("status"),me=this,
            btns = [
                {text: '执行',val:1,handler:me.editCheckStatus,scope:me},
                {text: '终止',val:2,handler:me.editCheckStatus,scope:me},
                {text: '导出差异数',handler:me.exportTaskGoods,scope:me}
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
    },
    editCheckStatus:function(btn){
        var status=btn.val;
        Ext.Ajax.request({
            async:true,
            url: apiBaseUrl +'/index.php/Warehouse/TaskList/editStats',
            method:'POST',
            params:{
                status:status,
                id:this.record.get("id"),
            },
            success:function(res){
                var json = Ext.decode(res.responseText);
                if (!json.success) {
                    Ext.toast(json.msg, "系统提示");
                    return
                }
                Ext.toast("修改成功", "系统提示");
                btn.setHidden(true);
            },
            failure: function (res) {
                Ext.toast("服务请求错误,请检查网络连接!", "系统提示");
            }
        });
    },
    exportTaskGoods:function(){
        var url = apiBaseUrl + '/index.php/Warehouse/TaskList/ExportLossGoods';
        var form = this.ExportTaskChbox(url);
        var win = Ext.create('Ext.window.Window', {
            modal: true,
            resizable: false,
            width: 600,
            layout: 'fit',
            title: "选择导出类别",
            items: [form]
        });
        form.on("delWinFrom", function () {
            win.destroy();
        });
        win.show();
    },
    ExportTaskChbox:function(url){
        var me = this, form = Ext.create('Ext.form.Panel', {
            layout: 'column',
            bodyPadding: 10,
            defaults: {
                xtype: 'checkbox',
                allowBlank: false,
                columnWidth: 0.5,
                labelWidth: 70,
                labelAlign: 'right',
                anchor: '100%',
                margin: 0,
                minValue: 0
            },
            items: [
                {fieldLabel: '勾选导出盈亏数不为0的数据', name: 'check_Is', labelWidth: 200,   columnWidth: 1,id:'checkbox'},

            ],
            buttons: [
                {
                    text: '提交',
                    formBind: true,
                    disabled: false,
                    handler: function (btn) {
                        var from=this.up('form').getForm();
                        var check=from.findField('check_Is').getValue()?1:0;
                        window.location.href = apiBaseUrl +'/index.php/Warehouse/TaskList/ExportLossGoods'+'?id='+me.record.get("id")+'&check='+check;
                        btn.up("form").fireEvent("delWinFrom");
                    }
                }
            ]
        });
        return form;
    },


});