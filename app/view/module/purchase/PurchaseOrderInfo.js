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
    initComponent:function(){
        var me = this;
        me.layout = 'anchor';
        me.items = [
            {
                xtype:'container',
                data:{name:'xx',status:[{namex:'xxxx'},{namex:'yyyy'}]},
                tpl:new Ext.XTemplate(
                    '<p>status: {name}',
                    '<tpl for="status">',
                    '{namex}',
                    '</tpl></p>'
                )
            },
            {
                xtype:'tabpanel',
                width:'100%',
                height:'100%',
                items:[
                    {
                        title:'商品信息',
                        xtype:'grid',
                        height:'100%',
                        columns:[
                            {text:'国际款号',dataIndex:'style_no',flex:1},
                            {text:'商品名称',dataIndex:'name'},
                            {text:'颜色',dataIndex:'color'},
                            {text:'尺码',dataIndex:'size'},
                            {text:'数量',dataIndex:'num'},
                            {text:'批发价',dataIndex:'batch_price'},
                            {text:'总价',dataIndex:'total_price'},
                            {text:'官方零售价',dataIndex:'retail_price'}
                        ],
                        store:Ext.create('Ext.data.Store',{
                            fields:["style_no","name",'color','size','num','batch_price','total_price','retail_price'],
                            autoLoad:true,
                            data:[
                                {style_no:'xxx',name:'xxx',color:'xxx',size:'xxx',num:'xxx',batch_price:'xxx',total_price:'xxx',retail_price:'xxx'},
                                {style_no:'xxx',name:'xxx',color:'xxx',size:'xxx',num:'xxx',batch_price:'xxx',total_price:'xxx',retail_price:'xxx'},
                                {style_no:'xxx',name:'xxx',color:'xxx',size:'xxx',num:'xxx',batch_price:'xxx',total_price:'xxx',retail_price:'xxx'},
                                {style_no:'xxx',name:'xxx',color:'xxx',size:'xxx',num:'xxx',batch_price:'xxx',total_price:'xxx',retail_price:'xxx'},
                                {style_no:'xxx',name:'xxx',color:'xxx',size:'xxx',num:'xxx',batch_price:'xxx',total_price:'xxx',retail_price:'xxx'},
                                {style_no:'xxx',name:'xxx',color:'xxx',size:'xxx',num:'xxx',batch_price:'xxx',total_price:'xxx',retail_price:'xxx'},
                                {style_no:'xxx',name:'xxx',color:'xxx',size:'xxx',num:'xxx',batch_price:'xxx',total_price:'xxx',retail_price:'xxx'},
                                {style_no:'xxx',name:'xxx',color:'xxx',size:'xxx',num:'xxx',batch_price:'xxx',total_price:'xxx',retail_price:'xxx'}
                            ]
                        })
                    },
                    {
                        title:'操作日志',
                        xtype:'grid',
                        height:'100%',
                        columns:[
                            {text:'国际款号',dataIndex:'style_no',flex:1},
                            {text:'商品名称',dataIndex:'name'},
                            {text:'颜色',dataIndex:'color'},
                            {text:'尺码',dataIndex:'size'},
                            {text:'数量',dataIndex:'num'},
                            {text:'批发价',dataIndex:'batch_price'},
                            {text:'总价',dataIndex:'total_price'},
                            {text:'官方零售价',dataIndex:'retail_price'}
                        ],
                        store:Ext.create('Ext.data.Store',{
                            fields:["style_no","name",'color','size','num','batch_price','total_price','retail_price'],
                            autoLoad:true,
                            data:[
                                {style_no:'xxx',name:'xxx',color:'xxx',size:'xxx',num:'xxx',batch_price:'xxx',total_price:'xxx',retail_price:'xxx'},
                                {style_no:'xxx',name:'xxx',color:'xxx',size:'xxx',num:'xxx',batch_price:'xxx',total_price:'xxx',retail_price:'xxx'},
                                {style_no:'xxx',name:'xxx',color:'xxx',size:'xxx',num:'xxx',batch_price:'xxx',total_price:'xxx',retail_price:'xxx'},
                                {style_no:'xxx',name:'xxx',color:'xxx',size:'xxx',num:'xxx',batch_price:'xxx',total_price:'xxx',retail_price:'xxx'},
                                {style_no:'xxx',name:'xxx',color:'xxx',size:'xxx',num:'xxx',batch_price:'xxx',total_price:'xxx',retail_price:'xxx'},
                                {style_no:'xxx',name:'xxx',color:'xxx',size:'xxx',num:'xxx',batch_price:'xxx',total_price:'xxx',retail_price:'xxx'},
                                {style_no:'xxx',name:'xxx',color:'xxx',size:'xxx',num:'xxx',batch_price:'xxx',total_price:'xxx',retail_price:'xxx'},
                                {style_no:'xxx',name:'xxx',color:'xxx',size:'xxx',num:'xxx',batch_price:'xxx',total_price:'xxx',retail_price:'xxx'}
                            ]
                        })
                    }
                ]
            }
        ];

        me.callParent();
    }
});