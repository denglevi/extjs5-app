Ext.define('erp.view.module.warehouse.AddWarehouseReceive', {
    extend: 'Ext.container.Container',
    alias: 'widget.addwarehousereceive',
    requires: [
        'Ext.data.Store',
        'Ext.form.Panel',
        'Ext.form.action.Action',
        'Ext.form.field.ComboBox',
        'Ext.form.field.Date',
        'Ext.form.field.File',
        'Ext.form.field.Text',
        'Ext.grid.Panel',
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
                    margin: 10
                },
                items: [
                    {
                        fieldLabel: '收货日期',
                        name: 'date',
                        xtype: 'datefield',
                        format: 'Y-m-d',
                        value:new Date()
                    },
                    {
                        fieldLabel:"采购订单号",
                        name:'order_no',
                        editable:false,
                        value:this.record.get("order_no")
                    },
                    {
                        fieldLabel:"供应订单号",
                        name:'batch_no',
                        editable:false,
                        value:this.record.get("batch_no")
                    },
                    {
                        fieldLabel:"物流单号",
                        name:'logistics_no',
                        editable:false,
                        value:this.record.get("logistics_no")
                    },
                    {
                        fieldLabel: '供应商',
                        name: 'supplier',
                        editable: false,
                        value:this.record.get("name")
                    },
                    {
                        xtype: 'filefield',
                        name: 'excel_file',
                        buttonText: '导入收货单',
                        allowBlank: true,
                        listeners: {
                            change: function () {
                                var val = this.getValue();
                                this.up("form").getForm().submit({
                                    clientValidation: false,
                                    waitMsg:'正在导入收货单信息...',
                                    url: apiBaseUrl + '/index.php/Warehouse/Index/importReceiveProduct',
                                    success: function (form, action) {
                                        var data = action.result.data;
                                        console.log(data);
                                        me.products = data.products;
                                        me.difference = data.difference;
                                        var store = Ext.create('Ext.data.Store', {
                                            fields: [],
                                            data: data.products
                                        });
                                        me.down("tabpanel").down("grid").setStore(store);
                                        var grid = {
                                            xtype:'grid',
                                            title:'货品差异',
                                            flex: 1,
                                            height: '100%',
                                            sortableColumns: false,
                                            columns:[
                                                {text:'款号',dataIndex:'no',flex:1},
                                                {text:'差异数',dataIndex:'num',flex:1}
                                            ],
                                            store:Ext.create('Ext.data.Store', {
                                                fields: [],
                                                data: data.difference
                                            })
                                        }
                                        me.down("tabpanel").setActiveTab(grid);
                                    },
                                    failure: function (form, action) {
                                        switch (action.failureType) {
                                            case Ext.form.action.Action.CLIENT_INVALID:
                                                Ext.Msg.alert('系统提示', '表单验证错误');
                                                break;
                                            case Ext.form.action.Action.CONNECT_FAILURE:
                                                Ext.Msg.alert('系统提示', '远程连接错误，请稍后重试');
                                                break;
                                            case Ext.form.action.Action.SERVER_INVALID:
                                                Ext.Msg.alert('系统提示', action.result.msg);
                                        }
                                    }
                                });
                            }
                        }
                    }
                ],
                buttons: [
                    {
                        text: '重置',
                        handler: function () {
                            this.up('form').getForm().reset();
                        }
                    },
                    {
                        text: '保存',
                        formBind: true,
                        disabled: true,
                        handler: function () {
                            var grid = me.down("grid");
                            console.log(me.products);
                            if (grid.getStore() == null || grid.getStore().getData().length == 0) {
                                Ext.Msg.alert('系统提示', "请导入商品资料");
                                return;
                            }
                            console.log(grid.getStore());
                            var data = grid.getStore().data;
                            console.log(data);
                            var form = this.up('form').getForm();
                            if (form.isValid()) {
                                form.submit({
                                    waitMsg:'正在新增...',
                                    //headers: {'Content-Type': 'application/json'},
                                    params:{
                                        products:Ext.encode(me.products),
                                        difference:Ext.encode(me.difference)
                                    },
                                    success: function (form, action) {
                                        //me.down("grid").getStore().load();
                                        console.log(action.result);
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
                                                Ext.Msg.alert('系统提示', action.result.msg||"服务端错误");
                                        }
                                    }
                                });
                            }
                        }
                    }
                ]
            },
            {
                xtype:'tabpanel',
                flex:1,
                height:'100%',
                items:[
                    {
                        title: '导入收货单信息',
                        flex: 1,
                        xtype: 'grid',
                        height: '100%',
                        sortableColumns: false,
                        columns: [
                            {text: '装箱单号', dataIndex: 'packing_no', flex: 1},
                            {text: '国际款号', dataIndex: 'style_no',flex:1},
                            {text: '名称', dataIndex: 'product_name'},
                            {text: '性别', dataIndex: 'sex'},
                            {text: '产地', dataIndex: 'origin'},
                            {text: '材质', dataIndex: 'material'},
                            {text: '数量', dataIndex: 'num'},
                            {text: '品牌', dataIndex: 'brand'},
                            {text: '箱号', dataIndex: 'box_no'}
                        ]
                    }
                ]
            }
        ]
        this.callParent(arguments);
    }
});
