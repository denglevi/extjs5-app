/**
 * Created by Administrator on 2015-08-24.
 */
Ext.define('erp.view.module.warehouse.ReturnWarehouseController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.returnwarehouse',

    requires: [
        'Ext.Ajax',
        'Ext.String',
        'Ext.data.Store',
        'Ext.data.StoreManager',
        'Ext.form.Panel',
        'Ext.form.field.ComboBox',
        'Ext.form.field.Date',
        'Ext.form.field.Tag',
        'Ext.form.field.Text',
        'Ext.form.field.TextArea',
        'Ext.layout.container.Anchor',
        'Ext.layout.container.Column',
        'Ext.window.Window',
        'erp.view.module.warehouse.ReturnWarehouseDetail',
        'erp.view.module.warehouse.ReturnIntoWarehouseDetail',
    ],

    init: function () {

    },
    onReturnWarehouseGridDblClick:function(gp,record){
        var tab = gp.up("tabpanel"),ref = 'returnwarehousedetail-'+record.get("id"),
            item = tab.down('#'+ref);
        if(item != null){
            tab.setActiveTab(item);
            return;
        }
        tab.setActiveTab({
            itemId:ref,
            xtype:'returnwarehousedetail',
            record:record,
            title:'通知单详情',
            closable:true
        });
    },
    onReturnIntoWarehouseGridDblClick:function(gp,record){
        var tab = gp.up("tabpanel"),ref = 'returnintowarehousedetail-'+record.get("id"),
            item = tab.down('#'+ref);
        if(item != null){
            tab.setActiveTab(item);
            return;
        }
        tab.setActiveTab({
            itemId:ref,
            xtype:'returnintowarehousedetail',
            record:record,
            title:'退仓单详情',
            closable:true
        });
    },

    addTaskOrder:function(){
        var me = this,
            model = this.getViewModel();
        var store = Ext.create('Ext.data.Store', {
            fields: ['type', 'val'],
            data: [
                {type: '全盘', val: 1},
                {type: '品牌', val: 2},
                {type: '分类', val: 3}
            ]
        });
        var isHide = model.get("add_wahouse_check_task_order_field_hidden")
        var win = Ext.create('Ext.window.Window', {
            title: '新增任务单',
            bodyPadding: 20,
            modal: true,
            items:[
                {
                    xtype:'form',
                    width: 600,
                    layout: 'column',
                    defaults: {
                        margin: 10,
                        labelAlign: 'right',
                        labelWidth: 70,
                        columnWidth: 0.5,
                        xtype: 'combo',
                        hidden: isHide,
                        msgTarget:'side',
                        disabled:true
                    },
                    items: [
                        {disabled:false,xtype: 'datefield', fieldLabel: '盘点日期', format: 'Y-m-d', value: new Date(), name: 'date',hidden:false,editable: false,allowBlank:false},
                        {
                            name:'warehouse',fieldLabel: '盘点仓库',displayField: 'storage_name',valueField: 'id',editable: false,
                            disabled:true,hidden:false
                        },
                        {
                            disabled:false,
                            fieldLabel: '盘点类型',
                            store: store,
                            allowBlank:false,
                            displayField: 'type',
                            valueField: 'val',
                            name: 'type',
                            editable: false,
                            hidden: false,
                            listeners: {
                                change: function(){
                                    var val = this.getValue();
                                    if (val == 1) {
                                        win.down("combo[name=brand]").setDisabled(true);
                                        win.down("combo[name=year_season]").setDisabled(true);
                                        win.down("#large_class").setDisabled(true);
                                        win.down("combo[name=small_class]").setDisabled(true);
                                        win.down("combo[name=sex]").setDisabled(true);

                                        win.down("combo[name=brand]").setHidden(true);
                                        win.down("combo[name=year_season]").setHidden(true);
                                        win.down("#large_class").setHidden(true);
                                        win.down("combo[name=small_class]").setHidden(true);
                                        win.down("combo[name=sex]").setHidden(true);
                                    }
                                    else if (val == 2) {
                                        win.down("combo[name=year_season]").setDisabled(true);
                                        win.down("#large_class").setDisabled(true);
                                        win.down("combo[name=small_class]").setDisabled(true);
                                        win.down("combo[name=sex]").setDisabled(true);

                                        win.down("combo[name=year_season]").setHidden(true);
                                        win.down("#large_class").setHidden(true);
                                        win.down("combo[name=small_class]").setHidden(true);
                                        win.down("combo[name=sex]").setHidden(true);
                                        win.down("combo[name=brand]").setHidden(false);
                                        Ext.Ajax.request({
                                            aysnc: true,
                                            method: 'POST',
                                            url: apiBaseUrl + '/index.php/Warehouse/TaskList/getBaseData',
                                            params: {
                                                brand:0
                                            },
                                            success: function (res) {
                                                var json = Ext.decode(res.responseText);
                                                console.log(json);
                                                if(!json.success){
                                                    Ext.toast(json.msg,"系统提示");
                                                    return;
                                                }
                                                var store = Ext.create('Ext.data.Store', {
                                                    fields: ['type', 'val'],
                                                    data: json.data.brand
                                                });
                                                var brandField = win.down("combo[name=brand]");
                                                brandField.setStore(store);
                                                brandField.setDisabled(false);
                                                brandField.setHidden(false);
                                            },
                                            failure: function (res) {
                                                Ext.toast("请求错误,请检查网络!","系统提示");
                                            }
                                        });
                                    }
                                    else if (val == 3) {
                                        Ext.Ajax.request({
                                            aysnc: true,
                                            method: 'POST',
                                            url: apiBaseUrl + '/index.php/Warehouse/TaskList/getBaseList',
                                            params: {
                                                brand:0,
                                                year_season:0,
                                                large_class:0,
                                                sex:0
                                            },
                                            success: function (res) {
                                                var json = Ext.decode(res.responseText);

                                                if(!json.success){
                                                    Ext.toast(json.msg,"系统提示");
                                                    return;
                                                }
                                                var store = Ext.create('Ext.data.Store', {
                                                    fields: ['type', 'val'],
                                                    data: json.data.brand,
                                                });
                                                var yearSeasonStore = Ext.create('Ext.data.Store', {
                                                    fields: ['type', 'val'],
                                                    data: json.data.year_season
                                                });
                                                var largeClassStore = Ext.create('Ext.data.Store', {
                                                    fields: ['type', 'val'],
                                                    data: json.data.large_class
                                                });
                                                var sexStore = Ext.create('Ext.data.Store', {
                                                    fields: ['type', 'val'],
                                                    data: json.data.sex
                                                });
                                                var brandField = win.down("combo[name=brand]");
                                                var yearSeasonField = win.down("tagfield[name=year_season]");
                                                var largeClassField = win.down("#large_class");
                                                var sexField = win.down("tagfield[name=sex]");
                                                brandField.setStore(store);
                                                yearSeasonField.setStore(yearSeasonStore);
                                                largeClassField.setStore(largeClassStore);
                                                sexField.setStore(sexStore);

                                                brandField.setDisabled(false);
                                                yearSeasonField.setDisabled(false);
                                                largeClassField.setDisabled(false);
                                                sexField.setDisabled(false);

                                                brandField.setHidden(false);
                                                yearSeasonField.setHidden(false);
                                                largeClassField.setHidden(false);
                                                sexField.setHidden(false);
                                            },
                                            failure: function (res) {
                                                Ext.toast("请求错误,请检查网络!","系统提示");
                                            }
                                        });
                                    }
                                }
                            }
                        },
                        {xtype:'tagfield',fieldLabel: '品牌',displayField: 'name_en',valueField: 'name_en',name:'brand',editable: true},
                        {xtype:'tagfield',fieldLabel: '年季',displayField: 'name',valueField: 'no',name: 'year_season',editable:true,store:store},
                        {xtype:'tagfield',fieldLabel: '大类',displayField: 'name',valueField: 'base_data_id',itemId:'large_class',name: 'large_class[]',listeners:{
                            change:function(){
                                var val= this.getValue();
                                var str=val.join(',');
                                Ext.Ajax.request({
                                    aysnc: true,
                                    method: 'POST',
                                    url: apiBaseUrl + '/index.php/Warehouse/TaskList/getExtBigClass',
                                    params: {
                                        large_class:str
                                    },
                                    success: function (res) {
                                        var json = Ext.decode(res.responseText);
                                        console.log(json);
                                        if(!json.success){
                                            Ext.toast(json.msg,"系统提示");
                                            return;
                                        }
                                        var store = Ext.create('Ext.data.Store', {
                                            fields: ['type', 'val'],
                                            data: json.data
                                        });
                                        var smallClassField = win.down("tagfield[name=small_class]");
                                        smallClassField.setStore(store);
                                        smallClassField.setDisabled(false);
                                        smallClassField.setHidden(false);
                                    },
                                    failure: function (res) {
                                        Ext.toast("请求错误,请检查网络!","系统提示");
                                    }
                                });
                            }
                        }},
                        {xtype:'tagfield',fieldLabel: '小类',displayField: 'name',valueField: 'name',name: 'small_class'},
                        {xtype:'tagfield',fieldLabel: '性别',displayField: 'name',valueField: 'name',name: 'sex'},
                        {disabled:false,columnWidth: 1,xtype: 'textarea',fieldLabel: '备注',name: 'mark',editable: true,allowBlank: true,hidden: false}
                    ]
                }
            ]
            ,
            buttons: [
                {
                    text: '提交', handler: function () {

                    var form = this.up("window").down("form").getForm(),
                        vals = form.getValues();

                    if(vals.type === "" || vals.date === ""){
                        Ext.Msg.alert("系统提示","必填项不能为空");
                        return;
                    }

                    Ext.Ajax.request({
                        aysnc: true,
                        method: 'POST',
                        url: apiBaseUrl + '/index.php/Warehouse/TaskList/addWarehouseCheckTaskOrder',
                        params: {
                            vals:Ext.encode(vals),
                            warehouse_id:vals.warehouse
                        },
                        success: function (res) {
                            console.log(res);
                            var json = Ext.decode(res.responseText);
                            if(!json.success){
                                Ext.toast(json.msg,"系统提示");
                                return;
                            }

                            win.destroy();
                            Ext.StoreManager.lookup("WarehouseCheckTaskOrderStore").load();
                        },
                        failure: function (res) {
                            Ext.toast("请求错误,请检查网络!","系统提示");
                        }
                    });
                }
                }
            ]
        });
        Ext.Ajax.request({
            async:true,
            url: apiBaseUrl + '/index.php/Warehouse/TaskList/getBaseData',
            params: {
                warehouse:0
            },
            method:'POST',
            success:function(res){
                var json = Ext.decode(res.responseText);
                if(!json.success){
                    Ext.toast(json.msg,"系统提示");
                    return;
                }
                var store = Ext.create('Ext.data.Store', {
                    fields: [],
                    data: json.data.warehouse
                });
                var warehouse = win.down("combo[name=warehouse]");
                warehouse.setStore(store);
                warehouse.setDisabled(false);
            },
            failure:function(){
                Ext.toast("请求数据错误,请检查网络,重试!","系统提示");
            }
        });
        win.show();
    },
    addCheckOrder:function(){

        var store;
        Ext.Ajax.request({
            async:false,
            url: apiBaseUrl + '/index.php/Warehouse/CheckVouch/getWarehouseCheckTaskOrderNo',
            method:'POST',
            success:function(res){
                var json = Ext.decode(res.responseText);
                if(!json.success){
                    Ext.toast(json.msg,"系统提示");
                    return;
                }

                store = Ext.create('Ext.data.Store',{
                    fields:[],
                    data:json.data
                });
            },
            failure:function(res){

            }
        });
        var win = Ext.create('Ext.window.Window',{
            title:'新增盘点单',
            bodyPadding:20,
            layout:'anchor',
            width:400,
            modal:true,
            defaults:{
                anchor:'100%',
                fieldWidth:70,
                allowBlank:false
            },
            items:[
                {editable:false,xtype:'combo',fieldLabel:'任务单号',name:'task_no',valueField:'id',displayField:'no',store:store},
                {xtype:'datefield',fieldLabel:'盘点日期',editable:false,name:'date',format:'Y-m-d'},
                {xtype:'textfield',fieldLabel:'盘点人工号',name:'work_no'},
            ],
            buttons:[
                {text:'提交',handler:function(){
                    var task_no = win.down("combo").getValue(),
                        date = win.down("datefield").getValue(),
                        work_no = win.down("textfield[name=work_no]").getValue();

                    if("" == task_no || "" == date || "" == Ext.String.trim(work_no)){
                        Ext.Msg.alert("系统提示","必填项不能空");
                        return;
                    }

                    Ext.Ajax.request({
                        aysnc:false,
                        url: apiBaseUrl + '/index.php/Warehouse/CheckVouch/addWarehouseCheckOrder',
                        params:{
                            date:date,
                            work_no:work_no,
                            task_no:task_no
                        },
                        method:'POST',
                        success:function(res){
                            var json = Ext.decode(res.responseText);
                            if(!json.success){
                                Ext.toast(json.msg,"系统提示");
                                return;
                            }
                            Ext.StoreManager.lookup("WarehouseCheckOrderStore").load();
                            win.destroy();
                        },
                        failure:function(res){
                            Ext.toast("网络请求错误,请检查网络是否正常!","系统提示");
                        }
                    });
                }}
            ]
        });

        win.show();
    },
    editCheckStatus:function(grid, rowIndex, colIndex, item, e, record){
        var id=record.get("pid"), status=item.val;
        Ext.Ajax.request({
            async:true,
            url: apiBaseUrl +'/index.php/Warehouse/TaskList/editStats',
            method:'POST',
            params:{
                status:status,
                id:id,
            },
            success:function(res){
                var json = Ext.decode(res.responseText);
                if (!json.success) {
                    Ext.toast(json.msg, "系统提示");
                    return
                }
                Ext.toast("修改成功", "系统提示");
                Ext.StoreManager.lookup("WarehouseCheckTaskOrderStore").load();
            },
            failure: function (res) {
                Ext.toast("服务请求错误,请检查网络连接!", "系统提示");
            }
        });
    },
    delWarehouseCheckOrder:function(btn){
        var grid = btn.up("grid");
        var sel = grid.getSelection(), ids = [], nos = [],nodel=[];
        if (sel.length == 0) {
            Ext.Msg.alert('系统提示', '请选择要删除的任务单');
            return;
        }

        Ext.each(sel, function (record) {
            if(record.get("status")==0){
                ids.push(record.get("pid"));
                nos.push(record.get("receipts_no"));
            }else nodel.push(record.get("receipts_no"));
        });
        if(nodel.length!=0){
            Ext.Msg.alert('系统提示', '已下任务单不允许删除!<br>'+nodel.join('<br>'));
            return;
        }
        Ext.Msg.show({
            title: '系统消息',
            message: '删除任务单时,此任务单下的信息将一起从系统中删除,你确定要删除以下任务单吗？<br>' + nos.join('<br>'),
            buttons: Ext.Msg.YESNO,
            icon: Ext.Msg.QUESTION,
            fn: function (btn) {
                if (btn === 'yes') {
                    Ext.Ajax.request({
                        url: apiBaseUrl + '/index.php/Warehouse/TaskList/delTasknoticeList',
                        waitMsg: '正在删除...',
                        params: {
                            ids: ids.join(',')
                        },
                        success: function (data) {
                            var res = Ext.decode(data.responseText);
                            console.log(res);
                            if (!res.success) {
                                Ext.Msg.alert('系统提示', res.msg);
                                return;
                            }
                            grid.getStore().load();
                        },
                        failure: function (data) {
                            var res = Ext.decode(data.responseText);
                            Ext.Msg.alert('系统提示', res.msg);
                        }
                    })
                }
            }
        });
    },
    delWarehouseCheckTaskOrder:function(btn){
        var grid = btn.up("grid");
        var sel = grid.getSelection(), ids = [], nos = [],nodel=[],takeid=[];

        if (sel.length == 0) {
            Ext.Msg.alert('系统提示', '请选择要删除的盘点单');
            return;
        }
        Ext.each(sel, function (record) {
            if(record.get("status")==0){
                ids.push(record.get("pid"));
                nos.push(record.get("receipts_no"));
                takeid.push(record.get("tasklist_no"));
            }else nodel.push(record.get("receipts_no"));
        });
        if(nodel.length!=0){
            Ext.Msg.alert('系统提示', '以下盘点单不允许删除!<br>'+nodel.join('<br>'));
            return;
        }
        Ext.Msg.show({
            title: '系统消息',
            message: '删除任务单时,此盘点单下的信息将一起从系统中删除,你确定要删除以下盘点单吗？<br>' + nos.join('<br>'),
            buttons: Ext.Msg.YESNO,
            icon: Ext.Msg.QUESTION,
            fn: function (btn) {
                if (btn === 'yes') {
                    Ext.Ajax.request({
                        url: apiBaseUrl + '/index.php/Warehouse/CheckVouch/delCheckNoticeList',
                        waitMsg: '正在删除...',
                        params: {
                            ids: ids.join(','),
                            takeid:takeid.join(',')
                        },
                        success: function (data) {
                            var res = Ext.decode(data.responseText);
                            console.log(res);
                            if (!res.success) {
                                Ext.Msg.alert('系统提示', res.msg);
                                return;
                            }
                            grid.getStore().load();
                            Ext.StoreManager.lookup("WarehouseCheckTaskOrderStore").load();
                        },
                        failure: function (data) {
                            var res = Ext.decode(data.responseText);
                            Ext.Msg.alert('系统提示', res.msg);
                        }
                    })
                }
            }
        });
    }

});