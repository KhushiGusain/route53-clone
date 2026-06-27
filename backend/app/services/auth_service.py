MOCK_USERNAME = "admin"
MOCK_PASSWORD = "admin123"


def authenticate_user(username: str, password: str) -> None:
    if username == MOCK_USERNAME and password == MOCK_PASSWORD:
        return True
    return False
