/**
 * Created by Administrator on 2015-08-25.
 */
Ext.define('erp.view.module.warehouse.ReturnIntoWarehouseDetail', {
    extend: 'Ext.Container',
    xtype: 'returnintowarehousedetail',

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

                        {fieldLabel: '单据编号', value: me.record.get("refund_into_no")},
                        {fieldLabel: '申请单号', value: me.record.get("teturned_no")},
                        {fieldLabel: '通知单号', value: me.record.get("refund_no")},
                        {fieldLabel: '日期', value: me.record.get("create_time")},
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
                        url: apiBaseUrl + '/index.php/Warehouse/RefundInto/getRefundIntoGoodList?id=' + me.record.get("id"),
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
                    url: apiBaseUrl + '/index.php/Warehouse/RefundInto/getSetIntoWarehouseMenu?id=' + me.record.get("id"),
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
                    url: apiBaseUrl + '/index.php/Warehouse/RefundInto/getRefundIntoLogList?id=' + me.record.get("id"),
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
        if(me.record.get("select_type")==1){
            var diff=Ext.create('Ext.grid.Panel', {
                sortableColumns: false,
                enableColumnHide: false,
                enableColumnResize: false,
                columns: [
                    {text: '唯一码', flex: 1,dataIndex:'goods_no'},
                    {text: '商品代码', flex: 1,dataIndex:'system_style_no'},
                    {text: '商品颜色', flex: 1,dataIndex:'color'},
                    {text: '商品尺码', flex: 1,dataIndex:'size'},
                ],
                store: Ext.create('Ext.data.Store', {
                    fields: [],
                    autoLoad: false,
                    proxy: {
                        type: 'ajax',
                        url: apiBaseUrl + '/index.php/Warehouse/RefundInto/getRefundIntoGoodsDiff?id=' + me.record.get("id"),
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
        }
        else{
            var diff=Ext.create('Ext.grid.Panel', {
                sortableColumns: false,
                enableColumnHide: false,
                enableColumnResize: false,
                columns: [
                    {text: '商品代码', flex: 1,dataIndex:'system_style_no'},
                    {text: '商品颜色', flex: 1,dataIndex:'color'},
                    {text: '商品尺码', flex: 1,dataIndex:'size'},
                    {text: '差异数', flex: 1,dataIndex:'num'},
                ],
                store: Ext.create('Ext.data.Store', {
                    fields: [],
                    autoLoad: false,
                    proxy: {
                        type: 'ajax',
                        url: apiBaseUrl + '/index.php/Warehouse/RefundInto/getRefundIntoGoodsDiff?id=' + me.record.get("id"),
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
        }

        var tab = Ext.create('Ext.tab.Panel', {
            flex: 1,
            items: [
                {
                    title: '入库信息',
                    itemId: 'detail',
                    items: [grid]
                },
                {
                    title: '退货范围',
                    itemId: 'apply',
                    items: [ReturnGoods]
                },
                {
                    title: '差异数',
                    itemId: 'diff',
                    items: [diff]
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
        var str=[];
        var btns = [
            {
                text: '扫货',itemId:'goods_set', handler: function () {
                var win = Ext.create('Ext.window.Window', {
                    title: '扫描商品',
                    width: 400,
                    modal: true,
                    layout: 'anchor',
                    bodyPadding: 20,
                    items: [{
                        xtype: 'textfield',
                        name: 'good_no',
                        fieldLabel: '唯一码',
                        anchor: '100%',
                        labelAlign: 'right',
                        labelWidth: 70,
                        enableKeyEvents: true,
                        listeners: {
                            keyup: function (obj, e) {
                                if (e.keyCode !== 13) return;
                                var no = obj.getValue();
                                Ext.Ajax.request({
                                    async: false,
                                    url: apiBaseUrl + '/index.php/Warehouse/RefundInto/setNoGetGoods',
                                    method: 'POST',
                                    params: {
                                        no: no,
                                        id: me.record.get('id'),
                                        str: str.join(',')
                                    },
                                    success: function (res) {

                                        var json = Ext.decode(res.responseText);
                                        var store = me.down("#detail").down("grid").getStore();
                                        if (!json.success) {
                                            Ext.toast(json.msg, "系统提示");
                                            return
                                        }
                                        obj.setValue("");
                                        var res = store.findRecord("no",no);
                                        if(res !== null){
                                            Ext.toast("此商品已在扫描", "系统提示");
                                            return;
                                        }
                                        str.push(json.data.str);

                                        json.data.mark = 0;
                                        json.data.inventory_id = me.record.get("id");
                                        store.insert(0,json.data);

                                    },
                                    failure: function (res) {
                                        Ext.toast("服务请求错误,请检查网络连接!", "系统提示");
                                    }
                                });
                            }
                        }
                    }]
                });
                win.show();
            },hidden:me.record.get('status')==1
            },
            {text: '保存',itemId:'save',handler:me.saveRefundIntoWarehouseGoods,scope:me,hidden:me.record.get('status')==1},
            {text: '验收',val:'1',itemId:'sampled',handler:me.sampledRefundIntoGoods,scope:me,hidden:me.record.get('status')==1},
            {text: '终止',val:'2',itemId:'stop',handler:me.sampledRefundIntoGoods,scope:me,hidden:me.record.get('status')==2},
        ];
        if(me.record.get("status")==0){
            btns[3].hidden=false;
            btns[0].hidden=false;
            btns[1].hidden=false;
            btns[2].hidden=false;
        }else if(me.record.get("status")==1){
            btns[0].hidden=true;
            btns[1].hidden=true;
            btns[2].hidden=true;
            btns[3].hidden=false;
        }else{
            btns[0].hidden=true;
            btns[1].hidden=true;
            btns[2].hidden=true;
            btns[3].hidden=true;
        }
        return btns;
    },
    saveRefundIntoWarehouseGoods:function(){
        var me=this,store = me.down("#detail").down("grid").getStore(),goods=[];
        var items = store.getData().items,len = items.length;
        for(var i=0;i<len;i++){
            var item = items[i],mark = item.get("mark");
            if(mark != 0) continue;
            goods.push({
                goods_no:item.get("goods_no"),
                system_style_no:item.get("system_style_no"),
                color:item.get("color"),
                size:item.get("size")
            });
        }
        if(goods.length<1){
            Ext.toast("请先扫描商品", "系统提示");
            return;
        }
        Ext.Ajax.request({
            async: true,
            url: apiBaseUrl + '/index.php/Warehouse/RefundInto/saveRefundIntoWarehouseGoods',
            method: 'POST',
            params: {
                goods:Ext.encode(goods),
                id:me.record.get("id"),
            },
            success: function (res) {
                var json = Ext.decode(res.responseText);
                if (!json.success) {
                    Ext.toast(json.msg, "系统提示");
                    return
                }
                Ext.toast("保存成功", "系统提示");
                Ext.StoreManager.lookup("ReturnIntoWarehouseStore").load();
            },
            failure: function (res) {
                Ext.toast("服务请求错误,请检查网络连接!", "系统提示");
            }
        });
    },
    sampledRefundIntoGoods:function(btn){
        var status=btn.val;
        Ext.Ajax.request({
            async:true,
            url: apiBaseUrl +'/index.php/Warehouse/RefundInto/editRefundIntoStatus',
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
                me.down('#goods_set').setHidden(true);
                me.down('#save').setHidden(true);
                me.down('#sampled').setHidden(true);
                if(status==1)
                    me.down('#status_yes').setHidden(false);
                if(status==2) me.down('#status_yes').setHidden(true);
                Ext.StoreManager.lookup("WarehouseCheckTaskOrderStore").load();
            },
            failure: function (res) {
                Ext.toast("服务请求错误,请检查网络连接!", "系统提示");
            }
        });
    }
});