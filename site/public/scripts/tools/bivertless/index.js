'use strict';

const Bivertless = require('bivertless');
const FileSaver = require('file-saver');

document.getElementById('go').addEventListener('click', go);

function go() {
    let rom = document.getElementById('rom');
    let method1 = document.getElementById('method1');
    let method2 = document.getElementById('method2');

    if (rom.files.length <= 0) return;

    for(let i = 0; i < rom.files.length; i += 1) {
        let reader = new FileReader();
        reader.onloadend = function () {
            let data = new Uint8Array(this.result);

            method1.checked && Bivertless[method1.value](data);
            method2.checked && Bivertless[method2.value](data);

            FileSaver.saveAs(new Blob([data.buffer]), "rom.inv.gb");
        };
        reader.onerror   = function(){};
        reader.onabort   = function(){};

        reader.readAsArrayBuffer(rom.files[i]);
    }
}
