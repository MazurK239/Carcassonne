import { v4 as uuidv4 } from 'uuid';

export function getTileWithIds(tile, coords, gridTiles) {
    const newTile = {...tile};
    const idsMap = new Map();
    
    const topTile = gridTiles[`${coords[0] - 1}_${coords[1]}`];
    idsMap.set(tile.idTop, topTile ? topTile.idBottom : uuidv4());
    
    const leftTile = gridTiles[`${coords[0]}_${coords[1] - 1}`];
    idsMap.set(tile.idLeft, leftTile ? leftTile.idRight : uuidv4());
    
    const bottomTile = gridTiles[`${coords[0] + 1}_${coords[1]}`];
    idsMap.set(tile.idBottom, bottomTile ? bottomTile.idTop : uuidv4());
    
    const rightTile = gridTiles[`${coords[0]}_${coords[1] + 1}`];
    idsMap.set(tile.idRight, rightTile ? rightTile.idLeft : uuidv4());

    newTile.idTop = idsMap.get(tile.idTop);
    newTile.idLeft = idsMap.get(tile.idLeft);
    newTile.idBottom = idsMap.get(tile.idBottom);
    newTile.idRight = idsMap.get(tile.idRight);

    return newTile;
}