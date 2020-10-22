import * as Benchmark from 'benchmark'
import * as bsutil from './bitSetUtils'
var suite = new Benchmark.Suite;

// add tests
suite.add('RegExp#test', function() {
  /o/.test('Hello World!');
})
.add('lsb', function() {
  bsutil.lsb(15n)
})
.add('msb', function() {
    bsutil.lsb(15n)
})
// add listeners
.on('cycle', function(event) {
  console.log(String(event.target));
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').map('name'));
})
// run async
.run({ 'async': true });
