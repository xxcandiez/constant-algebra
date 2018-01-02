//our namespace contains our main libraary, resources, utility, ver
//naming key: m-matrix, v-vector, b-boolean, s-string

const List = require('immutable').List
const F = require('fraction.js')

const CARET = '^'
const CIFRAO = '$'
const DECIMAL = 10
const EMPTY_LIST = List()
const ZERO = F(0)

const ns = {
  lib: {
    mb: {
      isIdentity: (matrix) => (
        ns.lib.mb.isSquare(matrix) &&
        ns.lib.mb.isIdentityGivenisSquare(matrix)
      ),
      isIdentityGivenisSquare: (matrix) => (
        matrix.every((vector, row) => (
          vector.every((element, column) => (
            row !== column && element.equals(F(0)) ||
            row === column && element.equals(F(1))
          ))
        ))
      ),
      isSquare: (matrix) => (
        ns.lib.mn.rows(matrix) === ns.lib.mn.columns(matrix)
      ),
      sameSize: (matrix, matrix2) => (
        ns.lib.mn.rows(matrix) === ns.lib.mn.rows(matrix2) &&
        ns.lib.mn.columns(matrix) === ns.lib.mn.columns(matrix2)
      )
    },
    mm: {
      add: (matrix, matrix2) => (
        matrix.map((vector, row) => (
          vector.map((element, column) => (
            element.add(matrix2.get(row).get(column))
          ))
        ))
      ),
      adjugate: (matrix) => (
        ns.lib.mm.transpose(ns.lib.mm.cofactors(matrix))
      ),
      cofactors: (matrix) => (
        matrix.map((vector, row) => (
          vector.map((element, column) => (
            ns.lib.mn.cofactor(matrix, row, column)
          ))
        ))
      ),
      inverse: (matrix) => (
        ns.lib.mm.scale(
          ns.lib.mm.adjugate(
            matrix, F(1, ns.lib.mn.det(matrix))))
      ),
      minor: (matrix, row, column) => (
        matrix.delete(row)
              .map((vector) => (
                vector.delete(column)
              ))
      ),
      mul: (matrix, matrix2, i=0, res=EMPTY_LIST) => {
        if (i >= matrix.size) {
          return res
        } else {
          const update = res.push(ns.lib.mm.subMul(matrix.get(i), matrix2))
          return ns.lib.mm.mul(matrix, matrix2, i+1, update)
        }
      },
      subMul: (vector, matrix, i=0, res=EMPTY_LIST) => {
        if (i >= matrix.get(0).size) {
          return res
        } else {
          const update = res.push(ns.lib.vn.dot(vector, ns.lib.mv.column(matrix, i)))
          return ns.lib.mm.subMul(vector, matrix, i+1, update)
        }
      },
      testMul: (matrix, matrix2) => (

      ),
      rowAdd: (matrix, row1, row2, n=1) => (
        matrix.set(row1, ns.lib.mm.rowAfterAdding(matrix, row1, row2, n))
      ),
      rowAfterAdding: (m, r1, r2, n=1) => (
        ns.lib.vv.add(
          m.get(r1), ns.lib.vv.scale(m.get(r2), n))
      ),
      rowScale: (m, r, n=1) => (
        m.set(r, ns.lib.vv.scale(m.get(r), n))
      ),
      rowSwap: (m, r1, r2) => {
        const step1 = m.set(r1, m.get(r2))
        const step2 = step1.set(r2, m.get(r1))
        return step2
      },
      rref: (m, r=0, c=0) => {
        const pivotRow = ns.lib.mm.pivot(m, r, c)
        if (c >= m.get(0).size) {
          return m
        } else if (pivotRow !== undefined) {
          // step1: scale the the pivot to have a value of 1
          const step1 = ns.lib.mm.rowScale(m, pivotRow, m.get(pivotRow).get(c).inverse())
          // step2: swap the row with the pivot and the row you are trying to rrefify
          const step2 = ns.lib.mm.rowSwap(step1, pivotRow, r)
          // step3: use row addition to make the column that you are trying to rrefify
          //   be the only cell that has a non-zero value
          const toApplyPivot = ns.lib.mm.applyPivot(step2, r, c)
          // step4: attempty to rrefify the next column and row
          return ns.lib.mm.rref(toApplyPivot, r+1, c+1)
        } else {
          return ns.lib.mm.rref(m, r, c+1)
        }
      },
      /**
       * finds a pivot for a column of a matrix, starting the search from a row
       * @param {List} m: is a matrix representation
       * @param {Number} c: is the column that you want to find a pivot for
       * @param {Number} r: is the row that you want to start the search at
       * @return the first row that is on or after index r, on which a pivot for column
       *   c exists
       */
      pivot: (m, r, c) => {
        if (c >= ns.lib.mn.columns(m) || r >= ns.lib.mn.rows(m)) {
          return undefined
        } else if (!m.get(r).get(c).equals(0)) {
          return r
        } else {
          return ns.lib.mm.pivot(m, r+1, c)
        }
      },// find a pivot for the nth column, starting from row r
      applyPivot: (m, r, c, i=0) => {
        if (i >= m.size) {
          return m
        } else if (r !== i) {
          const update = ns.lib.mm.rowAdd(m, i, r, m.get(i).get(c).neg())
          return ns.lib.mm.applyPivot(update, r, c, i+1)
        } else {
          return ns.lib.mm.applyPivot(m, r, c, i+1)
        }
      },
      sub: (matrix, matrix2) => (
        matrix.map((vector, row) => (
          vector.map((element, column) => (
            element.sub(matrix2.get(row).get(column))
          ))
        ))
      ),
      transpose: (matrix) => (
        matrix.get(0).map((element, index) => (
          matrix.map((vector) => (
            vector.get(index)
          ))
        ))
      )
    },
    mn: {
      antiTrace: (matrix) => (
        ns.lib.mv.antiDiagonal(matrix).reduce((a, b) => (
          a.add(b)
        ))
      ),
      cofactor: (matrix, row, column) => (
        F(-1).pow(column+row)
             .mul(matrix.get(row).get(column))
             .mul(
               ns.lib.mn.det(
                 ns.lib.mm.minor(
                   matrix, row, column)))
      ),
      columns: (matrix) => (
        matrix.get(0).size
      ),
      det: (matrix) => {
        if (matrix.size === 1) {
          return matrix.get(0).get(0)
        } else {
          return ns.lib.mn.sumRowCofactors(matrix, 0)
        }
      },
      sumRowCofactors: (matrix, row, i=0, res=ZERO) => {
        if (i >= ns.lib.mn.columns(matrix)) {
          return res
        } else {
          return ns.lib.mn.sumRowCofactors(
            matrix, row, i+1, res.add(ns.lib.mn.cofactor(matrix, row, i)))
        }
      },
      mulAntiTrace: (matrix) => (
        ns.lib.mv.antiDiagonal(matrix).reduce((a, b) => (
          a.mul(b)
        ))
      ),
      mulTrace: (matirx) => (
        ns.lib.mv.diagonal(matrix).reduce((a, b) => (
          a.mul(b)
        ))
      ),
      rows: (matrix) => (
        matrix.size
      ),
      trace: (matrix) => (
        ns.lib.mv.diagonal(matrix).reduce((a, b) => (
          a.add(b)
        ))
      )
    },
    mv: {
      antiDiagonal: (matrix) => (
        matrix.map((vector, row) => (
          vector.get(-(row+1))
        ))
      ),
      column: (matrix, n) => (
        matrix.map((vector) => (
          vector.get(n)
        ))
      ),
      diagonal: (matrix) => (
        matrix.map((vector, row) => (
          vector.get(row)
        ))
      ),
      row: (matrix, n) => (
        matrix.get(n)
      )
    },

    vb: {
      sameSize: (v1, v2) => (
        v1.size === v2.size
      )
    },

    vn: {
      dot: (vector, vector2) => (
        vector.map((element, n) => (
          element.mul(vector2.get(n))
        )).reduce((a, b) => (
          a.add(b)
        ))
      )
    },

    vv: {
      add: (vector, vector2) => (
        vector.map((element, n) => (
          element.add(vector2.get(n))
        ))
      ),
      scale: (vector, amount) => (
        vector.map((element) => (
          element.mul(amount)
        ))
      ),
      sub: (vector, vector2) => (
        vector.map((element, n) => (
          element.sub(vector2.get(n))
        ))
      )
    }
  },
  res: {
    vectors: {
      z1: List([F(0)]),
      z2: List([F(0), F(0)]),
      z3: List([F(0), F(0), F(0)]),

      o1: List([F(1)]),
      o2: List([F(1), F(1)]),
      o3: List([F(1), F(1), F(1)]),

      s1: List([F(0)]),
      s2: List([F(0), F(1)]),
      s3: List([F(0), F(1), F(2)])
    },
    matrices: {
      // zero matrices
      z11: List([List([F(0)])]),
      z12: List([List([F(0), F(0)] )]),
      z13: List([List([F(0), F(0), F(0)])]),
      z21: List([List([F(0)]),
                 List([F(0)])]),
      z22: List([List([F(0), F(0)]),
                 List([F(0), F(0)])]),
      z23: List([List([F(0), F(0), F(0)]),
                 List([F(0), F(0), F(0)])]),
      z32: List([List([F(0), F(0)]),
                 List([F(0), F(0)]),
                 List([F(0), F(0)])]),
      z31: List([List([F(0)]),
                 List([F(0)]),
                 List([F(0)])]),
      z33: List([List([F(0), F(0), F(0)]),
                 List([F(0), F(0), F(0)]),
                 List([F(0), F(0), F(0)])]),
      z34: List([List([F(0), F(0), F(0), F(0)]),
                 List([F(0), F(0), F(0), F(0)]),
                 List([F(0), F(0), F(0), F(0)])]),
      z43: List([List([F(0), F(0), F(0)]),
                 List([F(0), F(0), F(0)]),
                 List([F(0), F(0), F(0)]),
                 List([F(0), F(0), F(0)])]),
      // identity matrices
      i11: List([List([F(1)])]),
      i22: List([List([F(1), F(0)]),
                 List([F(0), F(1)])]),
      i33: List([List([F(1), F(0), F(0)]),
                 List([F(0), F(1), F(0)]),
                 List([F(0), F(0), F(1)])]),
      s13: List([List([F(0), F(1), F(2)])]),
      s22: List([List([F(0), F(1)]),
                 List([F(2), F(3)])]),
      s33: List([List([F(0), F(1), F(2)]),
                 List([F(3), F(4), F(5)]),
                 List([F(6), F(7), F(8)])]),
      s31: List([List([F(0)]),
                List([F(1)]),
                List([F(2)])]),
      s34: List([List([F(0), F(1), F(2), F(3)]),
                 List([F(4), F(5), F(6), F(7)]),
                 List([F(8), F(9), F(10), F(11)])]),
      s43: List([List([F(0), F(1), F(2)]),
                 List([F(3), F(4), F(5)]),
                 List([F(6), F(7), F(8)]),
                 List([F(9), F(10), F(11)])]),
      o11: List([List([F(1)])]),
      o33: List([List([F(1), F(1), F(1)]),
                 List([F(1), F(1), F(1)]),
                 List([F(1), F(1), F(1)])])
    }
  },
  util: {
    listToFraction: (list) => {
      if(list.size === 1) {
        return F(list.get(0))
      } else if(list.size === 2) {
        return F(list.get(0), list.get(1))
      } else {
        return undefined
      }
    },
    convertBool: (bool) => (
      {true: 1, false: 0}[bool.toString()]
    ),
    size: {
      number: (number) => {
        if(Math.abs(number) < 1) {
          return 1
        } else {
          return Math.floor(Math.log10(Math.abs(number))) + 1 + ns.util.convertBool(number<0)
        }
      },
      fraction: (fraction) => {
        if(fraction.d === 1) {
          return ns.util.size.number(fraction.n) + ns.util.convertBool(fraction.s === -1)
        } else {
          return ns.util.size.number(fraction.n) + 1 + ns.util.size.number(fraction.d) + ns.util.convertBool(fraction.s === -1)
        }
      },
      vector: (vector, index=ZERO, size=ZERO) => {
      }
    },
    test: {
      trivialTester: (regex) => (
        (str) => (RegExp(regex).test(str))
      ),
      openParens: (str) => (ns.util.test.trivialTester('^' + ns.util.regex.openParens())(str)),
      closeParens: (str) => (ns.util.test.trivialTester('^' + ns.util.regex.closeParens())(str)),
      divider: (str) => (ns.util.test.trivialTester('^' + ns.util.regex.divider())(str)),
      slash: (str) => (ns.util.test.trivialTester('^' + ns.util.regex.slash())(str)),
      digit: (str) => (ns.util.test.trivialTester('^' + ns.util.regex.digit())(str)),
      number: (str) => (ns.util.test.trivialTester('^' + ns.util.regex.number())(str)),
      fraction: (str) => (ns.util.test.trivialTester('^' + ns.util.regex.fraction())(str)),
      vector: (str) => (ns.util.test.trivialTester('^' + ns.util.regex.vector())(str)),
      matrix: (str) => (ns.util.test.trivialTester('^' + ns.util.regex.matrix())(str))
    },
    extract: {
      trivialExtractor: (regex) => (
        (str) => {
          const res = RegExp(regex).exec(str)
          return {res: res[0], size:res[0].length}
        }
      ),
      openParens: (str) => (ns.util.extract.trivialExtractor('^'+ns.util.regex.openParens())(str)),
      closeParens: (str) => (ns.util.extract.trivialExtractor('^'+ns.util.regex.closeParens())(str)),
      divider: (str) => (ns.util.extract.trivialExtractor('^'+ns.util.regex.divider())(str)),
      slash: (str) => (ns.util.extract.trivialExtractor('^'+ns.util.regex.slash())(str)),
      digit: (str) => {
        const res = RegExp('^'+ns.util.regex.digit()).exec(str)
        return {res: parseInt(res[0], DECIMAL), size: res[0].length}
      },
      number: (str) => {
        const res = RegExp('^'+ns.util.regex.number()).exec(str)
        return {res: parseInt(res[0], DECIMAL), size: res[0].length}
      },
      fraction: (str, index=0, res=EMPTY_LIST) => {
        const isNumber = ns.util.parse.number(str.slice(index))
        const isSlash = ns.util.parse.slash(str.slice(index))
        if(isNumber) {
          return ns.util.extract.fraction(str, index+isNumber.size, res.push(isNumber.res))
        } else if(isSlash) {
          return ns.util.extract.fraction(str, index+1, res)
        } else {
          return {res: ns.util.listToFraction(res), size: index}
        }
      },
      vector: (str, index=0, res=EMPTY_LIST) => {
        const isFraction = ns.util.parse.fraction(str.slice(index))
        const isOpenParens = ns.util.parse.openParens(str.slice(index))
        const isDivider = ns.util.parse.divider(str.slice(index))
        if(isFraction) {
          return ns.util.extract.vector(str, index+isFraction.size, res.push(isFraction.res))
        } else if(isOpenParens || isDivider) {
          return ns.util.extract.vector(str, index+1, res)
        } else {
          return {res: res, size: index+1}
        }
      },
      matrix: (str, index=0, res=EMPTY_LIST) => {
        const isVector = ns.util.parse.vector(str.slice(index))
        const isOpenParens = ns.util.parse.openParens(str.slice(index))
        const isDivider = ns.util.parse.divider(str.slice(index))
        if(isVector) {
          return ns.util.extract.matrix(str, index+isVector.size, res.push(isVector.res))
        } else if(isOpenParens || isDivider) {
          return ns.util.extract.matrix(str, index+1, res)
        } else {
          return {res: res, size: index+1}
        }
      }
    },
    parse: {
      trivialParser: (tester, extractor) => (
        (str) => {
          if(!tester(str)) {
            return undefined
          } else {
            return extractor(str)
          }
        }
      ),
      openParens: (str) => (
        ns.util.parse.trivialParser(ns.util.test.openParens, ns.util.extract.openParens)(str)
      ),
      closeParens: (str) => (
        ns.util.parse.trivialParser(ns.util.test.closeParens, ns.util.extract.closeParens)(str)
      ),
      divider: (str) => (
        ns.util.parse.trivialParser(ns.util.test.divider, ns.util.extract.divider)(str)
      ),
      slash: (str) => (
        ns.util.parse.trivialParser(ns.util.test.slash, ns.util.extract.slash)(str)
      ),
      digit: (str) => (
        ns.util.parse.trivialParser(ns.util.test.digit, ns.util.extract.digit)(str)
      ),
      number: (str) => (
        ns.util.parse.trivialParser(ns.util.test.number, ns.util.extract.number)(str)
      ),
      fraction: (str) => (
        ns.util.parse.trivialParser(ns.util.test.fraction, ns.util.extract.fraction)(str)
      ),
      vector: (str) => (
        ns.util.parse.trivialParser(ns.util.test.vector, ns.util.extract.vector)(str)
      ),
      matrix: () => (
        ns.util.parse.trivialParser(ns.util.test.matrix, ns.util.extract.matrix)(str)
      )
    },
    regex: {
      digit: () => ('(\\d)'),
      number: () => ('((-|)(\\d)+)'),
      fraction: () => {
        const number = ns.util.regex.number()
        return `((${number}\\/${number})|${number})`
      },
      openParens: () => ('(\\(|\\{|\\[)'),
      closeParens: () => ('(\\)|\\}|\\])'),
      divider: () => ('(\\,)'),
      slash: () => ('(\\/)'),
      vector: () => {
        const openParens = ns.util.regex.openParens()
        const fraction = ns.util.regex.fraction()
        const divider = ns.util.regex.divider()
        const closeParens = ns.util.regex.closeParens()
        return `(${openParens}${fraction}(${divider}${fraction})*${closeParens})`
      },
      matrix: () => {
        const openParens = ns.util.regex.openParens()
        const vector = ns.util.regex.vector()
        const divider = ns.util.regex.divider()
        const closeParens = ns.util.regex.closeParens()
        return `(${openParens}${vector}(${divider}${vector})*${closeParens})`
      }
    }
  },
  ver: {
    is: {
      isMatrix: (matrix) => (
        List.isList(matrix) &&
        matrix.every((element) => (
          ver.is.isVector(element)
        )) &&
        matrix.every((element) => (
          ns.lib.vb.sameSize(element, matrix.get(0))
        ))
      ),
      isVector: (vector) => (
        List.isList(vector) &&
        vector.size > 0 &&
        vector.every(ver.is.isFraction)
      ),
      isFraction: (element) => (
        element.n !== undefined &&
        element.d !== undefined &&
        element.s !== undefined
      )
    },
    mb: {
      isIdentityDefined: (m) => (
        ver.is.isMatrix(m)
      ),
      isSquareDefined: (m) => (
        ver.is.isMatrix(m)
      ),
      sameSizeDefined: (m1, m2) => (
        ver.is.isMatrix(m1) && ver.is.isMatrix(m2)
      )
    },
    mm: {
      addDefined: (m1, m2) => (
        ns.lib.mb.sameSize(m1, m2)
      ),
      adjugateDefined: (m) => (
        ver.is.isMatrix(m) &&
        ns.lib.mb.isSquare(m)
      ),
      cofactorsDefined: (m) => (
        ver.is.isMatrix(m) &&
        ns.lib.mb.isSquare(m)
      ),
      inverseDefined: (m) => (
        ver.is.isMatrix(m) &&
        ns.lib.mb.isSquare(m) &&
        (ns.lib.mn.det(m) !== 0)
      ),
      minorDefined: (m, r, c) => (
        ver.is.isMatrix(m) &&
        ver.mvv.rowDefined(r) &&
        ver.mvv.columnDefined(c)
      ),
      mulDefined: (m1, m2) => (
        ver.is.isMatrix(m1) &&
        ver.is.isMatrix(m2) &&
         ns.lib.mn.rows(m1) === ns.lib.mn.columns(m2)
      ),
      rowAddDefined: (m, r1, r2, n) => (
        ver.is.isMatrix(m) &&
        ver.mmv.rowDefined(r1) &&
        ver.mmv.rowDefined(r2) &&
        ver.is.isFraction(n)
      ),
      rowScaleDefined: (m, r, n) => (
        ver.is.isMatrix(m) &&
        ns.lib.mmv.rowDefined(r) &&
        ver.is.isFraction(n)
      ),
      rowSwapDefined: (m, r1, r2) => (
        ver.is.isMatrix(m) &&
        mmv.rowDefined(r1) &&
        mmv.rowDefined(r2)
      ),
      rrefDefined: (m) => (
        ver.is.isMatrix(m)
      ),
      subDefined: (m1, m2) => (
        ns.lib.mb.sameSize(m1, m2)
      ),
      transposeDefined: (m) => (
        ver.is.isMatrix(m)
      )
    },
    mn: {
      antiTraceDefined: (m) => (
        ver.is.isMatrix(m) &&
        ns.lib.mb.isSquare(m)
      ),
      cofactorDefined: (m, r, c) => (
        ver.is.isMatrix(m) &&
        ver.is.rowDefined(m, r) &&
        ver.is.columnDefined(m, c)
      ),
      columnsDefined: (m) => (
        ver.is.isMatrix(m)
      ),
      detDefined: (m) => (
        ver.is.isMatrix(m) && ns.lib.mb.isSquare(m)
      ),
      mulAntiTraceDefined: (m) => (
        ver.is.isMatrix(m) &&
        ns.lib.mb.isSquare(m)
      ),
      mulTraceDefined: (m) => (
        ver.is.isMatrix(m) &&
        ns.lib.mb.isSquare(m)
      ),
      rowsDefined: (m) => (
        ver.is.isMatrix(m)
      ),
      traceDefined: (m) => (
        ver.is.isMatrix(m) &&
        ns.lib.mb.isSquare(m)
      )
    },
    mv: {
      antiDiagonalDefined: (m) => (
        ver.is.isMatrix(m) &&
        ns.lib.mb.isSquare(m)
      ),
      columnDefined: (m, n) => (
        ver.is.isMatrix(m) &&
        n >= 0 &&
        n <= m.get(0).size-1
      ),
      diagonalDefined: (m) => (
        ver.is.isMatrix(m) &&
        ns.lib.mb.isSquare(m)
      ),
      rowDefined: (m, n) => (
        ver.is.isMatrix(m) &&
        n >= 0 &&
        n <= m.size-1
      )
    },
    vb: {
      sameSizeDefined: (v1, v2) => (
        ver.is.isVector(v1) &&
        ver.is.isVector(v2)
      )
    },
    vn: {
      dotDefined: (v1, v2) => (
        ver.is.isVector(v1) &&
        ver.is.isVector(v2) &&
        ns.lib.vb.sameSize(v1, v2)
      )
    },
    vv: {
      addDefined: (v1, v2) => (
        ver.is.isVector(v1) &&
        ver.is.isVector(v2) &&
        ns.lib.vb.sameSize(v1, v2)
      ),
      scaleDefined: (v, n) => (
        ver.is.isVector(v) &&
        ver.is.isFraction(n)
      ),
      subDefined: (v1, v2) => (
        ver.is.isVector(v1) &&
        ver.is.isVector(v2) &&
        ns.lib.vb.sameSize(v1, v2)
      )
    }
  }
}

module.exports = ns
