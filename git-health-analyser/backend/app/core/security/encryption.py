from cryptography.fernet import Fernet

from app.config import settings

# Generate a key with: Fernet.generate_key()
_fernet = Fernet(settings.encryption_key.encode() if len(settings.encryption_key) == 44 else Fernet.generate_key())


def encrypt_token(token: str) -> str:
    return _fernet.encrypt(token.encode()).decode()


def decrypt_token(encrypted: str) -> str:
    return _fernet.decrypt(encrypted.encode()).decode()
