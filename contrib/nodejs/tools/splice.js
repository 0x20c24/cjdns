#!/usr/bin/env node
/*
 * You may redistribute this program and/or modify it under the terms of
 * the GNU General Public License as published by the Free Software Foundation,
 * either version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

var labelToBits = function (label) {
    var out = [];
    label.split('.').reverse().forEach(function (sec) {
        var n = Number("0x" + sec);
        for (var i = 0; i < 16; i++) {
            out.unshift((n & 1) ? 1 : 0);
            n >>= 1;
        }
    });
    return out;
};

var bitsToChar = function (array) {
    var num = 0;
    for (var i = 0; i < 4; i++) {
        num |= (array.pop() << i);
    }
    return num.toString(16);
};

var bitsToLabel = function (array) {
    var chars = [];
    for (var i = 0; i < 16; i++) {
        if ((i % 4) === 0) { chars.unshift('.'); }
        chars.unshift(bitsToChar(array));
    }
    chars.pop();
    return chars.join('');
};

var randLabel = function () {
    var out = [];
    for (var i = 0; i < 4; i++) {
        var x = Math.random().toString(16);
        if (x.length < 6) { i--; continue; }
        out.push(x.substring(x.length-4));
    }
    return out.join('.');
}

var test = function () {
    for (var i = 0; i < 1000; i++) {
        var x = randLabel();
        if (bitsToLabel(labelToBits(x)) !== x) {
            throw new Error(x);
        }
    }
};
test();

var errorArray = function () {
    var out = [];
    for (var i = 0; i < 64; i++) { out.push(1); }
    return out;
};

var splice = function (goHere, viaHere) {
    while (viaHere.shift() === 0) ;
    goHere.push.apply(goHere, viaHere);
    while (goHere.shift() === 0) ;
    goHere.unshift(1);
    if (goHere.length >= 63) { return errorArray(); }
    while (goHere.length < 64) { goHere.unshift(0); }
    return goHere;
};

if (process.argv.length > 2) {
    var viaHereL = process.argv.pop();
    var goHereL = process.argv.pop();
    var result = splice(labelToBits(goHereL), labelToBits(viaHereL));
    console.log(bitsToLabel(result));
}

/*
var splice = function (goHere, viaHere) {
{
    uint64_t log2ViaHere = Bits_log2x64(viaHere);

    if (Bits_log2x64(goHere) + log2ViaHere > 59) {
        // Too big, can't splice.
        return UINT64_MAX;
    }

    return ((goHere ^ 1) << log2ViaHere) ^ viaHere;
}
*/
