/**
 * Created by Administrator on 2015-06-18.
 */
Ext.define('erp.view.module.purchase.AddCheckProductOrder', {
    extend: 'Ext.container.Container',
    alias: 'widget.addcheckproductorder',
    requires: [
        'Ext.Ajax',
        'Ext.data.Store',
        'Ext.form.Panel',
        'Ext.form.action.Action',
        'Ext.form.field.ComboBox',
        'Ext.form.field.Date',
        'Ext.form.field.File',
        'Ext.form.field.Hidden',
        'Ext.form.field.Text',
        'Ext.grid.Panel',
        'Ext.layout.container.Anchor',
        'Ext.tab.Panel'
    ],

    initComponent: function () {
        var me = this, res;
        this.layout = 'hbox';
        //this.listeners = {
            //afterrender: function () {
                //getSupplierAndBuyer
                //Ext.Ajax.request({
                //    async: true,
                //    url: apiBaseUrl + '/index.php/Purchasing/Buyer/getSupplierAndBuyer',
                //    success: function (response) {
                //        var text = Ext.decode(response.responseText);
                //        res = text.data;
                //        var form = me.down("form");
                //        form.down("combo[name=buyer]").setStore(Ext.create('Ext.data.Store', {
                //            fields: ['id', 'username'],
                //            data:res.buyer
                //        }));
                //        form.down("combo[name=supplier]").setStore(Ext.create('Ext.data.Store', {
                //            fields: ['id_no', 'name'],
                //            data:res.supplier
                //        }));
                //    }
                //});
            //}
        //}
        this.items = [
            {
                xtype: 'form',
                width: 350,
                height: '100%',
                border: true,
                layout: 'anchor',
                bodyPadding: 5,
                method: 'POST',
                url: apiBaseUrl + '/index.php/Purchasing/CheckProduct/addCheckProductOrder',
                defaults: {
                    anchor: '100%',
                    xtype: 'textfield',
                    allowBlank: false,
                    margin: 10
                },
                items: [
                    {
                        fieldLabel:"采购订单号",
                        name:'order_no',
                        editable:false,
                        value:me.order_no
                    },
                    {
                        fieldLabel:"供应订单号",
                        name:'batch_no',
                        editable:false,
                        value:me.batch_no
                    },
                    {
                        fieldLabel: '制单日期',
                        name: 'date',
                        xtype: 'datefield',
                        editable: false,
                        format: 'Y-m-d',
                        value:new Date()
                    },
                    {
                        xtype:'hidden',
                        name:'supplier',
                        value:me.order_info.vendor_id
                    },
                    //{
                    //    fieldLabel: '供应商',
                    //    name: 'supplier',
                    //    xtype: 'combo',
                    //    editable: false,
                    //    displayField: 'name',
                    //    valueField: 'id_no'
                    //},
                    //{
                    //    fieldLabel: '买手',
                    //    name: 'buyer',
                    //    xtype: 'combo',
                    //    editable: false,
                    //    displayField: 'username',
                    //    valueField: 'id',
                    //},
                    {
                        xtype: 'filefield',
                        name: 'excel_file',
                        buttonText: '导入装箱单',
                        allowBlank: true,
                        listeners: {
                            change: function () {
                                var val = this.getValue();
                                this.up("form").getForm().submit({
                                    clientValidation: false,
                                    waitMsg:'正在导入装箱单信息...',
                                    url: apiBaseUrl + '/index.php/Purchasing/CheckProduct/importCheckProduct',
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
                                                {text:'国际款号',dataIndex:'no',flex:1},
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
                    },
                    {
                        fieldLabel: '验货备注',
                        name: 'mark',
                        xtype: 'textarea',
                        allowBlank:true
                    },
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
                                        me.destroy();
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
                        title: '导入装箱单信息',
                        flex: 1,
                        xtype: 'grid',
                        height: '100%',
                        sortableColumns: false,
                        columns: [
                            {text: '装箱单号', dataIndex: 'packing_no', flex: 1},
                            {text: '品牌', dataIndex: 'brand'},
                            {text: '国际款号', dataIndex: 'style_no',flex:1},
                            {text: '名称', dataIndex: 'product_name'},
                            {text: '国际颜色代码', dataIndex: 'color'},
                            {text: '尺码', dataIndex: 'size'},
                            {text: '性别', dataIndex: 'sex'},
                            {text: '产地', dataIndex: 'origin'},
                            {text: '材质', dataIndex: 'material'},
                            {text: '数量', dataIndex: 'num'},
                            {text: '箱号', dataIndex: 'box_no'}
                        ]
                    }
                ]
            }
        ]

        this.callParent(arguments);
    }
});