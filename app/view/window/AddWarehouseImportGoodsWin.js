/**
 * Created by Administrator on 2015-06-25.
 */
Ext.define('erp.view.window.AddWarehouseImportGoodsWin',{
    extend:'Ext.window.Window',
    alias:'widget.addwarehouseimportgoodswin',

    requires: [
        'Ext.Ajax',
        'Ext.data.Store',
        'Ext.data.StoreManager',
        'Ext.form.Panel',
        'Ext.form.field.ComboBox',
        'Ext.form.field.Date',
        'Ext.form.field.Text',
        'Ext.form.field.TextArea',
        'Ext.layout.container.Column',
        'Ext.layout.container.Fit'
    ],

    initComponent:function(){
        var me = this;
        Ext.apply(me,{
            title:'新增进货单',
            layout:'fit',
            width:600,
            modal:true,
            items:[
                {
                    xtype: 'form',
                    layout: 'column',
                    bodyPadding: 10,
                    method: 'POST',
                    url: apiBaseUrl + '/index.php/Warehouse/ImportGoods/addWarehouseImportGoods',
                    defaults: {
                        anchor: '100%',
                        xtype: 'textfield',
                        allowBlank: false,
                        margin:5,
                        columnWidth:0.5
                    },
                    items: [
                        {fieldLabel: '制单日期', name: 'date', xtype: 'datefield', editable: false, format: 'Y-m-d', value: new Date()},
                        //{fieldLabel:'供应商单号', xtype:'combo', valueField:'batch_no', editable: false, displayField:'batch_no', name:'batch_no', disabled:true},
                        {fieldLabel:'商品导入单号',name:'no',xtype:'combo',valueField:'id',displayField:'no',editable:false,disabled:true,listeners:{
                            change:function(obj,newValue){
                                var items = obj.getStore().getData().items,len = items.length;
                                for(var i=0;i<len;i++){
                                    var item = items[i];
                                    if(item.get("id") != newValue) continue;
                                    var brand = item.get("brand");
                                    obj.up("form").down("textfield[name=brand]").setValue(Ext.util.Format.htmlDecode(brand));
                                    break;
                                }
                            }
                        }},
                        {fieldLabel:'品牌',name:'brand'},
                        {fieldLabel:'渠道',name:'channel',allowBlank:true},
                        //{fieldLabel: '品牌', name: 'brand_id', xtype: 'combo', editable: false, displayField: 'name_en', valueField: 'id'},
                        {fieldLabel: '仓库', name: 'warehouse_id', xtype: 'combo', editable: false, displayField: 'storage_name', valueField: 'id', disabled:true},
                        {fieldLabel:'摘要', xtype:'textarea', name:'warehouse_location_id', columnWidth:1, allowBlank:true}
                    ],
                    buttons: [
                        {
                            text: '重置',
                            handler: function () {
                                this.up('form').getForm().reset();
                            }
                        },
                        {
                            text: '保存',
                            formBind: true,
                            disabled: true,
                            handler: function () {
                                var form = this.up('form').getForm();
                                if (form.isValid()) {
                                    form.submit({
                                        waitMsg: '正在新增...',
                                        success: function (form, action) {
                                            //Ext.data.StoreManager.lookup("importGoodsStore").load();
                                            if(!action.result.success){
                                                Ext.Msg.alert('失败', action.result.msg);
                                                return;
                                            }
                                            me.fireEvent("addImportGoodsInfo",action.result);
                                            me.destroy();
                                            //me.down("grid").getStore().load();
                                            //console.log(action.result);
                                            //Ext.Msg.alert('系统提示', '新增订单成功');
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
                },
            ],
            listeners:{
                afterrender: function () {
                    Ext.Ajax.request({
                        async: true,
                        url: apiBaseUrl + '/index.php/Warehouse/ImportGoods/getSupplyNoAndWarehouse',
                        success: function (response) {
                            var text = Ext.decode(response.responseText);
                            var res = text.data;
                            console.log(res);
                            if(!text.success){
                                Ext.toast(text.msg,"系统提示","t");
                                return;
                            }
                            var form = me.down("form");
                            //form.down("combo[name=brand_id]").setStore(Ext.create('Ext.data.Store', {
                            //    fields: ['id', 'name_en'],
                            //    data: res.brand
                            //}));
                            form.down("combo[name=warehouse_id]").setStore(Ext.create('Ext.data.Store', {
                                fields: ['id', 'storage_name'],
                                data: res.warehouse
                            }));
                            form.down("combo[name=no]").setStore(Ext.create('Ext.data.Store', {
                                fields: ['no','id'],
                                data: res.no
                            }));
                            form.down("combo[name=no]").setDisabled(false);
                            form.down("combo[name=warehouse_id]").setDisabled(false);
                            //form.down("combo[name=supplier_id]").setStore(Ext.create('Ext.data.Store', {
                            //    fields: ['id', 'name'],
                            //    data: res.supplier
                            //}));
                        }
                    });
                }
            }

        });

        this.callParent();
    }
});
