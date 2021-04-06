
const fs = require('fs');

var source = fs.readFileSync('./fib.wasm');

    async function test() {
        const lib = await WebAssembly.instantiate(new Uint8Array(source)).
        then(res => res.instance.exports);

//     const lib = await WebAssembly.instantiateStreaming(fetch('C:\Users\Graham Clyne\Documents\chessEngine\src\fib.wasm'), importObject)
//     .then(obj => obj.instance.exports.exported_func());
    
    const Benchmark = require('benchmark');

    const suite = new Benchmark.Suite;
    
    suite.
      add('wasm', function() {
        lib.fib(50);
      }).
      add('js', function() {
        fib(50);
      }).
      on('cycle', function(event) {
        console.log(String(event.target));
      }).
      on('complete', function() {
        console.log('Fastest is ' + this.filter('fastest').map('name'));
      }).
      run();
    }

function fib(n) {
  if (n < 2) {
    return 1;
  }
  return fib(n -1) + fib(n-2);
}

//emcc fib.c -Os -o fib.wasm -s WASM=1 -s SIDE_MODULE=1
test()