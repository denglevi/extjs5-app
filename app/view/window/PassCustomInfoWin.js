/**
 * Created by Administrator on 2015-06-19.
 */
Ext.define('erp.view.window.PassCustomInfoWin', {
    extend: 'Ext.window.Window',
    xtype: 'passcustominfowin',
    requires: [
        'Ext.Ajax',
        'Ext.container.Container',
        'Ext.form.Panel',
        'Ext.form.field.Text',
        'Ext.form.field.TextArea',
        'Ext.layout.container.Anchor',
        'Ext.layout.container.Column',
        'Ext.tab.Panel'
    ],
    layout:{
        type:'anchor',
        stretch:true,
        align:'middle'
    },
    modal:true,
    minWidth: 650,
    maximizable:true,
    width:780,
    minHeight:500,
    initComponent: function () {
        var me = this,res,custom_order_id = me.record.get("id");

        Ext.Ajax.request({
            async:false,
            url: apiBaseUrl+'/index.php/Purchasing/Customs/getPassCustomOrderInfo',
            params: {
                id: custom_order_id
            },
            success: function(response){
                var text = Ext.decode(response.responseText);
                res = text.data;
            }
        });
        var status = res.custom_status,
            sort = this.record.get("status_sort");
        Ext.apply(me, {
            items: [
                {
                    xtype: 'container',
                    margin:'20',
                    anchor:'100%',
                    data: status,
                    tpl: new Ext.XTemplate(
                        '<div class="status">',
                        '<tpl for=".">',
                        '<div style="float: left;margin-top: 20px;">',
                        '<span class="dot {[this.getDot(values.sort,values.is_last)]}"></span>',
                        '<span class="line {[this.getLine(values.sort,xindex)]}"></span><br>',
                        '<span class="text">{name}</span>',
                        '</div>',
                        '</tpl>',
                        '</div>',
                        {
                            getDot:function(id,last){
                                if(sort === null) return 'green';
                                if(id > sort) return 'red';
                                if(id == sort && last == 0) return 'blue';
                                if(id == sort && last == 1) return 'green';
                                return 'green';
                            },
                            getLine:function(id,index){
                                if(index == status.length) return 'hide';
                                if(sort === null) return 'green';
                                if(id >= sort) return 'red';
                                return 'green';
                            }
                        }
                    )
                },
                {
                    xtype: 'form',
                    flex:1,
                    anchor:'100%',
                    bodyPadding:10,
                    url: apiBaseUrl + '/index.php/Purchasing/Customs/handlerPassCustom',
                    method: 'POST',
                    layout: 'column',
                    defaults: {
                        anchor: '100%',
                        xtype: 'textfield',
                        allowBlank: false,
                        disabled: false,
                        margin: 10,
                        columnWidth: 0.5,
                        labelWidth:120,
                        editable:false
                    },
                    items: this.getFieldItems(),
                    buttons: this.getBtns(sort,status,custom_order_id,me.record)
                },
                {
                    xtype:'tabpanel',
                    flex:1,
                    anchor:'100%',
                    width: 650,
                    height:200,
                    items:this.getTabItems()
                }
            ]
        });
        this.callParent();
    },
    getFieldItems: function () {
        var record =this.record;
        var fields = [
            {fieldLabel: '供货单号', name: 'batch_no',value:record.get("supply_no")},
            {fieldLabel: '采购单号', name: 'order_no',value:record.get("order_no")},
            {fieldLabel: '物流单号', name: 'logistics_no',value:record.get("logistics_no")},
            {fieldLabel: '报关公司', name: 'cu_name',value:record.get("cu_name")},
            {fieldLabel: '报关公司联系人', name: 'cu_contaits',value:record.get("cu_contaits")},
            {fieldLabel: '报关公司联系电话', name: 'cu_tel',value:record.get("cu_tel")},
            {fieldLabel: '报关公司联系地址', name: 'cu_address',xtype:'textarea',value:record.get("cu_address")},
            {fieldLabel:'备注',name:'mark',xtype:'textarea',allowBlank:true,editable:true}
        ];

        return fields;
    },
    getTabItems:function(){
        var info = [];
       var items = [
            {
                title:'操作详情',
                data:info,
                tpl: new Ext.XTemplate(
                    '<table class="table table-bordered">',
                    '<tr><td class="col-md-3">操作</td><td class="col-md-3">操作人</td><td class="col-md-3">备注</td><td class="col-md-3">操作时间</td></tr>',
                    '<tpl for=".">',
                    '<tr><td class="col-md-3">{supply_color_no}</td><td class="col-md-9">{color}</td></tr>',
                    '</tpl>',
                    '</table>'
                )
            },
            //{
            //    title:'关税信息'
            //},
            {
                title:'文件下载',
                data:info,
                tpl: new Ext.XTemplate(
                    '<table class="table table-bordered">',
                    '<tr><td class="col-md-3 text-right">文件名</td><td class="col-md-9">文件下载地址</td></tr>',
                    '<tpl for=".">',
                    '<tr><td class="col-md-3 text-right">{supply_color_no}</td><td class="col-md-9">{color}</td></tr>',
                    '</tpl>',
                    '</table>'
                )
            }
        ];
        return items;
    },
    getBtns: function (sort,status,id) {
        var me=this,text,status_id,is_last_status,len = status.length;
        for(var i=0;i<len;i++){
            if(status[i].sort != sort) continue;
            if(status[i].is_last == 1) return;
            i++;
            text = status[i].name;
            status_id = status[i].id;
            is_last_status = status[i].is_last;
            break;
        }
        if(!text) return;
        return [
            {
                text: '重置',
                handler: function () {
                    this.up('form').getForm().reset();
                }
            },
            {
                text: text,
                formBind: true,
                disabled: true,
                handler: function () {
                    var form = this.up('form').getForm();
                    if (form.isValid()) {
                        form.submit({
                            params:{
                                id:id,
                                next_status:status_id,
                                status:me.record.get('cu_status'),
                                is_last_status:is_last_status
                            },
                            waitMsg: '正在更新...',
                            success: function (form, action) {
                                me.destroy();
                                console.log(action.result);
                            },
                            failure: function (form, action) {
                                console.log(action);
                                Ext.Msg.alert('失败', action.result.msg||"系统服务错误,请联系管理管理员!");
                            }
                        });
                    }
                }
            }
        ];
    }
});


