/**
 * Created by Administrator on 2015-08-03.
 */
Ext.define('erp.view.module.system.SystemLogMng', {
    extend: 'Ext.grid.Panel',
    xtype: 'systemlogmng',

    requires: [
        'Ext.form.field.Date',
        'Ext.form.field.Display',
        'Ext.form.field.Text',
        'Ext.grid.column.Action',
        'Ext.toolbar.Fill',
        'Ext.toolbar.Paging',
        'Ext.toolbar.TextItem'
    ],

    initComponent:function(args){
        var me = this;

        Ext.apply(me,{
            tbar:[
                '->',
                {xtype:'textfield',fieldLabel:'操作用户',name:'action_user',labelAlign:'right',labelWidth:70},
                {xtype:'datefield',fieldLabel:'操作时间',name:'action_start_time',labelAlign:'right',format:'Y-m-d',editable:false},
                {xtype:'tbtext',html:'-'},
                {xtype:'datefield',hideLabel:true,name:'action_end_time',labelAlign:'right',format:'Y-m-d',editable:false},
                {text:'搜索'}
            ],
            sortableColumns:false,
            enableColumnHide:false,
            columns:[
                {text:'操作用户',dataIndex:'username',flex:1},
                {text:'日志等级',dataIndex:'level',flex:1},
                {text:'操作动作',dataIndex:'action',flex:1},
                {text:'描述',dataIndex:'log_text',flex:1},
                {text:'操作时间',dataIndex:'create_time',flex:1}
            ],
            store:'SystemLogStore',
            listeners:{
                afterrender:function(){
                    this.getStore().load();
                }
            },
            bbar: ['->', {
                xtype: 'pagingtoolbar',
                store: 'SystemLogStore',
                displayInfo: true
            }],
        });
        this.callParent(args);
    },

});