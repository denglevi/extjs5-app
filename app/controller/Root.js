/**
 * Created by Administrator on 2015-07-13.
 */
/**
 * The main application controller. This is a good place to handle things like routes.
 * 这是主程序的控制器，这里适合做类似路由转发这样的事情
 */
Ext.define('erp.controller.Root', {
    extend: 'Ext.app.Controller',
    uses: ['erp.view.login.Login', 'erp.view.main.Main'],
    /**
     * 初始化事件
     */
    onLaunch: function () {
        var session = this.session = new Ext.data.Session();
        if (Ext.isIE8) {
            Ext.Msg.alert('亲，本例子不支持IE8哟');
            return;
        }
        ;

        this.login = new erp.view.login.Login({
            session: session,
            listeners: {
                scope: this,
                login: 'onLogin'
            }
        });
    },
    /**
     * logincontroller 的 "login" 事件回调.
     * @param user
     * @param loginManager
     */
    onLogin: function (username, loginController) {
        this.login.destroy();
        this.user = username;
        this.showUI();
    },

    showUI: function () {
        Ext.getBody().unmask();
        console.log('show ui started');
        //显示主界面
        this.viewport = new erp.view.main.Main(
            {   //用户信息传入视图
                viewModel: {
                    data: {
                        currentUser: this.user
                    }
                }
            }
        );
    }
});