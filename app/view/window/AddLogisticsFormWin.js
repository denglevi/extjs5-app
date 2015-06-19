/**
 * Created by Administrator on 2015-06-18.
 */
Ext.define('erp.view.window.AddLogisticsFormWin', {
    extend: 'Ext.window.Window',
    xtype: 'addlogisticsformwin',
    requires: [
        'Ext.Ajax',
        'Ext.data.Store',
        'Ext.form.Panel',
        'Ext.form.RadioGroup',
        'Ext.form.field.ComboBox',
        'Ext.form.field.Date',
        'Ext.form.field.Text',
        'Ext.form.field.TextArea',
        'Ext.layout.container.Column',
        'Ext.layout.container.Fit'
    ],
    layout: 'fit',
    bodyPadding: 10,
    initComponent: function () {
        var me = this;
        Ext.apply(me, {
            items: [
                {
                    xtype: 'form',
                    url: apiBaseUrl + '/Purchasing/Logistics/addLogisticsOrder',
                    method: 'POST',
                    width: 600,
                    layout: 'column',
                    defaults: {
                        anchor: '100%',
                        xtype: 'textfield',
                        allowBlank: false,
                        disabled: false,
                        margin: 10,
                        columnWidth: 0.5
                    },
                    items: this.getFieldItems(me.batch_no,me.order_no),
                    buttons: this.getBtns(me.need_notice)
                }
            ],
            listeners: {
                afterrender: function(){
                    Ext.Ajax.request({
                        async: true,
                        url: apiBaseUrl + '/index.php/Purchasing/Buyer/getSupplierAndBuyer',
                        success: function (response) {
                            var text = Ext.decode(response.responseText);
                            res = text.data;
                            console.log(res, this);
                            var form = me.down("form");
                            form.down("combo[name=supplier_id]").setStore(Ext.create('Ext.data.Store', {
                                fields: ['id_no', 'name'],
                                data: res.supplier
                            }));
                            form.down("combo[name=logistics_company]").setStore(Ext.create('Ext.data.Store', {
                                fields: ['id', 'name'],
                                data: res.logistics_company
                            }));
                        }
                    });
                }
            }
        });
        this.callParent();
    },
    getFieldItems: function (batch_no,order_no) {
        var fields = [
            {fieldLabel: '发货日期', name: 'date', xtype: 'datefield', format: 'Y-m-d', value: new Date(),},
            {fieldLabel: '供应商', name: 'supplier_id',editable:false, xtype: 'combo',displayField: 'name',valueField: 'id_no'},
            {fieldLabel: '供货单号', name: 'batch_no',value:batch_no,editable:false},
            {fieldLabel: '采购单号', name: 'order_no',value:order_no,editable:false},
            {fieldLabel: '物流单号', name: 'logistics_no'},
            {fieldLabel: '物流公司', name: 'logistics_company',editable:false, xtype: 'combo',displayField: 'name',valueField: 'id'},
            {fieldLabel: '联系人', name: 'contact'},
            {fieldLabel: '手机', name: 'mobile_phone'},
            {
                xtype: 'radiogroup',
                fieldLabel: '物流类型',
                columnWidth: 1,
                items: [
                    {boxLabel: '国内陆运', name: 'logistics_type', inputValue: '1'},
                    {boxLabel: '国内空运', name: 'logistics_type', inputValue: '2'},
                    {boxLabel: '国际空运', name: 'logistics_type', inputValue: '3'},
                    {boxLabel: '国际海运', name: 'logistics_type', inputValue: '4'}
                ]
            },
            {fieldLabel: '发货地址', name: 'logistics_send_address', xtype: 'textarea'},
            {fieldLabel: '收货地址', name: 'logistics_receive_address', xtype: 'textarea'}
        ];

        return fields;
    },
    getBtns: function (need_notice) {
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
                            params:{
                              need_notice:need_notice,
                                batch_no:'',
                                order_no:'',
                                supplier_id:''
                            },
                            waitMsg: '正在保存物流单...',
                            success: function (form, action) {
                                console.log(action.result);
                            },
                            failure: function (form, action) {
                                console.log(action);
                                Ext.Msg.alert('失败', action.result.msg||"系统服务错误,请联系管理管理员!");
                            }
                        });
                    }
                }
            }
        ];
    }
});
