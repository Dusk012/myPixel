document.addEventListener('DOMContentLoaded', () => {
    // ---------- ELEMENTOS ----------
    const addProductBtn = document.getElementById('addProductBtn');
    const modal = document.getElementById('addProductModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const viewMyProductsBtn = document.getElementById('viewMyProductsBtn');
    const imageInput = document.getElementById('image');
    const imagePreview = document.getElementById('imagePreview');
    const imagePreviewContainer = document.getElementById('imagePreviewContainer');
    const productModal = document.getElementById('productDetailModal');
    const closeDetail = document.querySelector('.close-detail-modal');

    // ---------- MODAL AÑADIR PRODUCTO ----------
    if (addProductBtn && modal && closeModalBtn) {
        addProductBtn.addEventListener('click', () => {
            modal.style.display = 'block';
            document.body.classList.add('modal-open');
        });

        closeModalBtn.addEventListener('click', () => {
            modal.style.display = 'none';
            document.body.classList.remove('modal-open');
        });

        // Cerrar el modal al hacer clic fuera del contenido
        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
                document.body.classList.remove('modal-open');
            }
        });
    }

    // ---------- VER MIS PRODUCTOS ----------
    if (viewMyProductsBtn) {
        viewMyProductsBtn.addEventListener('click', () => {
            window.location.href = "/shop/my-products";
        });
    }

    // ---------- VISTA PREVIA DE IMAGEN ----------
    if (imageInput && imagePreview) {
        imageInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    imagePreview.src = e.target.result;
                    imagePreview.style.display = 'block';
                };
                reader.readAsDataURL(file);
            } else {
                imagePreview.src = '#';
                imagePreview.style.display = 'none';
            }
        });
    }

    // ---------- MODAL DETALLES DEL PRODUCTO ----------
    if (productModal && closeDetail) {
        closeDetail.addEventListener('click', () => {
            productModal.style.display = 'none';
            document.body.classList.remove('modal-open');
        });
    }

    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', () => {
            const modalId = item.getAttribute("data-modal-id");
            const associatedModal = document.getElementById(modalId);

            if (associatedModal) {
                // Mostrar modal dinámico por ID si existe
                associatedModal.style.display = 'flex';
            }

            const { id, name, description, price, status, image } = item.dataset;
            const detailName = document.getElementById('detailName');
            const detailDescription = document.getElementById('detailDescription');
            const detailPrice = document.getElementById('detailPrice');
            const detailImage = document.getElementById('detailImage');
            const buyForm = document.getElementById('buyForm');
            const soldOutBtn = document.getElementById('soldOutBtn');

            if (detailName) detailName.innerText = name;
            if (detailDescription) detailDescription.innerText = description;
            if (detailPrice) detailPrice.innerText = price;
            if (detailImage) detailImage.src = image;
            if (buyForm) {
                buyForm.action = `/shop/${id}/buy`;

                if (status === 'P') {
                    buyForm.style.display = 'block';
                    if (soldOutBtn) soldOutBtn.style.display = 'none';
                } else {
                    buyForm.style.display = 'none';
                    if (soldOutBtn) soldOutBtn.style.display = 'block';
                }
            }

            if (productModal) {
                productModal.style.display = 'block';
                document.body.classList.add('modal-open');
            }
        });
    });

    // ---------- CERRAR MODALES DINÁMICOS ----------
    document.querySelectorAll('.close[data-close-modal]').forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            const modalId = closeBtn.getAttribute('data-close-modal');
            const modalToClose = document.getElementById(modalId);
            if (modalToClose) {
                modalToClose.style.display = 'none';
            }
        });
    });

    // ---------- CERRAR CUALQUIER MODAL AL HACER CLIC FUERA ----------
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
                document.body.classList.remove('modal-open');
            }
        });
    });

    // ---------- CONFIRMAR ELIMINACIÓN DE PRODUCTOS ----------
    document.querySelectorAll('.delete-product-form').forEach(form => {
        form.addEventListener('submit', function (event) {
            const confirmed = confirm('¿Seguro que deseas eliminar este producto?');
            if (!confirmed) {
                event.preventDefault();
            }
        });
    });


       // Modal de edición de producto
    const editModal = document.getElementById('editProductModal');
    const closeEditModalBtn = document.getElementById('closeEditModalBtn');
    const editForm = document.getElementById('editProductForm');

    // Mostrar Modal de Edición al hacer clic en "Editar"
    document.querySelectorAll('.edit-product-btn').forEach(button => {
        button.addEventListener('click', () => {
            const { id, name, description, price, image } = button.dataset;

            document.getElementById('editName').value = name;
            document.getElementById('editDescription').value = description;
            document.getElementById('editPrice').value = price;

            const preview = document.getElementById('editImagePreview');
            preview.src = image;
            preview.style.display = 'block';

            // Ajusta la acción del formulario para la edición
            editForm.action = `/shop/${id}/edit?_method=PUT`;


            editModal.style.display = 'block';
            document.body.classList.add('modal-open');
        });
    });

    // Cerrar Modal de Edición
    if (closeEditModalBtn && editModal) {
        closeEditModalBtn.addEventListener('click', () => {
            editModal.style.display = 'none';
            document.body.classList.remove('modal-open');
        });
    }

    // Vista previa en tiempo real de imagen en edición
    document.getElementById('editImage').addEventListener('change', function (event) {
        const file = event.target.files[0];
        const preview = document.getElementById('editImagePreview');

        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                preview.src = e.target.result;
                preview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        } else {
            preview.src = '#';
            preview.style.display = 'none';
        }
    });



});

