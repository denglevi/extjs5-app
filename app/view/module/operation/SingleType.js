/**
 * Created by Administrator on 2015-08-17.
 */
Ext.define('erp.view.module.operation.SingleType',{  //本页面路径
    extend:'Ext.grid.Panel',
    xtype:'single_type', //本页面别名

    requires: [
        'Ext.grid.column.Action',
        'erp.view.module.operation.GiftController'
    ],
    controller:"gift", //加载本页面的控制器 CouponSortController.js 的别名
    initComponent:function(){
        var me = this;
        me.callParent();
    },
    tbar:[ //页面头部
        {text:'新增',iconCls:'addIcon',handler:"addSingleInfo"},
        {text:'删除',iconCls:'delIcon',handler:"delSingleInfo"},
        //{text:'修改',iconCls:'editIcon',handler:"editVIPCardType"}
    ],
    sortableColumns:false,
    selModel:'checkboxmodel',
    columns:[
        {text:'编号',dataIndex:'single_no',flex:1},
        {text:'日期',dataIndex:'single_time',flex:1},
        {text:'类别',dataIndex:'sort_name',flex:1},
        {text:'有效日',dataIndex:'single_upto',flex:1},
        {text:'组织',dataIndex:'shops_name',flex:1},
        {text:'激活方式',dataIndex:'single_activate',flex:1},
        {text:'状态',dataIndex:'single_status',flex:1},
        {text:'作废',dataIndex:'single_cancel',flex:1},
        {
            text: '操作',
            xtype: 'actioncolumn',
            flex: 1,
            items: [
                //{
                //    iconCls: 'viewIcon columnAction',
                //    tooltip: '查看',
                //    handler: "viewVIPInfo"
                //},
                {
                    iconCls: 'editIcon columnAction',
                    tooltip: '修改',
                    handler: "editCouponSortType"
                }
            ]
        }
    ],
    store:"SingleList",
    listeners:{
        afterrender:function(){
            this.getStore().load();
        },
        rowdblclick: "omSingleDetailsInfo"
    }
});