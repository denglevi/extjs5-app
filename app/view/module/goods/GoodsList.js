/**
 * Created by Administrator on 2015-06-24.
 */
Ext.define('erp.view.module.goods.GoodsList', {
    extend: 'Ext.Container',
    xtype: 'goodslist',
    requires: [
        'Ext.data.Store',
        'Ext.data.proxy.Ajax',
        'Ext.data.reader.Json',
        'Ext.form.field.ComboBox',
        'Ext.form.field.Text',
        'Ext.grid.Panel',
        'Ext.grid.column.Action',
        'Ext.toolbar.Fill',
        'Ext.toolbar.Paging',
        'erp.view.module.goods.GoodsController',
        'erp.view.module.goods.GoodsModel'
    ],

    viewModel: {
        type: 'goods'
    },
    controller: 'goods',
    initComponent: function () {
        var me = this;
        me.layout = {
            type: 'hbox',
            stretch: true
        };
        me.html = '<iframe id="printList" style="display:none;" />';
        var import_list = this.getImportList();
        var goods_list = this.getGoodsList();
        this.items = [
            import_list, goods_list
        ];
        import_list.on("rowdblclick", function (gp, record) {
            var id = record.get("id");
            me.getViewModel().set("import_id", id);
            var store = goods_list.getStore();
            store.setProxy({
                type: 'ajax',
                url: apiBaseUrl + '/index.php/Commodity/CommodityMenu/getGoodsInfoList?id=' + id,
                reader: {
                    type: 'json',
                    rootProperty: 'data',
                    totalProperty: 'total'
                }
            });
            store.load();
        }, this);
        //goods_list.on("rowdblclick", "onGoodListGridDblClick");

        me.callParent();
    },
    getImportList: function () {
        var store = Ext.create('Ext.data.Store', {
            fields: ['no', 'id'],
            autoLoad: false,
            proxy: {
                type: 'ajax',
                url: apiBaseUrl + '/index.php/Commodity/CommodityMenu/getGoodsImportList',
                reader: {
                    type: 'json',
                    rootProperty: 'data',
                    totalProperty: 'total'
                }
            }
        });
        var import_list_grid = Ext.create('Ext.grid.Panel', {
            title: '导入列表',
            height: '100%',
            width: 400,
            border: true,
            //flex: 1,
            selModel: 'checkboxmodel',
            bbar: ['->',
                {
                    xtype: 'pagingtoolbar',
                    store: store,
                    emptyMsg: '<b>暂无记录</b>',
                    displayMsg: '显示 {0} - {1} 总共 {2} 条记录',
                    displayInfo: false,
                    defaults:{
                        margin:0,
                        padding:0
                    }
                }, {
                    xtype: 'combo',
                    displayField: 'text',
                    valueField: 'val',
                    width: 60,
                    editable: false,
                    hideLabel: true,
                    store: Ext.create("Ext.data.Store", {
                        fields: [],
                        data: [
                            {text: 25, val: 25},
                            {text: 50, val: 50},
                            {text: 75, val: 75},
                            {text: 100, val: 100},
                        ]
                    }),
                    value: 25,
                    listeners: {
                        change: function (obj) {
                            store.setPageSize(obj.getValue());
                            store.load();
                        }
                    }
                }],
            tbar: [
                {
                    text: '删除', iconCls: 'delIcon', handler: function (del_btn) {
                    var sel = del_btn.up('grid').getSelection(), ids = [], names = [];
                    if (sel.length == 0) {
                        Ext.Msg.alert('系统提示', '请选择要删除的导入单');
                        return;
                    }
                    Ext.each(sel, function (record) {
                        ids.push(record.get("id"));
                        names.push(record.get("no"));
                    });
                    Ext.Msg.show({
                        title: '系统消息',
                        message: '你确定要删除以下导入单吗？<br>' + names.join('<br>'),
                        buttons: Ext.Msg.YESNO,
                        icon: Ext.Msg.QUESTION,
                        fn: function (btn) {
                            if (btn === 'yes') {
                                Ext.getBody().mask("正在删除...");
                                Ext.Ajax.request({
                                    url: apiBaseUrl + '/index.php/Commodity/CommodityMenu/delGoodsImportOrder',
                                    params: {
                                        ids: ids.join(',')
                                    },
                                    success: function (data) {
                                        Ext.getBody().unmask();
                                        var res = Ext.decode(data.responseText);
                                        if (!res.success) {
                                            Ext.Msg.alert('系统提示', res.msg);
                                            return;
                                        }
                                        //if(is_delete == 1){
                                        //    del_btn.up('grid').up("warehouseimportgoods").down("panel[name=info]").removeAll();
                                        //}
                                        Ext.toast("操作成功", "系统提示");
                                        del_btn.up('grid').getStore().load();
                                    },
                                    failure: function (data) {
                                        Ext.getBody().unmask();
                                        Ext.Msg.alert('系统提示', "请求网络错误,请检查网络,重试!");
                                    }
                                })
                            }
                        }
                    });
                }
                }
            ],
            columns: [
                {text: '导入单号', dataIndex: 'no', flex: 2},
                {text: '品牌', dataIndex: 'brand', flex: 2},
                {text: '总数', dataIndex: 'goods_num', flex: 1},
                {text: '未入库', dataIndex: 'unimport_num', flex: 1},
                {text: '已入库', dataIndex: 'import_num', flex: 1},
                {text: '导入日期', dataIndex: 'create_time', flex: 2}
            ],
            store: store,
            listeners: {
                afterrender: function () {
                    this.getStore().load();
                }
            }
        });
        return import_list_grid;
    },
    getGoodsList: function () {
        var goods_list_grid = Ext.create('Ext.grid.Panel', {
            flex: 1,
            height: '100%',
            title: '商品列表',
            selModel: 'checkboxmodel',
            reference: 'goods_list_grid',
            sortableColumns: false,
            tbar: [
                {
                    text: '打印',
                    handler: function (del_btn) {
                        var sel = del_btn.up('grid').getSelection(), ids = [], names = [], mark = 0;
                        if (sel.length == 0) {
                            Ext.Msg.alert('系统提示', '请选择要打印的商品');
                            return;
                        }
                        var area = "",time=0;
                        Ext.each(sel, function (record) {
                            var info = record.getData();
                            //console.log(info);
                            var img = new Image();
                            img.src = "/resources/images/wash_type/01.jpg";
                            if(img.complete){
                                time++;
                                info.img = '<img src="/resources/images/wash_type/01.jpg" width="100" height="10" /></div>';
                                //console.log($(info.bar).barcode(info.no, "code128",{barWidth:1, barHeight:30,showHRI:true}));
                                //$(info.bar).barcode(info.no, "code128",{barWidth:1, barHeight:30,showHRI:true});
                                var tpl = new Ext.XTemplate(
                                    '<div class="width:200px;clear:both;">',
                                    '<div style="width:200px;font-family: Arial;font-weight: 900;text-align: center;font-size: large;">{brand}</div>',
                                    '<div class="row" style="font-size: small;">',
                                    '<div class="col-md-12">国际款号: {supply_style_no}</div>',
                                    '<div class="col-md-12">系统款号: {system_style_no}</div>',
                                    '<div class="col-md-6">品名: {name_zh}</div>',
                                    '<div class="col-md-6">等级: {level}</div>',
                                    '<div class="col-md-12">型号规格: {shape}</div>',
                                    '<div class="col-md-12">颜色: {color}</div>',
                                    '<div class="col-md-12">面料成份: {material_1}</div>',
                                    '<div>安全技术类别: {safety_level}</div>',
                                    '<div>产品执行标准: {execute_standard}</div>',
                                    '<div>洗涤方法: {img}</div>',
                                    '<div>检验员: {brand}</div>',
                                    '<div>原产地: {original}</div>',
                                    '<div>价格: RMB {retail_price}</div>',
                                    '</div>',
                                    '<div class="barcode" data="{no}"></div>',
                                    '</div>'
                                );
                                area += tpl.apply(info);
                                if(time == sel.length){
                                    var iframe = document.getElementById("printList");
                                    iframe.contentWindow.document.body.innerHTML = area;
                                    var barcodes = $(iframe.contentWindow.document).find(".barcode"),len = barcodes.length;
                                    for(var i=0;i<len;i++){
                                        //console.log($(barcodes[i]));
                                        var no = $(barcodes[i]).attr("data");
                                        $(barcodes[i]).barcode(no, "code128",{barWidth:1, barHeight:30,showHRI:true})
                                    }
                                    iframe.contentWindow.focus();//IE will print parent window without this statement.
                                    iframe.contentWindow.print();
                                }
                            }else{
                                img.onload = function(){
                                    img.onload = null;
                                    time++;
                                    info.img = '<img src="/resources/images/wash_type/01.jpg" width="100" height="10" /></div>';
                                    var tpl = new Ext.XTemplate(
                                        '<div class="width:200px;clear:both;">',
                                        '<div style="width:200px;font-family: Arial;font-weight: 900;text-align: center;font-size: large;">{brand}</div>',
                                        '<div class="row" style="font-size: small;">',
                                        '<div class="col-md-12">国际款号: {supply_style_no}</div>',
                                        '<div class="col-md-12">系统款号: {system_style_no}</div>',
                                        '<div class="col-md-6">品名: {name_zh}</div>',
                                        '<div class="col-md-6">等级: {level}</div>',
                                        '<div class="col-md-12">号型规格: {shape}</div>',
                                        '<div class="col-md-12">颜色: {color}</div>',
                                        '<div class="col-md-12">面料成份: {material_1}</div>',
                                        '<div>安全技术类别: {safety_level}</div>',
                                        '<div>产品执行标准: {execute_standard}</div>',
                                        '<div>洗涤方式: {img}</div>',
                                        '<div>检验员: {brand}</div>',
                                        '<div>原产地: {original}</div>',
                                        '<div>价格: RMB {retail_price}</div>',
                                        '</div>',
                                        '<div class="barcode" data="{no}"></div>',
                                        '</div>'
                                    );
                                    area += tpl.apply(info);
                                    if(time == sel.length){
                                        var iframe = document.getElementById("printList");
                                        iframe.contentWindow.document.body.innerHTML = area;
                                        var barcodes = $(iframe.contentWindow.document).find(".barcode"),len = barcodes.length;
                                        for(var i=0;i<len;i++){
                                            //console.log($(barcodes[i]));
                                            var no = $(barcodes[i]).attr("data");
                                            $(barcodes[i]).barcode(no, "code128",{barWidth:1, barHeight:30,showHRI:true})
                                        }
                                        iframe.contentWindow.focus();//IE will print parent window without this statement.
                                        iframe.contentWindow.print();
                                    }
                                }
                            }

                        });
                        //var iframe = document.getElementById("printList");
                        //iframe.contentWindow.document.body.innerHTML = area;
                        //iframe.contentWindow.focus();//IE will print parent window without this statement.
                        //iframe.contentWindow.print();
                    }
                },
                '->',
                {
                    xtype: 'textfield',
                    labelAlign: 'right',
                    labelWidth: 60,
                    fieldLabel: "系统款号",
                    name: 'system_style_no',
                    bind: {
                        value: '{system_style_no}'
                    }
                },
                {
                    xtype: 'textfield',
                    labelAlign: 'right',
                    labelWidth: 60,
                    fieldLabel: "唯一码",
                    name: 'no',
                    bind: {
                        value: '{no}'
                    }
                },
                {
                    xtype: 'combo',
                    labelAlign: 'right',
                    editable: false,
                    labelWidth: 60,
                    width: 150,
                    store: Ext.create('Ext.data.Store', {
                        fields: ['staus', 'name'],
                        data: [
                            {"status": "0", "name": "未入库"},
                            {"status": "1", "name": "已入库"},
                            {"status": "2", "name": "已上架"},
                            {"status": "3", "name": "已下架"},
                            {"status": "4", "name": "已出库"},
                            {"status": "5", "name": "待移库"},
                            {"status": "6", "name": "待收货"}
                        ]
                    }),
                    queryMode: 'local',
                    displayField: 'name',
                    valueField: 'status',
                    fieldLabel: "状态",
                    name: 'status',
                    bind: {
                        value: '{status}'
                    }
                },
                {
                    text: '搜索',
                    //glyph: 0xf002,
                    iconCls: 'searchIcon',
                    handler: 'searchGoods'
                }],
            columns: [
                //{
                //    text: '商品图片', dataIndex: 'image_src', flex: 1, renderer: function (val) {
                //    var src = val || '/resources/images/logo.png';
                //    return '<img height=50 src="' + src + '" alt="" class="img-thumbnail" />';
                //}
                //},
                {text: '唯一码', dataIndex: 'no', width: 170},
                {text: '国际款号', dataIndex: 'supply_style_no', width: 170},
                {text: '系统款号', dataIndex: 'system_style_no', width: 170},
                {text: '名称', dataIndex: 'name_zh', width: 100},
                {text: '颜色代码', dataIndex: 'supply_color_no', width: 70},
                {text: '颜色名称', dataIndex: 'color', width: 70},
                {text: '尺码', dataIndex: 'size', width: 70},
                {text: '单价', dataIndex: 'retail_price', width: 70},
                {
                    text: '商品状态', dataIndex: 'status',itemId:'status', width: 70, renderer: function (val) {
                    if (0 == val || null == val) return '<b class="text-danger">未入库</b>';
                    if (1 == val) return '<b class="text-success">已入库</b>';
                    if (2 == val) return '<b class="text-info">已上架</b>';
                    if (3 == val) return '<b class="text-warning">已下架</b>';
                    if (4 == val) return '<b class="text-primary">已出库</b>';
                    if (5 == val) return '<b class="text-primary">待移库</b>';
                    if (6 == val) return '<b class="text-primary">待收货</b>';
                    if (7 == val) return '<b class="text-primary">已售出</b>';
                }
                },
                {text: '所在仓库', dataIndex: 'warehouse_no', width: 70,itemId:'warehouse'},
                {text: '所在库位', dataIndex: 'location_no', width: 70,itemId:'location'},
                {text:'所在大店',dataIndex:'shops_name',itemId:'max_shops_id',width:70,
                    renderer:function(record,val,data){
                        var status=data.get("status");
                        if(status==7) return '<b>已出售</b>';
                        if(status!=4&&status!=7) return '<b></b>';
                        if(status==4) return '<b class="text-danger">'+data.get("shops_name")+'</b>';
                    }
                },
                {
                    text: '操作',
                    xtype: 'actioncolumn',
                    flex: 1,
                    items: [
                        {
                            iconCls: 'viewIcon columnAction',
                            tooltip: '查看',
                            handler: "viewGoodsInfo"
                        },
                        //{
                        //    iconCls: 'editIcon columnAction',
                        //    tooltip: '修改',
                        //    handler: "viewGoodsInfo"
                        //}
                    ]
                }
            ],
            store: 'GoodsListStore',
            bbar: ['->',
                {
                    xtype: 'pagingtoolbar',
                    store: 'GoodsListStore',
                    emptyMsg: '<b>暂无记录</b>',
                    displayMsg: '显示 {0} - {1} 总共 {2} 条记录',
                    displayInfo: true
                }, {
                    xtype: 'combo',
                    displayField: 'text',
                    valueField: 'val',
                    width: 60,
                    editable: false,
                    hideLabel: true,
                    store: Ext.create("Ext.data.Store", {
                        fields: [],
                        data: [
                            {text: 25, val: 25},
                            {text: 50, val: 50},
                            {text: 75, val: 75},
                            {text: 100, val: 100},
                        ]
                    }),
                    value: 25,
                    listeners: {
                        change: function (obj) {
                            var store = Ext.StoreManager.lookup("GoodsListStore");
                            if (store != null) {
                                store.setPageSize(obj.getValue());
                                store.load();
                            }
                        }
                    }
                }],
            listeners: {
                afterrender: function () {
                    this.getStore().load();
                }
            }
        });

        return goods_list_grid;
    }
});
