import {Hono} from './deps.ts'

export default (hono: Hono) => {
  hono.get('/ui', c => c.html(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/ui/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Docorch</title>
    <script type="module" crossorigin src="/ui/assets/index-j9Zz7znd.js"></script>
    <link rel="stylesheet" crossorigin href="/ui/assets/index-HDW_Elbt.css">
  </head>
  <body>
    <div id="app"></div>

    <div style="display: none;">
      <svg id="remove" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <path d="M424 64h-88V48c0-27-21-48-48-48h-64c-27 0-48 21-48 48v16H88c-22 0-40 18-40 40v32c0 9 7 16 16 16h384c9 0 16-7 16-16v-32c0-22-18-40-40-40zM208 48c0-9 7-16 16-16h64c9 0 16 7 16 16v16h-96zM78 184a5 5 0 0 0-5 5l14 277c1 26 22 46 48 46h242c26 0 47-20 48-46l14-277a5 5 0 0 0-5-5zm242 40a16 16 0 1 1 32 0v208a16 16 0 1 1-32 0zm-80 0a16 16 0 1 1 32 0v208a16 16 0 1 1-32 0zm-80 0a16 16 0 1 1 32 0v208a16 16 0 1 1-32 0z" />
      </svg>
      <svg id="stop" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M6 3.25A2.75 2.75 0 0 0 3.25 6v12A2.75 2.75 0 0 0 6 20.75h12A2.75 2.75 0 0 0 20.75 18V6A2.75 2.75 0 0 0 18 3.25z" />
      </svg>
      <svg id="play" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
        <path d="M26.2 12.4 9 2.4A3.2 3.2 0 0 0 7.4 2 3.4 3.4 0 0 0 4 5.4v21.3a3.3 3.3 0 0 0 5.1 2.8l17.2-10.9a3.6 3.6 0 0 0-.1-6.2z" />
      </svg>
    </div>

  </body>
</html>
`))

  hono.get('/ui/assets/*.js', c => c.html(`<--js-->`, 200, {'Content-Type': 'text/javascript'}))

  hono.get('/ui/assets/*.css', c => c.text(`html{line-height:1.15;-webkit-text-size-adjust:100%}body{margin:0}main{display:block}h1{font-size:2em;margin:.67em 0}hr{box-sizing:content-box;height:0;overflow:visible}pre{font-family:monospace,monospace;font-size:1em}a{background-color:transparent}abbr[title]{border-bottom:none;text-decoration:underline;text-decoration:underline dotted}b,strong{font-weight:bolder}code,kbd,samp{font-family:monospace,monospace;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}img{border-style:none}button,input,optgroup,select,textarea{font-family:inherit;font-size:100%;line-height:1.15;margin:0}button,input{overflow:visible}button,select{text-transform:none}button,[type=button],[type=reset],[type=submit]{-webkit-appearance:button}button::-moz-focus-inner,[type=button]::-moz-focus-inner,[type=reset]::-moz-focus-inner,[type=submit]::-moz-focus-inner{border-style:none;padding:0}button:-moz-focusring,[type=button]:-moz-focusring,[type=reset]:-moz-focusring,[type=submit]:-moz-focusring{outline:1px dotted ButtonText}fieldset{padding:.35em .75em .625em}legend{box-sizing:border-box;color:inherit;display:table;max-width:100%;padding:0;white-space:normal}progress{vertical-align:baseline}textarea{overflow:auto}[type=checkbox],[type=radio]{box-sizing:border-box;padding:0}[type=number]::-webkit-inner-spin-button,[type=number]::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}[type=search]::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}details{display:block}summary{display:list-item}template{display:none}[hidden]{display:none}*,*:before,*:after{-moz-box-sizing:border-box;-webkit-box-sizing:border-box;box-sizing:border-box}html,body{height:100%;background-color:#fff}html{font-size:16px}body{width:100%;overflow-x:hidden;line-height:1.3;font-family:Segoe UI,sans-serif;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}body::-webkit-scrollbar{display:none}body.disable-scroll{overflow-y:hidden}ul{padding:0;margin:0;list-style-type:none}input[type=text],input[type=email],input[type=password],input[type=tel],input[type=number],input[type=url],textarea{-webkit-appearance:none;-moz-appearance:none;appearance:none}button{background-color:transparent;border:none;padding:0}button,a{text-decoration:none}button:focus,a:focus{outline:none}#app{min-height:100vh;display:flex;flex-flow:column}
`, 200, {'Content-Type': 'text/css'}))

  hono.get('/ui/favicon.svg', c => c.text(`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--logos" width="31.88" height="32" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 257"><defs><linearGradient id="IconifyId1813088fe1fbc01fb466" x1="-.828%" x2="57.636%" y1="7.652%" y2="78.411%"><stop offset="0%" stop-color="#41D1FF"></stop><stop offset="100%" stop-color="#BD34FE"></stop></linearGradient><linearGradient id="IconifyId1813088fe1fbc01fb467" x1="43.376%" x2="50.316%" y1="2.242%" y2="89.03%"><stop offset="0%" stop-color="#FFEA83"></stop><stop offset="8.333%" stop-color="#FFDD35"></stop><stop offset="100%" stop-color="#FFA800"></stop></linearGradient></defs><path fill="url(#IconifyId1813088fe1fbc01fb466)" d="M255.153 37.938L134.897 252.976c-2.483 4.44-8.862 4.466-11.382.048L.875 37.958c-2.746-4.814 1.371-10.646 6.827-9.67l120.385 21.517a6.537 6.537 0 0 0 2.322-.004l117.867-21.483c5.438-.991 9.574 4.796 6.877 9.62Z"></path><path fill="url(#IconifyId1813088fe1fbc01fb467)" d="M185.432.063L96.44 17.501a3.268 3.268 0 0 0-2.634 3.014l-5.474 92.456a3.268 3.268 0 0 0 3.997 3.378l24.777-5.718c2.318-.535 4.413 1.507 3.936 3.838l-7.361 36.047c-.495 2.426 1.782 4.5 4.151 3.78l15.304-4.649c2.372-.72 4.652 1.36 4.15 3.788l-11.698 56.621c-.732 3.542 3.979 5.473 5.943 2.437l1.313-2.028l72.516-144.72c1.215-2.423-.88-5.186-3.54-4.672l-25.505 4.922c-2.396.462-4.435-1.77-3.759-4.114l16.646-57.705c.677-2.35-1.37-4.583-3.769-4.113Z"></path></svg>`, 200, {'Content-Type': 'image/svg+xml'}))
}
