from backend.auth import hash_password
from backend.models import User
from backend.database import SessionLocal

db = SessionLocal()
admin = User(
    email="admin@example.com",
    password_hash=hash_password("admin123"),
    name="Admin User"
)
db.add(admin)
db.commit()
print(f"Admin created: {admin.email}")