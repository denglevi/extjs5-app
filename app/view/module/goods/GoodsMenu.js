/**
 * Created by Administrator on 2015-06-23.
 */
Ext.define('erp.view.module.goods.GoodsMenu', {
    extend: 'Ext.grid.Panel',
    xtype: 'goodsmenu',
    requires: [
        'Ext.form.field.Text',
        'Ext.toolbar.Paging',
        'erp.view.module.goods.GoodsController',
        'erp.view.module.goods.GoodsModel'
    ],
    viewModel: {
        type: 'goods'
    },
    controller: 'goods',
    selModel: 'checkboxmodel',   //选择框
    title: '商品目录',
    width: '100%',
    height: '100%',
    border: true,
    sortableColumns: false,
    tbar: [
        {
            text: '导入商品目录',
            glyph: 0xf067,
            handler: 'importGoodsMenu'
        },
        {
            text: '删除',
            glyph: 0xf1f8,
            handler: 'deleteGoodsMenu'
        }, '->',
        {
            xtype: 'textfield',
            fieldLabel: "系统款号",
            name: 'system_style_no'
        },
        {
            text: '搜索',
            glyph: 0xf002
        }],
    store: 'GoodsMenuStore',
    bbar: ['->', {
        xtype: 'pagingtoolbar',
        store: 'GoodsMenuStore',
        emptyMsg: '<b>暂无记录</b>',
        displayMsg: '显示 {0} - {1} 总共 {2} 条记录',
        displayInfo: true
    }],
    columns: [
        {text: '系统款号', dataIndex: 'system_style_no', flex: 2},
        {text: '供应商款号', dataIndex: 'supply_style_no', flex: 2},
        {text: '中文名字', dataIndex: 'name_zh', flex: 1},
        {text: '大类', dataIndex: 'large_class', flex: 1},
        {text: '年季', dataIndex: 'year_season', flex: 1},
        {text: '品牌', dataIndex: 'brand'},
        {text: '中类代码', dataIndex: 'middle_class'},
        {text: '小类名称', dataIndex: 'small_class'},
        {text: '性别', dataIndex: 'sex'},
        {text: '执行标准', dataIndex: 'execute_standard'},
        {text: '安全级别', dataIndex: 'safety_level'},
        {text: '数量', dataIndex: 'num'},
        {text: '零售价', dataIndex: 'retail_price'}
    ],
    listeners: {
        afterrender: function () {
            this.getStore().load();
        },
        rowdblclick: 'onGoodsMenuGridDblClick'
    }
});
