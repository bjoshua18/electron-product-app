const { ipcRenderer } = require('electron')

const products = document.querySelector('#products')

ipcRenderer.on('product:new', (e, newProduct) => {
	// Pintamos el producto
	const newProductTemplate = `
		<div class="col-xs-4 p-2">
			<div class="card text-center">
				<div class="card-header">
					<h5 class="card-title">${newProduct.name}</h5>
				</div>
				<div class="card-body">
					${newProduct.description}
					<hr/>
					${newProduct.price}
				</div>
				<div class="card-footer">
					<button class="btn btn-danger btn-sm">DELETE</button>
				</div>
			</div>
		</div>
	`
	products.innerHTML += newProductTemplate

	// Agregamos la funcionalidad de borrar
	const btns = document.querySelectorAll('.btn.btn-danger')
	btns.forEach(btn => {
		btn.addEventListener('click', e => {
			e.target.parentElement.parentElement.parentElement.remove()
		})
	})
})

ipcRenderer.on('products:remove-all', e => {
	products.innerHTML = ''
})