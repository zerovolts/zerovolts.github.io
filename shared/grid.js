export class Grid {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.cells = Array(width * height).fill(null);
    }

    isEmpty(x, y) {
        return this.isInBounds(x, y) && this.cells[this.coordToIndex(x, y)] === null;
    }

    get(x, y) {
        if (!this.isInBounds(x, y)) console.error(`Out of bounds: (${x}, ${y})`);
        return this.cells[this.coordToIndex(x, y)];
    }

    set(x, y, value) {
        if (!this.isInBounds(x, y)) console.error(`Out of bounds: (${x}, ${y})`);
        this.cells[this.coordToIndex(x, y)] = value;
    }

    isInBounds(x, y) {
        return x >= 0 && x < this.width && y >= 0 && y < this.height;
    }

    coordToIndex(x, y) {
        return x + (y * this.width);
    }

    indexToCoord(i) {
        return [
            i % this.width,
            Math.floor(i / this.width),
        ];
    }
}
