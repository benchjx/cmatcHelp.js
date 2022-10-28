// ==UserScript==
// @name         气象干部培训学院科学学习
// @version      1.5
// @description  1.首次打开主页时自动跳转登录页面；2.手动输入id密码登录（第2次会自动输入）；3.打开“个人中心”的页面，即教学平台-个人中心：然后程序会自动刷新。这个页面不能关闭，用来保持不掉线。4.进入需要学习的课程，每次学习时，点击“科学学习”，即可打开多个页面，同时学习；5.不会出现“点击继续观看”的弹出框；
// @author       不晓得是哪个整的!
// @match        http://*.cmatc.cn/*
// @match        http://*.cma.cn/*
// @match        https://*.cmatc.cn/*
// @match        https://*.cma.cn/*
// @license      GPL-3.0 License
// @exclude      http://www.cmatc.cn/lms/app/lms/lesson/Lesson/studentSelectLesson.do*
// @exclude      http://www.cmatc.cn/lms/app/tms/trainclass/Trainclass/trainclassIndex.do*
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// ==/UserScript==

(function() {
    $(document).ready(function(){
    var userid=window.localStorage.getItem("userid");
    var password=window.localStorage.getItem("password");
	var url=window.location.href.toLowerCase();
	console.log(url);
    var clearDiv="<div id='studentId' style='width:250px;font-size:12px;background-color:#fff;border:#ccc solid 1px;position:fixed;left:3px;top:3px;z-index:9999'>";
	clearDiv+="当前ID号："+ userid + "</div>";
	$("body").append(clearDiv);
	function autoLogin()
	{
		$("#txtusername").val(userid);
		$("#txtpassword").val(password);
		$("input[name='submxxit']").click();
	}
	$("#fm1").submit(function(e){
	   userid=$("#txtusername").val();
	   password=$("#txtpassword").val();
	   window.localStorage.setItem("userid",userid);
       window.localStorage.setItem("password",password);
	   console.log("账号密码"+ userid+","+password);
	});
	$('input[name="submxxit"]').click(function()
	{
	   userid=$("#txtusername").val();
	   password=$("#txtpassword").val();
	   window.localStorage.setItem("userid",userid);
       window.localStorage.setItem("password",password);
	   console.log("账号密码"+ userid+","+password);
	});
	//登录页面自动登录
	if(url.indexOf("sso/login")!=-1){
		$("body").append(clearDiv);
		if(userid==null || userid=="null" || userid==""){
			console.log("ID为空");return;
		}
		$("#txtusername").val(userid);
		$("#txtpassword").val(password);
		hintMsg();
	}
	var tt=20;
	function hintMsg()
	{
		if(tt===0)
		{
			autoLogin();
			return;
		}
		else
		{
			tt--;
			$("input.btn-submit").val(tt+"秒后将自动登录");
		}
		setTimeout(function(){
			hintMsg();
		},1000);
	}
	if(url.indexOf("/index/index.shtml")!=-1){
		var loginMsg=$("#loginMsg").text();
		setTimeout(function(){
			window.location.href="http://www.cmatc.cn/lms/app/appsecurity/user/Student/self.do";
		},120000);
		if(loginMsg=="用户登录")
		{
			window.location.href="http://www.cmatc.cn/sso/login?service=http%3A%2F%2Fwww.cmatc.cn%2Flms%2Fj_spring_cas_security_check";
		}
	}
	//学员首页120秒跳转个人信息，跳来跳去不掉线loginMsg
	if(url.indexOf("userdashboardinfo/show.do")!=-1){
		//console.log("StudyContent");
		setTimeout(function(){
			window.location.href="http://www.cmatc.cn/lms/app/appsecurity/user/Student/self.do";
		},120000);
		if(loginMsg=="用户登录")
		{
			window.location.href="http://www.cmatc.cn/sso/login?service=http%3A%2F%2Fwww.cmatc.cn%2Flms%2Fj_spring_cas_security_check";
		}
	}
    /*if(url.indexOf("lookupLessonlist.do")!=-1){
        $(".col-xs-3").each(function(){
			var aTag=$(this).find("a.tu");
            console.log(aTag);


        });
    }*/
	//个人中心120秒跳转个人信息，跳来跳去不掉线
	if(url.indexOf("studycontent/year.do")!=-1){
		//console.log("StudyContent");
		var loginMsg1=$("#loginMsg").text();
		setTimeout(function(){
			window.location.href="http://www.cmatc.cn/lms/app/appsecurity/user/Student/self.do";
		},120000);
		if(loginMsg1=="用户登录")
		{
			window.location.href="http://www.cmatc.cn/sso/login?service=http%3A%2F%2Fwww.cmatc.cn%2Flms%2Fj_spring_cas_security_check";
		}
	}
	//个人信息120秒跳转个人中心，跳来跳去不掉线
	if(url.indexOf("student/self.do")!=-1){
		//console.log("self");
		var loginMsg2=$("#loginMsg").text();
		setTimeout(function(){
			window.location.href="http://www.cmatc.cn/lms/app/tms/sfi/StudyContent/year.do";
		},120000);
		if(loginMsg2=="用户登录")
		{
			window.location.href="http://www.cmatc.cn/sso/login?service=http%3A%2F%2Fwww.cmatc.cn%2Flms%2Fj_spring_cas_security_check";
		}
	}
	var errorMsgCount=0;
	//防止出现“点击继续观看”
	if(url.indexOf("enterurl")!=-1 || url.indexOf("stream2")!=-1 ){
		console.log("这是学习的页面");
		$("#studentId").text("10秒后自动开始");
		setInterval(function(){
			try{
				$("#msgbt").click();//点击继续播放
				$(".user_choise").click();//点击开始播放
				$("#course_player").prop("muted",1);//静音
				$("#ckplayer_a1").prop("muted",1);//静音
				$("video").prop("muted",1);//静音
				$("#studentId").hide();//隐藏id号
			}catch(err)
			{
				errorMsgCount=errorMsgCount+1;
				if(errorMsgCount<=3)console.log(err);
			}
		},10000);
	}
	//加装科学学习按钮
	if(url.indexOf("userselectlesson/show.do")!=-1){
		//var by=$("body").text();
		//var matchReg = /(?<=lessonGkey).*?(?=coursewareGkey)/;
		//var lessonGkey=by.match(matchReg);
		//lessonGkey=lessonGkey.toString().replace(/[&=]/g,"");
		//console.log('lessonGkey:'+lessonGkey);
		$("a.learn").each(function(){
			var sp=$(this);
			if(sp.text()=="学习"){
				sp.css("background-color","grey");
				//sp.css("display","none");
				var onclck_str=sp.attr("onClick");
				var msgs=onclck_str.substring(23,onclck_str.length-2);
				var lst=msgs.split(',');
				var lessonId=lst[0].replace(/\'/g, "");
				var coursewareId=lst[1].replace(/\'/g, "");
				var coursewareGkey=lst[2].replace(/\'/g, "");
				//var lessonOrigin=lst[3].replace(/\'/g, "");
				var standard=0;
                //http://www.cmatc.cn/lms/app/lms/student/Learn/enter.do?lessonId=59452&coursewareId=-59452815&lessonGkey=3513fg0302&tclessonId=0&lessonOrigin=selflearn
                //                                         javascript:startLesson(562951064231330,562951064231331,'b83fff4c-e931-4bfd-8837-b27c92320f03');
                //http://www.cmatc.cn/lms/app/lms/student/Learn/enter.do?lessonId=562951064231330&coursewareId=562951064231331&lessonGkey=b83fff4c-e931-4bfd-8837-b27c92320f03&tclessonId=0&lessonOrigin=selflearn
				var url="http://www.cmatc.cn/lms/app/lms/student/Learn/enterUrl.do?lessonId=" +
				lessonId + "&coursewareId=" +
				coursewareId + "&coursewareGkey=" +
				coursewareGkey;
				if(standard!=4){
					url = "http://www.cmatc.cn/lms/app/lms/student/Learn/enter.do?lessonId=" +
					lessonId + "&coursewareId=" +
					coursewareId + "&lessonGkey="+
					coursewareGkey + "&tclessonId=0&lessonOrigin=selflearn";
				}
				//var spans='<span unname="unnamedisabled" class="btn btn-success" onclick=""><a style="color:#fff;" target=_blank href="'+url+'">科学学习</a></span>';
                var spans='<a class="learn" style="color:red;" target=_blank href="'+url+'">科学学习</a>';
				$(this).after(spans);
			}
		});
	}
    });
})();