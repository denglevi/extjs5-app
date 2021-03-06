/**
 * Created by Administrator on 2015-06-18.
 */
Ext.define('erp.view.window.AddPassCustomWin', {
    extend: 'Ext.window.Window',
    xtype: 'addpasscustomwin',
    requires: [
        'Ext.Ajax',
        'Ext.Array',
        'Ext.data.Store',
        'Ext.form.Panel',
        'Ext.form.field.ComboBox',
        'Ext.form.field.Hidden',
        'Ext.form.field.Text',
        'Ext.form.field.TextArea',
        'Ext.layout.container.Column',
        'Ext.layout.container.Fit'
    ],
    layout: 'fit',
    initComponent: function () {
        var me = this, res;
        var next_status_id = me.next_status.is_last == 1 ? 0 : me.next_status.id
        Ext.apply(me, {
            items: [
                {
                    xtype: 'form',
                    url: apiBaseUrl + '/index.php/Purchasing/Customs/addPassCustomOrder',
                    method: 'POST',
                    width: 650,
                    layout: 'column',
                    bodyPadding: 10,
                    defaults: {
                        anchor: '100%',
                        xtype: 'textfield',
                        allowBlank: false,
                        disabled: false,
                        margin: 5,
                        columnWidth: 0.5,
                        labelAlign:'right',
                        labelWidth: 120
                    },
                    items: this.getFieldItems(me.batch_no, me.order_no, next_status_id, me.next_status.is_last),
                    buttons: this.getBtns()
                }
            ],
            listeners: {
                afterrender: function () {
                    Ext.Ajax.request({
                        async: true,
                        url: apiBaseUrl + '/index.php/Purchasing/Buyer/getSupplierAndBuyer',
                        success: function (response) {
                            var text = Ext.decode(response.responseText);
                            res = text.data;
                            console.log(res, this);
                            var form = me.down("form");
                            form.down("combo[name=cu_name]").setStore(Ext.create('Ext.data.Store', {
                                fields: ['id', 'name'],
                                data: res.custom_company
                            }));
                            form.down("combo[name=cu_name]").setDisabled(false);
                            form.down("combo[name=logistics_no]").setStore(Ext.create('Ext.data.Store', {
                                fields: ['logistics_no'],
                                data: res.logistics_no
                            }));
                            form.down("combo[name=logistics_no]").setDisabled(false);
                        }
                    });
                }
            }
        });
        this.callParent();
    },
    getFieldItems: function (batch_no, order_no, next_status, is_last) {
        var fields = [
            {fieldLabel: '供货单号', name: 'supply_no', value: batch_no, editable: false},
            {fieldLabel: '采购单号', name: 'order_no', value: order_no, editable: false},
            {
                fieldLabel: '物流单号',
                name: 'logistics_no',
                editable: false,
                xtype: 'combo',
                disabled:true,
                displayField: 'logistics_no',
                valueField: 'logistics_no'
            },
            {
                fieldLabel: '报关公司',
                name: 'cu_name',
                editable: false,
                xtype: 'combo',
                displayField: 'name',
                valueField: 'name',
                disabled:true,
                listeners: {
                    change: function (obj) {
                        var items = obj.getStore().getData().items, company_id = obj.getValue();
                        Ext.Array.each(items, function (item) {
                            var id = item.get("name");
                            if (id == company_id) {
                                var form = obj.up("form");
                                form.down("textfield[name=cu_contaits]").setValue(item.get("contact"));
                                form.down("textfield[name=cu_tel]").setValue(item.get("phone"));
                                form.down("textarea[name=cu_address]").setValue(item.get("address"));
                                return;
                            }
                        });
                    }
                }
            },
            {fieldLabel: '报关公司联系人', name: 'cu_contaits', editable: false},
            {fieldLabel: '报关公司联系电话', name: 'cu_tel', editable: false},
            {xtype: 'hiddenfield', name: 'next_status', value: next_status},
            {xtype: 'hiddenfield', name: 'is_last_status', value: is_last},
            {fieldLabel: '报关公司联系地址', name: 'cu_address', xtype: 'textarea', editable: false,columnWidth:1}
        ];

        return fields;
    },
    getBtns: function () {
        var me = this;
        return [
            {
                text: '重置',
                handler: function () {
                    this.up('form').getForm().reset();
                }
            },
            {
                text: '提交',
                formBind: true,
                disabled: true,
                handler: function () {
                    var form = this.up('form').getForm();
                    if (form.isValid()) {
                        form.submit({
                            waitMsg: '正在保存...',
                            success: function (form, action) {
                                me.destroy();
                                console.log(action.result);
                            },
                            failure: function (form, action) {
                                console.log(action);
                                Ext.Msg.alert('失败', action.result.msg || "系统服务错误,请联系管理管理员!");
                            }
                        });
                    }
                }
            }
        ];
    }
});

