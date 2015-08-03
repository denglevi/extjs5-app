/**
 * Created by Administrator on 2015-08-03.
 */
Ext.define('erp.view.module.system.AuthorityMng', {
    extend: 'Ext.grid.Panel',
    xtype: 'authoritymng',

    requires: [
        'Ext.grid.column.Action',
        'Ext.toolbar.Fill',
        'Ext.toolbar.Paging'
    ],

    initComponent: function (args) {
        var me = this;

        Ext.apply(me, {
            tbar: [
                {text: '新增', iconCls: 'addIcon'}
            ],
            sortableColumns: false,
            enableColumnHide: false,
            columns: [
                {text: '权限名', dataIndex: 'name', flex: 1},
                {text: '权限标示', dataIndex: 'action', flex: 1},
                {text: '所属模块', dataIndex: 'module_name', flex: 1},
                {text: '描述', dataIndex: 'description', flex: 1},
                {text: '创建时间', dataIndex: 'update_time', flex: 1},
                {text: '更新时间', dataIndex: 'update_time', flex: 1},
                {
                    text: '操作',
                    xtype: 'actioncolumn',
                    flex: 1,
                    items: [
                        {
                            iconCls: 'delIcon columnAction',
                            tooltip: '删除',
                            handler: "viewCustomerInfo"
                        },
                        {
                            iconCls: 'editIcon columnAction',
                            tooltip: '修改',
                            handler: "editCustomer"
                        }
                    ]
                }
            ],
            bbar: ['->', {
                xtype: 'pagingtoolbar',
                store: 'AuthorityStore',
                displayInfo: true
            }],
            store: 'AuthorityStore',
            listeners: {
                afterrender: function () {
                    this.getStore().load();
                }
            }
        });
        this.callParent(args);
    },

});