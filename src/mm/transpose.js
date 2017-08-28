const List = require('immutable').List
const column = require('../mv').column
/**
 * finds the transpose of a matrix.
 * @param {matirx} m: is a matrix representation
 * @param {Number} i: is the index
 * @param {List} res: is the result matrix
 * @return a matrix that is the transpose of m
 */
const transpose = (matrix, i=0, res=List()) => {
  if (i >= matrix.get(0).size) {
    return res
  } else {
    return transpose(
      matrix, i+1, res.push(column(matrix, i)))
  }
}

module.exports = transpose
