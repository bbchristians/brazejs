/* eslint-disable no-template-curly-in-string */
import Liquid from '../../../../src/liquid'
import { expect, use } from 'chai'
import * as chaiAsPromised from 'chai-as-promised'

use(chaiAsPromised)

describe('tags/assign', function () {
  const liquid = new Liquid()
  it('should throw when variable expression illegal', function () {
    const src = '{% assign / %}'
    const ctx = {}
    return expect(liquid.parseAndRender(src, ctx)).to.be.rejectedWith(/illegal/)
  })
  it('should support assign to a string', async function () {
    const src = '{% assign foo="bar" %}{{foo}}'
    const html = await liquid.parseAndRender(src)
    return expect(html).to.equal('bar')
  })
  it('should support assign to a number', async function () {
    const src = '{% assign foo=10086 %}{{foo}}'
    const html = await liquid.parseAndRender(src)
    return expect(html).to.equal('10086')
  })
  it('should assign as array', async function () {
    const src = '{% assign foo=(1..3) %}{{foo}}'
    const html = await liquid.parseAndRender(src)
    return expect(html).to.equal('1,2,3')
  })
  it('should assign as filter result', async function () {
    const src = '{% assign foo="a b" | capitalize | split: " " | first %}{{foo}}'
    const html = await liquid.parseAndRender(src)
    return expect(html).to.equal('A')
  })
  it('should assign as filter across multiple lines as result', async function () {
    const src = `{% assign foo="a b"
    | capitalize
    | split: " "
    | first %}{{foo}}`
    const html = await liquid.parseAndRender(src)
    return expect(html).to.equal('A')
  })
  it('should assign variable value', async function () {
    const src = '{% assign foo={{bar}} %}{{foo}}'
    const html = await liquid.parseAndRender(src, { bar: 'value_of_bar' })
    return expect(html).to.equal('value_of_bar')
  })
  it('should assign variable value in ${} format', async function () {
    const src = '{% assign foo={{${bar}}} %}{{foo}}'
    const html = await liquid.parseAndRender(src, { bar: 'value_of_bar' })
    return expect(html).to.equal('value_of_bar')
  })
  it('should support variables in filter', async function () {
    const src = '{% assign foo = {{a.b}} | replace: "bar", {{bar}} %}{{foo}}'
    const html = await liquid.parseAndRender(src, { bar: 'baz', a: { b: 'test bar' } })
    return expect(html).to.equal('test baz')
  })
  it('should support spaces around =', async function () {
    const src = '{% assign foo = {{bar}} %}{{foo}}'
    const html = await liquid.parseAndRender(src, { bar: 'value_of_bar' })
    return expect(html).to.equal('value_of_bar')
  })
  it('should assign var-1', async function () {
    const src = '{% assign var-1 = 5 %}{{ var-1 }}'
    const html = await liquid.parseAndRender(src)
    return expect(html).to.equal('5')
  })
  it('should assign var-', async function () {
    const src = '{% assign var- = 5 %}{{ var- }}'
    const html = await liquid.parseAndRender(src)
    return expect(html).to.equal('5')
  })
  it('should assign -var', async function () {
    const src = '{% assign -let = 5 %}{{ -let }}'
    const html = await liquid.parseAndRender(src)
    return expect(html).to.equal('5')
  })
  it('should assign -5-5', async function () {
    const src = '{% assign -5-5 = 5 %}{{ -5-5 }}'
    const html = await liquid.parseAndRender(src)
    return expect(html).to.equal('5')
  })
  it('should assign 4-3', async function () {
    const src = '{% assign 4-3 = 5 %}{{ 4-3 }}'
    const html = await liquid.parseAndRender(src)
    return expect(html).to.equal('5')
  })
  it('should not assign -6', async function () {
    const src = '{% assign -6 = 5 %}{{ -6 }}'
    const html = await liquid.parseAndRender(src)
    return expect(html).to.equal('-6')
  })
  describe('scope', function () {
    it('should read from parent scope', async function () {
      const src = '{%for a in (1..2)%}{{num}}{%endfor%}'
      const html = await liquid.parseAndRender(src, { num: 1 })
      return expect(html).to.equal('11')
    })
    it('should write to the belonging scope', async function () {
      const src = '{%for a in (1..2)%}{%assign num = a%}{{a}}{%endfor%} {{num}}'
      const html = await liquid.parseAndRender(src, { num: 1 })
      return expect(html).to.equal('12 2')
    })
  })
})
