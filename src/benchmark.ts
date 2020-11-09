import * as Benchmark from 'benchmark'
import * as bsutil from './bitSetUtils'
import * as util from './util'
import * as game from './game'
import * as search from './search'
var suite = new Benchmark.Suite;
let WP = [bsutil.set(0n,15,1),'WP']
let BK = [bsutil.set(0n,20,1),'BK']
var board = util.newBoard(WP,BK);
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
.add('pickMove',function() {
 game.findMoves('W',[],board)
})
.add('build then search minimax', function() {
  let filled = search.startMiniMax('W',[],board)
  search.minimax(filled,3,true)
})
.add('build and search same time', function () {
  let root = {board:board,weight:0,move:[],children:[]}
  search.minimax1(root,3,'W',board,[])
})
.add('alpha beta', function () {
  let root = {board:board,weight:0,move:[],children:[]}
  search.minimax1alpha(root,3,'W',-Infinity,Infinity,board,[])
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
