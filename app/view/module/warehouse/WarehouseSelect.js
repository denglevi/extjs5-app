/**
 * Created by Administrator on 2015-06-30.
 */
Ext.define('erp.view.module.warehouse.WarehouseSelect', {
    extend: 'Ext.Container',
    xtype: 'warehouseselect',

    requires: [
        'Ext.Ajax',
        'Ext.data.Store',
        'Ext.data.proxy.Ajax',
        'Ext.data.reader.Json',
        'Ext.form.Panel',
        'Ext.form.field.ComboBox',
        'Ext.form.field.Date',
        'Ext.grid.Panel',
        'Ext.layout.container.Column'
    ],

    initComponent: function () {
        var me = this;

        me.layout = {
            type: 'vbox',
            align: 'stretch'
        };
        Ext.Ajax.request({
            async: true,
            url: apiBaseUrl + '/index.php/Warehouse/Stock/getSearchData',
            success: function (response) {
                var text = Ext.decode(response.responseText);
                if(!text.success){
                    Ext.toast("初始化数据错误,请重试!","系统提示");
                    return;
                }
                res = text.data;
                console.log(text);
                var form = me.down("form");
                form.down("combo[name=brand]").setStore(Ext.create('Ext.data.Store', {
                    fields: ['id', 'username'],
                    data:res.brand
                }));
                form.down("combo[name=warehouse]").setStore(Ext.create('Ext.data.Store', {
                    fields: ['id', 'username'],
                    data:res.warehouse
                }));
                form.down("combo[name=big_class]").setStore(Ext.create('Ext.data.Store', {
                    fields: ['id', 'name'],
                    data:res.cate
                }));

                form.down("combo[name=brand]").setDisabled(false);
                form.down("combo[name=warehouse]").setDisabled(false);
                form.down("combo[name=big_class]").setDisabled(false);
            }
        });
        var fields = me.getSearchFields();
        var grid = me.getGrid();
        me.items = [fields, grid];

        this.callParent();
    },
    getSearchFields: function () {
        var me = this;
        var fields = {
            xtype: 'form',
            layout: 'column',
            height: 'auto',
            //minHeight: 100,
            bodyPadding: 10,
            margin: '25 0 0 0',
            defaults: {
                margin: 5,
                labelWidth: 70,
                labelAlign: 'right',
                editable: false,
                disabled: true
            },
            items: [
                {xtype: 'combo', fieldLabel: '品牌', name: 'brand',displayField:'name_en',valueField:'id'},
                {xtype: 'combo', fieldLabel: '大类', name: 'big_class',listeners:{
                    change:function(){
                        var val = this.getValue(),sub = this.up("form").down("combo[name=middle_class]");
                        console.log(val);
                        sub.clearValue();
                        if(val !== null) {
                            console.log(123);
                            Ext.Ajax.request({
                                async: true,
                                url: apiBaseUrl + '/index.php/Warehouse/Stock/getCate',
                                params:{
                                  pid:val
                                },
                                success: function (response) {
                                    var text = Ext.decode(response.responseText);
                                    if(!text.success){
                                        Ext.toast("初始化数据错误,请重试!","系统提示");
                                        return;
                                    }
                                    res = text.data;
                                    console.log(text);
                                    var form = me.down("form");
                                    form.down("combo[name=middle_class]").setStore(Ext.create('Ext.data.Store', {
                                        fields: ['id', 'name'],
                                        data:res.cate
                                    }));
                                    sub.setDisabled(false);
                                }
                            });
                        }
                        else sub.setDisabled(true);
                    }
                },displayField:'name',valueField:'id'},
                {xtype: 'combo', fieldLabel: '中类', name: 'middle_class',displayField:'name',valueField:'id',},
                {xtype: 'combo', fieldLabel: '仓库', name: 'warehouse',listeners:{
                    change:function(){
                        var val = this.getValue(),sub = this.up("form").down("combo[name=location]");
                        sub.clearValue();
                        console.log(val);
                        if(val !== null) {
                            console.log(123);
                            Ext.Ajax.request({
                                async: true,
                                url: apiBaseUrl + '/index.php/Warehouse/Stock/getLocation',
                                params:{
                                    id:val
                                },
                                success: function (response) {
                                    var text = Ext.decode(response.responseText);
                                    if(!text.success){
                                        Ext.toast("初始化数据错误,请重试!","系统提示");
                                        return;
                                    }
                                    res = text.data;
                                    console.log(text);
                                    var form = me.down("form");
                                    form.down("combo[name=location]").setStore(Ext.create('Ext.data.Store', {
                                        fields: ['id', 'name'],
                                        data:res
                                    }));
                                    sub.setDisabled(false);
                                }
                            });
                        }
                        else sub.setDisabled(true);
                    }
                },displayField:'no',valueField:'id'},
                {xtype: 'combo', fieldLabel: '库位', name: 'location',displayField:'no',valueField:'id'},
                {xtype: 'datefield',disabled: false, fieldLabel: '入库日期', format: 'Y-m-d', name: 'warehouse_date'},
                {xtype: 'datefield',disabled: false, fieldLabel: '上架日期', format: 'Y-m-d', name: 'exhibit_date'}
            ],
            buttons: [
                {
                    text: '重置',
                    handler: function () {
                        this.up('form').getForm().reset();
                    }
                },
                {
                    text:'搜索',
                    handler:me.search
                }
            ]
        }

        return fields;
    },
    getGrid: function () {
        var grid = {
            xtype: 'grid',
            flex: 1,
            reference:'warehouse_search_grid',
            title: '商品列表',
            sortableColumns: false,
            enableColumnHide: false,
            columns: [
                {text: '品牌', dataIndex: 'brand'},
                {text: '唯一码', dataIndex: 'goods_no', flex: 1},
                {text: '国际款号', dataIndex: 'supply_style_no', flex: 1},
                {text: '大类', dataIndex: 'large_class'},
                {text: '中类', dataIndex: 'middle_class'},
                {text: '库位', dataIndex: 'location'},
                {text: '入库日期', dataIndex: 'warehouse_date'},
                {text: '上架日期', dataIndex: 'exhibit_date'},
                {text: '商品状态', dataIndex: 'status'}
            ],
            store:Ext.create('Ext.data.Store',{
                fields:[],
                authLoad:false,
                proxy:{
                    type:'ajax',
                    url: apiBaseUrl + '/index.php/Warehouse/Stock/searchGoods',
                    reader:{
                        type:'json',
                        rootProperty:'data',
                        totalProperty:'total'
                    }
                }
            })
        }

        return grid;
    },
    search: function () {
        var form = this.up('form').getForm(),
            store = this.up("form").up("warehouseselect").down("grid").getStore(),
            vals = form.getValues();
        store.setProxy({
            extraParams:{
                vals:Ext.encode(vals)
            },
            type:'ajax',
            url: apiBaseUrl + '/index.php/Warehouse/Stock/searchGoods',
            reader:{
                type:'json',
                rootProperty:'data',
                totalProperty:'total'
            }
        });
        store.load(function(records, operation, success){
            console.log(records, operation, success);
        });

    }
});
