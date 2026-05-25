function Profile() {

  return (
    <div>

      <h1>Perfil de Usuario</h1>

      <form>

        <input
          type="text"
          placeholder="Nombre"
        />

        <input
          type="text"
          placeholder="Apellido"
        />

        <input
          type="date"
        />

        <input
          type="tel"
          placeholder="Teléfono"
        />

        <input
          type="text"
          placeholder="Ciudad"
        />

        <button>
          Guardar Información
        </button>

      </form>

    </div>
  );
}

export default Profile;