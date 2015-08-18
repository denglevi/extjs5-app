/**
 * Created by Administrator on 2015-07-18.
 */
Ext.define('erp.view.module.operation.SingleDetails', {
    extend: 'Ext.Container',
    xtype: 'singledetails',

    requires: [
        'Ext.Ajax',
        'Ext.form.field.Display',
        'Ext.grid.Panel',
        'Ext.layout.container.Column',
        'Ext.layout.container.VBox',
        'Ext.panel.Panel',
        'Ext.tab.Panel'
        //'erp.view.module.operation.GiftController'
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
                        columnWidth: 0.2,
                        labelAlign: 'right',
                        labelWidth: 70
                    },
                    items: [
                        {fieldLabel: '编号',value:me.record.get("single_no")},
                        {fieldLabel: '日期',value:me.record.get("single_time")},
                        {fieldLabel: '类别',value:me.record.get("sort_name")},
                        {fieldLabel: '初始面值',value:me.record.get("single_money")},
                        {fieldLabel: '卡前缀',value:me.record.get("single_prefix")},
                        {fieldLabel: '起始编号',value:me.record.get("single_onset")},
                        {fieldLabel: '截至编号',value:me.record.get("single_end")},
                        {fieldLabel: '编码长度',value:me.record.get("encoding_length")},
                        {fieldLabel: '截至有效日',value:me.record.get("single_upto")},
                        {fieldLabel: '不包含数字',value:me.record.get("single_exclusive")},
                        {fieldLabel: '组织',value:me.record.get("shops_name")},
                        {fieldLabel: '激活方式',value:me.record.get("single_activate"),renderer:function(val){
                            if(1 == val) return "整单激活";
                            if(0 == val) return "投放激活";
                        }},
                        {fieldLabel: '状态',value:me.record.get("single_status")},
                        {fieldLabel: '投放人',value:me.record.get("single_operator")},
                    ],
                    buttons: me.getActionButtons()
                },
                me.getTabItems(me.record.get("id")),
                //console.log(me.record.get("id"),123)
            ]
        });
        this.callParent();
    },
    getTabItems: function (id) {
        var grid = Ext.create('Ext.grid.Panel', {
            title: '礼券投放明细',
            flex:1,
            height:'100%',
            scrollable : true,
            columns: [
                {text: '礼券单号', flex: 1,dataIndex:"singleinfo_code"},
                {text: '编号', flex: 1,dataIndex:"singleinfo_no"},
                {text: '状态',dataIndex:"singleinfo_status"},
            ]
        }),me=this;

        Ext.Ajax.request({
            async: true,
            url: apiBaseUrl + '/index.php/Operations/SingleType/getSingleInfo',
            method: 'POST',
            params:{id:id},
            success: function (res) {
                var json = Ext.decode(res.responseText),
                    store = Ext.create('Ext.data.Store', {
                        fields: [],
                        data: json.data
                    });
                grid.setStore(store);
            },
            failure: function () {}
        });
        return grid;
    },
    getActionButtons:function(){
        var id = this.record.get("id");
        var status = this.record.get("single_status");
        var cantel = this.record.get("single_cancel");
        if(cantel == 1){
            btns = [
                {text: '取消作废',
                    handler: function () {
                        Ext.Ajax.request({
                            async: true,
                            url: apiBaseUrl + '/index.php/Operations/SingleType/singleInfoThrow',
                            method: 'POST',
                            params:{id:id,status:"取消作废"},
                            success: function (res) {
                                var json = Ext.decode(res.responseText);
                                var store = Ext.StoreManager.lookup("SingleList");
                                if(store != null) store.load();
                            },
                            failure: function () {}
                        });
                    }}
            ];
            return btns;
        }
        if(status == '已投放'){
            btns = [
                {text: '作废',
                    handler: function () {
                Ext.Ajax.request({
                    async: true,
                    url: apiBaseUrl + '/index.php/Operations/SingleType/singleInfoThrow',
                    method: 'POST',
                    params:{id:id,status:"作废"},
                    success: function (res) {
                        var json = Ext.decode(res.responseText);
                        var store = Ext.StoreManager.lookup("SingleList");
                        if(store != null) store.load();
                    },
                    failure: function () {}
                });
            }}
            ];
        }else{
            btns = [
                {text: '投放',
                    handler: function () {
                        Ext.Ajax.request({
                            async: true,
                            url: apiBaseUrl + '/index.php/Operations/SingleType/singleInfoThrow',
                            method: 'POST',
                            params:{id:id,status:"已投放"},
                            success: function (res) {
                                var json = Ext.decode(res.responseText);
                                var store = Ext.StoreManager.lookup("SingleList");
                                if(store != null) store.load();
                            },
                            failure: function () {}
                        });
                    }
                }
            ];
        }
        return btns;
    },

});