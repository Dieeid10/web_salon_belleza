import { useAccount } from "../hooks/useAccount";
import { GoogleLoginButton } from "./GoogleLoginButton";
import { AccountDropdown } from "./AccountDropdown";

export function Menu() {
  const account = useAccount();
    console.log('Account es: ',account)
  if (account.loading) return null;

  return (
    <div>
      {account.session ? (
        <AccountDropdown
          name={account.name}
          onProfile={() => account.openDialog("profile")}
          onReservations={() => account.openDialog("reservations")}
          onSignOut={account.signOut}
        />
      ) : (
        <GoogleLoginButton onClick={account.signIn} />
      )}

      {account.error && <p role="alert">{account.error}</p>}
    </div>
  );
}