namespace physics {
    let noJumpSprites: Sprite [] = []

    let MAX_STEP_UP = 8
    let GRAVITY_NORMAL = 500
    
    //% block="add physics to %sprite"
    //% sprite.shadow="variables_get"
    //% sprite.defl="mySprite"
    //% group="Physics"
    export function addNoJumpPhysics(sprite: Sprite) {
        if (noJumpSprites.indexOf(sprite) == -1) noJumpSprites.push(sprite)
    }
    game.onUpdate(function () {
        for (let s of noJumpSprites) {
            let onLadder = isTileInList(s.x, s.y, ladderList())
            let onIce = isTileInList(s.x, s.bottom + 2, iceList())
                s.ay = physics.gravity()
                if (onIce) s.vx *= 0.98
                else if (s.vy == 0) s.vx *= 0.75
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
        }
    })

}