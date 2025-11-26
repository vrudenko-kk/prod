import requests
import json

# 1. Замените <ВАШ_ТОКЕН> на ваш фактический токен
YOUR_TOKEN = "sk-gqlpOmmxNrBvLyv766GXYg"

# 2. Целевой URL API
URL = "https://llm.t1v.scibox.tech/v1/chat/completions"

# 3. Заголовки (Headers)
HEADERS = {
    "Authorization": f"Bearer {YOUR_TOKEN}",
    "Content-Type": "application/json"
}

# 4. Тело запроса (Payload)
# Оно точно соответствует содержимому блока -d в вашем curl-запросе
PAYLOAD = {
    "model": "qwen3-coder-30b-a3b-instruct-fp8",
    "messages": [
        {"role": "system", "content": "Ты помощник, который пишет и объясняет код"},
        {"role": "user", "content": "Напиши функцию на Python, которая проверяет палиндром"}
    ],
    "temperature": 0.2,
    "top_p": 0.8,
    "max_tokens": 400
}

# 5. Отправка запроса
try:
    response = requests.post(URL, headers=HEADERS, data=json.dumps(PAYLOAD))

    # 6. Проверка статуса ответа
    response.raise_for_status() # Вызывает исключение для кодов ошибок (4xx или 5xx)
    response_data = response.json()
    try:
        generated_text = response_data['choices'][0]['message']['content']
        print(generated_text)
    except (KeyError, IndexError):
        print("Не удалось извлечь сгенерированный текст. Полный JSON-ответ:")
        print(json.dumps(response_data, indent=2, ensure_ascii=False))


except requests.exceptions.HTTPError as errh:
    print(f"Ошибка HTTP: {errh}")
except requests.exceptions.ConnectionError as errc:
    print(f"Ошибка подключения: {errc}")
except requests.exceptions.Timeout as errt:
    print(f"Превышено время ожидания: {errt}")
except requests.exceptions.RequestException as err:
    print(f"Произошла непредвиденная ошибка: {err}")