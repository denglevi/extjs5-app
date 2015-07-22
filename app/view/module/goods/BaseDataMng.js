/**
 * Created by Administrator on 2015-07-07.
 */
Ext.define('erp.view.module.goods.BaseDataMng', {
    extend: "Ext.container.Container",
    alias: "widget.basedatamng",

    requires: [
        'Ext.data.Store',
        'Ext.data.proxy.Ajax',
        'Ext.data.reader.Json',
        'Ext.form.Panel',
        'Ext.form.field.ComboBox',
        'Ext.form.field.Hidden',
        'Ext.form.field.Text',
        'Ext.grid.Panel',
        'Ext.layout.container.Anchor',
        'Ext.layout.container.Column',
        'Ext.layout.container.HBox',
        'Ext.window.Window',
        'erp.view.module.purchase.SupplierMngController',
        'erp.view.module.purchase.SupplierMngModel'
    ],
    controller: 'suppliermng',
    layout: 'hbox',
    split: true,
    viewModel: {
        type: 'suppliermng'
    },
    initComponent: function () {
        var me = this;
        me.getViewModel().set('isHidden',true);
        this.items = [
            {
                xtype: 'grid',
                title: '基础资料',
                itemId:'key_list',
                sortableColumns: false,
                enableColumnHide: false,
                width: 200,
                height: '100%',
                tbar: [
                    {
                        text: '新增',
                        //glyph: 0xf1f8,
                        iconCls:'addIcon',
                        handler: function (btn) {
                            var win = Ext.create('Ext.window.Window', {
                                width:450,
                                title: '新增基础资料',
                                items: [{
                                    xtype: 'form',
                                    bodyPadding: 10,
                                    layout:'column',
                                    url: apiBaseUrl + '/index.php/Commodity/Public/addBaseData',
                                    defaults: {
                                        xtype: 'textfield',
                                        labelAlign: 'right',
                                        allowBlank: false,
                                        margin:5,
                                        columnWidth:0.5,
                                        labelWidth:70
                                    },
                                    items: [
                                        {fieldLabel: '资料名称', name: 'name',columnWidth:1}
                                    ],
                                    buttons: [
                                        {text:'添加资料属性',handler:function(){
                                            var form = this.up('form');
                                            var len = (form.items.length+1)/2;
                                            form.add({fieldLabel: '属性名称'+len, name: 'name-'+len});
                                            form.add({fieldLabel: '属性标示'+len, name: 'mark-'+len});
                                        }},
                                        {
                                            text: '重置',
                                            handler: function () {
                                                var form = this.up('form')
                                                form.removeAll();
                                                form.add({fieldLabel: '资料名称', name: 'name',columnWidth:1});
                                                form.getForm().reset();
                                            }
                                        },
                                        {
                                            text: '提交',
                                            id: 'submit',
                                            formBind: true,
                                            disabled: true,
                                            handler: function () {
                                                var form = this.up('form').getForm();
                                                if (form.isValid()) {
                                                    form.submit({
                                                        success: function (form, action) {
                                                            console.log(action);
                                                            btn.up("grid").getStore().load();
                                                            win.destroy();
                                                        },
                                                        failure: function (form, action) {
                                                            console.log(action);
                                                            Ext.Msg.alert('失败', action.result.msg);
                                                        }
                                                    });
                                                }
                                            }
                                        }
                                    ]
                                }]
                            });
                            win.show();
                        }
                    }
                    //{
                    //    text: '删除',
                    //    iconCls:'delIcon',
                    //    handler:function(del_btn){
                    //        var sel = del_btn.up('grid').getSelection(), ids = [], names = [];
                    //        if (sel.length == 0) {
                    //            Ext.Msg.alert('系统提示', '请选择要删除的基础资料');
                    //            return;
                    //        }
                    //        Ext.each(sel, function (record) {
                    //            ids.push(record.get("id"));
                    //            names.push(record.get("name"));
                    //        });
                    //
                    //        Ext.Msg.show({
                    //            title: '系统消息',
                    //            message: '你确定要删除以下基础资料吗？<br>' + names.join('<br>'),
                    //            buttons: Ext.Msg.YESNO,
                    //            icon: Ext.Msg.QUESTION,
                    //            fn: function (btn) {
                    //                if (btn === 'yes') {
                    //                    Ext.getBody().mask("正在删除...");
                    //                    Ext.Ajax.request({
                    //                        url: apiBaseUrl + '/index.php/Commodity/Public/delBaseData',
                    //                        params: {
                    //                            ids: ids.join(',')
                    //                        },
                    //                        success: function (data) {
                    //                            var res = Ext.decode(data.responseText);
                    //                            Ext.getBody().unmask();
                    //                            console.log(res);return;
                    //                            if (!res.success) {
                    //                                Ext.Msg.alert('系统提示', res.msg);
                    //                                return;
                    //                            }
                    //                            Ext.getBody().unmask();
                    //                            del_btn.up('grid').getStore().load();
                    //                        },
                    //                        failure: function (data) {
                    //                            Ext.getBody().unmask();
                    //                            Ext.Msg.alert('系统提示', "请求网络错误,请检查网络,重试!");
                    //                        }
                    //                    })
                    //                }
                    //            }
                    //        });
                    //    }
                    //    //glyph: 0xf1f8
                    //}
                ],
                columns: [
                    {text: '名称', dataIndex: 'name',flex:1}
                ],
                selModel:'checkboxmodel',
                store: Ext.create('Ext.data.Store', {
                    autoLoad: true,
                    fields:['id','name','fields'],
                    proxy: {
                        type: 'ajax',
                        url: apiBaseUrl + '/index.php/Commodity/Public/getBaseDataList',
                        reader: {
                            type: 'json',
                            rootProperty: 'data'
                        }
                    }
                }),
                listeners:{
                    rowdblclick:me.onKeyListDblClick,
                    scope:this
                }
            },
            {
                xtype:'grid',
                itemId:'value_list',
                title:'值列表',
                flex:1,
                height:'100%',
                border:true,
                sortableColumns: false,
                enableColumnHide: false,
                selModel:'checkboxmodel',
                tbar: [
                    {
                        text: '新增',
                        iconCls:'addIcon',
                        //glyph: 0xf1f8,
                        handler: me.addGoodsBaseDataValue,
                        scope:me
                    },
                    //{
                    //    text: '删除',
                    //    glyph: 0xf1f8
                    //},
                    {
                        text:'修改',
                        iconCls:'editIcon',
                        handler:me.editGoodBaseDataValue,
                        scope:me
                    }
                ]
            },
            {
                xtype:'form',
                title:'资料表单',
                itemId:'value_form',
                flex:1,
                layout:'anchor',
                height:'100%',
                bodyPadding:10,
                defaults:{
                    allowBlank:false,
                    margin:5,
                    labelAlign:'right',
                    anchor:'100%',
                    xtype:'textfield',
                    labelWidth:70
                },
                buttons:[
                    {text:'重置',bind:{hidden:'{isHidden}'},handler:function(){
                        this.up("form").reset();
                    }},
                    {text:'提交',bind:{hidden:'{isHidden}'},handler:me.formSubmit,scope:me}
                ]
            }
        ]
        me.callParent();
    },
    formSubmit:function(){
        var form = this.down("form").getForm(),
            me = this,
            id = me.record.get("id"),
            val = form.getValues();
        console.log(val.base_data_id);
        if(val.base_data_id === undefined){
            form.submit({
                waitMsg:'正在提交...',
                params:{
                    id:id
                },
                url:apiBaseUrl + '/index.php/Commodity/Public/addGoodsBaseDataValue',
                method:'POST',
                success:function(form,action){
                    console.log(action);
                    me.down("form").setTitle("资料表单");
                    me.down("form").removeAll();
                    me.getViewModel().set('isHidden',true);
                    me.down("#value_list").getStore().load();
                },
                failure:function(form,action){
                    console.log(123);
                }
            });
        }else{
            form.submit({
                waitMsg:'正在提交...',
                url:apiBaseUrl + '/index.php/Commodity/Public/editGoodsBaseDataValue',
                method:'POST',
                success:function(form,action){
                    console.log(action);
                    me.down("form").setTitle("资料表单");
                    me.down("form").removeAll();
                    me.getViewModel().set('isHidden',true);
                    me.down("#value_list").getStore().load();
                },
                failure:function(form,action){
                    console.log(123);
                }
            });
        }
    },
    editGoodBaseDataValue:function(){
        var me = this;
        var sel = this.down("#value_list").getSelection();
        if(sel.length == 0) return;
        if(sel.length > 1){
            Ext.Msg.alert("系统提示","一次只能修改一条记录");
            return;
        }
        var form = this.down("#value_form"),
            record = sel[0],
            fields = Ext.decode(me.record.get("fields")),
            len = fields.length,
            formFields = [];
        form.setTitle("修改"+me.record.get("name")+"属性值");
        formFields.push({
            xtype:'hidden',
            name:'base_data_id',
            value:record.get("id")
        });
        for(var i=0;i<len;i++){
            var field = fields[i];
            if(field.name === null || field.mark === null) continue;
            formFields.push({
                fieldLabel:field.name,
                name:field.mark,
                value:record.get(field.mark)
            });
        }
        formFields.push({
            fieldLabel:"是否停用",
            name:"status",
            displayField:'name',
            xtype:'combo',
            value:record.get('status'),
            editable:false,
            valueField:'val',
            store:Ext.create("Ext.data.Store",{
                fields:[],
                data:[{name:'是',val:1},{name:'否',val:0}]
            })
        });
        form.removeAll();
        form.add(formFields);
        me.getViewModel().set('isHidden',false);
    },
    onKeyListDblClick:function(gp,record){
        this.record = record;
        var me = this,
            name = record.get("name"),
            fields = Ext.decode(record.get("fields")),
            id = record.get("id"),
            valueList = me.down("#value_list"),
            store = Ext.create('Ext.data.Store',{
                fields:[],
                autoLoad:true,
                proxy:{
                    type:'ajax',
                    url:apiBaseUrl + '/index.php/Commodity/Public/getGoodsBaseDataValueList?id='+id,
                    reader:{
                        type:'json',
                        rootProperty:'data'
                    }
                }
            }),
            columns = [],len = fields.length;
            for(var i=0;i<len;i++){
                var field = fields[i];
                if(field.name === null || field.mark === null) continue;
                columns.push({
                    text:field.name,
                    dataIndex:field.mark,
                    flex:1
                });
            }
        columns.push({
            text:'是否停用',
            dataIndex:'status',
            renderer:function(val){
                if(1 == val) return "停用";
                return "启用";
            },
            flex:1
        });
        valueList.setTitle(name+"列表");
        valueList.reconfigure(store,columns);
    },
    addGoodsBaseDataValue:function(btn){
        var me = this;
        var form = this.down("#value_form"),
            fields = Ext.decode(me.record.get("fields")),
            len = fields.length,
            formFields = [];
        form.setTitle("新增"+me.record.get("name")+"属性值");
        for(var i=0;i<len;i++){
            var field = fields[i];
            if(field.name === null || field.mark === null) continue;
            formFields.push({
                fieldLabel:field.name,
                name:field.mark
            });
        }
        form.removeAll();
        form.add(formFields);
        me.getViewModel().set('isHidden',false);
    }
});