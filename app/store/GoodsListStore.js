/**
 * Created by Administrator on 2015-06-24.
 */
Ext.define('erp.store.GoodsListStore', {
        extend: 'Ext.data.Store',
        fields: ['id','image','no','name_zh','supply_color_no','company_retail_price','color','size'],
        autoLoad:false
    }
);

