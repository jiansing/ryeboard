/**
 * Generate new, unique IDs. Up to 100,000
 *
 * @param {Array} idArray - an array of the existing IDs
 * @returns {number} - generated ID
 */

export default function generateUID(idArray){
    let id = 0;

    while(idArray.findIndex((elem)=> elem === id)!==-1){
        if(id === 100000) break;
        id++;
    }
    return id;
}