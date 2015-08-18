/**
 * Created by Administrator on 2015-08-07.
 */
Ext.define('erp.view.module.operation.CouponSort',{  //本页面路径
    extend:'Ext.grid.Panel',
    xtype:'coupon_sort', //本页面别名

    requires: [
        'Ext.grid.column.Action',
        'erp.view.module.operation.CouponSortController' //加载控制器路径
    ],
    initComponent:function(){
        var me = this;
        me.callParent();
    },
    controller:"couponsort", //加载本页面的控制器 CouponSortController.js 的别名
    tbar:[ //页面头部
        {text:'新增',iconCls:'addIcon',handler:"addCouponSortType"},
        {text:'删除',iconCls:'delIcon',handler:"delCouponSortInfo"},
        //{text:'修改',iconCls:'editIcon',handler:"editVIPCardType"}
    ],
    sortableColumns:false,
    selModel:'checkboxmodel',
    columns:[
        {text:'名称',dataIndex:'sort_name',flex:1},
        {text:'金额',dataIndex:'sort_money',flex:1},
        {text:'指定张数',dataIndex:'sort_num',flex:1},
        {text:'品牌',dataIndex:'sort_brand',flex:1},
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
    store:"CouponSortList",
    listeners:{
        afterrender:function(){
            this.getStore().load();
        }
    }
});