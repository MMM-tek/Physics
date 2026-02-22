//%color="#268388" icon="\uf110" block="Physics"
namespace physics {
    let physicsSprites: Sprite[] = []
    let semiSolids: Image[] = []
    let ladders: Image[] = []
    let wallJumpTiles: Image[] = []
    const MAX_STEP_UP = 8

    //%block="set semi-solid tiles to %list"
    //%list.shadow="lists_create_with"
    //%list.defl="tileset_tile_picker"
    export function setSemiSolids(list: Image[]) { semiSolids = list }

    //%block="set ladder tiles to %list"
    //%list.shadow="lists_create_with"
    //%list.defl="tileset_tile_picker"
    export function setLadders(list: Image[]) { ladders = list }

    //%block="set wall-jump tiles to %list"
    //%list.shadow="lists_create_with"
    //%list.defl="tileset_tile_picker"
    export function setWallJumpTiles(list: Image[]) { wallJumpTiles = list }

    //%block="add physics to %sprite"
    //%sprite.shadow="variables_get"
    //%sprite.defl="mySprite"
    export function addPhysics(sprite: Sprite) {
        if (physicsSprites.indexOf(sprite) == -1) physicsSprites.push(sprite)
        controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
            if (isTileInList(sprite.right + 2, sprite.y, wallJumpTiles)) {
                sprite.vy = -165; sprite.vx = -140; sprite.x -= 3
            } else if (isTileInList(sprite.left - 2, sprite.y, wallJumpTiles)) {
                sprite.vy = -165; sprite.vx = 140; sprite.x += 3
            } else if (Math.abs(sprite.vy) < 8 || isTileInList(sprite.x, sprite.y, ladders)) {
                sprite.vy = -175
                sprite.y -= 2
            }
        })
    }

    game.onUpdate(function () {
        for (let s of physicsSprites) {
            let onLadder = isTileInList(s.x, s.y, ladders)
            let wallHit = false

            if (onLadder) {
                s.ay = 0
                if (controller.up.isPressed()) s.vy = -80
                else if (controller.down.isPressed()) s.vy = 80
                else s.vy = 0
            } else {
                s.ay = 350
            }

            // --- 1. DETECCION DE PARED (MODIFICADA PARA RAMPAS) ---
            if (Math.abs(s.vx) > 0.1 && !onLadder) {
                let isRight = s.vx > 0
                let checkX = isRight ? s.right + 1 : s.left - 1

                // IMPORTANTE: Escaneamos desde la cabeza hasta justo ANTES de la rampa (MAX_STEP_UP)
                // Esto permite que el sistema de rampas detecte el escalon de 5px sin que la pared lo bloquee
                for (let h = s.top + 2; h < s.bottom - (MAX_STEP_UP + 1); h += 4) {
                    if (checkSolid(checkX, h, true)) {
                        wallHit = true
                        break
                    }
                }

                if (wallHit) {
                    s.vx = 0
                    let tileCol = Math.floor(checkX / 16)
                    if (isRight) s.right = (tileCol * 16) - 1
                    else s.left = (tileCol * 16) + 16
                } else {
                    // --- 2. SISTEMA DE SUBIDA DE RAMPAS (STEP-UP) ---
                    // Solo si no chocamos con una pared alta, revisamos si hay un escalon bajo
                    if (checkSolid(checkX, s.bottom - 1, true)) {
                        // Buscamos el espacio vacio mas cercano hacia arriba
                        for (let h = 1; h <= MAX_STEP_UP; h++) {
                            if (!checkSolid(checkX, s.bottom - h, true)) {
                                s.bottom -= (h - 1)
                                break
                            }
                        }
                    }
                }
            }

            // --- 3. ANCLAJE AL SUELO ---
            if (!onLadder && s.vy >= 0) {
                let bestY = -1
                let pointsX = [s.left + 2, s.right - 2, s.x]
                for (let x of pointsX) {
                    for (let offset = -2; offset <= 4; offset++) {
                        let cy = Math.floor(s.bottom + offset)
                        if (checkSolid(x, cy, false)) {
                            if (cy > s.y + 2) {
                                if (bestY == -1 || cy < bestY) bestY = cy
                            }
                            break
                        }
                    }
                }
                if (bestY != -1 && s.bottom >= bestY - 5) {
                    s.bottom = bestY
                    s.vy = 0
                }
            }

            // --- 4. TECHO ---
            if (s.vy < 0 && !onLadder) {
                if (checkSolid(s.x, s.top - 1, true)) {
                    s.vy = 0
                    s.top = (Math.floor(s.top / 16) * 16) + 16
                }
            }
        }
    })

    function isTileInList(x: number, y: number, list: Image[]): boolean {
        let col = Math.floor(x / 16); let row = Math.floor(y / 16)
        let t = tiles.getTileAt(col, row)
        return t && list.indexOf(t) != -1
    }

    function checkSolid(x: number, y: number, ignoreSemi: boolean): boolean {
        let col = Math.floor(x / 16); let row = Math.floor(y / 16)
        let t = tiles.getTileAt(col, row)
        if (!t || ladders.indexOf(t) != -1) return false
        if (ignoreSemi && semiSolids.indexOf(t) != -1) return false
        return t.getPixel(Math.floor(x % 16), Math.floor(y % 16)) != 0
    }
}
