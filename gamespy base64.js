
function replaceAll(str, search, junc) {
	return str.split(search).join(junc);
}

function Gamespy() {

}

Gamespy.prototype.encode_password = function(password) {
	password = Buffer.from(this.gs_pass_encode(Buffer.from(password, 'ascii'))).toString('base64');
	password = replaceAll(password, '=', '_');
	password = replaceAll(password, '+', '[');
	password = replaceAll(password, '/', ']');
	return password;
};
Gamespy.prototype.decode_password = function(password) {
	var password = replaceAll(password, '_', '=');
	password = replaceAll(password, '[', '+');
	password = replaceAll(password, ']', '/');
	return this.gs_pass_encode(Buffer.from(password, 'base64')).toString('ascii');
};

Gamespy.prototype.gs_pass_encode = function(plain_text) {
	num = 0x79707367;
	for(var i = 0; i < plain_text.length; i ++) {
		num = this.gs_lame(num);
		a = num % 0xFF;
		plain_text[i] ^= a;
	}
	return plain_text;
}

Gamespy.prototype.gs_lame = function(num) {
	c = (num >> 16) & 0xffff;
    a = num & 0xffff;
    c *= 0x41a7;
    a *= 0x41a7;

    a = this.int32(a + ((c & 0x7fff) << 16));
    if (a < 0) {
        a &= 0x7fffffff;
        a += 1;
    }

    a = this.int32(a + (c >> 15));

    if (a < 0) {
        a &= 0x7fffffff;
        a += 1;
    }
    return a
}
Gamespy.prototype.int32 = function(x) {
	if (x > 0xFFFFFFFF) {
        throw new Error('OverflowError');
	}
    if (x > 0x7FFFFFFF) {
        x = int(0x100000000 - x);
        if (x < 2147483648) {
        	return -x;
        }
        else {
            return -2147483648;
        }
    }
    return x;
}

var justAGuy = new Gamespy();

var encPas = justAGuy.encode_password('pass');
console.log(encPas);

var decPas = justAGuy.decode_password(encPas);
console.log(decPas);