# Verwende Python 3.12 slim als Basis
FROM python:3.12-slim

# Verhindert Bytecode-Dateien und sorgt für konsistente Logs
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# Arbeitsverzeichnis im Container
WORKDIR /app

# System-Packages (optional, nur falls du bspw. Pillow, psycopg2 o. Ä. nutzt)
# RUN apt-get update \
#     && apt-get install -y --no-install-recommends gcc libpq-dev \
#     && rm -rf /var/lib/apt/lists/*

# Kopiere und installiere Python-Dependencies
COPY requirements.txt .
RUN pip install --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# Kopiere den gesamten Projekt-Code
COPY . .

# (Optional) Wenn du statische Dateien sammelst
# RUN python manage.py collectstatic --noinput

# Öffne Port 8000
EXPOSE 8000

# Starte Migrationen und den Dev-Server
CMD ["sh", "-c", "python manage.py migrate --noinput && python manage.py runserver 0.0.0.0:8000"]