const partials = [
    { id: 'header-root', path: 'partials/header.html' },
    { id: 'servicos-root', path: 'partials/servicos.html' },
    { id: 'operacao-fgi-root', path: 'partials/operacao-fgi.html' },
    { id: 'caracteristicas-fgi-root', path: 'partials/caracteristicas-fgi.html' },
    { id: 'operacoes-imoveis-root', path: 'partials/operacoes-imoveis.html' },
    { id: 'sobre-root', path: 'partials/sobre.html' },
    { id: 'footer-root', path: 'partials/footer.html' },
    { id: 'modal-root', path: 'partials/modal.html' }
];

const loadPartial = async ({ id, path }) => {
    const container = document.getElementById(id);
    if (!container) return;

    try {
        const response = await fetch(path);
        if (!response.ok) throw new Error(`Erro ao carregar ${path}`);
        container.innerHTML = await response.text();
    } catch (error) {
        console.error(error);
    }
};

const formatPhone = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 10) {
        const part1 = digits.slice(0, 2);
        const part2 = digits.slice(2, 6);
        const part3 = digits.slice(6, 10);
        return `${part1 ? '(' + part1 + ') ' : ''}${part2}${part3 ? '-' + part3 : ''}`.trim();
    }
    const part1 = digits.slice(0, 2);
    const part2 = digits.slice(2, 3);
    const part3 = digits.slice(3, 7);
    const part4 = digits.slice(7, 11);
    return `(${part1}) ${part2} ${part3}-${part4}`.trim();
};

const initModal = () => {
    const openModalButtons = document.querySelectorAll('[data-open-modal]');
    const closeModalButton = document.getElementById('close-modal');
    const infoModal = document.getElementById('info-modal');
    const phoneInput = document.getElementById('phone-input');

    if (!infoModal) return;

    openModalButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
            infoModal.classList.remove('hidden');
            infoModal.classList.add('flex');
            document.body.classList.add('no-scroll');
            document.body.style.paddingRight = scrollbarWidth > 0 ? `${scrollbarWidth}px` : '';
        });
    });

    closeModalButton?.addEventListener('click', () => {
        infoModal.classList.add('hidden');
        infoModal.classList.remove('flex');
        document.body.classList.remove('no-scroll');
        document.body.style.paddingRight = '';
    });

    phoneInput?.addEventListener('input', (event) => {
        event.target.value = formatPhone(event.target.value);
    });
};

const init = async () => {
    await Promise.all(partials.map(loadPartial));
    initModal();
};

init();
