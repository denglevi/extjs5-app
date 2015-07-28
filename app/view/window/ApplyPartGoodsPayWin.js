/**
 * Created by Administrator on 2015-07-28.
 */
Ext.define('erp.view.window.ApplyPartGoodsPayWin', {
    extend:'Ext.window.Window',
    requires: [
        'Ext.data.Store',
        'Ext.data.StoreManager',
        'Ext.data.proxy.Ajax',
        'Ext.data.reader.Json',
        'Ext.form.action.Action',
        'Ext.form.field.ComboBox',
        'Ext.form.field.Date',
        'Ext.form.field.Display',
        'Ext.form.field.File',
        'Ext.form.field.Hidden',
        'Ext.form.field.Number',
        'Ext.form.field.Text',
        'Ext.form.field.TextArea',
        'Ext.layout.container.Column'
    ],
    xtype:'applypartgoodspaywin',
    //title: next_status.name,
    width: 550,
    modal: true,
    layout: 'fit',
    //status_id: order_info.order_status,
    //order_no: order_info.order_nos,
    //url: url,
    //total: total,

    initComponent:function(args){
        var me = this,order_info = me.order_info,next_status = me.next_status;
        me.items = [
            {
                xtype: 'form',
                bodyPadding: 10,
                method: 'POST',
                layout: 'column',
                defaults: {
                    margin: 5,
                    xtype: 'textfield',
                    columnWidth: 0.5,
                    labelAlign: 'right',
                    labelWidth: 90
                },
                url: apiBaseUrl + '/index.php/Purchasing/Buyer/applyPartGoodsPay',
                items: [
                    {
                        xtype: 'displayfield',
                        fieldLabel: '������',
                        value: order_info.order_nos,
                        columnWidth: 1
                    },
                    {
                        xtype:'hidden',
                        name: 'supplier',
                        value:4
                    },
                    //{
                    //    xtype: 'combo',
                    //    fieldLabel: '��Ӧ��',
                    //    name: 'supplier',
                    //    disabled: true,
                    //    displayField: 'name',
                    //    valueField: 'id_no',
                    //    editable: false
                    //},
                    //{
                    //    xtype: 'combo', fieldLabel: '����', name: 'buyer', disabled: true,
                    //    displayField: 'username',
                    //    valueField: 'id',
                    //    editable: false
                    //},
                    {
                        fieldLabel: '�տ˾',
                        name: 'receive_money_company'
                    },
                    {
                        fieldLabel: '��˾�˺�',
                        name: 'company_bank_no',
                    },
                    {
                        fieldLabel: '������',
                        name: 'company_open_bank',
                    },
                    {
                        fieldLabel: '������',
                        name: 'money',
                        value: me.total,
                        xtype: 'numberfield'
                    },
                    {
                        fieldLabel: '��󸶿�����',
                        name: 'last_pay_day',
                        xtype: 'datefield',
                        editable: false,
                        format: 'Y-m-d',
                        value: new Date()

                    },
                    {
                        fieldLabel: '��;',
                        name: 'pay_function',
                        xtype: 'textarea'
                    },
                    //{
                    //    fieldLabel: 'ѡ�񸶿���',
                    //    name: 'payer',
                    //    xtype: 'combo',
                    //    editable: false,
                    //    displayField: 'username',
                    //    valueField: 'id',
                    //    //queryMode:'local',
                    //    store: Ext.create('Ext.data.Store', {
                    //        //autoLoad:true,
                    //        fields: ['id', 'username'],
                    //        proxy: {
                    //            type: 'ajax',
                    //            url: apiBaseUrl + '/index.php/Purchasing/Buyer/getPayer',
                    //            reader: {
                    //                type: 'json',
                    //                rootProperty: 'data'
                    //            }
                    //        }
                    //    })
                    //},
                    {
                        xtype: 'filefield',
                        name: 'excel_file',
                        buttonText: '������Ʒ',
                        allowBlank: true,
                        listeners: {
                            change: function () {
                                var val = this.getValue();
                                this.up("form").getForm().submit({
                                    clientValidation: false,
                                    waitMsg: '���ڵ�����Ʒ��Ϣ...',
                                    url: apiBaseUrl + '/index.php/Purchasing/Buyer/importPurchaseOrderProduct',
                                    success: function (form, action) {
                                        var data = action.result.data;
                                        console.log(data);
                                        me.products = data;
                                        store = Ext.create('Ext.data.Store', {
                                            fields: ["style_no", "name", 'color', 'size', 'num', 'batch_price', 'total_price', 'retail_price'],
                                            data: data
                                        });
                                        //me.down("grid").setStore(store);
                                        Ext.toast("����ɹ�",'ϵͳ��ʾ');
                                    },
                                    failure: function (form, action) {
                                        switch (action.failureType) {
                                            case Ext.form.action.Action.CLIENT_INVALID:
                                                Ext.Msg.alert('ϵͳ��ʾ', '����֤����');
                                                break;
                                            case Ext.form.action.Action.CONNECT_FAILURE:
                                                Ext.Msg.alert('ϵͳ��ʾ', 'Զ�����Ӵ������Ժ�����');
                                                break;
                                            case Ext.form.action.Action.SERVER_INVALID:
                                                Ext.Msg.alert('ϵͳ��ʾ', action.result.msg);
                                        }
                                    }
                                });
                            }
                        }
                    }
                ],
                buttons: [
                    {
                        text: '����',
                        handler: function () {
                            this.up('form').getForm().reset();
                        }
                    },
                    {
                        text: '�ύ',
                        formBind: true,
                        disabled: true,
                        handler: function () {
                            console.log(store);
                            if (store == null || store.getData().length == 0) {
                                Ext.Msg.alert('ϵͳ��ʾ', "�뵼����Ʒ����");
                                return;
                            }
                            var data = store.data;
                            var form = this.up('form').getForm();
                            if (form.isValid()) {
                                form.submit({
                                    waitMsg: '�����ύ...',
                                    params: {
                                        products: Ext.encode(me.products),
                                        order_no: order_info.order_nos,
                                        status_id: order_info.order_status,
                                        pay_type:next_status.name
                                    },
                                    success: function (form, action) {
                                        Ext.toast("�ύ�ɹ�","ϵͳ��ʾ");
                                        console.log(action.result);
                                        win.destroy();
                                        var data = action.result.product;
                                        me.down("segmentedbutton").add({
                                            text:action.result.batch_no
                                        });
                                        var store = Ext.StoreManager.lookup("PurchaseOrderListStore");
                                        if (store != null) store.load();
                                    },
                                    failure: function (form, action) {
                                        console.log(action);
                                        Ext.Msg.alert('ʧ��', action.result.msg);
                                    }
                                });
                            }
                        }
                    }
                ]
            }
        ];
        me.listeners = {
            afterrender:function(){
                Ext.Ajax.request({
                    async:true,
                    method:'POST',
                    params:{
                        order_no:me.order_no
                    },
                    url:apiBaseUrl+'/index.php/Purchasing/buyer/getSupplierInfo',
                    success:function(res){
                        var json = Ext.decode(res.responseText);
                        if(!json.success){
                            Ext.alert("ϵͳ��ʾ",json.msg);
                            me.destroy();
                            return;
                        }
                        console.log(json.data);
                        var company = me.down("textfield[name=receive_money_company]"),
                            bank_no = me.down("textfield[name=company_bank_no]"),
                            bank_name = me.down("textfield[name=company_open_bank]");
                        company.setValue(json.data.name);
                        bank_no.setValue(json.data.bank_no);
                        bank_name.setValue(json.data.bank_name);

                        company.setDisabled(false);
                        bank_no.setDisabled(false);
                        bank_name.setDisabled(false);
                    },
                    failure:function(){
                        Ext.alert("ϵͳ��ʾ","�����������,������!");
                        me.destroy();
                    }
                });
            }
        };

        this.callParent(args);
    }
});