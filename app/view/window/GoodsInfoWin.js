/**
 * Created by Administrator on 2015-06-24.
 */
Ext.define('erp.view.window.GoodsInfoWin', {
    extend: 'Ext.window.Window',
    requires: [
        'Ext.Ajax',
        'Ext.Img',
        'Ext.button.Button',
        'Ext.container.Container',
        'Ext.form.field.Display',
        'Ext.form.field.File',
        'Ext.form.field.FileButton',
        'Ext.form.field.Text',
        'Ext.layout.container.HBox',
        'Ext.layout.container.VBox',
        'Ext.tab.Panel'
    ],
    xtype: 'goodsinfo',
    layout: {
        type: 'vbox',
        stretch: true
    },
    //bodyPadding: 10,
    width: 650,

    modal:true,
    html:'<iframe id="printIframe" style="display:none;" />',
    initComponent: function () {
        var me = this;

        var info = me.info, image = '/resources/images/logo.png';
        if (info.images != null && info.images.length > 0) {
            image = apiBaseUrl + '/../' + info.images[0].image_src
        }
        var images = info.images;
        this.tbar = [
            '->',
            {
                xtype: 'form',
                hidden: true,
                items: [
                    {
                        xtype: 'fileuploadfield',
                        id: 'upload_goods_pic_field',
                        buttonOnly: true,
                        name: 'good_pic[]',
                        listeners: {
                            change: function (btn, val) {
                                var form = this.up("form").getForm();
                                form.submit({
                                    waitMsg: '正在上传图片...',
                                    url: apiBaseUrl + '/index.php/Commodity/CommodityMenu/uploadGoodsPic',
                                    method: 'POST',
                                    params: {
                                        id: info.no_id
                                    },
                                    success: function (form, action) {
                                        if (!action.result.success) {
                                            Ext.toast(action.result.msg, "系统提示");
                                            return;
                                        }
                                        var imgs = action.result.data;
                                        if(image == '/resources/images/logo.png' && imgs.length < 1) return;
                                        var pic_image = me.down("image");
                                        pic_image.setSrc(apiBaseUrl + '/../' + imgs[0].image_src);
                                        me.down("#goods_pic").setData(imgs);
                                        console.log(action);
                                    },
                                    failure: function (form, action) {
                                        if (action.result.msg != null) {
                                            Ext.toast(action.result.msg, "系统提示");
                                            return;
                                        }
                                        Ext.toast("服务请求错误,请重试!", "系统提示");
                                    }
                                });
                            }
                        }
                    }
                ]
            },
            {
                text: '上传图片',
                iconCls: 'importIcon',
                tooltip:"只允许上传常见后缀名的图片(jpg,gif,png,jpeg)",
                handler: function () {
                    var dom = Ext.get("upload_goods_pic_field"),
                        input = dom.select("input").last();
                    input.dom.multiple=true;
                    input.dom.click();
                }
            },
            //{
            //    text: '修改'
            //},
            {
                text: '打印吊牌',
                handler:function(){

                    //var c = me.body.first().dom.innerHTML;
                    //var printer = me.body.last().dom.contentWindow;
                    //console.log(me,printer);
                    //printer.document.body.innerHTML = c;
                    //printer.focus();
                    //printer.print();
                    var tpl = new Ext.XTemplate(
                        '<div class="width:200px;clear:both;">',
                        '<div style="width:200px;font-family: Arial;font-weight: 900;text-align: center;font-size: large;">{brand}</div>',
                        '<div class="row" style="font-size: small;">',
                        '<div class="col-md-12">国际款号: {supply_style_no}</div>',
                        '<div class="col-md-12">系统款号:{system_style_no}</div>',
                        '<div class="col-md-6">品名: {name_zh}</div>',
                        '<div class="col-md-6">等级: {level}</div>',
                        '<div class="col-md-12">型号规格: {shape}</div>',
                        '<div class="col-md-12">颜色: {color}</div>',
                        '<div class="col-md-12">面料成份: {material_1}</div>',
                        '<div>安全技术类别: {safety_level}</div>',
                        '<div>产品执行标准: {execute_standard}</div>',
                        '<div>洗涤方法: <img src="/resources/images/wash_type/01.jpg" width="100" height="10" /></div>',
                        '<div>检验员: {brand}</div>',
                        '<div>原产地: {original}</div>',
                        '<div>价格: RMB {retail_price}</div>',
                        '</div>',
                        '<div>条形码</div>',
                        '</div>'
                    );

                    var area = tpl.apply(info);
                    var iframe = document.getElementById("printIframe");
                    iframe.contentWindow.document.body.innerHTML=area;
                    iframe.contentWindow.focus();
                    iframe.contentWindow.print();
                }
            }
        ];
        this.items = [
            {
                xtype: 'container',
                bodyPadding: '0 50',
                layout: 'hbox',
                items: [
                    {
                        xtype: 'image',
                        src: image,
                        width: 150,
                        height:150,
                        imgCls:'goods_info'
                    },
                    {
                        xtype: 'container',
                        layout: 'vbox',
                        flex: 1,
                        defaults: {
                            labelAlign: 'right',
                            editable: false
                        },
                        items: [
                            {
                                xtype: 'displayfield',
                                fieldLabel: '唯一码',
                                value: info.no
                            },
                            {
                                xtype: 'displayfield',
                                fieldLabel: '系统款号',
                                value: info.system_style_no
                            },
                            {
                                xtype: 'displayfield',
                                fieldLabel: '商品名称',
                                value: info.name_zh
                            },
                            {
                                xtype: 'displayfield',
                                fieldLabel: '供应商款号',
                                value: info.supply_style_no
                            }
                        ]
                    }
                ]
            },
            {
                xtype: 'tabpanel',
                flex: 1,
                width: '100%',
                items: [
                    {
                        title: '款号属性',
                        data: info,
                        tpl: new Ext.XTemplate(
                            '<table class="table table-bordered">',
                            '<tr><td class="col-md-3 text-right">大类</td><td class="col-md-9">{large_class}</td></tr>',
                            '<tr><td class="col-md-3 text-right">年份</td><td>{year_season}</td></tr>',
                            '<tr><td class="col-md-3 text-right">品牌</td><td>{brand}</td></tr>',
                            //'<tr><td class="col-md-3 text-right">中类</td><td>{middle_class}</td></tr>',
                            '<tr><td class="col-md-3 text-right">小类</td><td>{small_class}</td></tr>',
                            '<tr><td class="col-md-3 text-right">性别</td><td>{sex}</td></tr>',
                            '<tr><td class="col-md-3 text-right">执行标准</td><td>{execute_standard}</td></tr>',
                            '<tr><td class="col-md-3 text-right">安全级别</td><td>{safety_level}</td></tr>',
                            '<tr><td class="col-md-3 text-right">面料成份</td><td>{material_1}</td></tr>',
                            '<tr><td class="col-md-3 text-right">产地</td><td>{original}</td></tr>',
                            '<tr><td class="col-md-3 text-right">等级</td><td>{level}</td></tr></table>'
                        )
                    },
                    {
                        title: '颜色',
                        data: info,
                        tpl: new Ext.XTemplate(
                            '<table class="table table-bordered">',
                            '<tr><td class="col-md-3 text-right">供应商颜色代码</td><td class="col-md-9">名称</td></tr>',
                            '<tpl for=".">',
                            '<tr><td class="col-md-3 text-right">{supply_color_no}</td><td class="col-md-9">{color}</td></tr>',
                            '</tpl>',
                            '</table>'
                        )
                    },
                    {
                        title: '尺码',
                        data: info,
                        tpl: new Ext.XTemplate(
                            '<table class="table table-bordered">',
                            '<tr><td class="col-md-3 text-right">代码</td><td class="col-md-9">名称</td></tr>',
                            '<tpl for=".">',
                            '<tr><td class="col-md-3 text-right">{size}</td><td class="col-md-9">{size}</td></tr>',
                            '</tpl>',
                            '</table>'
                        )
                    },
                    {
                        title: '商品图片',
                        data: images,
                        itemId:'goods_pic',
                        tpl: new Ext.XTemplate(
                            '<div class="row">',
                            '<tpl for=".">',
                            '<div class="col-xs-6 col-md-3" style="margin:5px;">',
                            '<a href="#" class="thumbnail">{[this.getImg(values.image_src)]}</a>',
                            '</div>',
                            '</tpl>',
                            '</div>',
                            {
                                getImg: function (src) {
                                    return '<div class="thumbnail"><img src="' + apiBaseUrl + '/../' + src + '" /></div>';
                                }
                            }
                        )
                    }
                ]
            }
        ]
        this.callParent();
    }
});

