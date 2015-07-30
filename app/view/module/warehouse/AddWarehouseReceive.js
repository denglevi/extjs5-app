Ext.define('erp.view.module.warehouse.AddWarehouseReceive', {
    extend: 'Ext.container.Container',
    alias: 'widget.addwarehousereceive',
    requires: [
        'Ext.Array',
        'Ext.data.Store',
        'Ext.data.StoreManager',
        'Ext.data.proxy.Ajax',
        'Ext.data.reader.Json',
        'Ext.form.Panel',
        'Ext.form.action.Action',
        'Ext.form.field.Date',
        'Ext.form.field.Number',
        'Ext.form.field.Text',
        'Ext.grid.Panel',
        'Ext.grid.plugin.RowEditing',
        'Ext.layout.container.Anchor',
        'Ext.tab.Panel'
    ],
    initComponent: function () {
        var me = this;
        this.layout = 'hbox';
        this.items = [
            {
                xtype: 'form',
                width: 350,
                height: '100%',
                border: true,
                layout: 'anchor',
                bodyPadding: 5,
                method: 'POST',
                url: apiBaseUrl + '/index.php/Warehouse/Index/addWarehouseReceive',
                defaults: {
                    anchor: '100%',
                    xtype: 'textfield',
                    allowBlank: false,
                    margin: 10,
                    editable: false
                },
                items: this.getFormItems(),
                buttons:this.getBtns()
            },
            {
                xtype: 'tabpanel',
                flex: 1,
                height: '100%',
                items: [
                    {
                        title: '收货信息',
                        flex: 1,
                        xtype: 'grid',
                        height: '100%',
                        sortableColumns: false,
                        columns: [
                            {text: '装箱单号', dataIndex: 'packing_no', flex: 1},
                            {text: '箱号', dataIndex: 'box_no', flex: 1},
                            {text: '发货数', dataIndex: 'send_num', flex: 1},
                            {text: '收货数', dataIndex: 'num', flex: 1, editor: {xtype: 'numberfield', minValue: 0}},
                            {
                                text: '差异数', dataIndex: 'diff_num', flex: 1,
                                renderer: function (val) {
                                    if (val < 0) return '<b class="text-danger">' + val + '</b>';
                                    if (val > 0) return '<b class="text-info">' + val + '</b>';
                                    return val;
                                }
                            }
                        ],
                        store: Ext.create('Ext.data.Store', {
                            fields: ['packing_no', 'box_no', 'num'],
                            autoLoad: true,
                            proxy: {
                                type: 'ajax',
                                extraParams: {
                                    batch_no: me.record.get("batch_no"),
                                    order_no: me.record.get("order_no"),
                                    status:me.record.get("status"),
                                    id:me.record.get("id")
                                },
                                url: apiBaseUrl + '/index.php/Warehouse/Index/getReceiveProduct',
                                reader: {
                                    type: 'json',
                                    rootProperty: 'data',
                                    totalProperty: 'total'
                                }
                            }
                        }),
                        plugins: this.getGridPlugins(),
                        listeners: {
                            edit: function (gp, e) {
                                var record = e.record,
                                    num = record.get("num");
                                if(num == "" || num == null){
                                    num = 0;
                                }
                                record.set("diff_num", parseInt(num) + parseInt(record.get("diff_num")));
                            }
                        }
                    }
                ]
            }
        ]
        this.callParent(arguments);
    },
    getBtns:function(){
        var me = this;
        console.log(this.record);
        if(this.record.get("status") == 1) return null;
        return [
            {
                text: '重置',
                handler: function () {
                    this.up('form').getForm().reset();
                }
            },
            {
                text: '提交收货单',
                formBind: true,
                disabled: true,
                handler: function () {
                    var grid = me.down("grid");
                    var items = grid.getStore().data.items;
                    console.log(data);
                    var data = [];
                    Ext.Array.each(items, function (item) {
                        data.push({
                            packing_no:item.get("packing_no"),
                            box_no:item.get("box_no"),
                            num:item.get("num"),
                            send_num:item.get("send_num"),
                            diff_num:item.get("diff_num")
                        });
                    });

                    var form = this.up('form').getForm();
                    if (form.isValid()) {
                        form.submit({
                            waitMsg: '正在提交...',
                            params: {
                                id: me.record.get("id"),
                                data: Ext.encode(data)
                            },
                            success: function (form, action) {
                                //me.down("grid").getStore().load();
                                me.destroy();
                                var store = Ext.StoreManager.lookup("WarehouseReceiveStore");
                                if(store != null) store.load();
                                //Ext.Msg.alert('系统提示', '新增订单成功');
                            },
                            failure: function (form, action) {
                                console.log(action);
                                switch (action.failureType) {
                                    case Ext.form.action.Action.CLIENT_INVALID:
                                        Ext.Msg.alert('系统提示', '表单验证错误');
                                        break;
                                    case Ext.form.action.Action.CONNECT_FAILURE:
                                        Ext.Msg.alert('系统提示', '远程连接错误，请稍后重试');
                                        break;
                                    case Ext.form.action.Action.SERVER_INVALID:
                                        Ext.Msg.alert('系统提示', action.result.msg || "服务端错误");
                                }
                            }
                        });
                    }
                }
            }
        ]
    },
    getFormItems:function(){
        var date;
        if(this.record.get("status")==0){
            date = {
                fieldLabel: '收货日期',
                name: 'date',
                xtype: 'datefield',
                format: 'Y-m-d',
                editable: true,
                value: new Date()
            };
        }else{
            //var val =
            date = {
                fieldLabel: '收货日期',
                name: 'date',
                value: this.record.get("create_time")
            };
        }

        return [
            date
            ,
            {
                fieldLabel: "采购订单号",
                name: 'order_no',
                value: this.record.get("order_no")
            },
            {
                fieldLabel: "供应订单号",
                name: 'batch_no',
                value: this.record.get("batch_no")
            },
            {
                fieldLabel: "物流单号",
                name: 'logistics_no',
                value: this.record.get("logistics_no")
            },
            {
                fieldLabel: '供应商',
                name: 'supplier',
                value: this.record.get("name")
            }
        ];
    },
    getGridPlugins:function(){
        if(1 == this.record.get("status")) return null;

        return {
            ptype: 'rowediting',
                clicksToEdit: 1
        }
    }
});

