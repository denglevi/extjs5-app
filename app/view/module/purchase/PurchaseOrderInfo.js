/**
 * Created by denglevi on 15-6-14.
 */
Ext.define('erp.view.module.purchase.PurchaseOrderInfo', {
    extend: 'Ext.container.Container',
    xtype: 'purchaseorderinfo',

    requires: [
        'Ext.Ajax',
        'Ext.container.Container',
        'Ext.data.Store',
        'Ext.grid.Panel',
        'Ext.tab.Panel',
        'Ext.toolbar.Paging'
    ],
    initComponent: function () {
        var me = this,res;
        //var myMask = new Ext.LoadMask({target:Ext.getBody(),msg:"请稍等,正在获取数据..."});
        //myMask.show();
        Ext.Ajax.request({
            async:false,
            url: 'http://localhost/coscia/index.php/Purchasing/Buyer/getPurchaseOrderInfo',
            params: {
                id: me.order_id
            },
            success: function(response){
                //myMask.destroy( );
                var text = Ext.decode(response.responseText);
                res = text.data;
            }
        });

        console.log(res);
        me.layout = 'anchor';
        me.items = [
            {
                xtype: 'container',
                margin:'30 30 50 30',
                data: res.status,
                tpl: new Ext.XTemplate(
                    '<div class="status">',
                    '<tpl for=".">',
                    '<div style="float: left;margin-right: -28px;">',
                    '<span class="dot blue red green"></span>',
                    '<span class="line red green"></span><br>',
                    '<span class="text">{name}</span>',
                    '</div>',
                    '</tpl>',
                    '</div>'
                )
            },
            {
                xtype:'container',
                data:res.order_info,
                tpl:new Ext.XTemplate(
                    '<div class="col-md-12">',
                    '<div class="col-md-2"><div class="form-group"><label class="control-label col-md-7">日期：</label><div class="col-md-5">{order_time}</div> </div></div>',
                    '<div class="col-md-2"><div class="form-group"><label class="control-label col-md-7">供应商：</label><div class="col-md-5">{vendor_name}</div> </div></div>',
                    '<div class="col-md-2"><div class="form-group"><label class="control-label col-md-7">订单号：</label><div class="col-md-5">{order_nos}</div> </div></div>',
                    '<div class="col-md-2"><div class="form-group"><label class="control-label col-md-7">买手：</label><div class="col-md-5">{username}</div> </div></div>',
                    '<div class="col-md-2"><div class="form-group"><label class="control-label col-md-7">订单类型：</label><div class="col-md-5">{order_state}</div> </div></div>',
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
                            {text: '颜色', dataIndex: 'orderinfo_color'},
                            {text: '尺码', dataIndex: 'size'},
                            {text: '数量', dataIndex: 'num'},
                            {text: '批发价', dataIndex: 'batch_price'},
                            {text: '总价', dataIndex: 'total_price'},
                            {text: '官方零售价', dataIndex: 'retail_price'}
                        ],
                        bbar: ['->', {
                            xtype: 'pagingtoolbar',
                            store: null,
                            store:Ext.create('Ext.data.Store',{
                                fields:[],
                                data:res.product_info
                            }),
                            emptyMsg: '<b>暂无记录</b>',
                            displayMsg: '显示 {0} - {1} 总共 {2} 条记录',
                            displayInfo: true
                        }],
                        store: Ext.create('Ext.data.Store',{
                            fields:[],
                            data:res.product_info
                        })
                    },
                    {
                        title: '操作日志',
                        xtype: 'grid',
                        height: '100%',
                        sortableColumns:false,
                        columns: [
                            {text: '日期', dataIndex: 'time'},
                            {text: '操作', dataIndex: 'name',flex:1},
                            {text: '操作人', dataIndex: 'username',flex:1}
                        ],
                        store: Ext.create('Ext.data.Store',{
                            fields:[],
                            data:res.log
                        })
                    }
                ],
                listeners:{

                }
            }
        ];

        me.callParent();
    }
});