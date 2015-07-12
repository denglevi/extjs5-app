/**
 * Created by denglevi on 15-7-13.
 */
Ext.define('erp.view.main.Login', {
    extend: 'Ext.form.Panel',
    xtype: 'form-login',


    title: 'Login',
    frame:true,
    width: 320,
    bodyPadding: 10,
    layout:'center',
    defaultType: 'textfield',

    items: [{
        allowBlank: false,
        fieldLabel: 'User ID',
        name: 'user',
        emptyText: 'user id'
    }, {
        allowBlank: false,
        fieldLabel: 'Password',
        name: 'pass',
        emptyText: 'password',
        inputType: 'password'
    }, {
        xtype:'checkbox',
        fieldLabel: 'Remember me',
        name: 'remember'
    }],

    buttons: [
        { text:'Register' },
        { text:'Login' }
    ],

    initComponent: function() {
        this.defaults = {
            anchor: '100%',
            labelWidth: 120
        };

        this.callParent();
    }
});