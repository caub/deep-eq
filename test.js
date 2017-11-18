const strip = require('strip-ansi');
const eq = require('.');

try {
	eq(null, undefined);
} catch (e){
	console.assert(strip(e.message).includes('null !== undefined'));
}

try {
	eq(null, 'lol');
} catch (e){
	console.assert(strip(e.message).includes(`null !== "lol"`));
}

try {
	eq('foo', 'lol');
} catch (e){
	console.assert(strip(e.message).includes(`"foo" !== "lol"`));
}

try {
	eq('lol', 'lol');
} catch (e){
	console.assert(false);
}

try {
	eq({
		foo: {
			bar: {
				qux: {
					lolcat: {
						bip: {
							yup: 56.3
						}
					},
					mlop: {}
				}
			}
		}
	}, {
		foo: {
			bar: {
				qux: {
					lolcat: {
						bip: {
							yup: 56
						}
					},
					mlep: {
						cool: 'tes',
						flip: 878.964
					}
				}
			}
		}
	})
} catch(e) { // todo full assert with chalk
	console.assert(strip(e.message).includes(` ↔ foo.bar.qux.lolcat.bip.yup: 56.3 !== 56
 ← foo.bar.qux.mlop: Object {}
 → foo.bar.qux.mlep: Object {
  "cool": "tes",
  "flip": 878.964,
}`));
}
