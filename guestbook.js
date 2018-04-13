window.onload = function(){

    var oUser = document.getElementById('user');
    var oReg = document.getElementById('reg');
    var oLogin = document.getElementById('login');
    var oUserInfo = document.getElementById('userinfo');
    var oList = document.getElementById('list');
    var oShowMore = document.getElementById('showMore');
    var iPage = 1;

    //初始化
    //首先执行函数更改右侧侧边栏的显示状态
    updateUserStatus();

    //初始化留言列表
    showList();

    //封装一个改变右侧栏显示状态的函数
    function updateUserStatus(){

        //获取cookie的uid 如果存在，将显示用户名,并隐藏登录和注册窗口
        var uid = getCookie('uid');

        var username = getCookie('username');
        if(uid){
            //如果是登陆状态
            oUser.style.display = 'block';
            oUserInfo.innerHTML = username;
            oReg.style.display = 'none';
            oLogin.style.display = 'none';
        }else{
            oUser.style.display = 'none';
            oUserInfo.innerHTML = '';
            oReg.style.display = 'block';
            oLogin.style.display = 'block';
        }
    }



    //封装一个添加留言函数,组装dom树
    function createList(data,insert){

        var oDl = document.createElement('dl');

        var oDt = document.createElement('dt');
        var oStrong = document.createElement('strong');
        oStrong.innerHTML = data.username;
        oDt.appendChild(oStrong);

        var oDd1 = document.createElement('dd');
        oDd1.innerHTML = data.content;

        var oDd2 = document.createElement('dd');
        oDd2.className = 't';
        var oA1 = document.createElement('a');
        oA1.href = '';
        oA1.innerHTML = '顶(<span>'+ data.support +'</span>)';
        var oA2 = document.createElement('a');
        oA2.href = '';
        oA2.innerHTML = '踩(<span>'+ data.oppose +'</span>)';
        oDd2.appendChild(oA1);
        oDd2.appendChild(oA2);

        oDl.appendChild(oDt);
        oDl.appendChild(oDd1);
        oDl.appendChild(oDd2);

        oContent.value = '';

        //如果存在第一条留言则insertBefore; 反之appendChild
        if(insert && oList.children[0]){
            oList.insertBefore(oDl,oList.children[0]);
        }else{
            oList.appendChild(oDl);
        }
    }


    /*
    验证用户名  用get方式
    get
        guestbook/index.php
            m : index
            a : verifyUserName
            username : 要验证的用户名
        返回
            {
                code : 返回的信息代码 0 = 没有错误，1 = 有错误
                message : 返回的信息 具体返回信息
            }
    */

    var oUsername1 = document.getElementById('username1');
    var oPassword1 = document.getElementById('password1');
    var oVerifyUserNameMsg = document.getElementById('verifyUserNameMsg');

    oUsername1.onblur = function(){
        ajax('get','guestbook/index.php','m=index&a=verifyUserName&username=' + this.value,function(data){
                // alert(data);
                var d = JSON.parse(data);

                oVerifyUserNameMsg.innerText = d.message;
                if(d.code){
                    oVerifyUserNameMsg.style.color = 'red';
                }else{
                    oVerifyUserNameMsg.style.color = 'green';
                }

        });
    }

    //用户注册 用post方式
    /*get/post
        guestbook/index.php
            m : index
            a : reg=
            username : 要注册的用户名
            password : 要注册的密码
        返回
            {
                code : 返回的信息代码 0 = 没有错误 1 = 有错误
                message : 返回的信息 具体的信息
            }*/

    var oRegBtn = document.getElementById('btnReg');
    oRegBtn.onclick = function(){
        ajax('post','guestbook/index.php','m=index&a=reg&username='+encodeURI(oUsername1.value)+'&password='+oPassword1.value, function(data){

            var d = JSON.parse(data);
            alert(d.message);

        });
    }

    //用户登录  用post方式
    /*get/post
        guestbook/index.php
            m : index
            a : login
            username : 要登录的用户名
            password : 要登录的密码
        返回
            {
                code : 返回的信息代码 0 = 没有错误 1 = 有错误
                message : 返回的信息 具体的信息
            }*/

    var oUsername2 = document.getElementById('username2');
    var oPassword2 = document.getElementById('password2');
    var oLoginBtn = document.getElementById('btnLogin');

    oLoginBtn.onclick = function(){
        ajax('post','guestbook/index.php','m=index&a=login&username='+encodeURI(oUsername2.value)+'&password='+oPassword2.value, function(data){

        var d = JSON.parse(data);
        alert(d.message);

            if(!d.code){ //d.code为0 说明返回的信息没有错误
                //登录成功 改变右侧栏布局
                updateUserStatus();
            }

        });
    }


    //用户退出 用get方式
    /*get/post
        guestbook/index.php
            m : index
            a : logout
        返回
            {
                code : 返回的信息代码 0 = 没有错误 1 = 有错误
                message : 返回的信息 具体的信息
            }*/

     var oLogout = document.getElementById('logout');
     oLogout.onclick = function(){
        ajax('get','guestbook/index.php','m=index&a=logout', function(data){

        var d = JSON.parse(data);
        alert(d.message);
            if(!d.code){ //d.code为0时 说明返回的信息没有错误 属正常情况
                //退出成功
                updateUserStatus();
            }
        });
        return false;
     }


    //留言板 用来发送留言  post方式
    /*  post
        guestbook/index.php{}
            m : index
            a : send
            content : 留言内容
        返回
            {
                code : 返回的信息代码 0 = 没有错误 1 = 有错误
                data : 返回成功留言的详细信息
                {
                    cid : 留言id
                    content : 留言内容
                    uid : 留言人的id
                    username : 留言人名称
                    dateline : 留言时间戳（秒）、
                    support : 当前这条留言的顶数量
                    oppose : 当前留言踩的数量
                }
                message : 返回的信息 具体的信息
            }*/

    var oContent = document.getElementById('content');
    var oPostBtn = document.getElementById('btnPost');

    oPostBtn.onclick = function(){
        ajax('post','guestbook/index.php','m=index&a=send&content='+encodeURI(oContent.value), function(data){

            var d = JSON.parse(data);
            alert(d.message);

            //留言添加到列表
            if(!d.code){
                createList(d.data,true);
            }

        });
    }


    //封装一个显示留言列表的函数  用get方式
    function showList(){
        /*  get
        guestbook/index.php{}
            m : index
            a : getList
            page : 获取留言的页码 默认为1
            n : 当前每页显示的条数 默认为10
        返回
            {
                code : 返回的信息代码 0 = 没有错误 1 = 有错误
                data : 返回成功留言的详细信息
                {
                    cid : 留言id
                    content : 留言内容
                    uid : 留言人的id
                    username : 留言人名称
                    dateline : 留言时间戳（秒）、
                    support : 当前这条留言的顶数量
                    oppose : 当前留言踩的数量
                }
                message : 返回的信息 具体的信息
            }*/

        //iPage当前为初始第一页，
        ajax('get','guestbook/index.php','m=index&a=getList&n=5&page='+iPage, function(data){

            var d = JSON.parse(data);
            var data = d.data; //获取留言数据

            if(data){ //如果没有数据 直接把显示更多隐藏
                for (var i = 0; i < data.list.length; i++) {
                    createList(data.list[i]);//添加留言
                }
            }else{
                if(iPage == 1){
                    oList.innerHTML = '现在还没有留言，快来抢沙发...';
                }
                oShowMore.style.display = 'none';
            }
        })
    }

    //点击显示更多留言
    oShowMore.onclick = function(){
        showList();
        iPage++;
    }


}

//拆解cookie
function getCookie(key){
    var arr1 = document.cookie.split('; ');
    for (var i = 0; i < arr1.length; i++) {
        var arr2 = arr1[i].split('=');
        if(arr2[0]==key){
            return arr2[1];
        }
    }
}

