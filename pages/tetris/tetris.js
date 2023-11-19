import { GlApp } from "/shared/gl-app.js"
import { ShaderProgram } from "/shared/graphics.js";
import { Grid } from "/shared/grid.js";

// Initiate the fetch first to reduce perceived loading.
let shaderSources = Promise.all([
    fetch("/pages/tetris/background.vert").then(res => res.text()),
    fetch("/pages/tetris/background.frag").then(res => res.text()),
    fetch("/pages/tetris/block.vert").then(res => res.text()),
    fetch("/pages/tetris/block.frag").then(res => res.text()),
]);

document.addEventListener("DOMContentLoaded", async () => {
    shaderSources = await shaderSources;

    const canvas = document.getElementById("main-canvas");
    const app = new TetrisApp(canvas);
    app.run();
});

class TetrisApp extends GlApp {
    setup(gl) {
        gl.clearColor(0.1, 0.1, 0.1, 1.0);

        this.backgroundRenderer = new ShaderProgram(
            gl,
            shaderSources[0],
            shaderSources[1],
            ["a_position", "a_uv"],
            [],
        );

        this.blockRenderer = new BlockRenderer(gl);
        this.backgroundMesh = new BackgroundMesh(gl, this.backgroundRenderer);

        this.timer = 0;
        this.grid = new GameGrid(10, 22);
        this.tetromino = randomTetromino(this.grid);

        document.addEventListener("keydown", e => {
            e.preventDefault();
            switch (e.key) {
                case "a":
                case "ArrowLeft":
                    this.tetromino.moveLeft();
                    break;
                case "d":
                case "ArrowRight":
                    this.tetromino.moveRight();
                    break;
                case "q":
                    this.tetromino.rotateLeft();
                    break;
                case "e":
                case "ArrowUp":
                    this.tetromino.rotateRight();
                    break;
                case "s":
                case "ArrowDown":
                    this.tetromino.drop();
                    break;
            }
        });
    }

    update(delta) {
        this.timer += delta;
        if (this.timer > 1) {
            if (this.tetromino.canFall()) {
                this.tetromino.y -= 1;
            } else {
                this.grid.mergeTetromino(this.tetromino);
                for (let y = 0; y < 20; y++) {
                    if (this.grid.isRowFull(y)) {
                        this.grid.deleteRow(y);
                        // retry this row because everything will have shifted
                        y -= 1;
                    }
                }
                if (this.grid.hasBlocksInDeadZone()) {
                    this.grid.reset();
                }
                this.tetromino = randomTetromino(this.grid);
            }
            this.timer = 0;
        }
    }

    render(gl) {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        this.backgroundMesh.draw();

        // Grid blocks
        for (let y = 0; y < this.grid.height; y++) {
            for (let x = 0; x < this.grid.width; x++) {
                const color = this.grid.get(x, y);
                if (color === null) continue;
                this.blockRenderer.draw([x, y], color);
            }
        }

        // Tetromino blocks
        for (let y = 0; y < this.tetromino.height; y++) {
            for (let x = 0; x < this.tetromino.width; x++) {
                if (this.tetromino.isEmpty(x, y)) continue;
                const color = this.tetromino.get(x, y);
                const coord = [x + this.tetromino.x, y + this.tetromino.y];
                this.blockRenderer.draw(coord, color);
            }
        }
    }
}

class BackgroundMesh {
    constructor(gl, renderer) {
        this.gl = gl;
        this.renderer = renderer;

        const positions = new Float32Array([
            -1, -1,
            1, -1,
            1, 1,
            -1, 1,
        ]);
        this.positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

        const uvs = new Float32Array([
            0, 0,
            1, 0,
            1, 1,
            0, 1,
        ]);
        this.uvBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, uvs, gl.STATIC_DRAW);

        const indices = new Uint16Array([0, 1, 2, 2, 3, 0]);
        this.indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
    }

    draw() {
        const gl = this.gl;

        gl.useProgram(this.renderer.program);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.vertexAttribPointer(this.renderer.attributeLocations.a_position, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this.renderer.attributeLocations.a_position);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
        gl.vertexAttribPointer(this.renderer.attributeLocations.a_uv, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this.renderer.attributeLocations.a_uv);

        gl.drawElements(gl.TRIANGLE_STRIP, 6, gl.UNSIGNED_SHORT, this.indexBuffer);
    }
}

class BlockRenderer {
    constructor(gl) {
        this.gl = gl;

        this.shaderProgram = new ShaderProgram(
            gl,
            shaderSources[2],
            shaderSources[3],
            ["aPosition", "aUv"],
            ["uCoord", "uColor"],
        );

        const positions = new Float32Array([
            0, 0,
            1, 0,
            1, 1,
            0, 1,
        ]);
        this.positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

        const uvs = new Float32Array([
            0, 0,
            1, 0,
            1, 1,
            0, 1,
        ]);
        this.uvBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, uvs, gl.STATIC_DRAW);

        const indices = new Uint16Array([0, 1, 2, 2, 3, 0]);
        this.indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
    }

    draw(position, color) {
        const gl = this.gl;

        gl.useProgram(this.shaderProgram.program);

        gl.uniform3fv(this.shaderProgram.uniformLocations.uColor, color);
        gl.uniform2fv(this.shaderProgram.uniformLocations.uCoord, position);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.vertexAttribPointer(this.shaderProgram.attributeLocations.aPosition, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this.shaderProgram.attributeLocations.aPosition);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
        gl.vertexAttribPointer(this.shaderProgram.attributeLocations.aUv, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this.shaderProgram.attributeLocations.aUv);

        gl.drawElements(gl.TRIANGLE_STRIP, 6, gl.UNSIGNED_SHORT, this.indexBuffer);
    }
}

class Coord {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    add(other) {
        return new Coord(
            this.x + other.x,
            this.y + other.y,
        );
    }

    sub(other) {
        return new Coord(
            this.x - other.x,
            this.y - other.y,
        );
    }
}

class GameGrid extends Grid {
    // Returns the highest non-empty point under the given point.
    nearestFallPoint(x, y) {
        for (let yy = y - 1; yy >= -1; yy--) {
            if (this.isEmpty(x, yy)) continue;
            // Return the point above the non-empty point.
            return [x, yy + 1];
        }
    }

    mergeTetromino(tetromino) {
        for (let y = 0; y < tetromino.width; y++) {
            for (let x = 0; x < tetromino.height; x++) {
                if (tetromino.isEmpty(x, y)) continue;
                const block = tetromino.get(x, y);
                this.set(x + tetromino.x, y + tetromino.y, block);
            }
        }
    }

    hasBlocksInDeadZone() {
        for (let x = 0; x < this.width; x++) {
            if (!this.isEmpty(x, 20)) return true;
            if (!this.isEmpty(x, 21)) return true;
        }
        return false;
    }

    isRowFull(y) {
        for (let x = 0; x < this.width; x++) {
            if (this.isEmpty(x, y)) return false;
        }
        return true;
    }

    deleteRow(y) {
        this.cells.splice(y * this.width, this.width);
        this.cells.push(...Array(10).fill(null));
    }

    reset() {
        this.cells = Array(this.width * this.height).fill(null);
    }
}

class TetrominoGrid extends Grid {
    constructor(gameGrid, width, height) {
        super(width, height);
        this.gameGrid = gameGrid;
        this.x = 3;
        this.y = 19;
    }

    moveLeft() {
        const leftmostPositions = [];
        // scan over every row, finding the leftmost block position
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (this.isEmpty(x, y)) continue;
                leftmostPositions.push([x + this.x, y + this.y]);
                // we only want the leftmost one, so skip the rest
                break;
            }
        }

        // abort if there are any non-empty spaces to the left
        for (const position of leftmostPositions) {
            if (!this.gameGrid.isEmpty(position[0] - 1, position[1])) return;
        }

        this.x -= 1;
    }

    moveRight() {
        const rightmostPositions = [];
        // scan over every row, finding the rightmost block position
        for (let y = 0; y < this.height; y++) {
            for (let x = this.width - 1; x >= 0; x--) {
                if (this.isEmpty(x, y)) continue;
                rightmostPositions.push([x + this.x, y + this.y]);
                // we only want the rightmost one, so skip the rest
                break;
            }
        }

        // abort if there are any non-empty spaces to the right
        for (const position of rightmostPositions) {
            if (!this.gameGrid.isEmpty(position[0] + 1, position[1])) return;
        }

        this.x += 1;
    }

    drop() {
        // TODO(?): merge tetromino as soon as it drops

        const lowestPositions = [];
        // scan over every column, finding the lowest block position
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                if (this.isEmpty(x, y)) continue;
                lowestPositions.push([x + this.x, y + this.y]);
                // we only want the lowest one, so skip the rest
                break;
            }
        }

        let minFallDistance = 100;
        for (const position of lowestPositions) {
            const nearestFallPoint = this.gameGrid.nearestFallPoint(position[0], position[1]);
            const fallDistance = position[1] - nearestFallPoint[1];
            minFallDistance = Math.min(fallDistance, minFallDistance);
        }

        this.y -= minFallDistance;
    }

    rotateLeft() {
        const newCells = Array(this.width * this.height).fill(null);
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                newCells[this.coordToIndex(x, y)] = this.get(y, this.width - 1 - x);
            }
        }

        // abort if new positions collide with anything
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (newCells[this.coordToIndex(x, y)] === null) continue;
                if (this.gameGrid.isEmpty(x + this.x, y + this.y)) continue;
                return;
            }
        }

        this.cells = newCells;
    }

    rotateRight() {
        const newCells = Array(this.width * this.height).fill(null);
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                newCells[this.coordToIndex(x, y)] = this.get(this.height - 1 - y, x);
            }
        }

        // abort if new positions collide with anything
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (newCells[this.coordToIndex(x, y)] === null) continue;
                if (this.gameGrid.isEmpty(x + this.x, y + this.y)) continue;
                return;
            }
        }

        this.cells = newCells;
    }

    canFall() {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (this.isEmpty(x, y)) continue;
                if (!this.gameGrid.isEmpty(x + this.x, y + this.y - 1)) {
                    return false;
                }
            }
        }
        return true;
    }
}

function randomTetromino(grid) {
    const r = Math.floor(Math.random() * 7);
    switch (r) {
        case 0:
            return iTetromino(grid);
        case 1:
            return jTetromino(grid);
        case 2:
            return lTetromino(grid);
        case 3:
            return oTetromino(grid);
        case 4:
            return sTetromino(grid);
        case 5:
            return tTetromino(grid);
        case 6:
            return zTetromino(grid);
        default:
            console.error("Invalid tetromino");
    }
}

function tetromino(grid, color, width, height, positions) {
    const result = new TetrominoGrid(grid, width, height);
    for (const position of positions) {
        result.set(position[0], position[1], color);
    }
    return result;
}

const low = .1;
const mid = .3;
const high = .5;

function iTetromino(grid) {
    return tetromino(grid, [low, high, high], 4, 4, [[0, 2], [1, 2], [2, 2], [3, 2]]);
}

function jTetromino(grid) {
    return tetromino(grid, [low, low, high], 3, 3, [[0, 2], [0, 1], [1, 1], [2, 1]]);
}

function lTetromino(grid) {
    return tetromino(grid, [high, mid, low], 3, 3, [[0, 1], [1, 1], [2, 1], [2, 2]]);
}

function oTetromino(grid) {
    return tetromino(grid, [high, high, low], 2, 2, [[0, 0], [0, 1], [1, 0], [1, 1]]);
}

function sTetromino(grid) {
    return tetromino(grid, [low, high, low], 3, 3, [[0, 1], [1, 1], [1, 2], [2, 2]]);
}

function tTetromino(grid) {
    return tetromino(grid, [high, low, high], 3, 3, [[0, 1], [1, 1], [2, 1], [1, 2]]);
}

function zTetromino(grid) {
    return tetromino(grid, [high, low, low], 3, 3, [[0, 2], [1, 2], [1, 1], [2, 1]]);
}