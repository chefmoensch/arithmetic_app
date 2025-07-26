# Arithmetic App

**Zweck**

Diese Applikation dient dem Lernzweck und ist inspiriert vom Mathematikunterricht der Primarstufe. Sie wurde für meinen ältesten Sohn geschrieben und bietet zwei Spielmodi:

1. **Kopfrechenspiel**: Zufallsgenerierte Aufgaben zu Addition, Subtraktion, Multiplikation und Division.
2. **Zahlenmauer**: Pyramidenrätsel, bei denen jede Zelle die Summe der beiden Zellen darunter ist.

Beide Modi sind kindgerecht gestaltet, mit fröhlichen Farben, Animationen und einem Belohnungs-Overlay (Gummibärchen) nach jeweils 10 korrekten Antworten.

---

## Anforderungen

* Python 3.12
* Django 5.x

Alle Python-Abhängigkeiten sind in der Datei `requirements.txt` aufgeführt.

---

## Projekt in PyCharm einrichten und starten

1. **Repository klonen**

   ```bash
   git clone git@github.com:chefmoensch/arithmetic_app.git
   cd arithmetic_app
   ```

2. **Virtuelle Umgebung anlegen**

   * Stelle sicher, dass Python 3.12 installiert ist:

     ```bash
     python3.12 --version
     ```

   * Erstelle eine venv im Projektroot:

     ```bash
     python3.12 -m venv .venv
     ```

3. **In PyCharm importieren**

   * Öffne PyCharm und wähle **Open** → `arithmetic_app`-Ordner.
   * Unter **Preferences → Project → Python Interpreter** wähle `Existing environment` und navigiere zum soeben erstellten `.venv/bin/python`.

4. **Abhängigkeiten installieren**

   Öffne das Terminal in PyCharm oder ein externes Terminal und aktiviere die venv:

   ```bash
   source .venv/bin/activate    # macOS/Linux
   .\.venv\Scripts\activate   # Windows
   ```

   Dann installiere:

   ```bash
   pip install --upgrade pip
   pip install -r requirements.txt
   ```

5. **Datenbank-Migrationen**

   ```bash
   python manage.py migrate
   ```

6. **Entwicklungsserver starten**

   ```bash
   python manage.py runserver
   ```

   Rufe im Browser `http://127.0.0.1:8000/` auf und wähle einen der Spielmodi.

---

Viel Spaß beim Lernen und Spielen! 😊

---

## Docker-Container erstellen und starten

1. **Docker-Image bauen**

   ```bash
   docker build -t arithmetic_app .
   ```
2. **Container starten**

   ```bash
   docker run -p 8000:8000 arithmetic_app
   ```
3. **Zugriff im Browser**
   Öffne `http://localhost:8000/` im Browser, um das Spiel zu nutzen.

> **Hinweis zu `ALLOWED_HOSTS`**
> In `settings.py` kann es nötig sein, die Einstellung `ALLOWED_HOSTS` anzupassen,
> wenn du den Server über eine andere Host-Adresse aufrufst (z.B. in Docker oder im Netzwerk):
>
> ```python
> ALLOWED_HOSTS = ['localhost', '127.0.0.1', '0.0.0.0']
> ```
>
> Passe die Liste entsprechend deiner Umgebung an, damit Django eingehende Requests akzeptiert.
