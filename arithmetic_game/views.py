# File: `arithmetic_game/views.py`
from django.shortcuts import render
from .utils import generate_question

def index(request):
    return render(request, 'arithmetic_game/index.html')

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