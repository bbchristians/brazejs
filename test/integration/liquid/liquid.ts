import Liquid from '../../../src/liquid'
import * as chai from 'chai'
import { mock, restore } from '../../stub/mockfs'
import * as chaiAsPromised from 'chai-as-promised'

const expect = chai.expect
chai.use(chaiAsPromised)

describe('Liquid', function () {
  describe('#plugin()', function () {
    it('should call plugin on the instance', async function () {
      const engine = new Liquid()
      engine.plugin(function () {
        this.registerFilter('foo', x => `foo${x}foo`)
      })
      const html = await engine.parseAndRender('{{"bar"|foo}}')
      expect(html).to.equal('foobarfoo')
    })
    it('should call plugin with Liquid', async function () {
      const engine = new Liquid()
      engine.plugin(function (Liquid) {
        this.registerFilter('t', x => Liquid.isFalsy(x))
      })
      const html = await engine.parseAndRender('{{false|t}}')
      expect(html).to.equal('true')
    })
  })
  describe('#parseAndRender', function () {
    const engine = new Liquid()
    it('should parse and render variable output', async function () {
      const html = await engine.parseAndRender('{{"foo"}}')
      expect(html).to.equal('foo')
    })
    it('should parse and render complex output', async function () {
      const tpl = '{{ "Welcome|to]Liquid" | split: "|" | join: "("}}'
      const html = await engine.parseAndRender(tpl)
      expect(html).to.equal('Welcome(to]Liquid')
    })
    it('should support for-in with variable', async function () {
      const src = '{% assign total = 3 | minus: 1 %}' +
        '{% for i in (1..total) %}{{ i }}{% endfor %}'
      const html = await engine.parseAndRender(src, {})
      return expect(html).to.equal('12')
    })
    it('should support array operation in output', async function () {
      const src = '{{ arr.last.c }}{{ arr.first }}'
      const html = await engine.parseAndRender(src, {
        arr: [1, 2, { c: 3 }]
      })
      return expect(html).to.equal('31')
    })
  })
  describe('#express()', function () {
    const liquid = new Liquid({ root: '/root' })
    const render = liquid.express()
    before(function () {
      mock({
        '/root/foo': 'foo'
      })
    })
    after(restore)
    it('should render single template', function (done) {
      render.call({ root: '.' }, 'foo', null as any, (err: Error | null, result: string | undefined) => {
        if (err) return done(err)
        expect(result).to.equal('foo')
        done()
      })
    })
    it('should render single template with Array-typed root', function (done) {
      render.call({ root: ['.'] }, 'foo', null as any, (err: Error | null, result: string | undefined) => {
        if (err) return done(err)
        expect(result).to.equal('foo')
        done()
      })
    })
  })
  describe('#renderFile', function () {
    it('should throw with lookup list when file not exist', function () {
      const engine = new Liquid({
        root: ['/boo', '/root/'],
        extname: '.html'
      })
      return expect(engine.renderFile('/not/exist.html')).to
        .be.rejectedWith(/Failed to lookup "\/not\/exist.html" in "\/boo,\/root\/"/)
    })
  })
})
