import { app, BrowserWindow, nativeTheme, session, ipcRenderer, ipcMain } from 'electron'
const login = require('oauth-electron')
var querystring = require('querystring')
var https = require('https')
var fs = require('fs')
const totalCode = null
try {
  if (process.platform === 'win32' && nativeTheme.shouldUseDarkColors === true) {
    require('fs').unlinkSync(require('path').join(app.getPath('userData'), 'DevTools Extensions'))
  }
} catch (_) { }

/**
 * Set `__statics` path to static files in production;
 * The reason we are setting it here is that the path needs to be evaluated at runtime
 */
if (process.env.PROD) {
  global.__statics = __dirname
}

let mainWindow
ipcMain.handle('some-name',(event, someArgument) => {
  const result =  fs.readFileSync(__dirname + 'code.log', { encoding: 'utf8', flag: 'r' })
  return result
})
function createWindow () {
  // totalCode = fs.readFileSync(__dirname + 'code.log', { encoding: 'utf8', flag: 'r' })
  console.log('totalcode', totalCode)
  var options = {
    client_id: '7sdfsdf',
    client_secret: '9b419sdfsdfsdfsdf',
    scopes: ['user:email', 'notifications'] // Scopes limit access for OAuth tokens.
  }

  // Build the OAuth consent page URL
  var authWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    'node-integration': true,
    webPreferences: {
      // Change from /quasar.conf.js > electron > nodeIntegration;
      // More info: https://quasar.dev/quasar-cli/developing-electron-apps/node-integration
      nodeIntegration: true

      // More info: /quasar-cli/developing-electron-apps/electron-preload-script
      // preload: path.resolve(__dirname, 'electron-preload.js')
    }
  })
  var githubUrl = 'https://github.com/login/oauth/authorize?'
  var authUrl =
    githubUrl + 'client_id=' + options.client_id + '&scope=' + options.scopes
  authWindow.loadURL(authUrl)
  authWindow.show()

  function handleCallback (url) {
    var raw_code = /code=(.+)/.exec(url) || null
    var code = raw_code && raw_code.length > 1 ? raw_code[1] : null
    var error = /\?error=(.+)\$/.exec(url)

    console.log('url', url)
    console.log('raw_code', raw_code)
    console.log('code1', code)
    if (error) {
      // Close the browser if code found or error
      authWindow.destroy()
    }

    // If there is a code, proceed to get token from github
    if (code) {
      // fs.writeFileSync(__dirname + 'code.log', code)
      // console.log('code', code)
      // self.requestGithubToken(options, code);
    } else if (error) {
      alert(
        "Oops! Something went wrong and we couldn't" +
        'log you in using Github. Please try again.'
      )
    }
    /* ipcMain.on('sync-message', (event, arg) => {
      console.log('args', arg)
      if (arg === 'Sent from main Window') {
        event.sender.send('sync-reply', 'Yes hunie, I hear you loud and clear')
      }
    }) */


    /* ipcMain.on('async-message', (event, arg) => {
      console.log('async message')
      if (arg === 'Async message baby') {
        event.sender.send('async-reply', 'Yes hunie, I hear you loud and clear')
      }
    }) */
  }

  // Handle the response from GitHub - See Update from 4/12/2015

  authWindow.webContents.on('will-navigate', function (event, url) {
    handleCallback(url)
  })

  authWindow.webContents.on('did-get-redirect-request', function (
    event,
    oldUrl,
    newUrl
  ) {
    handleCallback(newUrl)
  })

  // Reset the authWindow on close
  authWindow.on(
    'close',
    function () {
      authWindow = null
    },
    false
  )
}
app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
