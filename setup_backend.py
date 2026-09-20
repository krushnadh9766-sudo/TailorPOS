import os

dirs = [
    "backend",
    "backend/app",
    "backend/app/models",
    "backend/app/schemas",
    "backend/app/routers",
    "backend/app/services",
    "backend/app/dependencies",
    "backend/app/utils",
]

for d in dirs:
    os.makedirs(d, exist_ok=True)

with open("backend/.env.example", "w") as f:
    f.write("""DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=tailorpos
JWT_SECRET=change_this_secret
JWT_EXPIRE_MINUTES=1440
PORT=8000
""")

with open("backend/requirements.txt", "w") as f:
    f.write("""fastapi
uvicorn
sqlalchemy
pymysql
pydantic
python-dotenv
python-jose[cryptography]
passlib[bcrypt]
cors
""")

with open("backend/app/__init__.py", "w") as f: pass
with open("backend/app/models/__init__.py", "w") as f: pass
with open("backend/app/schemas/__init__.py", "w") as f: pass
with open("backend/app/routers/__init__.py", "w") as f: pass
with open("backend/app/services/__init__.py", "w") as f: pass

print("Directories and base files created.")

