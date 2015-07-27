/**
 * Created by Administrator on 2015-06-23.
 */
Ext.define('erp.view.window.GoodsMenuInfoWin', {
    extend: 'Ext.window.Window',
    requires: [
        'Ext.Ajax',
        'Ext.container.Container',
        'Ext.form.field.Display',
        'Ext.form.field.Text',
        'Ext.layout.container.VBox',
        'Ext.tab.Panel'
    ],
    xtype: 'goodsmenuinfo',
    layout: {
        type:'vbox',
        stretch:true
    },
    //bodyPadding: 10,
    width: 650,
    height: 600,
    initComponent: function () {
        var me = this;

        var style = me.info.style,
            size = me.info.size,
            color = me.info.color;
        this.tbar = [
            '->',
            //{
            //    text: '修改'
            //}
        ];
        this.items = [
            {
                xtype: 'container',
                bodyPadding: '0 50',
                layout: 'vbox',
                defaults: {
                    labelAlign: 'right',
                    editable: false
                },
                items: [
                    {
                        xtype: 'displayfield',
                        fieldLabel: '系统款号',
                        value:style.system_style_no
                    },
                    {
                        xtype: 'displayfield',
                        fieldLabel: '商品名称',
                        value:style.name_zh
                    },
                    {
                        xtype: 'displayfield',
                        fieldLabel: '供应商款号',
                        value:style.supply_style_no
                    }
                ]
            },
            {
                xtype: 'tabpanel',
                flex: 1,
                width:'100%',
                items: [
                    {
                        title: '款号属性',
                        data:style,
                        tpl: new Ext.XTemplate(
                            '<table class="table table-bordered">',
                            '<tr><td class="col-md-3 text-right">大类</td><td class="col-md-9">{large_class}</td></tr>',
                            '<tr><td class="col-md-3 text-right">季节</td><td>{year_season}</td></tr>',
                            '<tr><td class="col-md-3 text-right">品牌</td><td>{brand}</td></tr>',
                            //'<tr><td class="col-md-3 text-right">中类</td><td>{middle_class}</td></tr>',
                            '<tr><td class="col-md-3 text-right">小类</td><td>{small_class}</td></tr>',
                            '<tr><td class="col-md-3 text-right">性别</td><td>{sex}</td></tr>',
                            '<tr><td class="col-md-3 text-right">执行标准</td><td>{execute_standard}</td></tr>',
                            '<tr><td class="col-md-3 text-right">安全级别</td><td>{safety_level}</td></tr>',
                            '<tr><td class="col-md-3 text-right">等级</td><td>{level}</td></tr></table>'
                        )
                    },
                    {
                        title: '颜色',
                        data:color,
                        tpl: new Ext.XTemplate(
                            '<table class="table table-bordered">',
                            '<tr><td class="col-md-3 text-right">国际颜色代码</td><td class="col-md-9">名称</td></tr>',
                            '<tpl for=".">',
                            '<tr><td class="col-md-3 text-right">{supply_color_no}</td><td class="col-md-9">{color}</td></tr>',
                            '</tpl>',
                            '</table>'
                        )
                    },
                    {
                        title: '尺码',
                        data:size,
                        tpl: new Ext.XTemplate(
                            '<table class="table table-bordered">',
                            '<tr>',
                            //'<td class="col-md-3 text-right">代码</td>',
                            '<td class="col-md-9">名称</td></tr>',
                            '<tpl for=".">',
                            '<tr>',
                            //'<td class="col-md-3 text-right">{size}</td>',
                            '<td class="col-md-9">{size}</td></tr>',
                            '</tpl>',
                            '</table>'
                        )
                    }
                ]
            }
        ]
        this.callParent();
    }
});
