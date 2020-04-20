const { ipcRenderer } = require('electron')

const form = document.querySelector('form')
form.addEventListener('submit', e => { // Cuando se envie el form...
	// Capturamos los inputs
	const nameProduct = document.querySelector('#name').value
	const priceProduct = document.querySelector('#price').value
	const descProduct = document.querySelector('#description').value

	// Creamos el objeto product
	const newProduct = {
		name: nameProduct,
		price: priceProduct,
		description: descProduct
	}
	console.log(newProduct)

	// Enviamos un evento y el objeto al index.js
	ipcRenderer.send('product:new', newProduct)

	e.preventDefault()
})