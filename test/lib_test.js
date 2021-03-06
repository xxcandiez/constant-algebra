const List = require('immutable').List
const F = require('fraction.js')
const assert = require('chai').assert
const lib = require('..').lib
const m = require('..').res.m
const v = require('..').res.v

describe('lib.mb.isIdentity', function() {
  describe('checks for identity matrix', function() {
    it('accepts 1x1 identity matrix', function() {
      assert.isTrue(lib.mb.isIdentity(m.i11))
    }),
    it('accepts 2x2 identity matrix', function() {
      assert.isTrue(lib.mb.isIdentity(m.i22))
    }),
    it('accepts 3x3 identity matrix', function() {
      assert.isTrue(lib.mb.isIdentity(m.i33))
    }),
    it('rejects 3x4 matrix', function() {
      assert.isFalse(lib.mb.isIdentity(m.s34))
    }),
    it('rejects almost 3x3 identity matrix', function() {
      const l = List([List([F(1), F(0), F(0)]),
                      List([F(0), F(1), F(0)]),
                      List([F(0), F(0), F(0)])])
      assert.isFalse(lib.mb.isIdentity(l))
    })
  })
})
describe('lib.mb.isSquare', function() {
  describe('checks for square matrix', function() {
    it('accepts 1x1 square matrix', function() {
      assert.isTrue(lib.mb.isSquare(m.i11))
    }),
    it('accepts 2x2 square matrix', function() {
      assert.isTrue(lib.mb.isSquare(m.z22))
    }),
    it('rejects 1x2 non square matrix', function() {
      assert.isFalse(lib.mb.isSquare(m.z12))
    }),
    it('rejects 4x3 non square matrix', function() {
      assert.isFalse(lib.mb.isSquare(m.s34))
    })
  })
})
describe('lib.mb.sameSize', function() {
  describe('checks for same sized matrices', function() {
    it('accepts 2 1x1 matrices', function() {
      assert.isTrue(lib.mb.sameSize(m.i11, m.z11))
    }),
    it('accepts 2 2x2 matrices', function() {
      assert.isTrue(lib.mb.sameSize(m.i22, m.z22))
    }),
    it('rejects 1x1 and 1x2 matrices', function() {
      assert.isFalse(lib.mb.sameSize(m.i11, m.z12))
    })
  })
})
//lib.mm
describe('lib.mm.add', function() {
  describe('gives the sum of two same sized matrices', function() {
    it('can sum two 1x1 matrices', function() {
      const l = List([List([F(2)])])
      assert(lib.mm.add(m.i11, m.i11).equals(l))
    }),
    it('can sum two 2x2 matrices', function() {
      const l = List([List([F(2), F(0)]),
                      List([F(0), F(2)])])
      assert(lib.mm.add(m.i22, m.i22).equals(l))
    }),
    it('can sum two 4x3 matrices', function() {
      const l = List([List([F(0), F(2), F(4)]),
                      List([F(6), F(8), F(10)]),
                      List([F(12), F(14), F(16)]),
                      List([F(18), F(20), F(22)])])
      assert(lib.mm.add(m.s43, m.s43).equals(l))
    })
  })
})
describe('lib.mm.cofactors', function() {
  describe('gives the cofactor matrix of a matrix', function() {
    it('can cofactorize s33', function() {
      const l = List([List([F(0), F(6), F(-6)]),
                      List([F(18), F(-48), F(30)]),
                      List([F(-18), F(42), F(-24)])])
      assert(lib.mm.cofactors(m.s33).equals(l))
    })
  })
})
describe('lib.mm.inverse', function() {
  describe('gives the inverse matrix of a matrix', function() {
    it('can give the inverse of a 1x1 identity matrix', function() {

    })
  })
})
describe('lib.mm.minor', function() {
  describe('gives the minor of a matrix with the rth row and cth column removed', function() {
    it('can remove the 1th row and 1th column from an identity matrix', function() {
      const l = List([List([F(1), F(0)]),
                      List([F(0), F(1)])])
      assert(lib.mm.minor(m.i33, 1, 1).equals(l))
    })
  })
})
describe('lib.mm.mul', function() {
  describe('gives the result of a matrix multiplied by another', function() {
    it('can mul two 1x1 matrices ([[1]]*[[5]] = [[5]])', function() {
      const m5 = List([List([F(5)])])
      const l = List([List([F(5)])])
      assert(lib.mm.mul(m.o11, m5).equals(l))
    }),
    it('can mul a 3x1 with a 1x3 matrix (m.s13 * m.s31)', function() {
      const l = List([List([F(5)])])
      assert(lib.mm.mul(m.s13, m.s31).equals(l))
    }),
    it('can mul a 1x3 matrix with a 3x1 matrix (m.s31 * m.s13)', function() {
      const l = List([List([F(0), F(0), F(0)]),
                      List([F(0), F(1), F(2)]),
                      List([F(0), F(2), F(4)])])
      assert(lib.mm.mul(m.s31, m.s13).equals(l))
    }),
    it('can mul a 3x4 matrix  with a 4x3 matrix (m.s34 * m.s43)', function() {
      const l = List([List([F(42), F(48), F(54)]),
                      List([F(114), F(136), F(158)]),
                      List([F(186), F(224), F(262)])])
      assert(lib.mm.mul(m.s34, m.s43).equals(l))
    }),
    it('can mul a 4x3 matrix with a 3x4 amtrix (m.s43 * m.s34)', function() {
      const l = List([List([F(20), F(23), F(26), F(29)]),
                      List([F(56), F(68), F(80), F(92)]),
                      List([F(92), F(113), F(134), F(155)]),
                      List([F(128), F(158), F(188), F(218)])])
      assert(lib.mm.mul(m.s43, m.s34).equals(l))
    })
  })
})
describe('lib.mm.rowAdd', function() {
  describe('gives the result of elementary row addition on a matrix', function() {
    it('can add the 1th row to the 0th row on a 3x3 matrix (m.i33)', function() {
      const l = List([List([F(1), F(1), F(0)]),
                      List([F(0), F(1), F(0)]),
                      List([F(0), F(0), F(1)])])
      assert(lib.mm.rowAdd(m.i33, 0, 1, 1).equals(l))
    }),
    it('can add the 1th row twice to the 2th row of a 3x3 matrix (m.i33)', function() {
      const l = List([List([F(1), F(0), F(0)]),
                      List([F(0), F(1), F(0)]),
                      List([F(0), F(2), F(1)])])
      assert(lib.mm.rowAdd(m.i33, 2, 1, 2).equals(l))
    })
  })
})
describe('lib.mm.rowScale', function() {
  describe('gives the result of elementary row scale on a matrix', function() {
    it('can scale the second row of a 3x3 matrix by 3 (m.i33)', function() {
      const l = List([List([F(1), F(0), F(0)]),
                      List([F(0), F(3), F(0)]),
                      List([F(0), F(0), F(1)])])
      assert(lib.mm.rowScale(m.i33, 1, 3).equals(l))
    })
  })
})
describe('lib.mm.rowSwap', function() {
  describe('geves the result of elementary row swap on a matrix', function() {
    it('can swap the 1th row with the 1th row on a 3x3 matrix (m.i33)', function() {
      assert(lib.mm.rowSwap(m.i33, 1, 1).equals(m.i33))
    }),
    it('can swap the 0th row with the 2th row on a 3x3 amtrix (m.i33)', function() {
      const l = List([List([F(0), F(0), F(1)]),
                      List([F(0), F(1), F(0)]),
                      List([F(1), F(0), F(0)])])
      assert(lib.mm.rowSwap(m.i33, 0, 2).equals(l))
    })
  })
})
describe('lib.mm.rref', function() {
  describe('gives the row reduced echelon form of a matrix', function() {
    it('can reffify a 1x1 matrix (m.i11)', function() {
      assert(lib.mm.rref(m.i11).equals(m.i11))
    }),
    it('can reffify a 2x2 matrix (m.i22)', function() {
      assert(lib.mm.rref(m.i22).equals(m.i22))
    }),
    it('can reffify a 3x3 matrix (m.i33)', function() {
      assert(lib.mm.rref(m.i33).equals(m.i33))
    }),
    it('can reffify a harder 3x3 matrix (m.s33)', function() {
      const l = List([List([F(1), F(0), F(-1)]),
                      List([F(0), F(1), F(2)]),
                      List([F(0), F(0), F(0)])])
      assert(lib.mm.rref(m.s33).equals(l))
    }),
    it('can reffify a 3x4 matrix (m.s34)', function() {
      const l = List([List([F(1), F(0), F(-1), F(-2)]),
                      List([F(0), F(1), F(2), F(3)]),
                      List([F(0), F(0), F(0), F(0)])])
      assert(lib.mm.rref(m.s34).equals(l))
    }),
    it('can reffify a 4x3 matrix (m.s43)', function() {
      const l = List([List([F(1), F(0), F(-1)]),
                      List([F(0), F(1), F(2)]),
                      List([F(0), F(0), F(0)]),
                      List([F(0), F(0), F(0)])])
      assert(lib.mm.rref(m.s43).equals(l))
    }),
    it('can reffify a 3x3 matrix (m.o33)', function() {
      const l = List([List([F(1), F(1), F(1)]),
                     List([F(0), F(0), F(0)]),
                     List([F(0), F(0), F(0)])])
      assert(lib.mm.rref(m.o33).equals(l))
    })
  })
})
describe('lib.mm.sub', function() {
  describe('gives the difference of two same sized matrices', function() {
    it('can sub two 1x1 matrices', function() {
      const l = List([List([F(0)])])
      assert(lib.mm.sub(m.i11, m.i11).equals(l))
    }),
    it('can sub two 2x2 matrices', function() {
      const l = List([List([F(0), F(0)]),
                      List([F(0), F(0)])])
      assert(lib.mm.sub(m.i22, m.i22).equals(l))
    }),
    it('can sub two 4x3 matrices', function() {
      const l = List([List([F(0), F(0), F(0)]),
                      List([F(0), F(0), F(0)]),
                      List([F(0), F(0), F(0)]),
                      List([F(0), F(0), F(0)])])
      assert(lib.mm.sub(m.s43, m.s43).equals(l))
    })
  })
})
describe('lib.mm.transpose', function() {
  describe('gives the transpose of a matrix', function() {
    it('can transpose a 1x1 matrix', function() {
      assert(lib.mm.transpose(m.i11).equals(m.i11))
    }),
    it('can transpose a 1x3 matrix', function() {
      assert(lib.mm.transpose(m.z13).equals(m.z31))
    }),
    it('can transpose a 3x1 matrix', function() {
      assert(lib.mm.transpose(m.z31).equals(m.z13))
    }),
    it('can transpose a 3x4 matrix', function() {
      const l = List([List([F(0) ,F(4), F(8)]),
                      List([F(1), F(5), F(9)]),
                      List([F(2), F(6), F(10)]),
                      List([F(3), F(7), F(11)])])
      assert(lib.mm.transpose(m.s34).equals(l))
    })
  })
})
//lib.mn
describe('lib.mn.det', function() {
  describe('gives the determinant of a square matrix', function() {
    it('gives the determinant of a 1x1 matrix (m.i11)', function() {
      assert(lib.mn.det(m.i11).equals(F(1)))
    }),
    it('gives the determinant of a 2x2 matrix (m.s22)', function() {
      assert(lib.mn.det(m.s22).equals(F(-2)))
    })
  })
})
//lib.mv
describe('lib.mv.antiDiagonal', function() {
  describe('gives the antiDiagonal of a square matrix', function() {
    it('can get the antiDiagonal of a 3x3 matrix(m.s33)', function() {
      const l = List([F(2), F(4), F(6)])
      assert(lib.mv.antiDiagonal(m.s33).equals(l))
    })
  })
})
//lib.mv
describe('lib.mv.column', function() {
  describe('gives a column vector of a matrix', function() {
    it('can get the 0th column of a 3x3 matrix(m.s33)', function() {
      const l = List([F(0), F(3), F(6)])
      assert(lib.mv.column(m.s33, 0))
    }),
    it('can get the 1th column of a 3x3 matrix(m.s33)', function() {
      const l = List([F(1), F(4), F(7)])
      assert(lib.mv.column(m.s33, 1))
    }),
    it('can get the 2th column of a 3x3 matrix(m.s33)', function() {
      const l = List([F(2), F(5), F(8)])
      assert(lib.mv.column(m.s33, 2))
    })
  })
})
describe('lib.mv.diagonal', function() {
  describe('gives the diagonal of a square matrix', function() {
    it('can get the diagonal of a 3x3 matrix(m.s33)', function() {
      const l = List([F(0), F(4), F(8)])
      assert(lib.mv.diagonal(m.s33).equals(l))
    })
  })
})
describe('lib.mv.row', function() {
  describe('gives a row vector of a matrix', function() {
    it('can give the 0th row of a 3x3 matrix (m.s33)', function() {
      const l = List([F(0), F(1), F(2)])
      assert(lib.mv.row(m.s33, 0).equals(l))
    }),
    it('can give the 1th row of a 3x3 matrix (m.s33)', function() {
      const l = List([F(3), F(4), F(5)])
      assert(lib.mv.row(m.s33, 1).equals(l))
    }),
    it('can give the 2th row of a 3x3 matrix (m.s33)', function() {
      const l = List([F(6), F(7), F(8)])
      assert(lib.mv.row(m.s33, 2).equals(l))
    })
  })
})
//lib.vb
describe('lib.vb.sameSize', function() {
  describe('checks for same sized vectors', function() {
    it('accepts two size 1 vectors', function() {
      assert.isTrue(lib.vb.sameSize(v.o1, v.o1))
    }),
    it('accepts two size 2 vectors', function() {
      assert.isTrue(lib.vb.sameSize(v.o2, v.z2))
    }),
    it('rejects size 1 and size 2 vectors', function() {
      assert.isFalse(lib.vb.sameSize(v.o2, v.o1))
    })
  })
})
//lib.vn
describe('lib.vn.dot', function() {
  describe('gives the dot product of two same sized vectors', function() {
    it('can dot two length 1 vectors (v.o1 * v.z1)', function() {
      const k = F(0)
      assert(lib.vn.dot(v.o1, v.z1).equals(k))
    }),
    it('can dot two length 1 vectors (v.o1 * v.o1)', function() {
      const k = F(1)
      assert(lib.vn.dot(v.o1, v.o1).equals(k))
    }),
    it('can dot two length 3 vectors (v.s3 * v.s3)', function() {
      const k = F(5)
      assert(lib.vn.dot(v.s3, v.s3).equals(k))
    })
  })
})
//lib.vv
describe('lib.vv.add', function() {
  describe('gives the sum of two same sized vectors', function() {
    it('can add two size 1 vectors (v.o1 + v.o1)', function() {
      const l = List([F(2)])
      assert(lib.vv.add(v.o1, v.o1).equals(l))
    }),
    it('can add two size 2 vectors (v.o2 + v.o2)', function() {
      const l = List([F(2), F(2)])
      assert(lib.vv.add(v.o2, v.o2).equals(l))
    })
  })
})
describe('lib.vv.scale', function() {
  describe('gives the scalar product of a matrix and a fraction', function () {
    it('can scale a length 1 vector (2*v.o1)', function() {
      const l = List([F(2)])
      assert(lib.vv.scale(v.o1, 2).equals(l))
    }),
    it('can scale a length 2 vector (2*v.o2)', function() {
      const l = List([F(2), F(2)])
      assert(lib.vv.scale(v.o2, 2).equals(l))
    })
  })
})
describe('lib.vv.sub', function() {
  describe('gives the difference of two same sized vectors', function () {
    it('can diff two size 1 vectors (v.o1 - v.o1)', function () {
      assert(lib.vv.sub(v.o1, v.o1).equals(v.z1))
    }),
    it('can diff two size 2 vectors (v.o2 - v.o2)', function () {
      assert(lib.vv.sub(v.o2, v.o2).equals(v.z2))
    })
  })
})
