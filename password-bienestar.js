


document.addEventListener('DOMContentLoaded', function() {
    // Credenciales escritas directamente en el código
    const credentials = [



        { 
            email: 'bienestar@elyonyireh.edu.co', 
            password: 'sietedeabril', 
            description: 'Acceso a correo de Bienestar',
         
        },





        { 
            email: 'arteycultura@elyonyireh.edu.co', 
            password: 'cultura-2025*', 
            description: 'Acceso a correo de Arte y Cultura' 
        },





        { 
            email: ' recreacionydeporte@elyonyireh.edu.co', 
            password: 'deporteyrecreacion_2024*', 
            description: 'Acceso a correo de Recreación y Deporte' 
        },



        { 
            email: 'permanencia@elyonyireh.edu.co', 
            password: ' Permanencia-2025*', 
            description: 'Acceso a correo de Permanencia' 
        }



        // Agrega más credenciales aquí
    ];




    // Elementos del DOM
    const credentialsList = document.getElementById('credentialsList');
    const searchInput = document.getElementById('searchInput');
    const infoBtn = document.getElementById('infoBtn');
    const addBtn = document.getElementById('addBtn');
    const floatingAddBtn = document.getElementById('floatingAddBtn');
    const infoModal = document.getElementById('infoModal');
    const addModal = document.getElementById('addModal');
    const confirmModal = document.getElementById('confirmModal');
    const closeModals = document.querySelectorAll('.close-modal');
    const credentialForm = document.getElementById('credentialForm');
    const confirmDeleteBtn = document.getElementById('confirmDelete');
    const credentialPreview = document.getElementById('credentialPreview');
    
    // Variables de estado
    let credentialToDelete = null;
    let currentYear = new Date().getFullYear();

    // Inicialización
    document.getElementById('year').textContent = currentYear;
    loadCredentials();
    initFloatingLabels();

    // Función para cargar credenciales en la lista
    function loadCredentials(filter = '') {
        credentialsList.innerHTML = '';
        
        const filtered = filter ? 
            credentials.filter(cred => 
                cred.email.toLowerCase().includes(filter.toLowerCase()) || 
                (cred.description && cred.description.toLowerCase().includes(filter.toLowerCase()))
            ) : credentials;
        
        if (filtered.length === 0) {
            credentialsList.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search" style="font-size: 3rem; color: var(--gray-color); margin-bottom: 1rem;"></i>
                    <h3>No se encontraron credenciales</h3>
                    <p>Intenta con otros términos de búsqueda</p>
                </div>
            `;
            return;
        }
        
        filtered.forEach((cred, index) => {
            const card = document.createElement('div');
            card.className = 'credential-card animate-card';
            card.style.animationDelay = `${index * 0.1}s`;
            card.innerHTML = `
                <div class="credential-email">${cred.email}</div>
                <div class="credential-password">${cred.password}</div>
                ${cred.description ? `<div class="credential-description">${cred.description}</div>` : ''}
                <div class="credential-actions">
                    <button class="btn btn-copy" data-index="${index}">
                        <i class="fas fa-copy"></i> Copiar
                    </button>
                    <button class="btn btn-delete" data-index="${index}">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                </div>
            `;
            credentialsList.appendChild(card);
        });
        
        // Agregar eventos a los botones copiar y eliminar
        document.querySelectorAll('.btn-copy').forEach(btn => {
            btn.addEventListener('click', copyCredential);
        });
        
        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index') || 
                             e.target.parentElement.getAttribute('data-index');
                showDeleteModal(index);
            });
        });
    }

    // Función para inicializar los floating labels
    function initFloatingLabels() {
        document.querySelectorAll('.form-group.floating input').forEach(input => {
            // Si el input tiene valor al cargar (por defecto)
            if (input.value) {
                input.previousElementSibling.classList.add('active');
            }
            
            input.addEventListener('focus', () => {
                input.previousElementSibling.classList.add('active');
            });
            
            input.addEventListener('blur', () => {
                if (!input.value) {
                    input.previousElementSibling.classList.remove('active');
                }
            });
        });
    }

    // Función para copiar credencial
    function copyCredential(e) {
        const index = e.target.getAttribute('data-index') || 
                     e.target.parentElement.getAttribute('data-index');
        const cred = credentials[index];
        const textToCopy = `Email: ${cred.email}\nContraseña: ${cred.password}`;
        
        // Efecto visual en el botón
        const btn = e.target.classList.contains('btn') ? e.target : e.target.parentElement;
        btn.classList.add('pulse');
        setTimeout(() => btn.classList.remove('pulse'), 2000);
        
        navigator.clipboard.writeText(textToCopy).then(() => {
            showNotification('Credencial copiada al portapapeles');
        }).catch(err => {
            console.error('Error al copiar: ', err);
            showNotification('Error al copiar', 'error');
        });
    }

    // Función para mostrar modal de confirmación de eliminación
    function showDeleteModal(index) {
        credentialToDelete = index;
        const cred = credentials[index];
        
        // Llenar el preview de la credencial a eliminar
        credentialPreview.innerHTML = `
            <div class="credential-email">${cred.email}</div>
            <div class="credential-password">${cred.password}</div>
            ${cred.description ? `<div class="credential-description">${cred.description}</div>` : ''}
        `;
        
        confirmModal.style.display = 'block';
    }

    // Función para eliminar credencial con spinner de carga
    function deleteCredential() {
        if (credentialToDelete !== null) {
            const deleteBtn = document.getElementById('confirmDelete');
            const originalContent = deleteBtn.innerHTML;
            
            // Mostrar spinner y cambiar texto
            deleteBtn.innerHTML = `
                <span class="spinner"></span>
                <span class="btn-text">Eliminando...</span>
            `;
            deleteBtn.classList.add('btn-loading');
            
            // Simular carga de 4 segundos
            setTimeout(() => {
                // Animación de eliminación
                const cards = document.querySelectorAll('.credential-card');
                const card = cards[credentialToDelete];
                
                if (card) {
                    card.style.animation = 'fadeOutLeft 0.4s ease forwards';
                    card.addEventListener('animationend', () => {
                        credentials.splice(credentialToDelete, 1);
                        loadCredentials(searchInput.value);
                        showNotification('Credencial eliminada');
                        
                        // Restaurar botón
                        deleteBtn.innerHTML = originalContent;
                        deleteBtn.classList.remove('btn-loading');
                    });
                } else {
                    credentials.splice(credentialToDelete, 1);
                    loadCredentials(searchInput.value);
                    showNotification('Credencial eliminada');
                    
                    // Restaurar botón
                    deleteBtn.innerHTML = originalContent;
                    deleteBtn.classList.remove('btn-loading');
                }
                
                credentialToDelete = null;
                confirmModal.style.display = 'none';
            }, 4000); // 4 segundos de delay
        }
    }

    // Función para mostrar notificación
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 
                          type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            ${message}
        `;
        
        document.body.appendChild(notification);
        
        // Eliminar después de la animación
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Búsqueda de credenciales
    searchInput.addEventListener('input', (e) => {
        loadCredentials(e.target.value);
    });

    // Mostrar modales
    infoBtn.addEventListener('click', () => {
        infoModal.style.display = 'block';
    });

    addBtn.addEventListener('click', () => {
        addModal.style.display = 'block';
        document.getElementById('email').focus();
    });

    floatingAddBtn.addEventListener('click', () => {
        addModal.style.display = 'block';
        document.getElementById('email').focus();
    });

    // Cerrar modales
    closeModals.forEach(btn => {
        btn.addEventListener('click', () => {
            infoModal.style.display = 'none';
            addModal.style.display = 'none';
            confirmModal.style.display = 'none';
        });
    });

    // Cerrar modal al hacer clic fuera
    window.addEventListener('click', (e) => {
        if (e.target === infoModal) {
            infoModal.style.display = 'none';
        }
        if (e.target === addModal) {
            addModal.style.display = 'none';
        }
        if (e.target === confirmModal) {
            confirmModal.style.display = 'none';
            credentialToDelete = null;
        }
    });

    // Confirmar eliminación
    confirmDeleteBtn.addEventListener('click', deleteCredential);

    // Agregar nueva credencial (simulado, ya que no persistirá)
    credentialForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const description = document.getElementById('description').value;
        
        // Agregar a la lista (solo en memoria)
        credentials.push({ email, password, description });
        loadCredentials(searchInput.value);
        
        // Limpiar formulario y cerrar modal
        credentialForm.reset();
        document.querySelectorAll('.form-group.floating label').forEach(label => {
            label.classList.remove('active');
        });
        addModal.style.display = 'none';
        
        showNotification('Credencial agregada (demo)');
        
        // Mostrar mensaje de que es solo demo
        setTimeout(() => {
            showNotification('Recuerda que para persistir los cambios debes editar el código', 'warning');
        }, 2000);
    });

    // Efecto de onda al hacer clic en botones
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn')) {
            const btn = e.target;
            const effect = document.createElement('span');
            effect.className = 'effect';
            btn.appendChild(effect);
            setTimeout(() => effect.remove(), 600);
        }
    });
});