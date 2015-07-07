/**
 * Created by Administrator on 2015-07-07.
 */
Ext.define('erp.view.module.goods.BaseDataMng', {
    extend: "Ext.container.Container",
    alias: "widget.basedatamng",

    requires: [
        'Ext.data.Store',
        'Ext.data.proxy.Ajax',
        'Ext.data.reader.Json',
        'Ext.form.Panel',
        'Ext.form.field.Text',
        'Ext.grid.Panel',
        'Ext.layout.container.Column',
        'Ext.layout.container.HBox',
        'Ext.window.Window',
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
                title: '基础资料',
                sortableColumns: false,
                enableColumnHide: false,
                width: 200,
                height: '100%',
                tbar: [
                    {
                        text: '新增',
                        glyph: 0xf1f8,
                        handler: function (btn) {
                            var win = Ext.create('Ext.window.Window', {
                                width:450,
                                title: '新增基础资料',
                                items: [{
                                    xtype: 'form',
                                    bodyPadding: 10,
                                    layout:'column',
                                    url: apiBaseUrl + '/index.php/Commodity/Public/addBaseData',
                                    defaults: {
                                        xtype: 'textfield',
                                        labelAlign: 'right',
                                        allowBlank: false,
                                        margin:5,
                                        columnWidth:0.5,
                                        labelWidth:70
                                    },
                                    items: [
                                        {fieldLabel: '资料名称', name: 'name',columnWidth:1}
                                    ],
                                    buttons: [
                                        {text:'添加资料属性',handler:function(){
                                            var form = this.up('form');
                                            var len = (form.items.length+1)/2;
                                            form.add({fieldLabel: '属性名称'+len, name: 'name-'+len});
                                            form.add({fieldLabel: '属性标示'+len, name: 'mark-'+len});
                                        }},
                                        {
                                            text: '重置',
                                            handler: function () {
                                                var form = this.up('form')
                                                form.removeAll();
                                                form.add({fieldLabel: '资料名称', name: 'name',columnWidth:1});
                                                form.getForm().reset();
                                            }
                                        },
                                        {
                                            text: '提交',
                                            id: 'submit',
                                            formBind: true,
                                            disabled: true,
                                            handler: function () {
                                                var form = this.up('form').getForm();
                                                if (form.isValid()) {
                                                    form.submit({
                                                        success: function (form, action) {
                                                            console.log(action);
                                                            btn.up("grid").getStore().load();
                                                            win.destroy();
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
                                }]
                            });
                            win.show();
                        }
                    },
                    {
                        text: '删除',
                        glyph: 0xf1f8
                    }
                ],
                columns: [
                    {text: '名称', dataIndex: 'name',flex:1}
                ],
                selModel:'checkboxmodel',
                store: Ext.create('Ext.data.Store', {
                    autoLoad: true,
                    fields:['id','name','fields'],
                    proxy: {
                        type: 'ajax',
                        url: apiBaseUrl + '/index.php/Commodity/Public/getBaseDataList',
                        reader: {
                            type: 'json',
                            rootProperty: 'data'
                        }
                    }
                })
            }
        ]
        me.callParent();
    }
});