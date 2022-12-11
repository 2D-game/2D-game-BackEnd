import { Game } from '../game'
import * as map from '../map'
import * as player from '../player'
import { Apple } from '../object/item/Apple'
import * as pprof from 'pprof'
import * as fs from 'fs'

const mapPub = new map.Publisher()
const playerPub = new player.Publisher()

const game = new Game('1234', mapPub, playerPub)

const intervalBytes = 512 * 1024;
const stackDepth = 64;
pprof.heap.start(intervalBytes, stackDepth);

const apples = Array
	.from({ length: 1000000 }, () => new Apple(game, 1, { x: 0, y: 0 }, mapPub, playerPub))

const profile = pprof.heap.profile();
pprof.encode(profile).then(buf => {
	fs.writeFile('heap.pb.gz', buf, (err) => {
		if (err) throw err;
	})
})
