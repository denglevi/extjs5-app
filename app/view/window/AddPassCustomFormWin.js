/**
 * Created by Administrator on 2015-08-26.
 */
Ext.define('erp.view.window.AddPassCustomFormWin', {
    extend: 'Ext.window.Window',
    xtype: 'addpasscustomformwin',
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
        var next_status_id = 0;
        Ext.apply(me, {
            items: [
                {
                    xtype: 'form',
                    url: apiBaseUrl + '/index.php/Purchasing/Customs/addPassCustomOrderByBatchNo',
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
                        labelAlign: 'right',
                        labelWidth: 120
                    },
                    items: this.getFieldItems(me.batch_no, me.order_no),
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
                            var batchs = res.batch_nos;
                            form.down("combo[name=cu_name]").setDisabled(false);
                            var batch_nos = [];
                            console.log(batchs);
                            if(batchs == null) return;
                            if(batchs.length == 0) {
                                form.down("checkboxgroup").setHtml("没有需要报关的商品");
                                return;
                            }
                            for(var i=0;i<batchs.length;i++){
                                var batch_no = batchs[i];
                                batch_nos.push({boxLabel: batch_no.batch_no, name: 'batch_no[]', inputValue: batch_no.batch_no});
                            }
                            form.down("checkboxgroup").add(batch_nos);
                        }
                    });
                }
            }
        });
        this.callParent();
    },
    getFieldItems: function (batch_no, order_no) {
        var fields = [
            {
                fieldLabel: '报关公司',
                name: 'cu_name',
                editable: false,
                xtype: 'combo',
                displayField: 'name',
                valueField: 'name',
                disabled: true,
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
            {fieldLabel: '报关公司联系地址', name: 'cu_address', xtype: 'textarea', editable: false, columnWidth: 1},
            {
                xtype: 'checkboxgroup',
                fieldLabel: '供货单号',
                columnWidth:1,
                name: 'supply_no',
                layout:'column',
                defaults:{
                  margin:'0 50 0 0'
                }
            }
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
                    //console.log(form.getValues());return;
                    if (form.isValid()) {
                        form.submit({
                            waitMsg: '正在提交...',
                            success: function (form, action) {
                                var store = Ext.StoreManager.lookup("PassCustomListStore");
                                if(store != null) store.load();
                                me.destroy();
                                //me.fireEvent("addPassCustomsOrder");
                                //console.log(action.result);
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