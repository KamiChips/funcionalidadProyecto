document.getElementById('formPaciente').addEventListener('submit', async(e) => {
    e.preventDefault();
    const secure_key = document.getElementById('secure_key').value;
    if(!secure_key) return alert('Por favor, ingresa un secure key');

    const res = await fetch('/pacientes',{
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({secure_key})
    });
    if(res.ok){
        location.reload();
    }else{
        const err = await res.json();
        alert('Error' + err.error);
    }
});

async function eliminarExpediente(id){
    if(confirm('Seguro que deseas eliminar este expediente?')){
        const res = await fetch(`/pacientes/${id}`, {
            method: 'DELETE'
        });
        if(res.ok){
            location.reload();
        }else{
            const err = await res.json();
            alert('Error' + err.error);
        }
    }
}