const strip = require('strip-ansi');
const eq = require('..');

process.stdout.columns = 80;

try {
	eq(null, undefined);
} catch (e){
	console.assert(strip(e.message).includes('null'));
}

try {
	eq(null, 'lol');
} catch (e){
	console.assert(strip(e.message).includes(`null\t"lol"`));
}

try {
	eq('foo', 'lol');
} catch (e){
	console.assert(strip(e.message).includes(`"foo"\t"lol"`));
}

try {
	eq('lol', 'lol');
} catch (e){
	console.assert(false);
}

try {
	eq(['lol'], ['lol']);
} catch (e){
	console.assert(false);
}

try {
	eq(['lol','k'], ['lol', 'l']);
} catch (e){
	console.assert(strip(e.message).includes('1 "k"	1 "l"'));
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
	console.assert(strip(e.message).includes(
`….qux.lolcat.bip.yup 56.3	….qux.lolcat.bip.yup 56
foo.bar.qux.mlop {}      	
                         	foo.bar.qux.mlep {"cool": "tes", "fl…`));
}
