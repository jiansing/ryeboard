export default function snapToGrid(x, y) {
    const snappedX = Math.round(x / 15) * 15;
    const snappedY = Math.round(y / 15) * 15;

    return [snappedX, snappedY]
}