# File: `arithmetic_game/views.py`
from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .utils import generate_question
import random

def index(request):
    return render(request, 'arithmetic_game/index.html')

def settings(request):
    mode = request.GET.get('mode')
    if mode == 'math':
        # weiterleiten zur math-Settings-Seite
        return render(request, 'arithmetic_game/math_settings.html')
    if mode == 'pyramid':
        # weiterleiten zur pyramid-Settings-Seite
        return render(request, 'arithmetic_game/pyramid_settings.html')
    # falls kein oder ungültiger mode
    return redirect('arithmetic_game:index')

def game(request):
    if request.method != 'POST':
        return render(request, 'arithmetic_game/index.html')

    op_level = int(request.POST.get('operation', 1))
    range_level = int(request.POST.get('range', 1))
    question, answer = generate_question(op_level, range_level)
    return render(
        request,
        'arithmetic_game/game.html',
        {'question': question, 'answer': answer},
    )

def pyramid_game(request):
    # Aufruf ohne POST leitet zurück auf die Settings-Seite
    if request.method != 'POST':
        return redirect('arithmetic_game:settings')

    # Ausgewählte Anzahl Ebenen aus dem Formular
    levels = int(request.POST.get('levels', 3))

    # 1) Ganz unten eine zufällige unterste Reihe erzeugen
    rows = [[random.randint(0, 10) for _ in range(levels)]]

    # 2) Pyramide aufbauen: jeweils die Summe zweier benachbarter Zahlen
    for n in range(levels - 1, 0, -1):
        prev = rows[-1]
        row = [prev[i] + prev[i+1] for i in range(len(prev) - 1)]
        rows.append(row)

    # 3) Umkehren, damit index 0 die Spitze ist
    pyramid = rows[::-1]
    request.session['pyramid_data'] = pyramid

    # 4) Rendern des Templates mit der fertigen Pyramiden-Datenstruktur
    return render(request,
                  'arithmetic_game/pyramid.html',
                  {'pyramid': pyramid, 'levels': levels})

@csrf_exempt
def validate_pyramid(request):
    """
    Erwartet POST mit allen user-{row}-{col}: value
    Gibt JSON zurück mit:
      - correct: Anzahl korrekte Felder
      - total: Gesamtanzahl zu prüfender Felder
      - correctness: Liste von [row, col, is_correct]
    """
    if request.method != 'POST':
        return JsonResponse({'error': 'Invalid request'}, status=400)

    # levels und generierte Pyramide aus Session oder rekalkulieren:
    # Wir speichern bei pyramid_game die komplette Pyramide in session:
    pyramid = request.session.get('pyramid_data')
    if not pyramid:
        return JsonResponse({'error': 'No pyramid in session'}, status=400)

    # Alle Zellen außer oberster und unterster Ebene prüfen
    results = []
    correct, total = is_valid_pyramid(pyramid)

    return JsonResponse({
        'correct': correct,
        'total': total,
        'results': results,
    })

def is_valid_pyramid(pyramid):
    """
    Prüft die Pyramide und gibt zurück, wie viele Einträge korrekt sind und wie viele insgesamt geprüft wurden.
    """
    correct = 0
    total = 0
    for r in range(len(pyramid) - 1):
        for c in range(len(pyramid[r])):
            total += 1
            if pyramid[r][c] == pyramid[r+1][c] + pyramid[r+1][c+1]:
                correct += 1
    return correct, total