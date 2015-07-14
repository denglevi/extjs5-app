/**
 * Created by Administrator on 2015-06-23.
 */
Ext.define('erp.store.GoodsMenuStore', {
        extend: 'Ext.data.Store',
        storeId:"GoodsMenuStore",
        fields: ['id','system_style_no','supply_style_no','name_zh','large_class','year_season','brand','middle_class','small_class','sex','execute_standard','safety_level','level','original','alu','color_no','color','size','shape','material_1','material_2','material_3','filler','accessory','num','retail_price','wash_type'],
        autoLoad:false,
        proxy: {
            type: 'ajax',
            url: apiBaseUrl+'/index.php/Commodity/CommodityMenu/getGoodsMenuList',
            reader: {
                type: 'json',
                rootProperty: 'data',
                totalProperty: 'total'
            }
        }
    }
);
