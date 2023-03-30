console.log ( '%c%s', 'color: red; font: 2.2rem/1 Tahoma;', "WARNING" );
console.log ( '%c%s', 'color: white; font: 0.8rem/1 Tahoma;', "Эта функция предназначена только для" );
console.log ( '%c%s', 'color: yellow; font: 0.8rem/1 Tahoma;', "РАЗРАБОТЧИКОВ" );
console.log ( '%c%s', 'color: white; font: 0.8rem/1 Tahoma;', "Если кто-то пообещал бесплатные деньги или любую другую выгоду за копирование чего-либо, он попытается получить доступ к вашей учетной записи, чтобы обмануть вас." );

var imSocket = null;

window.global_data = {
    data_url_localhost: 'http://localhost:3000',
    data_url_server: `https://${location.hostname}`,
    data_url_localhost_non: 'http://localhost',
};

if (typeof browser === "undefined") {
    if(typeof chrome != "undefined")
    {
        var browser = chrome;
    }
}

//========= Cookies ===================================================================

function getURL() 
{
    if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
        return window.global_data.data_url_localhost_non + "/tbot";
    } else {
        return window.global_data.data_url_server;
    }
}

function delCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    location.reload();
}

function getCookie(name) {

    var dc = document.cookie;
    var prefix = name + "=";
    var begin = dc.indexOf("; " + prefix);
    if (begin == -1) {
        begin = dc.indexOf(prefix);
        if (begin != 0) return null;
    }
    else
    {
        begin += 2;
        var end = document.cookie.indexOf(";", begin);
        if (end == -1) {
        end = dc.length;
        }
    }
    return decodeURIComponent(dc.substring(begin + prefix.length, end));

}

function _getCookie(name) {
    var matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
  }

function setCookie(name, value, days, path) {
    
    path = path || '/';
    days = days || 1000;

    value = encodeURIComponent(value);

    var last_date = new Date();
    last_date.setDate(last_date.getDate() + days);
    var value = escape(value) + ((days==null) ? "" : "; expires="+last_date.toUTCString());
    document.cookie = name + "=" + value + "; path=" + path; // вешаем куки
}

function _GET(key) {

    var s = window.location.search;
    s = s.match(new RegExp(key + '=([^&=]+)'));
    return s ? s[1] : false;

}

function _GET__(key) {

    var s = window.location.href;
    s = s.match(new RegExp(key + '=([^&=]+)'));
    return s ? s[1] : false;

}

//======== mains ======================================================================

async function postData(url, data) {
    const response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            //'Content-Type': 'application/json'
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: data
    });
    return await response.json();
}

var connectReload = false;

function io_connect(callback) 
{
    delete imSocket;
    imSocket = null;
    var url = null;
    if (location.hostname === "localhost" || location.hostname === "127.0.0.1" || location.hostname === "localhost.ru") {
        url = global_data.data_url_localhost;
        imSocket = io(url, {transports: ['polling']});
    } else {
        url = global_data.data_url_server;
        imSocket = io(url, {transports: ['websocket', 'polling']});
    }
    imSocket.on('connect', function() {
        if(!connectReload)
        {
            console.log("Сервер подключен к: " + url);
            connectReload = true;
            if(callback) {
                callback();
            }
        } else {
            location.reload();
        }
    });
}

function getURL() 
{
    if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
        return window.global_data.data_url_localhost_non;
    } else {
        return window.global_data.data_url_server;
    }
}

function updateURL(url) {
    if (history.pushState) {
        var baseUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
        var newUrl = baseUrl + '?' + url;
        history.pushState(null, null, newUrl);
    }
    else {
        console.warn('History API не поддерживается');
    }
}

function truncate(input, num) {
    if (input.length > num)
       return input.substring(0,num) + '...';
    else
       return input;
};

function socketPost(param, action, data, callback) {
    data = data || {};
    imSocket.emit(param, {
        action: action,
        data: data
    },function(response){
        if(callback) callback(response);
    });
}

function include(url) {
    var script = document.createElement('script');
    script.src = url;
    document.getElementsByTagName('head')[0].appendChild(script);
}


// Components ==========================

function PostComponents(action, json, callback)
{
    imSocket.emit('components', {
        action: action,
        data: json
    },function(response){
        callback(response)
    });
}

function indexOf(array, item) {
    return $$1.inArray(item, array);
}

function myLoadScript(sScriptSrc, oCallback,id)
{
    var oHead = document.getElementsByTagName('head')[0];
    var oScript = document.createElement('script');
    oScript.type = 'text/javascript';
	oScript.charset="utf-8";
    oScript.src = sScriptSrc;

    if(typeof id != "undefined")
    {
        oScript.id = id;
    }

    oScript.onload = oCallback;
    oScript.onreadystatechange = function()
    {
        if ((this.readyState == 'complete') || (this.readyState == 'loaded')) {
            oCallback();
        }
    }
    oHead.appendChild(oScript);
}

function loadResources(array,callback)
{
    var sync_array = [];
    array.forEach(function(item){
        sync_array.push(function(item, callback){
            myLoadScript(item,function(){
                callback(null,true);
            });
        }.bind(null,item))
    });

    if(sync_array.length > 0)
    {
        async.parallel(sync_array,function(err, results) {
            callback(true)
        });
    }else
    {
        callback(true)
    }
}

function saveUrlAsFile(url, fileName) {    
    var link = document.createElement("a");    
    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    link.click();
}

function DownLoadFileAjax(urlToSend, NameFile) 
{
    var req = new XMLHttpRequest();
    req.open("GET", urlToSend, true);
    req.responseType = "blob";
    req.onload = function (event) {
        var blob = req.response;
        var fileName = req.getResponseHeader(NameFile)
        var link=document.createElement('a');
        link.href=window.URL.createObjectURL(blob);
        link.download=fileName;
        link.click();
    };

    req.send();
}

var setValue = function(elem, value, inc, shift, speed){
    var interval = false; 
    if (inc) {
        interval = setInterval(function(){
            if (elem.innerHTML*1+shift >= value) {
                elem.innerHTML = value;
                clearInterval(interval);
            } else {
                elem.innerHTML = elem.innerHTML*1+shift;
            }
        }, speed);
    } else {
        interval = setInterval(function(){
            if (elem.innerHTML*1-shift <= value) {
                elem.innerHTML = value;
                clearInterval(interval);
            } else {
                elem.innerHTML = elem.innerHTML*1-shift;
            }
        }, speed);
    }
};

Number.prototype.toDivide = function() {
    var int = String(Math.trunc(this));
    if(int.length <= 3) return int;
    var space = 0;
    var number = '';

    for(var i = int.length - 1; i >= 0; i--) {
        if(space == 3) {
            number = ' ' + number;
            space = 0;
        }
        number = int.charAt(i) + number;
        space++;
    }

    return number;
}

function DateFormatted(data)
{
    function pad(s, width, character) {
        return new Array(width - s.toString().length + 1).join(character) + s;
    }

    var maxDate             = new Date(Number(data.toString()));
    return pad(maxDate.getDate(), 2, '0') + '.' + pad(maxDate.getMonth() + 1, 2, '0') + '.' + maxDate.getFullYear();
}

String.prototype.RedactingNumber = function () {
    return this.replace(/\s/g, '');
}

String.prototype.ReplaceNumber = function () {
    return this.replace(/(\d)(?=(\d{3})+([^\d]|$))/g, '$1 ')
}

Date.prototype.customFormat = function(formatString) {
    var YYYY,YY,MMMM,MMM,MM,M,DDDD,DDD,DD,D,hhhh,hhh,hh,h,mm,m,ss,s,ampm,AMPM,dMod,th;
    YY = ((YYYY=this.getFullYear())+"").slice(-2);
    MM = (M=this.getMonth()+1)<10?('0'+M):M;
    MMM = (MMMM=["January","February","March","April","May","June","July","August","September","October","November","December"][M-1]).substring(0,3);
    DD = (D=this.getDate())<10?('0'+D):D;
    DDD = (DDDD=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][this.getDay()]).substring(0,3);
    th=(D>=10&&D<=20)?'th':((dMod=D%10)==1)?'st':(dMod==2)?'nd':(dMod==3)?'rd':'th';
    formatString = formatString.replace("#YYYY#",YYYY).replace("#YY#",YY).replace("#MMMM#",MMMM).replace("#MMM#",MMM).replace("#MM#",MM).replace("#M#",M).replace("#DDDD#",DDDD).replace("#DDD#",DDD).replace("#DD#",DD).replace("#D#",D).replace("#th#",th);
    h=(hhh=this.getHours());
    if (h==0) h=24;
    if (h>12) h-=12;
    hh = h<10?('0'+h):h;
    hhhh = hhh<10?('0'+hhh):hhh;
    AMPM=(ampm=hhh<12?'am':'pm').toUpperCase();
    mm=(m=this.getMinutes())<10?('0'+m):m;
    ss=(s=this.getSeconds())<10?('0'+s):s;
    return formatString.replace("#hhhh#",hhhh).replace("#hhh#",hhh).replace("#hh#",hh).replace("#h#",h).replace("#mm#",mm).replace("#m#",m).replace("#ss#",ss).replace("#s#",s).replace("#ampm#",ampm).replace("#AMPM#",AMPM);
};

function pad(s, width, character) {
    return new Array(width - s.toString().length + 1).join(character) + s;
}

function getTimeRemaining(endtime) 
{
	var t = 259200000 - (Number(new Date().getTime().toString()) - Number(endtime.toString()));
	var total = t;
	var miliSeconds = t % 1000; 
	t = t / 1000 | 0;
	var seconds = t % 60; 
	t = t / 60 | 0;
	var minutes = t  % 60;
	t = t / 60 | 0;
	var hours = t ;
	return {
		'total': total,
		'hours': hours,
		'minutes': minutes,
		'seconds': seconds,
		'miliSeconds' : miliSeconds
	};
}

Date.prototype.toDateInputValue = (function() {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0,10);
});

function findOfArrayOn_id(arr, value) {
    for (var i = 0; i < arr.length; i++)
        if (arr[i]["_id"] == value)
            return arr[i].data;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}