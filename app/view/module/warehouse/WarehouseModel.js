/**
 * Created by denglevi on 15-6-14.
 */
Ext.define('erp.view.module.warehouse.WarehouseModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.warehouse',

    data: {
        diff_num_cls:'text-danger',
        import_info:null,
        goods_info_data:null,
        goods_info:null,
        goods_info_data:null,
        goods_info_diff:null,
        goods_info_log:null,
        exhibit_info:null,
        import_order:null,
        exhibit_diff:null,
        exhibit_order:null,
        move_location_order_no:null,
        move_location_order_status:false,
        move_location_order_warehouse:null,
        move_location_order_id:null
    }
});