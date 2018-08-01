// ==UserScript==
// @name         让TGFCER更美好
// @namespace    http://www.jun4rui.com/(其实并没有)
// @version      0.7
// @description  让讨厌的苍蝇走开！
// @author       jun4rui
// @match        http://wap.tgfcer.com/*
// @match        https://wap.tgfcer.com/*
// @require      https://raw.githubusercontent.com/ccampbell/mousetrap/master/mousetrap.js
// @grant        none
// ==/UserScript==

/**
 * 0.7更新：支持http和https
 * 0.6更新：支持https
 * 0.5更新：修复一些条件处理，修复新出现的附件路径在WAP版下错误的问题
 * 0.4更新：新建自动识别图片并加上[img]标签的功能
 * 0.3更新：卷动到最底部自动载入下一页内容；[作废]
 * 0.2更新：将Footer的功能全部放在顶部固定的导航条中；
 */
//20160310 加入按住CTRL键后鼠标移动到图片上会自动在左下角显示图片的方法
$('div.message>a').mouseover(function(){
	var currentEvent = window.event;
	//console.log(currentEvent);
	if (currentEvent.ctrlKey){
		$('#float-img').remove();
		$('body').append('<img src="'+$(this).attr('href')+'" class="mousetrap" id="float-img" style="width:200px;position:fixed; left:'+currentEvent.clientX+'px;top:'+currentEvent.clientY+'px; z-index:99999;">');
	}
}).mouseout(function(){
	$('#float-img').remove();
});


//初始化localStorate
if (JSON.parse(window.localStorage.getItem('USER_MEMO'))===null){
	window.localStorage.setItem('USER_MEMO','{}');
}
//更新/显示 屏幕上用户备注的函数
function showUserMemo() {
	//从localStorage获取用户信息
	var userMemo = JSON.parse(window.localStorage.getItem('USER_MEMO'));
	$('.user-memo').remove();
	$("a[href^='index.php?action=my&uid='],a[href^='index.php?action=my&pic=&uid='],,a[href^='index.php?action=my&pic=1&uid=']").each(function () {
		//跳过评分的
		/*if ($(this).text()=='评分'){
		 return false;
		 }*/
		var userUID = $(this).attr('href').split('&')[1].replace('=', '');
		if ($(this).attr('href').indexOf('index.php?action=my&pic=&uid=') > -1 || $(this).attr('href').indexOf('index.php?action=my&pic=1&uid=') > -1) {
			userUID = $(this).attr('href').split('&')[2].replace('=', '');
		}
		if (typeof(userMemo[userUID]) != 'undefined') {
			$(this).after('<span class="user-memo" uid="' + userUID + '">[' + userMemo[userUID] + ']</span>');
		} else {
			$(this).after('<span class="user-memo" uid="' + userUID + '">[+]</span>');
		}
	});
}

showUserMemo();
//更新localStorage中用户备注的函数
function updateUserMemo(inUID, inMemo){
	var _userMemo = JSON.parse(window.localStorage.getItem('USER_MEMO'));
	if (inMemo===''){
		delete _userMemo[''+inUID];
	}else{
		_userMemo[inUID] = inMemo;
	}
	window.localStorage.setItem('USER_MEMO',JSON.stringify(_userMemo));
}
//console.log(userMemo);
//将用户的备注信息保存到localStorage中的USER_MEMO中去
//window.localStorage.setItem('USER_MEMO',JSON.stringify(userMemo));
//JSON.parse(window.localStorage.getItem('USER_MEMO'));
//用户备注编辑功能
/*
if ( window.location.href.indexOf('http://wap.tgfcer.com/index.php?action=my&uid=')==0 || window.location.href.indexOf('http://wap.tgfcer.com/index.php?action=my&pic=&uid=')==0){
	var tempUID = window.location.href.split('&')[1].replace('=','');
	if (window.location.href.indexOf('http://wap.tgfcer.com/index.php?action=my&pic=&uid=')==0){
		tempUID = window.location.href.split('&')[2].replace('=','');
	}
	$("a[href^='http://club.tgfcer.com/space.php?action=viewpro&uid=']").after('<br/>用户备注：<input type="text" id="user-memo" value="'+(userMemo[tempUID]||'')+'" /><input type="button" id="user-memo-submit" value="更新" /><br/>');
	//更新用户备注
	$('#user-memo-submit').click(function(){
		userMemo[tempUID] = $('#user-memo').val();
		window.localStorage.setItem('USER_MEMO',JSON.stringify(userMemo));
	});
}
*/
//20160311 点击用户备注后出现弹出框修改备注
$(document).delegate('.user-memo','click', function(){
	var _inputUserMemo = prompt('更新该用户的备注信息', $(this).text());
	updateUserMemo($(this).attr('uid'), _inputUserMemo);
	showUserMemo();
});



//20160306加入CSS样式函数
function addStyle(css) {
	var head, style;
	head = document.getElementsByTagName('head')[0];
	if (!head) {
		return;
	}
	style = document.createElement('style');
	style.type = 'text/css';
	style.innerHTML = css;
	head.appendChild(style);
}
//20160306
addGlobalStyle(".face-unit {width: 64px;height: 64px;cursor: pointer;}");	//表情样式
addGlobalStyle(".user-memo {padding:0 .5em; color:#F00; cursor:pointer}");	//用户备注样式

//CTRL+ENTER提交
$('textarea[name=message]').addClass('mousetrap');
Mousetrap.bind('ctrl+enter', function(){
	$('input[name=submit]').click();
});

// 20160303 自动识别图片并加上[img]标签
$('textarea[name=message]').after('<br/><span id="funcAddImg">[上图]</span>');
$('#funcAddImg').click(function(){
	$('textarea[name=message]').val(
		$('textarea[name=message]').val().replace(/((http|https){1}:\/\/[\/A-Za-z0-9\-\.\_]+\.(jpg|gif|png){1})/g,'[img]$1[/img]')
	);
});
//20160303 表情库
var facelist = [
	"http://q.qqbiaoqing.com/q/2014/04/04/3b9dd4610a7c4441f669eaaf17a5e07f.gif",
	"http://q.qqbiaoqing.com/q/2014/04/04/54ab31bea85da956cff6e3a4c028711c.gif",
	"http://q.qqbiaoqing.com/q/2014/04/04/bc93564b9561ee1f40b143a84c6601ec.gif",
	"http://q.qqbiaoqing.com/q/2014/04/07/34e0ac1c4a657ed18a7c2635875572da.gif",
	"http://q.qqbiaoqing.com/q/2014/04/07/6ec347902a274b43ee50c27b63ca4f73.gif",
	"http://q.qqbiaoqing.com/q/2014/04/09/cbf2cbe1c113ffb676c2cf4c4e93bd08.gif",
	"http://q.qqbiaoqing.com/q/2014/04/14/353cc9df8e3aa160eac1d2db35a125b3.gif"
];
$('textarea').after('<div id="face-panel" style="display:block;"></div>');
for (var i in facelist){
	$('#face-panel').append('<img src="'+facelist[i]+'" class="face-unit" />');
}
$('.face-unit').click(function(){
	//console.log($(this).attr('src'));
	$('textarea[name=message]').val($('textarea[name=message]').val()+('[img]'+$(this).attr('src')+'[/img]'));
});


//先判断有没有localStorage保存的设置数据，没有则新建
if (typeof(localStorage.BanList)=='undefined'){
	localStorage.BanList	= '';
}

//测试用的屏蔽用户ID串，用英文的逗号分隔
var BanList = localStorage.BanList;
var BanListArray = BanList.split(',');
//添加全局CSS样式的方法
function addGlobalStyle(css) {
	var head, style;
	head = document.getElementsByTagName('head')[0];
	if (!head) { return; }
	style = document.createElement('style');
	style.type = 'text/css';
	style.innerHTML = css;
	head.appendChild(style);
}
//不让图片尺寸超过屏幕的最大宽度，有时候图片太大了看起来好累
addGlobalStyle('div.message>img {max-width:100%;}');
//让顶部导航栏浮动固定
//加入顶部导航栏是否存在的判断
if ($('#scroller>.navbar').length>0){
	addGlobalStyle('#scroller>.navbar {position:fixed;height:28px;line-height:28px;width:100%;top:0;left:0;box-shadow: 5px 1px 5px #888888;} body {padding-top:36px;}');
}

//列表页面
var PageList = 'http://wap.tgfcer.com/index.php?action=forum';
//帖子内文页面
var PageInfo = 'http://wap.tgfcer.com/index.php?action=thread';
//当前页面
var PageCurrent = window.location.href;

//将Footer中的功能全部添加到顶部nacbar
$('#footer a').each(function(){
	$('#scroller>.navbar').append('&nbsp|&nbsp;<a class="nav_link" href="'+$(this).attr('href')+'">'+$(this).text()+'</a>');
});
//在原生导航栏中加入设置模块
$('div.navbar').append('&nbsp;|&nbsp;<a href="#" class="nav_link" id="tgbs-btn" title="让TGFCER更美好的设置">屏蔽</a>');
//点击模块的处理
$('#scroller').delegate('#tgbs-btn', 'click', function(){
	if ($('#tgbs').css('display')=='none'){
		$('#tgbs').css({'display':''});
		$('#tgbs').css('top',$('#tgbs-btn').position().top+20);
		$('#tgbs').css('left',$('#tgbs-btn').position().left-20);
		$('#tgbs textarea').focus();
		//添加"加入到ban"按钮
		$('#scroller .infobar').each(function(){
			$(this).find('a').eq(1).after('<button class="add-to-ban" value="'+$(this).find('a').eq(1).text()+'">+屏蔽</button>');
		});
	}else{
		//关闭设置菜单时，清除所有"加入到ban"按钮并关闭设置面板
		$('.add-to-ban').remove();
		$('#tgbs').css({'display':'none'});
		// 保存数据到localStorage
		localStorage.BanList = $('#banlist-textarea').val();
		BanList = localStorage.BanList;
		BanListArray = BanList.split(',');
	}
});
//处理点击'.add-to-ban'按钮
$('.infobar').delegate('.add-to-ban', 'click', function(){
	$('#banlist-textarea').val($('#banlist-textarea').val()+','+$(this).attr('value'));
});
//在原生导航栏下面加入设置表单
$('div.navbar').append('<div id="tgbs" style="color:#FFF; width:500px;padding:.5em;position:fixed; display:none; overflow:hidden;box-shadow: rgb(51, 51, 51) 1px 1px 19px;background-color: #436193;">屏蔽ID列表:<br/><textarea id=\"banlist-textarea\" style="width:100%;height:160px;">'+BanList+'</textarea></div>');









//点击屏蔽区将展开屏蔽内容
$('#scroller').delegate('.list-ban-section', 'click', function(){
	if ($(this).css('height')=='21px'){
		$(this).css({'height':'auto'});
	}else{
		$(this).css({'height':'21px'});
	}

});
//如果当前页面是列表页面的处理
//console.log(PageCurrent.indexOf(PageList));
if (PageCurrent.indexOf(PageList)==0){
	//console.log('当前在列表页面');
	$('.dTitle').each(function(){
		var author = $(this).find('span.author').text();
		for (i in BanListArray){
			//判断发帖人是否在屏蔽列表中
			if (author.indexOf(BanListArray[i])==1){
				//console.log(author.indexOf(BanListArray[i]),BanListArray[i]);
				$(this).addClass('list-ban-section');
				$(this).prepend('<div style="width:auto;text-align:center;border:1px dashed #DEDEDE;color:#DEDEDE; line-height:19px;"><strong>'+BanListArray[i]+'</strong>已被屏蔽</div>');
				$(this).css({'height':'21px','overflow':'hidden'});
			}
		}
	});
}


$('#scroller').delegate('.info-ban-section', 'click', function(){
	if ($(this).next().css('display')=='none'){
		$(this).next().css({'display':'inherit'});
		$(this).next().next().css({'display':'inherit'});
		$(this).next().next().next().css({'display':'inherit'});
		$(this).next().next().next().next().css({'display':'inherit'});
		$(this).next().next().next().next().next().css({'display':'inherit'});
	}else{
		$(this).next().css({'display':'none'});
		$(this).next().next().css({'display':'none'});
		$(this).next().next().next().css({'display':'none'});
		$(this).next().next().next().next().css({'display':'none'});
		$(this).next().next().next().next().next().css({'display':'none'});
	}

});
//如果当前页面是内容页的处理
if (PageCurrent.indexOf(PageInfo)===0){
	$('.infobar').each(function(){
		var author = $(this).find('a').eq(1).text();
		for (i in BanListArray){
			//判断发帖人是否在屏蔽列表中
			if (author==BanListArray[i]){
				console.log(author.indexOf(BanListArray[i]),BanListArray[i]);
				//$(this).addClass('ban-section');
				$(this).before('<div class="info-ban-section" style="cursor:pointer;width:auto;text-align:center;border:1px dashed #DEDEDE;color:#DEDEDE; line-height:19px;"><strong>'+BanListArray[i]+'</strong>已被屏蔽</div>');
				//依次连续隐藏5个（含自己）元素
				$(this).css({'display':'none'});
				$(this).next().css({'display':'none'});
				$(this).next().next().css({'display':'none'});
				$(this).next().next().next().css({'display':'none'});
				$(this).next().next().next().next().css({'display':'none'});
			}
		}
	});
}

$('a,img').each(function(){
    //http://club.tgfcer.net/attachments/day_161028/20161028_1961_b8a13d57423b4516164e5LCjwkFkRZ6O.jpg
    //获取所有的a和img元素
    console.log($(this));
    var linkType = '';
    var linkUrl  = '';
    if ($(this).is('a')){
        linkType = 'href';
    }
    if ($(this).is('img')){
        linkType = 'src';
    }
    linkUrl = $(this).attr(linkType);
    console.log('linkType:',linkType,'\n','linkUrl:',linkUrl);
    //排除掉所有非attachments目录下的
    if (typeof(linkUrl)!='undefined' && linkUrl.indexOf('http://club.tgfcer.com/attachments/')>-1){
        $(this).attr(linkType, linkUrl.replace('tgfcer.com','tgfcer.net'));
    }
});

//举动到最下方自动载入下一页内容
/*
 $(window).scroll(function(){
 //如果在运行别执行
 if (runFlag){
 return;
 }
 var runFlag = true;
 //console.log($(document).height(),$(document).scrollTop(),$(window).height(),$(document).scrollTop()+$(window).height(),$(document.body).outerHeight(true));
 //检查是否滚动到页面底部
 if($(document).height()==$(document).scrollTop()+$(window).height()){
 //读取下一页的url
 for (var i=0; i<$('#scroller span.paging a').length; i++){
 if ($('#scroller span.paging a').eq(i).text()=='下页'){
 //将下一页内容载入
 console.log('url:',$('#scroller span.paging a').eq(i).attr('href'));
 $.get($('#scroller span.paging a').eq(i).attr('href'), function(result,status){
 console.log('DATA:'+$(result).find('#scroller .dTitle'));
 $('#scroller span.paging').after('<hr/>');
 $('#scroller span.paging').after($(result).find('#scroller .dTitle'));
 runFlag = false;
 });
 //删除本页的翻页用下一页翻页替换
 }
 }
 }
 });
 */
