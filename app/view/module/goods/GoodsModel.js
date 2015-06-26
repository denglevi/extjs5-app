/**
 * Created by denglevi on 15-6-14.
 */
Ext.define('erp.view.module.goods.GoodsModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.goods',

    stores: {
        /*
        A declaration of Ext.data.Store configurations that are first processed as binds to produce an effective
        store configuration. For example:

        users: {
            model: 'Goods',
            autoLoad: true
        }
        */
    },

    data: {
        system_style_no:'',
        no:'',
        status:'',
        import_id:null
    }
});