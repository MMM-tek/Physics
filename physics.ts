//% color="#268388" icon="\uf110" block="Physics"
namespace physics {
    let _s: Sprite = null
    let jumping = false

    /**
     * Adds 1x1 pixel physics to a sprite for ramps and slopes.
     * RULE: Do not set red walls on the ramp tiles in the tilemap editor.
     */
    //% block="add physics to %sprite=variables_get(mySprite)"
    export function addPhysics(sprite: Sprite) {
        _s = sprite

        // JUMP LOGIC: When A is pressed, disable the ramp magnet for 300ms
        controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
            // Only jump if we are on the ground/ramp (vertical velocity near 0)
            if (Math.abs(_s.vy) < 5) {
                _s.vy = -150 // Jump force
                jumping = true
                // Run a parallel pause to re-enable ramp physics after takeoff
                control.runInParallel(function () {
                    pause(300)
                    jumping = false
                })
            }
        })
    }

    game.onUpdate(function () {
        if (!_s || jumping) return

        // 1. VELOCITY FILTER: If already moving up, don't snap to ground
        if (_s.vy < 0) return

        // 2. SYMMETRIC SCANNING (Left tip, Right tip, and Center)
        let pointsX = [_s.left, _s.right, _s.x]
        let bestY = -1

        for (let i = 0; i < pointsX.length; i++) {
            let x = pointsX[i]

            // 3. ANTI-TELEPORT: Scan only 3px above feet
            // This range is blind to 16px walls, preventing "teleporting" to the top.
            for (let offset = -3; offset <= 4; offset++) {
                let checkX = Math.floor(x)
                let checkY = Math.floor(_s.bottom + offset)

                let col = checkX >> 4
                let row = checkY >> 4
                let img = tiles.getTileAt(col, row)

                if (img && img.width > 0) {
                    let px = checkX % 16
                    if (px < 0) px += 16
                    let py = checkY % 16
                    if (py < 0) py += 16

                    // If pixel is not transparent (color != 0)
                    if (img.getPixel(px, py) != 0) {
                        let yGlobal = (row * 16) + py
                        if (bestY == -1 || yGlobal < bestY) {
                            bestY = yGlobal
                        }
                        break
                    }
                }
            }
        }

        // 4. PRECISION ANCHORING (Anti-sinking)
        if (bestY != -1 && _s.bottom >= bestY - 4) {
            _s.bottom = bestY

            // Neutralize gravity's downward velocity
            if (_s.vy > 0) _s.vy = 0

            // Micro-adjustment to stay on top of the pixel
            _s.y -= 0.15
        }
    })
}
