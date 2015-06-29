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
        'Ext.form.Panel',
        'Ext.form.action.Action',
        'Ext.form.field.File',
        'Ext.grid.Panel',
        'Ext.panel.Panel',
        'Ext.tab.Panel',
        'Ext.toolbar.Toolbar',
        'Ext.window.Window',
        'erp.view.module.purchase.AddCheckProductOrder',
        'erp.view.window.AddLogisticsFormWin',
        'erp.view.window.AddPassCustomWin',
        'erp.view.window.PurchasePayWin'
    ],
    initComponent: function () {
        var me = this,res;
        //var myMask = new Ext.LoadMask({target:Ext.getBody(),msg:"请稍等,正在获取数据..."});
        //myMask.show();
        Ext.Ajax.request({
            async:false,
            url: apiBaseUrl+'/index.php/Purchasing/Buyer/getPurchaseOrderInfo',
            params: {
                id: me.order_id
            },
            success: function(response){
                //myMask.destroy( );
                var text = Ext.decode(response.responseText);
                res = text.data;
            }
        });

        var product_info = res.product_info,
            log = res.log,
            order_info = res.order_info,
            status = res.status,
            batchs = res.batchs,
            next_status = res.next_status;
        var url = next_status.action==''?'/Purchasing/Buyer/purchasingAction':next_status.action;
        me.layout = 'vbox';
        me.items = [
            {
                xtype: 'container',
                width:'100%',
                margin:'30 30 40 30',
                data: status,
                tpl: new Ext.XTemplate(
                    '<div class="status">',
                    '<tpl for=".">',
                    '<div style="float: left;margin-top: 20px;">',
                    '<span class="dot {[this.getDot(values.id)]}"></span>',
                    '<span class="line {[this.getLine(values.id,xindex)]}"></span><br>',
                    '<span class="text">{name}</span>',
                    '</div>',
                    '</tpl>',
                    '</div>',
                    {
                        getDot:function(id){
                            if(next_status === null) return 'green';
                            if(id > next_status.id) return 'red';
                            if(id == next_status.id) return 'blue';
                            return 'green';
                        },
                        getLine:function(id,index){
                            if(index == status.length) return 'hide';
                            if(next_status === null) return 'green';
                            if(id >= next_status.id) return 'red';
                            return 'green';
                        }
                    }
                )
            },
            {
                xtype:'panel',
                data:order_info,
                width:'100%',
                margin:10,
                dockedItems: [{
                    xtype: 'toolbar',
                    dock: 'bottom',
                    items: [
                        '->'
                    ]
                }],
                tpl:new Ext.XTemplate(
                    '<div class="col-md-12">',
                    '<div class="col-md-2">日期：{order_time}</div>',
                    '<div class="col-md-2">供应商：{vendor_name}</div>',
                    '<div class="col-md-2">订单号：{order_nos}</div>',
                    '<div class="col-md-2">买手：{username}</div>',
                    '<div class="col-md-4">订单类型：{[this.getType(values.order_state)]}</div>',
                    '</div>',
                    {
                        getType:function(type){
                            if(type == 'spot_purchase_order') return '现货';
                            if(type == 'future_purchase_order') return '期货';

                            return '未定义';
                        }
                    }

                ),
                listeners:{
                    afterrender:function(){
                        if(next_status == null || next_status.other_action == 1) return;
                        this.down("toolbar").add({
                            text:next_status.name,
                            xtype:'',
                            handler:function(){
                                if('申请付款' == next_status.name){
                                    var total=0;
                                    Ext.each(product_info,function(product){
                                        total += parseFloat(product.orderinfo_nprice);
                                    });
                                    Ext.create('erp.view.window.PurchasePayWin',{
                                        title:next_status.name,
                                        status_id:order_info.order_status,
                                        order_no:order_info.order_nos,
                                        batch_no:batchs[0].batch_no,
                                        url:url,
                                        total:total
                                    }).show();
                                }else if("验货" == next_status.name){
                                    var tab = {
                                        title:next_status.name,
                                        order_no:order_info.order_nos,
                                        batch_no:batchs[0].batch_no,
                                        xtype:"addcheckproductorder" ,
                                        closable:true
                                    };
                                    me.up("tabpanel").setActiveTab(tab);
                                }else if("提货" == next_status.name){
                                    Ext.create('erp.view.window.AddLogisticsFormWin',{
                                        title:next_status.name,
                                        order_no:order_info.order_nos,
                                        batch_no:batchs[0].batch_no,
                                        url:url
                                    }).show();
                                }else if("申请报关" == next_status.name){
                                    Ext.create('erp.view.window.AddPassCustomWin',{
                                        title:next_status.name,
                                        order_no:order_info.order_nos,
                                        batch_no:batchs[0].batch_no,
                                        url:url
                                    }).show();
                                }else if("完成报关" == next_status.name || "收货确认" == next_status.name || "完成付款" == next_status.name){
                                    me.handlerPurchaseOrder(order_info.order_nos,batchs[0].batch_no);
                                }else if("关单" == next_status.name){
                                    me.uploadCloseFile(order_info.order_nos);
                                }
                            }
                        });
                    }
                }
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
                            {text: '国际款号', dataIndex: 'orderinfo_style', flex: 1},
                            {text: '商品名称', dataIndex: 'orderinfo_name'},
                            {text: '颜色', dataIndex: 'orderinfo_color'},
                            {text: '尺码', dataIndex: 'orderinfo_group'},
                            {text: '数量', dataIndex: 'orderinfo_amount'},
                            {text: '批发价(欧)', dataIndex: 'orderinfo_wholesale'},
                            {text: '总价(欧)', dataIndex: 'orderinfo_nprice'},
                            {text: '官方零售价(欧)', dataIndex: 'orderinfo_official',flex:1}
                        ],
                        listeners:{
                            afterrender:function(){
                                var store = Ext.create('Ext.data.Store',{
                                        fields:[],
                                        data:product_info
                                    });
                                this.setStore(store);
                            }
                        }
                    },
                    {
                        title: '操作日志',
                        xtype: 'grid',
                        height:400,
                        sortableColumns:false,
                        columns: [
                            {text: '日期', dataIndex: 'time'},
                            {text: '操作', dataIndex: 'name',flex:1},
                            {text: '操作人', dataIndex: 'username',flex:1}
                        ],
                        store: Ext.create('Ext.data.Store',{
                            fields:[],
                            data:log
                        })
                    }
                ],
                listeners:{

                }
            }
        ];

        me.callParent();
    },
    handlerPurchaseOrder:function(order_no,batch_no){
        Ext.Ajax.request({
            async:false,
            url: apiBaseUrl+'/index.php/Purchasing/Buyer/handlerPurchaseOrder',
            params: {
                batch_no:batch_no,
                order_no:order_no
            },
            success: function(response){
                //myMask.destroy( );
                var text = Ext.decode(response.responseText);
                if(!text.success){
                    Ext.Msg.alert("系统提示",text.msg);
                    return;
                }
            }
        });
    },
    uploadCloseFile:function(order_no){
        Ext.create('Ext.window.Window',{
            title:"上传清关文件",
            bodyPadding: 40,
            items:[
                {
                    xtype:'form',
                    method:'POST',
                    url:apiBaseUrl+'/index.php/Purchasing/Customs/closeOrder',
                    items:[
                        {
                            xtype: 'filefield',
                            name: 'excel_file',
                            buttonText: '上传文件',
                            allowBlank: true,
                            listeners: {
                                change: function () {
                                    var val = this.getValue();
                                    console.log(val);
                                    this.up("form").getForm().submit({
                                        waitMsg:'正在上传文件...',
                                        params:{
                                            order_no:order_no
                                        },
                                        success: function (form, action) {
                                            var data = action.result.data;

                                        },
                                        failure: function (form, action) {
                                            switch (action.failureType) {
                                                case Ext.form.action.Action.CLIENT_INVALID:
                                                    Ext.Msg.alert('系统提示', '表单验证错误');
                                                    break;
                                                case Ext.form.action.Action.CONNECT_FAILURE:
                                                    Ext.Msg.alert('系统提示', '远程连接错误，请稍后重试');
                                                    break;
                                                case Ext.form.action.Action.SERVER_INVALID:
                                                    Ext.Msg.alert('系统提示', action.result.msg);
                                            }
                                        }
                                    });
                                }
                            }
                        }
                    ]
                }
            ]
            //order_no:order_info.order_nos,
            //batch_no:batchs[0].batch_no,
            //url:url
        }).show();
    }
});