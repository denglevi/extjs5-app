/**
 * Created by Administrator on 2015-07-02.
 */
Ext.define('erp.view.module.warehouse.WarehouseCheckController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.warehousecheck',

    requires: [
        'Ext.Ajax',
        'Ext.data.Store',
        'Ext.form.field.ComboBox',
        'Ext.form.field.Date',
        'Ext.form.field.TextArea',
        'Ext.layout.container.Column',
        'Ext.window.Window',
        'erp.view.module.warehouse.WarehouseCheckTaskOrderInfo'
    ],

    init: function () {

    },
    onWarehouseCheckTaskOrderGridDblClick:function(gp,record){
        var tab = gp.up("tabpanel");
        tab.setActiveTab({
            xtype:'warehousechecktaskorderinfo',
            title:'新建订单',
            closable:true
        });
    },

    addTaskOrder:function(){
        var me = this,
            model = this.getViewModel();
        var store = Ext.create('Ext.data.Store', {
            fields: ['type', 'val'],
            data: [
                {type: '全盘', val: 1},
                {type: '品牌', val: 2},
                {type: '分类', val: 3}
            ]
        });
        var isHide = model.get("add_wahouse_check_task_order_field_hidden")
        var win = Ext.create('Ext.window.Window', {
            title: '新增任务单',
            bodyPadding: 20,
            modal: true,
            width: 600,
            layout: 'column',
            defaults: {
                editable: false,
                margin: 10,
                labelAlign: 'right',
                allowBlank: false,
                labelWidth: 70,
                columnWidth: 0.5,
                xtype: 'combo',
                hidden: isHide
            },
            items: [
                {xtype: 'datefield', fieldLabel: '盘点日期', format: 'Y-m-d', value: new Date(), name: 'date',hidden:false},
                {
                    fieldLabel: '盘点类型',
                    store: store,
                    displayField: 'type',
                    valueField: 'val',
                    name: 'type',
                    hidden: false,
                    listeners: {
                        change: function(){
                            var val = this.getValue();
                            if (val == 1) {
                                win.down("combo[name=brand]").setHidden(true);
                                win.down("combo[name=year_season]").setHidden(true);
                                win.down("combo[name=large_class]").setHidden(true);
                                win.down("combo[name=small_class]").setHidden(true);
                                win.down("combo[name=sex]").setHidden(true);
                            }
                            else if (val == 2) {
                                win.down("combo[name=brand]").setHidden(false);
                            }
                            else if (val == 3) {
                                win.down("combo[name=brand]").setHidden(false);
                                win.down("combo[name=year_season]").setHidden(false);
                                win.down("combo[name=large_class]").setHidden(false);
                                win.down("combo[name=small_class]").setHidden(false);
                                win.down("combo[name=sex]").setHidden(false);
                            }
                        }
                    }
                },
                {
                    fieldLabel: '品牌',
                    displayField: 'type',
                    valueField: 'val',
                    name: 'brand'
                },
                {
                    fieldLabel: '年季',
                    displayField: 'type',
                    valueField: 'val',
                    name: 'year_season'
                },
                {
                    fieldLabel: '大类',
                    displayField: 'type',
                    valueField: 'val',
                    name: 'large_class'
                },
                {
                    fieldLabel: '小类',
                    displayField: 'type',
                    valueField: 'val',
                    name: 'small_class'
                },
                {
                    fieldLabel: '性别',
                    displayField: 'type',
                    valueField: 'val',
                    name: 'sex'
                },
                {
                    columnWidth: 1,
                    xtype: 'textarea',
                    fieldLabel: '备注',
                    name: 'mark',
                    editable: true,
                    allowBlank: true,
                    hidden: false
                }
            ],
            buttons: [
                {
                    text: '提交', handler: function () {
                    Ext.Ajax.request({
                        aysnc: true,
                        method: 'POST',
                        url: '',
                        params: {},
                        success: function (res) {

                        },
                        failure: function (res) {

                        }
                    });
                }
                }
            ]
        });

        win.show();
    }
});