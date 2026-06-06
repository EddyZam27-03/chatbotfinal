from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import requests

def home_page(request):
    return render(request, 'pages/index.html')

def chat_page(request):
    return render(request, 'pages/chatbot.html')

@csrf_exempt
def chat_api(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            user_message = data.get("message", "")

            # INSTRUCCIÓN MAESTRA: Aquí definimos que use tablas
            system_prompt = (
                "Eres el Asistente Virtual de la carrera de Administración en la ULEAM, Extensión El Carmen. "
                "Tu objetivo es ayudar a estudiantes con requisitos, malla curricular y trámites. "
                "IMPORTANTE: Si la respuesta contiene datos comparativos, materias o pasos, "
                "utiliza TABLAS de Markdown o LISTAS con viñetas. Sé profesional y conciso."
            )

            response = requests.post(
                "http://127.0.0.1:11434/api/chat",
                json={
                    "model": "llama3:8b",
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_message}
                    ]
                },
                stream=True
            )

            bot_reply = ""
            for line in response.iter_lines():
                if line:
                    chunk = json.loads(line)
                    if "message" in chunk and "content" in chunk["message"]:
                        bot_reply += chunk["message"]["content"]

        except Exception as e:
            bot_reply = f"Error: {str(e)}"

        return JsonResponse({"reply": bot_reply})

    return JsonResponse({"reply": "Inválido"}, status=400)
