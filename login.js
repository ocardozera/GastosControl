function logar() {
    var usuario = document.getElementById('usuario');
    var senha = document.getElementById('senha');

    if (usuario.value === "" || senha.value === "") {
        Swal.fire({
            icon: 'warning',
            title: 'Aviso!',
            text: 'Preencha todos os campos!',
        });
    } else if (usuario.value === "admin" && senha.value === "admin") {
        Swal.fire({
            icon: 'success',
            title: 'Usuário validado com sucesso',
            showConfirmButton: false,
            timer: 2050,
            timerProgressBar: true,
        })
        
        setTimeout(function () {
            window.location.href = 'index.html';
        }, 2050);

        localStorage.setItem("usuarioValidado", true);
        
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Aviso!',
            text: 'Credenciais incorretas!',
        });
    }
}
