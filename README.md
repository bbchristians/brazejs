# brazejs

[![npm](https://img.shields.io/npm/v/brazejs.svg)](https://www.npmjs.org/package/brazejs)
[![npm](https://img.shields.io/npm/dm/brazejs.svg)](https://www.npmjs.org/package/brazejs)
[![Build Status](https://travis-ci.org/yq314/brazejs.svg?branch=master)](https://travis-ci.org/yq314/brazejs)
[![Coveralls](https://img.shields.io/coveralls/yq314/brazejs.svg)](https://coveralls.io/github/yq314/brazejs?branch=master)
[![GitHub issues](https://img.shields.io/github/issues-closed/yq314/brazejs.svg)](https://github.com/yq314/brazejs/issues)
[![David](https://img.shields.io/david/yq314/brazejs.svg)](https://david-dm.org/yq314/brazejs)
[![David Dev](https://img.shields.io/david/dev/yq314/brazejs.svg)](https://david-dm.org/yq314/brazejs?type=dev)
[![DUB](https://img.shields.io/dub/l/vibe-d.svg)](https://github.com/yq314/brazejs/blob/master/LICENSE)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://github.com/yq314/brazejs)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/yq314/brazejs)

A [braze][braze/liquid] compatible [Liquid][tutorial] template engine in pure JavaScript. Built on top of [liquidjs][liquidjs], with Braze tags/filters/syntax added and incompatible features removed.

Install via npm:

```bash
npm install --save brazejs
```

For detailed usage please refer to [liquidjs][liquidjs]' original doc.

## Difference with liquidjs

Braze's liquid is a subset of Shopify's liquid, hence some incompatible features have to be removed. Braze also has it's own support for some Braze specific tags/filters/output, we add them in as plugin to liquidjs.

#### Removed

* ####filters
    * `abs`: Braze doesn't support abs

#### Added

* #### filters
    * [property_accessor][braze/property_accessor]: access value from hash
        
        Example:
        ```
        {{ hash | property_accessor: 'key' }}
        ```
    
* #### tags
    * [abort_message][braze/abort_message]: abort rendering and output an optional message
        
        Example:
        ```
        {% abort_message() %}
        {% abort_message('aborted due to error') %}
        ```
     
    * [connected_content][braze/connected_content]: call an external API
    
        Example:
        ```
        {% connected_content http://numbersapi.com/random/trivia :save trivia :cache 900 :basic_auth <secret_name> %}
        ```
        
        Supported options: `:basic_auth`, `:content_type`, `:save`, `:cache`, `:method`, `:body`
        
        For basic auth to work, you'll need to add the username and password into the [context][liquidjs/context] object.
        ```
        // replace <secret_name> so that it matches your basic auth name in Braze 
        {
            "__secrets": {
                "<secret_name>": {
                    "username": "<your username>",
                    "password": "<your password>"
                }
            }
        }
        ```
        
* #### output
    * `${}` support for [Personalization tags][personalization tags], 

#### TBD
Below Braze supported [filters][braze/filters] are yet to be added:

* #### Encoding filters
    * md5
    * sha1
    * sha2
    * base64
    * hmac_sha1
    
* #### URL filters
    * url_escape
    * url_param_escape

* #### Number formatting filters
    * number_with_delimiter
    
* #### JSON escape / String escape filters
    * json_escape

[braze/liquid]: https://www.braze.com/docs/user_guide/personalization_and_dynamic_content/liquid/overview/
[tutorial]: https://shopify.github.io/liquid/basics/introduction/
[liquidjs]: https://github.com/harttle/liquidjs
[personalization tags]: https://www.braze.com/docs/user_guide/personalization_and_dynamic_content/liquid/supported_personalization_tags/
[liquidjs/context]: https://github.com/harttle/liquidjs#render-from-string
[braze/filters]: https://www.braze.com/docs/user_guide/personalization_and_dynamic_content/liquid/advanced_filters/
[braze/property_accessor]: https://www.braze.com/docs/user_guide/personalization_and_dynamic_content/liquid/advanced_filters/#property-accessor-filter
[braze/abort_message]: https://www.braze.com/docs/user_guide/personalization_and_dynamic_content/liquid/aborting_messages/
[braze/connected_content]: https://www.braze.com/docs/user_guide/personalization_and_dynamic_content/connected_content/making_an_api_call/#making-an-api-call