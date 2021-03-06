/**
 * Created by Administrator on 2015-06-23.
 */
Ext.define('erp.view.module.goods.GoodsMenu', {
    extend: 'Ext.grid.Panel',
    xtype: 'goodsmenu',
    requires: [
        'Ext.data.reader.Json',
        'Ext.form.field.Text',
        'Ext.grid.column.Action',
        'Ext.toolbar.Fill',
        'Ext.toolbar.Paging',
        'erp.view.module.goods.GoodsController',
        'erp.view.module.goods.GoodsModel'
    ],
    viewModel: {
        type: 'goods'
    },
    controller: 'goods',
    //initComponent:function(){
    //    var me = this;
    //    Ext.apply(me,{
    //
    //    });
    //
    //    me.callParent();
    //},
    selModel: 'checkboxmodel',   //选择框
    title: '商品目录',
    width: '100%',
    height: '100%',
    border: true,
    sortableColumns: false,
    tbar: [
        {
            text: '导入',
            iconCls:'importIcon',
            handler: 'importGoodsMenu'
        },
        //{
        //    text: '删除',
        //    iconCls:'delIcon',
        //    handler: 'deleteGoodsMenu'
        //},
        {
            text: '导出',
            iconCls:'exportIcon',
            handler: 'exportGoodsMenu'
        }, '->',
        {
            xtype: 'textfield',
            fieldLabel: "系统款号",
            name: 'system_style_no',
            labelAlign:'right'
        },
        {
            xtype: 'textfield',
            fieldLabel: "供应商款号",
            name: 'supply_style_no',
            labelAlign:'right'
        },
        {
            text: '搜索',
            //glyph: 0xf002,
            iconCls:'searchIcon',
            handler: "searchMenu"
        }],
    store: 'GoodsMenuStore',
    bbar: ['->', {
        xtype: 'pagingtoolbar',
        store: 'GoodsMenuStore',
        displayInfo: true
    },{
        xtype: 'combo',
        displayField: 'text',
        valueField: 'val',
        width:60,
        editable:false,
        hideLabel: true,
        store: Ext.create("Ext.data.Store", {
            fields: [],
            data: [
                {text: 25, val: 25},
                {text: 50, val: 50},
                {text: 75, val: 75},
                {text: 100, val: 100},
            ]
        }),
        value: 25,
        listeners:{
            change:function(obj){
                var store = Ext.StoreManager.lookup("GoodsMenuStore");
                if(store != null){
                    store.setPageSize(obj.getValue());
                    store.load();
                }
            }
        }
    }],
    columns: [
        {text: '系统款号', dataIndex: 'system_style_no', flex: 2},
        {text: '供应商款号', dataIndex: 'supply_style_no', flex: 2},
        {text: '中文名字', dataIndex: 'name_zh', flex: 1},
        {text: '大类', dataIndex: 'large_class', flex: 1},
        {text: '季节', dataIndex: 'year_season', flex: 1},
        {text: '品牌', dataIndex: 'brand'},
        {text: '小类名称', dataIndex: 'small_class'},
        {text: '性别', dataIndex: 'sex'},
        {text: '执行标准', dataIndex: 'execute_standard'},
        {text: '安全级别', dataIndex: 'safety_level'},
        {text: '数量', dataIndex: 'num'},
        {text: '零售价', dataIndex: 'retail_price'},
        {
            text: '操作',
            xtype: 'actioncolumn',
            flex: 1,
            items: [
                {
                    iconCls: 'viewIcon columnAction',
                    tooltip: '查看',
                    handler: "viewGoodsMenu"
                },
                {
                    iconCls: 'editIcon columnAction',
                    tooltip: '修改',
                    handler: "editGoodsMenu"
                }
            ]
        }
    ],
    listeners: {
        afterrender: function () {
            this.getStore().load();
        }
        //rowdblclick: 'onGoodsMenuGridDblClick'
    }
});
