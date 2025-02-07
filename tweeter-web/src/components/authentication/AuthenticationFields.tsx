interface AuthenticationFieldsProps {
    onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => void;
    setAlias: (value: string) => void;
    setPassword: (value: string) => void;
}

const AuthenticationFields: React.FC<AuthenticationFieldsProps> = ({
    onKeyDown,
    setAlias,
    setPassword
}) => {
      return (
        <>
        <div className="form-floating">
          <input
            type="text"
            className="form-control"
            size={50}
            id="aliasInput"
            placeholder="name@example.com"
            onKeyDown={onKeyDown}
            onChange={(event) => setAlias(event.target.value)}
          />
          <label htmlFor="aliasInput">Alias</label>
        </div>
        <div className="form-floating mb-3">
          <input
            type="password"
            className="form-control bottom"
            id="passwordInput"
            placeholder="Password"
            onKeyDown={onKeyDown}
            onChange={(event) => setPassword(event.target.value)}
          />
          <label htmlFor="passwordInput">Password</label>
        </div>
      </>
    )
}

export default AuthenticationFields;