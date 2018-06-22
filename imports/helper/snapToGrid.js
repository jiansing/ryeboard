/**
 * Snaps dragged widget to a grid of 15 x 15
 *
 * @param {Integer} x - x coordinate
 * @param {Integer} y - y coordinate
 * @returns {[Integer,Integer]} - newly aligned coordinate
 */
export default function snapToGrid(x, y) {
    const snappedX = Math.round(x / 15) * 15;
    const snappedY = Math.round(y / 15) * 15;

    return [snappedX, snappedY]
}