import assert from '../../util/assert'
import { identifier } from '../../parser/lexical'
import TagToken from '../../parser/tag-token'
import Context from '../../context/context'
import ITagImplOptions from '../../template/tag/itag-impl-options'

const re = new RegExp(`(${identifier.source})\\s*=([^]*)`)

export default {
  parse: function (token: TagToken) {
    const match = token.args.match(re) as RegExpMatchArray
    assert(match, `illegal token ${token.raw}`)
    this.key = match[1]
    this.value = match[2]
  },
  render: async function (ctx: Context) {
    let parsedValue
    if (this.value.startsWith(ctx.opts.outputDelimiterLeft)) {
      parsedValue = await this.liquid.parseAndRender(this.value, ctx.getAll())
    } else {
      parsedValue = await this.liquid.evalValue(this.value, ctx)
    }
    ctx.front()[this.key] = parsedValue
  }
} as ITagImplOptions
