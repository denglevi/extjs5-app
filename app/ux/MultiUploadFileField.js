/**
 * Created by Administrator on 2015-06-23.
 */
Ext.define('erp.ux.MultiUploadFileField', {
    extend: 'Ext.form.field.File',
    alias:'widget.multifilefield',
    /**
     * Override to add a "multiple" attribute.
     */
    initComponent: function() {
        //console.log(this);
        //this.set({
        //    multiple: true
        //});
        //this.callParent(arguments);
    }
});
