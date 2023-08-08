export function toString(data) {
    const slicedData = data.slice(5); 
    return slicedData.map((num) => String.fromCharCode(num)).join('');
  }