/**
 * Calculates natural proportion of an image
 *
 * @param {DOM} image - image HTML element
 * @param {integer} currentWidth - current width in integer
 * @param {integer} currentHeight - current height in integer
 * @returns {*} - returns proportional new dimension based and the min size as an array
 */
export default function(image, currentWidth, currentHeight){
    if(!image) return '';

    let ratio, newWidth, newHeight, minSize;

    /**
     * Check if image naturally has greater height or width.
     * This is to prevent strange behaviours of very long heights or width
     */
    if(image.naturalWidth < image.naturalHeight){
        ratio = image.naturalHeight / image.naturalWidth;
        newWidth = currentWidth;
        newHeight = ratio * currentWidth;

        //150 because of min width / height of widgets
        minSize = [150, ratio * 150]
    }
    else{
        ratio = image.naturalWidth / image.naturalHeight;
        newWidth = ratio * currentHeight;
        newHeight = currentHeight;

        //150 because of min width / height of widgets
        minSize = [ratio * 150, 150]
    }

    return {width: newWidth, height: newHeight, minSize: minSize};
}