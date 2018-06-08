export default function(image, currentWidth, currentHeight){
    if(!image) return '';

    let ratio, newWidth, newHeight, minSize;

    if(image.naturalWidth < image.naturalHeight){
        ratio = image.naturalHeight / image.naturalWidth;
        newWidth = currentWidth;
        newHeight = ratio * currentWidth;
        minSize = [150, ratio * 150]
    }
    else{
        ratio = image.naturalWidth / image.naturalHeight;
        newWidth = ratio * currentHeight;
        newHeight = currentHeight;
        minSize = [ratio * 150, 150]
    }

    return {width: newWidth, height: newHeight, minSize: minSize};
}