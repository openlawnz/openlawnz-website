# openlawnz-website

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
![Dependabot](https://badgen.net/dependabot/openlawnz/openlawnz-web/117378835=?icon=dependabot)

## Running

Create a `.env` file in the root of the project with the content copied of `env-sample`.

## Building

    gatsby build

## Bot Protection (Cloudflare Turnstile)

The search endpoint is protected by [Cloudflare Turnstile](https://www.cloudflare.com/products/turnstile/) to prevent abuse from bots.

### Setup

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/?to=/:account/turnstile) and create a new Turnstile widget
2. Choose "Invisible" mode for seamless user experience
3. Add your domain to the allowed hostnames
4. Copy the Site Key and Secret Key

### Environment Variables

Add these to your `.env` file (local) and Netlify environment variables (production):

```
GATSBY_TURNSTILE_SITE_KEY=your-site-key    # Public, exposed to browser
TURNSTILE_SECRET_KEY=your-secret-key       # Private, server-side only
```

**Note:** The `GATSBY_` prefix is required for Gatsby to expose the variable to the browser. The site key is safe to expose publicly.

## Local Mock Search Service

When running on localhost in the browser, search uses MSW mock data for `/search-cases`.

- This keeps frontend development working without local functions.
- Deployed function search remains unchanged and continues to use the real backend.

## Contributors

Please refer to the following Wiki pages:

- [Overview](https://github.com/openlawnz/openlawnz-website/wiki/OpenLawNZ-Website-Overview)
- [Contributing agreement and code of conduct](https://github.com/openlawnz/openlawnz-website/blob/master/CONTRIBUTING.md)
- [Workflow](https://github.com/openlawnz/openlawnz-website/wiki/Workflow)

## NOTICE

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
