/**
 * Created by Administrator on 2015-06-03.
 */
Ext.define('erp.ux.TransparentButton',{
    extend:'Ext.button.Button',
    alias: 'widget.transparentbutton',
    initComponent:function(){

        //if(!this.listeners)
        //    this.listeners = {};
        //Ext.apply(this.listeners,{
        //   mouseout:function(){
        //        this.setTransparent(document.getElementById(this.id));
        //   },
        //    mouseover:function(button){
        //        var b = document.getElementById(this.id);
        //        if (!button.disableMouseOver) {
        //            b.style.backgroundImage = '';
        //            b.style.backgroundColor = '';
        //            b.style.borderColor = '';
        //        } else
        //            b.style.borderColor = '';
        //    },
        //    afterrender:function(){
        //        this.setTransparent(document.getElementById(this.id));
        //    }
        //});

        this.callParent(arguments);
    },
    setTransparent:function(btn){
        btn.style.backgroundImage = 'inherit';
        btn.style.backgroundColor = 'inherit';
        btn.style.borderColor = 'transparent';
    }
});