/**
 * Created by denglevi on 15-6-14.
 */
Ext.define('erp.store.purchase.PurchaseOrderStore', {
    extend: 'Ext.data.Store',

    requires: [
        'erp.model.purchase.PurchaseOrderModel'
    ],

    storeId:'PurchaseOrderStore',
    model: 'erp.model.PurchaseOrderModel',

    /*
    Fields can also be declared without a model class:
    fields: [
        {name: 'firstName', type: 'string'},
        {name: 'lastName',  type: 'string'},
        {name: 'age',       type: 'int'},
        {name: 'eyeColor',  type: 'string'}
    ]
    */
    autoLoad:true,
    data:[
        {style_no:'xxx',name:'xxx',color:'xxx',size:'xxx',num:'xxx',batch_price:'xxx',total_price:'xxx',retail:'xxx'},
        {style_no:'xxx',name:'xxx',color:'xxx',size:'xxx',num:'xxx',batch_price:'xxx',total_price:'xxx',retail:'xxx'},
        {style_no:'xxx',name:'xxx',color:'xxx',size:'xxx',num:'xxx',batch_price:'xxx',total_price:'xxx',retail:'xxx'},
        {style_no:'xxx',name:'xxx',color:'xxx',size:'xxx',num:'xxx',batch_price:'xxx',total_price:'xxx',retail:'xxx'},
        {style_no:'xxx',name:'xxx',color:'xxx',size:'xxx',num:'xxx',batch_price:'xxx',total_price:'xxx',retail:'xxx'},
        {style_no:'xxx',name:'xxx',color:'xxx',size:'xxx',num:'xxx',batch_price:'xxx',total_price:'xxx',retail:'xxx'},
        {style_no:'xxx',name:'xxx',color:'xxx',size:'xxx',num:'xxx',batch_price:'xxx',total_price:'xxx',retail:'xxx'},
        {style_no:'xxx',name:'xxx',color:'xxx',size:'xxx',num:'xxx',batch_price:'xxx',total_price:'xxx',retail:'xxx'}
    ]
    //proxy: {
    //    type: 'memory',
    //    reader: {
    //        type: 'json',
    //        rootProperty: 'items'
    //    }
    //}
});