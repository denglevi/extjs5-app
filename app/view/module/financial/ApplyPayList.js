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
                text: '付款类型', dataIndex: 'pay_type', renderer: function () {
                return "采购付款";
            }
            },
            {text: '收款公司', dataIndex: 'receive_money_company', flex: 1},
            {text: '公司账号', dataIndex: 'company_bank_no', flex: 1},
            {text: '开户行', dataIndex: 'company_open_bank', flex: 1},
            {text: '付款金额', dataIndex: 'money'},
            {text: '用途', dataIndex: 'pay_function', flex: 2},
            {text: '最后付款日期', dataIndex: 'last_pay_day'},
            {text: '付款日期', dataIndex: 'pay_day'},
            {text: '状态', dataIndex: 'status', flex: 1,renderer:function(val){
                if(val == 1) return "已付款";
                return "待付款";
            }}
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
                    win = Ext.create('erp.view.window.PayFormWin',{status:status,record:record});
                win.show();
                win.on("beforedestroy",function(){
                    me.getStore().load();
                });
            }
        }
        me.tbar = [
            {
                text: '删除',
                glyph: 0xf1f8,
                handler:function(){
                    var sel = me.getSelection(),
                        ids = [];
                    if(sel.length == 0){
                        Ext.Msg.alert('系统提示', '请选择要删除的付款单');
                        return;
                    }
                    Ext.Array.each(sel,function(item){
                       ids.push(item.get("id"));
                    });
                    Ext.Msg.show({
                        title:'系统消息',
                        message: '你确定要删除所选付款单吗？',
                        buttons: Ext.Msg.YESNO,
                        icon: Ext.Msg.QUESTION,
                        fn: function(btn) {
                            if (btn === 'yes') {
                                Ext.Ajax.request({
                                    url:apiBaseUrl+'/index.php/Financial/Index/deletePayOrder',
                                    waitMsg:'正在删除...',
                                    method:'POST',
                                    params:{
                                        ids:ids.join(',')
                                    },
                                    success:function(data){
                                        var res = Ext.decode(data.responseText);
                                        if(res.success){
                                            me.getStore().load();
                                            return
                                        }

                                        Ext.Msg.alert('系统提示', res.msg);
                                    },
                                    failure:function(data){
                                        Ext.Msg.alert('系统提示', "操作失败请重试!错误代码:"+data.status);
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
                name: 'receive_money_company'
            },
            {
                xtype: 'datefield',
                fieldLabel: "付款日期",
                editable:false,
                name: 'date'
            },
            {
                text: '搜索',
                glyph: 0xf002
            }];
        me.bbar = ['->', {
            xtype: 'pagingtoolbar',
            store: me.store,
            displayInfo: true
        }];
        me.callParent();
    }
});