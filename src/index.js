// https://youtu.be/0BWzZ6c8z-g
const { app, BrowserWindow, Menu, ipcMain } = require('electron')

const url = require('url')
const path = require('path')

if(process.env.NODE_ENV !== 'production') { // si estamos en desarrollo
	// Usamos este paquete para recargar las paginas
	require('electron-reload')(__dirname, {
		electron: path.join(__dirname, '../node_modules', '.bin', 'electron')
	})
}

// VENTANAS GLOBALES
let mainWindow
let newProductWindow

app.on('ready', () => {
	// VENTANA PRINCIPAL
	mainWindow = new BrowserWindow({
		webPreferences: {
			nodeIntegration: true,
			nodeIntegrationInWorker: true
		}
	}) // Instanciamos el objeto
	mainWindow.loadURL(url.format({ // Le pasamos el html
		pathname: path.join(__dirname, 'views/index.html'),
		protocol: 'file',
		slashes: true
	}))

	// MENU
	const mainMenu = Menu.buildFromTemplate(templateMenu) // Creamos el menu
	Menu.setApplicationMenu(mainMenu) // Seteamos el menu

	// Cierre de la app al cerrar ventana principal
	mainWindow.on('closed', () => {
		app.quit()
	})
})

function createNewProductWindow() {
	// Instanciamos la ventana
	newProductWindow = new BrowserWindow({
		width: 400,
		height: 330,
		title: 'Add a New Product',
		webPreferences: {
			nodeIntegration: true,
			nodeIntegrationInWorker: true
		}
	})
	
	// newProductWindow.setMenu(null) // Evitamos la aparicion del menu

	// Cargamos la url
	newProductWindow.loadURL(url.format({ // Le pasamos el html
		pathname: path.join(__dirname, 'views/new-product.html'),
		protocol: 'file',
		slashes: true
	}))

	// Borramos la ventana al cerrar
	newProductWindow.on('closed', () => {
		newProductWindow = null
	})
}

// Escuchamos el evento que nos envia el producto
ipcMain.on('product:new', (e, newProduct) => {
	// Enviamos un evento y el producto a la ventana principal
	mainWindow.webContents.send('product:new', newProduct)
	// Cerramos la ventana form
	newProductWindow.close()
})

// Creamos una plantilla para el menu
const templateMenu = [
	{
		label: 'File',
		submenu: [
			{
				label: 'New Product',
				accelerator: 'Ctrl+N',
				click() {
					createNewProductWindow()
				}
			},
			{
				label: 'Remove All Products',
				click() {
					mainWindow.webContents.send('products:remove-all')
				}
			},
			{
				label: 'Exit',
				accelerator: process.platform == 'darwin' ? 'command+Q' : 'Ctrl+Q',
				click() {
					app.quit()
				}
			}
		]
	}
]

if(process.platform === 'darwin') {
	templateMenu.unshift({
		label: app.getName()
	})
}

if(process.env.NODE_ENV !== 'production') {
	templateMenu.push({
		label: 'DevTools',
		submenu: [
			{
				label: 'Show/Hide Dev Tools',
				accelerator: 'Ctrl+D',
				click(item, focusedWindow) {
					focusedWindow.toggleDevTools()
				}
			},
			{
				role: 'reload'
			}
		]
	})
}