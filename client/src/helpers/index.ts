export default function averageRating(array: number[]) {
    let sum = 0;
    if (array.length > 0) {
      for (let i = 0; i < array!.length; i++) {
        sum += array![i];
      }
      let avg = sum / array?.length;
      return avg.toFixed(1);
    }
  }