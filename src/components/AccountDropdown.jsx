export function AccountDropdown({ name, onProfile, onReservations, onSignOut }) {
    const optionClass = "block w-full px-3 py-2 text-left hover:bg-aura-blush"

    return (
        <details className="group relative">
            <summary className="flex cursor-pointer list-none items-center gap-2 rounded-md bg-aura-plum px-4 py-2 text-white [&::-webkit-details-marker]:hidden">
                {name}
                <span
                    aria-hidden="true"
                    className="transition-transform group-open:rotate-180"
                >
                    ▾
                </span>
            </summary>

            <div className="absolute right-0 z-20 mt-2 min-w-44 rounded-md border bg-white shadow-md">
                <button type="button" className={optionClass} onClick={onProfile}>
                    Mis datos
                </button>
                <button type="button" className={optionClass} onClick={onReservations}>
                    Mis reservas
                </button>
                <button type="button" className={optionClass} onClick={onSignOut}>
                    Cerrar sesión
                </button>
            </div>
        </details>
    )
}