/**
 * Created by XimLink on 2017/1/14.
 */
import MinuxJ from './jsonsocketclient_web.js';
let Minux = Object.assign({}, MinuxJ);
Minux.clientagent_web_event = function (f_fnc_onopen, f_fnc_onclose, f_fnc_onmsg, f_fnc_onerror, f_fnc_onhint) {
    this.onopen = f_fnc_onopen;
    this.onclose = f_fnc_onclose;
    this.onmsg = f_fnc_onmsg;
    this.onerror = f_fnc_onerror;
    this.onhint = f_fnc_onhint;
};

Minux.clientagent_web = function (f_str_path, f_str_url, f_aI4_mbs) {
    this.jsonsocketclient_web = new Minux.jsonsocketclient_web(f_str_path, f_str_url, f_aI4_mbs, this.onopen.bind(this), this.onclose.bind(this), this.onrecv.bind(this), this.onerror.bind(this), this.onhint.bind(this));

    this.callbacks = {};
    this.listeners = [];
};

Minux.clientagent_web.prototype.onopen = function(f_aTC_ws){
    for(var t_aI4_i = 0; t_aI4_i < this.listeners.length; t_aI4_i++) {
        if(this.listeners[t_aI4_i].onopen != null) {
            try
            {
                this.listeners[t_aI4_i].onopen(this);
            }
            catch(e) {}
        }
    }
};

Minux.clientagent_web.prototype.onclose = function(f_aTC_ws){
    for(var t_aI4_i = 0; t_aI4_i < this.listeners.length; t_aI4_i++) {
        if(this.listeners[t_aI4_i].onclose != null) {
            try
            {
                this.listeners[t_aI4_i].onclose(this);
            }
            catch(e) {}
        }
    }
};

Minux.clientagent_web.prototype.onrecv = function(f_aTC_ws, f_aTC_json){
    //适配到新的消息框架下20170513
    if(("app" in f_aTC_json) && ("msg" in f_aTC_json))
    {
        for(var t_aI4_i = 0; t_aI4_i < this.listeners.length; t_aI4_i++) {
            if(this.listeners[t_aI4_i].onmsg != null) {
                try
                {
                    this.listeners[t_aI4_i].onmsg(this, f_aTC_json.msg);
                }
                catch(e) {}
            }
        }
    }
    else if(("rpc" in f_aTC_json) && ("param" in f_aTC_json) && ("hash" in f_aTC_json) && ("ret" in f_aTC_json) && ("err" in f_aTC_json))
    {
        var t_aTC_callback = this.callbacks[f_aTC_json.hash];
        if (null != t_aTC_callback) {
            try
            {
                t_aTC_callback(this, f_aTC_json);
            }
            catch(e){}
            delete this.callbacks[f_aTC_json.hash];
        }
    }
    else {
        console.log("unknown recv:"+JSON.stringify(f_aTC_json));
    }
};

Minux.clientagent_web.prototype.onerror = function(f_aTC_ws){
    for(var t_aI4_i = 0; t_aI4_i < this.listeners.length; t_aI4_i++) {
        if(this.listeners[t_aI4_i].onerror != null) {
            try
            {
                this.listeners[t_aI4_i].onerror(this);
            }
            catch(e) {}
        }
    }
};

Minux.clientagent_web.prototype.onhint = function(f_aTC_ws, f_aI1_isrecv){
    for(var t_aI4_i = 0; t_aI4_i < this.listeners.length; t_aI4_i++) {
        if(this.listeners[t_aI4_i].onhint != null) {
            try
            {
                this.listeners[t_aI4_i].onhint(this, f_aI1_isrecv);
            }
            catch(e) {}
        }
    }
};

Minux.clientagent_web.prototype.open = function()
{
    this.jsonsocketclient_web.open();
};

Minux.clientagent_web.prototype.close = function()
{
    this.jsonsocketclient_web.close();
};

Minux.clientagent_web.prototype.destroy = function()
{
    this.jsonsocketclient_web.destroy();
};

Minux.clientagent_web.prototype.addListener = function(f_aTC_listener)
{
    this.listeners[this.listeners.length] = f_aTC_listener;
};

Minux.clientagent_web.prototype.removeListener = function(f_aTC_listener)
{
    for(var t_aI4_i = 0; t_aI4_i < this.listeners.length; t_aI4_i++) {
        if(this.listeners[t_aI4_i] == f_aTC_listener) {
            this.listeners.splice(t_aI4_i, 1);
            break;
        }
    }
};
/**********************************************************************************************************************/
Minux.clientagent_web.prototype.vinreg = function(f_str_vin, f_aTC_callback)
{
    var t_aTC_obj = {};
    t_aTC_obj.rpc = "vinreg";
    t_aTC_obj.param = {};
    t_aTC_obj.param.vin = f_str_vin;

    var t_str_jsonencode = encodeURIComponent(JSON.stringify(t_aTC_obj));
    var t_str_hash = [Minux.Hash.Mur32(t_str_jsonencode).toString(16), Minux.Hash.Fnv32(t_str_jsonencode).toString(16)].join('.');
    this.callbacks[t_str_hash] = f_aTC_callback;
    t_aTC_obj.hash = t_str_hash;

    this.jsonsocketclient_web.send(t_aTC_obj);
};

Minux.clientagent_web.prototype.vinunreg = function(f_str_vin, f_aTC_callback)
{
    var t_aTC_obj = {};
    t_aTC_obj.rpc = "vinunreg";
    t_aTC_obj.param = {};
    t_aTC_obj.param.vin = f_str_vin;

    var t_str_jsonencode = encodeURIComponent(JSON.stringify(t_aTC_obj));
    var t_str_hash = [Minux.Hash.Mur32(t_str_jsonencode).toString(16), Minux.Hash.Fnv32(t_str_jsonencode).toString(16)].join('.');
    this.callbacks[t_str_hash] = f_aTC_callback;
    t_aTC_obj.hash = t_str_hash;

    this.jsonsocketclient_web.send(t_aTC_obj);
};

Minux.clientagent_web.prototype.mysqlopen = function(f_str_sql, f_aTC_callback)
{
    var t_aTC_obj = {};
    t_aTC_obj.rpc = "mysqlopen";
    t_aTC_obj.param = {};
    t_aTC_obj.param.sql = f_str_sql;

    var t_str_jsonencode = encodeURIComponent(JSON.stringify(t_aTC_obj));
    var t_str_hash = [Minux.Hash.Mur32(t_str_jsonencode).toString(16), Minux.Hash.Fnv32(t_str_jsonencode).toString(16)].join('.');
    this.callbacks[t_str_hash] = f_aTC_callback;
    t_aTC_obj.hash = t_str_hash;

    this.jsonsocketclient_web.send(t_aTC_obj);
};

Minux.clientagent_web.prototype.mysqlexec = function(f_str_sql, f_aTC_callback)
{
    var t_aTC_obj = {};
    t_aTC_obj.rpc = "mysqlexec";
    t_aTC_obj.param = {};
    t_aTC_obj.param.sql = f_str_sql;

    var t_str_jsonencode = encodeURIComponent(JSON.stringify(t_aTC_obj));
    var t_str_hash = [Minux.Hash.Mur32(t_str_jsonencode).toString(16), Minux.Hash.Fnv32(t_str_jsonencode).toString(16)].join('.');
    this.callbacks[t_str_hash] = f_aTC_callback;
    t_aTC_obj.hash = t_str_hash;

    this.jsonsocketclient_web.send(t_aTC_obj);
};

Minux.clientagent_web.prototype.pgsqlopen = function(f_str_sql, f_aTC_callback)
{
    var t_aTC_obj = {};
    t_aTC_obj.rpc = "pgsqlopen";
    t_aTC_obj.param = {};
    t_aTC_obj.param.sql = f_str_sql;

    var t_str_jsonencode = encodeURIComponent(JSON.stringify(t_aTC_obj));
    var t_str_hash = [Minux.Hash.Mur32(t_str_jsonencode).toString(16), Minux.Hash.Fnv32(t_str_jsonencode).toString(16)].join('.');
    this.callbacks[t_str_hash] = f_aTC_callback;
    t_aTC_obj.hash = t_str_hash;

    this.jsonsocketclient_web.send(t_aTC_obj);
};

Minux.clientagent_web.prototype.pgsqlexec = function(f_str_sql, f_aTC_callback)
{
    var t_aTC_obj = {};
    t_aTC_obj.rpc = "pgsqlexec";
    t_aTC_obj.param = {};
    t_aTC_obj.param.sql = f_str_sql;

    var t_str_jsonencode = encodeURIComponent(JSON.stringify(t_aTC_obj));
    var t_str_hash = [Minux.Hash.Mur32(t_str_jsonencode).toString(16), Minux.Hash.Fnv32(t_str_jsonencode).toString(16)].join('.');
    this.callbacks[t_str_hash] = f_aTC_callback;
    t_aTC_obj.hash = t_str_hash;

    this.jsonsocketclient_web.send(t_aTC_obj);
};

Minux.clientagent_web.prototype.redisget = function(f_str_key, f_aTC_callback)
{
    var t_aTC_obj = {};
    t_aTC_obj.rpc = "redisget";
    t_aTC_obj.param = {};
    t_aTC_obj.param.key = f_str_key;

    var t_str_jsonencode = encodeURIComponent(JSON.stringify(t_aTC_obj));
    var t_str_hash = [Minux.Hash.Mur32(t_str_jsonencode).toString(16), Minux.Hash.Fnv32(t_str_jsonencode).toString(16)].join('.');
    this.callbacks[t_str_hash] = f_aTC_callback;
    t_aTC_obj.hash = t_str_hash;

    this.jsonsocketclient_web.send(t_aTC_obj);
};

Minux.clientagent_web.prototype.redisset = function(f_str_key, f_str_value, f_aTC_callback)
{
    var t_aTC_obj = {};
    t_aTC_obj.rpc = "redisset";
    t_aTC_obj.param = {};
    t_aTC_obj.param.key = f_str_key;
    t_aTC_obj.param.value = f_str_value;

    var t_str_jsonencode = encodeURIComponent(JSON.stringify(t_aTC_obj));
    var t_str_hash = [Minux.Hash.Mur32(t_str_jsonencode).toString(16), Minux.Hash.Fnv32(t_str_jsonencode).toString(16)].join('.');
    this.callbacks[t_str_hash] = f_aTC_callback;
    t_aTC_obj.hash = t_str_hash;

    this.jsonsocketclient_web.send(t_aTC_obj);
};

Minux.clientagent_web.prototype.sendto = function(f_str_vin, f_pI1_buf, f_aTC_callback)
{
    var t_aTC_obj = {};
    t_aTC_obj.rpc = "sendto";
    t_aTC_obj.param = {};
    t_aTC_obj.param.vin = f_str_vin;
    t_aTC_obj.param.hex = Minux.MString.toHexString(f_pI1_buf);

    var t_str_jsonencode = encodeURIComponent(JSON.stringify(t_aTC_obj));
    var t_str_hash = [Minux.Hash.Mur32(t_str_jsonencode).toString(16), Minux.Hash.Fnv32(t_str_jsonencode).toString(16)].join('.');
    this.callbacks[t_str_hash] = f_aTC_callback;
    t_aTC_obj.hash = t_str_hash;

    this.jsonsocketclient_web.send(t_aTC_obj);
};

Minux.clientagent_web.prototype.gb32960decode = function(f_str_hex, f_aTC_callback)
{
    var t_aTC_obj = {};
    t_aTC_obj.rpc = "gb32960decode";
    t_aTC_obj.param = {};
    t_aTC_obj.param.hex = f_str_hex;

    var t_str_jsonencode = encodeURIComponent(JSON.stringify(t_aTC_obj));
    var t_str_hash = [Minux.Hash.Mur32(t_str_jsonencode).toString(16), Minux.Hash.Fnv32(t_str_jsonencode).toString(16)].join('.');
    this.callbacks[t_str_hash] = f_aTC_callback;
    t_aTC_obj.hash = t_str_hash;

    this.jsonsocketclient_web.send(t_aTC_obj);
};

Minux.clientagent_web.prototype.vinsreg = function(f_lst_vins, f_aTC_callback)
{
    var t_aTC_obj = {};
    t_aTC_obj.rpc = "vinsreg";
    t_aTC_obj.param = {};
    t_aTC_obj.param.vins = f_lst_vins;

    var t_str_jsonencode = encodeURIComponent(JSON.stringify(t_aTC_obj));
    var t_str_hash = [Minux.Hash.Mur32(t_str_jsonencode).toString(16), Minux.Hash.Fnv32(t_str_jsonencode).toString(16)].join('.');
    this.callbacks[t_str_hash] = f_aTC_callback;
    t_aTC_obj.hash = t_str_hash;

    this.jsonsocketclient_web.send(t_aTC_obj);
};

Minux.clientagent_web.prototype.vinsunreg = function(f_lst_vins, f_aTC_callback)
{
    var t_aTC_obj = {};
    t_aTC_obj.rpc = "vinsunreg";
    t_aTC_obj.param = {};
    t_aTC_obj.param.vins = f_lst_vins;

    var t_str_jsonencode = encodeURIComponent(JSON.stringify(t_aTC_obj));
    var t_str_hash = [Minux.Hash.Mur32(t_str_jsonencode).toString(16), Minux.Hash.Fnv32(t_str_jsonencode).toString(16)].join('.');
    this.callbacks[t_str_hash] = f_aTC_callback;
    t_aTC_obj.hash = t_str_hash;

    this.jsonsocketclient_web.send(t_aTC_obj);
};

Minux.clientagent_web.prototype.hisselect = function(f_str_vin, f_str_starttime, f_str_stoptime, f_aTC_callback)
{
    var t_aTC_obj = {};
    t_aTC_obj.rpc = "hisselect";
    t_aTC_obj.param = {};
    t_aTC_obj.param.vin = f_str_vin;
    t_aTC_obj.param.starttime = f_str_starttime;
    t_aTC_obj.param.stoptime = f_str_stoptime;

    var t_str_jsonencode = encodeURIComponent(JSON.stringify(t_aTC_obj));
    var t_str_hash = [Minux.Hash.Mur32(t_str_jsonencode).toString(16), Minux.Hash.Fnv32(t_str_jsonencode).toString(16)].join('.');
    this.callbacks[t_str_hash] = f_aTC_callback;
    t_aTC_obj.hash = t_str_hash;

    this.jsonsocketclient_web.send(t_aTC_obj);
};

Minux.clientagent_web.prototype.vinsnapshot = function(f_str_vin, f_aTC_callback)
{
    var t_aTC_obj = {};
    t_aTC_obj.rpc = "vinsnapshot";
    t_aTC_obj.param = {};
    t_aTC_obj.param.vin = f_str_vin;

    var t_str_jsonencode = encodeURIComponent(JSON.stringify(t_aTC_obj));
    var t_str_hash = [Minux.Hash.Mur32(t_str_jsonencode).toString(16), Minux.Hash.Fnv32(t_str_jsonencode).toString(16)].join('.');
    this.callbacks[t_str_hash] = f_aTC_callback;
    t_aTC_obj.hash = t_str_hash;

    this.jsonsocketclient_web.send(t_aTC_obj);
};

Minux.clientagent_web.prototype.vinssnapshot = function(f_lst_vins, f_aTC_callback)
{
    var t_aTC_obj = {};
    t_aTC_obj.rpc = "vinssnapshot";
    t_aTC_obj.param = {};
    t_aTC_obj.param.vins = f_lst_vins;

    var t_str_jsonencode = encodeURIComponent(JSON.stringify(t_aTC_obj));
    var t_str_hash = [Minux.Hash.Mur32(t_str_jsonencode).toString(16), Minux.Hash.Fnv32(t_str_jsonencode).toString(16)].join('.');
    this.callbacks[t_str_hash] = f_aTC_callback;
    t_aTC_obj.hash = t_str_hash;

    this.jsonsocketclient_web.send(t_aTC_obj);
};

Minux.clientagent_web.prototype.vinonline = function(f_str_vin, f_aTC_callback)
{
    var t_aTC_obj = {};
    t_aTC_obj.rpc = "vinonline";
    t_aTC_obj.param = {};
    t_aTC_obj.param.vin = f_str_vin;

    var t_str_jsonencode = encodeURIComponent(JSON.stringify(t_aTC_obj));
    var t_str_hash = [Minux.Hash.Mur32(t_str_jsonencode).toString(16), Minux.Hash.Fnv32(t_str_jsonencode).toString(16)].join('.');
    this.callbacks[t_str_hash] = f_aTC_callback;
    t_aTC_obj.hash = t_str_hash;

    this.jsonsocketclient_web.send(t_aTC_obj);
};

Minux.clientagent_web.prototype.vinsonline = function(f_lst_vins, f_aTC_callback)
{
    var t_aTC_obj = {};
    t_aTC_obj.rpc = "vinsonline";
    t_aTC_obj.param = {};
    t_aTC_obj.param.vins = f_lst_vins;

    var t_str_jsonencode = encodeURIComponent(JSON.stringify(t_aTC_obj));
    var t_str_hash = [Minux.Hash.Mur32(t_str_jsonencode).toString(16), Minux.Hash.Fnv32(t_str_jsonencode).toString(16)].join('.');
    this.callbacks[t_str_hash] = f_aTC_callback;
    t_aTC_obj.hash = t_str_hash;

    this.jsonsocketclient_web.send(t_aTC_obj);
};

Minux.clientagent_web.prototype.vincontrol = function(f_str_usr, f_str_psw, f_str_vin, f_aI1_pid, f_pI1_buf, f_aTC_callback)
{
    var t_aTC_obj = {};
    t_aTC_obj.rpc = "vincontrol";
    t_aTC_obj.param = {};
    t_aTC_obj.param.user = f_str_usr;
    t_aTC_obj.param.password = f_str_psw;
    t_aTC_obj.param.vin = f_str_vin;
    t_aTC_obj.param.pid = f_aI1_pid;
    t_aTC_obj.param.hex = Minux.MString.toHexString(f_pI1_buf);

    var t_str_jsonencode = encodeURIComponent(JSON.stringify(t_aTC_obj));
    var t_str_hash = [Minux.Hash.Mur32(t_str_jsonencode).toString(16), Minux.Hash.Fnv32(t_str_jsonencode).toString(16)].join('.');
    this.callbacks[t_str_hash] = f_aTC_callback;
    t_aTC_obj.hash = t_str_hash;

    this.jsonsocketclient_web.send(t_aTC_obj);
};

Minux.clientagent_web.prototype.wechatgetopenid = function(f_str_code, f_aTC_callback)
{
    var t_aTC_obj = {};
    t_aTC_obj.rpc = "wechatgetopenid";
    t_aTC_obj.param = {};
    t_aTC_obj.param.code = f_str_code;

    var t_str_jsonencode = encodeURIComponent(JSON.stringify(t_aTC_obj));
    var t_str_hash = [Minux.Hash.Mur32(t_str_jsonencode).toString(16), Minux.Hash.Fnv32(t_str_jsonencode).toString(16)].join('.');
    this.callbacks[t_str_hash] = f_aTC_callback;
    t_aTC_obj.hash = t_str_hash;

    this.jsonsocketclient_web.send(t_aTC_obj);
};
/**********************************************************************************************************************/
export default Minux;