/*
 * This file is part of Xpra.
 * Copyright (C) 2016-2021 Antoine Martin <antoine@xpra.org>
 * Copyright (c) 2016 Spikes, Inc.
 * Licensed under MPL 2.0, see:
 * http://www.mozilla.org/MPL/2.0/
 *
 */

'use strict';

var Utilities = {
	VERSION : "4.2",
	REVISION : 882,
	LOCAL_MODIFICATIONS : 0,
	BRANCH : "master",

	exc : function() {
		if (console) {
			console.error.apply(console, arguments);
		}
	},
	error : function() {
		if (console) {
			console.error.apply(console, arguments);
		}
	},
	warn : function() {
		if (console) {
			console.log.apply(console, arguments);
		}
	},
	log : function() {
		if (console) {
			console.log.apply(console, arguments);
		}
	},
	debug : function() {
		if (console) {
			console.debug.apply(console, arguments);
		}
	},

	//these versions should not be redirected:
	cexc : function() {
		if (console) {
			console.error.apply(console, arguments);
		}
	},
	cerror : function() {
		if (console) {
			console.error.apply(console, arguments);
		}
	},
	cwarn : function() {
		if (console) {
			console.log.apply(console, arguments);
		}
	},
	clog : function() {
		if (console) {
			console.log.apply(console, arguments);
		}
	},
	cdebug : function() {
		if (console) {
			console.debug.apply(console, arguments);
		}
	},

	getHexUUID: function() {
var s = [];
var hexDigits = "0123456789abcdef";
for(var i = 0; i < 36; i++) {
			if (i==8 || i==13 || i==18 || i==23) {
				s[i] = "-";
			}
			else {
				s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
			}
		}
		return s.join("");
	},

	getSalt: function(l) {
		if(l<32 || l>256) {
			throw 'invalid salt length';
		}
var s = '';
		while (s.length<l) {
			s += Utilities.getHexUUID();
		}
		return s.slice(0, l);
	},

	xorString: function(str1, str2){
var result = '';
		if(str1.length !== str2.length) {
			throw 'strings must be equal length';
		}
for(var i = 0; i < str1.length; i++) {
			result += String.fromCharCode(str1[i].charCodeAt(0) ^ str2[i].charCodeAt(0));
		}
		return result;
	},

	trimString: function(str, trimLength){
		return str.length>trimLength ?
			str.substring(0, trimLength-3)+"..." :
			str;
	},

	getPlatformProcessor: function() {
		//mozilla property:
		if (navigator.oscpu){
			return navigator.oscpu;
		}
		//ie:
		if (navigator.hasOwnProperty("cpuClass")) {
			return navigator.cpuClass;
		}
		return 'unknown';
	},

	getPlatformName: function() {
		if (navigator.appVersion.includes('Win')){
			return 'Microsoft Windows';
		}
		if (navigator.appVersion.includes('Mac')){
			return 'Mac OSX';
		}
		if (navigator.appVersion.includes('Linux')){
			return 'Linux';
		}
		if (navigator.appVersion.includes('X11')){
			return 'Posix';
		}
		return 'unknown';
	},

	getPlatform: function() {
		//use python style strings for platforms:
		if (navigator.appVersion.includes('Win')){
			return 'win32';
		}
		if (navigator.appVersion.includes('Mac')){
			return 'darwin';
		}
		if (navigator.appVersion.includes('Linux')){
			return 'linux';
		}
		if (navigator.appVersion.includes('X11')){
			return 'posix';
		}
		return 'unknown';
	},

	getFirstBrowserLanguage : function () {
var nav = window.navigator,
			browserLanguagePropertyKeys = ['language', 'browserLanguage', 'systemLanguage', 'userLanguage'];
var language;
		// support for HTML 5.1 "navigator.languages"
		if (Array.isArray(nav.languages)) {
for(var i = 0; i < nav.languages.length; i++) {
				language = nav.languages[i];
				if (language && language.length) {
					return language;
				}
			}
		}
		// support for other well known properties in browsers
for(var i = 0; i < browserLanguagePropertyKeys.length; i++) {
var prop = browserLanguagePropertyKeys[i];
			language = nav[prop];
			//Utilities.debug(prop, "=", language);
			if (language && language.length) {
				return language;
			}
		}
		return null;
	},

	getKeyboardLayout: function() {
var v = Utilities.getFirstBrowserLanguage();
		Utilities.debug("getFirstBrowserLanguage()=", v);
		if (v==null) {
			return "us";
		}
var layout = LANGUAGE_TO_LAYOUT[v];
		if (!layout) {
			//ie: v="en_GB";
			v = v.split(',')[0];
var l = v.split('-', 2);
			if (l.length === 1){
				l = v.split('_', 2);
			}
			//ie: "en"
			layout = l[0].toLowerCase();
var tmp = LANGUAGE_TO_LAYOUT[v];
			if (tmp) {
				layout = tmp;
			}
		}
		Utilities.debug("getKeyboardLayout()=", layout);
		return layout;
	},

	canUseWebP : function() {
var elem = document.createElement('canvas');
var ctx = elem.getContext('2d');
	    if (!ctx) {
	    	return false;
	    }
        return elem.toDataURL('image/webp').indexOf('data:image/webp') == 0;
	},

	getAudioContextClass : function() {
		return window.AudioContext || window.webkitAudioContext || window.audioContext;
	},

	getAudioContext : function() {
		if (Utilities.audio_context) {
			return Utilities.audio_context;
		}
var acc = Utilities.getAudioContextClass();
		if(!acc) {
			return null;
		}
		Utilities.audio_context = new acc();
		return Utilities.audio_context;
	},

	isMacOS : function() {
		return navigator.platform.includes('Mac');
	},

	isWindows : function() {
		return navigator.platform.includes('Win');
	},

	isLinux : function() {
		return navigator.platform.includes('Linux');
	},


	isFirefox : function() {
var ua = navigator.userAgent.toLowerCase();
		return ua.includes("firefox");
	},
	isOpera : function() {
var ua = navigator.userAgent.toLowerCase();
		return ua.includes("opera");
	},
	isSafari : function() {
var ua = navigator.userAgent.toLowerCase();
		return ua.includes("safari") && !ua.includes('chrome');
	},
	isEdge : function() {
		return navigator.userAgent.includes("Edge");
	},
	isChrome : function () {
var isChromium = window.hasOwnProperty("chrome"),
			winNav = window.navigator,
			vendorName = winNav.vendor,
			isOpera = winNav.userAgent.includes("OPR"),
			isIEedge = winNav.userAgent.includes("Edge"),
			isIOSChrome = winNav.userAgent.match("CriOS");
		  if (isIOSChrome) {
			  return true;
		  }
		  else if (isChromium !== null && isChromium !== undefined && vendorName === "Google Inc." && isOpera === false && isIEedge === false) {
			  return true;
		  }
		  else {
			  return false;
		  }
	},
	isIE : function() {
		return navigator.userAgent.includes("MSIE") || navigator.userAgent.includes("Trident/");
	},

	is_64bit : function() {
var _to_check = [] ;
		if (window.navigator.hasOwnProperty("cpuClass"))
			_to_check.push((window.navigator.cpuClass + "").toLowerCase());
		if (window.navigator.platform)
			_to_check.push((window.navigator.platform + "").toLowerCase());
		if (navigator.userAgent)
			_to_check.push((navigator.userAgent + "").toLowerCase());
var _64bits_signatures = ["x86_64", "x86-64", "Win64", "x64;", "amd64", "AMD64", "WOW64", "x64_64", "ia64", "sparc64", "ppc64", "IRIX64"];
for(var _c=0; _c<_to_check.length; _c++) {
for(var _i=0 ; _i<_64bits_signatures.length; _i++) {
				if (_to_check[_c].indexOf(_64bits_signatures[_i].toLowerCase())!=-1) {
					return true;
				}
			}
		}
		return false;
	},

	isMobile : function () {
	    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
	},

	getSimpleUserAgentString : function() {
		if (Utilities.isFirefox()) {
			return "Firefox";
		}
		else if (Utilities.isOpera()) {
			return "Opera";
		}
		else if (Utilities.isSafari()) {
			return "Safari";
		}
		else if (Utilities.isChrome()) {
			return "Chrome";
		}
		else if (Utilities.isIE()) {
			return "MSIE";
		}
		else {
			return "";
		}
	},

	getColorGamut : function() {
		if (!window.matchMedia) {
			//unknown
			return "";
		}
		else if (window.matchMedia('(color-gamut: rec2020)').matches) {
			return "rec2020";
		}
		else if (window.matchMedia('(color-gamut: p3)').matches) {
			return "P3";
		}
		else if (window.matchMedia('(color-gamut: srgb)').matches) {
			return "srgb";
		}
		else {
			return "";
		}
	},

	isEventSupported : function(event) {
var testEl = document.createElement('div');
var isSupported;

		event = 'on' + event;
		isSupported = (event in testEl);

		if (!isSupported) {
			testEl.setAttribute(event, 'return;');
			isSupported = typeof testEl[event] === 'function';
		}
		testEl = null;
		return isSupported;
	},

	//https://github.com/facebook/fixed-data-table/blob/master/src/vendor_upstream/dom/normalizeWheel.js
	//BSD license
	normalizeWheel : function(/*object*/ event) /*object*/ {
		// Reasonable defaults
var PIXEL_STEP  = 10;
var LINE_HEIGHT = 40;
var PAGE_HEIGHT = 800;

var sX = 0, sY = 0;       // spinX, spinY

		// Legacy
		if ('detail'      in event) { sY = event.detail; }
		if ('wheelDelta'  in event) { sY = -event.wheelDelta / 120; }
		if ('wheelDeltaY' in event) { sY = -event.wheelDeltaY / 120; }
		if ('wheelDeltaX' in event) { sX = -event.wheelDeltaX / 120; }

		// side scrolling on FF with DOMMouseScroll
		if ('axis' in event && event.axis === event.HORIZONTAL_AXIS) {
			sX = sY;
			sY = 0;
		}

var pX = sX * PIXEL_STEP; // pixelX
var pY = sY * PIXEL_STEP; // pixelY

		if ('deltaY' in event) { pY = event.deltaY; }
		if ('deltaX' in event) { pX = event.deltaX; }

		if ((pX || pY) && event.deltaMode) {
			if (event.deltaMode == 1) {          // delta in LINE units
				pX *= LINE_HEIGHT;
				pY *= LINE_HEIGHT;
			} else {                             // delta in PAGE units
				pX *= PAGE_HEIGHT;
				pY *= PAGE_HEIGHT;
			}
		}

		// Fall-back if spin cannot be determined
		if (pX && !sX) { sX = (pX < 1) ? -1 : 1; }
		if (pY && !sY) { sY = (pY < 1) ? -1 : 1; }

		return {
			spinX  : sX,
			spinY  : sY,
			pixelX : pX,
			pixelY : pY,
			deltaMode : (event.deltaMode || 0),
			};
	},

	saveFile : function(filename, data, mimetype) {
var a = document.createElement("a");
	    a.setAttribute("style", "display: none");
	    document.body.appendChild(a);
var blob = new Blob([data], mimetype);
var url = window.URL.createObjectURL(blob);
	    if (navigator.msSaveOrOpenBlob) {
	    	navigator.msSaveOrOpenBlob(blob, filename);
	    } else {
	        a.href = url;
	        a.download = filename;
	        a.click();
	        window.URL.revokeObjectURL(url);
	    }
	},

	monotonicTime : function() {
		if (performance) {
			return Math.round(performance.now());
		}
		return Date.now();
	},

	StringToUint8 : function(str) {
var u8a = new Uint8Array(str.length);
for(var i=0,j=str.length;i<j;++i){
			u8a[i] = str.charCodeAt(i);
		}
		return u8a;
	},

	Uint8ToString : function(u8a){
var CHUNK_SZ = 0x8000;
var c = [];
for(var i=0; i < u8a.length; i+=CHUNK_SZ) {
			c.push(String.fromCharCode.apply(null, u8a.subarray(i, i+CHUNK_SZ)));
		}
		return c.join("");
	},

	ArrayBufferToBase64 : function(uintArray) {
		// apply in chunks of 10400 to avoid call stack overflow
		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply
var s = "";
var skip = 10400;
		if (uintArray.subarray) {
for(var i=0, len=uintArray.length; i<len; i+=skip) {
				s += String.fromCharCode.apply(null, uintArray.subarray(i, Math.min(i + skip, len)));
			}
		} else {
for(var i=0, len=uintArray.length; i<len; i+=skip) {
				s += String.fromCharCode.apply(null, uintArray.slice(i, Math.min(i + skip, len)));
			}
		}
		return window.btoa(s);
	},

	convertDataURIToBinary : function (dataURI) {
var BASE64_MARKER = ';base64,';
var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
var base64 = dataURI.substring(base64Index);
var raw = window.atob(base64);
var rawLength = raw.length;
var array = new Uint8Array(new ArrayBuffer(rawLength));

for(var i = 0; i < rawLength; i++) {
			array[i] = raw.charCodeAt(i);
		}
		return array;
	},


	parseINIString : function (data) {
var regex = {
	        section: /^\s*\[\s*([^\]]*)\s*\]\s*$/,
	        param: /^\s*([^=]+?)\s*=\s*(.*?)\s*$/,
	        comment: /^\s*[;#].*$/
	    };
var value = {};
var lines = data.split(/[\r\n]+/);
var section = null;
	    lines.forEach(function(line){
	        if(regex.comment.test(line)){
	            return;
	        }else if(regex.param.test(line)){
var match = line.match(regex.param);
	            if(section){
	                value[section][match[1]] = match[2];
	            }else{
	                value[match[1]] = match[2];
	            }
	        }else if(regex.section.test(line)){
var match = line.match(regex.section);
	            value[match[1]] = {};
	            section = match[1];
	        }else if(line.length == 0 && section){
	            section = null;
	        }
	    });
	    return value;
	},

	/**
	 * XmlHttpRequest's getAllResponseHeaders() method returns a string of response
	 * headers according to the format described here:
	 * http://www.w3.org/TR/XMLHttpRequest/#the-getallresponseheaders-method
	 * This method parses that string into a user-friendly key/value pair object.
	 */
	ParseResponseHeaders : function(headerStr) {
var headers = {};
		if (!headerStr) {
			return headers;
		}
var headerPairs = headerStr.split('\u000d\u000a');
for(var i = 0; i < headerPairs.length; i++) {
var headerPair = headerPairs[i];
			// Can't use split() here because it does the wrong thing
			// if the header value has the string ": " in it.
var index = headerPair.indexOf('\u003a\u0020');
			if (index > 0) {
var key = headerPair.substring(0, index);
var val = headerPair.substring(index + 2);
				headers[key] = val;
			}
		}
		return headers;
	},

	parseParams : function(q) {
var params = {};
var e;
var a = /\+/g,	// Regex for replacing addition symbol with a space
				r = /([^&=]+)=?([^&]*)/g,
				d = function (s) { return decodeURIComponent(s.replace(a, " ")); };
		while (e = r.exec(q))
				params[d(e[1])] = d(e[2]);
		return params;
	},

	getparam : function(prop) {
var getParameter = window.location.getParameter;
		if (!getParameter) {
			getParameter = function(key) {
				if (!window.location.queryStringParams)
					window.location.queryStringParams = Utilities.parseParams(window.location.search.substring(1));
				return window.location.queryStringParams[key];
			};
		}
var value = getParameter(prop);
		try {
			if (value === undefined && typeof(sessionStorage) !== undefined) {
				value = sessionStorage.getItem(prop);
			}
		}
		catch (e) {
			value = null;
		}
		return value;
	},


	getboolparam : function(prop, default_value) {
var v = Utilities.getparam(prop);
		if(v===null) {
			return default_value;
		}
		return ["true", "on", "1", "yes", "enabled"].indexOf(String(v).toLowerCase())!==-1;
	},

	hasSessionStorage : function() {
		if (typeof(Storage) === "undefined") {
			return false;
		}
		try {
var key = "just for testing sessionStorage support";
		    sessionStorage.setItem(key, "store-whatever");
		    sessionStorage.removeItem(key);
		    return true;
		}
		catch (e) {
			return false;
		}
	},


	getConnectionInfo : function() {
		if (!navigator.hasOwnProperty("connection")) {
			return {};
		}
var c = navigator.connection;
var i = {};
		if (c.type) {
			i["type"] = c.type;
		}
		if (c.hasOwnProperty("effectiveType")) {
			i["effective-type"] = c.effectiveType;
		}
		if (!isNaN(c.downlink) && !isNaN(c.downlink) && c.downlink>0 && isFinite(c.downlink)) {
			i["downlink"] = Math.round(c.downlink*1000*1000);
		}
		if (c.hasOwnProperty("downlinkMax") && !isNaN(c.downlinkMax) && !isNaN(c.downlinkMax) && c.downlinkMax>0 && isFinite(c.downlinkMax)) {
			i["downlink.max"] = Math.round(c.downlinkMax*1000*1000);
		}
		if (!isNaN(c.rtt) && c.rtt>0) {
			i["rtt"] = c.rtt;
		}
		return i;
	},

	json_action  : function(uri, success_fn, error_fn, username, password) {
		Utilities.log("json_action(", uri, ", ", success_fn, ", ", error_fn, ")");
	    var xhr = new XMLHttpRequest();
	    var url = uri;
		if (uri.startsWith("/")) {
			//relative URI
			url = document.location.href.split("/connect.html")[0] + uri;
		}
	    xhr.open('GET', url, true);
		if (username && password) {
			xhr.setRequestHeader("Authorization", "Basic " + btoa(username+":"+password));
		}
	    xhr.responseType = 'json';
		xhr.addEventListener("load", function() {
			Utilities.log("loaded", url, "status", xhr.status);
			var status = xhr.status;
			if (status === 200) {
				success_fn(xhr, xhr.response);
			}
			else {
				Utilities.log(uri, "failed:", status+xhr.response);
				if (error_fn) {
					error_fn("failed: "+status+xhr.response);
				}
			}
		});
		xhr.addEventListener("error", function(e) {
			Utilities.log(uri, "error:", e);
			if (error_fn) {
				error_fn(e);
			}
		});
		xhr.addEventListener("abort", function(e) {
			Utilities.log(uri, "abort:", e);
			if (error_fn) {
				error_fn(e);
			}
		});
		xhr.send();
		return xhr;
	},
};


var MOVERESIZE_SIZE_TOPLEFT      = 0;
var MOVERESIZE_SIZE_TOP          = 1;
var MOVERESIZE_SIZE_TOPRIGHT     = 2;
var MOVERESIZE_SIZE_RIGHT        = 3;
var MOVERESIZE_SIZE_BOTTOMRIGHT  = 4;
var MOVERESIZE_SIZE_BOTTOM       = 5;
var MOVERESIZE_SIZE_BOTTOMLEFT   = 6;
var MOVERESIZE_SIZE_LEFT         = 7;
var MOVERESIZE_MOVE              = 8;
var MOVERESIZE_SIZE_KEYBOARD     = 9;
var MOVERESIZE_MOVE_KEYBOARD     = 10;
var MOVERESIZE_CANCEL            = 11;
var MOVERESIZE_DIRECTION_STRING = {
                               0    : "SIZE_TOPLEFT",
                               1    : "SIZE_TOP",
                               2    : "SIZE_TOPRIGHT",
                               3    : "SIZE_RIGHT",
                               4  	: "SIZE_BOTTOMRIGHT",
                               5    : "SIZE_BOTTOM",
                               6   	: "SIZE_BOTTOMLEFT",
                               7    : "SIZE_LEFT",
                               8	: "MOVE",
                               9    : "SIZE_KEYBOARD",
                               10   : "MOVE_KEYBOARD",
                               11	: "CANCEL",
                               };
var MOVERESIZE_DIRECTION_JS_NAME = {
        0	: "nw",
        1	: "n",
        2	: "ne",
        3	: "e",
        4	: "se",
        5	: "s",
        6	: "sw",
        7	: "w",
        };

//convert a language code into an X11 keyboard layout code:
var LANGUAGE_TO_LAYOUT = {
		"en_GB"	: "gb",
		"en"	: "us",
		"zh"	: "cn",
		"af"	: "za",
		"sq"	: "al",
		//"ar"	: "ar",
		//"eu"	: "eu",
		//"bg"	: "bg",
		//"be"	: "be",
		"ca"	: "ca",
		"zh-TW"	: "tw",
		"zh-CN"	: "cn",
		//"zh-HK"	: ??
		//"zh-SG"	: ??
		//"hr"	: "hr",
		"cs"	: "cz",
		"da"	: "dk",
		//"nl"	: "nl",
		"nl-BE"	: "be",
		"en-US"	: "us",
		//"en-EG"	: ??
		"en-AU"	: "us",
		"en-GB"	: "gb",
		"en-CA"	: "ca",
		"en-NZ"	: "us",
		"en-IE"	: "ie",
		"en-ZA" : "za",
		"en-JM" : "us",
		//"en-BZ"	: ??
		"en-TT"	: "tr",
		"et"	: "ee",
		//"fo"	: "fo",
		"fa"	: "ir",
		//"fi"	: "fi",
		//"fr"	: "fr",
		"fr-BE"	: "be",
		"fr-CA"	: "ca",
		"fr-CH"	: "ch",
		"fr-LU"	: "fr",
		//"gd"	: ??
		"gd-IE"	: "ie",
		//"de"	: "de",
		"de-CH"	: "ch",
		"de-AT"	: "at",
		"de-LU"	: "de",
		"de-LI"	: "de",
		"he"	: "il",
		"hi"	: "in",
		//"hu"	: "hu",
		//"is"	: "is",
		//"id"	: ??,
		//"it"	: "it",
		"it-CH"	: "ch",
		"ja"	: "jp",
		"ko"	: "kr",
		//"lv"	: "lv",
		//"lt"	: "lt",
		//"mk"	: "mk",
		//"mt"	: "mt",
		//"no"	: "no",
		//"pl"	: "pl",
		"pt-BR"	: "br",
		"pt"	: "pt",
		//"rm"	: ??,
		//"ro"	: "ro",
		//"ro-MO"	: ??,
		//"ru"	: "ru",
		///"ru-MI"	: ??,
		//"sz"	: ??,
		"sr"	: "rs",
		//"sk"	: "sk",
		"sl"	: "si",
		//"sb"	: ??,
		"es"	: "es",
		//"es-AR", "es-GT", "es-CR", "es-PA", "es-DO", "es-MX", "es-VE", "es-CO",
		//"es-PE", "es-EC", "es-CL", "es-UY", "es-PY", "es-BO", "es-SV", "es-HN",
		//"es-NI", "es-PR",
		//"sx"	: ??,
		"sv"	: "se",
		"sv-FI"	: "fi",
		//"th"	: "th",
		//"ts"	: ??,
		//"tn"	: ??,
		"tr"	: "tr",
		"uk"	: "ua",
		"ur"	: "pk",
		//"ve"	: ??,
		"vi"	: "vn",
		//"xh"	: "??",
 		//"ji"	: "??",
		//"zu"	: "??",
};