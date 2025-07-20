class ConflictError(Exception):
    def __init__(self, message="Conflict with existing resource."):
        self.message = message
        super().__init__(self.message)


class UserAlreadyExistsError(ConflictError):
    def __init__(self, message="User with this username or email already exists."):
        super().__init__(message)


class EmailAlreadyRegisteredError(UserAlreadyExistsError):
    def __init__(self, message="Email is already registered."):
        super()__init__(message)


class UsernameAlreadyTakenError(UserAlreadyExistsError):
    def __init__(self, message="Username is already taken."):
        super().__init__(message)


class UserNotFoundError(Exception):
    def __init__(self, message="User not found."):
        self.message = message
        super().__init__(self.message)


class InvalidCredentialsError(Exception):
    def __init__(self, message="Invalid username/password."):
        self.message = message
        super().__init__(self.message)
