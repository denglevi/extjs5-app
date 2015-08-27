/**
 * Created by Administrator on 2015-08-24.
 */
Ext.define('erp.view.module.warehouse.ReturnWarehouseDetail', {
    extend: 'Ext.Container',
    xtype: 'returnwarehousedetail',

    requires: [
        'Ext.Ajax',
        'Ext.data.Store',
        'Ext.data.proxy.Ajax',
        'Ext.data.reader.Json',
        'Ext.form.field.Display',
        'Ext.form.field.Text',
        'Ext.grid.Panel',
        'Ext.layout.container.Anchor',
        'Ext.layout.container.Column',
        'Ext.layout.container.VBox',
        'Ext.panel.Panel',
        'Ext.tab.Panel',
        'Ext.window.Window'
    ],

    initComponent: function () {
        var me = this;
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
                        columnWidth: 0.3,
                        labelAlign: 'right',
                        labelWidth: 70
                    },
                    items: [

                        {fieldLabel: '单据编号', value: me.record.get("refund_no")},
                        {fieldLabel: '申请单号', value: me.record.get("returns_no")},
                        {fieldLabel: '通知日期', value: me.record.get("create_time")},
                        {fieldLabel: '收货仓库', value: me.record.get("storage_name")},
                        {fieldLabel: '申请门店', value: me.record.get("shops_name")},

                    ],
                    buttons: me.getActionButtons()
                },
                me.getTabItems()
            ]
        });
        this.callParent();
    },
    getTabItems: function () {
        var me = this,
            grid = Ext.create('Ext.grid.Panel', {
                sortableColumns: false,
                enableColumnHide: false,
                enableColumnResize: false,
                columns: [
                    {text: '唯一码', flex: 1,dataIndex:'goods_no'},
                    {text: '系统款号', flex: 1,dataIndex:'system_style_no'},
                    {text: '颜色', flex: 1,dataIndex:'color'},
                    {text: '尺码',dataIndex:'size'},
                ],
                store: Ext.create('Ext.data.Store', {
                    fields: [],
                    autoLoad: false,
                    proxy: {
                        type: 'ajax',
                        url: apiBaseUrl + '/index.php/Warehouse/Refund/getRefundGoodList?id=' + me.record.get("returns_id"),
                        reader: {
                            rootProperty: 'data',
                            type: 'json'
                        }
                    }
                }),
                listeners: {
                    afterrender: function () {
                        this.getStore().load();
                    }
                }
            });
        var ReturnGoods=Ext.create('Ext.grid.Panel', {
            sortableColumns: false,
            enableColumnHide: false,
            enableColumnResize: false,
            columns: [
                {text: '商品代码', flex: 1,dataIndex:'system_style_no'},
                {text: '颜色', flex: 1,dataIndex:'color'},
                {text: '尺码', flex: 1,dataIndex:'size'},
                {text: '数量', flex: 1,dataIndex:'num'},
            ],
            store: Ext.create('Ext.data.Store', {
                fields: [],
                autoLoad: false,
                proxy: {
                    type: 'ajax',
                    url: apiBaseUrl + '/index.php/Warehouse/Refund/getReturnGoods?id=' + me.record.get("id"),
                    reader: {
                        rootProperty: 'data',
                        type: 'json'
                    }
                }
            }),
            listeners: {
                afterrender: function () {
                    this.getStore().load();
                }
            }
        });
        var log=Ext.create('Ext.grid.Panel', {
            sortableColumns: false,
            enableColumnHide: false,
            enableColumnResize: false,
            columns: [
                {text: '操作时间', flex: 1,dataIndex:'operation_time'},
                {text: '操作用户', flex: 1,dataIndex:'operation_user'},
                {text: '操作模块', flex: 1,dataIndex:'operation'},
            ],
            store: Ext.create('Ext.data.Store', {
                fields: [],
                autoLoad: false,
                proxy: {
                    type: 'ajax',
                    url: apiBaseUrl + '/index.php/Warehouse/Refund/getRefundLogList?id=' + me.record.get("id"),
                    reader: {
                        rootProperty: 'data',
                        type: 'json'
                    }
                }
            }),
            listeners: {
                afterrender: function () {
                    this.getStore().load();
                }
            }
        });
        var tab = Ext.create('Ext.tab.Panel', {
            flex: 1,
            items: [
                {
                    title: '审核商品范围',
                    itemId: 'detail',
                    items: [ReturnGoods]
                },
                {
                    title: '申请退货范围',
                    itemId: 'apply',
                    items: [grid]
                },
                {
                    title: '操作日志',
                    itemId: 'log',
                    items:[log]
                }

            ]
        });

        return tab;
    },
    getActionButtons: function () {

        var me = this;
        var btns = [
            {text: '审批',itemId:'save',handler:me.saveWarehouseCheckOrder,scope:me},
        ];
        if(me.record.get("status")==0){
            btns[0].hidden=false;
        }else{
            btns[0].hidden=true;
        }

        return btns;
    },
    saveWarehouseCheckOrder:function(){
        var me=this,store = me.down("#detail").down("grid").getStore(),goods=[];
        var items = store.getData().items,len = items.length;
        for(var i=0;i<len;i++){
            var item = items[i],mark = item.get("mark");
            if(mark != 0) continue;
            goods.push({
                no:item.get("no"),
                system_style_no:item.get("system_style_no"),
            });
        }
        if(goods.length<1){
            Ext.toast("请先扫描商品", "系统提示");
            return;
        }
        Ext.Ajax.request({
            async: true,
            url: apiBaseUrl + '/index.php/Warehouse/CheckVouch/saveWarehouseCheckOrder',
            method: 'POST',
            params: {
                goods:Ext.encode(goods),
                id:me.record.get("pid"),
                status:1
            },
            success: function (res) {
                var json = Ext.decode(res.responseText);
                if (!json.success) {
                    Ext.toast(json.msg, "系统提示");
                    return
                }
                Ext.toast("保存成功", "系统提示");
                Ext.StoreManager.lookup("WarehouseCheckOrderStore").load();
            },
            failure: function (res) {
                Ext.toast("服务请求错误,请检查网络连接!", "系统提示");
            }
        });
    },

});