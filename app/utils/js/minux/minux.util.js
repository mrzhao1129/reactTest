/**
 * Created by XimLink on 2016/9/29.
 */
let Minux = new Object;
Minux.Hash = {};
Minux.Hash.Mur32 = function (key, seed) {
    var remainder, bytes, h1, h1b, c1, c1b, c2, c2b, k1, i;

    remainder = key.length & 3; // key.length % 4
    bytes = key.length - remainder;
    h1 = (seed === undefined) ? 0xffffffff : seed;
    c1 = 0xcc9e2d51;
    c2 = 0x1b873593;
    i = 0;

    while (i < bytes) {
        k1 =
            ((key.charCodeAt(i) & 0xff)) |
            ((key.charCodeAt(++i) & 0xff) << 8) |
            ((key.charCodeAt(++i) & 0xff) << 16) |
            ((key.charCodeAt(++i) & 0xff) << 24);
        ++i;

        k1 = ((((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16))) & 0xffffffff;
        k1 = (k1 << 15) | (k1 >>> 17);
        k1 = ((((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16))) & 0xffffffff;

        h1 ^= k1;
        h1 = (h1 << 13) | (h1 >>> 19);
        h1b = ((((h1 & 0xffff) * 5) + ((((h1 >>> 16) * 5) & 0xffff) << 16))) & 0xffffffff;
        h1 = (((h1b & 0xffff) + 0x6b64) + ((((h1b >>> 16) + 0xe654) & 0xffff) << 16));
    }

    k1 = 0;

    switch (remainder) {
        case 3:
            k1 ^= (key.charCodeAt(i + 2) & 0xff) << 16;
        case 2:
            k1 ^= (key.charCodeAt(i + 1) & 0xff) << 8;
        case 1:
            k1 ^= (key.charCodeAt(i) & 0xff);

            k1 = (((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16)) & 0xffffffff;
            k1 = (k1 << 15) | (k1 >>> 17);
            k1 = (((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16)) & 0xffffffff;
            h1 ^= k1;
    }

    h1 ^= key.length;

    h1 ^= h1 >>> 16;
    h1 = (((h1 & 0xffff) * 0x85ebca6b) + ((((h1 >>> 16) * 0x85ebca6b) & 0xffff) << 16)) & 0xffffffff;
    h1 ^= h1 >>> 13;
    h1 = ((((h1 & 0xffff) * 0xc2b2ae35) + ((((h1 >>> 16) * 0xc2b2ae35) & 0xffff) << 16))) & 0xffffffff;
    h1 ^= h1 >>> 16;

    return h1 >>> 0;
};
Minux.Hash.Fnv32 = function (key, seed) {
    var i, l,
        hval = (seed === undefined) ? 0x811c9dc5 : seed;
    for (i = 0, l = key.length; i < l; i++) {
        hval ^= key.charCodeAt(i);
        hval += (hval << 1) + (hval << 4) + (hval << 7) + (hval << 8) + (hval << 24);
    }
    return hval >>> 0;
};

Minux.MString = {};
Minux.MString.toHexString = function(f_pI1_buf) {
    var t_str_ret = "";
    if(f_pI1_buf != null)
    {
        for(var t_aI4_i = 0; t_aI4_i < f_pI1_buf.length; t_aI4_i++) {
            var t_aI1_t = f_pI1_buf[t_aI4_i];
            // t_str_t = "0123456789ABCDEF"[(t_aI1_t >> 4 ) & 0x0F] + "0123456789ABCDEF"[t_aI1_t & 0x0F];
            var t_str_t = "0123456789ABCDEF"[(t_aI1_t >> 4 ) & 0x0F] + "0123456789ABCDEF"[t_aI1_t & 0x0F]; //ymj 改171018           
            t_str_ret += t_str_t;
        }
    }
    return t_str_ret;
};

export default Minux;
