/**
 * Created by Administrator on 2015-06-19.
 */
Ext.define('erp.view.module.purchase.CheckProductOrderInfo', {
    extend: 'Ext.container.Container',
    xtype: 'checkproductorderinfo',

    requires: [
        'Ext.Ajax',
        'Ext.data.Store',
        'Ext.grid.Panel',
        'Ext.panel.Panel',
        'Ext.tab.Panel'
    ],
    initComponent: function () {
        var me = this;
        var data = {
            create_time:this.record.get("date"),
            vendor_name:this.record.get("name"),
            order_no:this.record.get("order_no"),
            batch_no:this.record.get("batch_no"),
            nickname:this.record.get("nickname"),
            mark:this.record.get("mark"),
            id:this.record.get("id")
        }
        me.layout = 'vbox';
        me.items = [
            {
                xtype:'panel',
                data:data,
                width:'100%',
                itemId:'check_product_info',
                margin:'30,10,20,10',
                tpl:new Ext.XTemplate(
                    '<div class="col-md-12">',
                    '<div class="col-md-2">日期：{create_time}</div>',
                    '<div class="col-md-3">供应商：{vendor_name}</div>',
                    '<div class="col-md-2">订单号：{order_no}</div>',
                    '<div class="col-md-3">供应单号：{batch_no}</div>',
                    '<div class="col-md-2">买手：{nickname}</div>',
                    '</div>',
                    '<div class="col-md-12">',
                    '<div class="col-md-2">总箱数：{box_num}</div>',
                    '<div class="col-md-3">总件数：{num}</div>',
                    '<div class="col-md-2">总金额：{total_price}</div>',
                    '<div class="col-md-5">备注：{mark}</div>',
                    '</div>'
                )
            },
            {
                xtype: 'tabpanel',
                width: '100%',
                flex:1,
                items: [
                    {
                        title: '商品信息',
                        xtype: 'grid',
                        scrollable:'y',
                        sortableColumns:false,
                        columns: [
                            {text: '装箱单号', dataIndex: 'packing_no', flex: 1},
                            {text: '品牌', dataIndex: 'brand'},
                            {text: '国际款号', dataIndex: 'style_no',flex:1},
                            {text: '名称', dataIndex: 'product_name'},
                            {text: '颜色', dataIndex: 'color'},
                            {text: '尺码', dataIndex: 'size'},
                            {text: '性别', dataIndex: 'sex'},
                            {text: '产地', dataIndex: 'origin'},
                            {text: '材质', dataIndex: 'material'},
                            {text: '数量', dataIndex: 'num'},
                            {text: '箱号', dataIndex: 'box_no'},
                            {text: '单价', dataIndex: 'unit_price'},
                            {text: '总价', dataIndex: 'total_price'}
                        ],
                        listeners:{
                            afterrender:function(gp){
                                Ext.Ajax.request({
                                    async:true,
                                    url: apiBaseUrl+'/index.php/Purchasing/CheckProduct/getCheckProductOrderProduct',
                                    params: {
                                        id:data.id
                                    },
                                    success: function(response){
                                        var text = Ext.decode(response.responseText);
                                        if(text.data == null) return;
                                        var goods = text.data,len = goods.length,num= 0,box_num='',diff = text.diff,total_price=0;
                                        for(var i=0;i<len;i++){
                                            total_price += parseFloat(goods[i].total_price||0);
                                            if(goods[i].num == undefined || goods[i].box_no == undefined) continue;
                                            num += parseInt(goods[i].num);
                                            if(box_num.indexOf(goods[i].box_no+'|-') != -1) continue;
                                            box_num += goods[i].box_no+'|-';
                                        }
                                        data.num = num;
                                        var len = box_num.split("|-").length;
                                        //console.log(box_num.split("|-"),box_num.split("|-").length);
                                        data.box_num = len-1;
                                        data.total_price = total_price;
                                        me.down("#check_product_info").setData(data);
                                        var store = Ext.create('Ext.data.Store',{
                                            fields:[],
                                            data:text.data
                                        });
                                        gp.setStore(store);
                                        if(diff.length != 0){
                                            var tab = gp.up("tabpanel");
                                            var grid = Ext.create("Ext.grid.Panel",{
                                                title: '商品差异数',
                                                xtype: 'grid',
                                                scrollable:'y',
                                                sortableColumns:false,
                                                columns: [
                                                    {text: '国际款号', dataIndex: 'style_no',flex:1},
                                                    {text: '颜色', dataIndex: 'color',flex:1},
                                                    {text: '尺码', dataIndex: 'size',flex:1},
                                                    {text: '差异数', dataIndex: 'diff'}
                                                ],
                                                store:Ext.create('Ext.data.Store',{
                                                    fields:[],
                                                    data:text.diff
                                                })
                                            });
                                            tab.add(grid);
                                        }
                                    }
                                });
                            }
                        }
                    }
                ],
                listeners:{

                }
            }
        ];
        me.callParent();
    }
});