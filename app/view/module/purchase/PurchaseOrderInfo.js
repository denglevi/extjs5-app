/**
 * Created by denglevi on 15-6-14.
 */
Ext.define('erp.view.module.purchase.PurchaseOrderInfo', {
    extend: 'Ext.container.Container',
    xtype: 'purchaseorderinfo',

    requires: [
        'Ext.container.Container',
        'Ext.data.Store',
        'Ext.grid.Panel',
        'Ext.tab.Panel'
    ],
    initComponent: function () {
        var me = this;
        me.layout = 'anchor';
        me.items = [
            {
                xtype: 'container',
                margin:'30 30 50 30',
                data: [{name: 'xxxx'},{name: 'xxxx'},{name: 'xxxx'},{name: 'xxxx'},{name: 'xxxx'}],
                tpl: new Ext.XTemplate(
                    '<div class="status">',
                    '<tpl for=".">',
                    '<div style="float: left;margin-right: -28px;">',
                    '<span class="dot blue red green"></span>',
                    '<span class="line red green"></span>',
                    '<span class="text">{name}</span>',
                    '</div>',
                    '</tpl>',
                    '</div>'
                )
            },
            {
                xtype:'container',
                data:{date:'',supplier:'',no:'',buyer:'',type:''},
                tpl:new Ext.XTemplate(
                    '<div class="col-md-12">',
                    '<div class="col-md-2"><div class="form-group"><label class="control-label">日期：</label><div class="">{date}</div> </div></div>',
                    '<div class="col-md-3"><div class="form-group"><label class="control-label">供应商：</label><div class="">{supplier}</div> </div></div>',
                    '<div class="col-md-3"><div class="form-group"><label class="control-label">订单号：</label><div class="">{no}</div> </div></div>',
                    '<div class="col-md-2"><div class="form-group"><label class="control-label">买手：</label><div class="">{buyer}</div> </div></div>',
                    '<div class="col-md-2"><div class="form-group"><label class="control-label">订单类型：</label><div class="">{type}</div> </div></div>',
                    '</div>'
                )
            },
            {
                xtype: 'tabpanel',
                width: '100%',
                height: '100%',
                items: [
                    {
                        title: '商品信息',
                        xtype: 'grid',
                        height: '100%',
                        sortableColumns:false,
                        columns: [
                            {text: '国际款号', dataIndex: 'style_no', flex: 1},
                            {text: '商品名称', dataIndex: 'name'},
                            {text: '颜色', dataIndex: 'color'},
                            {text: '尺码', dataIndex: 'size'},
                            {text: '数量', dataIndex: 'num'},
                            {text: '批发价', dataIndex: 'batch_price'},
                            {text: '总价', dataIndex: 'total_price'},
                            {text: '官方零售价', dataIndex: 'retail_price'}
                        ],
                        store: Ext.create('Ext.data.Store', {
                            fields: ["style_no", "name", 'color', 'size', 'num', 'batch_price', 'total_price', 'retail_price'],
                            autoLoad: true,
                            data: [
                                {
                                    style_no: 'xxx',
                                    name: 'xxx',
                                    color: 'xxx',
                                    size: 'xxx',
                                    num: 'xxx',
                                    batch_price: 'xxx',
                                    total_price: 'xxx',
                                    retail_price: 'xxx'
                                },
                                {
                                    style_no: 'xxx',
                                    name: 'xxx',
                                    color: 'xxx',
                                    size: 'xxx',
                                    num: 'xxx',
                                    batch_price: 'xxx',
                                    total_price: 'xxx',
                                    retail_price: 'xxx'
                                },
                                {
                                    style_no: 'xxx',
                                    name: 'xxx',
                                    color: 'xxx',
                                    size: 'xxx',
                                    num: 'xxx',
                                    batch_price: 'xxx',
                                    total_price: 'xxx',
                                    retail_price: 'xxx'
                                },
                                {
                                    style_no: 'xxx',
                                    name: 'xxx',
                                    color: 'xxx',
                                    size: 'xxx',
                                    num: 'xxx',
                                    batch_price: 'xxx',
                                    total_price: 'xxx',
                                    retail_price: 'xxx'
                                },
                                {
                                    style_no: 'xxx',
                                    name: 'xxx',
                                    color: 'xxx',
                                    size: 'xxx',
                                    num: 'xxx',
                                    batch_price: 'xxx',
                                    total_price: 'xxx',
                                    retail_price: 'xxx'
                                },
                                {
                                    style_no: 'xxx',
                                    name: 'xxx',
                                    color: 'xxx',
                                    size: 'xxx',
                                    num: 'xxx',
                                    batch_price: 'xxx',
                                    total_price: 'xxx',
                                    retail_price: 'xxx'
                                },
                                {
                                    style_no: 'xxx',
                                    name: 'xxx',
                                    color: 'xxx',
                                    size: 'xxx',
                                    num: 'xxx',
                                    batch_price: 'xxx',
                                    total_price: 'xxx',
                                    retail_price: 'xxx'
                                },
                                {
                                    style_no: 'xxx',
                                    name: 'xxx',
                                    color: 'xxx',
                                    size: 'xxx',
                                    num: 'xxx',
                                    batch_price: 'xxx',
                                    total_price: 'xxx',
                                    retail_price: 'xxx'
                                }
                            ]
                        })
                    },
                    {
                        title: '操作日志',
                        xtype: 'grid',
                        height: '100%',
                        sortableColumns:false,
                        columns: [
                            {text: '日期', dataIndex: 'style_no'},
                            {text: '操作', dataIndex: 'name',flex:1},
                            {text: '操作人', dataIndex: 'color',flex:1}
                        ],
                        store: Ext.create('Ext.data.Store', {
                            fields: ["style_no", "name", 'color', 'size', 'num', 'batch_price', 'total_price', 'retail_price'],
                            autoLoad: true,
                            data: [
                                {
                                    style_no: 'xxx',
                                    name: 'xxx',
                                    color: 'xxx'
                                },
                                {
                                    style_no: 'xxx',
                                    name: 'xxx',
                                    color: 'xxx'
                                },
                                {
                                    style_no: 'xxx',
                                    name: 'xxx',
                                    color: 'xxx'
                                },
                                {
                                    style_no: 'xxx',
                                    name: 'xxx',
                                    color: 'xxx'
                                },
                                {
                                    style_no: 'xxx',
                                    name: 'xxx',
                                    color: 'xxx'
                                },
                                {
                                    style_no: 'xxx',
                                    name: 'xxx',
                                    color: 'xxx'
                                },
                                {
                                    style_no: 'xxx',
                                    name: 'xxx',
                                    color: 'xxx'
                                },
                                {
                                    style_no: 'xxx',
                                    name: 'xxx',
                                    color: 'xxx'
                                }
                            ]
                        })
                    }
                ]
            }
        ];

        me.callParent();
    }
});