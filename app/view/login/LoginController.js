Ext.define('erp.view.login.LoginController', {
        extend: 'Ext.app.ViewController',
        alias: 'controller.login',

        requires: [
            'Ext.form.action.Action'
        ],

        //用户登录按钮事件处理
        onLoginbtnClick: function () {
            var form = this.lookupReference('form'),me=this;
            if (form.isValid()) {
                form.getForm().submit({
                    clientValidation: false,
                    waitMsg:'正在登入系统...',
                    url: apiBaseUrl + '/index.php/System/Index/loginSystem',
                    success: function (form, action) {
                        console.log(action);
                        if(!action.result.success){
                            Ext.toast("登录失败,请重试!","系统提示");
                            return;
                        }
                        var val = form.getValues();
                        if(val.remember == "on"){
                            localStorage.setItem("username",val.username);
                            localStorage.setItem("password",val.password);
                        }else{
                            localStorage.setItem("username","");
                            localStorage.setItem("password","");
                        }
                        localStorage.setItem("is_login",1);
                        localStorage.setItem("user",val.username);
                        localStorage.setItem("userInfo",Ext.encode(action.result.data));
                        me.getView().destroy();
                        Ext.widget("main");

                        //var win = Ext.gui.Window.get()
                        //win.setResizable(true);
                        //win.maximize();
                    },
                    failure: function (form, action) {
                        switch (action.failureType) {
                            case Ext.form.action.Action.CLIENT_INVALID:
                                Ext.Msg.alert('系统提示', '表单验证错误');
                                break;
                            case Ext.form.action.Action.CONNECT_FAILURE:
                                Ext.Msg.alert('系统提示', '远程连接错误，请稍后重试');
                                break;
                            case Ext.form.action.Action.SERVER_INVALID:
                                Ext.Msg.alert('系统提示', action.result.msg);
                        }
                    }
                });
            }
        }
    }
);