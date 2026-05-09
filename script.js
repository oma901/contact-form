const form = document.getElementById('contact-form');
const button = document.getElementById('send-button');
const buttonText = button.querySelector('.button-text');
const result = document.getElementById('result');

function clearMessages() {
    document.getElementById('name-error').textContent = '';
    document.getElementById('email-error').textContent = '';
    document.getElementById('message-error').textContent = '';
    result.textContent = '';
    result.className = 'result';
}

function showErrors(errors) {
    if (errors.name) {
        document.getElementById('name-error').textContent = errors.name;
    }

    if (errors.email) {
        document.getElementById('email-error').textContent = errors.email;
    }

    if (errors.message) {
        document.getElementById('message-error').textContent = errors.message;
    }
}

function validateForm(data) {
    const errors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (data.name.trim() === '') {
        errors.name = 'Введите имя';
    }

    if (data.email.trim() === '') {
        errors.email = 'Введите email';
    } else if (!emailPattern.test(data.email)) {
        errors.email = 'Некорректный email';
    }

    if (data.message.trim() === '') {
        errors.message = 'Введите сообщение';
    }

    return errors;
}

function wait(ms) {
    return new Promise(function (resolve) {
        setTimeout(resolve, ms);
    });
}

function setLoading(isLoading) {
    button.disabled = isLoading;
    button.classList.toggle('loading', isLoading);
    buttonText.textContent = isLoading ? 'Отправка...' : 'Отправить';
}

form.addEventListener('submit', async function (event) {
    event.preventDefault();
    clearMessages();

    const formData = new FormData(form);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message')
    };

    const errors = validateForm(data);

    if (Object.keys(errors).length > 0) {
        showErrors(errors);
        return;
    }

    setLoading(true);
    const startTime = Date.now();

    try {
        const response = await fetch('send.php', {
            method: 'POST',
            body: formData
        });

        const answer = await response.json();

        if (answer.status === 'success') {
            result.textContent = answer.message;
            result.className = 'result success';
            form.reset();
        } else {
            showErrors(answer.errors || {});
            result.textContent = 'Исправьте ошибки в форме';
            result.className = 'result error';
        }
    } catch (error) {
        result.textContent = 'Ошибка отправки. Попробуйте позже';
        result.className = 'result error';
    } finally {
        const loadingTime = Date.now() - startTime;

        if (loadingTime < 600) {
            await wait(600 - loadingTime);
        }

        setLoading(false);
    }
});
