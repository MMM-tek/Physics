// Código generado automáticamente. No editar.
namespace myTiles {
    //% fixedInstance jres blockIdentity=images._tile
    export const transparency16 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile7 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile8 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile9 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile1 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile2 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile3 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile4 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile5 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile6 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile10 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile12 = image.ofBuffer(hex``);

    helpers._registerFactory("tilemap", function(name: string) {
        switch(helpers.stringTrim(name)) {
            case "nivel1":
            case "nivel1":return tiles.createTilemap(hex`190010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000b000000000000000b0000000b00000b00000a0000000000000000000000000000000000000000000000000000000000000000000b000000000000000000000000000000000900000000000000000000000000000000000000000009000000000000000000000000000402030000000005060000000a00000000000000000000040203000000000000070800000c0100000000000000000402030000000000000000000000000c0100000000000000020300000000000000000000000000000c01000000010b0b0b0b0000000000000000000101000000000c0100000001000000000000000000010100000000000000000c01000000010b0b0b0b0000000000000000000000000000000c0000000001000000000000000000000000000000000000000c000000000101010101010101010101010101010101010101010101010101`, img`
.........................
.........................
.........................
.........................
.........................
.........................
.........................
.........................
.........................
.........................
.........................
.........................
.........................
.........................
.........................
2222222222222222222222222
`, [myTiles.transparency16,sprites.castle.tilePath2,myTiles.tile7,myTiles.tile8,myTiles.tile9,myTiles.tile1,myTiles.tile2,myTiles.tile3,myTiles.tile4,myTiles.tile5,myTiles.tile6,myTiles.tile10,myTiles.tile12], TileScale.Sixteen);
        }
        return null;
    })

    helpers._registerFactory("tile", function(name: string) {
        switch(helpers.stringTrim(name)) {
            case "transparency16":return transparency16;
            case "miMosaico5":
            case "tile7":return tile7;
            case "miMosaico6":
            case "tile8":return tile8;
            case "miMosaico7":
            case "tile9":return tile9;
            case "miMosaico":
            case "tile1":return tile1;
            case "miMosaico0":
            case "tile2":return tile2;
            case "miMosaico1":
            case "tile3":return tile3;
            case "miMosaico2":
            case "tile4":return tile4;
            case "miMosaico3":
            case "tile5":return tile5;
            case "miMosaico4":
            case "tile6":return tile6;
            case "miMosaico8":
            case "tile10":return tile10;
            case "miMosaico9":
            case "tile12":return tile12;
        }
        return null;
    })

}
// Código generado automáticamente. No editar.
