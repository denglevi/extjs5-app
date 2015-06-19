/**
 * Created by denglevi on 15-6-14.
 */
Ext.define('erp.view.module.warehouse.WarehouseController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.warehouse',

    requires: [
        'erp.view.module.warehouse.AddWarehouseReceive'
    ],

    /**
     * Called when the view is created
     */
    init: function() {

    },
    onWarehouseReceiveGridDblClick:function(gp,record){
        var batch_no = record.get("batch_no");
        console.log(record);
        gp.up('tabpanel').setActiveTab({
            xtype:'addwarehousereceive',
            title:'添加收货信息',
            closable:true,
            record:record
        });
    }
});