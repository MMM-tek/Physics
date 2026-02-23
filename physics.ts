//% color="#268388" icon="\uf110" block="Physics"
namespace physics {
    let physicsSprites: Sprite[] = []
    let semiSolids: Image[] = []
    let ladders: Image[] = []
    let wallJumpTiles: Image[] = []
    let iceTiles: Image[] = []
    let ignore: Image[] = []
    let right: Image[] = []
    let left: Image[] = []

    let MAX_STEP_UP = 8
    const GRAVITY_NORMAL = 500
    const TERMINAL_VELOCITY = 250

    //% block
    export function maxPixelsUp(n: number) { MAX_STEP_UP = n }

    //% block="set semi-solid tiles to %list"
    //% list.shadow="lists_create_with"
    //% list.defl="tileset_tile_picker"
    export function setSemiSolids(list: Image[]) { semiSolids = list }

    //% block="set ignore tiles to %list"
    //% list.shadow="lists_create_with"
    //% list.defl="tileset_tile_picker"
    export function setIgnore(list: Image[]) { ignore = list }

    //% block="set right tiles to %list"
    //% list.shadow="lists_create_with"
    //% list.defl="tileset_tile_picker"
    export function setRight(list: Image[]) {
        for (let valor of list) {
            right.push(valor)
        }
    }

    //% block="set left tiles to %list"
    //% list.shadow="lists_create_with"
    //% list.defl="tileset_tile_picker"
    export function setLeft(list: Image[]) {
        for (let valor of list) {
            left.push(valor)
        }
    }

    //% block="set ladder tiles to %list"
    //% list.shadow="lists_create_with"
    //% list.defl="tileset_tile_picker"
    export function setLadders(list: Image[]) { ladders = list }

    //% block="set wall-jump tiles to %list"
    //% list.shadow="lists_create_with"
    //% list.defl="tileset_tile_picker"
    export function setWallJumpTiles(list: Image[]) { wallJumpTiles = list }

    //% block="set ice tiles to %list"
    //% list.shadow="lists_create_with"
    //% list.defl="tileset_tile_picker"
    export function setIce(list: Image[]) { iceTiles = list }

    //% block="add physics to %sprite"
    //% sprite.shadow="variables_get"
    //% sprite.defl="mySprite"
    export function addPhysics(sprite: Sprite) {
        if (physicsSprites.indexOf(sprite) == -1) physicsSprites.push(sprite)

        controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
            // DETECTAR SI ESTÁ EN ESCALERA PARA DESACTIVAR SALTO
            let onLadder = isTileInList(sprite.x, sprite.y, ladders)
            if (onLadder) return

            // LÓGICA DE SALTO DE PARED
            if (isTileInList(sprite.right + 2, sprite.y, wallJumpTiles)) {
                sprite.vy = -165; sprite.vx = -140; sprite.x -= 3
            } else if (isTileInList(sprite.left - 2, sprite.y, wallJumpTiles)) {
                sprite.vy = -165; sprite.vx = 140; sprite.x += 3
            } else if (Math.abs(sprite.vy) < 20) {
                sprite.vy = -185; sprite.y -= 2
            }
        })
    }

    game.onUpdate(function () {
        for (let s of physicsSprites) {
            let onLadder = isTileInList(s.x, s.y, ladders)
            let onIce = isTileInList(s.x, s.bottom + 2, iceTiles)

            // --- 1. GESTIÓN DE GRAVEDAD (SIN REBOTE EN ESCALERAS) ---
            if (onLadder) {
                s.ay = 0; s.vx *= 0.6
                if (controller.up.isPressed()) s.vy = -85
                else if (controller.down.isPressed()) s.vy = 85
                else s.vy = 0
            } else {
                s.ay = GRAVITY_NORMAL
                if (onIce) s.vx *= 0.98
                else if (s.vy == 0) s.vx *= 0.75
            }

            // --- 2. DETECCIÓN HORIZONTAL Y RAMPAS (MANTIENE COLISIÓN) ---
            if (Math.abs(s.vx) > 0.1 && !onLadder) {
                let isRight = s.vx > 0
                let checkX = isRight ? s.right + 1 : s.left - 1
                let wallHit = false

                for (let h = s.top + 2; h < s.bottom - (MAX_STEP_UP + 1); h += 4) {
                    if (checkSolid(checkX, h, true)) { wallHit = true; break }
                }

                if (wallHit) {
                    s.vx = 0
                    let col = Math.floor(checkX / 16)
                    if (isRight) s.right = (col * 16) - 1
                    else s.left = (col * 16) + 16
                } else if (checkSolid(checkX, s.bottom - 1, true)) {
                    // Lógica de rampa: Sube píxel a píxel si detecta dibujo sólido
                    for (let step = 1; step <= MAX_STEP_UP; step++) {
                        if (!checkSolid(checkX, s.bottom - step - 1, true)) {
                            s.bottom -= step; break
                        }
                    }
                }
            }

            // --- 3. ANCLAJE AL SUELO (GROUNDING - CERO REBOTE) ---
            if (!onLadder && s.vy >= 0) {
                let bestY = -1
                let pointsX = [s.left + 2, s.right - 2, s.x]
                for (let x of pointsX) {
                    for (let offset = -1; offset <= 4; offset++) {
                        let cy = s.bottom + offset
                        if (checkSolid(x, cy, false)) {
                            if (bestY == -1 || cy < bestY) bestY = cy; break
                        }
                    }
                }
                if (bestY != -1 && s.bottom >= bestY - 6) { s.bottom = bestY; s.vy = 0 }
            }

            // --- 4. DETECCIÓN DE TECHO (SUAVE) ---
            if (s.vy < 0 && !onLadder) {
                if (checkSolid(s.x, s.top - 1, true) || checkSolid(s.left + 2, s.top - 1, true) || checkSolid(s.right - 2, s.top - 1, true)) {
                    s.vy = 12; s.top = (Math.floor(s.top / 16) * 16) + 16
                }
            }
            s.vy = Math.min(s.vy, TERMINAL_VELOCITY)
        }
    })

    function isTileInList(x: number, y: number, list: Image[]): boolean {
        let col = Math.floor(x / 16); let row = Math.floor(y / 16)
        if (col < 0 || row < 0) return false
        let t = tiles.getTileAt(col, row)
        return t && list.indexOf(t) != -1
    }

    function checkSolid(x: number, y: number, ignoreSemi: boolean): boolean {
        let col = Math.floor(x / 16); let row = Math.floor(y / 16)
        // Seguridad de límites sin usar getTilemap (error de consola eliminado)
        if (col < 0 || row < 0 || col >= 2000 || row >= 2000) return false

        let t = tiles.getTileAt(col, row)
        if (!t || ladders.indexOf(t) != -1) return false
        if (ignoreSemi && semiSolids.indexOf(t) != -1) return false
        if (ignore.indexOf(t) != -1) return false
        if (right.indexOf(t) != -1) return false
        if (left.indexOf(t) != -1) return false
        // DETECCIÓN POR PÍXEL: Obliga al personaje a no atravesar rampas dibujadas
        let px = Math.floor(x % 16); let py = Math.floor(y % 16)
        let hasPixel = t.getPixel(px, py) != 0
        let isWall = tiles.tileAtLocationIsWall(tiles.getTileLocation(col, row))

        return hasPixel || isWall
    }

    game.onUpdate(function () {
        for (let v of right) {
            for (let valor of tiles.getTilesByType(v)) {
                for (let sprite of physicsSprites)
                    if (sprite.tilemapLocation().column < valor.column) {
                        tiles.setWallAt(valor, true)
                    } else {
                        tiles.setWallAt(valor, false)
                    }
            }
        }
        for (let v of left) {
            for (let valor of tiles.getTilesByType(v)) {
                for (let sprite of physicsSprites)
                    if (sprite.tilemapLocation().column > valor.column) {
                        tiles.setWallAt(valor, true)
                    } else {
                        tiles.setWallAt(valor, false)
                    }
            }
        }
    })

}
