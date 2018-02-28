/**
 * Created by XimLink on 2016/10/8.
 */
/**
 * 对象类型检查 JSON WebSocket Uint8Array Worker
 */
import MinuxU from './minux.util.js';
let Minux = Object.assign({}, MinuxU);
function lf_Check_JSON() {
    if ((typeof JSON) === 'undefined') {
        alert("警告！浏览器不支持JSON！");
    }
}

function lf_Check_WebSocket() {
    if ((typeof WebSocket) === 'undefined' && (typeof MozWebSocket) === 'undefined') {
        alert("警告！浏览器不支持websocket！");
    }
}

function lf_Check_Uint8Array() {
    if ((typeof Uint8Array) === 'undefined') {
        alert("警告！浏览器不支持Uint8Array！");
    }
}

function lf_Check_Worker() {
    if ((typeof Worker) === "undefined") {
        alert("警告！浏览器不支持Worker！");
    }
}
/** ********************************* */
lf_Check_JSON();
lf_Check_WebSocket();
lf_Check_Uint8Array();
lf_Check_Worker();
/** ********************************* */
Minux.jsonsocketclient_web = function (f_str_path, f_str_url, f_aI4_mbs, f_fnc_onopen, f_fnc_onclose, f_fnc_onrecv, f_fnc_onerror, f_fnc_onhint) {
    this.worker = new Worker("/static/jsonsocketclient_worker.min.js");
    this.worker.onmessage = this.onmessage.bind(this);

    this.url = f_str_url;
    this.mbs = f_aI4_mbs;
    this.onopen = f_fnc_onopen;
    this.onclose = f_fnc_onclose;
    this.onrecv = f_fnc_onrecv;
    this.onerror = f_fnc_onerror;
    this.onhint = f_fnc_onhint;

    this.recvsize_last = 0;
    this.sendsize_last = 0;
    this.recvsize_total = 0;
    this.sendsize_total = 0;
    this.recvpack_total = 0;
    this.sendpack_total = 0;
};

Minux.jsonsocketclient_web.recvsize_totalall = 0;
Minux.jsonsocketclient_web.sendsize_totalall = 0;
Minux.jsonsocketclient_web.recvpack_totalall = 0;
Minux.jsonsocketclient_web.sendpack_totalall = 0;

Minux.jsonsocketclient_web.prototype.onmessage = function (f_aTC_evt) {
    var t_aTC_evt = JSON.parse(f_aTC_evt.data);
    if (t_aTC_evt.event == "onhint") {
        if (true == t_aTC_evt.param.isrecv) {
            this.recvsize_last = t_aTC_evt.param.len;
            this.recvsize_total += t_aTC_evt.param.len;
            this.recvpack_total += 1;
            Minux.jsonsocketclient_web.recvsize_totalall += t_aTC_evt.param.len;
            Minux.jsonsocketclient_web.recvpack_totalall += 1;
        }
        else {
            this.sendsize_last = t_aTC_evt.param.len;
            this.sendsize_total += t_aTC_evt.param.len;
            this.sendpack_total += 1;
            Minux.jsonsocketclient_web.sendsize_totalall += t_aTC_evt.param.len;
            Minux.jsonsocketclient_web.sendpack_totalall += 1;
        }
        if (this.onhint != null) {
            this.onhint(this, t_aTC_evt.param.isrecv);
        }
    }
    else if (t_aTC_evt.event == "onrecv") {
        if (null != this.onrecv) {
            this.onrecv(this, JSON.parse(t_aTC_evt.param));
        }
    }
    else if (t_aTC_evt.event == "onopen") {
        if (this.onopen != null) {
            this.onopen(this);
        }
    }
    else if (t_aTC_evt.event == "onclose") {
        if (this.onclose != null) {
            this.onclose(this);
        }
    }
    else if (t_aTC_evt.event == "onerror") {
        if (this.onerror != null) {
            this.onerror(this);
        }
    }
};

Minux.jsonsocketclient_web.prototype.open = function () {
    var t_aTC_obj = {};
    t_aTC_obj.func = "open";
    t_aTC_obj.param = {};
    t_aTC_obj.param.url = this.url;
    t_aTC_obj.param.mbs = this.mbs;
    this.worker.postMessage(JSON.stringify(t_aTC_obj));
};

Minux.jsonsocketclient_web.prototype.send = function (f_aTC_obj) {
    try {
        var t_aTC_obj = {};
        t_aTC_obj.func = "send";
        t_aTC_obj.param = JSON.stringify(f_aTC_obj);
        this.worker.postMessage(JSON.stringify(t_aTC_obj));
    }
    catch (e) {
    }
};

Minux.jsonsocketclient_web.prototype.close = function () {
    var t_aTC_obj = {};
    t_aTC_obj.func = "close";
    this.worker.postMessage(JSON.stringify(t_aTC_obj));
};

Minux.jsonsocketclient_web.prototype.destroy = function () {
    this.worker.terminate();
    delete this.worker;
};
export default Minux;



