/**
 * Created by Administrator on 2015-07-13.
 */
Ext.define('erp.view.module.member.VIPMng', {
    extend: 'Ext.grid.Panel',
    xtype: 'vipmng',

    requires: [
        'Ext.grid.column.Action',
        'erp.view.module.member.VIPController'
    ],
    controller:'vip',
    initComponent: function () {
        var me = this;
        me.callParent();
    },
    tbar: [
        {text: '删除', iconCls: 'delIcon',handler:'delVIP'}
    ],
    selModel: 'checkboxmodel',
    columns: [
        {text: '会员卡号', dataIndex: 'card_no', flex: 1},
        {text: '会员姓名', dataIndex: 'customer_name'},
        {text: '会员类型', dataIndex: 'member_name', flex: 1},
        {text: '性别', dataIndex: 'customer_sex', flex: 1},
        {text: '生日', dataIndex: 'customer_birthday', flex: 1},
        {text: '年代', dataIndex: 'customer_age', flex: 1},
        {text: '手机号', dataIndex: 'customer_phone', flex: 1},
        {text: '消费总金额', dataIndex: 'numbers_money', flex: 1},
        {text: '最近消费日期', dataIndex: 'numbers_time', flex: 1},
        {text: '备注', dataIndex: 'card_remarks', flex: 1},
        {
            text: '操作',
            xtype: 'actioncolumn',
            flex: 1,
            items: [
                {
                    iconCls: 'viewIcon columnAction',
                    tooltip: '查看',
                    handler: "viewVIPInfo"
                },
                {
                    iconCls: 'editIcon columnAction',
                    tooltip: '修改',
                    handler: "editVIP"
                }
            ]
        }
    ],
    store: "VIPListStore",
    listeners: {
        afterrender: function () {
            this.getStore().load();
        }
    }
});