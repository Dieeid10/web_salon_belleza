export function GoogleLoginButton({ onClick }) {
  
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-md bg-aura-plum px-4 py-2 text-white"
    >
      Ingresar con Google
    </button>
  );
}