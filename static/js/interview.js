const sendBtn = document.querySelector('.send-btn');
const runTestsBtn = document.querySelector('.run-tests-btn');
const messageInput = document.querySelector('.chat-input');
const languageSelect = document.querySelector('.language-select');
const codeEditor = document.querySelector('.code-editor');
const timerDisplay = document.querySelector('.timer');

// Базовые шаблоны кода для разных языков
const languageTemplates = {
    'python': `def solve():
    # Ваше решение здесь
    pass

# Пример вызова:
# print(solve())
`,
    'cpp': `class Solution {
public:
    // Ваше решение здесь
    void solve() {
        
    }
};
// int main() {
//     Solution s;
//     s.solve();
//     return 0;
// }
`,
    'java': `class Solution {
    // Ваше решение здесь
    public void solve() {
        
    }
}
// public class Main {
//     public static void main(String[] args) {
//         Solution s = new Solution();
//         s.solve();
//     }
// }
`,
    'go': `package main

import "fmt"

func solve() {
    // Ваше решение здесь
}

// func main() {
//     solve()
// }
`,
};

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    // Устанавливаем начальный шаблон и запускаем таймер
    codeEditor.value = languageTemplates[languageSelect.value];
    startTimer(45 * 60); // 45 минут в секундах
});


// Обработчик изменения языка
languageSelect.addEventListener('change', (e) => {
    const selectedLang = e.target.value;
    // Устанавливаем соответствующий шаблон
    codeEditor.value = languageTemplates[selectedLang] || '// Выберите язык...';
});


// Обработчики событий, которые были в исходном коде
sendBtn.addEventListener('click', sendMessage);
runTestsBtn.addEventListener('click', runTests);
messageInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});


/**
 * Запускает обратный отсчет таймера
 * @param {number} durationInSeconds - Продолжительность в секундах
 */
function startTimer(durationInSeconds) {
    let timer = durationInSeconds;
    let minutes, seconds;

    const interval = setInterval(() => {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        timerDisplay.textContent = minutes + ":" + seconds;

        if (--timer < 0) {
            clearInterval(interval);
            timerDisplay.textContent = "00:00";
            alert("Время собеседования вышло!");
            // Вы можете добавить здесь вызов endInterview() или другой логики
        }
    }, 1000);
}


function sendMessage() {
    const input = document.querySelector('.chat-input');
    const message = input.value.trim();
    
    if (!message) {
        return;
    }
    
    // 1. Сначала вызываем reCAPTCHA API, чтобы получить токен
    grecaptcha.ready(function() {
        // !!! ЗАМЕНИТЬ НА ВАШ ПУБЛИЧНЫЙ КЛЮЧ !!!
        const SITE_KEY_JS = 'ВАШ_ПУБЛИЧНЫЙ_КЛЮЧ_RECAPTCHA'; 

        grecaptcha.execute(SITE_KEY_JS, {action: 'submit'}).then(function(token) {
            // 2. Получив токен, отправляем его вместе с сообщением на наш сервер
            sendVerificationRequest(message, token);
        });
    });
}

/**
 * Отправляет токен и сообщение на бэкенд для верификации и получения ответа AI.
 * @param {string} message - Сообщение пользователя.
 * @param {string} token - Токен reCAPTCHA.
 */
function sendVerificationRequest(message, token) {
    const FORM_URL = '/verify'; // Маршрут в app.py
    const messageInput = document.querySelector('.chat-input');

    // Показываем сообщение пользователя сразу, пока ждем ответа
    addMessage(message, 'user');
    messageInput.value = ''; 
    
    const formData = new FormData();
    formData.append('message', message);
    formData.append('g-recaptcha-response', token); // Главное: токен reCAPTCHA

    fetch(FORM_URL, {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Верификация успешна, добавляем ответ AI
            const aiResponse = data.ai_response || 'Получен ответ от AI.';
            setTimeout(() => {
                addMessage(aiResponse, 'ai');
            }, 500);
            
        } else {
            // Верификация не пройдена
            setTimeout(() => {
                addMessage(`❌ Ошибка верификации reCAPTCHA: ${data.message}`, 'ai');
            }, 500);
            console.error('Ошибка верификации reCAPTCHA:', data);
        }
    })
    .catch(error => {
        // Ошибка сети
        setTimeout(() => {
            addMessage('Произошла ошибка сети. Не удалось связаться с сервером.', 'ai');
        }, 500);
        console.error('Ошибка Fetch:', error);
    });
}

function addMessage(text, sender) {
    const messagesContainer = document.querySelector('.chat-messages');
    const messageElement = document.createElement('div');
    messageElement.className = `message message-${sender}`;
    messageElement.textContent = text;
    messagesContainer.appendChild(messageElement);
    // Прокрутка вниз
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function runTests() {
    const consoleContent = document.querySelector('.console-content');
    consoleContent.innerHTML = '> Тесты запущены...\n> ✓ Тест 1 пройден\n> ✓ Тест 2 пройден\n> ✗ Тест 3 не пройден';
}

function endInterview() {
    if (confirm('Завершить собеседование?')) {
        // Замените на реальный URL
        window.location.href = 'results'; 
    }
}