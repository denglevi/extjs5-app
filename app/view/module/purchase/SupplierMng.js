/**
 * Created by Administrator on 2015-06-11.
 */
Ext.define('erp.view.module.purchase.SupplierMng', {
    extend: "Ext.container.Container",
    alias: "widget.suppliermng",

    requires: [
        'Ext.form.Panel',
        'Ext.form.field.Hidden',
        'Ext.form.field.Text',
        'Ext.grid.Panel',
        'Ext.layout.container.Anchor',
        'Ext.layout.container.HBox',
        'Ext.toolbar.Paging',
        'erp.view.module.purchase.SupplierMngController',
        'erp.view.module.purchase.SupplierMngModel'
    ],
    controller: 'suppliermng',
    layout: 'hbox',
    split: true,
    viewModel: {
        type: 'suppliermng'
    },
    initComponent: function () {
        var me = this;
        this.items = [
            {
                xtype: 'grid',
                flex: 1,
                title: '供应商列表',
                border: true,
                height: '100%',
                columnLines: true,
                rowLines: true,
                sortableColumns:false,
                selModel:'checkboxmodel',
                store:'SupplierStore',
                viewConfig: {
                    emptyText: '<b style="text-align: center;">暂无记录</b>',
                    scrollable: 'vertical',
                    loadingText: '正在加载...'
                },
                bbar: ['->', {
                    xtype: 'pagingtoolbar',
                    store: null,
                    store:'SupplierStore',
                    emptyMsg: '<b>暂无记录</b>',
                    displayMsg: '显示 {0} - {1} 总共 {2} 条记录',
                    displayInfo: true
                }],
                tbar: [
                    {
                        text:'删除',
                        glyph:0xf1f8
                    },'->',
                    {
                        xtype: 'textfield',
                        fieldLabel: "供应商编号",
                        name: 'supllier_no'
                    }, '',
                    {
                        xtype: 'textfield',
                        fieldLabel: "供应商名称",
                        name: 'supllier_name'
                    }, '->',
                    {
                        text: '搜索',
                        glyph: 0xf002
                    }
                ],
                columns: [
                    {text: '供应商编号', dataIndex: 'vendor_no'},
                    {text: '名称', dataIndex: 'name', flex: 1},
                    {text: '地址', dataIndex: 'address', flex: 2}
                ],
                listeners: {
                    rowdblclick: "onSupplierGridDblClick"
                }
            },
            {
                xtype: 'form',
                title: '新增供应商',
                width: 350,
                height: '100%',
                url: 'http://localhost/coscia/index.php/Purchasing/Vendor/editVendor',
                layout: 'anchor',
                method: 'POST',
                bodyPadding: 10,
                defaults: {
                    anchor: '100%',
                    margin: 10,
                    bind: {
                        disabled: '{fieldDisabled}'
                    },
                    allowBlank: false
                },
                defaultType: 'textfield',
                items: [
                    {
                        xtype: 'hiddenfield',
                        name: 'id'
                    },
                    {
                        fieldLabel: '供应商名称',
                        name: 'name',
                        emptyText: "供应商名称"
                    }, {
                        fieldLabel: '税号',
                        name: 'tax_no'
                    }, {
                        fieldLabel: '供应商编号',
                        name: 'vendor_no'
                    }, {
                        fieldLabel: '地址',
                        name: 'address'
                    }, {
                        fieldLabel: '开户行',
                        name: 'bank_name'
                    }, {
                        fieldLabel: '银行账号',
                        name: 'bank_no'
                    }
                ],
                tbar: ['->',
                    {
                        text: '新增',
                        glyph:0xf067,
                        handler: function (el) {
                            this.up('form').getForm().reset();
                            me.getViewModel().set("fieldDisabled", false);
                        }
                    },
                    {
                        text: '编辑',
                        glyph:0xf044,
                        handler: function () {
                            me.getViewModel().set("fieldDisabled", false);
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
                        text: '提交',
                        id: 'submit',
                        formBind: true,
                        disabled: true,
                        handler: function () {
                            if (me.getViewModel().get("fieldDisabled")) {
                                Ext.Msg.alert('系统提示', "当前表单处于不可编辑状态，请激活!");
                                return;
                            }
                            var form = this.up('form').getForm();
                            if (form.isValid()) {
                                form.submit({
                                    success: function (form, action) {
                                        me.down("grid").getStore().load();
                                        Ext.Msg.alert('成功', action.result.msg);
                                    },
                                    failure: function (form, action) {
                                        console.log(action);
                                        Ext.Msg.alert('失败', action.result.msg);
                                    }
                                });
                            }
                        }
                    }
                ],
            }
        ];

        this.listeners = {
            afterrender: function (el) {
                //me.down("grid").down("pagingtoolbar").setStore(store);
                me.down("grid").getStore().load();
                //store.load(function (data) {
                //    console.log(data);
                //});
            }
        }
        me.callParent();
    }
});