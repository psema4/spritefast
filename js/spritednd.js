/**
 * SpriteDND
 *
 * Derived from http://www.html5rocks.com/tutorials/file/dndfiles/
 * Author: Scott Elcomb <psema4@gmail.com> http://www.psema4.com/
 * Version: 0.1.0
 */

/**
 * @constructor
 */
var SpriteDND = function() {};

/**
 * @method SpriteDND.loadFile
 * @param {Event} evt Event object containing file information from the file input field
 * 
 * Accepts a local file and makes it the default spritesource image
 */
SpriteDND.prototype.loadFile = function(evt) {
    var files = evt.target.files;
    var f = files[0];

    if (f.type.match('image.*')) {
        var reader = new FileReader();
        reader.onload = (function(theFile) {
            return function(e) {
                var srcImgEl = document.getElementById('spritesource')
                srcImgEl.src = e.target.result;
                srcImgEl.title = theFile.name;
            };
        })(f);
        reader.readAsDataURL(f);
    }
}

/**
 * @method SpriteDND.dropFile
 * @param {Event} evt Event object containing file information from a drop operation
 * 
 * Accepts a dropped file and makes it the default spritesource image
 */
SpriteDND.prototype.dropFile = function(evt) {
    evt.stopPropagation();
    evt.preventDefault();

    var files = evt.dataTransfer.files;
    var f = files[0];

    if (f.type.match('image.*')) {
        var reader = new FileReader();
        reader.onload = (function(theFile) {
            return function(e) {
                var srcImgEl = document.getElementById('spritesource');
                srcImgEl.src = e.target.result;
                srcImgEl.title = theFile.name;
            };
        })(f);

        reader.readAsDataURL(f);
    }
}

/**
 * @method SpriteDND.dragOver
 * @param {Event} evt Event object containing file information from a drag operation
 *
 * Prevents default drag handlers in the browser
 */
SpriteDND.prototype.dragOver = function(evt) {
    evt.stopPropagation();
    evt.preventDefault();
}

// Init
if (! window.spriteDND) {
    window.spriteDND = new SpriteDND();

    if (window.console && window.console.log) {
        console.log('HTML5 File APIs check:');
        if (window.File)       console.log('  File ......... ok'); else console.log('  File ......... fail');
        if (window.FileReader) console.log('  FileReader ... ok'); else console.log('  FileReader ... fail');
        if (window.FileList)   console.log('  FileList ..... ok'); else console.log('  FileList ..... fail');
        if (window.Blob)       console.log('  Blob ......... ok'); else console.log('  Blob ......... fail');
    }

    document.getElementById('source').addEventListener('change', spriteDND.loadFile, false);
    document.getElementById('workarea').addEventListener('dragover', spriteDND.dragOver, false);
    document.getElementById('workarea').addEventListener('drop', spriteDND.dropFile, false);
}
