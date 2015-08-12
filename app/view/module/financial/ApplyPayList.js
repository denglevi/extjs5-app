/**
 * Created by Administrator on 2015-06-17.
 */
Ext.define('erp.view.module.financial.ApplyPayList', {
    extend: 'Ext.grid.Panel',
    xtype: 'applypaylist',

    requires: [
        'Ext.Ajax',
        'Ext.Array',
        'Ext.data.Store',
        'Ext.data.proxy.Ajax',
        'Ext.data.reader.Json',
        'Ext.form.field.Date',
        'Ext.form.field.Text',
        'Ext.toolbar.Paging',
        'erp.view.window.PayFormWin'
    ],

    initComponent: function () {
        var me = this;

        me.columns = [
            {
                text: '付款类型', dataIndex: 'pay_type', renderer: function (val) {
                if (val == "") return "采购付款";
                return val;
            }
            },
            {text: '付款申请人', dataIndex: 'applier_name', flex: 1},
            {text: '收款公司', dataIndex: 'receive_money_company', flex: 1},
            {text: '公司账号', dataIndex: 'company_bank_no', flex: 1},
            {text: '开户行', dataIndex: 'company_open_bank', flex: 1},
            {text: '付款金额', dataIndex: 'money'},
            {text: '用途', dataIndex: 'pay_function', flex: 2},
            {text: '最后付款日期', dataIndex: 'last_pay_day'},
            {text: '付款日期', dataIndex: 'pay_day'},
            {
                text: '状态', dataIndex: 'status', flex: 1, renderer: function (val) {
                if (val == 1) return "<b class='text-info'>已付款</b>";
                return "<b class='text-danger'>待付款</b>";
            }
            }
        ];
        me.store = Ext.create('Ext.data.Store', {
            autoLoad: true,
            fields: ['receive_money_company', 'company_bank_no', 'company_open_bank', 'money', 'pay_function', 'pay_function', "pay_type", "status"],
            proxy: {
                type: 'ajax',
                url: apiBaseUrl + '/index.php/Financial/Index/getApplyPayList',
                reader: {
                    type: 'json',
                    rootProperty: 'data',
                    totalProperty: 'total'
                }
            }
        });
        me.selModel = 'checkboxmodel';
        me.sortableColumns = false;
        me.listeners = {
            rowdblclick: function (gp, record) {
                var status = record.get("status"),
                    win = Ext.create('erp.view.window.PayFormWin', {status: status, record: record});
                win.show();
                win.on("beforedestroy", function () {
                    me.getStore().load();
                }, {
                    single: true
                });
            }
        }
        me.tbar = [
            {
                text: '删除',
                glyph: 0xf1f8,
                handler: function () {
                    var sel = me.getSelection(),
                        ids = [];
                    if (sel.length == 0) {
                        Ext.Msg.alert('系统提示', '请选择要删除的付款单');
                        return;
                    }
                    Ext.Array.each(sel, function (item) {
                        ids.push(item.get("id"));
                    });
                    Ext.Msg.show({
                        title: '系统消息',
                        message: '你确定要删除所选付款单吗？',
                        buttons: Ext.Msg.YESNO,
                        icon: Ext.Msg.QUESTION,
                        fn: function (btn) {
                            if (btn === 'yes') {
                                Ext.Ajax.request({
                                    url: apiBaseUrl + '/index.php/Financial/Index/deletePayOrder',
                                    waitMsg: '正在删除...',
                                    method: 'POST',
                                    params: {
                                        ids: ids.join(',')
                                    },
                                    success: function (data) {
                                        var res = Ext.decode(data.responseText);
                                        if (res.success) {
                                            me.getStore().load();
                                            return
                                        }

                                        Ext.Msg.alert('系统提示', res.msg);
                                    },
                                    failure: function (data) {
                                        Ext.Msg.alert('系统提示', "操作失败请重试!错误代码:" + data.status);
                                    }
                                })
                            }
                        }
                    });

                }
            }, '->',
            {
                xtype: 'textfield',
                fieldLabel: "收款公司",
                name: 'receive_money_company',
                labelAlign: 'right'
            },
            {
                xtype: 'datefield',
                fieldLabel: "付款日期",
                editable: false,
                name: 'start_date',
                format: 'Y-m-d',
                labelAlign: 'right'
            },
            {
                xtype: 'tbtext',
                html: '-'
            },
            {
                xtype: 'datefield',
                hideLabel: true,
                editable: false,
                name: 'end_date',
                format: 'Y-m-d'
            },
            {
                text: '搜索',
                glyph: 0xf002,
                handler: function () {
                    var grid = this.up("applypaylist"),
                        receive_money_company = grid.down("textfield[name=receive_money_company]").getValue(),
                    start_date = grid.down("datefield[name=start_date]").getValue(),
                    end_date = grid.down("datefield[name=end_date]").getValue(),
                        pt = grid.down("pagingtoolbar"),
                        store = grid.getStore();
                    store.setProxy({
                        type: 'ajax',
                        url: apiBaseUrl + '/index.php/Financial/Index/getApplyPayList',
                        extraParams: {
                            receive_money_company: receive_money_company,
                            start_date: start_date,
                            end_date: end_date
                        },
                        reader: {
                            type: 'json',
                            rootProperty: 'data',
                            totalProperty: 'total'
                        }
                    });
                    store.on("load", function () {
                        grid.down("textfield[name=receive_money_company]").reset();
                        grid.down("datefield[name=start_date]").reset();
                        grid.down("datefield[name=end_date]").reset();
                    });
                    pt.moveFirst();
                }
            }];
        me.bbar = ['->', {
            xtype: 'pagingtoolbar',
            store: me.store,
            displayInfo: true
        }];
        me.callParent();
    }
});