const test = require('ava')
const { flatten } = require('../src/index.js')

test('it should return a flattened object', (t) => {
  const original = {
    a: {
      b: 1
    }
  }

  const expected = {
    'a.b': 1
  }

  t.deepEqual(flatten(original), expected)
})

test('It should handle a completely empty object', t => {
  const original = {}
  const expected = {}

  t.deepEqual(flatten(original), expected)
})

test('It should process an empty array', t => {
  const original = {
    a: [],
    b: 1,
    c: {
      d: []
    }
  }
  const expected = {
    a: [],
    b: 1,
    'c.d': []
  }

  t.deepEqual(flatten(original), expected)
})

test('It should process an empty object', t => {
  const original = {
    a: {},
    b: 1,
    c: {
      d: []
    }
  }
  const expected = {
    a: {},
    b: 1,
    'c.d': []
  }

  t.deepEqual(flatten(original), expected)
})

test('it should handle nested arrays', (t) => {
  const original = {
    a: [0, 1]
  }

  const expected = {
    'a.0': 0,
    'a.1': 1
  }

  t.deepEqual(flatten(original), expected)
})

test('it should handle circular objects', (t) => {
  const original = {
    a: {
      b: {
        c: 'value'
      }
    }
  }
  original.a.b.d = original.a
  original.a.b.e = {
    f: original.a.b,
    g: 'value'
  }
  original.x = {
    y: {
      z: original.a.b.e
    }
  }

  const expected = {
    'a.b.c': 'value',
    'a.b.d': '[Circular]',
    'a.b.e.g': 'value',
    'a.b.e.f': '[Circular]',
    'x.y.z': '[Circular]'
  }

  t.deepEqual(flatten(original), expected)
})

test('it should use the passed in delimiter', (t) => {
  const original = {
    a: {
      b: 1
    }
  }

  const expected = {
    a_b: 1
  }

  t.deepEqual(flatten(original, '_'), expected)
})

test('it should handle deep nesting', (t) => {
  const original = {
    a: {
      b: {
        c: [{
          val: 'one'
        }, {
          val: 'two'
        }],
        d: 'three'
      },
      e: 'four'
    }
  }
  original.a.b.f = original.a.b
  original.a.b.c.push(original)

  const expected = {
    'a.b.c.0.val': 'one',
    'a.b.c.1.val': 'two',
    'a.b.c.2': '[Circular]',
    'a.b.d': 'three',
    'a.e': 'four',
    'a.b.f': '[Circular]'
  }
  t.deepEqual(flatten(original), expected)
})

test('it should do nothing for flat objects', (t) => {
  const original = {
    a: 'one',
    b: 'two'
  }
  t.deepEqual(flatten(original), original)
})

test('it should return the original value if not an object', (t) => {
  const original = 'string'
  t.deepEqual(flatten(original), original)
})

test('it should handle date objects', (t) => {
  const date = new Date()

  t.deepEqual(flatten(date), date)

  const original = {
    a: {
      b: {
        c: date,
        d: 'one'
      },
      e: {
        f: date,
        g: {
          h: date
        }
      }
    }
  }

  const expected = {
    'a.b.c': date,
    'a.b.d': 'one',
    'a.e.f': date,
    'a.e.g.h': date
  }

  t.deepEqual(flatten(original), expected)
})
