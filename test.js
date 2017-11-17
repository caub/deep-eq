const eq = require('.');

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
	console.assert(e.message.includes('foo.bar.qux.lolcat.bip.yup'));
	console.assert(e.message.includes('56.3'));
	console.error(e);
}
