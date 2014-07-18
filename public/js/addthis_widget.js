/* (c) 2008-2014 AddThis, Inc */
var addthis_conf = { ver:300 };
//* vim: set expandtab tabstop=4 shiftwidth=4: */
/* -*- Mode: JavaScript; tab-width: 4; indent-tabs-mode: nil; -*- */

/**
 * Root Revision (rrev): 1405547656
 *
 * --- HOWTO ---
 *
 * creates or updates variables:
 *  _atd - domain of AT website (for linking to things like bookmark.php, feed.php, /privacy, etc.)
 *  _atr - protocol + CDN domain
 *  _atc - internal global configuration variable
 *  _euc/_duc - our global shortnames for (en|de)codeURIComponent
 *
 * creates legacy public fuctions:
 *
 *  addthis_onmouseover
 *  addthis_onmouseout
 *  addthis_to
 *
 * --- TODO ---
 *
 * break out v300 menu into a separate codebase (with some shared bits)
 *
 * require pubid for email
 * can we iframe the menu? reduce code size; as of 1/30/10 stewart doesn't want to
 * templatable or via iframe work for bookmark/feed/other
 */

// BEGIN: _ate dupe guard
if (!((window._atc||{}).ver)) {
var _atd = 'www-local.addthis.com/',
    _atr = window.addthis_cdn || '//cache-local.addthis.com/cachefly/',
    _euc = encodeURIComponent,
    _duc = decodeURIComponent,
    _atc = {
        dbg : 0, // debugging turned on
        rrev : 1405547656,
        dr : 0,     // domready
        ver : 250,
        loc : 0,
        enote : '', // pre-filled email note
        cwait : 500, // menu close wait onmouseout in milliseconds
        bamp : 1, // -- clickback sample rate (-1=off, 1=on)
        camp : 1, // -- classification sample rate (-1=off, 1=on)
        csmp : 0.0001, // -- clipboard copy sample rate
        damp : 1, // -- lo.json sample
        famp : 1.0, // -- file path referer sample rate (-1=off, 1=on)
        pamp : 1, // -- personalization sample rate (-1=off, 1=on)
        abmp : 1, // -- personalization ab testing sample rate (-1=off, 1=on)
        sfmp : -1, // -- skyfall feed delivery sample rate (-1=off, 1=on)
        tamp : 0.05, // -- test sample rate (-1=off, 1=on)
        plmp : 1, // -- pl.gif sample rate
        stmp : 1, // -- full-key statid sample rate
        vamp : 1, // -- view metadata sample rate (-1=off, 1=on)
        cscs : 1.0, // -- comscore pixel sampling rate
        dtt : 0.01, // -- dwell time tracking rate
        ohmp : 1, // -- oh.gif sample rate
        ltj  : 1, // -- load third-party javascript
        xamp : 1, // -- pixelator uid view sample rate (-1=off, 1=on)
        abf : !!window.addthis_do_ab, // address book frame
        // xol : 1, // -- disable onload behavior
        // xcs : 1, // -- disable stylesheet loading
        // xic : 1, // -- disable iframe communication for old browsers (saf3/ffx2)
        // xtr : 1, // -- disable tracking
        // xck : 1, // -- disable document cookies
        qs : 0,
        cdn : 0, // which cdn are we testing
        rsrcs : {
            bookmark : _atr+'live/l07/bookmark043.html',
            atimg : _atr+'live/l07/atimg043.html',
            countercss : _atr+'live/l07/plugins/counter015.css',
            counterIE67css : _atr+'live/l07/counterIE67004.css',
            counter : _atr+'live/l07/plugins/counter018.js',

            core : _atr+'live/l07/core143.js',

			wombat: _atr+'live/l07/bar026.js',
			wombatcss: _atr+'live/l07/bar012.css',

            qbarcss : _atr+'bannerQuirks.css',
            fltcss : _atr+'live/l07/floating010.css',
            barcss : _atr+'live/l07/banner006.css',
            barjs : _atr+'live/l07/banner004.js',

            contentcss : _atr+'live/l07/content009.css',
            contentjs : _atr+'live/l07/content023.js',
            
            layersjs : _atr+'live/l07/plugins/layers059.js',
            layerscss : _atr+'live/l07/plugins/layers049.css',
            layersiecss : _atr+'live/l07/plugins/layersIE6007.css',
            layersdroidcss : _atr+'live/l07/plugins/layersdroid004.css',
            warning : _atr+'live/l07/warning000.html',

            /* 
            if we resurrect copyth.is:

            _atrc = '//cache-local.addthis.com/cachefly/' <-- goes up top

            copythis: 'live/l07/copythis00C.js',
            copythiscss: _atrc+'live/l07/copythis00C.css',
            */

            ssojs : _atr+'live/l07/ssi005.js',
            ssocss : _atr+'live/l07/ssi004.css',

            peekaboocss : _atr+'live/l07/peekaboo002.css',
            overlayjs : _atr+'live/l07/overlay005.js',
            widget32css : _atr+'live/l07/widgetbig060.css',
            widget32whitecss : _atr+'live/l07/widgetbigwhite060.css',
            widget20css : _atr+'live/l07/widgetmed010.css',
            widgetcss : _atr+'live/l07/widget120.css',
            widgetIE67css : _atr+'live/l07/widgetIE67006.css',
            widgetpng : '//cache-local.addthis.com/cachefly/live/l07/widget060.png',

            embed : _atr+'live/l07/embed010.js',
            embedcss : _atr+'live/l07/embed004.css',

            lightbox : _atr+'live/l07/lightbox000.js',
            lightboxcss : _atr+'live/l07/lightbox000.css',

            link : _atr+'live/l07/link005.html',
            pinit : _atr+'live/l07/pinit021.html',
            linkedin : _atr+'live/l07/linkedin025.html',
            fbshare : _atr+'live/l07/fbshare004.html',
            tweet : _atr+'live/l07/tweet029.html',

            menujs : _atr+'live/l07/menu163.js',

            sh : _atr+'live/l07/sh165.html'
        }
    };
}
/** BEGIN: AddThis Closure */
(function(){
var undefined,
w = window,
d = document;
//* vim: set expandtab tabstop=4 shiftwidth=4: */
var ssl = (window.location.protocol == 'https:'),
    lng,
    loc,
    language,
    ua = (navigator.userAgent||'unk').toLowerCase(),
    ffx = (/firefox/.test(ua)),
    msie = (/msie/.test(ua) && !(/opera/.test(ua))),
    cdns = {
        0 : _atr, /* edgecast */
        1 : '//ct1.addthis.com/', /* fastly */
        6 : '//ct6z.addthis.com/' /* fastly global */
        /*2 : '//ct2.addthis.com/', level3 */
        /*3 : '//ct3.addthis.com/', highwinds */
        /*4 : '//ct4.addthis.com/', fastly */
        /*5 : '//ct5.addthis.com/', edgecast */
        /*100 : '//ct0.addthis.com/' akamai comparable */
    },
    /* New CDN breakdown:
     * https://docs.google.com/a/addthis.com/spreadsheet/ccc?key=0AtV98kIRworDdDhFaFFNMGhyU0RkMHNHSXczaWFMUmc#gid=0
     */
    /* 100% of these locales to edgecast -- since edgecast is default, no need to specify
    edgecast100 = {
	    "ch":"1",
	    "co":"1",
	    "cl":"1",
	    "is":"1",
	    "vn":"1",
	    "ar":"1",
	    "au":"1",
	    "id":"1",
	    "ru":"1",
	    "tw":"1",
	    "tr":"1",
	    "th":"1",
	    "pe":"1",
	    "ph":"1",
	    "jp":"1",
	    "hk":"1",
	    "br":"1",
	    "sg":"1",
	    "my":"1",
	    "kr":"1"
    },
    */
    /* all IE/Firefox users in these locales to edgecast */
    edgecastIEFF = {
        "gb":"1",
        "nl":"1",
        "no":"1"
    },
    /* all IE users in these locales to edgecast */
    edgecastIE = {
        "gr":"1",
        "it":"1",
        "cz":"1",
        "ie":"1",
        "es":"1",
        "pt":"1",
        "ro":"1",
        "ca":"1",
        "pl":"1",
        "be":"1",
        "fr":"1",
        "dk":"1",
        "hr":"1",
        "de":"1",
        "hu":"1",
        "fi":"1",
        "us":"1",
        "ua":"1",
        "mx":"1",
        "se":"1",
        "at":"1"
    },
    fastly100 = {
        "nz":"1"
    },

    // grab a temporary reference to the collection of scripts and then
    // a less temporary reference to the last element in the collection's parent
    // which is where we put scripts that we load, and the addthis div/iframe
    scriptParent = (scriptParent = document.getElementsByTagName('script')) && scriptParent[scriptParent.length-1].parentNode;

_atc.cdn = 0;

if (!window.addthis || window.addthis.nodeType !== undefined) {
    try {
        lng = window.navigator ? (navigator.userLanguage || navigator.language) : '';
        loc = lng.split('-').pop().toLowerCase();
	    language = lng.substring(0,2);
        if (loc.length != 2) loc = 'unk';
        if (_atr.indexOf('-')>-1) {
            // needs to stay at the default (0)
        } else if (window.addthis_cdn !== undefined) {
            _atc.cdn = window.addthis_cdn;
        } else if (fastly100[loc]) {
            // 100% fastly
            _atc.cdn = 6;
        } else if (edgecastIEFF[loc]) {
            // edgecast for IE/FF users
            _atc.cdn = (ffx || msie) ? 0 : 1;
        } else if (edgecastIE[loc]) {
            _atc.cdn = (msie) ? 0 : 1;
        }

        if (_atc.cdn) {
            for (var k in _atc.rsrcs) {
                if (_atc.rsrcs.hasOwnProperty(k))
                    _atc.rsrcs[k] = _atc.rsrcs[k].replace(_atr,typeof(window.addthis_cdn) === 'string' ? window.addthis_cdn : cdns[_atc.cdn]).replace(/live\/([a-z])07/,'live/$107');
            }
            _atr = cdns[_atc.cdn];
       }
    }
    catch (e) {
    }

    function queueFor(call, ns, context, onlyOnce){
        return function (){
            if (!this.qs) this.qs = 0;
            _atc.qs++;
            if (!((this.qs++ > 0 && onlyOnce) || _atc.qs > 1000) && window.addthis) {
                window.addthis.plo.push({ call:call, args:arguments, ns:ns, ctx:context });
            }
        };
    }

    function Queuer(name){
        var
        self = this,
        queue = this.queue = [];
        this.name = name;

        this.call = function(){
            queue.push(arguments);
        };
        this.call.queuer = this;

        this.flush = function(fn, context){
            this.flushed = 1;
            for (var i=0; i<queue.length; i++)
                fn.apply(context || self, queue[i]);
            return fn;
        };
    }

    window.addthis = {
        ost       : 0,  // set to 1 after initialization
        cache     : {}, // for caching some DOM elements we use a lot
        plo       : [], // queued function calls pre-dom-readiness
        links     : [],
        ems       : [],
        timer     : {
            load: ((new Date()).getTime())
        },
        _Queuer   : Queuer,
        _queueFor : queueFor,
        data      : {getShareCount: queueFor('getShareCount', 'data')},
        bar       : { show: queueFor('show','bar'), initialize: queueFor('initialize','bar') },
        layers    : queueFor('layers'),
        login     : {
                      initialize: queueFor('initialize','login') ,
                      connect: queueFor('connect','login')
                    },
        configure : function (o) {
            if (!w.addthis_config) w.addthis_config = {};
            if (!w.addthis_share) w.addthis_share = {};
            for (var k in o) {
                if (k == 'share' && typeof(o[k]) == 'object') {
                    for (var j in o[k]) {
                        if (o[k].hasOwnProperty(j)) {
                            if (!addthis.ost) {
                                w.addthis_share[j] = o[k][j];
                            } else {
                                // this is expensive; should be simpler
                                addthis.update('share', j, o[k][j]);
                            }
                        }
                    }
                } else if (o.hasOwnProperty(k)) {
                    if (!addthis.ost) {
                        w.addthis_config[k] = o[k];
                    } else {
                        addthis.update('config', k, o[k]);
                    }
                }
            }
        },
        box       : queueFor('box'),
        button    : queueFor('button'),
        counter   : queueFor('counter'),
        count     : queueFor('count'),
        lightbox  : queueFor('lightbox'),
        toolbox   : queueFor('toolbox'),
        update    : queueFor('update'),
        init    : queueFor('init'),
        ad        : {
                menu : queueFor('menu','ad', 'ad'),
                event: queueFor('event','ad'),
                getPixels: queueFor('getPixels','ad')
        },
        util      : { getServiceName: queueFor('getServiceName')},
        ready     : queueFor('ready'),
        addEventListener    : queueFor('addEventListener', 'ed', 'ed'),
        removeEventListener : queueFor('removeEventListener', 'ed', 'ed'),
        user : {
            getID: queueFor('getID','user'),
            getGeolocation:queueFor('getGeolocation','user',null,true),
            getPreferredServices:queueFor('getPreferredServices','user',null,true),
            getServiceShareHistory:queueFor('getServiceShareHistory','user',null,true),
            ready : queueFor('ready','user'),

            // bools
            isReturning : queueFor('isReturning','user'),
            isOptedOut : queueFor('isOptedOut','user'),
            isUserOf : queueFor('isUserOf','user'),
            hasInterest : queueFor('hasInterest','user'),
            isLocatedIn : queueFor('isLocatedIn','user'),

            // getters
            interests : queueFor('getInterests','user'),
            services : queueFor('getServices','user'),
            location : queueFor('getLocation','user')
        },
        session : {
            source : queueFor('getSource','session'),
            isSocial : queueFor('isSocial','session'),
            isSearch : queueFor('isSearch','session')
        },
        _pmh  : new Queuer('pmh'),
        _pml : []
    };
    /*var h = document.head || document.getElementsByTagName('head')[0] || document.documentElement;
    try {
        h.insertBefore(a, h.firstChild);
    } catch (e) {
        if (h) h.appendChild(a);
    }*/

    function opp(o) {
        o.style.width = o.style.height = '1px';
        o.style.position = 'absolute';
        o.style.zIndex = 100000;
    }

    if (document.location.href.indexOf(_atr)==-1) {
        var div = document.getElementById('_atssh');
        if (!div) {
            div = document.createElement('div');
            div.style.visibility = 'hidden';
            div.id = '_atssh';
            opp(div);
            scriptParent.appendChild(div);
        }

        function rec(e) {
            if(e && !(e.data||{})['addthisxf'] && window.addthis) {
                if (addthis._pmh.flushed) _ate.pmh(e);
                else addthis._pmh.call(e);
            }
        }

        if (window.postMessage) {
            if (window.attachEvent) window.attachEvent('onmessage', rec);
            else if (window.addEventListener) window.addEventListener('message', rec, false);
            addthis._pml.push(rec);
        }

        if (!div.firstChild) {
            var ifr,
                ua = navigator.userAgent.toLowerCase(),
                r = Math.floor(Math.random()*1000);

            //if (msie) {
            //    div.innerHTML = '<iframe id="_atssh'+r+'" width="1" height="1" title="AddThis utility frame" name="_atssh'+r+'" src="">';
            //    ifr = document.getElementById('_atssh'+r);
            //} else {
                ifr = document.createElement('iframe');
                ifr.id = '_atssh'+r;
                ifr.title = 'AddThis utility frame';
                //ifr.src = _atc.rsrcs.sh+'#';
                div.appendChild(ifr);
            //}
            opp(ifr);
            ifr.frameborder = ifr.style.border = 0;
            ifr.style.top = ifr.style.left = 0;
            _atc._atf = ifr;
        }
    }

    var a = document.createElement('script');
    a.type = 'text/javascript'; //a.async = true;
    a.src = (ssl ? 'https:' : 'http:') + _atc.rsrcs.core;
    scriptParent.appendChild(a); //(a, s);

/*
    cdn measurement
*/
    var timeout = 10000;
    setTimeout(function() {
        if (!window.addthis.timer.core) {
            // load error pixel
            if (Math.random() < _atc.ohmp) {
                (new Image()).src = '//m.addthisedge.com/live/t00/oh.gif?'+Math.floor(Math.random()*0xffffffff).toString(36)+'&cdn='+_atc.cdn+'&sr='+_atc.ohmp+'&rev='+_atc.rrev+'&to='+timeout;
            }
            if (_atc.cdn !== 0) {
                // in non-default cdns, fail over to the default
                var a = document.createElement('script');
                a.type = 'text/javascript'; //a.async = true;
                a.src = (ssl ? 'https:' : 'http:') + _atr + 'live/l07/core143.js';
                scriptParent.appendChild(a);
            }
        }
    }, timeout);
}

/** END: AddThis Closure */
})();