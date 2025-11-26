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
    if (message) {
        addMessage(message, 'user');
        input.value = '';

        // Заглушка ответа AI
        setTimeout(() => {
            addMessage('Спасибо за ваш ответ! Продолжайте работу над задачей.', 'ai');
        }, 500);
    }
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