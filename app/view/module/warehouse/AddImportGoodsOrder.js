/**
 * Created by Administrator on 2015-06-24.
 */
Ext.define('erp.view.module.warehouse.AddImportGoodsOrder', {
    extend: 'Ext.container.Container',
    alias: 'widget.addimportgoodsorder',
    requires: [
        'Ext.Ajax',
        'Ext.data.Store',
        'Ext.form.Panel',
        'Ext.form.RadioGroup',
        'Ext.form.action.Action',
        'Ext.form.field.ComboBox',
        'Ext.form.field.Date',
        'Ext.form.field.File',
        'Ext.form.field.Text',
        'Ext.form.field.TextArea',
        'Ext.grid.Panel',
        'Ext.layout.container.Anchor',
        'Ext.tab.Panel'
    ],
    initComponent: function () {
        var me = this, res;
        this.layout = 'hbox';
        this.listeners = {
            afterrender: function () {
                //getSupplierAndBuyer
                Ext.Ajax.request({
                    async: true,
                    url: apiBaseUrl + '/index.php/Purchasing/Buyer/getBrandSupplierWarehouse',
                    success: function (response) {
                        //myMask.destroy( );
                        var text = Ext.decode(response.responseText);
                        res = text.data;
                        var form = me.down("form");
                        form.down("combo[name=brand]").setStore(Ext.create('Ext.data.Store', {
                            fields: ['id', 'name_en'],
                            data: res.brand
                        }));
                        form.down("combo[name=warehouse]").setStore(Ext.create('Ext.data.Store', {
                            fields: ['id', 'storage_name'],
                            data: res.warehouse
                        }));
                        form.down("combo[name=supplier]").setStore(Ext.create('Ext.data.Store', {
                            fields: ['id', 'name'],
                            data: res.supplier
                        }));
                    }
                });
            }
        }
        this.items = [
            {
                xtype: 'form',
                width: 350,
                height: '100%',
                border: true,
                layout: 'anchor',
                bodyPadding: 5,
                method: 'POST',
                url: apiBaseUrl + '/index.php/Purchasing/Buyer/addPurchaseOrder',
                defaults: {
                    anchor: '100%',
                    xtype: 'textfield',
                    allowBlank: false,
                    margin: 10
                },
                items: [
                    {
                        fieldLabel: '制单日期',
                        name: 'date',
                        xtype: 'datefield',
                        editable: false,
                        format: 'Y-m-d',
                        value: new Date()
                    },
                    {
                        fieldLabel:'供应商单号',
                        name:'batch_no'
                    },
                    {
                        fieldLabel:'渠道',
                        name:'channel'
                    },
                    {
                        fieldLabel: '供应商',
                        name: 'supplier',
                        xtype: 'combo',
                        editable: false,
                        displayField: 'name',
                        valueField: 'id_no'
                    },
                    {
                        fieldLabel: '品牌',
                        name: 'brand',
                        xtype: 'combo',
                        editable: false,
                        displayField: 'name_en',
                        valueField: 'id',
                    },
                    {
                        fieldLabel: '仓库',
                        name: 'warehouse',
                        xtype: 'combo',
                        editable: false,
                        displayField: 'storage_name',
                        valueField: 'id',
                    },
                    {
                        fieldLabel:'摘要',
                        xtype:'textarea',
                        name:'note'
                    },
                    {
                        fieldLabel:'唯一码',
                        name:'no'
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
                                    waitMsg: '正在新增...',
                                    //headers: {'Content-Type': 'application/json'},
                                    params: {
                                        products: Ext.encode(me.products)
                                    },
                                    success: function (form, action) {
                                        //me.down("grid").getStore().load();
                                        console.log(action.result);
                                        //Ext.Msg.alert('系统提示', '新增订单成功');
                                    },
                                    failure: function (form, action) {
                                        console.log(action);
                                        Ext.Msg.alert('失败', action.result.msg);
                                    }
                                });
                            }
                        }
                    }
                ]
            },
            {
                xtype:'tabpanel',
                height:'100%',
                flex:1,
                defaulst:{
                    xtype: 'grid',
                    height: '100%',
                    sortableColumns: false,
                    scrollable:'y'
                },
                items:[
                    {
                        title: '商品信息',
                        columns: [
                            {text: '国际款号', dataIndex: 'orderinfo_style', flex: 1},
                            {text: '商品名称', dataIndex: 'orderinfo_name'},
                            {text: '颜色', dataIndex: 'orderinfo_color'},
                            {text: '尺码', dataIndex: 'orderinfo_group'},
                            {text: '数量', dataIndex: 'orderinfo_amount'},
                            {text: '批发价(欧)', dataIndex: 'orderinfo_nprice'},
                            {text: '总价(欧)', dataIndex: 'orderinfo_wholesale'},
                            {text: '官方零售价(欧)', dataIndex: 'orderinfo_official'}
                        ]
                    },
                    {
                        title: '入库信息',
                        columns:[
                            {text:'唯一码',dataIndex:'orderinfo_style',flex:1},
                            {text:'供应商款号',dataIndex:'orderinfo_style',flex:1},
                            {text:'名称',dataIndex:'orderinfo_name'},
                            {text:'系统颜色代码',dataIndex:'orderinfo_color'},
                            {text:'颜色名称',dataIndex:'orderinfo_color'},
                            {text:'国际颜色代码',dataIndex:'orderinfo_color'},
                            {text:'尺码',dataIndex:'orderinfo_group'},
                            {text:'单价',dataIndex:'orderinfo_amount',flex:1}
                        ]
                    },
                    {
                        title: '差异数',
                        columns:[
                            {text:'供应商款号',dataIndex:'orderinfo_style',flex:1},
                            {text:'颜色',dataIndex:'orderinfo_color'},
                            {text:'尺码',dataIndex:'orderinfo_group'},
                            {text:'差异数',dataIndex:'orderinfo_amount',flex:1}
                        ]
                    },
                ]
            }
        ]

        this.callParent(arguments);
    }
});
